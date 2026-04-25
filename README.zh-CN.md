<p align="center">
  <img src="assets/readme-banner.svg" alt="OSS README Check banner" width="100%" />
</p>

<h1 align="center">OSS README Check</h1>

<p align="center">
  <b>一个零依赖 CLI，用来检查你的 README 是否适合开源发布和获取关注。</b>
</p>

<p align="center">
  <a href="README.md">English</a>
  ·
  <a href="#快速开始">快速开始</a>
  ·
  <a href="#检查项">检查项</a>
  ·
  <a href="#参与贡献">参与贡献</a>
</p>

<p align="center">
  <a href="https://github.com/aolingge/oss-readme-check/actions/workflows/validate.yml"><img src="https://img.shields.io/github/actions/workflow/status/aolingge/oss-readme-check/validate.yml?branch=main&style=flat-square" alt="CI status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/aolingge/oss-readme-check?style=flat-square" alt="MIT license" /></a>
  <a href="https://github.com/aolingge/oss-readme-check/releases"><img src="https://img.shields.io/github/v/release/aolingge/oss-readme-check?style=flat-square" alt="Latest release" /></a>
</p>

---

## 为什么做这个项目

很多仓库想要 Star，但 README 第一屏没有回答最基础的问题：

- 这个项目是做什么的？
- 适合谁？
- 怎么在 5 分钟内跑出第一次成功？
- 我能不能信任它并愿意试一下？

**OSS README Check 把这些问题变成可重复执行的评分。**

## 快速开始

在任意仓库里运行：

```bash
npx oss-readme-check --path README.md --min-score 80
```

生成 Markdown 报告：

```bash
npx oss-readme-check --markdown > readme-report.md
```

看到类似输出就说明运行成功：

```text
README score: 80/100
PASS Quick start path
FAIL First success verification
```

## 检查项

| 检查项 | 为什么重要 |
| --- | --- |
| 一句话价值主张 | 访问者不应该滚动后才知道项目价值。 |
| 快速开始 | 用户需要能复制运行的第一条路径。 |
| 首次成功验证 | 用户需要知道自己是否跑对了。 |
| 可信徽章 | CI、license、release 可以降低试用成本。 |
| 视觉锚点 | 截图、终端输出或 banner 能增强记忆点。 |
| 按场景入口 | 按目标导航比长文档更容易读。 |
| 多语言入口 | 英文 + 本地语言可以扩大受众。 |
| 贡献路径 | good first issues 能帮助仓库成长。 |
| 安全边界 | 避免用户把密钥贴到公开 issue。 |
| License 可见 | 用户需要知道能否复用。 |

## 示例

```bash
oss-readme-check --path README.md --markdown
```

```md
# README Audit Report

Score: **82/100**

| Status | Check | Fix |
| --- | --- | --- |
| PASS | Quick start path | |
| FAIL | First success verification | Tell users how to know the first run succeeded. |
```

## 参与贡献

适合新手的贡献方向：

- 增加更多检查项。
- 优化评分权重。
- 增加 README 模板。
- 增加 CLI、Web App、模板仓库、库项目的示例。

运行检查：

```bash
npm test
node src/cli.js --path README.md --min-score 80
```

## License

MIT
