<template>
  <el-card>
    <el-form label-position="right" label-width="100px" :model="article">
      <el-form-item label="标题：">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item label="类型：">
        <el-radio-group v-model="article.type">
          <el-radio :label="1">文章</el-radio>
          <el-radio :label="2">视频</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="article.type === 1" label="内容：">
        <VueEditor :config="articleEditorConfig" ref="articleEditor" />
      </el-form-item>
      <el-form-item label="栏目：">
         <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      <el-form-item label="上传封面：">
        <el-upload
          :action="uploadURL"
          list-type="picture-card"
          :limit="1"
          :headers="null"
          :on-success="handleSuccess"
          :on-exceed="handleExceed"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click.prevent="publishArticle">发布文章</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import VueEditor from 'vue-word-editor'
import axios from '@/utils/axios_http-config'

export default {
  name: 'ArticlePublish',
  components: {
    VueEditor
  },
  data () {
    const cityOptions = ['上海', '北京', '广州', '深圳']
    const baseURL = axios.defaults.baseURL
    const uploadURL = baseURL + '/upload'
    return {
      labelPosition: 'right',
      baseURL: axios.defaults.baseURL,
      uploadURL,
      article: {
        title: '',
        type: 1,
        content: ''
      },
      articleEditorConfig: {
        /*
        图片上传 api 在 VueEditor 中自己封装了，所以这里不使用 axios 发请求
        意味着不经过请求拦截器，请求头要自己另外封装
         */
        uploadImage: {
          url: uploadURL,
          name: 'file',
          headers: this.getToken(),
          // 使用箭头函数目的是让 `this` 访问组件实例
          uploadSuccess: (res, insert) => {
            try {
              // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
              insert(baseURL + res.data.data.url)
            } catch (error) {
              console.error(error)
              this.$message.error('上传文件失败，发生错误')
            }
          }
        },
        // 上传视频
        uploadVideo: {
          url: uploadURL,
          name: 'file',
          headers: this.getToken(),
          uploadSuccess: (res, insert) => {
            try {
              insert(baseURL + res.data.data.url)
            } catch (error) {
              console.error(error)
              this.$message.error('上传文件失败，发生错误')
            }
          }
        }
      },
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    getToken () {
      const token = JSON.parse(localStorage.getItem('heimatoutiao_admin_userInfo')).token
      return { Authorization : token }
    },
    publishArticle () {
      if (this.article.type === 1) {
        // 获取富文本内容
        this.article.content = this.$refs.articleEditor.editor.root.innerHTML
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      console.log(file)
    },
    handleSuccess (res, file, fileList) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      console.log(files)
      this.$message.warning('只能上传一个')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~quill/dist/quill.snow.css";
</style>
