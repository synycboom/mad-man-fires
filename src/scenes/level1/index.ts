import Phaser from 'phaser';
import level1 from '../../assets/tilemaps/maps/level1.json';
import groundTile from '../../assets/tilemaps/tiles/ground.png';
import wallTile from '../../assets/tilemaps/tiles/wall.png';
import brawler from '../../assets/brawler48x48.png';
import superMario from '../../assets/super-mario-16bit.png';
import AnimatedTiles from '../../plugins/main';

export class Level1 extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private groundTileset: Phaser.Tilemaps.Tileset;
  private wallTileset: Phaser.Tilemaps.Tileset;
  private marioTileset: Phaser.Tilemaps.Tileset;
  private groundLayer: Phaser.Tilemaps.TilemapLayer;
  private animatedTiles: AnimatedTiles;

  constructor() {
    super('level-1-scene');
  }

  preload() {
    this.load.spritesheet('brawler', brawler, { frameWidth: 48, frameHeight: 48 });
    this.load.image('groundTiles', groundTile);
    this.load.image('wallTiles', wallTile);
    this.load.image('super-mario-16bit', superMario);
    this.load.tilemapTiledJSON('level1', level1);
    this.load.scenePlugin({
      key: 'animatedTiles',
      url: AnimatedTiles,
    });
  }

  create() {
    this.map = this.make.tilemap({ key: 'level1' });
    this.groundTileset = this.map.addTilesetImage('ground', 'groundTiles');
    this.wallTileset = this.map.addTilesetImage('walls', 'wallTiles');
    this.marioTileset = this.map.addTilesetImage('super-mario-16bit', 'super-mario-16bit');
    this.groundLayer = this.map.createLayer('ground', [this.groundTileset, this.wallTileset, this.marioTileset], 0, 0);
    this.animatedTiles.init(this.map);

    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNumbers('brawler', { frames: [5, 6, 7, 8] }),
      frameRate: 8,
      repeat: -1,
    });

    const player = this.add.sprite(256, 256, '');
    player.setScale(2);
    player.play('player-idle');
  }
}
