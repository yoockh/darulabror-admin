const { app, BrowserWindow } = require("electron");
const path = require("path");
const http = require("http");

function isDev() {
  return process.env.NODE_ENV !== "production";
}

async function findAvailablePort(startPort = 3030, maxTries = 25) {
  function canListen(port) {
    return new Promise((resolve) => {
      const srv = http.createServer();
      srv.once("error", () => resolve(false));
      srv.once("listening", () => srv.close(() => resolve(true)));
      srv.listen(port, "127.0.0.1");
    });
  }

  for (let i = 0; i < maxTries; i++) {
    const port = startPort + i;
    // eslint-disable-next-line no-await-in-loop
    if (await canListen(port)) return port;
  }
  throw new Error("No available port found for local server");
}

async function startNextServer({ port }) {
  const next = require("next");
  const projectDir = path.join(__dirname, "..");

  const nextApp = next({
    dev: isDev(),
    dir: projectDir,
    hostname: "127.0.0.1",
    port,
  });

  await nextApp.prepare();
  const handle = nextApp.getRequestHandler();

  const server = http.createServer((req, res) => handle(req, res));

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  return {
    server,
    port,
    close: async () => {
      await new Promise((resolve) => server.close(resolve));
      if (typeof nextApp.close === "function") {
        try {
          await nextApp.close();
        } catch {
          // ignore
        }
      }
    },
  };
}

function createMainWindow({ port }) {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#0d1117",
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  win.once("ready-to-show", () => win.show());

  const url = `http://127.0.0.1:${port}`;
  win.loadURL(url);

  if (isDev()) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  return win;
}

let nextServer = null;

async function boot() {
  if (process.platform === "win32") {
    app.setAppUserModelId("com.darultech.darulabroradmin");
  }

  await app.whenReady();

  const port = await findAvailablePort();
  nextServer = await startNextServer({ port });

  createMainWindow({ port: nextServer.port });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0 && nextServer) {
      createMainWindow({ port: nextServer.port });
    }
  });
}

app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    if (nextServer) {
      const s = nextServer;
      nextServer = null;
      await s.close();
    }
    app.quit();
  }
});

boot().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start desktop app", err);
  app.quit();
});
