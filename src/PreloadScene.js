import { Scene } from "phaser";

class PreloadScene extends Scene {
  constructor() {
    super("preload");
  }

  create() {
    this.input.on("pointerdown", () => {
      this.scene.start("game");
    });
  }
}

export default PreloadScene;
