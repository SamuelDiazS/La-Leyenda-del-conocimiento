'use client';

import React from 'react';
import { useGameStore } from '@/store/useGameStore';
import { X, MessageSquare, ChevronRight } from 'lucide-react';

export const DialogueModal: React.FC = () => {
  const { currentDialogue, closeDialogue } = useGameStore();

  if (!currentDialogue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-24 bg-black/40 backdrop-blur-xs p-4 pointer-events-none">
      <div className="pointer-events-auto bg-gradient-to-b from-[#1b1e2e] to-[#0e111d] border-2 border-game-border-gold rounded-xl w-full max-w-2xl shadow-rpg overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2.5 bg-game-panel-light/90 border-b border-game-border">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-game-gold" />
            <h3 className="text-sm font-bold text-game-gold">{currentDialogue.npcName}</h3>
            {currentDialogue.title && (
              <span className="text-[11px] text-gray-400">({currentDialogue.title})</span>
            )}
          </div>
          <button
            onClick={closeDialogue}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative Dialogue Body */}
        <div className="p-4 flex flex-col gap-4">
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-serif bg-black/30 p-3 rounded-lg border border-game-border">
            &ldquo;{currentDialogue.text}&rdquo;
          </p>

          {/* Interactive Choices */}
          <div className="flex flex-col gap-1.5">
            {currentDialogue.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={opt.action}
                className="text-left px-3 py-2 rounded-lg bg-game-panel-light hover:bg-game-border border border-gray-700 hover:border-game-gold text-xs font-semibold text-gray-200 hover:text-game-gold transition-all flex items-center justify-between group"
              >
                <span>{opt.text}</span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-game-gold transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
