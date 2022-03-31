import Phaser from 'phaser';
import level1 from '../../assets/tilemaps/maps/level1.json';
import groundTile from '../../assets/tilemaps/tiles/ground.png';
import phaserDude from '../../assets/phaser-dude.png';

export class Level1 extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private groundTileset: Phaser.Tilemaps.Tileset;
  private groundLayer: Phaser.Tilemaps.TilemapLayer;
  private player: Phaser.GameObjects.Sprite;

  constructor() {
    super('level-1-scene');
  }

  preload() {
    this.load.image('player', phaserDude);
    this.load.image('groundTiles', groundTile);
    this.load.tilemapTiledJSON('level1', level1);
  }

  create() {
    this.map = this.make.tilemap({ key: 'level1' });
    this.groundTileset = this.map.addTilesetImage('ground', 'groundTiles');
    this.groundLayer = this.map.createLayer('ground', this.groundTileset, 0, 0);
    this.add.sprite(256, 256, 'player');
  }
}
