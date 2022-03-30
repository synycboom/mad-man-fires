import 'phaser';
import logo from './assets/phaser3-logo.png';
import libs from './assets/libs.png';
import bundle from './assets/plasma-bundle.glsl';
import stars from './assets/starfields.glsl';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('demo');
  }

  preload() {
    this.load.image('logo', logo);
    this.load.image('libs', libs);
    this.load.glsl('bundle', bundle);
    this.load.glsl('stars', stars);
  }

  create() {
    this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

    this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

    this.add.image(400, 300, 'libs');

    const logo = this.add.image(400, 70, 'logo');

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 800,
  height: 600,
  scene: Demo
};

const game = new Phaser.Game(config);
