import Phaser from 'phaser';
import { Direction } from '../common/direction';

const FRAME_SPEED = 8;

const PLAYER_SPEED = 300;

export class Player extends Phaser.Physics.Arcade.Sprite {

    // 0=idle, 1=up, 2=down, 3=left, 4=right
    private firstMovementMemoryFrame: integer;
    private direction: Direction;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'madMan');

        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.setImmovable(false);
        this.setPushable(false);
        this.setCollideWorldBounds(true);
        this.setBodySize(24, 28);
        this.setScale(2);

        this.firstMovementMemoryFrame = 0;
        this.direction = Direction.Down;

        // ANIMS
        this.initAnimations();
        this.anims.play('idle');
    }

    private initAnimations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('madMan', {
                frames: [0, 1]
            }),
            frameRate: FRAME_SPEED,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('madMan', {
                frames: [7, 8, 9, 10, 11]
            }),
            frameRate: FRAME_SPEED,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('madMan', {
                frames: [14, 15, 16, 17, 18]
            }),
            frameRate: FRAME_SPEED,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('madMan', {
                frames: [21, 22, 23, 24, 25, 26]
            }),
            frameRate: FRAME_SPEED,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('madMan', {
                frames: [28, 29, 30, 31, 32, 33]
            }),
            frameRate: FRAME_SPEED,
            repeat: -1
        });
    }

    move(direction: Direction) {
        let targetMovement = 0;
        switch (direction) {
            case Direction.Up:
                this.setVelocityY(-PLAYER_SPEED);
                targetMovement = 1;
                break;
            case Direction.Down:
                this.setVelocityY(PLAYER_SPEED);
                targetMovement = 2;
                break;
            case Direction.Left:
                this.setVelocityX(-PLAYER_SPEED);
                targetMovement = 3;
                break;
            case Direction.Right:
                this.setVelocityX(PLAYER_SPEED);
                targetMovement = 4;
                break;
        }

        if (this.firstMovementMemoryFrame === 0) {
            this.firstMovementMemoryFrame = targetMovement;
        }

        switch (this.firstMovementMemoryFrame) {
            case 0:
                this.direction = Direction.Down
                break;
            case 1:
                this.direction = Direction.Up
                break;
            case 2:
                this.direction = Direction.Down
                break;
            case 3:
                this.direction = Direction.Left
                break;
            case 4:
                this.direction = Direction.Right
                break;
        }
    }

    resetMove() {
        this.setVelocityX(0)
        this.setVelocityY(0)
        this.firstMovementMemoryFrame = 0;
        this.direction = Direction.Down;
    }

    updateAnim() {
        let targetAnim = this.mapToAnimKey(this.firstMovementMemoryFrame)
        if (this.anims.currentAnim.key !== this.mapToAnimKey(this.firstMovementMemoryFrame)) {
            this.anims.play(targetAnim)
        }
    }

    getDirection(): Direction {
        return this.direction
    }

    mapToAnimKey(value: integer): string {
        switch (value) {
            case 0:
                return 'idle';
            case 1:
                return 'walk-up';
            case 2:
                return 'walk-down';
            case 3:
                return 'walk-left';
            case 4:
                return 'walk-right';
        }
    }
}