<template>
  <el-card>
    <el-form label-position="right" label-width="80px" :model="formLabelAlign">
      <el-form-item label="标题：">
        <el-input v-model="formLabelAlign.name"></el-input>
      </el-form-item>
      <el-form-item label="类型：">
        <el-radio-group v-model="radio">
          <el-radio :label="3">备选项</el-radio>
          <el-radio :label="6">备选项</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容：">
        <VueEditor :config="config"/>
      </el-form-item>
      <el-form-item label="栏目：">
         <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      <el-form-item label="上传：">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">发布文章</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import VueEditor from 'vue-word-editor'

export default {
  name: 'ArticlePublish',
  components: {
    VueEditor
  },
  data () {
    const cityOptions = ['上海', '北京', '广州', '深圳']
    return {
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      radio: 3,
      config: {
      // 上传图片的配置
        uploadImage: {
          url: "http://localhost:3000/upload",
          name: "file",
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess(res, insert){
            insert("http://localhost:3000" + res.data.url)
          }
        },

        // 上传视频的配置
        uploadVideo: {
          url: "http://localhost:3000/upload",
          name: "file",
          uploadSuccess(res, insert){
            insert("http://localhost:3000" + res.data.url)
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
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~quill/dist/quill.snow.css";
</style>
