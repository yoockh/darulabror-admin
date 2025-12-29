import { loginAction } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  const from = searchParams?.from;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Masuk ke admin panel Darul Abror.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (fd) => {
              "use server";
              await loginAction(fd);
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--da-text-primary)]">
                Email
              </label>
              <Input name="email" type="email" placeholder="admin@domain.com" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--da-text-primary)]">
                Password
              </label>
              <Input name="password" type="password" placeholder="••••••••" required />
            </div>
            {from ? (
              <p className="text-xs text-[var(--da-text-secondary)]">
                Setelah login, akan diarahkan ke: <span className="font-medium">{from}</span>
              </p>
            ) : null}
            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
