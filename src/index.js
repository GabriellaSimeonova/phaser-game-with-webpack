import Phaser from 'phaser';
import { Scene } from 'phaser';
import PreloadScene from './preload.js';
import GameOverScene from './gameover.js';

import sky from './assets/sky.png';
import ground from './assets/platform.png';
import star from './assets/star.png';
import bomb from './assets/bomb.png';
import monkey from './assets/dude.png';



class MyGameScene extends Phaser.Scene
{
    constructor ()
    {
        //user super class Scene and crates sub class MyGame Scene
        super('MyGameScene');
    }

    preload ()
    {
    //loading all the content/images from assests before we display anything
    this.load.image('sky', sky);
    this.load.image('ground', ground);
    this.load.image('monkey', monkey);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    //the player is not a single image but a spritesheet with different frames
    this.load.spritesheet("dude", monkey,{
        frameHeight: 48,
        frameWidth: 32
    });

    }
      
    create ()
    {

    //adding the blue backgroung
    this.add.image(400,300,"sky");

    const platforms = this.physics.add.staticGroup();
    // ground
    platforms.create(400,568, "ground").setScale(2).refreshBody();

    //platfroms/obstacles
    platforms.create(600,400, "ground").refreshBody();
    platforms.create(50,250, "ground").refreshBody();
    platforms.create(700,220, "ground").refreshBody();
       
    //player
    this.player = this.physics.add.sprite(100,400, "dude");
    //the player cannot fall under/ outside of the  canvas
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    //the player does not collide with the ground or other objects(platforms, stars...)
    this.physics.add.collider(this.player, platforms)

    //ANIMATIONS- changing the frames of the spritesheet
    //turning 
    this.anims.create({
        key: "turn",
        frames: [{key:"dude", frame: 4}],
        frameRate: 20
    });

    //turn right
    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", {start:5, end:8}),
        frameRate: 10,
        repeat: -1
    });

    //turn left
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", {start:0, end:3}),
        frameRate: 10,
        repeat: -1
    });
       
    //creating stars
    const stars = this.physics.add.group({
        key:"star",
        repeat: 11,
        setXY: {x:12, y:0, stepX:70}
    });
    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    //do not overlap stars with platforms
    this.physics.add.collider(stars, platforms);
    // do overlap stars with player and when this is true execute collect() function
    this.physics.add.overlap(this.player, stars, collect, null, this)

    //creating bombs
    const bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(this.player, bombs, bombTouched, null, this);
  

    /**
     * This functiion takes the player and bomb and check is they overlap.
     * If they overlap = GAME OVER i.e. the player becomes green, pause the physics
     * after 1500ms starts the Game Over Scene
     * @param {sprite} player 
     * @param {sprite} bomb 
     */
    function bombTouched(player, bomb){
        this.physics.pause();
        this.player.setTint(0xff000);
        this.player.anims.play("turn");
        setTimeout(() => {
          this.scene.start('GameOverScene');
            ;
          }, "1500")
        
    }

    //score
    const scoreText = this.add.text(15,15, "score: 0", {
        fontSize: "32px",
        fill: "#000",
    })
    let score = 0;


    /**
     * This function check if the player overlap with any of the starts
     * stars disappear when player overlaps them and adds +1 to the score
     * 
     * if all the starts are collected, a bomb appears
     * @param {sprite} player 
     * @param {sprite} star 
     */
    function collect(player, star){
        star.disableBody(true, true);
        score++;
        scoreText.setText("Score: "+score);

        if(stars.countActive(true) === 0){
            stars.children.iterate(function(child){
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = 
            player.x < 400 
                ? Phaser.Math.Between(400,800) 
                : Phaser.Math.Between(0,400);

                const bomb = bombs.create(x, 16, "bomb");
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200,200) ,20)
        }
    }


    }
//progress part of the game
    update(){
        //include keyboard controls
        const cursors = this.input.keyboard.createCursorKeys();
         
        //direction changes
        if(cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true)
        } else if(cursors.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play("right", true)
        }else{
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        //jump
        if((cursors.up.isDown || cursors.space.isDown ) && this.player.body.touching.down){
            this.player.setVelocityY(-380)    
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity:{y:450},
            debud: false
        }
    },
    scene: [PreloadScene , MyGameScene, GameOverScene]
};


const game = new Phaser.Game(config);

export default MyGameScene;
