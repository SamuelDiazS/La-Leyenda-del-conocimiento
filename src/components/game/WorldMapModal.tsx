'use client';

import React from 'react';
import { useGameStore } from '@/store/useGameStore';
import { X, MapPin, Compass, ShieldAlert, Sparkles, BookOpen, Wrench, Flame } from 'lucide-react';

export const WorldMapModal: React.FC = () => {
  const { activeModal, closeModal, character } = useGameStore();

  if (activeModal !== 'map') return null;

  const territories = [
    {
      id: 'valle_despertares',
      name: 'Valle de los Despertares',
      level: 'Nv. 1 - 10',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
      description: 'Cuna del despertar de la conciencia y los primeros monolitos de la Razón.',
      isCurrent: true,
      x: '30%',
      y: '65%',
    },
    {
      id: 'bosque_lunaria',
      name: 'Bosque de Lunaria',
      level: 'Nv. 10 - 20',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500 bg-purple-950/40 text-purple-300',
      description: 'Ruinas y manuscritos petrificados donde reina la Lectura Crítica.',
      isCurrent: false,
      x: '20%',
      y: '35%',
    },
    {
      id: 'forjaterra',
      name: 'Forjaterra',
      level: 'Nv. 20 - 30',
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500 bg-amber-950/40 text-amber-300',
      description: 'Ciudadela subterránea de compuertas hidráulicas y proporciones geométricas.',
      isCurrent: false,
      x: '60%',
      y: '70%',
    },
    {
      id: 'llanuras_ignis',
      name: 'Llanuras de Ignis',
      level: 'Nv. 30 - 40',
      icon: <Flame className="w-5 h-5 text-red-400" />,
      color: 'border-red-500 bg-red-950/40 text-red-300',
      description: 'Campos volcánicos de aceleración gravitatoria y balances cinéticos.',
      isCurrent: false,
      x: '75%',
      y: '40%',
    },
    {
      id: 'biblioteca_verdades',
      name: 'Biblioteca de las Verdades',
      level: 'Nv. 40 - 50',
      icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300',
      description: 'Gran archivo histórico donde convergen las 3 grandes fuerzas.',
      isCurrent: false,
      x: '45%',
      y: '20%',
    },
    {
      id: 'ciudadela_vacio',
      name: 'Ciudadela del Vacío',
      level: 'Nv. 60+',
      icon: <ShieldAlert className="w-5 h-5 text-violet-400" />,
      color: 'border-violet-600 bg-violet-950/60 text-violet-300',
      description: 'Epicentro del colapso del conocimiento y confrontación final.',
      isCurrent: false,
      x: '50%',
      y: '45%',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-game-panel border-2 border-game-border-gold rounded-xl w-full max-w-3xl shadow-rpg overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-game-panel-light border-b border-game-border">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-game-gold" />
            <h2 className="text-base font-bold text-game-gold tracking-wide">Mapa del Continente de Aethoria</h2>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Canvas Visual */}
        <div className="relative h-96 bg-[#0c121e] border-b border-game-border overflow-hidden p-6">
          {/* Subtle Grid and Continental Contours */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

          {/* Territories on Map */}
          {territories.map((territory) => (
            <div
              key={territory.id}
              style={{ left: territory.x, top: territory.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer"
            >
              <div
                className={`p-2 rounded-xl border-2 shadow-lg flex items-center gap-2 transition-all group-hover:scale-110 ${territory.color} ${
                  territory.isCurrent ? 'ring-2 ring-game-gold animate-pulse' : ''
                }`}
              >
                {territory.icon}
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none">{territory.name}</span>
                  <span className="text-[10px] opacity-80">{territory.level}</span>
                </div>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/90 border border-game-border-gold text-gray-200 text-[11px] p-2 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {territory.description}
                {territory.isCurrent && (
                  <span className="block mt-1 text-game-gold font-bold">¡Tu ubicación actual!</span>
                )}
              </div>
            </div>
          ))}

          {/* Compass Rose */}
          <div className="absolute bottom-4 right-4 opacity-40 pointer-events-none flex flex-col items-center">
            <span className="text-xs font-bold text-game-gold">N</span>
            <Compass className="w-12 h-12 text-game-gold" />
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-game-panel flex justify-between items-center text-xs text-gray-400">
          <span>Continente de Aethoria - Era del Resurgir</span>
          <span className="text-game-gold font-semibold">Ubicación actual: Valle de los Despertares</span>
        </div>
      </div>
    </div>
  );
};
