# 黑马头条后台

## <a href="#intro" id="intro">介绍</a>

对[黑马头条前台](https://gitee.com/Daazzer/heimatoutiao)项目进行管理

- 项目页面

  - 登录页面
  - 欢迎页面
  - 文章发布页
  - 文章编辑页
  - 文章表格数据页

- 项目使用技术

  - [vue](https://github.com/vuejs/vue)
  - [vue-router](https://github.com/vuejs/vue-router)
  - [element-ui](https://element.eleme.cn/#/zh-CN/)
  - [axios](https://github.com/axios/axios)
  - [sass](https://github.com/sass/sass)

- 版本管理

  - git

- <a href="#directory" id="directory">项目 `src` 目录结构</a>

  ```powershell
  src
  ├─api # 项目服务器 api
  ├─assets
  │  └─fonts
  ├─components # 项目封装的组件
  ├─router # 视图路由
  ├─styles
  ├─utils # 通用性 js 文件
  └─views # 路由视图
      └─index # 首页目录
  ```

  

## <a href="#usage" id="usage">使用方法</a>

项目依赖安装

```
npm install
```

开发服务器，编译与热重载

```
npm start
```

编译打包到生产环境

```
npm run build
```





## <a href="#formatConfig" id="formatConfig">项目格式化配置</a>

自定义的 vscode 编辑器配置：`/.vscode/settings.json`

- 给函数名与函数括号之间添加一个空格

- 移除分号

```json
{
    "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
    "javascript.format.semicolons": "remove"
}
```



自定义的 .editorconfig 配置文件：[`/.editorconfig` ](.editorconfig)

[editorconfig 规范](https://editorconfig.org/)

- 默认 `utf-8` 字符集
- 空格缩进类型
- 两个缩进
- 去掉行尾空格
- 空行结束

```tex
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



## <a href="#server" id="server">项目数据服务器</a>

- 配置服务器基本路径：[@/utils/axios_http-config.js](src/utils/axios_http-config.js)
- 服务器 api：[@/api](src/api)

服务器基地址配置例子：

```js
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

export default axios
```

api 配置例子：

```js
import axios from '@/utils/axios_http-config'

/**
 * 文章列表
 * @param {Object} [params] 参数对象
 * @param {number} [data.category] 栏目id
 * @param {number} [data.pageIndex] 当前页码
 * @param {number} [data.pageSize] 每页显示数据条数
 * @returns {Promise<Response>}
 */
const getArticle = params => axios.get('/post', { params }).then(res => [null, res]).catch(err => [err])

/**
 * 发布文章
 * @param {Object} data 参数对象
 * @param {string} data.title 文章标题
 * @param {string} data.content 文章内容
 * @param {Array<Object>} data.categories 所属栏目ID集合
 * @param {Array<Object>} data.cover 封面图片ID集合
 * @param {number} data.type 1为文章，2为视频
 * @returns {Promise<Response>}
 */
const publishArticle = data => axios.post('/post', data).then(res => [null, res]).catch(err => [err])

const getArticleById = id => axios.get(`/post/${id}`).then(res => [null, res]).catch(err => [err])

export default {
  getArticle,
  publishArticle,
  getArticleById
}
```



为了使用 api 时不使用引入，将 api 方法挂载到 vue 根实例原型上

[@/main.js](src/main.js)

```js
import api from './api'
Vue.prototype.$api = api
```





## <a href="#router" id="router">项目路由</a>

项目路由配置：[@/router](src/router)

| URL                         | 描述                      |
| --------------------------- | ------------------------- |
| `/login`                    | [登录页](#LoginPage)      |
| `/index/welcome`            | 欢迎页                    |
| `/index/articleList`        | 文章列表页                |
| `/index/articlePublish`     | 文章发布页                |
| `/index/articlePublish/:id` | 文章编辑页                |
| `*`                         | [404 页面](#NotFoundPage) |



## <a href="#NotFoundPage" id="NotFoundPage">404 页面</a>

考虑到如果什么页面都找不到，应该返回 404 页面

- 页面视图：[@/views/NotFound.vue](src/views/NotFound.vue)



## <a href="#LoginPage" id="LoginPage">登录页的实现</a>

[@/views/Login.vue](src/views/Login.vue)

### 添加登录页的路由

有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 [命名 chunk](https://webpack.js.org/guides/code-splitting-require/#chunkname)，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)，之后的部分与此相同。[参考](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html#%E6%8A%8A%E7%BB%84%E4%BB%B6%E6%8C%89%E7%BB%84%E5%88%86%E5%9D%97)

```js
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

#### 登录效果图

![登录页](src/assets/i/loginPage.png)



#### 登录页模板

技术实现：

- 使用 element-ui 的 `Container`、`Form`、`Avatar`、`FormItem`、`Input` 组件



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



#### 登录页样式

技术实现：

- 使用了 BEM 类名规范定义样式类名，配合  scss 的父选择器

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



### 实现登录页动态数据交互

技术实现：

- 使用 `Form`  组件 `rules` 属性绑定[校验规则](https://github.com/yiminghe/async-validator)
- 使用了 `Input` 组件的 `focus` 事件重置校验规则
- 输入框不能为空的限制
- 用户名要求为 4-5 位非空字符，或者是合法的 11 为手机号码
- 点击登录按钮会进行登录
  - 如果验证不通过，则阻止登录，并在输入框底下出现提示
  - 如果本地存储有 token，则表示已经登录，阻止登录，并提示用户
  - 如果响应出错，则提示用户，并阻止登录
  - 登录成功后，存储 token 到 `localStorage` 并且跳转路由到首页

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



## <a href="#routerGuard" id="routerGuard">设置路由守卫检测登录状态</a>

[@/router](src/router)

技术实现：

- vue-router 的[全局前置守卫方法](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB) `router.beforeEach` 实现路由拦截
- 如果用户跳到非登录页，则都要检测是否有 token，如果没有，则强制跳回登录页

```js
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



## <a href="#IndexWelcomePage" id="IndexWelcomePage">首页与欢迎页的实现</a>

### 添加首页与欢迎页路由

[@/router](src/router)

技术实现：

- 欢迎页由首页嵌套着，所以欢迎页在 `Index` 的 `children` 属性下，默认首页和欢迎页一同显示
- 由于首页的结构是一个路由嵌套结构，所以包含多个子路由，所以专门建立了一个[index 目录](#directory)表示当前视图有多个子路由视图

- 用 [URL 正则](https://github.com/pillarjs/path-to-regexp) 匹配首页的路由，匹配 `/index` 或 `/index.html` 或 `/`
- 给 `Index` 路由组件重定向到欢迎页，默认显示欢迎页

```js
// ...
const routes = [
    name: 'Index',
    path: '/(index|index.html)?',
    redirect: '/index/welcome',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index'),
    children: [
      {
        name: 'Welcome',
        path: '/index/welcome',
        component: () => import(/* webpackChunkName: "index" */ '@/views/index/Welcome.vue')
      },
  // ...
```



### 实现首页视图结构

[@views/index](src/views/index)

#### 首页效果图

![首页](src/assets/i/indexPage.png)

#### 首页模板

技术实现：

- 使用 `Container`、`Aside` 、`Header`、`Main` 划分页面结构
- 使用 `Image` 组件放置 logo
- 使用 `Menu`、`SubMenu`、`MenuItem` 组件进行导航
- 使用 `Breadcrumb` 组件显示导航路径



```vue
<template>
  <el-container class="index">
    <el-aside width="250px" class="index-aside">
      <div class="index-brand">
        <!-- 注意，由于 webpack 打包配置原因，这里可以使用 require 或者 import 到 data 中再挂载上来进行处理  -->
        <el-image class="logo" :src="require('@/assets/logo.png')">
          <template #error>
            <i class="el-icon-picture-outline logo__alias"></i>
          </template>
        </el-image>
      </div>
	  <!-- 为了使菜单与路由同步关联变化这里使用 vm.$route.path 填充 -->
      <el-menu
        :default-active="$route.path"
        class="index-aside__menu"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <el-submenu index="1">
          <template #title>
            <i class="el-icon-s-custom"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="1-1">
            <span>用户列表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template #title>
            <i class="el-icon-notebook-2"></i>
            <span>文章管理</span>
          </template>
          <el-menu-item route index="/index/articleList">
            <span>文章列表</span>
          </el-menu-item>
          <el-menu-item index="/index/articlePublish">
            <span>文章发布</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template #title>
            <i class="el-icon-s-grid"></i>
            <span>栏目管理</span>
          </template>
          <el-menu-item index="3-1">
            <span>栏目列表</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="75px" class="index-header">
        <el-button class="toggle-btn" type="text" icon="el-icon-s-fold" />
        <h1 class="system-title">黑马头条后台管理系统</h1>
        <div class="index-header__welcome">
          <span>欢迎你：{{ nickname }}</span>
          <el-button class="exit-btn" type="text" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <!-- 动态匹配面包屑导航路径 -->
        <el-breadcrumb class="index-path" separator="/">
          <el-breadcrumb-item :to="$route.name === 'Welcome' ? null : '/index/welcome'">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.name !== 'Welcome'">{{ parentPathName }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.name !== 'Welcome'">{{ curPathName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 默认显示欢迎页 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
```



> **注意：**
>
> `Menu` 组件需要设置 `router` 属性为 `true` 时，才能点击 `MenuItem` 组件的 `index` 属性跳转页面
>
> 当 Vue Loader 编译单文件组件中的 `<template>` 块时，它也会将所有遇到的资源 URL 转换为 **webpack 模块请求**。
>
> 使用 element-ui 的 `Image` 组件时，会出现以上情况，如果 `src` 直接输入静态路径。会导致图片显示不出来

例如，下面的模板代码片段：

```vue
<img src="../image.png">
```

将会被编译成为：

```js
createElement('img', {
  attrs: {
    src: require('../image.png') // 现在这是一个模块的请求了
  }
})
```

示例[参考](https://vue-loader.vuejs.org/zh/guide/asset-url.html)



#### 首页样式

技术实现：

- 使用 sass 的 `@mixin` 和 `@include` 混入代码块，减少代码书写

```vue
<style lang="scss" scoped>
.index {
  height: 100%;
  min-height: 640px;
  min-width: 960px;
  $primaryColor: #545c64;
  &-aside {
    background-color: $primaryColor;
    &__menu {
      border: none;
    }
  }
  &-brand {
    text-align: center;
    padding: 20px 0;
    background-color: $primaryColor;
    .logo {
      $size: 100px;
      width: $size;
      height: $size;
      border-radius: 50%;
      &__alias {
        font-size: 50px;
      }
    }
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: $primaryColor;
    h1 {
      font-size: 36px;
    }
    // sass 的混入
    @mixin indexHeaderBtn {
      $color: #fff;
      color: $color;
      padding: 0;
      &:hover {
        color: $color;
      }
    }
    .toggle-btn {
      @include indexHeaderBtn;
      font-size: 30px;
    }
    .exit-btn {
      @include indexHeaderBtn;
      margin-left: 20px;
    }
  }
  &-path {
    margin-bottom: 25px;
  }
}
</style>
```



### 实现首页动态数据交互

技术实现：

- 面包屑的路径名动态匹配，利用当前 `$route.name` 判断当前的路由页，从而进行面包屑路径的匹配

  ![breadcrumb](src/assets/i/indexPage-breadcrumb.png)

  - 每个菜单高亮选项都是在一个分类选项卡的子页面，所以“文章列表”和 “文章发布”都会作为“文章管理”的子路径
  - `parentPathName` 方法匹配并返回对应的父路径
  - `curPathName` 方法则匹配并返回当前高亮的路径



```vue
<script>
export default {
  name: 'Index',
  data () {
    const nickname = JSON.parse(localStorage.getItem('heimatoutiao_admin_userInfo')).nickname

    return {
      nickname
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('heimatoutiao_admin_userInfo')
      this.$router.push('/login')
      this.$message.success('退出成功')
    }
  },
  computed: {
    parentPathName () {
      // 判断当前路由名
      const currentRouteName = this.$route.name
      switch (currentRouteName) {
        case 'UserList':
          return '用户管理'
        case 'ArticleList':
        case 'ArticlePublish':
          return '文章管理'
        case 'CateList':
          return '栏目管理'
      }
    },
    curPathName () {
      const currentRouteName = this.$route.name
      switch (currentRouteName) {
        case 'UserList':
          return '用户列表'
        case 'ArticleList':
          return '文章列表'
        case 'ArticlePublish':
          return '文章发布'
        case 'CateList':
          return '栏目列表'
      }
    }
  }
}
</script>
```





### 欢迎页的实现

[@/views/index/Welcome.vue](src/views/index/Welcome.vue)

技术实现：

- `Container` 组件布局
- `Image` 组件显示图片
- 动态导入图片 `require('@/assets/logo.png')`
- 从本地存储取用户名

```vue
<template>
  <el-container class="welcome" direction="vertical">
    <h2><el-image class="logo" :src="require('@/assets/logo.png')" /></h2>
    <h3>欢迎，{{ nickname }}</h3>
  </el-container>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    const nickname = JSON.parse(localStorage.getItem('heimatoutiao_admin_userInfo')).nickname
    return {
      nickname
    }
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  h2, h3 {
    text-align: center;
  }
  h3 {
    font-size: 1.5em;
  }
  .logo {
    $size: 250px;
    width: $size;
    height: $size;
  }
}
</style>
```

