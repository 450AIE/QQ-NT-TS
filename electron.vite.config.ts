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
        plugins: [
            externalizeDepsPlugin(),
            // protoPlugin(),
            // viteStaticCopy({
            //     targets: [
            //         {
            //             src: 'src/main/utils/protobuf/message.proto',
            //             dest: ''
            //         }
            //     ]
            // })
        ],
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
        }
    }
})
