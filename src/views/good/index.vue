<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-input
          v-model="query.name"
          placeholder="请输入商品名称"
          class="filter-item"
          @change="changeFilter"
          @keyup.enter.native="changeFilter"
        />
        <el-input
          v-model="query.phone"
          placeholder="请输入商品类别"
          class="filter-item"
          @change="changeFilter"
          @keyup.enter.native="changeFilter"
        />
        <el-button
          type="primary"
          @click="changeFilter"
        >搜索</el-button>
        <el-button
          style="margin-left: 0;"
          @click="resetFilter"
        >清除筛选</el-button>
      </div>
      <div>
        <el-button
          type="primary"
          @click="addGood"
        >添加商品</el-button>
      </div>
    </div>
    <div class="list-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
      >
        <el-table-column
          prop="goodName"
          label="商品名称"
        />
        <el-table-column
          prop="goodCategory"
          label="商品类别"
        />
        <el-table-column
          prop="goodUnit"
          label="商品单位"
        />
        <el-table-column
          prop="entryPrice"
          label="进货价格"
          align="center"
        />
        <el-table-column
          prop="salePrice"
          label="零售价格"
          align="center"
        />
        <el-table-column
          prop="goodNum"
          label="商品库存"
          align="center"
        />
        <el-table-column
          label="操作"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="editGood(scope.row, scope.$index)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteGood(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="addGoodDialog"
      title="添加商品"
      width="700px"
    >
      <el-form
        ref="addGoodForm"
        :model="addGoodForm"
        :rules="goodFormRules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          prop="goodName"
          label="商品名称"
        >
          <el-input v-model="addGoodForm.goodName" />
        </el-form-item>
        <el-form-item
          prop="goodCategory"
          label="商品类别"
        >
          <el-input v-model="addGoodForm.goodCategory" />
        </el-form-item>
        <el-form-item
          prop="goodUnit"
          label="商品单位"
        >
          <el-input v-model="addGoodForm.goodUnit" />
        </el-form-item>
        <el-form-item
          prop="entryPrice"
          label="进货价格"
        >
          <el-input-number
            v-model="addGoodForm.entryPrice"
            :step="50"
            :precision="2"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          prop="salePrice"
          label="零售价格"
        >
          <el-input-number
            v-model="addGoodForm.salePrice"
            :step="50"
            :precision="2"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          prop="goodNum"
          label="商品库存"
        >
          <el-input-number
            v-model="addGoodForm.goodNum"
            :step="50"
            :min="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelAddGood">取 消</el-button>
        <el-button
          :loading="submitAddGoodLoading"
          type="primary"
          @click="submitAddGood"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="editGoodDialog"
      title="编辑商品"
      width="700px"
    >
      <el-form
        ref="editGoodForm"
        :model="editGoodForm"
        :rules="goodFormRules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          prop="goodName"
          label="商品名称"
        >
          <el-input v-model="editGoodForm.goodName" />
        </el-form-item>
        <el-form-item
          prop="goodCategory"
          label="商品类别"
        >
          <el-input v-model="editGoodForm.goodCategory" />
        </el-form-item>
        <el-form-item
          prop="goodUnit"
          label="商品单位"
        >
          <el-input v-model="editGoodForm.goodUnit" />
        </el-form-item>
        <el-form-item
          prop="entryPrice"
          label="进货价格"
        >
          <el-input-number
            v-model="editGoodForm.entryPrice"
            :step="50"
            :precision="2"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          prop="salePrice"
          label="零售价格"
        >
          <el-input-number
            v-model="editGoodForm.salePrice"
            :step="50"
            :precision="2"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          prop="goodNum"
          label="商品库存"
        >
          <el-input-number
            v-model="editGoodForm.goodNum"
            disabled
            :step="50"
            :min="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelEditGood">取 消</el-button>
        <el-button
          :loading="submitEditGoodLoading"
          type="primary"
          @click="submitEditGood"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import good from '@/api/good'
