import { Application, Graphics, filters, BLEND_MODES } from "pixi.js";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";

export const draw = () => {
    const app = new Application({
        antialias: true,
        backgroundAlpha: 0,
        width: 1270,
        height: 720,
        resolution: window.devicePixelRatio || 1,
    });
    app.view.classList.add("w-full");
    app.view.classList.add("h-full");
    app.view.classList.add("fixed");
    app.view.classList.add("top-0");
    app.view.classList.add("object-cover");
    app.view.classList.add("-z-1");
    document.body.appendChild(app.view);

    const c1 = new Graphics();
    c1.lineStyle(0);
    c1.beginFill(0xF96446, 0.5);
    c1.drawCircle(320, 240, 240);
    c1.blendMode = BLEND_MODES.SCREEN;
    c1.endFill();

    const c2 = new Graphics();
    c2.lineStyle(0);
    c2.beginFill(0xFAEA5F, 0.5);
    c2.drawCircle(640, 360, 240);
    c2.blendMode = BLEND_MODES.SCREEN;
    c2.endFill();

    const c3 = new Graphics();
    c3.lineStyle(0);
    c3.beginFill(0x2DFAA9, 0.5);
    c3.drawCircle(960, 480, 240);
    c3.blendMode = BLEND_MODES.SCREEN;
    c3.endFill();

    app.stage.addChild(c1, c2, c3);

    const blurFilter = new KawaseBlurFilter(20, 10, false);
    blurFilter.pixelSize = [3, 3];
    blurFilter.padding = 240;
    const oldFilmfilter = new filters.NoiseFilter(0.1, 1);
    app.stage.filters = [blurFilter, oldFilmfilter];

    let c1XFactor = 1;
    let c1YFactor = 1;
    const updateC1Pos = () => {
        if (c1.position.x >= 200) {
            c1XFactor = -1;
        } else if (c1.position.x <= 0) {
            c1XFactor = 1;
        }
        c1.position.x += c1XFactor * 0.2;

        if (c1.position.y >= 200) {
            c1YFactor = -1;
        } else if (c1.position.y <= -200) {
            c1YFactor = 1;
        }
        c1.position.y += c1YFactor * 0.3;
    };

    let c2XFactor = -1;
    let c2YFactor = 1;
    const updateC2Pos = () => {
        if (c2.position.x >= 200) {
            c2XFactor = -1;
        } else if (c2.position.x <= -200) {
            c2XFactor = 1;
        }
        c2.position.x += c2XFactor * 0.2;

        if (c2.position.y >= 200) {
            c2YFactor = -1;
        } else if (c2.position.y <= -200) {
            c2YFactor = 1;
        }
        c2.position.y += c2YFactor * 0.1;
    };

    let c3XFactor = 1;
    let c3YFactor = -1;
    const updateC3Pos = () => {
        if (c3.position.x >= 200) {
            c3XFactor = -1;
        } else if (c3.position.x <= 0) {
            c3XFactor = 1;
        }
        c3.position.x += c3XFactor * 0.05;

        if (c3.position.y >= 200) {
            c3YFactor = -1;
        } else if (c3.position.y <= -200) {
            c3YFactor = 1;
        }
        c3.position.y += c3YFactor * 0.2;
    };
    app.ticker.add(() => {
        updateC1Pos();
        updateC2Pos();
        updateC3Pos();
    });
};

draw();
