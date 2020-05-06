<template>
<div class="mysqlDeploy">
  <div class="title">deploy</div>
  <div class="deployBox">
    <el-steps :active="active" finish-status="success">
      <el-step title="安装1"></el-step>
      <el-step title="安装2"></el-step>
      <el-step title="安装3"></el-step>
      <el-step title="安装4"></el-step>

    </el-steps>
    <el-form class="small-space" :model="tempUser" label-position="left" label-width="80px"
             style='width: 300px; margin-left:50px;'>

    <div class="basicInfo" v-if="active===0">
      安装1
      <el-form-item label="用户名" required>
        <el-input type="text" v-model="tempUser.username">
        </el-input>
      </el-form-item>
    </div>
    <div class="basicInfo" v-if="active===1">
      安装2
      <el-form-item label="密码"  required>
        <el-input type="password" v-model="tempUser.password">
        </el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="tempUser.password" placeholder="不填则表示不修改">
        </el-input>
      </el-form-item>
    </div>

    <div class="basicInfo" v-if="active===2">
      安装3
      <el-form-item label="角色" required>
        <el-select v-model="tempUser.roleId" placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId">
          </el-option>
        </el-select>
      </el-form-item>

    </div>
    <div class="basicInfo" v-if="active===3">
      安装4
      <el-form-item label="昵称" required>
        <el-input type="text" v-model="tempUser.nickname">
        </el-input>
      </el-form-item>
    </div>
    </el-form>

    <div>
      <el-button style="margin-top: 12px;" @click="prev" v-if="active==1||active==2||active==3">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next" v-if="active==0||active==1||active==2">下一步</el-button>
      <el-button style="margin-top: 12px;"  v-if="active==3">提交</el-button>
    </div>
  </div>
</div>
</template>

<script>
    export default {
        name: "step",
      data(){
          return{
            active: 0,
            tempUser: {
              username: '',
              password: '',
              nickname: '',
              roleId: '',
              userId: ''
            }
          }
      },
      methods:{
          prev(){
            --this.active;
            if (this.active<0)this.active=0;
          },
        next(){
            // ++this.active;
            if(this.active++>3)this.active=0;
        }
      }
    }
</script>

<style scoped>

</style>
