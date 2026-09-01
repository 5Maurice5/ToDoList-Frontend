import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/auth.service";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailTrim = email.trim();

    if (!emailTrim || !password.trim()) {
      setError("El correo y la contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await login({
        email: emailTrim,
        password,
      });

      localStorage.setItem("token", result.token);

      navigate("/tasks", { replace: true });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setError(error.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Todo App</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Inicia sesión para gestionar tus tareas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}

          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>

            <Input
              id="email"
              type="email"
              placeholder="hola@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* PASSWORD */}

          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>

            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              autoComplete="current-password"
            />
          </div>

          {/* ERROR */}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* BUTTON */}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
