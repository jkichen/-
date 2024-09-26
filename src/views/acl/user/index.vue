<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名:">
          <el-input
            placeholder="请你输入搜索用户名"
            v-model="keyword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            :disabled="keyword ? false : true"
            @click="search"
          >
            搜索
          </el-button>
          <el-button type="primary" size="default" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" @click="addUser">
        添加用户
      </el-button>
      <el-button
        type="primary"
        size="default"
        :disabled="selectIdArr.length ? false : true"
        @click="deleteSelectUser"
      >
        批量删除
      </el-button>
      <!-- table展示用户信息 -->
      <el-table
        style="margin: 10px 0px"
        border
        :data="userArr"
        @selection-change="selectChange"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="#"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column
          label="用户名字"
          align="center"
          prop="username"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户名称"
          align="center"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户角色"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setRole(row)"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.username}?`"
              width="260px"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getHasUser"
        @size-change="handler"
      />
    </el-card>
    <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
    <el-drawer v-model="drawer">
      <!-- 头部标题:将来文字内容应该动态的 -->
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <!-- 身体部分 -->
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请您输入用户姓名"
              v-model="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请您输入用户昵称"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请您输入用户密码"
              v-model="userParams.password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色(职位)</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox
              @change="handleCheckAllChange"
              v-model="checkAll"
              :indeterminate="isIndeterminate"
            >
              全选
            </el-checkbox>
            <!-- 显示职位的的复选框 -->
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedRolesChange"
            >
              <el-checkbox
                v-for="(role, index) in allRole"
                :key="index"
                :label="role"
                :value="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts" name="User">
import {
  reqAddOrUpdateUser,
  reqAllRole,
  reqRemoveUser,
  reqSelectUser,
  reqSetUserRole,
  reqUserInfo,
} from '@/api/acl/user'
import {
  AllRole,
  AllRoleResponseData,
  Records,
  SetRoleData,
  User,
  UserResponseData,
} from '@/api/acl/user/type'

import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
// 获取模板setting仓库
const settingStore = useLayoutSettingStore()

//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
// 存储全部用户的数组
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 获取form组件实例
let formRef = ref<any>()
//控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
//当前用户已有的职位
let userRole = ref<AllRole>([])
// 存储全部的职位
let allRole = ref<AllRole>([])
// 收集新增用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
let userArr = ref<Records>([])
let selectIdArr = ref<User[]>([])
// 定义响应式数据
let keyword = ref<string>('')

// 组件挂载完毕
onMounted(() => {
  getHasUser()
})

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前数据
  pageNo.value = pager
  const result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
// 分页器下拉菜单的自定义事件
const handler = () => {
  getHasUser()
}
//添加用户按钮的回调
const addUser = () => {
  //抽屉显示出来
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
//更新用户按钮的回调
const updateUser = (row: User) => {
  //抽屉显示出来
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
// 保存按钮回调
const save = async () => {
  // 点击按钮的时候,务必保证全部表单符合条件在发送请求
  await formRef.value.validate()
  // 保存按钮：添加新的用户|更新已有的用户账号信息
  const result = await reqAddOrUpdateUser(userParams)
  console.log(result)
  //添加或者更新成功
  if (result.code == 200) {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    //获取最新的全部账号的信息
    // getHasUser(userParams.id ? pageNo.value : 1)
    //浏览器自动刷新一次
    window.location.reload()
  } else {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}
// 取消按钮的回调
const cancel = () => {
  drawer.value = false
}
// 表单校验规则
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  // 用户名字|昵称 长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
const validatorname = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  //用户密码,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
// 表单校验的规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  //用户的密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

//分配角色按钮的回调
const setRole = async (row: User) => {
  //存储已有的用户信息
  Object.assign(userParams, row)
  //获取全部的职位的数据与当前用户已有的职位的数据
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    //存储全部的职位
    allRole.value = result.data.allRolesList
    //存储当前用户已有的职位
    userRole.value = result.data.assignRoles
    //抽屉显示出来
    drawer1.value = true
  }
}

//收集顶部复选框全选数据
const checkAll = ref<boolean>(false)
//控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(true)

// 全选复选框的change事件
const handleCheckAllChange = (value: boolean) => {
  //val:true(全选)|false(没有全选)
  userRole.value = value ? allRole.value : []
  //不确定的样式(确定样式)
  isIndeterminate.value = false
}
//顶部全部的复选框的change事件
const handleCheckedRolesChange = (value: string[]) => {
  // 已经勾选的这些项目的长度
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}
// 确定按钮的回调
const confirmClick = async () => {
  // 收集参数
  let data: SetRoleData = {
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
    userId: userParams.id as number,
  }

  const result = await reqSetUserRole(data)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    //关闭抽屉
    drawer1.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}
//删除某一个用户
const deleteUser = async (userId: number) => {
  const reslut: any = await reqRemoveUser(userId)
  if (reslut.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
//table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}
// 批量删除按钮的回调
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idsList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  //批量删除的请求
  let result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
// 搜索按钮的回调
const search = () => {
  // 根据关键字获取相应的用户数据
  getHasUser()
  keyword.value = ''
}
//重置按钮
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
