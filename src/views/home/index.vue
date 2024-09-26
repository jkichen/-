<template>
  <div class="">
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="" class="avatar" />
        <div class="bottom">
          <h3 class="title">{{ getTime() }}好呀 {{ userStore.username }}</h3>
          <p class="subtitle">后台运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="bottoms">
      <svg-icon name="welcome" style="width: 500px; height: 500px"></svg-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getTime } from '@/utils/time'
//引入用户相关的仓库,获取当前用户的头像、昵称
import userUserStore from '@/store/modules/user'
const userStore = userUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;
    padding: 10px;

    .title {
      font-size: 24px;
      font-weight: 900;
      margin-bottom: 30px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}
.bottoms {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
