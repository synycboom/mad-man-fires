import 'phaser';
import level1 from './assets/tilemaps/maps/level1.json';
import groundTile from './assets/tilemaps/tiles/ground.png';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('demo');
  }

  preload() {
    this.load.image('groundTiles', groundTile);
    this.load.tilemapTiledJSON('level1', level1);
  }

  create() {
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('ground', 'groundTiles');
    const platforms = map.createLayer('ground', tileset, 0, 0);
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 512,
  height: 512,
  scene: Demo
};

const game = new Phaser.Game(config);
