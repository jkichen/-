<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c1Id"
          @change="handler"
        >
          <!-- label即为展示的数据,value即为下拉菜单收集的数据 -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c2Id"
          @change="handler1"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts" name="Category">
//  引入组件挂载完毕方法
import { onMounted } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'

const categoryStore = useCategoryStore()

// 全局组件分类挂载完毕
onMounted(() => {
  getC1()
})
// 通知仓库获取一级分类的方法
const getC1 = () => {
  // 通知分类仓库获取一级分类的方法
  categoryStore.getC1()
}
// 此方法即为一级分类下拉菜单的change事件（选中值的时侯触，保证一级分类ID有了）
const handler = () => {
  // 需要将二级和三级的数据清空
  categoryStore.c2Id = ''
  categoryStore.c2Arr = []
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  // 通知仓库获取二级分类的数据
  categoryStore.getC2()
}
// 此方法即为二级分类下拉菜单的change事件（选中值的时侯触，保证二级分类ID有了）
const handler1 = () => {
  // 需要将三级的数据清空
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  // 通知仓库获取二级分类的数据
  categoryStore.getC3()
}

// 接收父组件传过来的场景值
defineProps(['scene'])
</script>

<style>
.el-select {
  --el-select-width: 200px;
}
</style>
