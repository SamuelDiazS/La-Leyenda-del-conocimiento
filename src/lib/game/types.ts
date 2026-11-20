export type AreaOfKnowledge = 'LECTURA_CRITICA' | 'MATEMATICAS' | 'FISICA' | 'GENERAL';

export type CharacterRace = 'human' | 'elf' | 'dwarf' | 'dragonkin' | 'sylvan';
export type CharacterClass = 'guardian' | 'arcanist' | 'ranger' | 'summoner' | 'runic_engineer' | 'scholar';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type ItemType = 'weapon' | 'helm' | 'chest' | 'legs' | 'boots' | 'accessory' | 'potion' | 'quest_item' | 'artifact';

export interface RaceInfo {
  code: CharacterRace;
  name: string;
  description: string;
  affinityArea: string;
  activeSkill: { name: string; description: string };
  passiveSkill: { name: string; description: string };
  bonusStats: {
    strength: number;
    intelligence: number;
    agility: number;
    stamina: number;
    perception: number;
    wisdom: number;
  };
}

export interface ClassInfo {
  code: CharacterClass;
  name: string;
  role: string;
  description: string;
  primaryStat: string;
  resourceType: 'Mana' | 'Energía' | 'Furia' | 'Vapor Rúnico' | 'Conocimiento';
  baseHealth: number;
  baseResource: number;
  icon: string;
}

export interface SkillInfo {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  requiredLevel: number;
  resourceCost: number;
  cooldownMs: number;
  rangePixels: number;
  damageMultiplier: number;
  effectType: 'damage' | 'heal' | 'buff' | 'debuff' | 'stun' | 'area_damage' | 'line_damage' | 'utility';
  animationKey: string;
  associatedCompetency: AreaOfKnowledge;
}

export interface ItemInfo {
  id: number;
  code: string;
  name: string;
  description: string;
  itemType: ItemType;
  rarity: ItemRarity;
  requiredLevel: number;
  bonusStr: number;
  bonusInt: number;
  bonusAgi: number;
  bonusSta: number;
  bonusPer: number;
  bonusWis: number;
  buyPrice: number;
  sellPrice: number;
  icon: string;
  effects?: Record<string, any>;
}

export interface InventorySlot {
  slotIndex: number;
  item: ItemInfo;
  quantity: number;
}

export interface EquipmentSlots {
  head?: ItemInfo;
  chest?: ItemInfo;
  legs?: ItemInfo;
  boots?: ItemInfo;
  mainHand?: ItemInfo;
  offHand?: ItemInfo;
  accessory?: ItemInfo;
}

export interface CharacterAttributes {
  strength: number;
  intelligence: number;
  agility: number;
  stamina: number;
  perception: number;
  wisdom: number;
}

export interface CharacterAppearance {
  gender: 'male' | 'female' | 'unisex';
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfitColor: string;
  capeColor: string;
}

export interface CharacterData {
  id: string;
  userId: string;
  name: string;
  race: CharacterRace;
  class: CharacterClass;
  level: number;
  experience: number;
  experienceToNext: number;
  health: number;
  maxHealth: number;
  resource: number;
  maxResource: number;
  attributePoints: number;
  skillPoints: number;
  gold: number;
  currentZone: string;
  posX: number;
  posY: number;
  appearance: CharacterAppearance;
  attributes: CharacterAttributes;
  equipment: EquipmentSlots;
  inventory: InventorySlot[];
  skills: SkillInfo[];
  slottedSkills: (SkillInfo | null)[]; // 6 hotbar slots
  createdAt?: string;
}

export interface CompetencyProgress {
  competencyCode: string;
  name: string;
  area: AreaOfKnowledge;
  totalAttempts: number;
  successfulAttempts: number;
  masteryPercentage: number;
}

export interface EducationalActivity {
  id: number;
  area: AreaOfKnowledge;
  competencyCode: string;
  competencyName: string;
  title: string;
  narrativeContext: string;
  activityType: 'witness_contradiction' | 'gear_mechanism' | 'energy_circuit' | 'ruin_investigation';
  difficulty: 'principiante' | 'intermedio' | 'avanzado' | 'experto';
  statement: string;
  contextData: any;
  options: {
    id: number;
    label: string;
    text: string;
    isCorrect: boolean;
    pedagogicalExplanation: string;
  }[];
  rewardExp: number;
  rewardGold: number;
}

export interface QuestData {
  id: number;
  code: string;
  title: string;
  chapter: string;
  narrativeDescription: string;
  npcGiverName: string;
  requiredLevel: number;
  rewardExp: number;
  rewardGold: number;
  rewardItem?: ItemInfo;
  associatedActivity?: EducationalActivity;
  status: 'not_started' | 'in_progress' | 'completed';
  objectives: {
    type: 'talk' | 'kill' | 'puzzle' | 'collect';
    description: string;
    currentAmount: number;
    requiredAmount: number;
    isCompleted: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  channel: 'global' | 'zone' | 'party' | 'system';
  message: string;
  timestamp: string;
}

export interface RemotePlayerPosition {
  id: string;
  name: string;
  race: CharacterRace;
  class: CharacterClass;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  health: number;
  maxHealth: number;
}
