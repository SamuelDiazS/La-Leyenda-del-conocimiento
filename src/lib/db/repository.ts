import { CharacterData, EducationalActivity, CompetencyProgress } from '../game/types';
import { GAME_CLASSES, GAME_RACES, INITIAL_ITEMS, EDUCATIONAL_ACTIVITIES, INITIAL_QUESTS } from '../game/constants';
import { hashPassword, verifyPassword } from '../auth/passwords';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface LearningAttemptRecord {
  id: number;
  characterId: string;
  activityId: number;
  selectedOptionId: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  createdAt: string;
}

export interface AuditLogRecord {
  id: number;
  adminUsername: string;
  action: string;
  details: any;
  createdAt: string;
}

// Global in-memory storage singleton that retains state across API routes during server runtime
class GameRepository {
  private users: Map<string, UserRecord> = new Map();
  private characters: Map<string, CharacterData> = new Map();
  private learningAttempts: LearningAttemptRecord[] = [];
  private auditLogs: AuditLogRecord[] = [];
  private initialized = false;

  constructor() {
    this.ensureInitialized();
  }

  private async ensureInitialized() {
    if (this.initialized) return;
    this.initialized = true;

    // Seed Initial Administrator Fredy (Requirement Section 17)
    const adminUsername = process.env.INITIAL_ADMIN_USERNAME || 'Fredy';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin_JL2026';
    const adminHash = await hashPassword(adminPassword);

    const adminUser: UserRecord = {
      id: 'usr_admin_fredy_001',
      username: adminUsername,
      email: 'fredy.admin@aethoria.edu.co',
      passwordHash: adminHash,
      isAdmin: true,
      mustChangePassword: true, // Forces password change on first login
      createdAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);

    // Seed Sample Demo Player
    const playerHash = await hashPassword('Aethoria2026!');
    const demoUser: UserRecord = {
      id: 'usr_player_demo_002',
      username: 'ViajeroValiente',
      email: 'viajero@aethoria.edu.co',
      passwordHash: playerHash,
      isAdmin: false,
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
    };
    this.users.set(demoUser.id, demoUser);

    // Seed Demo Character
    const demoChar: CharacterData = {
      id: 'char_demo_001',
      userId: demoUser.id,
      name: 'Aldor',
      race: 'human',
      class: 'guardian',
      level: 2,
      experience: 120,
      experienceToNext: 300,
      health: 180,
      maxHealth: 180,
      resource: 100,
      maxResource: 100,
      attributePoints: 2,
      skillPoints: 1,
      gold: 85,
      currentZone: 'valle_despertares',
      posX: 400,
      posY: 300,
      appearance: {
        gender: 'male',
        skinTone: '#f8d5b8',
        hairStyle: 'short_warrior',
        hairColor: '#4a2c11',
        eyeColor: '#2563eb',
        outfitColor: '#3b82f6',
        capeColor: '#991b1b',
      },
      attributes: {
        strength: 14,
        intelligence: 10,
        agility: 12,
        stamina: 16,
        perception: 11,
        wisdom: 10,
      },
      equipment: {
        mainHand: INITIAL_ITEMS[0], // starter_sword
        chest: INITIAL_ITEMS[3], // iron_chestplate
      },
      inventory: [
        { slotIndex: 0, item: INITIAL_ITEMS[5], quantity: 3 }, // potion_health_minor
        { slotIndex: 1, item: INITIAL_ITEMS[6], quantity: 2 }, // potion_mana_minor
      ],
      skills: [
        {
          id: 1,
          code: 'slash_strike',
          name: 'Golpe Resuelto',
          description: 'Ataque pesado cuerpo a cuerpo que inflige daño físico contundente.',
          icon: 'Sword',
          requiredLevel: 1,
          resourceCost: 15,
          cooldownMs: 1500,
          rangePixels: 60,
          damageMultiplier: 1.3,
          effectType: 'damage',
          animationKey: 'slash',
          associatedCompetency: 'FISICA',
        },
        {
          id: 2,
          code: 'shield_slam',
          name: 'Embate de Escudo',
          description: 'Golpea con el escudo, aturdiendo al objetivo por 1.5s.',
          icon: 'Shield',
          requiredLevel: 2,
          resourceCost: 25,
          cooldownMs: 6000,
          rangePixels: 50,
          damageMultiplier: 1.1,
          effectType: 'stun',
          animationKey: 'slam',
          associatedCompetency: 'FISICA',
        },
      ],
      slottedSkills: [
        {
          id: 1,
          code: 'slash_strike',
          name: 'Golpe Resuelto',
          description: 'Ataque pesado cuerpo a cuerpo.',
          icon: 'Sword',
          requiredLevel: 1,
          resourceCost: 15,
          cooldownMs: 1500,
          rangePixels: 60,
          damageMultiplier: 1.3,
          effectType: 'damage',
          animationKey: 'slash',
          associatedCompetency: 'FISICA',
        },
        null,
        null,
        null,
        null,
        null,
      ],
      createdAt: new Date().toISOString(),
    };
    this.characters.set(demoChar.id, demoChar);

    // Initial audit log
    this.logAudit(adminUsername, 'SYSTEM_INIT', { message: 'Servidor inicializado correctamente con cuenta Fredy protegida' });
  }

