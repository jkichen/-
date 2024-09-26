<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrName"
              :value="`${item.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片的名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片" align="center">
          <template #="{ row }">
            <img :src="row.imgUrl" alt="" style="height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts" name="SkuForm">
let $emit = defineEmits(['changeScene'])
// 引入请求的API
import { reqAttr } from '@/api/product/attr'
import { AttrResponseData } from '@/api/product/attr/type'
// 引入请求照片墙和销售属性的API
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import {
  SaleAttrResponseData,
  SkuData,
  SpuHasImg,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 照片墙的数据
let imgArr = ref<any>([])
// 获取table组件实例
const table = ref<any>()
// 收集SKU数据
let skuParams = reactive<SkuData>({
  // 父组件传过来的参数
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  // v-model收集
  skuName: '', //sku名字
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku的描述

  skuAttrValueList: [
    /* {
      attrId: '',
      valueId: '',
    }, */
  ],
  skuSaleAttrValueList: [
    /*  {
      saleAttrId: '', //属性ID
      saleAttrValueId: '',
    }, */
  ],
  skuDefaultImg: '', //sku图片地址
})
// 取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
// 设置默认图片的方法回调
const handler = (row: any) => {
  // 点击的时候让全部的复选框不勾选
  table.value.clearSelection()
  /* imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  }) */
  // 选中图片的复选框选中
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}
// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({ saleAttrId, saleAttrValueId })
      }
      return prev
    },
    [],
  )
  // 发请求:添加SKU的请求
  const result: any = await reqAddSku(skuParams)
  console.log(result)
  // 成功
  // 失败
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    //通知父组件切换场景为零
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}

// 当前子组件的自定义事件方法对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  const result1: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id)
  // 获取照片墙的数据
  const result2: SpuHasImg = await reqSpuImageList(spu.id)
  // 平台属性
  attrArr.value = result.data
  // 销售属性
  saleArr.value = result1.data
  // 照片墙的数据
  imgArr.value = result2.data
}
// 对外暴露的方法
defineExpose({ initSkuData })
</script>
<style scoped></style>
