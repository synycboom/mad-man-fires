import Phaser, { Physics } from 'phaser';
import level1 from '../../assets/tilemaps/maps/map02.json';
import tileset from '../../assets/tilemaps/tiles/groundTiles03.png';
import madMan from '../../assets/mad-man-sheet.png';
import monster from '../../assets/mushroom.png';
import bullet from '../../assets/bullet.png';
import { Player } from '../../classes/player';
import { Monster } from '../../classes/monster';
import { Direction } from '../../common/direction';
import { Bullet } from '../../classes/bullet';
// import AnimatedTiles from '../../plugins/main';

const MAX_MONSTER_COUNT = 20;
const MAX_BULLET_COUNT = 20;

function randomInteger(min, max): integer {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Level1 extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  // private animatedTiles: AnimatedTiles;
  private wallLayer: Phaser.Tilemaps.TilemapLayer;
  private monsterObjectLayers: Phaser.Types.Tilemaps.TiledObject[];

  private player: Player;
  private monsterGroup: Physics.Arcade.Group;
  private bulletGroup: Physics.Arcade.Group;

  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keySpace: Phaser.Input.Keyboard.Key;

  private spawnPoint: Object[] = []


  constructor() {
    super('level-1-scene');
  }

  preload() {
    this.load.tilemapTiledJSON('level1', level1);
    this.load.image('tileset', tileset);

    this.load.spritesheet('madMan', madMan, { frameWidth: 64, frameHeight: 64 });
    this.load.image('monster', monster);
    this.load.image('bullet', bullet);

    // this.load.scenePlugin({
    //   key: 'animatedTiles',
    //   url: AnimatedTiles,
    // });
  }

  create() {
    this.initInput();
    this.initMap();
    this.initGameplay();

    this.time.addEvent({
      callback: this.trySpawnMonster,
      callbackScope: this,
      loop: true,
      delay: 1000
    })
  }

  initMap() {
    this.map = this.make.tilemap({ key: 'level1' });
    this.tileset = this.map.addTilesetImage('groundTiles03', 'tileset');

    this.map.createLayer('ground', [this.tileset], 0, 0);
    this.wallLayer = this.map.createLayer('onground', [this.tileset], 0, 0)
    this.wallLayer.setCollisionByProperty({
      'collides': true
    });

    // set monster spawn points
    this.monsterObjectLayers = this.map.filterObjects("monster", (a) => { return a.name === 'monsterSpawnPoint' })
    this.monsterObjectLayers.forEach((a) => {
      this.spawnPoint.push({
        'x': a.x,
        'y': a.y
      })
    })

    // this.animatedTiles.init(this.map);
  }

  initInput() {
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  initGameplay() {
    this.player = new Player(this, 800, 800);

    this.monsterGroup = this.physics.add.group({
      runChildUpdate: true,
      collideWorldBounds: true,
      maxSize: MAX_MONSTER_COUNT
    });

    this.bulletGroup = this.physics.add.group({
      runChildUpdate: true,
      collideWorldBounds: true,
      maxSize: MAX_BULLET_COUNT
    })

    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.overlap(this.player, this.monsterGroup, this.monsterAttack, null, this);

    this.physics.add.collider(this.monsterGroup, this.wallLayer);
    this.physics.add.collider(this.monsterGroup, this.monsterGroup);
    this.physics.add.overlap(this.monsterGroup, this.bulletGroup, this.bulletHit, null, this);

    // destroy bullet when impact the map boundary
    this.physics.world.on('worldbounds', (body) => {
      if (body.gameObject.texture.key === 'bullet') {
        let b = body.gameObject as Bullet
        b.destroy();
        this.bulletGroup.remove(b);
      }
    })
  }

  update(time: number, delta: number): void {
    this.playerUpdate()
  }

  playerUpdate() {
    this.player.resetMove();
    if (this.keyW.isDown) {
      this.player.move(Direction.Up);
    }
    if (this.keyS.isDown) {
      this.player.move(Direction.Down);
    }
    if (this.keyA.isDown) {
      this.player.move(Direction.Left);
    }
    if (this.keyD.isDown) {
      this.player.move(Direction.Right);
    }
    this.player.updateAnim();

    if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.trySpawnBullet()
    }
  }

  trySpawnBullet() {
    if (!this.bulletGroup.isFull()) {
      this.bulletGroup.add(new Bullet(this, this.player.x, this.player.y, this.player.getDirection()));
    }
  }

  trySpawnMonster() {
    if (!this.monsterGroup.isFull()) {
      let targetPosition = this.spawnPoint[randomInteger(0, this.spawnPoint.length - 1)]
      this.monsterGroup.add(new Monster(this, targetPosition['x'], targetPosition['y'], this.player));
    }
  }

  monsterAttack(p: Player, m: Monster) {
    m.hurt();
    if (!m.isAlive()) {
      this.monsterGroup.remove(m);
    }
  }

  bulletHit(m: Monster, b: Bullet) {
    b.destroy();
    this.bulletGroup.remove(b);

    m.hurt();
    if (!m.isAlive()) {
      this.monsterGroup.remove(m);
    }
  }
}
