import Phaser from 'phaser';
import { endings } from '../data/story';
import { flags, resetProgress } from '../systems/progress';
import { clearHud, showDialogue } from '../ui/domHud';

export class EndingScene extends Phaser.Scene {
  private ending = 'happyA';
  private index = 0;

  constructor() {
    super('EndingScene');
  }

  init(data: { ending?: string }) {
    this.ending = data.ending ?? flags.ending ?? 'happyA';
    flags.ending = this.ending;
    flags.stage = this.isHappyEnding() ? 'complete' : flags.stage;
    this.index = 0;
  }

  create() {
    const isHappy = this.isHappyEnding();
    this.add.image(512, 384, isHappy ? 'fleet-bg' : 'drum-bg').setDisplaySize(1024, 768).setAlpha(0.76);
    this.add.rectangle(512, 384, 1024, 768, 0x101820, isHappy ? 0.22 : 0.5);
    this.add.text(512, 64, isHappy ? '凱旋' : '失敗結局', {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '52px',
      color: '#f4ca75',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    if (isHappy) {
      this.add.image(512, 210, 'victory-ending').setDisplaySize(620, 212).setDepth(2);
    }

    this.showLine();
  }

  private showLine() {
    const lines = endings[this.ending] ?? endings.happyA;
    const line = lines[this.index];
    const isFinal = this.index >= lines.length - 1;
    const isHappy = this.isHappyEnding();
    const finalText = isHappy ? this.formatHappyText(line.text) : `${line.text}\n錯誤選擇會通往不同結局`;
    showDialogue(
      {
        speaker: line.speaker,
        text: isFinal ? finalText : line.text,
        choices: isFinal
          ? [
              {
                label: isHappy ? '重新開始整個故事' : '回到地圖重新挑戰',
              },
            ]
          : undefined,
      },
      () => {
        if (!isFinal) {
          this.index += 1;
          this.showLine();
          return;
        }
        clearHud();
        resetProgress();
        this.scene.start('ExploreScene');
      },
    );
  }

  private isHappyEnding() {
    return this.ending.startsWith('happy');
  }

  private formatHappyText(text: string) {
    return text
      .replace(/([。！？])/g, '$1\n')
      .replace(/\n+/g, '\n')
      .trim();
  }
}
