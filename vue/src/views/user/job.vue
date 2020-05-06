<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="下达指标"></el-step>
      <el-step title="通知机构"></el-step>
      <el-step title="数据报送"></el-step>
    </el-steps>
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" v-if="hasPerm('user:add')" @click="showCreate">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" prop="nickname" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="用户名" prop="username" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="角色" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-text="scope.row.roleName" v-if="scope.row.roleId===1"></el-tag>
          <el-tag type="primary" v-text="scope.row.roleName" v-else></el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="170"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="170"></el-table-column>
      <el-table-column align="center" label="管理" width="220" v-if="hasPerm('user:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" v-if="scope.row.userId!=userId "
                     @click="removeUser(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form class="small-space" :model="tempUser" label-position="left" label-width="100px"
               style='width: 700px; margin-left:50px;'>
      <div v-if="choosed==='one'">
        <h2 align="center">下达指标</h2>

        <el-form-item label="日期范围:" required v-if="dialogStatus=='create'">
            <el-date-picker type="daterange" v-model="job.jobrange" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
                            end-placeholder="结束日期" range-separator="至" clearable></el-date-picker>
          </el-form-item>
        <el-form-item label="截止时间:" required v-if="dialogStatus=='create'">
          <el-date-picker
            v-model="job.dateline"
            type="date"
            placeholder="截止时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="报送内容:" v-if="dialogStatus=='create'" required>
          <el-checkbox-group v-model="job.need" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="bank in banks" :label="bank" :key="bank">{{bank}}</el-checkbox>
          </el-checkbox-group>

          <el-checkbox-group v-model="job.need" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="insurance in insurances" :label="insurance" :key="insurance">{{insurance}}</el-checkbox>
          </el-checkbox-group>

        </el-form-item>
        <el-form-item label="机构：" required>
          <el-select v-model="tempUser.roleId" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" required>
          <el-input type="text" v-model="tempUser.nickname">
          </el-input>
        </el-form-item>
      <div slot="footer" class="dialog-footer" align="right">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
      </div>
      <div v-if="choosed==='two'">
        <h2 align="center">选择机构</h2>
        <el-form-item label="机构：" required>
          <el-input type="text" v-model="tempUser.nickname">
          </el-input>
        </el-form-item>
        <el-form-item label="通知方式：" required>
          <el-input type="text" v-model="tempUser.nickname">
          </el-input>
        </el-form-item>

        <div slot="footer" class="dialog-footer" align="right">
          <el-button type="primary" @click="last">上一步</el-button>
<!--          <el-button type="primary" @click="choosed='three'">下一步</el-button>-->
          <el-button v-if="dialogStatus=='create'" type="success" @click="createUser">创 建</el-button>
          <el-button type="primary" v-else @click="updateUser">修 改</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </div>
      </el-form>

    </el-dialog>

<!--    <el-button type="text" @click="dialog = true; choosed='one'">点击打开 Dialog</el-button>-->
  </div>
</template>
<script>
  const bankOptions = ['存款', '贷款', '信用卡', '储蓄卡','对公数据','外汇数据','反洗钱','征信数据'];
  const InsuranceOptions =['财产保险','人身保险','责任保险','信用保险'];
  import {mapGetters} from 'vuex'
  export default {
    data: function () {
      return {
        dialog: false,
        choosed: 'one',
        active: 0,
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 50,//每页条数
        },
        roles: [],//角色列表
        dialogStatus: 'step1',
        dialogFormVisible: false,
        textMap: {
          step1: '指标',
          step2: '机构'
        },
        tempUser: {
          username: '',
          password: '',
          nickname: '',
          roleId: '',
          userId: ''
        },
        banks: bankOptions,
        insurances:InsuranceOptions,
        job: {
          jobrange: '',
          dateline:'',
          need:'',
          user:'',
          remark:'',
        },
      }
    },
    created() {
      this.getList();
      if (this.hasPerm('user:add') || this.hasPerm('user:update')) {
        this.getAllRoles();
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    methods: {
      next(){
      if (this.active++ > 2) this.active = 0;
      this.choosed="two";
      },
      last(){
        // if (this.active-- > 2) this.active = 0;
        this.active--;
        this.choosed="one";
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      getAllRoles() {
        this.api({
          url: "/user/getAllRoles",
          method: "get"
        }).then(data => {
          this.roles = data.list;
        })
      },
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/user/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      handleFilter() {
        //查询事件
        this.listQuery.pageNum = 1
        this.getList()
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      showCreate() {
        //显示新增对话框
        this.tempUser.username = "";
        this.tempUser.password = "";
        this.tempUser.nickname = "";
        this.tempUser.roleId = "";
        this.tempUser.userId = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let user = this.list[$index];
        this.tempUser.username = user.username;
        this.tempUser.nickname = user.nickname;
        this.tempUser.roleId = user.roleId;
        this.tempUser.userId = user.userId;
        this.tempUser.deleteStatus = '1';
        this.tempUser.password = '';
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createUser() {
        //添加新用户
        // if (this.active++ > 2) this.active = 0;

        this.api({
          url: "/user/addUser",
          method: "post",
          data: this.tempUser
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateUser() {
        //修改用户信息
        let _vue = this;
        this.api({
          url: "/user/updateUser",
          method: "post",
          data: this.tempUser
        }).then(() => {
          let msg = "修改成功";
          this.dialogFormVisible = false
          if (this.userId === this.tempUser.userId) {
            msg = '修改成功,部分信息重新登录后生效'
          }
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              _vue.getList();
            }
          })
        })
      },
      removeUser($index) {
        let _vue = this;
        this.$confirm('确定删除此用户?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let user = _vue.list[$index];
          user.deleteStatus = '2';
          _vue.api({
            url: "/user/updateUser",
            method: "post",
            data: user
          }).then(() => {
            _vue.getList()
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      },
    }
  }
</script>
