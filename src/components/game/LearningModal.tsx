'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { X, BookOpen, Calculator, Zap, CheckCircle2, AlertCircle, Award, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { gameAudio } from '@/lib/game/audio';

export const LearningModal: React.FC = () => {
  const {
    character,
    currentLearningActivity,
    closeLearningActivity,
    setCharacter,
    advanceQuestObjective,
    setNotification,
  } = useGameStore();

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    pedagogicalExplanation: string;
    expGained: number;
    goldGained: number;
    leveledUp: boolean;
  } | null>(null);

  useEffect(() => {
    if (currentLearningActivity) {
      setStartTime(Date.now());
      setSelectedOptionId(null);
      setResult(null);
    }
  }, [currentLearningActivity]);

  if (!currentLearningActivity || !character) return null;

  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'LECTURA_CRITICA':
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'MATEMATICAS':
        return <Calculator className="w-5 h-5 text-amber-400" />;
      case 'FISICA':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      default:
        return <Award className="w-5 h-5 text-game-gold" />;
    }
  };

  const getAreaName = (area: string) => {
    switch (area) {
      case 'LECTURA_CRITICA':
        return 'Lectura Crítica (ICFES Saber 11)';
      case 'MATEMATICAS':
        return 'Matemáticas (ICFES Saber 11)';
      case 'FISICA':
        return 'Ciencias Naturales: Física (ICFES Saber 11)';
      default:
        return 'Desafío del Conocimiento';
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOptionId === null || isSubmitting) return;

    setIsSubmitting(true);
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    try {
      const res = await fetch('/api/game/learning/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: character.id,
          activityId: currentLearningActivity.id,
          optionId: selectedOptionId,
          timeSpentSeconds: timeSpent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          isCorrect: data.isCorrect,
          pedagogicalExplanation: data.pedagogicalExplanation,
          expGained: data.expGained,
          goldGained: data.goldGained,
          leveledUp: data.leveledUp,
        });

        if (data.isCorrect) {
          gameAudio.playQuestSuccess();
          advanceQuestObjective('puzzle', 1);

          // Confetti celebration
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });

          if (data.character) {
            setCharacter(data.character);
          }
          setNotification(`¡Desafío resuelto! +${data.expGained} EXP`);
        } else {
          gameAudio.playHit();
          setNotification('Análisis incorrecto. Reflexiona sobre las evidencias.');
        }
      }
    } catch (err) {
      console.error('Error submitting learning activity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-game-panel border-2 border-game-border-gold rounded-xl w-full max-w-2xl shadow-rpg overflow-hidden flex flex-col animate-scale-up max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 bg-game-panel-light border-b border-game-border">
          <div className="flex items-center gap-2.5">
            {getAreaIcon(currentLearningActivity.area)}
            <div>
              <h2 className="text-sm font-bold text-game-gold tracking-wide">
                {currentLearningActivity.title}
              </h2>
              <span className="text-[11px] text-gray-400">
                {getAreaName(currentLearningActivity.area)} - {currentLearningActivity.competencyName}
              </span>
            </div>
          </div>
          <button
            onClick={closeLearningActivity}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Scrollable if long) */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Narrative Lore Context */}
          <div className="bg-black/40 border border-game-border rounded-lg p-3.5 text-xs text-gray-300 italic font-serif leading-relaxed">
            &ldquo;{currentLearningActivity.narrativeContext}&rdquo;
          </div>

          {/* Statement Problem */}
          <div className="bg-game-panel-light/60 border border-game-border-gold/40 rounded-lg p-3.5">
            <h3 className="text-xs font-bold text-game-gold uppercase tracking-wider mb-2">Desafío Rúnico</h3>
            <p className="text-xs md:text-sm text-gray-100 leading-relaxed font-sans">
              {currentLearningActivity.statement}
            </p>
          </div>

          {/* Multiple Choice Options */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Selecciona tu resolución argumentada:
            </h4>
            {currentLearningActivity.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isResolved = result !== null;

              return (
                <button
                  key={option.id}
                  disabled={isResolved || isSubmitting}
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`text-left p-3 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-950/60 border-game-gold text-amber-200 shadow-gold-glow'
                      : 'bg-game-panel-light/70 border-gray-800 text-gray-200 hover:border-gray-600'
                  } ${isResolved ? 'cursor-default' : 'hover:scale-[1.01]'}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-game-gold text-black'
                        : 'bg-black/60 border border-gray-700 text-gray-400'
                    }`}
                  >
                    {option.label}
                  </span>
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Result Feedback Banner */}
          {result && (
            <div
              className={`p-4 rounded-lg border flex flex-col gap-2 animate-fade-in ${
                result.isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
                  : 'bg-red-950/70 border-red-500/80 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {result.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <h4 className="font-bold text-sm">
                  {result.isCorrect ? '¡Resolución Certera y Comprobada!' : 'Inconsistencia en el Razonamiento'}
                </h4>
              </div>

              <p className="text-xs leading-relaxed opacity-90">{result.pedagogicalExplanation}</p>

              {result.isCorrect && (
                <div className="flex items-center gap-4 text-xs font-semibold pt-1 border-t border-emerald-800/60">
                  <span className="text-purple-300">+{result.expGained} EXP</span>
                  <div className="flex items-center gap-1 text-game-gold">
                    <Coins className="w-3.5 h-3.5" />
                    <span>+{result.goldGained} Oro</span>
                  </div>
                  {result.leveledUp && (
                    <span className="text-cyan-300 font-bold animate-pulse">¡Has subido de nivel!</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-game-panel-light border-t border-game-border flex justify-between items-center">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>Recompensa:</span>
            <span className="text-purple-400 font-semibold">+{currentLearningActivity.rewardExp} EXP</span>
            <span className="text-game-gold font-semibold">+{currentLearningActivity.rewardGold} Oro</span>
          </div>

          {result ? (
            <button
              onClick={closeLearningActivity}
              className="px-4 py-1.5 bg-game-gold hover:bg-amber-400 text-black font-bold text-xs rounded shadow transition-colors"
            >
              Continuar la Aventura
            </button>
          ) : (
            <button
              disabled={selectedOptionId === null || isSubmitting}
              onClick={handleSubmitAnswer}
              className="px-5 py-2 bg-gradient-to-r from-game-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded shadow disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {isSubmitting ? 'Verificando con la Memoria...' : 'Validar Razonamiento'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
