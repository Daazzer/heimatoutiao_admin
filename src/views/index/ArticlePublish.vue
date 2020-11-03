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
      <el-form-item label="内容：">
        <VueEditor v-if="article.type === 1" :config="articleEditorConfig" ref="articleEditor" />
        <el-upload
          v-if="article.type === 2"
          :action="uploadURL"
          :headers="getToken()"
          :limit="1"
          :file-list="videoList"
          :before-upload="handleBeforeUploadVideo"
          :on-success="handleUploadVideoSuccess"
          :on-exceed="handleUploadVideoExceed"
          :on-remove="handleUploadVideoRemove"
          :on-error="handleUploadVideoError"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip">只能上传avi/mp4文件，且不超过80M</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="栏目：">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCategories" @change="handleCheckedCategoriesChange">
            <el-checkbox
              v-for="category in categories"
              :label="category.id"
              :key="category.id"
            >{{ category.name }}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      <el-form-item label="上传封面：">
        <el-upload
          list-type="picture-card"
          multiple
          :action="uploadURL"
          :headers="getToken()"
          :limit="3"
          :file-list="article.cover"
          :on-preview="handleCoverPreview"
          :on-success="handleUploadCoverSuccess"
          :on-remove="handleUploadCoverRemove"
          :on-exceed="handleUploadCoverExceed"
          :on-error="handleUploadCoverError"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="coverImageVisible">
          <img width="100%" :src="coverImageUrl" alt="图片预览">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          @click.prevent="publishArticle"
        >发布文章</el-button>
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
    const baseURL = axios.defaults.baseURL
    const uploadURL = baseURL + '/upload'
    return {
      labelPosition: 'right',
      baseURL: axios.defaults.baseURL,
      uploadURL,
      article: {
        title: '',
        type: 1,
        content: '',
        cover: [],
        categories: []
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
              this.$message.error('上传文件失败，发生错误')
            }
          }
        }
      },
      checkAll: false,
      isIndeterminate: true,
      categories: [],
      checkedCategories: [],
      videoList: [],
      videoType: ['video/avi', 'video/mp4'],
      coverImageUrl: '', // 封面图片预览
      coverImageVisible: false // 封面图片预览是否可见
    }
  },
  methods: {
    getToken () {
      const token = JSON.parse(localStorage.getItem('heimatoutiao_admin_userInfo')).token
      return { Authorization : token }
    },
    handleCheckAllChange (isCheckAll) {
      this.checkedCategories = isCheckAll ? this.categories.map(v => v.id) : []
      this.isIndeterminate = false
    },
    handleCheckedCategoriesChange (checkedCategories) {
      let checkedCount = checkedCategories.length
      // 判断是否全选了
      this.checkAll = checkedCount === this.categories.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.categories.length
    },
    handleBeforeUploadVideo (file) {
      if (this.videoType.indexOf(file.type) === -1) {
        this.$message.warning('类型不对')
        return false
      } else if (file.size / 1024 / 1024 > 80) {
        this.$message.warning('文件太大')
        return false
      }
    },
    handleUploadVideoSuccess (res, file, fileList) {
      if (res.statusCode) {
        return this.$message.error('上传文件失败')
      }

      this.$message.success(res.message)
      this.article.content = this.baseURL + res.data.url
    },
    handleUploadVideoExceed () {
      this.$message.warning('只能上传一个')
    },
    handleUploadVideoRemove () {
      this.article.content = ''
    },
    handleUploadVideoError () {
      this.$message.error('上传文件出错')
    },
    handleCoverPreview (file) {
      this.coverImageUrl = file.url;
      this.coverImageVisible = true;
    },
    handleUploadCoverSuccess (res, file) {
      const url = this.baseURL + res.data.url
      const id = res.data.id
      this.article.cover.push({ id, url })
      this.$message.success(res.message)
    },
    handleUploadCoverRemove (file) {
      let removeId
      if (this.$route.params.id) {
        removeId = file.id
      } else {
        removeId = file.response.data.id
      }
      // 返回 id 不等于当前的这个图片 id 的数组
      this.article.cover = this.article.cover.filter(v => v.id !== removeId)
    },
    handleUploadCoverExceed () {
      this.$message.warning('最多只能上传三张封面')
    },
    handleUploadCoverError () {
      this.$message.error('上传封面失败')
    },
    async publishArticle () {
      if (this.$route.params.id) {
        // 编辑文章
        this.article.categories = this.checkedCategories.map(id => ({ id }))
        this.article.cover = this.article.cover.map(({ id }) => ({ id }))

        const { title, content, categories, type, open, cover } = this.article

        const [err, res] = await this.$api.editArticleById(this.$route.params.id, {
          title,
          content,
          categories,
          cover,
          type,
          open
        })

        if (err) {
          return this.$message.error('编辑文章失败，发生错误')
        } else if (res.data.statusCode) {
          return this.$message.error('编辑文章失败' + res.data.message)
        }
        this.$message.success(res.data.message)
        this.$router.push('/index/articleList')
      } else {
        // 发布文章
        if (this.article.type === 1) {
          // 获取富文本内容
          this.article.content = this.$refs.articleEditor.editor.root.innerHTML
        }
        this.article.categories = this.checkedCategories.map(id => ({ id }))

        [err, res] = await this.$api.publishArticle(this.article)

        if (err) {
          return this.$message.error('发布文章失败，发生错误')
        } else if (res.data.statusCode) {
          return this.$message.error('发布文章失败' + res.data.message)
        }
        this.$message.success(res.data.message)
        this.$router.push('/index/articleList')
      }
    },
    // 初始化栏目
    async initCate () {
      const [cateErr, cateRes] = await this.$api.getCategory()

      if (cateErr) {
        return this.$message.error('获取栏目数据出错')
      }
      // 去掉关注和头条两项
      const cateData = cateRes.data.data.filter(({ name, id }) => (
        id !== 999 && id !== 0 && name !== '头条' && name !== '关注'
      ))

      this.categories = cateData
    },

    async initArticle () {
      const articleId = this.$route.params.id

      if (!articleId) {
        return
      }

      const [articleErr, articleRes] = await this.$api.getArticleById(articleId)

      if (articleErr) {
        return this.$message.error('获取文章数据出错')
      }

      // 初始化文章数据
      this.article = articleRes.data.data

      if (this.article.type === 1) {
        // 初始化富文本框
        this.$refs.articleEditor.editor.clipboard.dangerouslyPasteHTML(0, this.article.content)
      } else {
        // 初始化视频数据
        this.videoList = [{ name: this.article.title, url: this.article.content }]
      }

      // 改造文章栏目数据，返回一个 id 对象数组
      this.article.categories = this.article.categories.map(({ id }) => ({ id }))

      // 初始化栏目数据
      this.checkedCategories = this.article.categories.map(v => v.id)

      // 改造封面数据，删除 uid 属性
      this.article.cover = this.article.cover.map(({id, url}) => {
        url = url.indexOf('http') === -1 ? this.baseURL + url : url
        return {
          id,
          url
        }
      })

      // note: 由于响应返回的数据中 cover 字段存在一个 uid 的属性，两个 uid 相同，导致
      // Upload 组件发生冲突，从而报错
      // cover.forEach(v => {
      //   if (v.url.indexOf('http') === -1) {
      //     v.url = this.baseURL + v.url
      //   }
      // })
      // this.article.cover = cover
    }
  },
  mounted () {
    this.initArticle().then(() => {
      this.initCate()
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~quill/dist/quill.snow.css";
</style>
