import Phaser from "phaser";

// STUFF I want to add:
// standing idle animation when not clicking
// idle animation chains with sit and then sleep
// sounds-- meow when you wake it up
// music
// donuts it can eat around the screen if you take the gravity out

// change highScore and score to global variables...
// should save these in the index file and import the game in maybe?
// or change it back to this.highScore... hmm

// Features I want to implement:
// Just one starter donut
// Raindom Donut Rain-> different colors
// Restart Game Properly
// Save High Scores
// Fix animation logic... the sit and then fall asleep

let cat;
let highScore = 0;
let score = 0;

class MyGame extends Phaser.Scene {
  constructor() {
    super();
    // this.score = 0;
    this.gameOver = false;
    // this.highScore = 0;

    // { key: "demo", active: true }
  }

  preload() {
    this.load.spritesheet("cat", "./src/assets/pusheenWalk.png", {
      frameWidth: 300,
      height: 300,
    });
    this.load.image("background", "./src/assets/grassDarkHand.png");
    this.load.image("ground", "./src/assets/groundT.png");
    this.load.image("donut", "./src/assets/donut5.png");
    this.load.image("fireDonut", "./src/assets/donutRed.png");
    this.load.image("gameOver", "./src/assets/gameOverPA.png");
  }

  create() {
    this.cameras.main.backgroundColor.setTo(255, 255, 255);

    // CREATE ELEMENTS:

    // GRASS
    this.add.image(400, 300, "background");
    // CAT
    cat = this.physics.add.sprite(400, 300, "cat", 0);
    // FIRE DONUTS
    let fireDonuts = this.physics.add.group();
    // GROUND
    let ground = this.physics.add.staticSprite(400, 525, "ground");
    ground.displayWidth = this.sys.game.config.width;
    // DONUTS
    let donuts = this.physics.add.group({
      key: "donut",
      // repeat: 1,
      // stepX is the space between the donuts
      setXY: { x: 100, y: 255, stepX: 99 },
    });

    // CAT:

    // hitbox size
    cat.setBodySize(183, 125);
    // hitbox center
    cat.setOffset(45, 125);
    // placement
    cat.setOrigin(0.5, 0.58);
    // can't walk off screen
    cat.setCollideWorldBounds(true);
    // cat.setGravityY(600);

    // CAT ANIMATIONS
    this.anims.create({
      key: "sit",
      repeat: 4,
      frameRate: 2.5,
      frames: this.anims.generateFrameNumbers("cat", {
        start: 0,
        end: 1,
      }),
    });
    this.anims.create({
      key: "sleep",
      repeat: -1,
      frameRate: 2.5,
      frames: this.anims.generateFrameNumbers("cat", {
        start: 2,
        end: 3,
      }),
    });
    this.anims.create({
      key: "leftWalk",
      repeat: -1,
      frameRate: 2.5,
      frames: this.anims.generateFrameNumbers("cat", {
        start: 4,
        end: 5,
      }),
    });

    this.anims.create({
      key: "rightWalk",
      repeat: -1,
      frameRate: 2.5,
      frames: this.anims.generateFrameNumbers("cat", {
        start: 6,
        end: 7,
      }),
    });

    //KEYBOARD
    this.cursors = this.input.keyboard.createCursorKeys();

    this.asleep = true;
    this.clickNum = 0;

    cat.on("animationcomplete", () => {
      cat.anims.play("sleep");
      this.asleep = true;
      this.clickNum = 0;
    });

    cat.play("sleep");
    cat.setInteractive();
    this.input.on("gameobjectdown", this.wakeUp, this);

    // *DONUTS* create more

    donuts.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    function collectDonut(cat, donut) {
      donut.disableBody(true, true);
      score += 5;
      this.scoreText.setText("Score: " + score);

      // this.score += 5;
      // this.scoreText.setText("Score: " + this.score);

      if (donuts.countActive(true) === 0 && !this.gameOver) {
        // no idea what this is doing and it's weird... figure it out
        donuts.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        let x =
          cat.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);
        let fireDonut = fireDonuts.create(x, 2, "fireDonut");

        fireDonut.setBounce(1);
        // fireDonut.setCollideWorldBounds(true);
        fireDonut.setVelocity(Phaser.Math.Between(-200, 200, 20));
      }
    }

    //this checks if they overlap
    // this.physics.add.overlap(cat, donuts, collectDonut, null, this);

