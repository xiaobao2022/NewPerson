<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <Treetools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <Treetools slot-scope="{ data }" :tree-node="data" @getDepartments="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件  -->
    <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" />
  </div>
</template>

<script>
import AddDept from './components/add-dept' // 引入新增部门组件
import Treetools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { transListToTreeNew } from '@/utils/index'
export default {
  components: { Treetools, AddDept },
  data() {
    return {
      company: {},
      defaultProps: {
        // children: 'children',
        label: 'name'
      },
      departs: [],
      showDialog: false,
      node: {},
      loading: false
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      console.log(result)
      this.departs = transListToTreeNew(result.depts, '')
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.loading = false
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    // 编辑部门节点
    editDepts(node) {
      // 首先打开弹层
      this.showDialog = true
      this.node = node // 赋值操作的节点
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}
</script>

<style scoped>
.app-container{
  width: 1200px;
  margin: 50px auto;
}
.tree-card {
  padding: 10px  0px;
  font-size:14px;

}
</style>
