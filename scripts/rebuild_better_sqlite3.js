// scripts/rebuild-sqlite.js
const { execSync } = require('child_process')
const { version, modules } = process.versions

// 从 process.versions 获取 Electron 和 ABI 版本
const electronVersion = require('electron/package.json').version // 更精确的版本
const abiVersion = modules // 对应 --abi 参数

console.log(`Rebuilding for Electron ${electronVersion}, ABI ${abiVersion}...`)

// 执行重建命令
execSync(
    // eslint-disable-next-line max-len
    `npm rebuild better-sqlite3 --runtime=electron --target=${electronVersion} --abi=${abiVersion} --dist-url=https://electronjs.org/headers`,
    { stdio: 'inherit' } // 显示实时输出
)
