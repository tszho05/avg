import Phaser from 'phaser';
import { flags } from '../systems/progress';
import { clearActionPanel, clearHud, setStatus, showActionPanel } from '../ui/domHud';

export class FleetScene extends Phaser.Scene {
  private boats: Phaser.GameObjects.Image[] = [];
  private returnNode = 'after_fleet';
  private completed = false;

  constructor() {
    super('FleetScene');
  }

  init(data: { returnNode?: string }) {
    this.returnNode = data.returnNode ?? 'after_fleet';
  }

  create() {
    clearHud();
    this.boats = [];
    this.completed = false;
    this.add.image(512, 384, 'fleet-bg').setDisplaySize(1024, 768);
    this.add.rectangle(512, 384, 1024, 768, 0x173342, 0.18);
    this.add.text(512, 54, '關卡二：霧中行船', {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '38px',
      color: '#f4ca75',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(512, 102, '拖曳船隊靠近虛線陣位，三船成列後接近曹營。', {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '22px',
      color: '#fff6e3',
    }).setOrigin(0.5);

    [270, 384, 498].forEach((y, index) => {
      this.add.rectangle(760, y, 180, 74).setStrokeStyle(3, 0xf4ca75, 0.75);
      const boat = this.add.image(230, y + Phaser.Math.Between(-45, 45), 'boat-prop').setInteractive({ draggable: true });
      boat.setDisplaySize(150, 70);
      boat.setData('targetY', y);
      boat.setData('index', index);
      this.boats.push(boat);
    });

    this.input.on('drag', (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
      obj.x = Phaser.Math.Clamp(dragX, 100, 900);
      obj.y = Phaser.Math.Clamp(dragY, 170, 590);
    });
    this.input.on('dragend', () => this.evaluate());
    this.refreshStatus(0);
    this.showRouteControls();
  }

  private showRouteControls() {
    showActionPanel('派出草船到指定位置', [
      { label: '第 1 艘到上路線', onPress: () => this.placeBoat(0) },
      { label: '第 2 艘到中路線', onPress: () => this.placeBoat(1) },
      { label: '第 3 艘到下路線', onPress: () => this.placeBoat(2) },
    ]);
  }

  private placeBoat(index: number) {
    const boat = this.boats[index];
    if (!boat || this.completed) return;
    this.tweens.killTweensOf(boat);
    this.tweens.add({
      targets: boat,
      x: 760,
      y: Number(boat.getData('targetY')),
      duration: 260,
      ease: 'Sine.easeOut',
      onComplete: () => this.evaluate(),
    });
  }

  private evaluate() {
    if (this.completed) return;
    let score = 0;
    this.boats.forEach((boat) => {
      const dx = Math.abs(boat.x - 760);
      const dy = Math.abs(boat.y - Number(boat.getData('targetY')));
      if (dx < 100 && dy < 48) score += 1;
    });
    this.refreshStatus(score);
    if (score >= 3) {
      this.completed = true;
      flags.formationScore = 3;
      flags.stage = 'drum';
      clearActionPanel();
      this.time.delayedCall(450, () => this.scene.start('AvgScene', { nodeId: this.returnNode }));
    }
  }

  private refreshStatus(score: number) {
    setStatus([`陣形 ${score}/3`, '拖曳或按下方按鈕排船']);
  }
}
