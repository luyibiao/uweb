<template>
  <div class="station">
    <navs class="m-b-md" :name="factoryInfo.name" menu="station"></navs>
    <!-- 固定工位 -->
    <el-row :gutter="40">
      <el-col :span="12" class="m-b" v-for="(item,index) in fixedList.slice(0,2)" :key="index">
        <stationItem :item="item" @editstaff="getStaffId" :staff="staffsInfo[item.id]||[]"></stationItem>
      </el-col>
    </el-row>
    <div class="next text-center">
      <i class="el-icon-caret-bottom icon-next text-vl"></i>
    </div>
    <!-- 新增工位 -->
    <div class="addstation m-b">
      <el-row :gutter="40">
        <el-col :span="12" class="m-b" v-for="(item,index) in addList" :key="index">
          <stationItem :item="item" :staff="staffsInfo[item.id]||[]" :def="item.def" @editstaff="getStaffId" @deleteItem="getDelBoxId" @editRename="editRename"></stationItem>
        </el-col>
      </el-row>
      <p class="text-center">
        <el-button type="primary" @click="addStation = true">新增工位</el-button>
      </p>
    </div>
    <!-- 固定工位 -->
    <el-row :gutter="40" v-for="(item,index) in fixedList.slice(2,4)" :key="index">
      <div class="next text-center">
        <i class="el-icon-caret-bottom icon-next text-vl"></i>
      </div>
      <el-col :span="24" class="m-b">
        <stationItem :item="item" :staff="staffsInfo[item.id]||[]" @editstaff="getStaffId"></stationItem>
      </el-col>
    </el-row>
    <!-- 新增工位弹框 -->
    <el-dialog :title="renameId ? '新工位名':'新增工位'" :visible.sync="addStation" size="tiny" @close="closeFormStation">
      <el-form :model="form" ref="stationForm" label-width="100px">
        <el-form-item label="工位名" prop="name" :rules="rule">
          <el-input type="text" v-model.trim="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeFormStation">取消</el-button>
          <el-button type="primary" @click="formStation('stationForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 工位员工编辑弹框 -->
    <el-dialog :title="'入场工位员工'" :visible.sync="editStaff" @close="closeFormStaff" size="small" :lock-scroll='false'>
      <div class="staffs clearfix" >
        <div class="staff-item pull-left" :class="{selected:item.checked}" @click="item.checked = !item.checked" v-for="(item,index) in allStaffInfo" :key="index">
          <div class="user-logo">
            <img :src="item.imgPath?item.imgPath:'/static/img/user/def.png'" alt="">
            <div class="mask text-center">
              <i class="el-icon-check text-xl"></i>
            </div>
          </div>
          <p class="text-center">
            <span class="name">{{item.name}}</span>
          </p>
        </div>
      </div>
      <div class="footer text-right" slot="footer">
        <el-button @click.native="closeFormStaff">取消</el-button>
        <el-button type="primary" @click="subFormStaff">确认</el-button>
      </div>
    </el-dialog>
    <!-- 工位删除弹出框 -->
    <el-dialog title="提示" :visible.sync="delBox.show" size="tiny">
      <span>确定删除该工位模块？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delBox.show = false">取 消</el-button>
        <el-button type="primary" @click="delAddStation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import consts from '@/utils/consts'
import stationItem from './station_item'
import { Message } from 'element-ui';
import navs from "./commponents/navs";

