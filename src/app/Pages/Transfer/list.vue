<template>
<div>
  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
      <div class="pull-right">
        <el-input class="w-lg" placeholder="请输入名称，编号" v-model="keywords">
          <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
        </el-input>
        <el-button type="primary" @click="dialogVisible=true">新建中转站</el-button>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :lg="24" :md="24">
      <el-table class="ukao-el-table" :data="tableData" v-loading="tableLoading">
        <el-table-column label="中转站名称">
          <template slot-scope="scope">
            <router-link :to="'./transfer/detail?id='+scope.row.id" class="text-primary">{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="code"></el-table-column>
        <el-table-column label="城市">
          <template slot-scope="scope">
            <p>{{scope.row.cityName ? scope.row.cityName : ''}}</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <p>{{scope.row.createTime | getDate}}</p>
            <p>{{scope.row.createTime | getTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <p :class="{'text-success':scope.row.status,'text-danger':!scope.row.status}">{{scope.row.status ? '已启用' : '已停用'}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="详情">
          <template slot-scope="scope">
            <router-link>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pull-right" style="margin-top:20px;">
        <el-pagination :current-page.sync="pagination.current"
                         :page-size="pagination.size"
                         layout="total, prev, pager, next"
                         :total="pagination.total"
                         @current-change="nextPage">
        </el-pagination>
      </div>
    </el-col>
  </el-row>

  <el-dialog title="新建中转站" :visible.sync="dialogVisible">
    <div class="add-div">
      <el-form :model="ruleFrom" label-width="110px" ref="ruleFrom">
        <el-form-item label="中转站名称" :rules="[{required:true,message:'请输入名称',trigger:'blur'}]" prop="name">
          <el-input placeholder="请输入名称" v-model="ruleFrom.name" class="r-lg"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" :rules="[{required:true,message:'地区不能为空'}]" :prop="ruleFrom.addresName">
          <el-select v-model="ruleFrom.province" class="e-lg" @change="province">
            <el-option v-for="item in provinceList" :key="item.value" :value="item.value" :label="item.label" ></el-option>
          </el-select>
          <el-select v-model="ruleFrom.city" class="e-lg" v-show="status.cityFlag" @change="city">
            <el-option v-for="item in cityList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
          <el-select v-model="ruleFrom.area" class="e-lg" v-show="status.areaFlag" @change="selectAddres(ruleFrom.area,areaList)">
            <el-option v-for="item in areaList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="ruleFrom.addresDesc" class="r-lg" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <div class="footter">
          <el-form-item>
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit('ruleFrom')">保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </el-dialog>
</div>  
</template>
<script>
import consts from "@/utils/consts";
import regional from '@/utils/regional'
import msg from "@/utils/msg";
export default {
  data () {
    return {
      keywords:'',
      tableData:[],
      tableLoading:false,
      dialogVisible:false,
      ruleFrom:{
        name:'',
        province:'',
        city:'',
        area:'',
        addresDesc:'',
        regionalId:'',
        addresName:'area'
      },
      provinceList:[],
      cityList:[],
      areaList:[],
      status:{
        cityFlag:false,
        areaFlag:false
      },
       pagination: {
      //分页信息
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
    }
  },
  created () {
    this.initParams();
    this.getList();
    this.init();
  },
  watch: {
    $route() {
        // 新建单位触发的修改不请求数据
        this.getList();
        //this.initParams();
      }
  },
  methods:{
    init(){
      this.provinceList=regional.getProvince();
    },
    submit(formName){
      if(!this.ruleFrom.province){
        this.ruleFrom.addresName=''
      }
      let _this=this
       this.$refs[formName].validate(valid => {
        if (valid) {
           this.$store.dispatch('post',{
             uri:'transferInfo/add',
             data:{
               name:_this.ruleFrom.name,
               regionalDesc:_this.regionalDesc,
               addrDesc:_this.ruleFrom.addresDesc,
               regionalId:_this.regionalId
             }
           }).then(res=>{
             msg.success();
             _this.dialogVisible=false;
             _this.getList();
             _this.reseltData();
           })
        }
      });
    },
    reseltData(){
      for(let i in this.ruleFrom){
        this.ruleFrom[i]=''
      }
    },
    province(val){
      if(this.currentProvine && val!==this.currentProvine){
        this.ruleFrom.city="";
        this.ruleFrom.area=""
        this.currStr=""
      }
      if(!this.status.cityFlag){
        this.status.cityFlag=true;
      }
      // this.ruleFrom.addresName='city'
      this.cityList=regional.getCity(val);
      this.currentProvine=val;
      let _this=this
      this.provinceList.forEach(function(item){
        if(item.value===val){
          _this.strProvince=item.label
        }
      })
      this.regionalDesc=this.strProvince
      // this.selectAddres(val,this.provinceList)
    },
    city(val){
      let Arr=this.cityList;
      let parentId;
      let _this=this;
      Arr.forEach(function(item){
        if(item.value===val){
          parentId=item.parentId;
          _this.strCity=item.label
        }
      })
      this.regionalDesc=this.strProvince+this.strCity;
      if(this.currentCity && this.currentCity!==val){
        this.ruleFrom.area=""
      }     
      if(!this.status.areaFlag){
         this.status.areaFlag=!this.status.areaFlag;
      }
      this.areaList=regional.getArea(parentId,val);
      if(this.areaList.length===0){
        this.status.areaFlag=!this.status.areaFlag;
        this.ruleFrom.addresName='city'
      }
      if(this.areaList.length>0){
        this.ruleFrom.addresName='area'
      }
      this.currentCity=val;
      // this.selectAddres(val,this.cityList)
    },
    selectAddres(val,Arr){
      let _this=this
      for(let i=0;i<Arr.length;i++){
        if(val===Arr[i].value){
          _this.strArea=Arr[i].label;
          _this.regionalId=Arr[i].value
          break;
        }
      }
      this.regionalDesc=this.strProvince+this.strCity+this.strArea;
    },
    getList(){
    this.tableLoading=true;
    this.$store.dispatch('post',{
      uri:"transferInfo/list",
      data:{
       keywords:this.keywords,
      },
      params: {
        startRow: (this.pagination.current - 1) * this.pagination.size,
        pageSize: this.pagination.size
      }
    }).then(res=>{
      this.tableLoading=false;
      this.pagination.total = res.data.data.total;
      this.tableData=res.data.data.list;
    })
  },
    cancel(){
      this.dialogVisible=false;
      // this.ruleFrom={};
      // this.ruleFrom.addresName='area'
    },
    initParams() {
    this.markNo = this.$route.params.markNo;
    //初始化分页数据
    if (this.$route.query.current) {
      this.pagination.current = parseInt(this.$route.query.current) || 1;
    }
  },
  updateUrl() {
  this.$router.push({
    path: this.$route.path,
    query: {
      current: this.pagination.current
    }
  });
},
  nextPage() {
      // 新建单位触发的分页修改不执行
      this.updateUrl();
    },
  }  
}
</script>
<style scoped>
.footter{
  margin-bottom: 40px;
}
.w-lg{
  width: 250px;
}
.r-lg{
  width: 61%;
}
.e-lg{
  width: 20%;
}
</style>

