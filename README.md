# 🏞QQ-NT-TS

QQ-NT-TS 是我闲暇时间用于练习Electron和Vue3以及Pinia，vite，CSS，webWorker，组件封装，实现暗夜模式，等等的练习项目。

## ⛽️技术栈

**Vue3**

> 核心框架

**Pinia**

> 劫持了Pinia.$onAction实现状态更新后通知其他窗口更新状态

**Element Plus**

> 二次封装并且:deep(){}修改了内部的样式

**Scss**

> 主要利用其嵌套语法和deep(){}样式穿透

**Vite**

> 优化打包，压缩代码，处理兼容性等等的高速构建工具

## 🪝通用hooks

**useBeforeCreateGetUpdatedPiniaState**

> 让该窗口可以在创建的时候就去获取最新的Pinia仓库状态并且同步更新

**useUpdatePiniaStateSync**

> 让该窗口一直监听其他窗口的Pinia仓库状态的更新，并且同步增量更新

**useReactiveHeight**

> 获取一个响应式高度，自动卸载

## 特点

1. 采用定高和不定高虚拟列表优化好友列表和聊天列表性能
2. 采用窗口池，稳定维护5个窗口复用优化启动速度
3. 采用SQLite本地缓存消息
4. 采用切片上传文件，Web Worker多线程MD5生成标识符
5. 采用路由，图片懒加载，事件监听节流来优化性能
6. 采用protobuf协议，高效，轻量。并实现超时重传，自动重连，任务队列控制并发数目
7. 支持暗黑模式

### 安装依赖

```bash
$ pnpm install
# 预处理hasky以及编译better-sqlite3
$ pnpm run prepare
```

### 开发模式运行

! 注意，如果pnpm run dev后报错Electron uninstall，请跳转到第一个错误“getElectronPath”函数中，打印
pathFile的文件地址，找到Electron安装依赖的位置，然后进入对应的位置，执行npm run postinstall
即可。（一般来说都是QQ-NT-TS\node_modules\.pnpm\electron@35.1.5\node_modules\electron目录下，
执行npm run postinstall命令即可）

```bash
$ pnpm run dev
```

### 生产模式打包

```bash
$ pnpm run build
```
