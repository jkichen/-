import { createApp } from 'vue'
// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus国际化
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from '@/App.vue'

// 引入模板的全局的样式
import '@/styles/index.scss'
// svg需要配置的代码
import 'virtual:svg-icons-register'
// 引入自定义插件对象
import globalComponent from '@/components/index'
// 引入路由
import router from './router'
// 引入仓库
import Pinia from './store'
// 引入鉴权路由守卫
import './permission'

// 获取应用对象实例
const app = createApp(App)
// 安装elelment-plus插件
app.use(ElementPlus, {
  locale: zhCn, //element-plus国际化配置
})
// 安装自定义插件
app.use(globalComponent)

// 安装仓库
app.use(Pinia)

// 注册模板路由
app.use(router)
// 引入自定义指令文件
import { ishasButton } from './directive/has'
ishasButton(app)
// 将应用挂载到挂载点上
app.mount('#app')
