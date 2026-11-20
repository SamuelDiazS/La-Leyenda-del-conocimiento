import { create } from 'zustand';
import {
  CharacterData,
  QuestData,
  EducationalActivity,
  CompetencyProgress,
  ChatMessage,
  RemotePlayerPosition,
  ItemInfo,
} from '@/lib/game/types';
import { INITIAL_QUESTS } from '@/lib/game/constants';
import { gameAudio } from '@/lib/game/audio';

interface GameState {
  character: CharacterData | null;
  activeQuests: QuestData[];
  learningMetrics: CompetencyProgress[];
  activeModal: 'inventory' | 'character' | 'quests' | 'learning' | 'dialogue' | 'map' | null;
  currentDialogue: {
    npcName: string;
    title?: string;
    text: string;
    options: { text: string; action: () => void }[];
  } | null;
  currentLearningActivity: EducationalActivity | null;
  targetEnemy: {
    id: string;
    name: string;
    health: number;
    maxHealth: number;
    level: number;
  } | null;
  remotePlayers: Record<string, RemotePlayerPosition>;
  chatMessages: ChatMessage[];
  skillCooldowns: Record<number, number>; // slotIndex -> expiry timestamp
  notification: string | null;

  // Actions
  setCharacter: (char: CharacterData | null) => void;
  updateStats: (updates: Partial<CharacterData>) => void;
  openModal: (modal: GameState['activeModal']) => void;
  closeModal: () => void;
  startDialogue: (dialogue: GameState['currentDialogue']) => void;
  closeDialogue: () => void;
  startLearningActivity: (activity: EducationalActivity) => void;
  closeLearningActivity: () => void;
  setTargetEnemy: (enemy: GameState['targetEnemy']) => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateRemotePlayer: (player: RemotePlayerPosition) => void;
  removeRemotePlayer: (id: string) => void;
  equipItem: (item: ItemInfo) => void;
  useItem: (item: ItemInfo, slotIndex: number) => void;
  castSkill: (slotIndex: number) => boolean;
  setNotification: (text: string | null) => void;
  advanceQuestObjective: (type: 'kill' | 'talk' | 'puzzle', amount?: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  character: null,
  activeQuests: INITIAL_QUESTS.map((q) => ({ ...q })),
  learningMetrics: [],
  activeModal: null,
  currentDialogue: null,
  currentLearningActivity: null,
  targetEnemy: null,
  remotePlayers: {},
  chatMessages: [
    {
      id: 'sys_1',
      senderName: 'Sistema',
      channel: 'system',
      message: '¡Bienvenido a Aethoria! Usa WASD para moverte, 1-6 para habilidades y E para interactuar con NPCs.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  skillCooldowns: {},
  notification: null,

  setCharacter: (char) => set({ character: char }),

  updateStats: (updates) =>
    set((state) => ({
      character: state.character ? { ...state.character, ...updates } : null,
    })),

  openModal: (modal) => {
    gameAudio.playButtonClick();
    set({ activeModal: modal });
  },

  closeModal: () => set({ activeModal: null }),

  startDialogue: (dialogue) => set({ currentDialogue: dialogue }),
  closeDialogue: () => set({ currentDialogue: null }),

  startLearningActivity: (activity) => {
    set({ currentLearningActivity: activity, activeModal: 'learning' });
  },
  closeLearningActivity: () => set({ currentLearningActivity: null, activeModal: null }),

  setTargetEnemy: (enemy) => set({ targetEnemy: enemy }),

  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [...state.chatMessages.slice(-50), msg],
    })),

  updateRemotePlayer: (player) =>
    set((state) => ({
      remotePlayers: { ...state.remotePlayers, [player.id]: player },
    })),

  removeRemotePlayer: (id) =>
    set((state) => {
      const copy = { ...state.remotePlayers };
      delete copy[id];
      return { remotePlayers: copy };
    }),

