<template>
  <el-container class="index">
    <el-aside width="250px" class="index-aside">
      <div class="index-brand">
        <el-image class="logo" :src="require('@/assets/logo.png')">
          <template #error>
            <i class="el-icon-picture-outline logo__alias"></i>
          </template>
        </el-image>
      </div>
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
          <el-menu-item index="/index/articleList">
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
        <el-breadcrumb class="index-path" separator="/">
          <el-breadcrumb-item :to="$route.name === 'Welcome' ? null : '/index/welcome'">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.name !== 'Welcome'">{{ parentPathName }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.name !== 'Welcome'">{{ curPathName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view v-if="isAlive" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Index',
  data () {
    const nickname = JSON.parse(localStorage.getItem('heimatoutiao_admin_userInfo')).nickname

    return {
      nickname,
      isAlive: true
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
  },
  beforeRouteUpdate (to, from, next) {
    if (to.name === 'ArticlePublish') {
      this.isAlive = false
      this.$nextTick(() => this.isAlive = true)
    }
    next()
  }
}
</script>

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
