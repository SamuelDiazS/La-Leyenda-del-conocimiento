import * as Phaser from 'phaser';
import { useGameStore } from '@/store/useGameStore';
import { EDUCATIONAL_ACTIVITIES } from '@/lib/game/constants';
import { gameAudio } from '@/lib/game/audio';

interface EnemyInstance {
  sprite: Phaser.Physics.Arcade.Sprite;
  name: string;
  code: string;
  level: number;
  health: number;
  maxHealth: number;
  attackPower: number;
  lastAttackTime: number;
  startX: number;
  startY: number;
  healthBar: Phaser.GameObjects.Graphics;
  nameText: Phaser.GameObjects.Text;
}

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
  };
  private numberKeys!: Phaser.Input.Keyboard.Key[];
  private obstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;
  private npcs: { sprite: Phaser.GameObjects.Sprite; code: string; name: string; title: string; dialogue: string; x: number; y: number }[] = [];
  private enemies: EnemyInstance[] = [];
  private dayNightOverlay!: Phaser.GameObjects.Rectangle;
  private timeElapsed = 0;
  private playerHpBar!: Phaser.GameObjects.Graphics;
  private playerNameText!: Phaser.GameObjects.Text;
  private lastSaveTime = 0;

  constructor() {
    super('WorldScene');
  }

  create() {
    // 1. World Bounds (1600 x 1200)
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // 2. Build Tiled Environment
    this.buildMap();

    // 3. Spawn Obstacles
    this.obstaclesGroup = this.physics.add.staticGroup();
    this.spawnPillars();

    // 4. Spawn Player
    const initialChar = useGameStore.getState().character;
    const startX = initialChar?.posX || 450;
    const startY = initialChar?.posY || 380;

    this.player = this.physics.add.sprite(startX, startY, 'player_sprite');
    this.player.setCollideWorldBounds(true);
    this.player.setSize(24, 24);
    this.player.setOffset(4, 6);
    this.physics.add.collider(this.player, this.obstaclesGroup);

    // Player Overhead Name & HP Bar
    this.playerNameText = this.add.text(startX, startY - 26, initialChar?.name || 'Viajero', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#f0b232',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.playerHpBar = this.add.graphics();
    this.updatePlayerHpBar();

    // 5. Camera Follow
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.4);

    // 6. Setup Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        E: Phaser.Input.Keyboard.KeyCodes.E,
      }) as any;

      this.numberKeys = [
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX),
      ];
    }

    // 7. Spawn NPCs
    this.spawnNPCs();

    // 8. Spawn Enemies
    this.spawnEnemies();

    // 9. Day / Night Overlay
    this.dayNightOverlay = this.add.rectangle(800, 600, 1600, 1200, 0x05051a, 0);
    this.dayNightOverlay.setDepth(100);

    // 10. Mouse click handling for interaction & target
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.handlePointerDown(pointer);
    });

    // Handle global skill casting from UI or keyboard
    (window as any).__PHASER_CAST_SKILL__ = (slot: number) => {
      this.executePlayerSkill(slot);
    };
  }

  private buildMap() {
    // Fill with grass
    for (let x = 0; x < 1600; x += 32) {
      for (let y = 0; y < 1200; y += 32) {
        this.add.image(x + 16, y + 16, 'tile_grass');
      }
    }

    // Cobblestone roads leading through the valley
    for (let x = 300; x < 900; x += 32) {
      this.add.image(x + 16, 400, 'tile_stone');
      this.add.image(x + 16, 432, 'tile_stone');
    }
    for (let y = 200; y < 900; y += 32) {
      this.add.image(500, y + 16, 'tile_stone');
      this.add.image(532, y + 16, 'tile_stone');
    }

    // Water river on the east
    for (let y = 0; y < 1200; y += 32) {
      this.add.image(1300, y + 16, 'tile_water');
      this.add.image(1332, y + 16, 'tile_water');
      this.add.image(1364, y + 16, 'tile_water');
    }
  }

  private spawnPillars() {
    const pillarPositions = [
      { x: 380, y: 280 },
      { x: 620, y: 280 },
      { x: 380, y: 520 },
      { x: 620, y: 520 },
      { x: 800, y: 200 },
      { x: 800, y: 700 },
      { x: 200, y: 750 },
    ];

    pillarPositions.forEach((pos) => {
      const pillar = this.obstaclesGroup.create(pos.x, pos.y, 'obstacle_pillar');
      pillar.setSize(24, 32);
      pillar.setOffset(4, 28);
    });
  }

  private spawnNPCs() {
    const npcConfigs = [
      {
        code: 'vaelen',
        name: 'Maestro Erudito Vaelen',
        title: 'Cronista del Alba',
        spriteKey: 'npc_vaelen',
        x: 420,
        y: 350,
        dialogue: 'Saludos, Viajero. Has despertado con la chispa del conocimiento intacta. El Vacío destruye no solo tierras, sino la capacidad misma de razonar y recordar. Si deseas detenerlo, debes recuperar los fragmentos de la Memoria y la Razón.',
      },
      {
        code: 'brom',
        name: 'Herrero Brom Martillofirme',
        title: 'Forjador Rúnico',
        spriteKey: 'npc_brom',
        x: 680,
        y: 420,
        dialogue: '¡Saludos! La fuerza de una espada depende de las proporciones del metal templado. Si estás listo para equiparte, revisa mis armaduras reforzadas para resistir las garras del Vacío.',
      },
      {
        code: 'lyra',
        name: 'Arcanista Lyra',
        title: 'Guardiana de los Manuscritos',
        spriteKey: 'npc_lyra',
        x: 350,
        y: 620,
        dialogue: 'He encontrado un manuscrito contradictorio sobre el origen del Vacío. Necesito una mente sagaz en Lectura Crítica para discernir la verdad oculta entre dos declaraciones.',
      },
    ];

    npcConfigs.forEach((cfg) => {
      const npcSprite = this.add.sprite(cfg.x, cfg.y, cfg.spriteKey);
      this.npcs.push({
        sprite: npcSprite,
        code: cfg.code,
        name: cfg.name,
        title: cfg.title,
        dialogue: cfg.dialogue,
        x: cfg.x,
        y: cfg.y,
      });

      // Name & Question Mark
      this.add.text(cfg.x, cfg.y - 24, cfg.name, {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#fbbf24',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5);

      this.add.text(cfg.x, cfg.y - 38, '!', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#facc15',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);
    });
  }

  private spawnEnemies() {
    const enemyConfigs = [
      { code: 'shadow_crawler', name: 'Sombra Menor del Vacío', level: 1, maxHealth: 65, attackPower: 8, x: 250, y: 250 },
      { code: 'shadow_crawler', name: 'Sombra Menor del Vacío', level: 1, maxHealth: 65, attackPower: 8, x: 850, y: 350 },
      { code: 'shadow_crawler', name: 'Sombra Menor del Vacío', level: 2, maxHealth: 90, attackPower: 11, x: 750, y: 700 },
      { code: 'hollow_wanderer', name: 'Desmemoriado Errante', level: 2, maxHealth: 95, attackPower: 12, x: 280, y: 800 },
      { code: 'hollow_wanderer', name: 'Desmemoriado Errante', level: 3, maxHealth: 130, attackPower: 15, x: 950, y: 600 },
    ];

    enemyConfigs.forEach((cfg) => {
      const sprite = this.physics.add.sprite(cfg.x, cfg.y, cfg.code === 'shadow_crawler' ? 'shadow_crawler' : 'hollow_wanderer');
      sprite.setCollideWorldBounds(true);
      sprite.setSize(22, 22);
      this.physics.add.collider(sprite, this.obstaclesGroup);

      const nameText = this.add.text(cfg.x, cfg.y - 22, `${cfg.name} [Nv.${cfg.level}]`, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#f87171',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5);

      const healthBar = this.add.graphics();

      const enemyInst: EnemyInstance = {
        sprite,
        name: cfg.name,
        code: cfg.code,
        level: cfg.level,
        health: cfg.maxHealth,
        maxHealth: cfg.maxHealth,
        attackPower: cfg.attackPower,
        lastAttackTime: 0,
        startX: cfg.x,
        startY: cfg.y,
        healthBar,
        nameText,
      };

      this.enemies.push(enemyInst);
      this.updateEnemyHpBar(enemyInst);
    });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

    // Check click on NPCs
    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(worldPoint.x, worldPoint.y, npc.x, npc.y);
      if (dist < 40) {
        this.interactWithNPC(npc);
        return;
      }
    }

    // Check click on Enemies
    for (const enemy of this.enemies) {
      if (enemy.health <= 0) continue;
      const dist = Phaser.Math.Distance.Between(worldPoint.x, worldPoint.y, enemy.sprite.x, enemy.sprite.y);
      if (dist < 35) {
        useGameStore.getState().setTargetEnemy({
          id: enemy.code,
          name: enemy.name,
          health: enemy.health,
          maxHealth: enemy.maxHealth,
          level: enemy.level,
        });
        return;
      }
    }
  }

  private interactWithNPC(npc: (typeof this.npcs)[0]) {
    const playerDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
    if (playerDist > 100) {
      useGameStore.getState().setNotification('Acércate más para hablar con ' + npc.name);
      return;
    }

    gameAudio.playButtonClick();

    // Advance quest talking objective if applicable
    useGameStore.getState().advanceQuestObjective('talk');

    // Build dialogue options based on NPC
    const options = [
      {
        text: '¿Cómo puedo ayudar a Aethoria?',
        action: () => {
          useGameStore.getState().closeDialogue();
          useGameStore.getState().openModal('quests');
        },
      },
    ];

    if (npc.code === 'lyra') {
      options.push({
        text: '🔍 Examinar manuscrito y resolver contradicciones (Lectura Crítica)',
        action: () => {
          useGameStore.getState().closeDialogue();
          useGameStore.getState().startLearningActivity(EDUCATIONAL_ACTIVITIES[0]);
        },
      });
    }

    if (npc.code === 'brom') {
      options.push({
        text: '⚙️ Calibrar compuertas hidráulicas de la forja (Matemáticas)',
        action: () => {
          useGameStore.getState().closeDialogue();
          useGameStore.getState().startLearningActivity(EDUCATIONAL_ACTIVITIES[1]);
        },
      });
      options.push({
        text: '🏗️ Equilibrar la polea de la reja principal (Física)',
        action: () => {
          useGameStore.getState().closeDialogue();
          useGameStore.getState().startLearningActivity(EDUCATIONAL_ACTIVITIES[2]);
        },
      });
    }

    options.push({
      text: 'Despedirse',
      action: () => useGameStore.getState().closeDialogue(),
    });

    useGameStore.getState().startDialogue({
      npcName: npc.name,
      title: npc.title,
      text: npc.dialogue,
      options,
    });
  }

  private executePlayerSkill(slotIndex: number) {
    const castSuccess = useGameStore.getState().castSkill(slotIndex);
    if (!castSuccess) return;

    // Find closest enemy within range
    let closestEnemy: EnemyInstance | null = null;
    let minDist = 200;

    for (const enemy of this.enemies) {
      if (enemy.health <= 0) continue;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.sprite.x, enemy.sprite.y);
      if (dist < minDist) {
        minDist = dist;
        closestEnemy = enemy;
      }
    }

    if (closestEnemy) {
      // Spawn Visual Effect
      const isMagic = slotIndex === 1 || slotIndex === 2;
      const vfxKey = isMagic ? 'vfx_arcane_bolt' : 'vfx_slash';
      const vfx = this.add.sprite(closestEnemy.sprite.x, closestEnemy.sprite.y, vfxKey);
      vfx.setScale(1.3);
      this.tweens.add({
        targets: vfx,
        alpha: 0,
        scale: 1.8,
        duration: 300,
        onComplete: () => vfx.destroy(),
      });

      // Calculate Damage
      const char = useGameStore.getState().character;
      const baseDamage = 25 + (char?.attributes.strength || 10) * 1.5;
      const damageDealt = Math.round(baseDamage * (0.9 + Math.random() * 0.3));

      closestEnemy.health = Math.max(0, closestEnemy.health - damageDealt);
      this.updateEnemyHpBar(closestEnemy);
      gameAudio.playHit();

      // Show Floating Damage
      this.showFloatingText(closestEnemy.sprite.x, closestEnemy.sprite.y - 15, `-${damageDealt}`, '#ef4444');

      // Update target window
      useGameStore.getState().setTargetEnemy({
        id: closestEnemy.code,
        name: closestEnemy.name,
        health: closestEnemy.health,
        maxHealth: closestEnemy.maxHealth,
        level: closestEnemy.level,
      });

      // Enemy Died
      if (closestEnemy.health <= 0) {
        this.handleEnemyDefeat(closestEnemy);
      }
    } else {
      useGameStore.getState().setNotification('No hay enemigos al alcance');
    }
  }

  private async handleEnemyDefeat(enemy: EnemyInstance) {
    enemy.sprite.setTint(0x333333);
    enemy.nameText.setVisible(false);
    enemy.healthBar.clear();

    this.showFloatingText(enemy.sprite.x, enemy.sprite.y, '¡DERROTADO!', '#facc15');

    // Advance kill quests
    useGameStore.getState().advanceQuestObjective('kill', 1);

    // Call server action to securely award experience & gold
    const char = useGameStore.getState().character;
    if (char) {
      try {
        const res = await fetch('/api/game/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterId: char.id,
            enemyCode: enemy.code,
            enemyLevel: enemy.level,
          }),
        });
        const data = await res.json();
        if (data.success && data.character) {
          useGameStore.getState().setCharacter(data.character);
          useGameStore.getState().setNotification(`+${data.expGained} EXP | +${data.goldGained} Oro`);
          if (data.leveledUp) {
            gameAudio.playLevelUp();
            this.showFloatingText(this.player.x, this.player.y - 40, '¡NIVEL AUMENTADO!', '#38bdf8');
          }
        }
      } catch (err) {
        console.error('Failed to report enemy kill:', err);
      }
    }

    // Respawn after 12 seconds
    this.time.delayedCall(12000, () => {
      enemy.health = enemy.maxHealth;
      enemy.sprite.setPosition(enemy.startX, enemy.startY);
      enemy.sprite.clearTint();
      enemy.nameText.setVisible(true);
      this.updateEnemyHpBar(enemy);
    });
  }

  private showFloatingText(x: number, y: number, text: string, color: string) {
    const fText = this.add.text(x, y, text, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: fText,
      y: y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => fText.destroy(),
    });
  }

  private updatePlayerHpBar() {
    const char = useGameStore.getState().character;
    const hp = char?.health || 100;
    const maxHp = char?.maxHealth || 100;
    const pct = Math.max(0, Math.min(1, hp / maxHp));

    this.playerHpBar.clear();
    // Background bar
    this.playerHpBar.fillStyle(0x1f2937, 0.8);
    this.playerHpBar.fillRect(this.player.x - 16, this.player.y - 18, 32, 4);
    // Fill bar
    this.playerHpBar.fillStyle(0x22c55e, 1);
    this.playerHpBar.fillRect(this.player.x - 16, this.player.y - 18, 32 * pct, 4);
  }

  private updateEnemyHpBar(enemy: EnemyInstance) {
    const pct = Math.max(0, Math.min(1, enemy.health / enemy.maxHealth));
    enemy.healthBar.clear();
    if (enemy.health > 0) {
      enemy.healthBar.fillStyle(0x1f2937, 0.8);
      enemy.healthBar.fillRect(enemy.sprite.x - 16, enemy.sprite.y - 15, 32, 4);
      enemy.healthBar.fillStyle(0xef4444, 1);
      enemy.healthBar.fillRect(enemy.sprite.x - 16, enemy.sprite.y - 15, 32 * pct, 4);
    }
  }

  update(time: number, delta: number) {
    this.timeElapsed += delta;

    // Day / Night cycle (subtle shift every few minutes)
    const cycleProgress = Math.sin(this.timeElapsed / 60000); // oscillates
    const darkness = Phaser.Math.Clamp((cycleProgress + 0.3) * 0.35, 0, 0.45);
    this.dayNightOverlay.setAlpha(darkness);

    // Player Movement Controls
    const speed = 150;
    let vx = 0;
    let vy = 0;

    const isLeft = this.cursors.left.isDown || this.wasdKeys?.A.isDown;
    const isRight = this.cursors.right.isDown || this.wasdKeys?.D.isDown;
    const isUp = this.cursors.up.isDown || this.wasdKeys?.W.isDown;
    const isDown = this.cursors.down.isDown || this.wasdKeys?.S.isDown;

    if (isLeft) vx -= speed;
    if (isRight) vx += speed;
    if (isUp) vy -= speed;
    if (isDown) vy += speed;

    // Normalize diagonal speed
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.player.setVelocity(vx, vy);

    // Update Player overhead HUD
    this.playerNameText.setPosition(this.player.x, this.player.y - 26);
    this.updatePlayerHpBar();

    // Check 'E' Key for interaction
    if (Phaser.Input.Keyboard.JustDown(this.wasdKeys?.E)) {
      for (const npc of this.npcs) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
        if (dist < 80) {
          this.interactWithNPC(npc);
          break;
        }
      }
    }

    // Check Number Keys 1-6 for Abilities
    for (let i = 0; i < 6; i++) {
      if (this.numberKeys[i] && Phaser.Input.Keyboard.JustDown(this.numberKeys[i])) {
        this.executePlayerSkill(i);
      }
    }

    // Enemies AI & Update
    const now = Date.now();
    for (const enemy of this.enemies) {
      if (enemy.health <= 0) continue;

      enemy.nameText.setPosition(enemy.sprite.x, enemy.sprite.y - 22);
      this.updateEnemyHpBar(enemy);

      const distToPlayer = Phaser.Math.Distance.Between(enemy.sprite.x, enemy.sprite.y, this.player.x, this.player.y);

      // Aggro pursue
      if (distToPlayer < 140 && distToPlayer > 30) {
        this.physics.moveToObject(enemy.sprite, this.player, 65);
      } else if (distToPlayer <= 30) {
        enemy.sprite.setVelocity(0, 0);

        // Attack Player periodically
        if (now - enemy.lastAttackTime > 2000) {
          enemy.lastAttackTime = now;
          const char = useGameStore.getState().character;
          if (char) {
            const newHp = Math.max(0, char.health - enemy.attackPower);
            useGameStore.getState().updateStats({ health: newHp });
            gameAudio.playHit();
            this.showFloatingText(this.player.x, this.player.y - 15, `-${enemy.attackPower}`, '#dc2626');
          }
        }
      } else {
        // Return to start position if strayed far
        const distToStart = Phaser.Math.Distance.Between(enemy.sprite.x, enemy.sprite.y, enemy.startX, enemy.startY);
        if (distToStart > 40) {
          this.physics.moveTo(enemy.sprite, enemy.startX, enemy.startY, 40);
        } else {
          enemy.sprite.setVelocity(0, 0);
        }
      }
    }

    // Autosave coordinates every 10 seconds
    if (now - this.lastSaveTime > 10000) {
      this.lastSaveTime = now;
      const char = useGameStore.getState().character;
      if (char) {
        fetch('/api/game/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterId: char.id,
            posX: Math.round(this.player.x),
            posY: Math.round(this.player.y),
            health: char.health,
            resource: char.resource,
          }),
        }).catch(() => {});
      }
    }
  }
}
