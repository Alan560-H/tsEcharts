import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// 引入自动引入elementui插件
import AutoImport from "unplugin-auto-import/vite";
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";



// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        // 按需引入 element组件
        AutoImport({ resolvers: ElementPlusResolver() }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    //配置跨域
  server: {
    proxy: {
      '/simpleWeather': {
        target: 'http://apis.juhe.cn',  //API服务地址
        changeOrigin: true,             //开启跨域
        // rewrite: (path) => {
        //     console.log("拦截成功");
        //     return path.replace(/^\/simpleWeather/, '')
        // }
      }
    }
  }
})
