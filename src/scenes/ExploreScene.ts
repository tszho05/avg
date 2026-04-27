import Phaser from 'phaser';
import { flags } from '../systems/progress';
import { clearHud, setStatus } from '../ui/domHud';

type MapObject = {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  frame?: number;
  texture?: string;
  node?: string;
  visible: () => boolean;
};

const objects: MapObject[] = [
  {
    id: 'zhouyu',
    label: '周瑜',
    x: 454,
    y: 408,
    radius: 76,
    frame: 1,
    node: 'opening',
    visible: () => flags.stage === 'start',
  },
  {
    id: 'rusu',
    label: '魯肅',
    x: 625,
    y: 462,
    radius: 76,
    frame: 2,
    node: 'rusu_plan',
    visible: () => flags.stage === 'rusu',
  },
  {
    id: 'boats',
    label: '草船',
    x: 780,
    y: 565,
    radius: 60,
    texture: 'boat-prop',
    node: 'after_star',
    visible: () => flags.stage === 'fleet',
  },
  {
    id: 'drum',
    label: '戰鼓',
    x: 286,
    y: 520,
    radius: 57,
    texture: 'drum-prop',
    node: 'after_fleet',
    visible: () => flags.stage === 'drum',
  },
];

export class ExploreScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private target = new Phaser.Math.Vector2(300, 430);
  private blockers: Phaser.Geom.Rectangle[] = [];
  private activeObject?: MapObject;
  private lastTrigger = 0;
  private inputReadyAt = 0;

  constructor() {
    super('ExploreScene');
  }

  create() {
    clearHud();
    this.activeObject = undefined;
    this.lastTrigger = 0;
    this.drawMap();
    this.createPlayer();
    this.target.set(this.player.x, this.player.y);
    this.inputReadyAt = this.time.now + 300;
    this.input.removeAllListeners('pointerdown');
    this.input.on('pointerdown', this.handlePointerDown, this);
    setStatus(['點擊地圖移動', '靠近角色或物件會觸發事件']);
  }

  update(_time: number, delta: number) {
    this.movePlayer(delta);
    this.checkTriggers();
  }

  private drawMap() {
    this.add.image(512, 384, 'camp-base').setDisplaySize(1024, 768);
    this.blockers = [
      new Phaser.Geom.Rectangle(360, 206, 250, 140),
      new Phaser.Geom.Rectangle(110, 540, 210, 96),
      new Phaser.Geom.Rectangle(790, 510, 150, 120),
      new Phaser.Geom.Rectangle(0, 650, 1024, 118),
    ];

    this.add.image(470, 265, 'tent-prop').setDisplaySize(230, 150).setDepth(4);
    this.add.image(840, 585, 'boat-prop').setDisplaySize(170, 78).setDepth(4);
    this.add.image(225, 555, 'drum-prop').setDisplaySize(110, 126).setDepth(4);
    this.add.text(30, 28, '東吳水寨', {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '34px',
      color: '#f4ca75',
      fontStyle: 'bold',
    }).setDepth(20);

    objects.filter((object) => object.visible()).forEach((object) => {
      const sprite = object.texture
        ? this.add.image(object.x, object.y, object.texture)
        : this.add.sprite(object.x, object.y, 'characters', object.frame ?? 0);
      sprite.setDisplaySize(object.texture ? 122 : 148, object.texture ? 62 : 148).setDepth(8);
      this.add.text(object.x, object.y + (object.texture ? 52 : 88), object.label, {
        fontFamily: 'Microsoft JhengHei',
        fontSize: '18px',
        color: '#fff6e3',
        backgroundColor: 'rgba(10,14,18,0.65)',
        padding: { x: 6, y: 3 },
      }).setOrigin(0.5).setDepth(20);
      this.add.circle(object.x, object.y, object.radius, 0xf4ca75, 0.08).setStrokeStyle(2, 0xf4ca75, 0.4);
    });
  }

  private createPlayer() {
    this.player = this.add.sprite(300, 430, 'characters', 0).setDisplaySize(152, 152).setDepth(10);
    this.add.circle(this.player.x, this.player.y + 52, 38, 0x101820, 0.24).setDepth(9);
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    if (this.time.now < this.inputReadyAt) return;
    this.target.set(pointer.worldX, pointer.worldY);
  }

  private movePlayer(delta: number) {
    const current = new Phaser.Math.Vector2(this.player.x, this.player.y);
    const distance = current.distance(this.target);
    if (distance < 4) return;
    const step = Math.min(distance, (delta / 1000) * 190);
    const next = current.lerp(this.target, step / distance);
    const body = new Phaser.Geom.Rectangle(next.x - 18, next.y - 22, 36, 44);
    if (this.blockers.some((blocker) => Phaser.Geom.Intersects.RectangleToRectangle(blocker, body))) {
      this.target.set(this.player.x, this.player.y);
      return;
    }
    this.player.setPosition(next.x, next.y);
  }

  private checkTriggers() {
    const now = this.time.now;
    if (now - this.lastTrigger < 900) return;
    const nearby = objects.find((object) => object.visible() && Phaser.Math.Distance.Between(this.player.x, this.player.y, object.x, object.y) < object.radius);
    if (!nearby || nearby.id === this.activeObject?.id) return;
    this.activeObject = nearby;
    this.lastTrigger = now;
    if (nearby.node) {
      this.startNode(nearby);
    }
  }

  private startNode(object: MapObject) {
    clearHud();
    this.scene.start('AvgScene', { nodeId: object.node });
  }
}
