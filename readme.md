# @gjfleo/koishi-plugin-g2

[![npm](https://img.shields.io/npm/v/@gjfleo/koishi-plugin-g2?style=flat-square)](https://www.npmjs.com/package/@gjfleo/koishi-plugin-g2)

在koishi中使用[@antv/g2](https://g2.antv.antgroup.com/charts/overview)绘制统计图表。

参考了[@antv/g2-ssr](https://github.com/antvis/g2-extensions/blob/master/ssr/README.md)，基于[skia-canvas插件](@ltxhhz/koishi-plugin-skia-canvas)实现。

## 用法

```tsx
const chart = await ctx.g2.createChart({
  type: "interval",
  autoFit: true,
  data: [
    { name: "London", 月份: "Jan.", 月均降雨量: 18.9 },
    { name: "London", 月份: "Feb.", 月均降雨量: 28.8 },
    { name: "London", 月份: "Mar.", 月均降雨量: 39.3 },
    { name: "London", 月份: "Apr.", 月均降雨量: 81.4 },
    { name: "London", 月份: "May", 月均降雨量: 47 },
    { name: "London", 月份: "Jun.", 月均降雨量: 20.3 },
    { name: "London", 月份: "Jul.", 月均降雨量: 24 },
    { name: "London", 月份: "Aug.", 月均降雨量: 35.6 },
    { name: "Berlin", 月份: "Jan.", 月均降雨量: 12.4 },
    { name: "Berlin", 月份: "Feb.", 月均降雨量: 23.2 },
    { name: "Berlin", 月份: "Mar.", 月均降雨量: 34.5 },
    { name: "Berlin", 月份: "Apr.", 月均降雨量: 99.7 },
    { name: "Berlin", 月份: "May", 月均降雨量: 52.6 },
    { name: "Berlin", 月份: "Jun.", 月均降雨量: 35.5 },
    { name: "Berlin", 月份: "Jul.", 月均降雨量: 37.4 },
    { name: "Berlin", 月份: "Aug.", 月均降雨量: 42.4 },
  ],
  encode: { x: "月份", y: "月均降雨量", color: "name" },
  transform: [{ type: "dodgeX" }],
  interaction: { elementHighlight: { background: true } },
  theme: { view: { viewFill: "white" } },
});
const dataUrl = await chart.toDataURL("png");
session.send(<img src={dataUrl} />);
```

注意事项：

- `animate` 和 `interaction` 相关的配置项不会生效
- 默认主题的背景色为透明，在发送消息场景中通常需要指定
- 部分功能（如 `image` 标记）无法使用
