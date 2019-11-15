<template>
<div>
  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
      <el-breadcrumb class="link-back"
                     separator="/">
        <el-breadcrumb-item to="/transfer">
          <i class="el-icon-arrow-left icon-smaller"></i>中转站列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{detail.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>

  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
      <div class="table-d">
        <table>
          <tr>
            <th>中转站详情</th>
            <td></td>
            <td>
              <span><el-button type="danger" size="small" @click="deletefn">删除</el-button></span>
            </td>
          </tr>
          <tr>
            <td>中转站名称</td>
            <td>{{detail.name}}</td>
            <td>
              <span><el-button size="small" @click="updataBtn('name')">修改</el-button></span>
            </td>
          </tr>
          <tr>
            <td>编号</td>
            <td>{{detail.code}}</td>
            <td></td>
          </tr>
          <tr>
            <td>创建时间</td>
            <td>{{detail.createTime | getDate}} {{detail.createTime | getTime}}</td>
            <td></td>
          </tr>
          <tr>
            <td>地址</td>
            <td>{{detail.regionalDesc}}{{detail.addrDesc}}</td>
            <td><span><el-button size="small" @click="updataBtn('regionalId')">修改</el-button></span></td>
          </tr>
          <tr>
            <td>状态</td>
            <td><p :class="{'text-success':status,'text-danger':!status}">{{status ? '已启用' : '已停用'}}</p></td>
            <td class="td-switch">
              <span>
                <el-button size="small">
                    <el-switch
                    style="display: block"
                    v-model="status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="已启用"
                    inactive-text="已停用"
                    @change="enable(2)">
                  </el-switch>
                </el-button>
              </span>
            </td>
          </tr>
        </table>
      </div>
    </el-col>
  </el-row>

  <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="35%">
    <el-form :model="ruleForm" label-width="110px" ref="ruleForm">
      <el-form-item label="中转站名称" :rules="[{required:true,message:'请输入中转站名称',trigger:'blur'}]" v-if="update && updataName==='name'" prop="name">
        <el-input v-model="ruleForm.name" class="w-lg"></el-input>
      </el-form-item>
      <el-form-item label="地址"
                        v-if="update && updataName==='regionalId'"
                        prop="regionalId"
                        :rules="[
			    	{ required: true, message: '所在省市区不能为空'}
				  ]"
                        required>
            <div class="dis-inline w-xl">
              <el-cascader v-model="ruleForm.selectedOptions"
                           placeholder="请选择/搜索"
                           :options="options"
                           filterable
                           :clearable="false"
                           @change="selected"></el-cascader>
            </div>
      </el-form-item>
       <el-form-item label="详细地址" v-if="update && updataName==='regionalId'">
            <div style="width:217px">
              <el-input v-model="ruleForm.addrDesc"></el-input>
            </div>
          </el-form-item>
      <el-form-item>
        <el-button @click="dialog.visible=false">取消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>  
</template>
<script>
import msg from '@/utils/msg'
import regional from "@/utils/regional";
export default {
  data () {
    return {
      status:'',
      update:false,
      updataName:'',
      detail:{},
      dialog:{
        title:'修改',
        visible:false,
      },
       options: [], //选择地区列表:
      ruleForm:{
        id:this.$route.query.id,
        name:'',
        regionalId:'',
        selectedOptions:[],
        regionalDesc:'',
        addrDesc:''
      }
    }
  },
  watch: {
    'dialog.visible':{
      handler(){
        if(!this.dialog.visible){
          this.update=false;
        }
      }
    }
  },
  created () {
    this.getDetail();
    this.getRegional();
  },
  methods: {
    getDetail(){
      this.$store.dispatch('post',{
        uri:"transferInfo/detail",
        data:{
          id:this.$route.query.id
        }
      }).then(res=>{
         this.status=res.data.data.status ? true : false
         this.detail=res.data.data;
         this.init()
      })
    },
    init(){
      let regId = this.detail.regionalId;
      this.ruleForm={
        name:this.detail.name,
        regionalId: this.detail.regionalId,
        regionalDesc: this.detail.regionalDesc,
        selectedOptions:[
          regional.getProvinceId(regId),
          regional.getCityId(regId),
          regId
        ]
      }
      this.ruleForm.addrDesc=this.detail.addrDesc
    },
    submit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj={
              id:this.$route.query.id,
              name:this.ruleForm.name,
              regionalDesc:this.ruleForm.regionalDesc,
              addrDesc:this.ruleForm.addrDesc,
            }
            this.$store.dispatch('post', {
              uri: 'transferInfo/update',
              data: obj
            }).then((res) => {
              msg.success();
              this.dialog.visible=false;
              this.getDetail();
            })
          }
      })
    },
    deletefn(){
       let _this=this
        msg.confirm({
          msg: "确认删除?",
          confirmFn: function() {
            _this.$store
              .dispatch("post", {
                uri: "transferInfo/update",
                data:{
                    id:_this.$route.query.id,
                    status:-1 
                  }
              })
              .then(res => {
                msg.success();
                _this.getDetail();
                _this.$router.push({path:'../transfer'})
              });
          }
      });
    },
    enable(){
      this.$store.dispatch('post',{
        uri:'transferInfo/update',
        data:{
          id:this.$route.query.id,
          status:this.status ? 1 : 0
        }
      }).then(res=>{
        msg.success();
        this.getDetail();
      })
    },
    selected(val) {
      if (val.length == 3) {
        this.ruleForm.regionalId = val[2];
        let province = regional.getProvince(val[0]);
        let city = regional.getCity(val[0], val[1]);
        let area = regional.getArea(val[0], val[1], val[2]);
        this.ruleForm.regionalDesc =
          province[0].label + city[0].label + area[0].label;
      }
    },
    getRegional(){
      this.options = regional.all();
    },
    updataBtn(item){
      this.ruleForm
      this.updataName=item;
      this.update=true;
      this.dialog.visible=true
    }, 
  } 
}
</script>

<style scoped>
.table-d{
  margin-top: 30px;
  width: 70%;
}
.table-d table{
  width: 100%;
  /* min-width: 980px;
  max-width: 1200px; */
}
.table-d table tr{
  border-bottom: 1px solid #e5e5e5;
  height: 55px;
}
.table-d table tr +tr>:first-child{
  color: #9c9c9c;
}
.table-d table tr td{
  width: 33%;
}
th{
  text-align: left;
}
.table-d table tr>:last-child{
  text-align: center;
  /* background-color: pink; */
}
.table-d table tr>:last-child span{
  margin-left: 70px;
}
.td-switch .el-button{
  border: none;
  background: rgba(0, 0, 0,0);
}
.w-lg{
  width: 270px;
}
</style>
