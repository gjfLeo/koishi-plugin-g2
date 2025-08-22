import type { G2Spec } from "@antv/g2";

export interface ConfigType {
  enableDemoCommand: boolean;
}

export type Options = G2Spec & {
  width?: number;
  height?: number;
  devicePixelRatio?: number;
  waitForRender?: number;
};
