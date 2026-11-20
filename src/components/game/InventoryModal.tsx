'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { X, Coins, Shield, Sword, Heart, Sparkles, Wand, Crosshair, Scroll } from 'lucide-react';
import { ItemInfo } from '@/lib/game/types';

export const InventoryModal: React.FC = () => {
  const { character, activeModal, closeModal, equipItem, useItem } = useGameStore();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  if (activeModal !== 'inventory' || !character) return null;

  const totalSlots = 40;
  const inventorySlots = Array.from({ length: totalSlots }).map((_, index) => {
    return character.inventory.find((slot) => slot.slotIndex === index) || null;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'uncommon':
        return 'text-green-400 border-green-500/50';
      case 'rare':
        return 'text-blue-400 border-blue-500/50';
      case 'epic':
        return 'text-purple-400 border-purple-500/50';
      case 'legendary':
        return 'text-orange-400 border-orange-500/50';
      default:
        return 'text-gray-300 border-gray-600/50';
    }
  };

  const renderItemIcon = (icon: string) => {
    switch (icon) {
      case 'Sword':
        return <Sword className="w-5 h-5 text-amber-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'Wand':
        return <Wand className="w-5 h-5 text-purple-400" />;
      case 'Crosshair':
        return <Crosshair className="w-5 h-5 text-emerald-400" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'Scroll':
        return <Scroll className="w-5 h-5 text-yellow-300" />;
      default:
        return <Sparkles className="w-5 h-5 text-gray-300" />;
    }
  };

  const activeSelectedItem = selectedSlot !== null ? inventorySlots[selectedSlot] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-game-panel border-2 border-game-border-gold rounded-xl w-full max-w-lg shadow-rpg overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-game-panel-light border-b border-game-border">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-game-gold tracking-wide">Mochila de Viajero</h2>
            <span className="text-xs text-gray-400">({character.inventory.length} / 40)</span>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          {/* Inventory Grid (8 cols x 5 rows) */}
          <div className="grid grid-cols-8 gap-2 bg-black/40 p-3 rounded-lg border border-game-border">
            {inventorySlots.map((slot, index) => {
              const isSelected = selectedSlot === index;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedSlot(index)}
                  className={`w-11 h-11 rounded-lg border flex items-center justify-center relative transition-all ${
                    slot
                      ? `bg-game-panel-light hover:scale-105 ${getRarityColor(slot.item.rarity)}`
                      : 'bg-game-bg/60 border-gray-800'
                  } ${isSelected ? 'ring-2 ring-game-gold border-game-gold' : ''}`}
                >
                  {slot && (
                    <>
                      {renderItemIcon(slot.item.icon)}
                      {slot.quantity > 1 && (
                        <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white bg-black/80 px-1 rounded">
                          {slot.quantity}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Item Details Preview Panel */}
          {activeSelectedItem ? (
            <div className="bg-game-panel-light border border-game-border rounded-lg p-3 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-bold text-sm ${getRarityColor(activeSelectedItem.item.rarity)}`}>
                    {activeSelectedItem.item.name}
                  </h3>
                  <span className="text-[11px] text-gray-400 capitalize">
                    {activeSelectedItem.item.rarity} - {activeSelectedItem.item.itemType}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-game-gold text-xs font-semibold">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{activeSelectedItem.item.buyPrice} oro</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 italic">{activeSelectedItem.item.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                {activeSelectedItem.item.bonusStr > 0 && (
                  <span className="text-red-400">+{activeSelectedItem.item.bonusStr} Fuerza</span>
                )}
                {activeSelectedItem.item.bonusInt > 0 && (
                  <span className="text-cyan-400">+{activeSelectedItem.item.bonusInt} Inteligencia</span>
                )}
                {activeSelectedItem.item.bonusAgi > 0 && (
                  <span className="text-emerald-400">+{activeSelectedItem.item.bonusAgi} Agilidad</span>
                )}
                {activeSelectedItem.item.bonusSta > 0 && (
                  <span className="text-amber-400">+{activeSelectedItem.item.bonusSta} Resistencia</span>
                )}
                {activeSelectedItem.item.bonusPer > 0 && (
                  <span className="text-purple-400">+{activeSelectedItem.item.bonusPer} Percepción</span>
                )}
                {activeSelectedItem.item.bonusWis > 0 && (
                  <span className="text-blue-400">+{activeSelectedItem.item.bonusWis} Sabiduría</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-1 border-t border-gray-700">
                {activeSelectedItem.item.itemType === 'potion' && (
                  <button
                    onClick={() => {
                      useItem(activeSelectedItem.item, selectedSlot!);
                      setSelectedSlot(null);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition-colors"
                  >
                    Beber Poción
                  </button>
                )}
                {['weapon', 'chest', 'helm', 'legs', 'boots', 'accessory'].includes(
                  activeSelectedItem.item.itemType
                ) && (
                  <button
                    onClick={() => {
                      equipItem(activeSelectedItem.item);
                      setSelectedSlot(null);
                    }}
                    className="px-3 py-1 bg-game-gold hover:bg-amber-400 text-black rounded text-xs font-bold transition-colors"
                  >
                    Equipar
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-gray-500 italic">
              Haz clic en un objeto para ver sus atributos o equiparlo.
            </div>
          )}

          {/* Footer with Gold */}
          <div className="flex justify-between items-center px-2 pt-2 border-t border-game-border text-xs">
            <span className="text-gray-400">Bolsa personal</span>
            <div className="flex items-center gap-1.5 font-bold text-game-gold">
              <Coins className="w-4 h-4 text-game-gold" />
              <span>{character.gold} Monedas de Oro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
