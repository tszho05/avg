import Phaser from 'phaser';
import './styles.css';
import { BootScene } from './scenes/BootScene';
import { ExploreScene } from './scenes/ExploreScene';
import { AvgScene } from './scenes/AvgScene';
import { StarScene } from './scenes/StarScene';
import { FleetScene } from './scenes/FleetScene';
import { DrumScene } from './scenes/DrumScene';
import { EndingScene } from './scenes/EndingScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1024,
  height: 768,
  backgroundColor: '#17212b',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 3,
  },
  scene: [BootScene, ExploreScene, AvgScene, StarScene, FleetScene, DrumScene, EndingScene],
};

new Phaser.Game(config);
