// 小仓库：layout组件相关配置仓库
import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用于控制菜单折叠还是收起
      refsh: false, // 仓库这个属性用于控制刷新路由
    }
  },
})

export default useLayoutSettingStore
