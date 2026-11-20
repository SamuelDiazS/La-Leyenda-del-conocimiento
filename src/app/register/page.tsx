'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sword, Mail, KeyRound, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al forjar la cuenta');
        return;
      }

      router.push('/character-create');
    } catch (err) {
      setError('Error al conectar con los servidores de Aethoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-[#0a0d14] to-[#05060a] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md bg-game-panel border-2 border-game-border-gold rounded-2xl p-6 sm:p-8 shadow-rpg flex flex-col gap-6 animate-scale-up">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 border border-game-gold flex items-center justify-center text-black font-bold shadow-gold-glow">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-fantasy font-bold text-xl sm:text-2xl text-game-gold tracking-wide">
            Crear Cuenta de Viajero
          </h1>
          <p className="text-xs text-gray-400">Únete a la resistencia de Aethoria contra el Vacío</p>
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
              minLength={3}
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. Elrond99"
              className="bg-black/50 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-game-gold transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-game-gold" />
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.correo@ejemplo.com"
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="bg-black/50 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-game-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 bg-gradient-to-r from-game-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-fantasy font-bold text-sm rounded-xl shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Inscribiendo en las Crónicas...' : 'Forjar Personaje'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-800">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-game-gold font-bold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
