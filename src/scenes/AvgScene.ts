import Phaser from 'phaser';
import { storyNodes, type StoryChoice, type StoryLine, type StoryNode } from '../data/story';
import { flags } from '../systems/progress';
import { clearHud, showDialogue } from '../ui/domHud';

const frameBySpeaker: Record<string, number> = {
  諸葛亮: 0,
  周瑜: 1,
  魯肅: 2,
  曹操: 3,
};

export class AvgScene extends Phaser.Scene {
  private node!: StoryNode;
  private lineIndex = 0;

  constructor() {
    super('AvgScene');
  }

  init(data: { nodeId?: string }) {
    const nodeId = data.nodeId ?? flags.lastStoryNode ?? 'opening';
    this.node = storyNodes[nodeId] ?? storyNodes.opening;
    flags.lastStoryNode = this.node.id;
    this.lineIndex = 0;
  }

  create() {
    this.showCurrentLine();
  }

  private drawStage(line: StoryLine) {
    this.children.removeAll();
    this.add.rectangle(512, 384, 1024, 768, 0x17212b);
    this.add.image(512, 384, 'camp-base').setDisplaySize(1024, 768).setAlpha(0.34);
    this.add.rectangle(512, 560, 1024, 250, 0x14232e, 0.82);
    this.add.text(40, 36, '草船借箭', {
      fontFamily: 'Microsoft JhengHei',
      fontSize: '42px',
      color: '#f4ca75',
      fontStyle: 'bold',
    });

    const frame = frameBySpeaker[line.speaker];
    if (frame !== undefined) {
      this.add.sprite(512, 342, 'characters', frame).setDisplaySize(220, 220).setDepth(4);
      this.add.text(512, 472, line.speaker, {
        fontFamily: 'Microsoft JhengHei',
        fontSize: '24px',
        color: '#fff6e3',
        backgroundColor: 'rgba(10,14,18,0.68)',
        padding: { x: 10, y: 5 },
      }).setOrigin(0.5).setDepth(5);
    }
  }

  private showCurrentLine() {
    const line = this.node.lines[this.lineIndex];
    this.drawStage(line);
    const isLastLine = this.lineIndex >= this.node.lines.length - 1;
    const choices = isLastLine
      ? this.node.choices?.filter((choice) => !choice.onlyForRoute || choice.onlyForRoute === flags.route)
      : undefined;
    showDialogue(
      {
        ...line,
        choices,
      },
      (choice?: StoryChoice) => {
        if (choice) {
          this.applyChoice(choice);
          return;
        }
        if (!isLastLine) {
          this.lineIndex += 1;
          this.showCurrentLine();
          return;
        }
        this.applyComplete();
      },
    );
  }

  private applyChoice(choice: StoryChoice) {
    if (choice.route !== undefined) flags.route = choice.route;
    if (choice.stage) flags.stage = choice.stage;
    if (choice.ending) {
      clearHud();
      this.scene.start('EndingScene', { ending: choice.ending });
      return;
    }
    if (choice.scene) {
      clearHud();
      this.scene.start(choice.scene, { returnNode: choice.returnNode });
      return;
    }
    if (choice.next) {
      clearHud();
      this.scene.start('AvgScene', { nodeId: choice.next });
      return;
    }
    this.scene.start('ExploreScene');
  }

  private applyComplete() {
    const complete = this.node.onComplete;
    if (!complete) {
      clearHud();
      this.scene.start('ExploreScene');
      return;
    }
    if (complete.stage) flags.stage = complete.stage;
    if (complete.ending) {
      clearHud();
      this.scene.start('EndingScene', { ending: complete.ending });
      return;
    }
    if (complete.scene) {
      clearHud();
      this.scene.start(complete.scene, { returnNode: complete.returnNode });
      return;
    }
    clearHud();
    this.scene.start('ExploreScene');
  }
}
