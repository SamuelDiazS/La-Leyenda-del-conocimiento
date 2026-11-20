import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Generate all game textures procedurally in-memory
    this.createTerrainTextures();
    this.createCharacterTextures();
    this.createEnemyTextures();
    this.createVfxTextures();
  }

  create() {
    this.scene.start('WorldScene');
  }

  private createTerrainTextures() {
    // 1. Grass Tile (32x32)
    const grassCanvas = document.createElement('canvas');
    grassCanvas.width = 32;
    grassCanvas.height = 32;
    const gctx = grassCanvas.getContext('2d')!;
    gctx.fillStyle = '#1e3a1e';
    gctx.fillRect(0, 0, 32, 32);
    gctx.fillStyle = '#2d5a27';
    gctx.fillRect(4, 4, 8, 8);
    gctx.fillRect(20, 16, 6, 6);
    gctx.fillStyle = '#152b15';
    gctx.fillRect(12, 22, 6, 4);
    this.textures.addCanvas('tile_grass', grassCanvas);

    // 2. Stone Road Tile (32x32)
    const stoneCanvas = document.createElement('canvas');
    stoneCanvas.width = 32;
    stoneCanvas.height = 32;
    const sctx = stoneCanvas.getContext('2d')!;
    sctx.fillStyle = '#3a3f58';
    sctx.fillRect(0, 0, 32, 32);
    sctx.strokeStyle = '#222538';
    sctx.lineWidth = 1;
    sctx.strokeRect(1, 1, 14, 14);
    sctx.strokeRect(17, 1, 14, 14);
    sctx.strokeRect(1, 17, 14, 14);
    sctx.strokeRect(17, 17, 14, 14);
    this.textures.addCanvas('tile_stone', stoneCanvas);

    // 3. Water Tile (32x32)
    const waterCanvas = document.createElement('canvas');
    waterCanvas.width = 32;
    waterCanvas.height = 32;
    const wctx = waterCanvas.getContext('2d')!;
    wctx.fillStyle = '#1e3a5f';
    wctx.fillRect(0, 0, 32, 32);
    wctx.fillStyle = '#38bdf8';
    wctx.fillRect(4, 10, 12, 2);
    wctx.fillRect(16, 22, 10, 2);
    this.textures.addCanvas('tile_water', waterCanvas);

    // 4. Ancient Runic Pillar (32x64)
    const pillarCanvas = document.createElement('canvas');
    pillarCanvas.width = 32;
    pillarCanvas.height = 64;
    const pctx = pillarCanvas.getContext('2d')!;
    pctx.fillStyle = '#475569';
    pctx.fillRect(4, 8, 24, 52);
    pctx.fillStyle = '#94a3b8';
    pctx.fillRect(2, 4, 28, 8);
    pctx.fillRect(2, 54, 28, 8);
    // Glowing rune
    pctx.fillStyle = '#38bdf8';
    pctx.fillRect(14, 24, 4, 16);
    pctx.fillRect(10, 28, 12, 4);
    this.textures.addCanvas('obstacle_pillar', pillarCanvas);
  }

  private createCharacterTextures() {
    // Player base sprite (32x32)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const ctx = pCanvas.getContext('2d')!;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (Armor)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(10, 12, 12, 12);

    // Head
    ctx.fillStyle = '#f8d5b8';
    ctx.beginPath();
    ctx.arc(16, 8, 6, 0, Math.PI * 2);
    ctx.fill();

    // Helmet / Hair
    ctx.fillStyle = '#c89b3c';
    ctx.fillRect(11, 2, 10, 4);

    // Sword in hand
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(24, 8, 3, 14);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(22, 14, 7, 2);

    // Shield
    ctx.fillStyle = '#b45309';
    ctx.fillRect(5, 12, 4, 10);

    this.textures.addCanvas('player_sprite', pCanvas);

    // NPC Vaelen (White robe Elder)
    const vCanvas = document.createElement('canvas');
    vCanvas.width = 32;
    vCanvas.height = 32;
    const vctx = vCanvas.getContext('2d')!;
    vctx.fillStyle = 'rgba(0,0,0,0.3)';
    vctx.beginPath();
    vctx.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2);
    vctx.fill();
    vctx.fillStyle = '#f1f5f9';
    vctx.fillRect(9, 10, 14, 16);
    vctx.fillStyle = '#fcd34d';
    vctx.fillRect(8, 8, 16, 3);
    vctx.fillStyle = '#f8d5b8';
    vctx.beginPath();
    vctx.arc(16, 7, 5, 0, Math.PI * 2);
    vctx.fill();
    // Long beard
    vctx.fillStyle = '#e2e8f0';
    vctx.fillRect(14, 9, 4, 8);
    // Staff
    vctx.fillStyle = '#78350f';
    vctx.fillRect(25, 4, 2, 22);
    vctx.fillStyle = '#38bdf8';
    vctx.beginPath();
    vctx.arc(26, 4, 3, 0, Math.PI * 2);
    vctx.fill();
    this.textures.addCanvas('npc_vaelen', vCanvas);

    // NPC Brom (Dwarf Blacksmith)
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 32;
    bCanvas.height = 32;
    const bctx = bCanvas.getContext('2d')!;
    bctx.fillStyle = 'rgba(0,0,0,0.3)';
    bctx.beginPath();
    bctx.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2);
    bctx.fill();
    bctx.fillStyle = '#7c2d12';
    bctx.fillRect(8, 14, 16, 12);
    bctx.fillStyle = '#f8d5b8';
    bctx.fillRect(11, 8, 10, 7);
    bctx.fillStyle = '#b45309';
    bctx.fillRect(10, 12, 12, 7); // orange beard
    bctx.fillStyle = '#94a3b8';
    bctx.fillRect(24, 14, 6, 8); // hammer head
    bctx.fillStyle = '#451a03';
    bctx.fillRect(23, 17, 2, 10);
    this.textures.addCanvas('npc_brom', bCanvas);

    // NPC Lyra (Elf Arcanist)
    const lCanvas = document.createElement('canvas');
    lCanvas.width = 32;
    lCanvas.height = 32;
    const lctx = lCanvas.getContext('2d')!;
    lctx.fillStyle = 'rgba(0,0,0,0.3)';
    lctx.beginPath();
    lctx.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2);
    lctx.fill();
    lctx.fillStyle = '#7c3aed';
    lctx.fillRect(10, 10, 12, 16);
    lctx.fillStyle = '#fde047'; // blonde elf hair
    lctx.fillRect(9, 4, 14, 8);
    lctx.fillStyle = '#f8d5b8';
    lctx.fillRect(11, 7, 10, 6);
    this.textures.addCanvas('npc_lyra', lCanvas);
  }

  private createEnemyTextures() {
    // 1. Sombra Menor del Vacío (Purple crawler with glowing red eye)
    const e1Canvas = document.createElement('canvas');
    e1Canvas.width = 32;
    e1Canvas.height = 32;
    const ctx1 = e1Canvas.getContext('2d')!;
    ctx1.fillStyle = 'rgba(0,0,0,0.3)';
    ctx1.beginPath();
    ctx1.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2);
    ctx1.fill();
    ctx1.fillStyle = '#4c1d95';
    ctx1.beginPath();
    ctx1.arc(16, 16, 10, 0, Math.PI * 2);
    ctx1.fill();
    // Spikes
    ctx1.fillStyle = '#6b21a8';
    ctx1.fillRect(6, 6, 4, 4);
    ctx1.fillRect(22, 6, 4, 4);
    ctx1.fillRect(14, 2, 4, 4);
    // Eye of the Void
    ctx1.fillStyle = '#ef4444';
    ctx1.beginPath();
    ctx1.arc(16, 16, 3, 0, Math.PI * 2);
    ctx1.fill();
    this.textures.addCanvas('shadow_crawler', e1Canvas);

    // 2. Desmemoriado Errante (Ghostly humanoid)
    const e2Canvas = document.createElement('canvas');
    e2Canvas.width = 32;
    e2Canvas.height = 32;
    const ctx2 = e2Canvas.getContext('2d')!;
    ctx2.fillStyle = 'rgba(100, 116, 139, 0.7)';
    ctx2.fillRect(10, 8, 12, 18);
    ctx2.fillStyle = '#e2e8f0';
    ctx2.beginPath();
    ctx2.arc(16, 8, 5, 0, Math.PI * 2);
    ctx2.fill();
    ctx2.fillStyle = '#06b6d4';
    ctx2.fillRect(13, 7, 2, 2);
    ctx2.fillRect(17, 7, 2, 2);
    this.textures.addCanvas('hollow_wanderer', e2Canvas);
  }

  private createVfxTextures() {
    // Slash Arc
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 48;
    sCanvas.height = 48;
    const sctx = sCanvas.getContext('2d')!;
    sctx.strokeStyle = '#f8fafc';
    sctx.lineWidth = 3;
    sctx.beginPath();
    sctx.arc(24, 24, 20, -Math.PI / 4, Math.PI / 2);
    sctx.stroke();
    sctx.strokeStyle = '#38bdf8';
    sctx.lineWidth = 1;
    sctx.beginPath();
    sctx.arc(24, 24, 18, -Math.PI / 4, Math.PI / 2);
    sctx.stroke();
    this.textures.addCanvas('vfx_slash', sCanvas);

    // Arcane Bolt
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 16;
    bCanvas.height = 16;
    const bctx = bCanvas.getContext('2d')!;
    bctx.fillStyle = '#38bdf8';
    bctx.beginPath();
    bctx.arc(8, 8, 6, 0, Math.PI * 2);
    bctx.fill();
    bctx.fillStyle = '#ffffff';
    bctx.beginPath();
    bctx.arc(8, 8, 3, 0, Math.PI * 2);
    bctx.fill();
    this.textures.addCanvas('vfx_arcane_bolt', bCanvas);
  }
}
