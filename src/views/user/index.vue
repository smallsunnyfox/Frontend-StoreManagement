<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-input
          v-model="queryVo.name"
          placeholder="请输入名字"
          class="filter-item"
          @change="changeFilter"
          @keyup.enter.native="changeFilter"
        />
        <el-input
          v-model="queryVo.phone"
          placeholder="请输入手机号"
          class="filter-item"
          @change="changeFilter"
          @keyup.enter.native="changeFilter"
        />
        <el-select v-model="queryVo.sex" placeholder="请选择性别" class="filter-item" clearable @change="changeFilter">
          <el-option value="男">男</el-option>
          <el-option value="女">女</el-option>
        </el-select>
        <el-button type="primary" @click="changeFilter">搜索</el-button>
        <el-button style="margin-left: 0;" @click="resetFilter">清除筛选</el-button>
      </div>
      <div>
        <el-button type="primary" @click="addClient">
          {{ role === 'client' ? '添加客户' : '添加供应商' }}
        </el-button>
      </div>
    </div>
    <div class="list-container">
      <el-table v-loading="tableLoading" :data="list" border>
        <el-table-column prop="idName" :label="role === 'client' ? '客户名' : '供应商名'" />
        <el-table-column prop="gender" :label="role === 'client' ? '客户性别' : '供应商性别'" />
        <el-table-column prop="phone" :label="role === 'client' ? '客户手机号' : '供应商手机号'" />
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editClient(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteClient(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalRow"
        :page-size="queryVo.size"
        :current-page="queryVo.page"
        @current-change="changePage"
      />
    </div> -->
    <el-dialog :visible.sync="showAddClient" :title="role === 'client' ? '添加客户' : '添加供应商'" width="500px">
      <el-form ref="addClientForm" :model="addClientForm" :rules="addClientRule" label-width="80px" label-position="left">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="addClientForm.name" />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-select v-model="addClientForm.sex" style="width:100%;">
            <el-option value="男">男</el-option>
            <el-option value="女">女</el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="addClientForm.phone" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelAddClient">取 消</el-button>
        <el-button :loading="submitAddClientLoading" type="primary" @click="submitAddClient">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showEditClient" :title="role === 'client' ? '编辑客户' : '编辑供应商'" width="500px">
      <el-form ref="editClientForm" :model="editClientForm" :rules="addClientRule" label-width="80px" label-position="left">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="editClientForm.name" />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-select v-model="editClientForm.sex" style="width:100%;">
            <el-option value="男">男</el-option>
            <el-option value="女">女</el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="editClientForm.phone" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelEditClient">取 消</el-button>
        <el-button :loading="submitEditClientLoading" type="primary" @click="submitEditClient">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import user from '@/api/user'
import { validatePhone } from '@/utils/validate'
export default {
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码'))
      } else if (!validatePhone(value)) {
        return callback(new Error('请输入正确格式的手机号码'))
      } else {
        callback()
      }
    }
    return {
      role: '',
      queryVo: {
        name: '',
        phone: '',
        sex: ''
      },
      addClientForm: {
        name: '',
        phone: '',
        sex: ''
      },
      editClientForm: {
        name: '',
        phone: '',
        sex: '',
        id: ''
      },
      list: [],
      tableLoading: false,
      submitAddClientLoading: false,
      submitEditClientLoading: false,
      showAddClient: false,
      showEditClient: false,
      addClientRule: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.role = this.$route.name.toLowerCase()
    this.getClients()
  },
  methods: {
    getClients() {
      this.tableLoading = true
      user.getListByRole(this.role).then(res => {
        this.list = res
        this.tableLoading = false
      })
    },
    changeFilter() {
    },
    resetFilter() {
      this.queryVo.name = ''
      this.queryVo.sex = ''
      this.queryVo.phone = ''
    },
    addClient() {
      this.showAddClient = true
      this.submitAddClientLoading = false
      this.$nextTick(() => {
        this.$refs.addClientForm.resetFields()
      })
    },
    cancelAddClient() {
      this.showAddClient = false
    },
    submitAddClient() {
      this.$refs.addClientForm.validate((valid) => {
        if (valid) {
          this.submitEditClientLoading = true
          user.addUser({
            idName: this.addClientForm.name,
            phone: this.addClientForm.phone,
            gender: this.addClientForm.sex,
            role: this.role
          }).then(res => {
            this.$message.success('添加成功！')
            this.getClients()
            this.showAddClient = false
          }).catch(() => {
            this.$message.succeee('添加失败！')
          })
        } else {
          return false
        }
      })
    },
    editClient(row) {
      this.showEditClient = true
      this.submitEditClientLoading = false
      this.$set(this.editClientForm, 'name', row.idName)
      this.$set(this.editClientForm, 'phone', row.phone)
      this.$set(this.editClientForm, 'sex', row.gender)
      this.$set(this.editClientForm, 'id', row.id)
    },
    cancelEditClient() {
      this.$refs.editClientForm.resetFields()
      this.showEditClient = false
    },
    submitEditClient() {
      this.$refs.editClientForm.validate((valid) => {
        if (valid) {
          this.submitEditGoodLoading = true
          user.editUser({
            idName: this.editClientForm.name,
            phone: this.editClientForm.phone,
            gender: this.editClientForm.sex,
            role: this.role,
            id: this.editClientForm.id
          }).then(res => {
            this.$message.success('编辑成功！')
            this.$refs.editClientForm.resetFields()
            this.showEditClient = false
            this.getClients()
          }).catch(() => {
            this.submitEditGoodLoading = false
            this.$message.succeee('添加失败！')
          })
        } else {
          return false
        }
      })
    },
    deleteClient(row) {
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUserById(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteUserById(id) {
      user.deleteUser(id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getClients()
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
