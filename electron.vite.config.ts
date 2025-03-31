import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
// import { viteStaticCopy } from 'vite-plugin-static-copy'
// import protoPlugin from 'vite-plugin-proto'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
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
                '@hooks': resolve('src/renderer/src/hooks/')
            },
            extensions: ['.js', '.ts', '.vue', '.json']
        },
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
            })
        ],
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
        }
    }
})
