'use client';

import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameStore } from '@/store/useGameStore';
import { GameHUD } from '@/components/game/GameHUD';
import { InventoryModal } from '@/components/game/InventoryModal';
import { CharacterSheetModal } from '@/components/game/CharacterSheetModal';
import { QuestLogModal } from '@/components/game/QuestLogModal';
import { DialogueModal } from '@/components/game/DialogueModal';
import { LearningModal } from '@/components/game/LearningModal';
import { WorldMapModal } from '@/components/game/WorldMapModal';
import { ChatBox } from '@/components/game/ChatBox';

// Dynamically import GameCanvas with SSR disabled
const DynamicGameCanvas = dynamic(
  () => import('@/components/game/GameCanvas').then((mod) => mod.GameCanvas),
  { ssr: false }
);

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get('characterId');

  const { character, setCharacter, activeModal, openModal, closeModal } = useGameStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initGameSession() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          router.push('/login');
          return;
        }

        let charTargetId = characterId;

        // If no characterId in URL, fetch user's first character
        if (!charTargetId) {
          const listRes = await fetch('/api/character');
          if (listRes.ok) {
            const listData = await listRes.json();
            if (listData.characters && listData.characters.length > 0) {
              charTargetId = listData.characters[0].id;
            } else {
              router.push('/character-create');
              return;
            }
          }
        }

        if (charTargetId) {
          const charRes = await fetch(`/api/character/${charTargetId}`);
          if (charRes.ok) {
            const charData = await charRes.json();
            setCharacter(charData.character);
          }
        }
      } catch (err) {
        console.error('Failed to initialize game session:', err);
      } finally {
        setLoading(false);
      }
    }

    initGameSession();
  }, [characterId, router, setCharacter]);

  // Global Keyboard Shortcuts (I, C, J, M, ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'i' || e.key === 'I') {
        activeModal === 'inventory' ? closeModal() : openModal('inventory');
      } else if (e.key === 'c' || e.key === 'C') {
        activeModal === 'character' ? closeModal() : openModal('character');
      } else if (e.key === 'j' || e.key === 'J') {
        activeModal === 'quests' ? closeModal() : openModal('quests');
      } else if (e.key === 'm' || e.key === 'M') {
        activeModal === 'map' ? closeModal() : openModal('map');
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal, openModal]);

  if (loading || !character) {
    return (
      <div className="w-screen h-screen bg-[#07090e] flex flex-col items-center justify-center text-game-gold gap-3 font-fantasy">
        <div className="w-12 h-12 border-4 border-game-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-base tracking-widest animate-pulse">
          CONECTANDO CON EL MUNDO DE AETHORIA...
        </span>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative select-none">
      {/* 2D Game Canvas */}
      <DynamicGameCanvas />

      {/* Reactive MMORPG HUD */}
      <GameHUD />

      {/* In-Game Chat Box */}
      <ChatBox />

      {/* Interactive Modals */}
      <InventoryModal />
      <CharacterSheetModal />
      <QuestLogModal />
      <DialogueModal />
      <LearningModal />
      <WorldMapModal />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-[#07090e] flex items-center justify-center text-game-gold font-fantasy">
          Cargando Aethoria...
        </div>
      }
    >
      <GameContent />
    </Suspense>
  );
}
