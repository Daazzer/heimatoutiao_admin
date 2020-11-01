# 黑马头条后台

## 项目依赖安装

```
npm install
```

### 开发服务器，编译与热重载

```
npm start
```

### 编译打包到生产环境

```
npm run build
```



## 创建项目

```powershell
vue ui
```



- npm 包管理
- 生成 git 仓库
- 选择 dart/sass 预编译
- 选择独立配置文件



### 基本项目格式化配置

在项目根目录下

- 使用自己定义好的 .vscode 配置文件
- 按照 ESLint 标准，创建一个 .editorconfig 配置文件



```json
// /settings.json
{
    "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
    "javascript.format.semicolons": "remove"
}
```



```tex
# /.editorconfig
# 这个文件可以配合 vscode 的 editorconfig 插件自动格式化你指定好的文件
# http://editorconfig.org

[*]
charset = utf-8
indent_style = space
end_of_line = lf

[*.{js,jsx,ts,tsx,vue}]
indent_size = 2
trim_trailing_whitespace = true
insert_final_newline = true
```



### 安装 element-ui

```powershell
npm i element-ui -S
```



在 main.js 全局引入 element-ui

```js
import ElementUI from 'element-ui'

Vue.use(ElementUI)
```



在 App.vue 引入 element-ui 的样式

```vue
<!-- 
	...
-->
<style lang="scss">
@import "../node_modules/element-ui/lib/theme-chalk/index.css";
// ...
</style>
```



> **注意：**类似于这种全局引入的大型的样式文件，最好直接引 css 格式，而且最好是压缩过的，这样预编译热重载的速度会快一些



### 安装 axios

```powershell
npm i axios -S
```



配置 axios

```js
// @/utils/axios_http-config.js
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

export default axios
```



封装 api

```js
// @/api/_user.js
import axios from '@/utils/axios_http-config'

/**
 * 登录
 * @param {Object} data 参数对象
 * @param {string} data.username 用户名 / 手机
 * @param {string} data.password 密码
 * @returns {Promise<Response>}
 */
const login = data => axios.post('/login', data).then(res => [null, res]).catch(err => [err])

export default {
  login
}
```



```js
// @/api/index.js
import user from './_user'

export default {
  ...user
}
```



将 api 挂载到根实例原型

```js
// @/main.js
import api from './api'
Vue.prototype.$api = api
```





### src 目录结构

```powershell
src
├─api
├─assets
│  └─fonts
├─components
├─router
├─styles
├─utils
└─views
```





## 登录页的实现

### 添加登录页的路由

```js
// @/router/index.js
const routes = [
  // ...
  {
    name: 'Login',
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  // ...
]
```





### 实现登录页的视图结构

使用 element-ui 的 `Container`、`Form`、`Avatar`、`FormItem`、`Input` 组件

```vue
<template>
  <el-container class="login">
    <el-form
      class="login-form"
      ref="loginForm"
      :model="user"
      :rules="rules"
    >
      <el-avatar class="login-avatar" :size="126" icon="el-icon-user-solid" />
      <el-form-item prop="username">
        <el-input
          class="login-form__username"
          placeholder="用户名/手机号码"
          prefix-icon="el-icon-user"
          v-model="user.username"
          @focus="clearValidate('username')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="login-form__password"
          type="password"
          placeholder="密码"
          prefix-icon="el-icon-key"
          v-model="user.password"
          @focus="clearValidate('password')"
        />
      </el-form-item>
      <el-form-item class="login-form__item--last">
        <el-button
          class="login-form__btn"
          type="primary"
          @click="login"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>
```



### 实现登录页的样式

使用了 BEM 类名规范定义样式类名，配合  scss 的父选择器

```vue
<style lang="scss" scoped>
.login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  &-form {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    top: 22%;
    left: 50%;
    min-width: 600px;
    min-height: 302px;
    padding: 18px 50px;
    background-color: #fff;
    transform: translate(-50%);
    &__item {
      &--last {
        margin-bottom: 0;
      }
    }
    &__username,
    &__password {
      ::v-deep input {
        line-height: 50px;
        height: 50px;
      }
    }
    &__btn {
      height: 50px;
      width: 100%;
    }
  }
  &-avatar {
    $size: 126px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 50%;
    top: -$size / 2;
    transform: translate(-50%);
    border: 14px solid #fff;
    box-shadow: 0px 0px 12px 0px #ababab;
    ::v-deep i {
      font-size: 50px;
    }
  }
}
</style>
```



### 实现登录页的动态 js 数据交互

- 绑定好表单数据，用于校验
- rules 的使用方法查看地址 https://github.com/yiminghe/async-validator

```vue
<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { pattern: /^\w{4,5}$|^1[35789]\d{9}$/, message: '请输入合法的用户名/手机号码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 16, message: '请输入3-16位密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 清除输入框的验证提示信息
    clearValidate (prop) {
      this.$refs.loginForm.clearValidate(prop)
    },
    async login () {
      /* 
      这里的 Form 组件 API 方法如果不给回调参数，会返回一个 promise，如果不 catch 的话控制台会报错，
      无论 promise 是 fullfill 还是 reject 都会返回一个布尔值 
       */
      const isValidate = await this.$refs.loginForm.validate().then(validated => validated).catch(inValidated => inValidated)
	
      // 取本地 token
      const localToken = JSON.parse(localStorage.getItem('heimatoutiao_admin_userInfo') || '{}').token

      // 表单验证失败
      if (!isValidate) {
        return
      } else if (localToken) {
        // 防止用户重复登录
        this.$message.warning('你已登录，请不要重复登录')
        return
      }
		
      // 解构 axios 的 promise 返回值
      const [err, res] = await this.$api.login({
        username: this.user.username,
        password: this.user.password
      })

      if (err) {
        return this.$message.error('登录失败，发生错误')
      }

      const { token, user: { id } } = res.data.data
      // 将响应回来的 token 与 id 存到一个对象中然后序列化之后再存到本地 
      const userInfo = JSON.stringify({ token, id })
		
      localStorage.setItem('heimatoutiao_admin_userInfo', userInfo)

      this.$router.push('/')
      this.$message.success('登录成功')
    }
  }
}
</script>
```



### 配合登录页设置路由守卫

```js
// @/router/index.js
// ...

import { Message } from 'element-ui'

// ...

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 除了登录页，去其他页面都要验证 token
  const toRouteName = to.name
  const token = JSON.parse(localStorage.getItem('heimatoutiao_admin_userInfo') || '{}').token

  if (toRouteName !== 'Login' && !token && toRouteName !== 'NotFound') {
    Message.warning('你没有权限查看，请登录')
    next('/login')
  }
  next()
})

// ...
```

