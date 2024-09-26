// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/type'

import type { UserState } from './types/type'
// 引入操作本地存储的工具的方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由(常量路由)
import { constantRoute, anyRoute, asyncRoute } from '@/router/routes'
import router from '@/router'
// 引入深拷贝方法
import { cloneDeep } from 'lodash'
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建用户小仓库
const userUserStore = defineStore('user', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户的唯一标识
      menuRoutes: constantRoute, // 仓库存储生成菜单需要的数组(路由)
      username: '',
      avatar: '',
      // 存储当前用户是否包含当前按钮
      buttons: [],
    }
  },
  //   异步|逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data)
      //   登录请求：成功200 -> token
      // 登录请求:失败201 -> 登录失败的错误信息
      if (result.code === 200) {
        // pinia仓库存储一下token
        // 由于pinia|vuex存储数据其实利用js对象
        this.token = result.data as string
        SET_TOKEN(result.data as string)
        // 能保证当前的async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户信息进行存储仓库中[用户头像、名字]
      const result: userInfoReponseData = await reqUserInfo()
      // 如果获取用户信息成功，存储一下用户信息
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons

        //计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        // 菜单的数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // 目前路由器管理的只有常量路由：用户计算完异步路由、任意路由动态追加
        ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      const result: any = await reqLogout()
      if (result.code === 200) {
        // 目前没有mock接口：退出登录接口（通知服务器本地用户唯一标识失效）
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

// 对外暴露获取小仓库的方法
export default userUserStore
