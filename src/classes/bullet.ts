import Phaser from 'phaser';
import { Direction } from '../common/direction';

const BULLET_SPEED = 600;

export class Bullet extends Phaser.Physics.Arcade.Sprite {

    private direction: Direction

    constructor(scene: Phaser.Scene, x: number, y: number, direction: Direction) {
        super(scene, x, y, 'bullet');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setScale(5);
        this.setBodySize(6, 6);
        (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true

        this.direction = direction;
    }

    update(...args: any[]): void {
        switch (this.direction) {
            case Direction.Up:
                this.setVelocityY(-BULLET_SPEED);
                break;
            case Direction.Down:
                this.setVelocityY(BULLET_SPEED);
                break;
            case Direction.Left:
                this.setVelocityX(-BULLET_SPEED);
                break;
            case Direction.Right:
                this.setVelocityX(BULLET_SPEED);
                break;
        }
    }

    destroy(): void {
        this.disableBody(true, true);
        this.scene.time.delayedCall(300, () => {
            this.destroy();
        });
    }
}