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