export default {
  data() {
    const validateEntryPrice = (rule, value, callback) => {
      if (value > 0) {
        callback()
      } else {
        callback(new Error('请输入商品的进货价格'))
      }
    }
    const validateSalePrice = (rule, value, callback) => {
      if (value > 0) {
        callback()
      } else {
        callback(new Error('请输入商品的零售价格'))
      }
    }
    return {
      query: {
        goodName: '',
        goodCategory: ''
      },
      addGoodForm: {
        entryPrice: 0.00,
        goodCategory: '',
        goodName: '',
        goodNum: 0,
        goodUnit: '',
        salePrice: 0.00
      },
      editGoodForm: {
        entryPrice: 0.00,
        goodCategory: '',
        goodName: '',
        goodUnit: '',
        goodNum: 0,
        salePrice: 0.00,
        id: ''
      },
      editIndex: 0,
      goodFormRules: {
        goodName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goodCategory: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ],
        goodUnit: [
          { required: true, message: '请输入商品单位', trigger: 'blur' }
        ],
        entryPrice: [
          { required: true, validator: validateEntryPrice, trigger: 'change' }
        ],
        salePrice: [
          { required: true, validator: validateSalePrice, trigger: 'change' }
        ]
      },
      addGoodDialog: false,
      editGoodDialog: false,
      submitAddGoodLoading: false,
      submitEditGoodLoading: false,
      list: [],
      listLoading: false
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    getGoodList() {
      this.listLoading = true
      good.getGoodList().then(res => {
        this.list = res
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    changeFilter() {

    },
    resetFilter() {

    },
    addGood() {
      this.addGoodDialog = true
      this.submitAddGoodLoading = false
      this.$nextTick(() => {
        this.$refs.addGoodForm.resetFields()
      })
    },
    cancelAddGood() {
      this.addGoodDialog = false
    },
    submitAddGood() {
      this.$refs.addGoodForm.validate(async valid => {
        if (valid) {
          try {
            const goodNameValidate = await this.validateGood(this.addGoodForm.goodName)
            if (!goodNameValidate) {
              this.$message.error('商品已存在,请修改商品名称')
              return false
            }
            this.submitAddGoodLoading = true
            good.addGood(this.addGoodForm).then(res => {
              this.$message.success('添加成功！')
              this.addGoodDialog = false
              this.getGoodList()
            }).catch(() => {
              this.submitAddGoodLoading = false
              this.$message.error('添加失败！')
            })
          } catch (error) {
            this.$message.error('添加失败！')
          }
        } else {
          return false
        }
      })
    },
    editGood(row, index) {
      this.editGoodDialog = true
      this.submitEditGoodLoading = false
      this.$set(this.editGoodForm, 'entryPrice', row.entryPrice)
      this.$set(this.editGoodForm, 'goodCategory', row.goodCategory)
      this.$set(this.editGoodForm, 'goodName', row.goodName)
      this.$set(this.editGoodForm, 'goodUnit', row.goodUnit)
      this.$set(this.editGoodForm, 'salePrice', row.salePrice)
      this.$set(this.editGoodForm, 'goodNum', row.goodNum)
      this.$set(this.editGoodForm, 'id', row.id)
      this.editIndex = index
    },
    cancelEditGood() {
      this.$refs.editGoodForm.resetFields()
      this.editGoodDialog = false
    },
    submitEditGood() {
      this.$refs.editGoodForm.validate(async valid => {
        if (valid) {
          try {
            if (this.editGoodForm.goodName !== this.list[this.editIndex].goodName) {
              const goodNameValidate = await this.validateGood(this.editGoodForm.goodName)
              if (!goodNameValidate) {
                this.$message.error('商品已存在,请修改商品名称')
                return false
              }
            }
            this.submitEditGoodLoading = true
            good.editGood(this.editGoodForm).then(res => {
              this.$message.success('编辑成功！')
              this.$refs.editGoodForm.resetFields()
              this.editGoodDialog = false
              this.getGoodList()
            }).catch(() => {
              this.submitEditGoodLoading = false
              this.$message.error('编辑失败！')
            })
          } catch (error) {
            this.$message.error('编辑失败！')
          }
        } else {
          return false
        }
      })
    },
    validateGood(name) {
      return new Promise((resolve, reject) => {
        good.validateGood(name).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    deleteGood(row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteGoodById(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteGoodById(id) {
      good.deleteGood(id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getGoodList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败!'
        })
      })
    }
  }
}
</script>

<style style="stylus" scoped>

</style>
