<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="LayoutSettingStore.fold ? true : false"
          background-color="#001529"
          text-color="white"
          active-text-color="skyblue"
          :default-active="$route.path"
        >
          <!-- 根据项目动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <!-- layout组件的顶怒组件 -->
      <Tabbar />
    </div>
    <!-- 内容展示区域 -->
    <div
      class="layout_main"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <Main />
    </div>
  </div>
</template>
<script setup lang="ts" name="Layout">
// 获取路由对象
import { useRoute } from 'vue-router'
// 引入左侧菜单子组件
import Logo from './logo/index.vue'
// 引入菜单组件
import Menu from './menu/index.vue'
// 引入内容组件
import Main from './main/index.vue'
// 引入顶部tabbar组件
import Tabbar from './tabbar/index.vue'
// 获取用户相关的小仓库
import userUserStore from '@/store/modules/user'
// 获取layout配置相关的仓库
import useLayoutSettingStore from '@/store/modules/setting'

let userStore = userUserStore()
// 使用仓库
const LayoutSettingStore = useLayoutSettingStore()

const $route = useRoute()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  // background-color: pink;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: white;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base-menu-min-width;
    }
  }

  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    transition: all 0.3s;

    &.fold {
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    width: calc(100vw - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