  equipItem: (item) => {
    const { character } = get();
    if (!character) return;

    let slotName: keyof typeof character.equipment = 'mainHand';
    if (item.itemType === 'chest') slotName = 'chest';
    if (item.itemType === 'helm') slotName = 'head';
    if (item.itemType === 'legs') slotName = 'legs';
    if (item.itemType === 'boots') slotName = 'boots';
    if (item.itemType === 'accessory') slotName = 'accessory';

    const newEquipment = { ...character.equipment, [slotName]: item };

    // Recalculate max health & attributes
    let bonusHealth = 0;
    if (item.bonusSta) bonusHealth += item.bonusSta * 2;

    gameAudio.playButtonClick();
    set({
      character: {
        ...character,
        equipment: newEquipment,
        maxHealth: character.maxHealth + bonusHealth,
        health: Math.min(character.health + bonusHealth, character.maxHealth + bonusHealth),
      },
      notification: `Has equipado: ${item.name}`,
    });
  },

  useItem: (item, slotIndex) => {
    const { character } = get();
    if (!character) return;

    if (item.itemType === 'potion') {
      let newHealth = character.health;
      let newResource = character.resource;

      if (item.effects?.heal) {
        newHealth = Math.min(character.maxHealth, character.health + item.effects.heal);
      }
      if (item.effects?.resource) {
        newResource = Math.min(character.maxResource, character.resource + item.effects.resource);
      }

      // Decrement quantity or remove
      const newInventory = character.inventory
        .map((slot) => {
          if (slot.slotIndex === slotIndex) {
            return { ...slot, quantity: slot.quantity - 1 };
          }
          return slot;
        })
        .filter((slot) => slot.quantity > 0);

      gameAudio.playLevelUp();
      set({
        character: {
          ...character,
          health: newHealth,
          resource: newResource,
          inventory: newInventory,
        },
        notification: `Has usado: ${item.name}`,
      });
    }
  },

  castSkill: (slotIndex) => {
    const { character, skillCooldowns } = get();
    if (!character) return false;

    const skill = character.slottedSkills[slotIndex];
    if (!skill) return false;

    const now = Date.now();
    const cdExpiry = skillCooldowns[slotIndex] || 0;
    if (now < cdExpiry) {
      set({ notification: `${skill.name} aún no está lista` });
      return false;
    }

    if (character.resource < skill.resourceCost) {
      set({ notification: 'Recurso insuficiente' });
      return false;
    }

    // Spend resource
    const newResource = Math.max(0, character.resource - skill.resourceCost);

    // Play audio
    const isMagic = skill.associatedCompetency === 'MATEMATICAS' || skill.effectType === 'heal';
    gameAudio.playAttack(isMagic);

    set({
      character: { ...character, resource: newResource },
      skillCooldowns: { ...skillCooldowns, [slotIndex]: now + skill.cooldownMs },
      notification: `¡${skill.name}!`,
    });

    return true;
  },

  setNotification: (text) => set({ notification: text }),

  advanceQuestObjective: (type, amount = 1) => {
    const { activeQuests } = get();
    let updated = false;

    const newQuests = activeQuests.map((quest) => {
      const newObjectives = quest.objectives.map((obj) => {
        if (obj.type === type && !obj.isCompleted) {
          const newCurrent = Math.min(obj.requiredAmount, obj.currentAmount + amount);
          const isDone = newCurrent >= obj.requiredAmount;
          if (isDone) updated = true;
          return { ...obj, currentAmount: newCurrent, isCompleted: isDone };
        }
        return obj;
      });

      const allDone = newObjectives.every((o) => o.isCompleted);
      return {
        ...quest,
        objectives: newObjectives,
        status: allDone ? ('completed' as const) : quest.status,
      };
    });

    if (updated) {
      gameAudio.playQuestSuccess();
      set({ activeQuests: newQuests, notification: '¡Objetivo de misión completado!' });
    } else {
      set({ activeQuests: newQuests });
    }
  },
}));
