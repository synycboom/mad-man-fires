import Phaser from 'phaser';

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super('loading-scene');
  }

  create(): void {
    console.log('Loading scene was created');
    this.scene.start('level-1-scene');
  }
}
