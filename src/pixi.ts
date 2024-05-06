import { Application, Graphics, NoiseFilter, WebGLRenderer } from "pixi.js";
import { KawaseBlurFilter } from "pixi-filters";

const CANVAS_DIMENSIONS = [1280, 720];

const SHAPE_RADIUS = 480;
const MIN_SHAPE_RADIUS = 480;
const MAX_SHAPE_RADIUS = 960;
type ShapeDefinition = {
  vector: [number, number];
  initPos: [number, number];
  colors: {
    dark: number;
    light: number;
  };
}

const DEFAULT_SPEED = 0.2;
const SIZE_CHANGE_SPEED = 0.5;
const getVector = (speed: number): [number, number] => {
  // let speed, the same, but randomize the direction
  const xMove = Math.random() > 0.5 ? speed : -1 * speed;
  const yMove = Math.random() > 0.5 ? speed : -1 * speed;
  return [xMove, yMove];
}
const shapes: ShapeDefinition[] = [
  {
    vector: getVector(DEFAULT_SPEED),
    initPos: [160, 160],
    colors: {
      dark: 0x2e05be,
      light: 0xB0AAFA,
    },
  },
  {
    vector: getVector(DEFAULT_SPEED),
    initPos: [960, 360],
    colors: {
      dark: 0x02452a,
      light: 0xF0A1C8,
    }
  },
  {
    vector: getVector(DEFAULT_SPEED),
    initPos: [1280, 480],
    colors: {
      dark: 0x140251,
      light: 0x96E4EE,
    }
  },
  {
    vector: getVector(DEFAULT_SPEED),
    initPos: [0, 720],
    colors: {
      dark: 0x995252,
      light: 0xF5B7B0,
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
  color: number = 0x000000;
  size: number = 480;
  sizeChange: number = -1.0; 

  constructor({
    color,
    vector,
    initPos,
    size,
    sizeChange
  }: {
    color: number;
    vector: [number, number];
    initPos: [number, number];
    size: number;
    sizeChange: number;
  }) {
    this.vector = vector;
    this.color = color;
    this.size = size;
    this.sizeChange = sizeChange;
    this.initGraphics(color, initPos);
  }

  initGraphics(color: number, position: [number, number]) {
    this._graphic = new Graphics()
      .circle(0, 0, SHAPE_RADIUS)
      .setStrokeStyle(0)
      .fill({color});
    // .getGlobalPosition(new Point(position[0], position[1]))
    this._graphic.position.set(position[0], position[1]);
    this._graphic.blendMode = 'negation'
  }

  animate() {
    if (
      this._graphic.position.x >= CANVAS_DIMENSIONS[0] - MIN_SHAPE_RADIUS || 
      this._graphic.position.x - MIN_SHAPE_RADIUS <= 0
    ) {
      this.vector[0] = this.vector[0] * -1;
    }
    this._graphic.position.x += this.vector[0];

    if (
      this._graphic.position.y >= CANVAS_DIMENSIONS[1] - MIN_SHAPE_RADIUS || 
      this._graphic.position.y - MIN_SHAPE_RADIUS <= 0
    ) {
      this.vector[1] = this.vector[1] * -1;
    }
    this._graphic.position.y += this.vector[1];

    // gradually change the size
    const size = this._graphic.width;
    const newSize = size + this.sizeChange;

    // limit the size to 960
    if (newSize >= MAX_SHAPE_RADIUS) {
      this.sizeChange = -1 * Math.random() * SIZE_CHANGE_SPEED;
    } else if (newSize <= MIN_SHAPE_RADIUS) {
      // do not allow the size to be smaller than 240
      this.sizeChange = 1 * Math.random() * SIZE_CHANGE_SPEED;
    }

    this._graphic.width = newSize;
    this._graphic.height = newSize;
  }

  get graphic() {
    return this._graphic;
  }
}

let app: Application;
let shapeInstances: Shape[] = [];

const draw = async () => {
  const isDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  app = new Application<WebGLRenderer<HTMLCanvasElement>>();

  await app.init({
    antialias: true,
    backgroundAlpha: 0,
    width: CANVAS_DIMENSIONS[0],
    height: CANVAS_DIMENSIONS[1],
    resolution: window.devicePixelRatio || 1,
  });

  document.body.appendChild(app.canvas);

  app.canvas.classList.add(
    "w-full",
    "h-full",
    "fixed",
    "top-0",
    "object-cover",
    "-z-50"    
  );

  shapeInstances = shapes.map((definition) => {
    const color = isDarkMode ? definition.colors.dark : definition.colors.light;

    return new Shape({
      color: color,
      vector: definition.vector,
      initPos: definition.initPos,
      size: SHAPE_RADIUS,
      sizeChange: -1.0,
    });
  });

  // randomize the order of the shapes
  shapeInstances.sort(() => Math.random() - 0.5);
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
        shape.animate();
      });
    }
  });
};

const switchColor = (isDarkMode: boolean) => {
  const oldInfos = shapeInstances.map((shape) => {
    return {
      color: shape.color,
      vector: shape.vector,
      initPos: [shape.graphic.x, shape.graphic.y],
      size: shape.graphic.width,
      sizeChange: shape.sizeChange,
    };
  });

  shapeInstances = shapes.map((definition, index) => {
    const color = isDarkMode ? definition.colors.dark : definition.colors.light;

    return new Shape({
      color: color,
      vector: definition.vector,
      initPos: oldInfos[index].initPos as [number, number],
      size: oldInfos[index].size,
      sizeChange: oldInfos[index].sizeChange,
    });
  });

  app.stage.removeChildren();
  // shuffle the order of the shapes
  app.stage.addChild(
    ...shapeInstances.map((shape) => shape.graphic)
  );

  if (!isPlaying.get()) {
    // we need to temporarily start the app to update the colors, but not change the state
    app.start();
  }
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
