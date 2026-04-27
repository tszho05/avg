import Phaser from 'phaser';
import { flags } from '../systems/progress';
import { clearHud, setStatus } from '../ui/domHud';

const totalBeats = 6;
const hitWindowMs = 350;
const beatIntervalMs = 1600;
const ringDurationMs = 1300;
const drumX = 512;
const drumY = 430;
const targetRingRadius = 112;
const startRingRadius = 220;

export class DrumScene extends Phaser.Scene {
  private beatIndex = 0;
  private score = 0;
  private misses = 0;
  private beatStartedAt = 0;
  private judgedThisBeat = false;
  private failed = false;
  private returnNode = 'after_drum';
  private currentRing?: Phaser.GameObjects.Arc;

  constructor() {
    super('DrumScene');
  }

  init(data: { returnNode?: string }) {
    this.returnNode = data.returnNode ?? 'after_drum';
  }

  create() {
    clearHud();
    this.beatIndex = 0;
    this.score = 0;
    this.misses = 0;
    this.failed = false;
    this.add.image(512, 384, 'drum-bg').setDisplaySize(1024, 768);
    this.add.rectangle(512, 384, 1024, 768, 0x201820, 0.2);
    this.add.text(512, 54, '關卡三：鼓聲引箭', {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '38px',
      color: '#f4ca75',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(512, 102, '鼓圈收束到金環附近時點擊。太早、太遲或沒點都算失誤。', {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '22px',
      color: '#fff6e3',
    }).setOrigin(0.5);

    this.add.image(drumX, drumY, 'drum-prop').setDisplaySize(250, 250).setDepth(2);
    this.add.circle(drumX, drumY, targetRingRadius).setStrokeStyle(6, 0xf4ca75, 0.72).setDepth(3);
    this.input.on('pointerup', () => this.hit());
    this.refreshStatus();
    this.startBeat();
  }

  private startBeat() {
    if (this.failed) return;
    if (this.beatIndex >= totalBeats) {
      this.finish();
      return;
    }
    this.judgedThisBeat = false;
    this.beatStartedAt = this.time.now;
    this.currentRing = this.add.circle(drumX, drumY, startRingRadius).setStrokeStyle(8, 0x9fc8c2, 0.9).setDepth(4);
    this.tweens.add({
      targets: this.currentRing,
      radius: targetRingRadius,
      alpha: 0.34,
      duration: ringDurationMs,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.currentRing?.destroy();
        if (!this.judgedThisBeat) this.miss('MISS');
      },
    });
    this.time.delayedCall(beatIntervalMs, () => {
      if (this.failed) return;
      this.beatIndex += 1;
      this.startBeat();
    });
    this.refreshStatus();
  }

  private hit() {
    if (this.judgedThisBeat || this.beatIndex >= totalBeats) return;
    const elapsed = this.time.now - this.beatStartedAt;
    const delta = Math.abs(elapsed - ringDurationMs);
    if (delta <= hitWindowMs) {
      this.judgedThisBeat = true;
      this.score += 1;
      this.cameras.main.flash(80, 244, 202, 117);
      this.addJudgeText('GOOD', 0x9ff0d0);
      this.addArrow();
      this.refreshStatus();
      return;
    }
    this.miss(elapsed < ringDurationMs ? '太早' : '太遲');
  }

  private miss(label: string) {
    if (this.judgedThisBeat) return;
    this.judgedThisBeat = true;
    this.misses += 1;
    this.addJudgeText(label, 0xff8a75);
    this.refreshStatus();
    if (this.misses > 3) {
      this.failed = true;
      this.currentRing?.destroy();
      this.time.delayedCall(350, () => this.scene.start('EndingScene', { ending: 'badDrum' }));
    }
  }

  private finish() {
    if (this.failed) return;
    flags.drumScore = this.score;
    this.scene.start('AvgScene', { nodeId: this.returnNode });
  }

  private addJudgeText(label: string, color: number) {
    const text = this.add.text(512, 230, label, {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '44px',
      color: Phaser.Display.Color.IntegerToColor(color).rgba,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.tweens.add({
      targets: text,
      y: 200,
      alpha: 0,
      duration: 500,
      onComplete: () => text.destroy(),
    });
  }

  private addArrow() {
    const x = Phaser.Math.Between(210, 820);
    const y = Phaser.Math.Between(230, 610);
    this.add.rectangle(x, y, 74, 4, 0xe8d6a8).setRotation(Phaser.Math.FloatBetween(-0.5, 0.5));
  }

  private refreshStatus() {
    setStatus([`鼓點 ${Math.min(this.beatIndex + 1, totalBeats)}/${totalBeats}`, `成功 ${this.score}`, `失誤 ${this.misses}/4`]);
  }
}
