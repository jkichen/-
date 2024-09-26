// 引入项目中全部的组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
// 引入element-plus 提供的全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 全局对象
const allGlobalComponents: any = { SvgIcon, Pagination, Category }
// 对外暴露一个插件对象
export default {
  // 务必叫做install方法
  install(app: any) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      // 注册为全局组件
      app.component(key, allGlobalComponents[key])
    })
    // 将element-plus提供图标注册位全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
