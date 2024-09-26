// 路由鉴权，项目当中路由能不能被访问的权限设置(某一个路由什么条件下可以访问、什么条件下不能访问)
import router from './router'
import setting from './setting'
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })

import pinia from './store'

// 获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import userUserStore from './store/modules/user'
const userStore = userUserStore(pinia)

// 全局守卫：项目当中任意路由切换都会触发钩子
// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  // to and from are both route objects. must call `next`.
  //  to：你将要访问的那个守卫
  // from：你从那个路由而来
  //  next：路由的放行函数
  //  访问某一个路由之前的守卫
  nprogress.start()
  //   获取token，去判断用户登录还是未登录
  const token = userStore.token
  //   获取用户名字
  const username = userStore.username
  //   用户登录判断
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 登录成功访问其余六个路由
      // 有用户信息
      if (username) {
        next()
      } else {
        // 如果没有在守卫这里发送请求获取到用户信息
        try {
          // 获取用户信息后放行
          await userStore.userInfo()
          //   放行
          // 万一：刷新的时候是异步路由，有可能获取到用户信息、异步路由还未加载完毕，出现空白的效果
          next({ ...to, replace: true })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // token过期：获取不到用户信息
          // 用户修改了本地的token
          //   退出登录->用户相关数据清空
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 未登录判断
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
// 全局后置类型
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.afterEach((_to: any, _from: any) => {
  // to and from are both route objects.
  nprogress.done()
})

// 第一个问题：任意路由切换是实现进度条业务 --- nprogress
// 第二个问题：路由鉴权(路由组件访问权限的设置)
// 全部的路由组件：登录|404|任意路由|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

// 用户未登录：可以访问login，其余六个路由指向login
// 用户登录成功：不可以访问login[指向首页],其余的路由可以访问
