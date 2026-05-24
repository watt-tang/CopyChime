# CopyChime

<p align="center">
  <img src="assets/pic_head.png" alt="CopyChime" width="480" />
</p>

<p align="center">
  <strong>一个轻量的 Windows 剪贴板小挂件</strong><br/>
  复制提示、历史浏览、快速粘贴。
</p>

<p align="center">
  <a href="README.md">English</a>
</p>

---

## 这是什么

CopyChime 是一个轻量的剪贴板 HUD（桌面小挂件）。每次复制文本时弹出提示气泡，可以浏览最近的剪贴板历史，也可以快速重新复制之前的条目。

## 它不是什么

CopyChime **不是** Ditto、CopyQ、EcoPaste 那样的完整剪贴板管理器。它刻意保持简单：

- 不保存图片/文件剪贴板历史
- 不支持富文本
- 不需要云同步或账号
- 不含 AI、OCR
- 不发起任何网络请求
- 不收集任何分析数据或遥测

## 下载

前往 [GitHub Releases](https://github.com/watt-tang/CopyChime/releases) 下载：

**CopyChime-0.1.0-win-portable.exe**

无需安装，双击即可运行。

## 功能特性

- **复制提示气泡** — 复制文本后弹出气泡，显示预览、字符数、行数
- **剪贴板历史** — 浏览并重新复制最近的文本片段
- **置顶条目** — 重要的片段不会被自动清理
- **隐私模式** — 隐藏剪贴板内容，不在 UI 中显示
- **敏感内容检测** — 自动识别并遮蔽 API Key、Token、密码等
- **忽略规则** — 跳过匹配自定义规则的剪贴板内容
- **主题切换** — Light、Dark、Catppuccin、Mint、Mono、Pixel Lavender、System
- **系统托盘** — 最小化到托盘，暂停/恢复、快速访问
- **全局快捷键** — Ctrl+Alt+C/H/P/M/V 快速控制
- **窗口位置记忆** — 记住你放置 HUD 的位置
- **像素吉祥物 UI** — 可爱的像素风吉祥物 + 音效反馈
- **快速粘贴面板** — Ctrl+Alt+V 搜索并粘贴最近/收藏的片段
- **收藏夹** — 保存常用的文本片段
- **搜索** — 过滤历史和收藏夹
- **应用排除规则** — 跳过密码管理器等应用的剪贴板捕获
- **纯文本粘贴** — 去除零宽字符，规范化文本

## 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Electron 33 |
| UI 框架 | React 18 + TypeScript 5.6 |
| 构建工具 | Vite 6 |
| 打包 | electron-builder |
| CI/CD | GitHub Actions |
| 音效 | Web Audio API（本地合成，无外部音频文件）|
| 主题系统 | CSS Variables + `data-theme` 属性 |
| 安全 | contextBridge + contextIsolation（禁用 nodeIntegration）|
| 存储 | JSON 文件，保存在 `app.getPath("userData")` |

## 隐私说明

CopyChime 所有数据保存在本地用户目录，不会上传任何内容。

- **不上传**剪贴板内容
- **不发起**任何网络请求
- **不收集**分析数据或遥测
- **不连接**云服务

音效通过 Web Audio API 在本地生成，不从网络加载任何音频文件。

## Windows SmartScreen 说明

当前版本**未做代码签名**。首次运行时 Windows 可能会弹出 SmartScreen 警告。这是未签名开源软件的常见情况，请放心使用。请只从官方 [GitHub Releases](https://github.com/watt-tang/CopyChime/releases) 页面下载。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm install
npm run typecheck
npm run build
```

## 打包 Windows 便携版

```bash
npm install
npm run dist:win
```

输出：`release/CopyChime-0.1.0-win-portable.exe`

## 发布

发布新版本：

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions 会自动构建 Windows 便携版 exe 并上传到 GitHub Release。

**注意：** 需要在仓库 Settings → Actions → General → Workflow permissions 中设置为 **Read and write permissions**。

## 全局快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+Alt+C | 显示/隐藏窗口 |
| Ctrl+Alt+H | 打开历史面板 |
| Ctrl+Alt+P | 暂停/恢复剪贴板监听 |
| Ctrl+Alt+M | 切换隐私模式 |
| Ctrl+Alt+V | 快速粘贴面板 |

## 截图

TODO: 添加 GIF
