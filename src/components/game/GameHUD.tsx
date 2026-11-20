'use client';

import React from 'react';
import { useGameStore } from '@/store/useGameStore';
import {
  Shield,
  Sparkles,
  Sword,
  Backpack,
  User,
  Scroll,
  Map as MapIcon,
  Heart,
  Zap,
  Flame,
  Award,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { gameAudio } from '@/lib/game/audio';

export const GameHUD: React.FC = () => {
  const {
    character,
    targetEnemy,
    activeModal,
    openModal,
    closeModal,
    skillCooldowns,
    notification,
  } = useGameStore();

  if (!character) return null;

  const hpPercent = Math.max(0, Math.min(100, Math.round((character.health / character.maxHealth) * 100)));
  const resourcePercent = Math.max(0, Math.min(100, Math.round((character.resource / character.maxResource) * 100)));
  const expPercent = Math.max(0, Math.min(100, Math.round((character.experience / character.experienceToNext) * 100)));

  const handleCastHotbar = (slotIndex: number) => {
    if (typeof window !== 'undefined' && (window as any).__PHASER_CAST_SKILL__) {
      (window as any).__PHASER_CAST_SKILL__(slotIndex);
    }
  };

  const getCooldownRemaining = (slotIndex: number) => {
    const cd = skillCooldowns[slotIndex];
    if (!cd) return 0;
    const diff = cd - Date.now();
    return diff > 0 ? Math.ceil(diff / 1000) : 0;
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
      {/* 1. TOP-LEFT: PLAYER UNIT FRAME */}
      <div className="pointer-events-auto absolute top-4 left-4 flex items-center gap-3 bg-game-panel/90 border-2 border-game-border-gold/80 rounded-lg p-2.5 shadow-rpg backdrop-blur-sm">
        {/* Avatar */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-game-border to-game-bg border-2 border-game-border-gold flex items-center justify-center overflow-hidden shadow-inner">
          <div
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: character.appearance?.outfitColor || '#3b82f6' }}
          />
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 bg-game-gold text-black font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border border-black shadow">
            {character.level}
          </div>
        </div>

        {/* Info & Bars */}
        <div className="flex flex-col gap-1.5 w-44">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-game-gold truncate max-w-[110px]">{character.name}</span>
            <span className="text-gray-400 capitalize">{character.class}</span>
          </div>

          {/* Health Bar */}
          <div className="relative h-4 bg-gray-950 rounded border border-gray-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 transition-all duration-200"
              style={{ width: `${hpPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
              {character.health} / {character.maxHealth}
            </span>
          </div>

          {/* Resource Bar */}
          <div className="relative h-3.5 bg-gray-950 rounded border border-gray-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 transition-all duration-200"
              style={{ width: `${resourcePercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow">
              {character.resource} / {character.maxResource}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TOP-CENTER: TARGET UNIT FRAME (WHEN ENEMY IS TARGETED) */}
      {targetEnemy && targetEnemy.health > 0 && (
        <div className="pointer-events-auto absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-red-950/80 border-2 border-red-500/80 rounded-lg p-2.5 shadow-rpg backdrop-blur-sm animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-red-900 border-2 border-red-400 flex items-center justify-center font-bold text-sm text-red-200">
            {targetEnemy.level}
          </div>
          <div className="flex flex-col gap-1 w-40">
            <span className="text-red-200 font-bold text-xs truncate">{targetEnemy.name}</span>
            <div className="relative h-3.5 bg-gray-950 rounded border border-red-700 overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-150"
                style={{ width: `${Math.round((targetEnemy.health / targetEnemy.maxHealth) * 100)}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                {targetEnemy.health} / {targetEnemy.maxHealth}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. TOP-RIGHT: MINIMAP & ZONE BANNER */}
      <div className="pointer-events-auto absolute top-4 right-4 flex flex-col items-end gap-2">
        <div className="w-36 h-36 rounded-xl bg-game-panel border-2 border-game-border-gold/80 overflow-hidden relative shadow-rpg p-1 flex flex-col justify-between">
          {/* Radar background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-game-bg to-black" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-24 h-24 border border-emerald-500 rounded-full" />
            <div className="w-12 h-12 border border-emerald-500 rounded-full absolute" />
            <div className="w-full h-px bg-emerald-500 absolute" />
            <div className="h-full w-px bg-emerald-500 absolute" />
          </div>

          {/* Player marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-game-gold rounded-full border border-black shadow-gold-glow animate-pulse" />

          {/* Header */}
          <div className="relative z-10 text-[10px] font-bold text-game-gold bg-black/70 px-2 py-0.5 rounded text-center">
            Valle de los Despertares
          </div>

          {/* Coordinates */}
          <div className="relative z-10 text-[9px] font-mono text-gray-400 bg-black/70 px-1.5 py-0.5 rounded text-center">
            X: {Math.round(character.posX)} | Y: {Math.round(character.posY)}
          </div>
        </div>

        {/* Quick Menu Icons */}
        <div className="flex gap-1.5 bg-game-panel/90 border border-game-border rounded-lg p-1.5 shadow backdrop-blur-sm">
          <button
            onClick={() => (activeModal === 'character' ? closeModal() : openModal('character'))}
            title="Personaje (C)"
            className="p-2 rounded bg-game-panel-light hover:bg-game-border border border-gray-700 hover:border-game-gold text-game-gold transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            onClick={() => (activeModal === 'inventory' ? closeModal() : openModal('inventory'))}
            title="Inventario (I)"
            className="p-2 rounded bg-game-panel-light hover:bg-game-border border border-gray-700 hover:border-game-gold text-amber-400 transition-colors"
          >
            <Backpack className="w-4 h-4" />
          </button>
          <button
            onClick={() => (activeModal === 'quests' ? closeModal() : openModal('quests'))}
            title="Misiones (J)"
            className="p-2 rounded bg-game-panel-light hover:bg-game-border border border-gray-700 hover:border-game-gold text-cyan-400 transition-colors"
          >
            <Scroll className="w-4 h-4" />
          </button>
          <button
            onClick={() => (activeModal === 'map' ? closeModal() : openModal('map'))}
            title="Mapa de Aethoria (M)"
            className="p-2 rounded bg-game-panel-light hover:bg-game-border border border-gray-700 hover:border-game-gold text-emerald-400 transition-colors"
          >
            <MapIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. NOTIFICATION TOAST */}
      {notification && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/85 border border-game-gold text-game-gold px-4 py-1.5 rounded-full text-xs font-semibold shadow-gold-glow animate-bounce">
          {notification}
        </div>
      )}

      {/* 5. BOTTOM-CENTER: HOTBAR & ABILITY SLOTS (1-6) */}
      <div className="pointer-events-auto absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <div className="flex gap-2 p-2 bg-game-panel/95 border-2 border-game-border-gold/90 rounded-xl shadow-rpg backdrop-blur-sm">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const skill = character.slottedSkills[idx];
            const cdSec = getCooldownRemaining(idx);
            const isReady = cdSec === 0;

            return (
              <button
                key={idx}
                onClick={() => handleCastHotbar(idx)}
                className={`relative w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all group overflow-hidden ${
                  skill
                    ? isReady
                      ? 'border-gray-600 bg-game-bg hover:border-game-gold hover:scale-105 active:scale-95'
                      : 'border-red-900 bg-gray-950'
                    : 'border-dashed border-gray-700 bg-black/40'
                }`}
              >
                {/* Hotkey Number Badge */}
                <span className="absolute top-0.5 left-1 text-[9px] font-bold text-gray-400 group-hover:text-game-gold">
                  {idx + 1}
                </span>

                {skill ? (
                  <>
                    {/* Icon */}
                    {idx === 0 && <Sword className="w-6 h-6 text-game-gold" />}
                    {idx === 1 && <Sparkles className="w-6 h-6 text-cyan-400" />}
                    {idx === 2 && <Shield className="w-6 h-6 text-emerald-400" />}
                    {idx >= 3 && <Flame className="w-6 h-6 text-amber-500" />}

                    {/* Mana Cost */}
                    <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-cyan-300">
                      {skill.resourceCost}
                    </span>

                    {/* Cooldown Overlay */}
                    {!isReady && (
                      <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-xs font-bold text-white">
                        {cdSec}s
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-[10px] text-gray-600">-</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. BOTTOM: FULL-WIDTH EXPERIENCE BAR */}
      <div className="pointer-events-auto absolute bottom-0 inset-x-0 h-4 bg-gray-950 border-t border-gray-800">
        <div
          className="h-full bg-gradient-to-r from-purple-800 via-purple-600 to-indigo-400 transition-all duration-300"
          style={{ width: `${expPercent}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-200 tracking-wider">
          EXP: {character.experience} / {character.experienceToNext} ({expPercent}%)
        </div>
      </div>
    </div>
  );
};
