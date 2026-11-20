'use client';

import React from 'react';
import { useGameStore } from '@/store/useGameStore';
import { X, Shield, Sword, User, Sparkles, Plus, Award } from 'lucide-react';
import { gameAudio } from '@/lib/game/audio';

export const CharacterSheetModal: React.FC = () => {
  const { character, activeModal, closeModal, updateStats, setNotification } = useGameStore();

  if (activeModal !== 'character' || !character) return null;

  const handleSpendAttribute = (attr: keyof typeof character.attributes) => {
    if (character.attributePoints <= 0) return;

    const newAttributes = {
      ...character.attributes,
      [attr]: character.attributes[attr] + 1,
    };

    let bonusHp = 0;
    if (attr === 'stamina') bonusHp = 2;

    gameAudio.playButtonClick();
    updateStats({
      attributes: newAttributes,
      attributePoints: character.attributePoints - 1,
      maxHealth: character.maxHealth + bonusHp,
      health: character.health + bonusHp,
    });
    setNotification(`+1 a ${attr.toUpperCase()}`);
  };

  const renderEquipSlot = (slotName: string, item: any, defaultIcon: React.ReactNode) => {
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          title={item ? `${item.name} (${item.rarity})` : slotName}
          className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
            item
              ? 'bg-game-panel border-game-border-gold shadow-gold-glow'
              : 'bg-black/50 border-gray-700 text-gray-600'
          }`}
        >
          {item ? (
            <div className="text-game-gold text-xs font-bold text-center p-1 truncate max-w-[44px]">
              {item.name.substring(0, 5)}..
            </div>
          ) : (
            defaultIcon
          )}
        </div>
        <span className="text-[10px] text-gray-400 capitalize">{slotName}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-game-panel border-2 border-game-border-gold rounded-xl w-full max-w-xl shadow-rpg overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-game-panel-light border-b border-game-border">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-game-gold tracking-wide">Ficha del Héroe</h2>
            <span className="text-xs text-gray-400">
              {character.name} - Nivel {character.level}
            </span>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 grid grid-cols-2 gap-6">
          {/* Left: Paperdoll & Equipment */}
          <div className="flex flex-col items-center bg-black/40 border border-game-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4">Equipamiento</h3>

            <div className="flex flex-col items-center gap-3">
              {/* Head */}
              {renderEquipSlot('Cabeza', character.equipment.head, <Shield className="w-5 h-5" />)}

              {/* Arms / Chest / Offhand */}
              <div className="flex items-center gap-4">
                {renderEquipSlot('Arma Principal', character.equipment.mainHand, <Sword className="w-5 h-5" />)}
                {renderEquipSlot('Pechera', character.equipment.chest, <Shield className="w-6 h-6" />)}
                {renderEquipSlot('Escudo/Foco', character.equipment.offHand, <Sparkles className="w-5 h-5" />)}
              </div>

              {/* Legs & Boots */}
              <div className="flex items-center gap-4">
                {renderEquipSlot('Piernas', character.equipment.legs, <Shield className="w-5 h-5" />)}
                {renderEquipSlot('Botas', character.equipment.boots, <Shield className="w-5 h-5" />)}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800 w-full text-center">
              <span className="text-xs text-game-gold font-semibold capitalize">
                Raza: {character.race} | Clase: {character.class}
              </span>
            </div>
          </div>

          {/* Right: Attributes & Stats */}
          <div className="flex flex-col justify-between bg-black/40 border border-game-border rounded-xl p-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Atributos Fundamentales</h3>
                {character.attributePoints > 0 && (
                  <span className="text-xs font-bold text-amber-400 animate-pulse">
                    Puntos disponibles: {character.attributePoints}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  { key: 'strength' as const, label: 'Fuerza', color: 'text-red-400', desc: 'Aumenta daño físico' },
                  { key: 'intelligence' as const, label: 'Inteligencia', color: 'text-cyan-400', desc: 'Aumenta poder arcano y maná' },
                  { key: 'agility' as const, label: 'Agilidad', color: 'text-emerald-400', desc: 'Velocidad y probabilidad crítica' },
                  { key: 'stamina' as const, label: 'Resistencia', color: 'text-amber-400', desc: 'Aumenta salud máxima' },
                  { key: 'perception' as const, label: 'Percepción', color: 'text-purple-400', desc: 'Comprensión y deducción' },
                  { key: 'wisdom' as const, label: 'Sabiduría', color: 'text-blue-400', desc: 'Eficacia de soporte y regeneración' },
                ].map((stat) => (
                  <div
                    key={stat.key}
                    className="flex justify-between items-center bg-game-panel-light/70 px-3 py-1.5 rounded border border-gray-800"
                  >
                    <div>
                      <span className={`text-xs font-bold ${stat.color}`}>{stat.label}:</span>
                      <span className="text-xs font-bold text-white ml-2">{character.attributes[stat.key]}</span>
                    </div>

                    {character.attributePoints > 0 && (
                      <button
                        onClick={() => handleSpendAttribute(stat.key)}
                        title={`Aumentar ${stat.label}`}
                        className="w-5 h-5 rounded bg-game-gold hover:bg-amber-400 text-black flex items-center justify-center font-bold text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Combat Overview */}
            <div className="pt-3 border-t border-gray-800 flex justify-between text-xs text-gray-400">
              <div>
                <span>Salud: </span>
                <span className="text-red-400 font-bold">{character.maxHealth}</span>
              </div>
              <div>
                <span>Recurso: </span>
                <span className="text-blue-400 font-bold">{character.maxResource}</span>
              </div>
              <div>
                <span>Zona: </span>
                <span className="text-emerald-400 font-bold">Valle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
