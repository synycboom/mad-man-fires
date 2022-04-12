import Phaser from 'phaser';
import { LoadingScene, Level1 } from './scenes';

const gameConfig: Phaser.Types.Core.GameConfig = {
	title: 'MadManFires',
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#351f1b',
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: 1024,
    height: 1024,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [LoadingScene, Level1],
};

window.game = new Phaser.Game(gameConfig);

// ref: https://shakuro.com/blog/phaser-js-a-step-by-step-tutorial-on-making-a-phaser-3-game
