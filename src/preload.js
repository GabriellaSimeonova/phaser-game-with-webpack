import { Scene } from 'phaser';
import button from './assets/button.png'

class PreloadScene extends Scene {

    constructor(){
        //user super class Scene and crates sub class Preload Scene
        super('PreloadScene')
    }

    preload() {
        this.load.image('button', button);
    }

    create() {
        //new game button
        this.add.image(400,300, 'button')
  
        //clicking leads to the next scene
        this.input.on('pointerdown', () => this.scene.start('MyGameScene'))
    }
}

export default PreloadScene;
