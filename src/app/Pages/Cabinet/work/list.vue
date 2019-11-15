<template>
  <div>
    <el-button class="pull-right"   type="primary" @click="addWorker">
      <i class="el-icon-plus m-r-xs"></i>新建员工
    </el-button>

    <div class="m-t-lg">
      <el-table class="ukao-el-table"
      :data="tableData.list"
      style="width: 100%">
        <el-table-column  label="员工名称">
          <template slot-scope="scope">
            <div>{{ scope.row.name }}</div>
		      	<div>{{ scope.row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column  label="登录账号">
          <template slot-scope="scope">
            <div>{{scope.row.account}}</div>
          </template>
        </el-table-column>
        <el-table-column  label="角色">
          <template slot-scope="scope">
            <div>{{scope.row.roleName}}</div>
          </template>
        </el-table-column>
        <el-table-column  label="创建时间">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | getDate }}</div>
						<div>{{ scope.row.createTime | getTime }}</div>
          </template>
        </el-table-column>
        <el-table-column  label="状态">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.status == 1" effect="dark" content="已启用" placement="right">
              <i class="t-state t-state-success"></i>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status == 0" effect="dark" content="未启用" placement="right">
              <i class="t-state"></i>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status == -1" effect="dark" content="已删除" placement="right">
              <i class="t-state"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--<el-table-column  label="操作">-->
          <!--<template slot-scope="scope">-->
            <!--<div>启用</div>-->
            <!--<div>停用</div>-->
            <!--<div>删除</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <div class="text-right m-t-sm">
        <el-pagination class="pull-right"
          :page-size="tableData.pagination.size"
          layout="total, prev, pager, next"
          :total="tableData.pagination.total"
          :current-page.sync = "tableData.pagination.page"
               @current-change="handleCurrentChange" >
        </el-pagination>
      </div>
    </div>


    <!-- 创建批次 -->
    <el-dialog class="ukao-dialog"
    title="新建取送员"
    :visible.sync="dialog.visible"
    size="small">
    <div>
      <div style="margin-left: 60px">
        <el-radio-group v-model="labelPosition" size="small">
          <el-radio-button label="1">新建员工</el-radio-button>
          <el-radio-button label="2">从系统导入</el-radio-button>
        </el-radio-group>
        <div style="margin: 20px;"></div>
      </div>

      <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
        <el-form-item v-if="labelPosition==2" label="系统员工" prop="workId" :rules="[
            { required: true, message: '请选择员工', trigger: 'change'},
          ]">
          <el-select filterable  v-model="ruleForm.workId" placeholder="请选择" @change="onSelectWorker">
            <el-option
              v-for="item in workerList"
              :key="item.id"
              :label="item.name"
              :value="item.id+''">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="labelPosition==1" label="姓名" prop="name" 	:rules="[
            { required: true, message: '请输入姓名' },
          ]">
          <div class="dis-inline w-lg m-r-sm">
            <el-input  v-model="ruleForm.name" placeholder="员工姓名"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="手机号" prop="phone" 	:rules="[
            { required: true, message: '请输入有效的员工手机号', min:11, max:11 },
          ]">
          <div class="dis-inline w-lg m-r-sm">
            <el-input :disabled="labelPosition==2" v-model="ruleForm.phone" placeholder="员工手机号"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="登录密码" prop="password" 	:rules="[
            { required: true, message: '请输入6位长度的数字密码', min:6, max:6 },
          ]">
          <div class="dis-inline w-lg m-r-sm">
            <el-input  v-model="ruleForm.password" placeholder="6位长度的数字密码"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="备注" prop="remark" :rules="[
              { min:0, max:200, message: '0至200位长度'}
          ]">
          <div class="dis-inline w-lg">
            <el-input type="textarea" v-model="ruleForm.remark" placeholder="备注（选填）"></el-input>
          </div>
        </el-form-item>
        <el-form-item >
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" :loading="dialog.btn" @click="submitForm('ruleForm')">{{dialog.text}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  </div>
</template>
<script>
  import consts from '@/utils/consts'
 	import msg from '@/utils/msg'


  export default {
    data: function() {
      return {
        labelPosition:1,
        loading: false,
        tableData: {
          list: [],
          pagination: {
            size: consts.PAGE_SIZE,
            total: 0,
            page:1,
          }
        },
        dialog:{
          btn: false,
          visible: false,
          text: '保存'
        },
        workerList:[],
        ruleForm:{
          workId: '',
          name: '',
          phone: '',
          password: '',
          remark: ''
        }
      }
    },
    directives: {
      focus: {
        inserted: function (el, {value}) {
             if (value) {
                 el.focus();
             }
         }
      }
    },
    created () {
      this.list(0)
      this.queryWorkerList()
    },
    methods: {
      list(start){
        this.loading = true;
        this.$store.dispatch('post', {
          uri : 'workerCupboardRel/list',
          data: {
            startRow: start|| 0,
            pageSize: this.tableData.pagination.size,
          }
        }).then((res) =>{
          this.tableData.list = res.data.data.list || []
          this.tableData.pagination.total = res.data.data.total || 0
          this.loading = false;
        })
      },
      handleCurrentChange (val){
        this.list((val-1) * this.tableData.pagination.size)
      },
      queryWorkerList(){
        this.$store.dispatch('post', {
          uri : 'workerInfo/conciseList',
          data: {
          }
        }).then((res) =>{
          this.workerList = res.data.data.list || []
        })
      },
      onSelectWorker(){
        var _this = this
        _this.workerList.forEach(function (item) {
          if(_this.ruleForm.workId == item.id){
            _this.ruleForm.phone = item.phone
            _this.ruleForm.name = item.name
            return;
          }
        })
      },
      addWorker(){
        this.dialog.visible = true
      },
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('post', {
              uri: 'workerCupboardRel/add',
              data: this.ruleForm
            }).then((res) => {
              msg.success();
              this.dialog.btn = false
              this.dialog.text = "保存"
              this.dialog.visible = false
              this.list(0)
            })
          }else{
            return false
          }
        })
      },
    }
  }
</script>
