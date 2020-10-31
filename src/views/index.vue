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
        default-active="1-1"
        class="index-aside__menu"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
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
          <el-menu-item index="2-1">
            <span>文章列表</span>
          </el-menu-item>
          <el-menu-item index="2-2">
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
        <i class="el-icon-s-fold toggle-btn"></i>
        <h1 class="system-title">黑马头条后台管理系统</h1>
        <div class="index-header__welcome">
          <span>欢迎你：52期的小伙伴</span>
          <span class="exit-btn"> 退出</span>
        </div>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  min-height: 500px;
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
    .toggle-btn {
      font-size: 30px;
    }
    .exit-btn {
      margin-left: 20px;
    }
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
