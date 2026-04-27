import Phaser from 'phaser';
import { flags } from '../systems/progress';
import { clearHud } from '../ui/domHud';

type Question = {
  prompt: string;
  options: [string, string];
  answer: string;
};

const questions: Question[] = [
  {
    prompt: '哪個天空比較容易有大霧？',
    options: ['天空佈滿雲朵', '天空星星多'],
    answer: '天空佈滿雲朵',
  },
  {
    prompt: '諸葛亮什麼時候出發比較好？',
    options: ['夜晚', '白天'],
    answer: '夜晚',
  },
  {
    prompt: '甚麼時候適合出發？',
    options: ['江面有濃霧看不清楚', '江面清清楚楚'],
    answer: '江面有濃霧看不清楚',
  },
];

export class StarScene extends Phaser.Scene {
  private index = 0;
  private returnNode = 'after_star';

  constructor() {
    super('StarScene');
  }

  init(data: { returnNode?: string }) {
    this.returnNode = data.returnNode ?? 'after_star';
    this.index = 0;
  }

  create() {
    clearHud();
    this.drawQuestion();
  }

  private drawQuestion() {
    this.children.removeAll();
    const question = questions[this.index];
    this.add.image(512, 384, 'stars-bg').setDisplaySize(1024, 768);
    this.add.rectangle(512, 384, 1024, 768, 0x101820, 0.28);
    this.add.text(512, 62, '關卡一：觀天象', {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '38px',
      color: '#f4ca75',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(512, 112, `第 ${this.index + 1} 題 / 3`, {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '22px',
      color: '#fff6e3',
    }).setOrigin(0.5);
    this.add.rectangle(512, 338, 760, 120, 0x101820, 0.72).setStrokeStyle(2, 0xf4ca75, 0.85);
    this.add.text(512, 338, question.prompt, {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '32px',
      color: '#fff6e3',
      align: 'center',
      wordWrap: { width: 680 },
    }).setOrigin(0.5);
    question.options.forEach((option, i) => this.createOption(330 + i * 365, 520, option));
  }

  private createOption(x: number, y: number, label: string) {
    const button = this.add.rectangle(x, y, 320, 82, 0x20394a, 0.92).setStrokeStyle(3, 0x9fc8c2);
    const text = this.add.text(x, y, label, {
      fontFamily: 'Microsoft JhengHei',
      fontSize: label.length > 10 ? '20px' : '25px',
      color: '#fff6e3',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 270 },
    }).setOrigin(0.5);
    [button, text].forEach((object) => {
      object.setInteractive({ useHandCursor: true });
      object.on('pointerup', () => this.answer(label));
    });
  }

  private answer(label: string) {
    const question = questions[this.index];
    if (label !== question.answer) {
      this.scene.start('EndingScene', { ending: 'badFogQuiz' });
      return;
    }
    this.index += 1;
    if (this.index >= questions.length) {
      flags.fogReading = 3;
      flags.stage = 'fleet';
      this.scene.start('AvgScene', { nodeId: this.returnNode });
      return;
    }
    this.drawQuestion();
  }
}
