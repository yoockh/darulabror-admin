const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const http = require("http");

let autoUpdater = null;

function getAutoUpdater() {
  if (!app.isPackaged) return null;
  if (autoUpdater) return autoUpdater;

  // Lazy-load so dev mode doesn't require updater wiring.
  // eslint-disable-next-line global-require
  const { autoUpdater: au } = require("electron-updater");
  autoUpdater = au;
  return autoUpdater;
}

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
  const iconPath = path.join(
    __dirname,
    "assets",
    process.platform === "win32" ? "icon.ico" : "icon.png",
  );

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#0d1117",
    show: false,
    icon: iconPath,
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

function setupAutoUpdates(win) {
  const au = getAutoUpdater();
  if (!au) return;

  au.autoDownload = false;
  au.autoInstallOnAppQuit = true;

  au.on("error", async (err) => {
    // eslint-disable-next-line no-console
    console.error("Auto update error", err);
  });

  au.on("update-available", async () => {
    const { response } = await dialog.showMessageBox(win, {
      type: "info",
      buttons: ["Download", "Nanti"],
      defaultId: 0,
      cancelId: 1,
      title: "Update tersedia",
      message: "Versi terbaru tersedia. Download sekarang?",
    });

    if (response === 0) {
      try {
        await au.downloadUpdate();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to download update", err);
      }
    }
  });

  au.on("update-not-available", async () => {
    // silent
  });

  au.on("update-downloaded", async () => {
    const { response } = await dialog.showMessageBox(win, {
      type: "question",
      buttons: ["Restart sekarang", "Nanti"],
      defaultId: 0,
      cancelId: 1,
      title: "Update siap",
      message: "Update sudah selesai di-download. Restart untuk menerapkan?",
    });

    if (response === 0) {
      au.quitAndInstall();
    }
  });

  // Check after the window is ready to avoid dialogs before UI exists.
  win.webContents.once("did-finish-load", () => {
    au.checkForUpdates().catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Failed to check updates", err);
    });
  });
}

let nextServer = null;

async function boot() {
  if (process.platform === "win32") {
    app.setAppUserModelId("com.darultech.darulabroradmin");
  }

  // Some Linux environments log VA-API driver errors (libva) on startup.
  // Disabling HW acceleration avoids the noisy error and improves compatibility.
  if (process.platform === "linux") {
    app.disableHardwareAcceleration();
  }

  await app.whenReady();

  const port = await findAvailablePort();
  nextServer = await startNextServer({ port });

  const win = createMainWindow({ port: nextServer.port });
  setupAutoUpdates(win);

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