export default {
  data() {
    return {
      menu: '工位设置',   //当前页面位置
      factoryInfo:{},  //工厂信息
      factoryId: '', //工厂id
      editStaff: false,  //编辑员工
      formStaff: { //编辑后需提交的员工资料
        kindId: '',  //id
        addIds: '',  //增加的id集合
        deleteIds: ''  //删除的id集合
      },
      addStation: false,  //编辑工位
      renameId: 0, //需要改名的工位id
      form: {  //新增工位表单
        name: '' //新增工位名称
      },
      rule: [ //新增工位表单验证规则
        { required: true, message: '工位不能为空' },
        { min: 2, max: 8, message: '长度在 2 到 8 个字符' }
      ],
      delBox:{ //删除工位时弹出提醒框
        show:false,
        delStatioId:0
      }, 
      fixedList: [], //固定工位列表
      addList: [],  //新增工位列表

      allStaffInfo: [], //所有员工
      staffsInfo: {},// 上岗员工
      beforeSubStaff: {} // 保存员工资料修改提交前信息
    }
  },
  created() {
    this.factoryId = this.$route.params.id
    this.getFactoryInfo();
    this.getAllStationList(true);
    this.getAllStaffList();
  },
  methods: {
    getFactoryInfo(){
      this.$store.dispatch('post', {
					uri : 'factoryInfo/detail',
					data: {
						id: this.factoryId
					}
				}).then(res=>{
          this.factoryInfo = res.data.data;
        })
    },
    /**
     * 工位相关操作
     */
    // 获取所有工位列表   init是否初始化staffsInfo
    getAllStationList(ini = false) {
      this.$store.dispatch('post', {
        uri: 'workerKind/list',
        data: {
          factoryId: this.factoryId
        }
      }).then(res => {
        let list = res.data.data || [];
        let flist = [], alist = [];
        list.forEach(item => {
          if (ini) {
            this.$set(this.staffsInfo, [item.id], [])
          };
          item.def == 1 ? flist.push(item) : alist.push(item);
        })
        this.fixedList = flist;
        this.addList = alist;
        if (ini) {
          this.getStaffList();
        };
      })
    },
    //检查工位名是否重复
    checkStationName(fn) {
      let result = false
      this.$store.dispatch('post', {
        uri: 'workerKind/checkName',
        data: {
          factoryId: this.factoryId,
          name: this.form.name
        }
      }).then(res => {
        result = !res.data.data;
        if (result) {
          fn && fn();
        } else {
          Message({
            message: '该名称已存在！',
            duration: '1000',
            type: 'warning'
          })
        }
      })
    },
    //新增工位
    addNewStation() {
      this.$store.dispatch('post', {
        uri: 'workerKind/add',
        data: {
          factoryId: this.factoryId,
          name: this.form.name
        }
      }).then(res => {
        this.addList.push(res.data.data || {});
        this.staffsInfo[res.data.data.id] = [];
        this.addStation = false;
        this.form.name = '';
      })
    },
      // 获取需要删除的新增工位id并弹出提醒框
    getDelBoxId(id){
      this.delBox.show = true;
      this.delBox.delStatioId = id;
    },
    // 删除新增工位
    delAddStation() {
      this.$store.dispatch('post', {
        uri: 'workerKind/delete',
        data: {
          id: this.delBox.delStatioId
        }
      }).then(res => {
        this.addList.forEach((item, index) => {
          if (item.id == this.delBox.delStatioId) {
            this.addList.splice(index, 1);
          }
        })
        delete this.staffsInfo[this.delBox.delStatioId];
        this.delBox.show = false;
      })
    },
    // 编辑工位名称
    editStation() {
      this.$store.dispatch('post', {
        uri: 'workerKind/updateName',
        data: {
          id: this.renameId,
          name: this.form.name,
        }
      }).then(res => {
        this.addStation = false;
        this.addList.forEach((item, index) => {
          if (item.id == this.renameId) {
            this.addList[index].name = this.form.name;
          }
        })
        this.form.name = '';
      })

    },
    // 给需要改名的工位赋值id
    editRename(id,name) {
      this.form.name = name;
      this.renameId = id;
      this.addStation = true;
    },
    //工位弹出框提交
    formStation(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkStationName(this.renameId ? this.editStation : this.addNewStation);
        } else {
          return false;
        }
      });
    },
    //工位弹出框关闭回调时间
    closeFormStation() {
      this.addStation = false;
      this.renameId = 0;
      this.form.name = '';
    },

    /**
     * 员工相关操作
     */
    //获取所有员工
    getAllStaffList() {
      this.$store.dispatch('post', {
        uri: 'workerInfo/factory/list',
        data: {
          factoryId: this.factoryId
        }
      }).then(res => {
        this.allStaffInfo = res.data.data || [];
      })
    },
    // 获取所有上岗员工列表
    getStaffList() {
      this.$store.dispatch('post', {
        uri: 'workerKindRef/list',
        data: {
          factoryId: this.factoryId,
        }
      }).then(res => {
        res.data.data.forEach(item => {
          item.checked = true;
          this.staffsInfo[item.kindId] ? this.staffsInfo[item.kindId].push(item) : this.staffsInfo[item.kindId] = [];
        })
      })
    },
    //批量添加 员工
    addBatch() {
      this.$store.dispatch('post', {
        uri: 'workerKindRef/addBatch',
        data: {
          factoryId: this.factoryId,
          kindId: this.formStaff.kindId,
          workIds: this.formStaff.addIds
        }
      }).then(res => {

      })
    },
    //批量删除 员工
    removeBatch() {
      this.$store.dispatch('post', {
        uri: 'workerKindRef/worker/delete',
        data: {
          factoryId: this.factoryId,
          kindId: this.formStaff.kindId,
          workIds: this.formStaff.deleteIds
        }
      }).then(res => {

      })
    },
    //编辑工位员工资料
    editStaffInfo() {
      this.allStaffInfo.forEach(item => {
        this.$set(item, 'checked', false);
        this.staffsInfo[this.formStaff.kindId].forEach(val => {
          if (val.workId == item.id) {
            item.checked = true;
          } else if (val.id == item.id) {
            item.checked = true;
          }
        })
      })
      this.beforeSubStaff = JSON.parse(JSON.stringify(this.allStaffInfo));
      this.editStaff = true;
    },
    // 编辑员工前相关操作
    getStaffId(id) {
      this.formStaff.kindId = id;
      this.editStaffInfo();
      this.editStaff = true;
    },
    // 提交工位员工编辑
    subFormStaff() {
      let addList = [], removeList = [];
      this.beforeSubStaff.forEach((item, index) => {
        if (item.checked) {
          if (!this.allStaffInfo[index].checked) {
            removeList.push(item.id)
          }
        } else {
          if (this.allStaffInfo[index].checked) {
            addList.push(item.id)
          }
        }
      })
      this.formStaff.addIds = addList.join(',');
      this.formStaff.deleteIds = removeList.join(',');
      if (this.formStaff.addIds) {
        this.addBatch();
      }
      if (this.formStaff.deleteIds) {
        this.removeBatch();
      }
      let us = [];
      this.allStaffInfo.forEach(item => {
        if (item.checked) {
          us.push(item);
        }
      })
      this.staffsInfo[this.formStaff.kindId] = JSON.parse(JSON.stringify(us));
      this.closeFormStaff();
    },
    // 取消工位员工编辑
    closeFormStaff() {
      this.editStaff = false;
    },
  },
  components: {
    navs,
    stationItem
  }
}
</script>
<style lang="less" scoped>
.next {
  padding: 2px 0;
  color: #13ce66;
  .icon-next {
    position: relative;
    &:after {
      position: absolute;
      top: -4px;
      left: 50%;
      margin-left: -4px;
      width: 8px;
      height: 15px;
      content: '';
      background-color: #13ce66;
    }
  }
}

.addstation {
  padding: 20px 10px;
  background-color: #062a50;
}

.alert-box {
  position: fixed;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .4);
}


.staffs {
  width: 820px;
  background-color: #fff;
  width: 100%;
  max-height: 400px;
  margin: 0 auto;
  overflow-y: auto;
  padding-left: 20px;
}
@media screen and (max-width:1366px) {
  .staffs{
    max-height: 260px;
  }
}
.staff-item {
  width: 90px;
  cursor: pointer;
  margin: 20px 10px 0;
  .user-logo {
    margin: 0 auto;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
    }
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      line-height: 80px;
      display: none;
      background-color: rgba(0, 0, 0, .1);
      .el-icon-check {
        color: #fff;
      }
    }
  }
  .name {
    margin-top: 5px;
    line-height: 28px;
    display: inline-block;
    padding: 0 15px;
    border-radius: 14px;
    border: 1px solid transparent;
    max-width: 90px;
  }
  &.selected {
    .name {
      background-color: #d5e5ff;
      border-color: #20a0ff;
      color: #20a0ff;
    }
    .mask {
      display: block;
    }
  }
}
</style>
