import Phaser from "phaser";

// STUFF I want to add:
// standing idle animation when not clicking
// idle animation chains with sit and then sleep
// get rid of gravity at the beginning
// sounds-- meow when you wake it up
// music
// donuts it can eat around the screen if you take the gravity out

let cat;

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: "demo", active: true });
  }

  preload() {
    this.load.spritesheet("cat", "./src/assets/pusheenWalk.png", {
      frameWidth: 300,
      height: 300,
    });
    this.load.image("background", "./src/assets/grassDarkHand.png");
    this.load.image("ground", "./src/assets/groundT.png");
  }

  create() {
    this.cameras.main.backgroundColor.setTo(255, 255, 255);
    //this adds our background...

    this.add.image(400, 300, "background");
    console.log("this.physics", this.physics);

    cat = this.physics.add.sprite(400, 0, "cat", 0);
    cat.setGravityY(600);

    let ground = this.physics.add.sprite(400, 525, "ground");
    ground.displayWidth = this.sys.game.config.width;

    this.physics.add.collider(cat, ground);
    ground.setImmovable();

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

    this.asleep = true;
    this.clickNum = 0;
    this.cursors = this.input.keyboard.createCursorKeys();

    cat.on("animationcomplete", () => {
      cat.anims.play("sleep");
      this.asleep = true;
      this.clickNum = 0;
    });

    cat.play("sleep");

    cat.setInteractive();
    this.input.on("gameobjectdown", this.wakeUp, this);
    // cat.setGravityY(300);

    // player= this.add.sprite()
  }

  update() {
    if (!this.asleep) {
      if (this.cursors.left.isDown) {
        console.log("cat-->", cat);
        cat.x -= 2;
        console.log("left key works!");
        cat.anims.play("leftWalk", true);
      } else if (this.cursors.right.isDown) {
        //   this.cat.velocity.x = -150;
        console.log("right key works");
        // cat.stop();
        cat.anims.play("rightWalk", true);
        cat.x += 2;
        //   this.cat.play("sleep");
      } else if (this.cursors.up.isDown) {
        console.log("upkeyworks!");
        //   cat.play("leftWalk");
        cat.velocity = 50;
        cat.y -= 3.5;
      } else if (this.cursors.down.isDown) {
        console.log("down key works!");
        cat.y += 2;
      }
      //   if (!this.cursors.left.active && !this.cursors.right.active)
      else {
        // cat.play("sit");
        // cat.anims.play("sit");
        // how to get it to go back to sleep?/?? hmm
        // setInterval(() => {
        //   cat.play("sit");
        // }, 100);
        // cat.play("sit");
        // cat.anims.play("sit");
      }
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
    }

    // Make it actually jump! :)
    // else {
    //   //   this.cat.stop();
    // }
  }

  wakeUp(pointer, cat) {
    if (this.clickNum === 3) {
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

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "phaser-game",
  scene: [MyGame],
  physics: { default: "arcade", arcade: { debug: false } },
});

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
