'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Sparkles,
  Sword,
  Wand,
  Crosshair,
  Flame,
  Wrench,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { GAME_RACES, GAME_CLASSES } from '@/lib/game/constants';
import { CharacterRace, CharacterClass } from '@/lib/game/types';
import { gameAudio } from '@/lib/game/audio';

export default function CharacterCreatePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [name, setName] = useState('');
  const [selectedRace, setSelectedRace] = useState<CharacterRace>('human');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('guardian');
  const [gender, setGender] = useState<'male' | 'female' | 'unisex'>('unisex');
  const [skinTone, setSkinTone] = useState('#f8d5b8');
  const [hairColor, setHairColor] = useState('#4a2c11');
  const [hairStyle, setHairStyle] = useState('short_warrior');
  const [eyeColor, setEyeColor] = useState('#2563eb');
  const [outfitColor, setOutfitColor] = useState('#3b82f6');
  const [capeColor, setCapeColor] = useState('#991b1b');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Live Canvas 2D Character Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render Scale (e.g. 128x128 pixel art representation)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 10;

    // 1. Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 42, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Cape
    ctx.fillStyle = capeColor;
    ctx.beginPath();
    ctx.moveTo(centerX - 24, centerY - 8);
    ctx.lineTo(centerX + 24, centerY - 8);
    ctx.lineTo(centerX + 32, centerY + 38);
    ctx.lineTo(centerX - 32, centerY + 38);
    ctx.closePath();
    ctx.fill();

    // 3. Body / Armor
    ctx.fillStyle = outfitColor;
    ctx.fillRect(centerX - 18, centerY - 10, 36, 40);

    // Armor Details
    ctx.fillStyle = '#c89b3c';
    ctx.fillRect(centerX - 16, centerY - 6, 32, 4);
    ctx.fillRect(centerX - 4, centerY - 6, 8, 30);

    // 4. Head
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 24, 18, 0, Math.PI * 2);
    ctx.fill();

    // 5. Eyes
    ctx.fillStyle = eyeColor;
    ctx.fillRect(centerX - 8, centerY - 25, 4, 4);
    ctx.fillRect(centerX + 4, centerY - 25, 4, 4);

    // 6. Hair
    ctx.fillStyle = hairColor;
    if (hairStyle === 'short_warrior') {
      ctx.fillRect(centerX - 19, centerY - 42, 38, 16);
      ctx.fillRect(centerX - 21, centerY - 32, 6, 12);
      ctx.fillRect(centerX + 15, centerY - 32, 6, 12);
    } else if (hairStyle === 'long_elven') {
      ctx.fillRect(centerX - 20, centerY - 42, 40, 18);
      ctx.fillRect(centerX - 22, centerY - 24, 8, 32);
      ctx.fillRect(centerX + 14, centerY - 24, 8, 32);
    } else {
      ctx.fillRect(centerX - 18, centerY - 40, 36, 14);
      // Top knot
      ctx.fillRect(centerX - 6, centerY - 48, 12, 10);
    }

    // 7. Weapon in Hand based on Class
    if (selectedClass === 'guardian') {
      // Shield
      ctx.fillStyle = '#b45309';
      ctx.fillRect(centerX - 36, centerY - 4, 14, 30);
      ctx.fillStyle = '#c89b3c';
      ctx.strokeRect(centerX - 36, centerY - 4, 14, 30);
      // Sword
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(centerX + 26, centerY - 20, 6, 42);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(centerX + 22, centerY + 2, 14, 4);
    } else if (selectedClass === 'arcanist' || selectedClass === 'scholar') {
      // Magic Staff
      ctx.fillStyle = '#78350f';
      ctx.fillRect(centerX + 26, centerY - 32, 5, 68);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(centerX + 28, centerY - 34, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedClass === 'ranger') {
      // Bow
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX + 28, centerY + 6, 22, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    } else {
      // Wrench / Device
      ctx.fillStyle = '#475569';
      ctx.fillRect(centerX + 26, centerY - 8, 8, 28);
    }
  }, [gender, skinTone, hairColor, hairStyle, eyeColor, outfitColor, capeColor, selectedClass, selectedRace]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.length < 2) {
      setError('El nombre del personaje debe tener al menos 2 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          race: selectedRace,
          class: selectedClass,
          appearance: {
            gender,
            skinTone,
            hairStyle,
            hairColor,
            eyeColor,
            outfitColor,
            capeColor,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al forjar personaje');
        return;
      }

      gameAudio.playLevelUp();
      router.push(`/game?characterId=${data.character.id}`);
    } catch (err) {
      setError('Error conectando con los servidores');
    } finally {
      setLoading(false);
    }
  };

  const currentRaceInfo = GAME_RACES[selectedRace];
  const currentClassInfo = GAME_CLASSES[selectedClass];

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col p-4 sm:p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-[#0a0d14] to-[#05060a] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex justify-between items-center py-4 border-b border-game-border-gold/40">
        <Link
          href="/character-select"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-game-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a selección
        </Link>
        <h1 className="font-fantasy font-bold text-base sm:text-lg text-game-gold tracking-wide">
          Forja de Personajes de Aethoria
        </h1>
        <div className="w-20" />
      </header>

      {/* Main Creation Grid */}
      <main className="relative z-10 max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
        {/* Left Column: Race & Class Selectors (Col 1-4) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* 1. Races */}
          <div className="bg-game-panel border border-game-border rounded-xl p-4 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-game-gold uppercase tracking-wider">
              1. Selecciona tu Raza
            </h2>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(GAME_RACES).map((race) => {
                const isSelected = selectedRace === race.code;
                return (
                  <button
                    key={race.code}
                    type="button"
                    onClick={() => {
                      setSelectedRace(race.code as any);
                      gameAudio.playButtonClick();
                    }}
                    className={`text-left px-3 py-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-950/60 border-game-gold text-game-gold font-bold shadow'
                        : 'bg-game-bg/60 border-gray-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span>{race.name}</span>
                    <span className="text-[10px] text-gray-400">{race.affinityArea}</span>
                  </button>
                );
              })}
            </div>
            {/* Race lore snippet */}
            <p className="text-[11px] text-gray-400 italic pt-2 border-t border-gray-800">
              {currentRaceInfo.description}
            </p>
          </div>

          {/* 2. Classes */}
          <div className="bg-game-panel border border-game-border rounded-xl p-4 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-game-gold uppercase tracking-wider">
              2. Selecciona tu Clase
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(GAME_CLASSES).map((cls) => {
                const isSelected = selectedClass === cls.code;
                return (
                  <button
                    key={cls.code}
                    type="button"
                    onClick={() => {
                      setSelectedClass(cls.code as any);
                      gameAudio.playButtonClick();
                    }}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-blue-950/60 border-cyan-400 text-cyan-200 font-bold shadow'
                        : 'bg-game-bg/60 border-gray-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span>{cls.name}</span>
                    <span className="text-[10px] text-gray-400">{cls.role}</span>
                  </button>
                );
              })}
            </div>
            {/* Class description */}
            <p className="text-[11px] text-gray-400 italic pt-2 border-t border-gray-800">
              {currentClassInfo.description}
            </p>
          </div>
        </div>

        {/* Center Column: Live 2D Character Canvas Preview (Col 5-8) */}
        <div className="lg:col-span-4 bg-game-panel border-2 border-game-border-gold rounded-2xl p-6 shadow-rpg flex flex-col items-center justify-between">
          <div className="text-center">
            <span className="text-xs font-bold text-game-gold uppercase tracking-wider">
              Vista Previa en Tiempo Real
            </span>
            <h3 className="font-fantasy font-bold text-lg text-white mt-1">
              {name || 'Héroe sin Nombre'}
            </h3>
            <span className="text-xs text-gray-400 capitalize">
              {currentRaceInfo.name} &bull; {currentClassInfo.name}
            </span>
          </div>

          {/* Canvas preview */}
          <div className="relative my-4 w-48 h-48 rounded-2xl bg-gradient-to-b from-[#131726] to-[#080a11] border-2 border-game-border-gold/60 flex items-center justify-center shadow-inner overflow-hidden">
            <canvas ref={canvasRef} width={180} height={180} className="pixelated" />
          </div>

          {/* Racial & Class Talents Summary */}
          <div className="w-full bg-black/40 border border-gray-800 rounded-xl p-3.5 flex flex-col gap-2 text-xs">
            <div>
              <span className="font-bold text-game-gold">Habilidad Activa ({currentRaceInfo.activeSkill.name}):</span>
              <p className="text-[11px] text-gray-300">{currentRaceInfo.activeSkill.description}</p>
            </div>
            <div className="pt-1.5 border-t border-gray-800">
              <span className="font-bold text-cyan-400">Pasiva Racial ({currentRaceInfo.passiveSkill.name}):</span>
              <p className="text-[11px] text-gray-300">{currentRaceInfo.passiveSkill.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls & Finalize (Col 9-12) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <form onSubmit={handleCreate} className="bg-game-panel border border-game-border rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-xs font-bold text-game-gold uppercase tracking-wider">
              3. Personalización Visual
            </h2>

            {/* Hero Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Nombre del Personaje</label>
              <input
                type="text"
                required
                maxLength={18}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Vaelor o Aethelgard"
                className="bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-game-gold"
              />
            </div>

            {/* Hair Style */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Estilo de Cabello</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'short_warrior', label: 'Guerrero' },
                  { id: 'long_elven', label: 'Largo' },
                  { id: 'top_knot', label: 'Recogido' },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setHairStyle(style.id)}
                    className={`py-1.5 rounded border text-xs font-semibold transition-all ${
                      hairStyle === style.id
                        ? 'bg-game-gold text-black border-game-gold'
                        : 'bg-black/40 border-gray-700 text-gray-300'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palettes */}
            {/* Skin Tone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Tono de Piel</label>
              <div className="flex gap-2">
                {['#f8d5b8', '#dfa87a', '#a67244', '#603d22', '#cbd5e1'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSkinTone(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      skinTone === c ? 'border-game-gold scale-110 shadow' : 'border-black'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Color de Cabello</label>
              <div className="flex gap-2">
                {['#4a2c11', '#1e293b', '#e2e8f0', '#f59e0b', '#dc2626'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setHairColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      hairColor === c ? 'border-game-gold scale-110 shadow' : 'border-black'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Outfit Color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Color de Atuendo</label>
              <div className="flex gap-2">
                {['#3b82f6', '#16a34a', '#7c3aed', '#b45309', '#1e293b'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setOutfitColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      outfitColor === c ? 'border-game-gold scale-110 shadow' : 'border-black'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Cape Color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Color de Capa</label>
              <div className="flex gap-2">
                {['#991b1b', '#1e3a8a', '#3f3f46', '#065f46', '#581c87'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCapeColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      capeColor === c ? 'border-game-gold scale-110 shadow' : 'border-black'
                    }`}
                  />
                ))}
              </div>
            </div>

            {error && <span className="text-xs text-red-400">{error}</span>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 bg-gradient-to-r from-game-gold via-amber-400 to-amber-500 text-black font-fantasy font-bold text-sm rounded-xl shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Forjando en Neon PostgreSQL...' : '¡FORJAR PERSONAJE Y JUGAR!'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
