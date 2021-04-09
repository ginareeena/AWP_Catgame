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
let health = 5;
let healthPercentage = 1;

class MyGame extends Phaser.Scene {
  constructor() {
    super();
    // this.score = 0;
    this.gameOver = false;
    this.playedBefore = false;
    // this.highScore = 0;
  }

  preload() {
    this.load.spritesheet("cat", "./src/assets/pusheenWalk.png", {
      frameWidth: 300,
      height: 300,
    });
    this.load.image("background", "./src/assets/grassDarkHand.png");
    this.load.image("ground", "./src/assets/groundT.png");
    this.load.image("donut", "./src/assets/skyDonut4.png");
    this.load.image("skyDonut", "./src/assets/skyDonut4.png");
    this.load.image("fireDonut", "./src/assets/fireDonut8.png");
    this.load.image("healthDonut", "./src/assets/healthDonutSt.png");
    this.load.image("gameOver", "./src/assets/gameOverPA.png");
    this.load.image("startScreen", "./src/assets/startScreenFINsm.jpg");
    this.load.image("left-cap", "./src/assets/barL.png");
    this.load.image("middle", "./src/assets/barM.png");
    this.load.image("right-cap", "./src/assets/barR.png");
    this.load.image("left-cap-shadow", "./src/assets/barShadowL.png");
    this.load.image("middle-shadow", "./src/assets/barShadowM.png");
    this.load.image("right-cap-shadow", "./src/assets/barShadowR.png");
    // this.load.image("lazerRight", "./src/assets/lazerRedR.png");
    // this.load.image("lazerLeft", "./src/assets/lazerRedL.png");
  }

  init() {
    this.fullWidth = 200;
  }

  create() {
    this.cameras.main.backgroundColor.setTo(255, 255, 255);

    // CREATE ELEMENTS:

    // GRASS
    this.add.image(400, 300, "background");

    // HEALTH BAR
    // Health Bar Shadow
    let leftShadowCap = this.add
      .image(18, 75, "left-cap-shadow")
      .setOrigin(0, 0.5);
    let middleShadowCap = this.add
      .image(leftShadowCap.x + leftShadowCap.width, 75, "middle-shadow")
      .setOrigin(0, 0.5);
    middleShadowCap.displayWidth = this.fullWidth;

    this.add
      .image(
        middleShadowCap.x + middleShadowCap.displayWidth,
        75,
        "right-cap-shadow"
      )
      .setOrigin(0, 0.5);

    // HEALTH BAR
    // Health Bar Green
    this.leftCap = this.add.image(18, 75, "left-cap").setOrigin(0, 0.5);

    this.middle = this.add
      .image(this.leftCap.x + this.leftCap.width, 75, "middle")
      .setOrigin(0, 0.5);

    this.rightCap = this.add
      .image(this.middle.x + this.middle.displayWidth, 75, "right-cap")
      .setOrigin(0, 0.5);

    this.setMeterPercentage(1);

    // CAT
    // cat = this.add.sprite(400, 300, "cat", 0);

    cat = this.physics.add.sprite(400, 300, "cat", 0);

    // FIRE DONUTS
    let fireDonuts = this.physics.add.group();
    // Health DONUTS
    let healthDonuts = this.physics.add.group();
    //Regular Donuts
    let donuts = this.physics.add.group();

    // SKY DONUTS
    let skyDonuts = this.physics.add.group();
    // skyDonuts.setScale(0.5);

    //FIRST DONUT
    let firstDonut = this.physics.add.sprite(100, 255, "donut").setScale(0.3);

    // GROUND
    let ground = this.physics.add.staticSprite(400, 525, "ground");
    ground.displayWidth = this.sys.game.config.width;
    // OLD HEALTH BAR
    // let healthBar = this.add.group(50, 85, "healthDonut"{
    //   key: "healthDonut",
    //   repeat: this.health
    // })

    // let healthBar = this.add.group({
    //   key: "healthDonut",
    //   // width: 0.5,
    //   // height: 0.5,
    //   repeat: health - 1,
    //   setXY: { x: 50, y: 85, stepX: 99 },
    // });

    // let healthBar2 = this.makeBar(18, 50, 0x2ecc71);
    // this.setValue(healthBar2, 100);
    // this.setValue(healthBar, 100);

    // healthBar.scale(0.5, 0.5);

    // healthBar.scale = 0.1;

    // FIRST DONUT
    // let donut = this.physics.add.sprite(100, 255, "donut").setScale(0.3);
    // let donuts = this.physics.add.group().setScale(0.3);

    // let donuts = this.physics.add.group().setScale(0.3);

    // let donuts = this.physics.add.group({
    // key: "donut",
    // repeat: 0,
    // stepX is the space between the donu
    // setXY: { x: 100, y: 255, stepX: 99 },
    // setScale: { x: 0.3, y: 0.3 },
    // });
    this.startScreen = this.add.image(400, 300, "startScreen");
    // donuts.setScale(0.5);

    // SCORE
    // let score = 0;
    this.scoreText = this.add.text(18, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
      // fontFamily: "Verdana", "Times New Roman"
    });
    this.highScoreText = this.add.text(620, 16, "high score: " + highScore, {
      fontSize: "18px",
      fill: "#000",
    });

