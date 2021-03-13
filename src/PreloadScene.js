import { Scene } from "phaser";

class PreloadScene extends Scene {
  constructor() {
    super("preload");
  }
  // preload(){
  //   this.load.image
  // }
  create() {
    this.input.on("pointerdown", () => {
      this.scene.start("game");
    });
  }
}

export default PreloadScene;
