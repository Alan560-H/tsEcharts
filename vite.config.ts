import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// 引入mockjs 插件
import { viteMockServe } from "vite-plugin-mock";

// 引入自动引入elementui插件
import AutoImport from "unplugin-auto-import/vite";
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";



// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        // mockjs
        viteMockServe({
            mockPath:"./src/mock/",//指向mock下的所有文件
            localEnabled:true,//是否开启开发环境
        }),
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
      }
    }
  }
})