    this.highScoreText.setVisible(false);
    this.scoreText.setVisible(false);

    // function startGame() {
    //   this.startScreen.visible === false;
    //   this.highScoreText.setVisible(true);
    //   this.scoreText.setVisible(true);
    // }

    // this.input.on("pointerdown", () => {
    //   startGame();
    // });
    if (this.playedBefore === false) {
      this.input.on("pointerdown", () => {
        this.startScreen.visible = false;
        this.highScoreText.setVisible(true);
        this.scoreText.setVisible(true);
        healthPercentage = 1;
        // 1, .8, .6, .4, .2, 0
        health = 5;
      });
    } else {
      this.startScreen.visible = false;
      this.highScoreText.setVisible(true);
      this.scoreText.setVisible(true);
      healthPercentage = 1;
      health = 5;
    }

    // if (this.startScreen.visible === true) {
    //   this.highScoreText.setVisible(false);
    //   this.scoreText.setVisible(false);
    // } else if (this.startScreen.visible === false) {
    //   this.highScoreText.setVisible(true);
    //   this.scoreText.setVisible(true);
    // }

    // CAT:

    // hitbox size
    cat.setBodySize(185, 123);
    // hitbox center
    cat.setOffset(45, 125);
    // placement
    cat.setOrigin(0.5, 0.58);
    // can't walk off screen
    cat.setCollideWorldBounds(true);
    cat.setGravityY(-600);
    cat.setImmovable();

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

    // WHERE WE CREATE OUR CYCLE

    cat.on("animationcomplete", () => {
      cat.anims.play("sleep");
      this.asleep = true;
      this.clickNum = 0;
    });

    cat.play("sleep");
    cat.setInteractive();
    // THIS WAS IN BEFORE:
    this.input.on("gameobjectdown", this.wakeUp, this);

    // *DONUTS* create more

    // this creates more donuts in the same place...
    donuts.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    function collectDonut(cat, donut) {
      donut.disableBody(true, true);
      if (health > 3) {
        cat.clearTint();
      }
      score += 5;
      this.scoreText.setText("Score: " + score);

      // this.score += 5;
      // this.scoreText.setText("Score: " + this.score);

      // if (donuts.countActive(true) === 0 && !this.gameOver) {
      //   donuts.children.iterate(function (child) {
      //     child.enableBody(true, child.x, 0, true, true);
      //   });

      //skyDonuts.countActive(true) === 0
      if (donuts.countActive(true) === 0 && !this.gameOver) {
        let b =
          cat.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        let a =
          cat.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);
        // donuts.create(x, 3, "donut");

        let c =
          cat.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);
        // donuts.create(x, 3, "donut");

