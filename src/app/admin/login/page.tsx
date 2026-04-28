"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-ceii-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-ceii-primary rounded-2xl p-8 shadow-xl">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo-gceii-negativo-transparente.png"
              alt="Logo CEII"
              width={140}
              height={48}
              className="h-12 w-auto"
            />
          </div>

          <h1 className="text-white text-xl font-bold text-center mb-6">
            Panel de Administración
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-blue-200 text-sm mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-ceii-accent text-sm"
                placeholder="admin@ceii.edu"
              />
            </div>
            <div>
              <label className="text-blue-200 text-sm mb-1.5 block">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-ceii-accent text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-ceii-accent text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          ←{" "}
          <a href="/" className="hover:text-ceii-accent transition">
            Ver página pública
          </a>
        </p>
      </div>
    </div>
  );
}