    // SCORE
    // let score = 0;
    this.scoreText = this.add.text(18, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
      // fontFamily: "Verdana", "Times New Roman"
    });
    this.highScoreText = this.add.text(620, 16, "high score: 0", {
      fontSize: "18px",
      fill: "#000",
    });

    // Could se
    // this.gameOverText = this.add.text(400, 300, "Gameover!", {
    //   fontSize: "64px",
    //   fill: "#000",
    //   fontFamily: "Minecraft", "PixelFont"
    // });
    // this.gameOverText.setOrigin(0.5);
    // this.gameOverText.visible = false;

    function donutBurn(cat, fireDonuts) {
      this.physics.pause();
      cat.setTint(0xff0000);
      cat.anims.stop();
      this.gameOver = true;
      // this.gameOverText.visible = true;

      highScore = highScore > score ? highScore : score;
      score = 0;
      this.highScoreText.setText("high score: " + highScore);

      // this.highScore =
      //   this.highScore > this.score ? this.highScore : this.score;
      // this.score = 0;
      // this.highScoreText.setText("high score: " + this.highScore);
      gameOverPic.visible = true;

      this.input.on("pointerdown", () => this.scene.start(this));
      console.log("donut burn!");
    }

    // ADDING COLLIDERS TO GROUND:
    this.physics.add.collider(cat, ground);
    this.physics.add.collider(donuts, ground);
    // this.physics.add.collider(fireDonuts, ground);

    //ADDING COLLIDING BEHAVIOR TO DONUTS/FIRE DONUTS & CAT
    this.physics.add.overlap(cat, donuts, collectDonut, null, this);
    this.physics.add.collider(cat, fireDonuts, donutBurn, null, this); // game should end... so

    // GAMEOVER
    let gameOverPic = this.add.image(400, 300, "gameOver");
    gameOverPic.visible = false;
  }

  update() {
    if (!this.asleep && !this.gameOver) {
      if (this.cursors.left.isDown) {
        cat.x -= 5;
        // cat.setVelocityX(-200);
        // console.log("left key works!");
        cat.anims.play("leftWalk", true);
      } else if (this.cursors.right.isDown) {
        //   this.cat.velocity.x = -150;
        // console.log("right key works");
        // cat.stop();
        cat.anims.play("rightWalk", true);
        cat.x += 5;
        // cat.setVelocityX(200);
        //   this.cat.play("sleep");
        //*** JUMP ***
      } else if (
        this.cursors.up.isDown
        //  && cat.body.touching.down
      ) {
        console.log("upkeyworks!");
        //   cat.play("leftWalk");
        // cat.velocity = 50;
        // cat.setVelocityY(-50);

        cat.y -= 5;
      } else if (this.cursors.down.isDown) {
        console.log("downkeyworks!");
        // cat.velocity = 50;
        // cat.y += 5;
      } else {
        // cat.setVelocityX(0);
        // cat.setVelocityY(0);
        // cat.velocity = 0;
      }
      // after a while... play sit
      // cat.play("sit");
      // cat.anims.play("sit", true);
    }
  }
  wakeUp(pointer, cat) {
    if (this.clickNum === 3) {
      //hmmm ! these are in conflict
      cat.play("leftWalk");
    }
    if (!this.asleep) {
      this.clickNum += 1;
    }
    if (this.asleep) {
      cat.play("sit");
      this.asleep = false;
    }
    // this.asleep = false;
    // cat.setTexture("cat");
    // cat.play("sit");
    //     setInterval(() => {
    //       cat.play("sleep");
    //     }, 3000);
  }
}
// } else if (this.cursors.down.isDown) {
//   console.log("down key works!");
//   cat.y += 2;
// }
//   if (!this.cursors.left.active && !this.cursors.right.active)
// else {
// cat.play("sit");
// cat.anims.play("sit");
// how to get it to go back to sleep?/?? hmm
// setInterval(() => {
//   cat.play("sit");
// }, 100);
// cat.play("sit");
// cat.anims.play("sit");
// }
//   cat.anims.stop();
//   if (this.cursors.left._justUp || this.cursors.right._justUp) {
//     console.log("just Up ! or Down");
//     //   cat.anims.play("sit");
//   }
// need to make standing idle animation
// have cat sit down and play sit
// cat.anims.play("sit", true);
//make an idle standing-> that ends...chain the sitting to it...
//on end it will sleep
// }

// Make it actually jump! :)
// else {
//   //   this.cat.stop();
// }
// }

let game = new Phaser.Game({
  type: Phaser.AUTO, // users WebGl if available otherswise canvas
  width: 800,
  height: 600,
  parent: "phaser-game",
  scene: [MyGame],
  // they set gravity in here
  physics: { default: "arcade", arcade: { gravity: { y: 600 }, debug: false } },
});

// we are just passing the class to scene
// instead of defining, scene: {preload: preload, create: create}

//let gameScene= new Phaser.Scene("Game")
//let config= {type: Phaser.AUTO, widht, height, etc}
// let game= new Phaser.Game(config)

// he also configures it... interesting you don't...

//gravity: { y: 0 },

//   physics: { default: "arcade", arcade: { gravity: { y: 400 }, debug: false } },

//simple
// physics: { default: "arcade", arcade: { debug: false } },

// const game = new Phaser.Game(800, 600, Phaser.AUTO, "phaser-game", {
//   preload: preload,
//   create: create,
//   render: render,
// });
//   type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     parent: "phaser-game",
//     scene: [MyGame],
//   });

/////

// good for animating ships flying across the screen
//https://www.youtube.com/watch?v=jVlNZgX5fV8
//first make walk cycle

//then want to make cat walk along x axis

// moveCat(cat,speed){
//     cat.x += speed
// }

// update(){
//     this.moveCat(this.cat, 1)
// }

// need a stopping condition... how many cycles does the walk run? then sleep

///SPRITE SHEETS OTHER SIZES:
//   preload() {
//     this.load.spritesheet("cat", "./src/assets/pusheenSprites_RPJS.png", {
//       frameWidth: 35,
//       height: 35,
//     });
//   }

//   preload() {
//     this.load.spritesheet("cat", "./src/assets/pusheenSpriteBg.png", {
//       frameWidth: 200,
//       height: 200,
//     });
//   }

//   preload() {
//     this.load.spritesheet("cat", "./src/assets/pusheenBiggest.png", {
//       frameWidth: 400,
//       height: 400,
//     });
//   }

//   preload() {
//     this.load.spritesheet("cat", "./src/assets/pusheenMed.png", {
//       frameWidth: 350,
//       height: 350,
//     });
//   }

//   preload() {
//     this.load.spritesheet("cat", "./src/assets/pusheenSmMed.png", {
//       frameWidth: 325,
//       height: 325,
//     });
//   }
