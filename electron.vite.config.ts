import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import viteImagemin from 'vite-plugin-imagemin'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import purgecss from 'vite-plugin-purgecss'
import Components from 'unplugin-vue-components/vite'
// 给本地模块开启HTTP2
import mkcert from 'vite-plugin-mkcert'
import { visualizer } from 'rollup-plugin-visualizer'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        // esbuild: {
        //     drop: ['console', 'debugger']
        // },
        resolve: {
            alias: {
                '@main': resolve('src/main/')
            }
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                '@components': resolve('src/renderer/src/components'),
                '@views': resolve('src/renderer/src/views'),
                '@hooks': resolve('src/renderer/src/hooks/'),
                '@main': resolve('src/main/')
            },
            extensions: ['.js', '.ts', '.vue', '.json']
        },
        // 打包模式删除console和debugger
        // esbuild: {
        //     drop: ['console', 'debugger']
        // },
        define: {
            __VUE_OPTIONS_API__: false
        },
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            }),
            // 图片压缩
            viteImagemin({
                optipng: { optimizationLevel: 7 },
                mozjpeg: {
                    quality: 50
                },
                pngquant: {
                    quality: [0.7, 0.9]
                }
            }),
            mkcert(),
            // 裁剪没用CSS
            purgecss(),
            // 打包产物体积分析
            visualizer({
                open: true
            })
        ],
        // 因为开启HTTP2要TLS，所以开启这个
        server: {
            https: true
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@import './src/renderer/src/styles/index.scss';",
                    javascriptEnabled: true
                }
            }
        },
        // 优化前有160kb，606kb，1147kb的js文件太大了
        build: {
            // 指定目标平台，我electron用到最新的chromium，直接用最新的ES语法，
            // 这样可以做到代码体积极致压缩
            target: 'esnext',
            rollupOptions: {
                output: {
                    manualChunks: {
                        utils: ['lodash-es', 'long', 'systeminformation'],
                        net: ['axios', 'protobufjs'],
                        'ui-component': ['element-plus'],
                        wangEditor: ['@wangeditor/editor-for-vue'],
                        vue: ['vue-router']
                    }
                }
            }
        },
        optimizeDeps: {
            // 如果有在vite运行中，突然有新的依赖导入，那么会请求，响应加载后会刷新页面，效果极其不好，
            // 所以我们这里include手动声明预构建，提前构建好，避免额外请求导致刷新页面
            include: ['hash-wasm']
        }
    }
})
