'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sword, Shield, KeyRound, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Credenciales inválidas');
        return;
      }

      if (data.user?.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/character-select');
      }
    } catch (err) {
      setError('Error al conectar con los servidores de Aethoria');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setUsername('Fredy');
    setPassword('Admin_JL2026');
    setError(null);
  };

  const fillPlayerCredentials = () => {
    setUsername('ViajeroValiente');
    setPassword('Aethoria2026!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-[#0a0d14] to-[#05060a] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md bg-game-panel border-2 border-game-border-gold rounded-2xl p-6 sm:p-8 shadow-rpg flex flex-col gap-6 animate-scale-up">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 border border-game-gold flex items-center justify-center text-black font-bold shadow-gold-glow">
            <Sword className="w-6 h-6" />
          </div>
          <h1 className="font-fantasy font-bold text-xl sm:text-2xl text-game-gold tracking-wide">
            Iniciar Aventura
          </h1>
          <p className="text-xs text-gray-400">Ingresa a Aethoria y recupera los fragmentos del conocimiento</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-950/70 border border-red-500/80 rounded-lg p-3 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-game-gold" />
              Nombre de Usuario
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. Fredy o TuUsuario"
              className="bg-black/50 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-game-gold transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-game-gold" />
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-black/50 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-game-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 bg-gradient-to-r from-game-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-fantasy font-bold text-sm rounded-xl shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Cruzando el Portal...' : 'Entrar a Aethoria'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Fill Buttons for Convenient Testing */}
        <div className="pt-2 border-t border-gray-800 flex flex-col gap-2">
          <span className="text-[11px] text-gray-500 text-center uppercase tracking-wider font-semibold">
            Acceso Rápido de Prueba:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="p-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/50 text-amber-200 transition-colors flex items-center justify-center gap-1.5 font-bold"
            >
              <Shield className="w-3.5 h-3.5 text-game-gold" />
              Admin (Fredy)
            </button>
            <button
              type="button"
              onClick={fillPlayerCredentials}
              className="p-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/60 border border-blue-600/50 text-blue-200 transition-colors flex items-center justify-center gap-1.5 font-bold"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Demo Player
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center text-xs text-gray-400">
          ¿Aún no tienes un héroe?{' '}
          <Link href="/register" className="text-game-gold font-bold hover:underline">
            Crea tu cuenta aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
