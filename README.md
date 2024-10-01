# 🏞QQ-NT-TS
QQ-NT-TS 是我闲暇时间用于练习Electron和Vue3以及Pinia，vite，CSS，实现暗夜模式，a11y等等的联系项目。

## ⛽️技术栈

**Vue3**
> 核心框架

**Pinia**
> 自定义了Pinia插件实现状态更新后通知其他窗口更新状态

**Element Plus**
> 二次封装并且:deep{}修改了内部的样式

**Scss**
> 主要利用其嵌套语法

**Vite**
> 优化打包，压缩代码，处理兼容性等等的高速构建工具

## 🪝通用hooks

**useBeforeCreateGetUpdatedPiniaState**
> 让该窗口可以在创建的时候就去获取最新的Pinia仓库状态并且同步更新

**useUpdatePiniaStateSync**
> 让该窗口一直监听其他窗口的Pinia仓库状态的更新，并且同步更新，只会更新修改的部分

## Project Setup

### 安装依赖

```bash
$ pnpm install
```

### 开发模式

```bash
$ npm run dev
```

