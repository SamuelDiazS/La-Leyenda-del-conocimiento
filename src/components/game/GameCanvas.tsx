'use client';

import React, { useEffect, useRef } from 'react';
import { createGameInstance } from '@/lib/phaser/GameEngine';

export const GameCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameInstanceRef.current) return;

    const game = createGameInstance(containerRef.current.id);
    gameInstanceRef.current = game;

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="phaser-game-container"
      ref={containerRef}
      className="w-full h-full absolute inset-0 overflow-hidden cursor-crosshair select-none"
    />
  );
};
