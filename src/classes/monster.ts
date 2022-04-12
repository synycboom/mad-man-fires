import Phaser from 'phaser';
import { Player } from './player';

const MONSTER_MAX_SPEED = 200;
const MONSTER_MIN_SPEED = 50;

export class Monster extends Phaser.Physics.Arcade.Sprite {
    private alive: boolean;
    private target: Player;

    constructor(scene: Phaser.Scene, x: number, y: number, target: Player) {
        super(scene, x, y, 'monster');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setScale(2);
        this.setImmovable(false);
        this.setPushable(false);

        this.alive = true;
        this.target = target;
    }

    resetMove() {
        this.setVelocityX(0)
        this.setVelocityY(0)
    }

    update(...args: any[]): void {
        let directionX = this.target.x - this.x;
        let directionY = this.target.y - this.y;

        let spdX = Phaser.Math.Interpolation.SmoothStep(0.5, MONSTER_MIN_SPEED, MONSTER_MAX_SPEED)
        let spdY = Phaser.Math.Interpolation.SmoothStep(0.5, MONSTER_MIN_SPEED, MONSTER_MAX_SPEED)

        if (Math.abs(directionX) > 5) {
            if (directionX > 0) {
                this.setVelocityX(spdX)
            } else {
                this.setVelocityX(-spdX)
            }
        } else {
            this.setVelocityX(0);
        }

        if (Math.abs(directionY) > 5) {
            if (directionY > 0) {
                this.setVelocityY(spdY)
            } else {
                this.setVelocityY(-spdY)
            }
        } else {
            this.setVelocityY(0);
        }
    }

    hurt() {
        this.alive = false;
        this.disableBody(true, true);
        this.scene.time.delayedCall(300, () => {
            this.destroy();
        });
    }

    isAlive() {
        return this.alive;
    }
}