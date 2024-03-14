import { Application, Graphics, NoiseFilter, WebGLRenderer } from "pixi.js";
import { KawaseBlurFilter } from "pixi-filters";

const factor = 0.3;

class Shape {
  _graphic: Graphics = new Graphics();
  vector: [number, number] = [0, 0];

  constructor({
    color,
    vector,
    initPos,
  }: {
    color: number;
    vector: [number, number];
    initPos: [number, number];
  }) {
    this.vector = vector;
    this.initGraphics(color, initPos);
  }

  initGraphics(color: number, position: [number, number]) {
    this._graphic = new Graphics()
      .circle(0, 0, 480)
      .setStrokeStyle(0)
      .fill(color);
    // .getGlobalPosition(new Point(position[0], position[1]))
    this._graphic.position.set(position[0], position[1]);
    this._graphic.blendMode = 'screen'
  }

  move() {
    if (this._graphic.position.x >= 1280 || this._graphic.position.x <= 0) {
      this.vector[0] = this.vector[0] * -1;
    }
    this._graphic.position.x += this.vector[0];

    if (this._graphic.position.y >= 720 || this._graphic.position.y <= 0) {
      this.vector[1] = this.vector[1] * -1;
    }
    this._graphic.position.y += this.vector[1];
  }

  get graphic() {
    return this._graphic;
  }
}

let c1: Shape;
let c2: Shape;
let c3: Shape;
let app: Application;

const switchColor = (isDarkMode: boolean) => {
  c1 = new Shape({
    color: isDarkMode ? 0x2e05be : 0xfa856e,
    vector: c1.vector,
    initPos: [c1.graphic.x, c1.graphic.y],
  });

  c2 = new Shape({
    color: isDarkMode ? 0x02452a : 0x2dfaa9,
    vector: c2.vector,
    initPos: [c2.graphic.x, c2.graphic.y],
  });

  c3 = new Shape({
    color: isDarkMode ? 0x140251 : 0xfaea5f,
    vector: c3.vector,
    initPos: [c3.graphic.x, c3.graphic.y],
  });

  app.stage.removeChildren();
  app.stage.addChild(c1.graphic, c2.graphic, c3.graphic);
};

const draw = async () => {
  const isDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  app = new Application<WebGLRenderer<HTMLCanvasElement>>();

  await app.init({
    antialias: true,
    backgroundAlpha: 0,
    width: 1280,
    height: 720,
    resolution: window.devicePixelRatio || 1,
  });

  document.body.appendChild(app.canvas);

  app.canvas.classList.add("w-full");
  app.canvas.classList.add("h-full");
  app.canvas.classList.add("fixed");
  app.canvas.classList.add("top-0");
  app.canvas.classList.add("object-cover");
  app.canvas.classList.add(/* tw */ "-z-50");

  c1 = new Shape({
    color: isDarkMode ? 0x2e05be : 0xa289fc,
    vector: [-1 * factor, -1 * factor],
    initPos: [320, 240],
  });

  c2 = new Shape({
    color: isDarkMode ? 0x02452a : 0x2dfaa9,
    vector: [1 * factor, 1 * factor],
    initPos: [640, 360],
  });

  c3 = new Shape({
    color: isDarkMode ? 0x140251 : 0xffe1db,
    vector: [1 * factor, -1 * factor],
    initPos: [960, 480],
  });

  app.stage.addChild(c1.graphic, c2.graphic, c3.graphic);

  const blurFilter = new KawaseBlurFilter({
    strength: 10,
    quality: 10,
    clamp: true,
    pixelSize: [3, 3],
  });
  blurFilter.padding = 240;
  const oldFilmfilter = new NoiseFilter({
    noise: 0.1,
  });
  app.stage.filters = [blurFilter];

  app.ticker.add(() => {
    c1.move();
    c2.move();
    c3.move();
  });
};

draw();

export { switchColor };
