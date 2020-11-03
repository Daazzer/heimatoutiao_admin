<template>
  <el-container class="articlelist">
    <el-card class="articlelist-wrapper">
      <el-table
        class="articlelist-table"
        :data="articlesData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="60"
        />
        <el-table-column
          prop="title"
          label="标题"
        />
        <el-table-column
          v-slot="scope"
          prop="type"
          label="类型"
          width="120"
        >
          {{ scope.row.type === 1 ? '文章' : '视频' }}
        </el-table-column>
        <el-table-column
          prop="user.nickname"
          label="作者"
          width="210"
        />
        <!-- 可以用最简洁的作用域插槽的语法 -->
        <el-table-column v-slot="scope" class="articlelist-opt" label="操作" width="180">
          <el-tooltip
            popper-class="articlelist-opt__tips"
            content="编辑"
            placement="bottom"
            effect="light"
            :open-delay="800"
            :visible-arrow="false"
           >
            <el-button
              size="medium"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            popper-class="articlelist-opt__tips"
            content="删除"
            placement="bottom"
            :open-delay="800"
            effect="light"
            :visible-arrow="false"
          >
            <el-button
              size="medium"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            />
          </el-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[2, 4, 6, 8]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </el-container>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      articlesData: [],
      pageIndex: 1,
      pageSize: 4,
      total: 0
    }
  },
  methods: {
    /**
     * 发送请求获取文章数据
     * @param {number} pageIndex 当前页码
     * @param {number} pageSize 每页显示的数据条数
     */
    async getArticle (pageIndex, pageSize) {
      const [err, res] = await this.$api.getArticle({
        pageIndex,
        pageSize
      })

      if (err) {
        return this.$message.fail('获取文章数据出错')
      }

      const { data: articlesData, total } = res.data

      this.articlesData = articlesData
      this.total = total
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getArticle(this.pageIndex, pageSize)
    },
    handleCurrentChange (pageIndex) {
      this.pageIndex = pageIndex
      this.getArticle(pageIndex, this.pageSize)
    },
    handleEdit (row) {
      this.$router.push(`/index/articlePublish/${row.id}`)
    },
    handleDelete (row) {
      this.$confirm(`此操作将永久删除 id 为${row.id}的文章, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => this.$message.success('删除成功!'))
        .catch(() => undefined)
    }
  },
  mounted () {
    this.getArticle(this.pageIndex, this.pageSize)
  }
}
</script>

<style lang="scss">
// 影响全局的提示信息
.articlelist-opt__tips {
  padding: 3px 5px;
}
</style>

<style lang="scss" scoped>
.articlelist {
  &-wrapper {
    width: 100%;
  }
  &-table {
    margin-bottom: 20px;
  }
}
</style>
