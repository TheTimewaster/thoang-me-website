import { Application, Graphics, NoiseFilter, WebGLRenderer } from "pixi.js";
import { KawaseBlurFilter } from "pixi-filters";

type ShapeDefinition = {
  color: number;
  vector: [number, number];
  initPos: [number, number];
  colors: {
    dark: number;
    light: number;
  };
}

const speed = 0.3;
const shapes: ShapeDefinition[] = [
  {
    color: 0x2e05be,
    vector: [-1 * speed, -1 * speed],
    initPos: [160, 160],
    colors: {
      dark: 0x2e05be,
      light: 0xcfc7fa,
    },
  },
  {
    color: 0x02452a,
    vector: [1 * speed, 1 * speed],
    initPos: [960, 360],
    colors: {
      dark: 0x02452a,
      light: 0xd7e9db,
    }
  },
  {
    color: 0x140251,
    vector: [1 * speed, -1 * speed],
    initPos: [1280, 480],
    colors: {
      dark: 0x140251,
      light: 0xced9ed,
    }
  },
  {
    color: 0x995252,
    vector: [-1 * speed, 1 * speed],
    initPos: [0, 720],
    colors: {
      dark: 0x995252,
      light: 0xe2c6ee,
    }
  },
];

const isPlaying = {
  value: true,
  get() {
    return this.value;
  },
  set(value: boolean) {
    this.value = value;
  },
}

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

let app: Application;
let shapeInstances: Shape[] = [];

const switchColor = (isDarkMode: boolean) => {
  const oldPositions = shapeInstances.map((shape) => {
    return [shape.graphic.x, shape.graphic.y];
  });

  shapeInstances = shapes.map((definition, index) => {
    const color = isDarkMode ? definition.colors.dark : definition.colors.light;

    return new Shape({
      color: color,
      vector: definition.vector,
      initPos: oldPositions[index] as [number, number],
    });
  });

  app.stage.removeChildren();
  app.stage.addChild(
    ...shapeInstances.map((shape) => shape.graphic)
  );
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

  shapeInstances = shapes.map((definition) => {
    const color = isDarkMode ? definition.colors.dark : definition.colors.light;

    return new Shape({
      color: color,
      vector: definition.vector,
      initPos: definition.initPos,
    });
  });

  app.stage.addChild(
    ...shapeInstances.map((shape) => shape.graphic)
  );

  const blurFilter = new KawaseBlurFilter({
    strength: 10,
    quality: 10,
    clamp: true,
    pixelSize: [3, 3],
  });
  blurFilter.padding = 240;
  const oldFilmfilter = new NoiseFilter({
    noise: 0.05,
  });
  app.stage.filters = [blurFilter, oldFilmfilter];

  app.ticker.add(() => {
    if (isPlaying.get()) {
      shapeInstances.forEach((shape) => {
        shape.move();
      });
    }
  });
};

draw();

const stop = () => {
  isPlaying.set(false);
  app.stop();

}

const resume = () => {
  isPlaying.set(true);
  app.start();

}

export { switchColor, stop, resume, isPlaying };
