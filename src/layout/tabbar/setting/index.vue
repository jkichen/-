<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefsh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-popover placement="bottom" title="主题设置" :width="240" trigger="hover">
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
          @change="setColor"
          :teleported="false"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          inline-prompt
          active-icon="Moon"
          inactive-icon="Sunny"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="Setting">
import { ref } from 'vue'
// 引入路由器
import { useRouter, useRoute } from 'vue-router'
// 获取用户相关的小仓库
import userUserStore from '@/store/modules/user'
// 获取骨架的小仓库
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
const userStore = userUserStore()
// 获取路由器对象
const $router = useRouter()
const $route = useRoute()
// 收集开关的数据
const dark = ref<boolean>(true)
// 刷新按钮点击的回调
function updateRefsh() {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}

// 全屏按钮点击的回调
function fullScreen() {
  // DOM对象的一个属性，可以用来判断是否全屏模式（全屏true，不是全屏：false）
  let full = document.fullscreenElement
  // 切换位全屏模式
  if (!full) {
    // 利用DOM跟节点方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
// 退出登录点击回调
async function logout() {
  //  第一件事：需要向服务器发请求[退出登录接口]*******
  // 第二件事：仓库当中关于用于相关的数据情况[token|username|avatar]
  // 第三件事：跳转到登录页面
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
  window.location.reload()
}

// 取色器组件数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// switch开关的change事件进行暗黑模式的切换
const changeDark = () => {
  let html = document.documentElement
  // 判断HTML是否有类名dark
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  dark.value ? (html.className = 'dark') : (html.className = '')
}
// 主题颜色的设置
const setColor = () => {
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style scoped></style>
