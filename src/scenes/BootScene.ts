import Phaser from 'phaser';
import { clearHud } from '../ui/domHud';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
    this.load.image('camp-base', asset('assets/map/camp-base.png'));
    this.load.image('stars-bg', asset('assets/minigames/stars-bg.png'));
    this.load.image('fleet-bg', asset('assets/minigames/fleet-bg.png'));
    this.load.image('drum-bg', asset('assets/minigames/drum-bg.png'));
    this.load.image('victory-ending', asset('assets/endings/victory.png'));
    this.load.image('boat-prop', asset('assets/props/prop-0.png'));
    this.load.image('tent-prop', asset('assets/props/prop-1.png'));
    this.load.image('drum-prop', asset('assets/props/prop-2.png'));
    this.load.image('arrows-prop', asset('assets/props/prop-3.png'));
    this.load.image('portrait-caocao', asset('assets/portraits/caocao.png'));
    this.load.image('portrait-lusu', asset('assets/portraits/lusu.png'));
    this.load.image('portrait-zhouyu', asset('assets/portraits/zhouyu.png'));
    this.load.image('portrait-zhuge', asset('assets/portraits/zhuge.png'));
    this.load.spritesheet('characters', asset('assets/characters/sheet-transparent.png'), {
      frameWidth: 256,
      frameHeight: 256,
    });
  }

  create() {
    clearHud();
    this.createFallbackTextures();
    this.scene.start('ExploreScene');
  }

  private createFallbackTextures() {
    const g = this.add.graphics();
    const colors = [0xf3e7c5, 0xd75f4d, 0x83b47b, 0x5d4a89];
    colors.forEach((color, index) => {
      g.clear();
      g.fillStyle(color, 1);
      g.fillRoundedRect(18, 10, 28, 46, 6);
      g.fillStyle(0x1b1f24, 1);
      g.fillRect(22, 20, 20, 5);
      g.generateTexture(`char-${index}`, 64, 64);
    });
    g.clear();
    g.fillStyle(0x8b5a2b, 1);
    g.fillRoundedRect(0, 10, 160, 42, 12);
    g.fillStyle(0xd6b06a, 1);
    g.fillRect(24, 0, 18, 42);
    g.fillRect(72, 0, 18, 42);
    g.fillRect(120, 0, 18, 42);
    g.generateTexture('straw-boat', 160, 64);
    g.destroy();
  }
}
