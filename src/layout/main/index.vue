<template>
  <!-- 路由组件的出口位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts" name="Main">
import { ref, watch, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
const LayoutSettingStore = useLayoutSettingStore()

// 控制当前组件是否销毁重建
let flag = ref(true)
// 监听仓库内部数据是否发生变化，如果发生变化，说名用户点击过刷新按钮
watch(
  () => LayoutSettingStore.refsh,
  () => {
    flag.value = !flag.value
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
