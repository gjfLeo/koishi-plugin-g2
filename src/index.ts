import type { G2Context } from "@antv/g2";
import type { Canvas as SkiaCanvas } from "@ltxhhz/koishi-plugin-skia-canvas";
import type { Context } from "koishi";
import type { ConfigType, Options } from "./types";

import { Canvas as GCanvas } from "@antv/g";
import { render, stdlib } from "@antv/g2";
import { Renderer } from "@antv/g-canvas";
import { h, Schema, Service } from "koishi";
import { demo } from "./demo";
import { sleep } from "./utils";

declare module "koishi" {
  interface Context {
    g2: G2;
  }
}

export default class G2 extends Service {
  static inject = ["skia"];
  static Config = Schema
    .object({
      enableDemoCommand: Schema.boolean().default(true),
    })
    .i18n({
      zh: {
        enableDemoCommand: "是否启用示例指令",
      },
    });

  constructor(public ctx: Context, public config: ConfigType) {
    super(ctx, "g2");

    if (this.config.enableDemoCommand) {
      ctx.command("g2.条形图", "绘制示例条形图")
        .action(async ({ session }) => {
          const chart = await this.createChart(demo["条形图"]);
          const dataUrl = await chart.toDataURL("png");
          session.send(h.image(dataUrl));
        });
      ctx.command("g2.折线图", "绘制示例折线图")
        .action(async ({ session }) => {
          const chart = await this.createChart(demo["折线图"]);
          const buffer = await chart.png;
          session.send(h.image(buffer, "image/png"));
        });
      ctx.command("g2.雷达图", "绘制示例雷达图")
        .action(async ({ session }) => {
          const chart = await this.createChart(demo["雷达图"]);
          const dataUrl = await chart.toDataURL("svg");
          session.send(h("img", { src: dataUrl }));
        });
    }

    this.ctx.logger.info("加载成功");
  }

  async createChart(options: Options) {
    const {
      width = 640,
      height = 480,
      waitForRender = 16,
      ...restOptions
    } = options;

    const [gCanvas, nodeCanvas] = this.createG2Canvas(options);
    const context: G2Context = {
      canvas: gCanvas,
      library: this.updateLight(),
      createCanvas: () =>
        this.createSkiaCanvas(300, 150) as unknown as HTMLCanvasElement,
    };

    await new Promise<void>(resolve =>
      render({ width, height, animate: false, ...restOptions }, context, resolve),
    );

    await sleep(waitForRender);

    return nodeCanvas;
  }

  private createSkiaCanvas(width: number, height: number) {
    return new this.ctx.skia.Canvas(width, height);
  }

  private createG2Canvas(options: Options): [GCanvas, SkiaCanvas] {
    const {
      width = 640,
      height = 480,
      devicePixelRatio = 2,
    } = options;
    const nodeCanvas = this.createSkiaCanvas(width, height);
    const offscreenNodeCanvas = this.createSkiaCanvas(1, 1);

    const renderer = new Renderer();
    const htmlRendererPlugin = renderer.getPlugin("html-renderer");
    const domInteractionPlugin = renderer.getPlugin("dom-interaction");
    renderer.unregisterPlugin(htmlRendererPlugin);
    renderer.unregisterPlugin(domInteractionPlugin);

    const gCanvas = new GCanvas({
      width,
      height,
      devicePixelRatio,
      renderer,
      // @ts-expect-error missing types
      canvas: nodeCanvas,
      // @ts-expect-error missing types
      offscreenCanvas: offscreenNodeCanvas,
    });

    return [gCanvas, nodeCanvas];
  }

  private updateLight() {
    const lib = stdlib();
    return lib;
  }
}

export { Options as G2ChartOptions } from "./types";
