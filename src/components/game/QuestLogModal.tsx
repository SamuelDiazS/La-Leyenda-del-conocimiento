'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { X, Scroll, CheckCircle2, Circle, Coins, Award } from 'lucide-react';

export const QuestLogModal: React.FC = () => {
  const { activeQuests, activeModal, closeModal, startLearningActivity } = useGameStore();
  const [selectedQuestId, setSelectedQuestId] = useState<number>(activeQuests[0]?.id || 1);

  if (activeModal !== 'quests') return null;

  const currentQuest = activeQuests.find((q) => q.id === selectedQuestId) || activeQuests[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-game-panel border-2 border-game-border-gold rounded-xl w-full max-w-2xl shadow-rpg overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-game-panel-light border-b border-game-border">
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-game-gold" />
            <h2 className="text-base font-bold text-game-gold tracking-wide">Registro de Misiones</h2>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Columns */}
        <div className="p-4 grid grid-cols-5 gap-4 min-h-[340px]">
          {/* Left Column: Quest List */}
          <div className="col-span-2 bg-black/40 border border-game-border rounded-lg p-2 flex flex-col gap-1.5 overflow-y-auto max-h-[360px]">
            <span className="text-[11px] font-bold text-gray-400 uppercase px-2 py-1">Capítulo I: El Despertar</span>
            {activeQuests.map((quest) => {
              const isSelected = quest.id === currentQuest?.id;
              const isCompleted = quest.status === 'completed';

              return (
                <button
                  key={quest.id}
                  onClick={() => setSelectedQuestId(quest.id)}
                  className={`text-left px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-game-panel-light border-game-border-gold text-game-gold shadow'
                      : 'bg-game-bg/60 border-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span className="truncate">{quest.title}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Quest Details */}
          <div className="col-span-3 bg-black/40 border border-game-border rounded-lg p-4 flex flex-col justify-between">
            {currentQuest ? (
              <div className="flex flex-col gap-3">
                <div className="border-b border-gray-800 pb-2">
                  <h3 className="text-base font-bold text-game-gold">{currentQuest.title}</h3>
                  <span className="text-xs text-gray-400">
                    Otorgada por: <span className="text-gray-200">{currentQuest.npcGiverName}</span>
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed italic">{currentQuest.narrativeDescription}</p>

                {/* Objectives */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Objetivos:</h4>
                  {currentQuest.objectives.map((obj, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {obj.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={obj.isCompleted ? 'line-through text-gray-500' : 'text-gray-200'}>
                        {obj.description} ({obj.currentAmount} / {obj.requiredAmount})
                      </span>
                    </div>
                  ))}
                </div>

                {/* Special Action: if quest has associated learning activity, button to open it directly */}
                {currentQuest.associatedActivity && !currentQuest.objectives[0]?.isCompleted && (
                  <button
                    onClick={() => {
                      closeModal();
                      startLearningActivity(currentQuest.associatedActivity!);
                    }}
                    className="mt-2 py-1.5 px-3 bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white rounded text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    Resolver Desafío Educativo de la Misión
                  </button>
                )}

                {/* Rewards */}
                <div className="border-t border-gray-800 pt-2 flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Recompensas:</h4>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-purple-400 font-semibold">+{currentQuest.rewardExp} EXP</span>
                    <div className="flex items-center gap-1 text-game-gold font-semibold">
                      <Coins className="w-3.5 h-3.5" />
                      <span>+{currentQuest.rewardGold} Oro</span>
                    </div>
                    {currentQuest.rewardItem && (
                      <span className="text-cyan-400 font-semibold">{currentQuest.rewardItem.name}</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-gray-500 italic">Selecciona una misión del registro.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
