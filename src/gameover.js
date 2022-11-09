import { Scene } from 'phaser';
import button from './assets/button.png'
import gameover from './assets/gameover.png'
import MyGameScene from './index.js';

class GameOverScene extends Scene {

    constructor(){
         //user super class Scene and crates sub class GameOver Scene
        super('GameOverScene')
    }

    preload() {
        this.load.image('button', button);
        this.load.image('gameover', gameover);
    }

    create() {
    
        //game over sign
        this.add.image(400,220, 'gameover').setScale(0.8);

        //new game button
        this.add.image(410,400, 'button').setScale(0.5);
        
        //clicking leads back to MyGame scene
        this.input.on('pointerdown', () => this.scene.start('MyGameScene'));
        
    }
}

export default GameOverScene;
