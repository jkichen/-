<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'
// 引入用户相关的小仓库
import userUserStore from '@/store/modules/user'
const userStore = userUserStore()

// 获取el-form组件
let loginForms = ref()

// 获取路由器
const $router = useRouter()
const $route = useRoute()
// 定义变量控制
let loading = ref(false)

const loginForm = reactive({ username: 'admin', password: '111111' })
// 登录按钮回调
const login = async () => {
  // 保证全部表单相校验通过再发请求
  await loginForms.value.validate()
  // 加载效果：开始加载
  loading.value = true
  // 点击登录按钮以后干什么？
  // 通知仓库发送登录请求
  // 请求成功->首页展示数据的地方
  // 请求失败->弹出登录失败的信息
  try {
    // 保证登录成功
    // 可以手写.then语法
    await userStore.userLogin(loginForm)
    // 编程式导航跳转到数据首页
    // 判断登录的时候，路由路径当中是否有query参数，如果有就往query参数跳转，没有就首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 登录成功的提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`,
    })
    // 登录成功加载效果也消失
    loading.value = false
  } catch (error) {
    // 登录失败加载效果消失
    loading.value = false
    // 登录失败的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 自定义校验规则
const validatorUserName = (_rule: any, value: any, callback: any) => {
  // rule:即为校验规则对象
  // value:即为表单元素文本内容
  // 函数：如果不符合条件callBack方法，注入错误信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
// 自定义校验规则
const validatorPassword = (_rule: any, value: any, callback: any) => {
  // rule:即为校验规则对象
  // value:即为表单元素文本内容
  // 函数：如果不符合条件callBack方法，注入错误信息
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}

// 定义表单校验需要的配置对象
const rules = reactive({
  // 规则对象属性。
  // required,代表这个字段务必要校验
  // min,文本长度至少多少位
  // max，本文长度至多多少位
  // message：错误的提示信息
  // trigger：触发时机 change->本文发生变化时校验，blur：失去焦点时触发

  username: [
    /* {
      required: true,
      min: 6,
      max: 10,
      message: '账号长度至少六位',
      trigger: 'change',
    }, */
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    /* {
      required: true,
      min: 6,
      max: 15,
      message: '密码长度至少六位',
      trigger: 'change',
    }, */
    { trigger: 'change', validator: validatorPassword },
  ],
})
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