  // --- Users ---
  async getUserByUsername(username: string): Promise<UserRecord | null> {
    await this.ensureInitialized();
    const allUsers = Array.from(this.users.values());
    for (const user of allUsers) {
      if (user.username.toLowerCase() === username.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    await this.ensureInitialized();
    const allUsers = Array.from(this.users.values());
    for (const user of allUsers) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async getUserById(id: string): Promise<UserRecord | null> {
    await this.ensureInitialized();
    return this.users.get(id) || null;
  }

  async createUser(data: { username: string; email: string; passwordHash: string; isAdmin?: boolean; mustChangePassword?: boolean }): Promise<UserRecord> {
    await this.ensureInitialized();
    const newUser: UserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      isAdmin: !!data.isAdmin,
      mustChangePassword: !!data.mustChangePassword,
      createdAt: new Date().toISOString(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async updateUserPassword(userId: string, newPasswordHash: string): Promise<boolean> {
    await this.ensureInitialized();
    const user = this.users.get(userId);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    user.mustChangePassword = false;
    return true;
  }

  async getAllUsers(): Promise<UserRecord[]> {
    await this.ensureInitialized();
    return Array.from(this.users.values());
  }

  // --- Characters ---
  async getCharactersByUserId(userId: string): Promise<CharacterData[]> {
    await this.ensureInitialized();
    const results: CharacterData[] = [];
    const allChars = Array.from(this.characters.values());
    for (const char of allChars) {
      if (char.userId === userId) {
        results.push(char);
      }
    }
    return results;
  }

  async getCharacterById(characterId: string): Promise<CharacterData | null> {
    await this.ensureInitialized();
    return this.characters.get(characterId) || null;
  }

  async createCharacter(data: {
    userId: string;
    name: string;
    race: string;
    class: string;
    appearance: any;
  }): Promise<CharacterData> {
    await this.ensureInitialized();

    const raceInfo = GAME_RACES[data.race] || GAME_RACES.human;
    const classInfo = GAME_CLASSES[data.class] || GAME_CLASSES.guardian;

    const baseAttributes = {
      strength: 10 + raceInfo.bonusStats.strength,
      intelligence: 10 + raceInfo.bonusStats.intelligence,
      agility: 10 + raceInfo.bonusStats.agility,
      stamina: 10 + raceInfo.bonusStats.stamina,
      perception: 10 + raceInfo.bonusStats.perception,
      wisdom: 10 + raceInfo.bonusStats.wisdom,
    };

    // Starter weapon based on class
    let starterWeapon = INITIAL_ITEMS[0]; // sword
    if (data.class === 'arcanist' || data.class === 'scholar') starterWeapon = INITIAL_ITEMS[1];
    if (data.class === 'ranger') starterWeapon = INITIAL_ITEMS[2];

    const newChar: CharacterData = {
      id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: data.userId,
      name: data.name,
      race: data.race as any,
      class: data.class as any,
      level: 1,
      experience: 0,
      experienceToNext: 200,
      health: classInfo.baseHealth + baseAttributes.stamina * 2,
      maxHealth: classInfo.baseHealth + baseAttributes.stamina * 2,
      resource: classInfo.baseResource,
      maxResource: classInfo.baseResource,
      attributePoints: 0,
      skillPoints: 1,
      gold: 50,
      currentZone: 'valle_despertares',
      posX: 400,
      posY: 300,
      appearance: data.appearance,
      attributes: baseAttributes,
      equipment: {
        mainHand: starterWeapon,
        chest: INITIAL_ITEMS[3],
      },
      inventory: [
        { slotIndex: 0, item: INITIAL_ITEMS[5], quantity: 3 },
        { slotIndex: 1, item: INITIAL_ITEMS[6], quantity: 2 },
      ],
      skills: [
        {
          id: 1,
          code: `${data.class}_primary`,
          name: data.class === 'guardian' ? 'Golpe Resuelto' : data.class === 'arcanist' ? 'Dardo Arcano' : 'Ataque Táctico',
          description: 'Habilidad ofensiva básica afinada con tus competencias de Aethoria.',
          icon: data.class === 'guardian' ? 'Sword' : data.class === 'arcanist' ? 'Sparkles' : 'Crosshair',
          requiredLevel: 1,
          resourceCost: 15,
          cooldownMs: 1500,
          rangePixels: data.class === 'guardian' ? 60 : 220,
          damageMultiplier: 1.3,
          effectType: 'damage',
          animationKey: 'attack',
          associatedCompetency: data.class === 'guardian' ? 'FISICA' : data.class === 'arcanist' ? 'MATEMATICAS' : 'GENERAL',
        },
      ],
      slottedSkills: [
        {
          id: 1,
          code: `${data.class}_primary`,
          name: data.class === 'guardian' ? 'Golpe Resuelto' : data.class === 'arcanist' ? 'Dardo Arcano' : 'Ataque Táctico',
          description: 'Habilidad ofensiva básica.',
          icon: data.class === 'guardian' ? 'Sword' : data.class === 'arcanist' ? 'Sparkles' : 'Crosshair',
          requiredLevel: 1,
          resourceCost: 15,
          cooldownMs: 1500,
          rangePixels: data.class === 'guardian' ? 60 : 220,
          damageMultiplier: 1.3,
          effectType: 'damage',
          animationKey: 'attack',
          associatedCompetency: 'GENERAL',
        },
        null,
        null,
        null,
        null,
        null,
      ],
      createdAt: new Date().toISOString(),
    };

    this.characters.set(newChar.id, newChar);
    return newChar;
  }

  async updateCharacter(characterId: string, updates: Partial<CharacterData>): Promise<CharacterData | null> {
    await this.ensureInitialized();
    const char = this.characters.get(characterId);
    if (!char) return null;

    const updated = { ...char, ...updates };
    this.characters.set(characterId, updated);
    return updated;
  }

  // --- Educational Progress & ICFES Saber 11 ---
  async recordLearningAttempt(
    characterId: string,
    activityId: number,
    optionId: number,
    isCorrect: boolean,
    timeSpentSeconds: number
  ): Promise<LearningAttemptRecord> {
    await this.ensureInitialized();
    const attempt: LearningAttemptRecord = {
      id: this.learningAttempts.length + 1,
      characterId,
      activityId,
      selectedOptionId: optionId,
      isCorrect,
      timeSpentSeconds,
      createdAt: new Date().toISOString(),
    };
    this.learningAttempts.push(attempt);
    return attempt;
  }

  async getCharacterLearningMetrics(characterId: string): Promise<CompetencyProgress[]> {
    await this.ensureInitialized();
    const attempts = this.learningAttempts.filter((a) => a.characterId === characterId);

    const competencyMap: Record<string, { total: number; correct: number; area: any; name: string }> = {
      LC_COMPRENDER: { total: 0, correct: 0, area: 'LECTURA_CRITICA', name: 'Lectura Crítica: Coherencia y Contradicciones' },
      MAT_INTERPRETACION: { total: 0, correct: 0, area: 'MATEMATICAS', name: 'Matemáticas: Proporciones y Razones' },
      FIS_ENERGIA: { total: 0, correct: 0, area: 'FISICA', name: 'Física: Conservación de Energía y Fuerzas' },
    };

    for (const att of attempts) {
      const act = EDUCATIONAL_ACTIVITIES.find((a) => a.id === att.activityId);
      if (act && competencyMap[act.competencyCode]) {
        competencyMap[act.competencyCode].total += 1;
        if (att.isCorrect) competencyMap[act.competencyCode].correct += 1;
      }
    }

    return Object.entries(competencyMap).map(([code, data]) => ({
      competencyCode: code,
      name: data.name,
      area: data.area,
      totalAttempts: data.total,
      successfulAttempts: data.correct,
      masteryPercentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));
  }

  async getAllLearningAnalytics() {
    await this.ensureInitialized();
    const totalAttempts = this.learningAttempts.length;
    const correctAttempts = this.learningAttempts.filter((a) => a.isCorrect).length;
    const averageTime = totalAttempts > 0 ? Math.round(this.learningAttempts.reduce((acc, a) => acc + a.timeSpentSeconds, 0) / totalAttempts) : 0;

    // By area
    const areaStats = {
      LECTURA_CRITICA: { total: 0, correct: 0 },
      MATEMATICAS: { total: 0, correct: 0 },
      FISICA: { total: 0, correct: 0 },
    };

    for (const att of this.learningAttempts) {
      const act = EDUCATIONAL_ACTIVITIES.find((a) => a.id === att.activityId);
      if (act && areaStats[act.area as keyof typeof areaStats]) {
        areaStats[act.area as keyof typeof areaStats].total += 1;
        if (att.isCorrect) areaStats[act.area as keyof typeof areaStats].correct += 1;
      }
    }

    return {
      totalAttempts,
      correctAttempts,
      accuracyRate: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
      averageTime,
      areaStats,
      recentAttempts: this.learningAttempts.slice(-10).reverse(),
    };
  }

  // --- Audit Logs ---
  logAudit(adminUsername: string, action: string, details: any = {}) {
    const log: AuditLogRecord = {
      id: this.auditLogs.length + 1,
      adminUsername,
      action,
      details,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
  }

  async getAuditLogs(): Promise<AuditLogRecord[]> {
    await this.ensureInitialized();
    return this.auditLogs;
  }

  // --- Global Stats for Admin Dashboard ---
  async getGlobalStats() {
    await this.ensureInitialized();
    const totalUsers = this.users.size;
    const totalCharacters = this.characters.size;

    const raceDistribution: Record<string, number> = {};
    const classDistribution: Record<string, number> = {};
    let totalLevel = 0;

    for (const char of Array.from(this.characters.values())) {
      raceDistribution[char.race] = (raceDistribution[char.race] || 0) + 1;
      classDistribution[char.class] = (classDistribution[char.class] || 0) + 1;
      totalLevel += char.level;
    }

    const averageLevel = totalCharacters > 0 ? (totalLevel / totalCharacters).toFixed(1) : '1.0';

    return {
      totalUsers,
      totalCharacters,
      averageLevel,
      raceDistribution,
      classDistribution,
      learningAnalytics: await this.getAllLearningAnalytics(),
    };
  }
}

// Export singleton instance
export const gameRepository = new GameRepository();
