'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Sword, Plus, ArrowRight, User, LogOut, Award, Sparkles } from 'lucide-react';
import { CharacterData } from '@/lib/game/types';

export default function CharacterSelectPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, charsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/character'),
        ]);

        if (!meRes.ok) {
          router.push('/login');
          return;
        }

        const meData = await meRes.json();
        setUser(meData.user);

        if (charsRes.ok) {
          const charsData = await charsRes.json();
          setCharacters(charsData.characters || []);
          if (charsData.characters && charsData.characters.length > 0) {
            setSelectedCharId(charsData.characters[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading characters:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handlePlay = () => {
    if (!selectedCharId) return;
    router.push(`/game?characterId=${selectedCharId}`);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-game-gold">
        Consultando las crónicas de Aethoria...
      </div>
    );
  }

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col p-4 sm:p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-[#0a0d14] to-[#05060a] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex justify-between items-center py-4 border-b border-game-border-gold/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 border border-game-gold flex items-center justify-center text-black font-bold shadow-gold-glow">
            <Sword className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-fantasy font-bold text-base sm:text-lg text-game-gold">
              LA LEYENDA DEL CONOCIMIENTO
            </h1>
            <span className="text-xs text-gray-400">Selección de Héroe</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {user?.isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded bg-amber-950/60 border border-game-gold text-game-gold font-bold hover:bg-amber-900/60 transition-colors"
            >
              Panel Admin
            </Link>
          )}
          <span className="hidden sm:inline text-gray-400 font-semibold">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-game-panel-light hover:bg-game-border border border-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 py-8">
        {/* Left Column: Character List */}
        <div className="w-full md:w-80 flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tus Personajes</h2>
            <span className="text-xs text-game-gold font-bold">{characters.length} / 5</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto">
            {characters.map((char) => {
              const isSelected = char.id === selectedChar?.id;
              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharId(char.id)}
                  className={`text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-game-panel border-game-border-gold shadow-gold-glow scale-[1.02]'
                      : 'bg-game-panel/60 border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {/* Portrait Placeholder */}
                  <div
                    className="w-12 h-12 rounded-full border-2 border-game-border-gold flex items-center justify-center shrink-0 shadow"
                    style={{ backgroundColor: char.appearance?.outfitColor || '#3b82f6' }}
                  >
                    <User className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex flex-col truncate">
                    <span className="font-bold text-sm text-game-gold truncate">{char.name}</span>
                    <span className="text-xs text-gray-300 capitalize">
                      Nv. {char.level} {char.class}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize">{char.race}</span>
                  </div>
                </button>
              );
            })}

            {/* Create New Character Button */}
            <Link
              href="/character-create"
              className="p-3.5 rounded-xl border-2 border-dashed border-gray-700 hover:border-game-gold bg-black/40 hover:bg-game-panel/80 text-gray-400 hover:text-game-gold transition-all flex items-center justify-center gap-2 text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              Forjar Nuevo Personaje
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Preview & Play Button */}
        <div className="flex-1 bg-game-panel border-2 border-game-border-gold rounded-2xl p-6 sm:p-8 shadow-rpg flex flex-col justify-between">
          {selectedChar ? (
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="border-b border-game-border pb-4 flex justify-between items-start">
                <div>
                  <h2 className="font-fantasy font-bold text-2xl sm:text-3xl text-game-gold">
                    {selectedChar.name}
                  </h2>
                  <span className="text-xs text-gray-300 capitalize">
                    {selectedChar.race} &bull; {selectedChar.class} &bull; Nivel {selectedChar.level}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Territorio Actual:</span>
                  <span className="text-xs font-bold text-emerald-400">Valle de los Despertares</span>
                </div>
              </div>

              {/* Character Attributes Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-black/40 border border-gray-800 rounded-lg p-3">
                  <span className="text-[11px] text-gray-400 block">Fuerza</span>
                  <span className="text-base font-bold text-red-400">{selectedChar.attributes.strength}</span>
                </div>
                <div className="bg-black/40 border border-gray-800 rounded-lg p-3">
                  <span className="text-[11px] text-gray-400 block">Inteligencia</span>
                  <span className="text-base font-bold text-cyan-400">{selectedChar.attributes.intelligence}</span>
                </div>
                <div className="bg-black/40 border border-gray-800 rounded-lg p-3">
                  <span className="text-[11px] text-gray-400 block">Agilidad</span>
                  <span className="text-base font-bold text-emerald-400">{selectedChar.attributes.agility}</span>
                </div>
                <div className="bg-black/40 border border-gray-800 rounded-lg p-3">
                  <span className="text-[11px] text-gray-400 block">Resistencia</span>
                  <span className="text-base font-bold text-amber-400">{selectedChar.attributes.stamina}</span>
                </div>
                <div className="bg-black/40 border border-gray-800 rounded-lg p-3">
                  <span className="text-[11px] text-gray-400 block">Percepción</span>
                  <span className="text-base font-bold text-purple-400">{selectedChar.attributes.perception}</span>
                </div>
                <div className="bg-black/40 border border-gray-800 rounded-lg p-3">
                  <span className="text-[11px] text-gray-400 block">Sabiduría</span>
                  <span className="text-base font-bold text-blue-400">{selectedChar.attributes.wisdom}</span>
                </div>
              </div>

              {/* Status and Resources */}
              <div className="bg-black/40 border border-game-border rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <span className="text-[11px] text-gray-400 block">Salud Máxima:</span>
                  <span className="text-sm font-bold text-red-400">{selectedChar.maxHealth} HP</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block">Recurso de Combate:</span>
                  <span className="text-sm font-bold text-blue-400">{selectedChar.maxResource} Pts</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block">Fortuna:</span>
                  <span className="text-sm font-bold text-game-gold">{selectedChar.gold} Monedas de Oro</span>
                </div>
              </div>

              {/* Ready to Enter Notice */}
              <p className="text-xs text-gray-400 italic">
                Presiona el botón de abajo para cruzar el umbral y entrar al mundo 2D de Aethoria.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-16">
              <Sparkles className="w-12 h-12 text-game-gold animate-bounce" />
              <h3 className="font-fantasy text-xl font-bold text-game-gold">Aún no tienes un personaje</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Comienza tu leyenda seleccionando una raza, una clase y personalizando tu apariencia.
              </p>
              <Link
                href="/character-create"
                className="mt-2 px-6 py-2.5 bg-game-gold hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow transition-all"
              >
                Forjar Primer Personaje
              </Link>
            </div>
          )}

          {/* Action Footer */}
          {selectedChar && (
            <div className="pt-6 border-t border-game-border flex justify-end">
              <button
                onClick={handlePlay}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-game-gold via-amber-400 to-amber-500 text-black font-fantasy font-bold text-sm rounded-xl shadow-gold-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>JUGAR CON ESTE HÉROE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