        let fireDonut = fireDonuts.create(a, 2, "fireDonut").setScale(0.3);
        let skyDonut = skyDonuts.create(b, 3, "skyDonut").setScale(0.3);
        let healthDonut = healthDonuts
          .create(c, 1, "healthDonut")
          .setScale(0.3);
        // this would never stop bouncing ! ahh but we took out gravity!
        fireDonut.setBounce(1);
        skyDonut.setBounce(1);
        healthDonut.setBounce(1);
        skyDonut.setCollideWorldBounds(true);
        fireDonut.setCollideWorldBounds(true);
        healthDonut.setCollideWorldBounds(true);
        fireDonut.setVelocity(Phaser.Math.Between(-200, 200, 20));
        skyDonut.setVelocity(Phaser.Math.Between(-200, 200, 20));
        healthDonut.setVelocity(Phaser.Math.Between(-200, 200, 20));
      }
    }

    // GAMEOVER
    let gameOverPic = this.add.image(400, 300, "gameOver");
    gameOverPic.visible = false;

    //this checks if they overlap
    // this.physics.add.overlap(cat, donuts, collectDonut, null, this);

    // Could se
    // this.gameOverText = this.add.text(400, 300, "Gameover!", {
    //   fontSize: "64px",
    //   fill: "#000",
    //   fontFamily: "Minecraft", "PixelFont"
    // });
    // this.gameOverText.setOrigin(0.5);
    // this.gameOverText.visible = false;

    //WHEN HIT WITH A FIRE DONUT:

    // function restartGame() {
    //   this.gameOver = false;
    //   this.scene.start(this);
    // }

    function addHealth(cat, healthDonut) {
      healthDonut.disableBody(true, true);
      cat.clearTint();
      if (health < 5) {
        health += 1;
        healthPercentage += 0.2;
        console.log("addedHealth!");
        console.log("health is now:", health);
        console.log("healthpercentage is now:", healthPercentage);

        this.setMeterPercentage(healthPercentage);
      } else {
        score += 2;
      }
    }

    function donutBurn(cat, fireDonut) {
      console.log("donut burn!");
      cat.setTint(0xff0000);
      if (health <= 3) {
        fireDonut.disableBody(true, true);
        cat.setTint(0xff0000);
      }
      // disable every third fire Donut? maybe...
      // fireDonut.disableBody(true, true);

      health -= 1;
      // let healthDeduct = 1 * 0.25;
      healthPercentage -= 0.2;
      console.log("health:", health);
      console.log("healthPercentage:", healthPercentage);

      this.setMeterPercentage(healthPercentage);
      // this.setMeterPercentageAnimated(healthPercentage);
      // console.log("health:", health);
      if (health <= 0) {
        cat.setTint(0xff0000);
        healthPercentage = 0;
        health = 0;

        this.setMeterPercentage(0);
        this.setMeterPercentageAnimated(0);
        // cat.setTint(0xff0000);
        this.physics.pause();
        // cat.setTint(0xff0000);
        cat.anims.stop();
        this.gameOver = true;
        // this.gameOverText.visible = true;

        highScore = highScore > score ? highScore : score;
        score = 0;
        this.highScoreText.setText("high score: " + highScore);

        // healthBar.refreshBody();
        // this.highScore =
        //   this.highScore > this.score ? this.highScore : this.score;
        // this.score = 0;
        // this.highScoreText.setText("high score: " + this.highScore);
        gameOverPic.visible = true;
        this.playedBefore = true;
        this.input.on("pointerdown", () => {
          this.scene.start(this);
        });
        // this.input.on("pointerdown", restartGame());
        // this.gameOver = false;
      } else if (health >= 1) {
        // cat.setTint(0xff0000);
        // turn red briefly

        // setInterval(() => {
        //   cat.clearTint();
        // }, 1000);

        this.setMeterPercentage(healthPercentage);
        // this.setMeterPercentageAnimated(healthPercentage);
        // this.setMeterPercentage(0);

        //
        // setInterval(() => {
        //   cat.setTint(0xff0000);
        // }, 3000);
      }
    }

    // ADDING COLLIDERS TO GROUND:
    // this.physics.add.collider(cat, ground);
    this.physics.add.collider(donuts, ground);
    // adding first donut
    this.physics.add.collider(firstDonut, ground);

    // Took out colliders for fire donuts so they can rain
    // this.physics.add.collider(fireDonuts, ground);

    //ADDING COLLIDING BEHAVIOR Between CAT & DONUT types
    this.physics.add.overlap(cat, firstDonut, collectDonut, null, this);
    this.physics.add.overlap(cat, donuts, collectDonut, null, this);
    this.physics.add.overlap(cat, skyDonuts, collectDonut, null, this);
    this.physics.add.collider(cat, healthDonuts, addHealth, null, this);

    this.physics.add.collider(cat, fireDonuts, donutBurn, null, this); // game should end... so

    // // GAMEOVER
    // let gameOverPic = this.add.image(400, 300, "gameOver");
    // gameOverPic.visible = false;

    // if (gameOverPic.visible === true) {
    //   this.input.on(
    //     "pointerdown",
    //     () => this.scene.start(this),
    //     (this.gameOver = false)
    //   );
    // }
    if (!gameOverPic.visible) {
      this.gameOver = false;
    }

    this.setMeterPercentage(1);

    // this.setMeterPercentageAnimated(0);
  }

  makeBar(x, y, color) {
    //draw the bar
    let bar = this.add.graphics();

    //color the bar
    bar.fillStyle(color, 1);

    //fill the bar with a rectangle
    bar.fillRect(0, 0, 200, 50);

    //position the bar
    bar.x = x;
    bar.y = y;

    //return the bar
    return bar;
  }
  setValue(bar, percentage) {
    //scale the bar
    bar.scaleX = percentage / 100;
  }

  setMeterPercentage(percent = 1) {
    const width = this.fullWidth * percent;

    this.middle.displayWidth = width;
    this.rightCap.x = this.middle.x + this.middle.displayWidth;
  }

  setMeterPercentageAnimated(percent = 1, duration = 1000) {
    const width = this.fullWidth * percent;

    this.tweens.add({
      targets: this.middle,
      displayWidth: width,
      duration,
      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {
        this.rightCap.x = this.middle.x + this.middle.displayWidth;

        this.leftCap.visible = this.middle.displayWidth > 0;
        this.middle.visible = this.middle.displayWidth > 0;
        this.rightCap.visible = this.middle.displayWidth > 0;
      },
    });
  }

  update() {
    if (!this.asleep && !this.gameOver) {
      if (this.cursors.left.isDown) {
        cat.x -= 5;
        cat.anims.play("leftWalk", true);
      } else if (this.cursors.right.isDown) {
        cat.anims.play("rightWalk", true);
        cat.x += 5;
      } else if (this.cursors.up.isDown) {
        cat.y -= 5;
      } else if (this.cursors.down.isDown) {
        cat.y += 5;
      } else {
      }
      //   else if (this.clickNum !== 3) {
      //     cat.anims.play("sit").on("animationcomplete", () => {
      //       cat.anims.play("sleep");
      //       this.asleep = true;
      //       this.clickNum = 0;
      //     });

      //     // cat.anims.play("sit").on("animationcomplete", onAnimationcomplete);

      //     // cat.setVelocityX(0);
      //     // cat.setVelocityY(0);
      //     // cat.velocity = 0;
      //   } else if (this.clickNum < 3) {
      //     this.input.on("gameobjectdown", this.wakeUp, this);
      //     this.wakeUp(pointer, cat);
      //     console.log("");
      //     //wake up
      //   } else if (this.clickNum === 3) {
      //     cat.anims.play("leftWalk");
      //   }
      //   // after a while... play sit
      //   // cat.play("sit");
      //   // cat.anims.play("sit", true);
      // } else if (this.asleep) {
      //   cat.anims.play("sleep");
      //   if (this.clickNum === 3) {
      //     cat.anims.play("sit");
    }
  }

  //added anims to line 288 cat.anims.play and 294, didn't have anims before
  wakeUp(pointer, cat) {
    if (this.clickNum === 3) {
      //hmmm ! these are in conflict
      cat.anims.play("leftWalk");
    }
    if (!this.asleep) {
      this.clickNum += 1;
    }
    if (this.asleep) {
      cat.anims.play("sit");
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
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "phaser-game",
  scene: [MyGame],
  physics: { default: "arcade", arcade: { gravity: { y: 600 }, debug: false } },
});

game.play;
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
