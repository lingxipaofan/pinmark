# Pinmark New Tab

这是基于 [makerjackie/pinmark](https://github.com/makerjackie/pinmark) fork 的个人自用版本。

Pinmark 原本是一个 Chrome 书签管理扩展。本仓库在原版基础上做了少量面向个人使用习惯的调整，主要用于把书签管理页直接作为 Chrome 新标签页使用。

这些定制功能均由 AI 辅助完成，项目目前以自用为主。

## 与原版的主要区别

1. **接管 Chrome 新标签页**

   打开新的 Chrome 标签页时，直接展示 Pinmark 书签管理界面，不需要再通过扩展图标进入。

2. **瀑布流式书签分组布局**

   原版导航视图使用普通网格布局，不同分组高度不一致时容易出现较大的空白区域。本版本将导航视图调整为 masonry-like multi-column layout，也就是类似瀑布流的多列自然排布，让不同高度的书签分组可以更紧凑地排列。

## 其他个人调整

- 普通点击书签条目时直接打开链接。
- 左侧选择控件用于选中/取消选中书签，方便批量操作。
- 失效链接提示做了降噪处理，避免在界面中过于醒目。

## 开发

```bash
npm install
npm run dev
npm run build
```

项目基于 WXT、React、TypeScript 和 Vite。

## 安装本地版本

构建后在 Chrome 中打开：

```text
chrome://extensions/
```

然后开启「开发者模式」，选择「加载已解压的扩展程序」，加载构建生成的扩展目录。

## 上游项目

- 原项目：[makerjackie/pinmark](https://github.com/makerjackie/pinmark)
- 本仓库：[lingxipaofan/pinmark](https://github.com/lingxipaofan/pinmark)

## 说明

这是个人自用的 AI 定制版本，不代表原项目作者的设计取向。如需通用版本，请优先参考上游仓库。

## License

MIT. 原始项目版权归原作者所有。
