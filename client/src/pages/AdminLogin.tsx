import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const login = trpc.dashboard.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      setLocation("/admin");
    },
    onError: () => setError("The email or password is incorrect."),
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    login.mutate({ email, password });
  };

  return (
    <main className="admin-login credential-login">
      <div className="admin-login-card glass-panel">
        <span className="brand-mark brand-monogram" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <p className="eyebrow">
          <span />OWNER ACCESS
        </p>
        <h1>Sign in to the owner workspace.</h1>
        <p>Enter your owner email and password to continue to the dashboard.</p>
        <form onSubmit={submit} className="credential-form">
          <label>
            <span>Email</span>
            <div>
              <Mail size={16} />
              <Input
                autoComplete="username"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
              />
            </div>
          </label>
          <label>
            <span>Password</span>
            <div>
              <LockKeyhole size={16} />
              <Input
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(value => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          {error ? <p className="login-error">{error}</p> : null}
          <Button
            className="admin-button"
            type="submit"
            disabled={login.isPending}
          >
            {login.isPending ? "Signing in…" : "Sign in securely"}
          </Button>
        </form>
        <a className="credential-back" href="/">
          Return to public portfolio
        </a>
      </div>
    </main>
  );
}
