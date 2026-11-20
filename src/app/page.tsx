import React from 'react';
import Link from 'next/link';
import {
  Sword,
  Shield,
  BookOpen,
  Calculator,
  Zap,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#07090e] text-gray-100 flex flex-col overflow-hidden">
      {/* Background Ambience Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-[#0a0d14] to-[#05060a] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-purple-950/20 to-transparent pointer-events-none" />

      {/* Top Navbar */}
      <nav className="relative z-10 px-6 py-4 border-b border-game-border-gold/30 bg-black/40 backdrop-blur-md flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 border border-game-gold flex items-center justify-center text-black font-bold shadow-gold-glow">
            <Sword className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-fantasy font-bold text-base md:text-lg text-game-gold tracking-wider">
              LA LEYENDA DEL CONOCIMIENTO
            </span>
            <span className="hidden sm:block text-[10px] text-gray-400 font-sans tracking-wide uppercase">
              MMORPG Educativo 2D &bull; Saber 11 (ICFES)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-game-gold text-gray-300 hover:text-game-gold transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-game-panel-light hover:bg-game-border border border-game-border-gold/60 text-game-gold transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-game-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-gold-glow transition-all"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-5xl mx-auto">
        {/* Banner Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-game-border-gold/60 bg-amber-950/40 text-game-gold text-xs font-semibold mb-6 shadow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>El Conocimiento es Poder en el Universo de Aethoria</span>
        </div>

        {/* Cinematic Game Title */}
        <h1 className="font-fantasy text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-glow-gold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 mb-6 max-w-4xl">
          LA LEYENDA DEL CONOCIMIENTO
        </h1>

        <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-serif mb-8">
          Aethoria agoniza bajo el avance del <strong>Vacío</strong>, una sombra que distorsiona las leyes de la física,
          borra los recuerdos colectivos y corrompe la razón matemática. Como Viajero del Conocimiento, explora mazmorras,
          combate en tiempo real y restaura el mundo fortaleciendo tus competencias para las pruebas <strong>Saber 11 (ICFES)</strong>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <Link
            href="/character-select"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-game-gold via-amber-400 to-amber-500 text-black font-fantasy font-bold text-sm tracking-wide shadow-gold-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>ENTRAR A AETHORIA</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-game-panel/80 hover:bg-game-panel-light border border-game-border-gold text-game-gold font-fantasy font-semibold text-sm transition-all"
          >
            Cuenta de Jugador
          </Link>
        </div>

        {/* Three Great Forces (Educational Competencies) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
          {/* Force 1: La Memoria */}
          <div className="bg-gradient-to-b from-purple-950/40 to-game-panel border border-purple-500/40 rounded-xl p-5 shadow-rpg relative overflow-hidden group hover:border-purple-400 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-900/60 border border-purple-400 flex items-center justify-center text-purple-300 mb-3 shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-fantasy font-bold text-base text-purple-200 mb-1">La Memoria</h3>
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-2">
              Lectura Crítica
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-serif">
              Reconstruye acontecimientos históricos en ruinas sagradas, interroga NPCs para desarticular testimonios contradictorios e interpreta manuscritos antiguos.
            </p>
          </div>

          {/* Force 2: La Razón */}
          <div className="bg-gradient-to-b from-amber-950/40 to-game-panel border border-amber-500/40 rounded-xl p-5 shadow-rpg relative overflow-hidden group hover:border-amber-400 transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-900/60 border border-amber-400 flex items-center justify-center text-amber-300 mb-3 shadow">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-fantasy font-bold text-base text-amber-200 mb-1">La Razón</h3>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Matemáticas
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-serif">
              Restaura compuertas rúnicas calibrando proporciones, descifra patrones algebraicos en fortalezas subterráneas y optimiza rutas de navegación con coordenadas.
            </p>
          </div>

          {/* Force 3: La Energía */}
          <div className="bg-gradient-to-b from-cyan-950/40 to-game-panel border border-cyan-500/40 rounded-xl p-5 shadow-rpg relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="w-10 h-10 rounded-lg bg-cyan-900/60 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-3 shadow">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-fantasy font-bold text-base text-cyan-200 mb-1">La Energía</h3>
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Ciencias: Física
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-serif">
              Manipula balística y trayectorias parabólicas, equilibra sistemas de poleas y palancas rúnicas y comprende las leyes de conservación de energía en combate.
            </p>
          </div>
        </div>

        {/* Races & Classes Quick Highlight */}
        <div className="mt-16 w-full border-t border-gray-800/80 pt-12 flex flex-col items-center">
          <h2 className="font-fantasy text-xl sm:text-2xl font-bold text-game-gold mb-6">
            Razas y Clases de Aethoria
          </h2>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl text-xs font-semibold">
            {['Humanos de Aethoria', 'Elfos de Lunaria', 'Enanos de Forjaterra', 'Dracónidos', 'Sylvanos'].map((r) => (
              <span key={r} className="px-3 py-1.5 rounded-lg bg-game-panel border border-game-border text-gray-300">
                🛡️ {r}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl text-xs font-semibold mt-3">
            {['Guardián (Tanque)', 'Arcanista (Magia)', 'Explorador (Distancia)', 'Invocador (Apoyo)', 'Ingeniero Rúnico', 'Erudito (Soporte)'].map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-lg bg-game-panel-light border border-game-border-gold/50 text-game-gold">
                ⚔️ {c}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 bg-black/70 py-6 text-center text-xs text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} La Leyenda del Conocimiento &bull; Inspirado en los MMORPG clásicos con pedagogía Saber 11 (ICFES).
        </p>
        <p className="mt-1 text-[11px] text-gray-600">
          Desarrollado para Google Antigravity &bull; Arquitectura con Next.js, Phaser 3, Neon PostgreSQL y Ably.
        </p>
      </footer>
    </div>
  );
}
