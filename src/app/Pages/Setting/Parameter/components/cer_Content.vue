<style scoped>
.description {
  width: 300px;
  display: inline-block;
  padding: 15px 20px;
  border-radius: 8px;
  background: #f3f7ff;
}
.cercontentdiv{
  position: relative;
  width: 311px;
}
.spanfirst{
  position: absolute;
  left: 15px;
  bottom: 42px;
}

.spanfirst_code{
  position: absolute;
  right: 20px;
  bottom: 20px;
  text-align:right;
}

.spantwo_long{
  position: absolute;
  left: 20px;
  bottom: 15px;
}

.spantwo{
  position: absolute;
  right: 20px;
  bottom: 10px;
}
.spanthree_long{
  position: absolute;
  right: 20px;
  bottom: 15px;
}

.spanthree{
  position: absolute;
  left: 15px;
  bottom: 10px;
}
.table{
  margin-top: 25px;
}
.table tr td{
  vertical-align: top;
}
.table tr td:first-child{
  width: 400px
}
.certConfig h4{
  margin-bottom: 5px;
}
.certConfig+.certConfig{
  margin-top: 30px;
}

.center {
     display: -webkit-flex;
     -webkit-justify-content: center;
     -webkit-align-items: center;
    }
</style>
<template>
  <div>
    <!-- <div class="m-t">
        <p class="description m-b-md text-danger">此操作为工厂合格证设置</p>
    </div> -->
    <el-row style="margin-top:30px;">
      <el-col :lg="10"
              :md="10">
        <div>
          <v-tab-nav v-bind:tab-nav-list="tabsNavList"
                     v-bind:onClick="onClickTab"  ref="vtab"></v-tab-nav>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :lg="24"
              :md="24"
              >
        <table class="table">
          <tr>
            <td>
              <div class="cercontentdiv"
                 v-if="cercontentflag===1">
                <span><img :src="'/static/img/setprint/cermodel.png'" alt="" /></span>
                <span class="spanfirst">
                  <h3 v-if="nameRadio===1">张三三</h3>
                  <h3 v-if="phoneRadio===1">131****1234</h3>
                  <div></div>
                </span>
                <span class="spanfirst_code">
                  <div  v-if="codeRadio == 0" ><img src="/static/img/setprint/bar_code.png"/> </div>
                  <div v-else="" ><img  src="/static/img/setprint/QR_code.png"  /> </div>
                  <div style="font-size: 16px">1020800499815</div>
                </span>
              </div>
              <div class="cercontentdiv"
                  v-else-if="cercontentflag===2">
                <span><img :src="'/static/img/setprint/cermodel.png'" alt="" /></span>
                <span class="spantwo_long">
                  <img src="/static/img/setprint/long_bar_code.png">
                  <span style="font-size: 5px;line-height:0.1" class="center">{{tmpStoreCode}}</span>
                </span>
                <span class="spantwo">
                  <div>
                    <h3 v-if="nameRadio===1">张三三</h3>
                    <h3 v-if="phoneRadio===1" style="margin-top: -3px;">131****1234</h3>
                  </div>

                  <div style="margin-top: -3px;" v-if="codeRadio == 0">
                    <div><img src="/static/img/setprint/short_bar_code.png"/></div>
                    <div style="font-size: 16px; margin-top: -5px;">1020800499815</div>
                  </div>
                  <div style="margin-top: -3px;" class="center" v-else="">
                    <span style="font-size: 16px;" class="center">1020800499815</span>
                    <span style="margin-top: -5px;"><img src="/static/img/setprint/short_QR_code.png"/></span>
                  </div>
                </span>
              </div>
              <div class="cercontentdiv" v-else-if="cercontentflag===3">
                <span><img :src="'/static/img/setprint/cermodel.png'" alt="" /></span>
                <span class="spanthree">
                  <div>
                     <h3 v-if="nameRadio===1">张三三</h3>
                     <h3 v-if="phoneRadio===1" style="margin-top: -5px;">131****1234</h3>
                  </div>
                  <div  v-if="codeRadio == 0">
                    <div><img src="/static/img/setprint/short_bar_code.png"/></div>
                    <div style="font-size: 16px; margin-top: -5px;">1020800499815</div>
                  </div>
                  <div class="center" v-else="">
                    <span><img src="/static/img/setprint/short_QR_code.png"/></span>
                    <span style="font-size: 16px; " class="center">1020800499815</span>
                  </div>
                </span>
                <span class="spanthree_long">
                  <img src="/static/img/setprint/long_bar_code.png">
                  <span style="font-size: 5px;line-height:0.1" class="center">{{tmpStoreCode}}</span>
                </span>
              </div>
              <div v-if="prompt===true" class="text-success m-l-sm m-t-sm">
                <strong v-if="cercontentflag===1">已选择该模板一</strong>
                <strong v-else-if="cercontentflag===2">已选择该模板二</strong>
                <strong v-else-if="cercontentflag===3">已选择该模板三</strong>
              </div>
            </td>
            <td>
               <div>
                  <div class="certConfig">
                    <h4>姓名</h4>
                    <el-radio-group v-model="nameRadio" @change="showBtnfn">
                      <el-radio :label="0" style="width: 100px">隐藏姓名</el-radio>
                      <el-radio :label="1">不隐藏姓名</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="certConfig">
                    <h4>手机号</h4>
                    <el-radio-group v-model="phoneRadio" @change="showBtnfn">
                      <el-radio :label="0"  style="width: 100px">隐藏全部手机号</el-radio>
                      <el-radio :label="1">隐藏中间四位手机号</el-radio>
                    </el-radio-group>
                  </div>
                 <div class="certConfig">
                   <h4>衣物条码</h4>
                   <el-radio-group v-model="codeRadio" @change="showBtnfn">
                     <el-radio :label="0" style="width: 100px">显示条形码</el-radio>
                     <el-radio :label="1">显示二维码</el-radio>
                   </el-radio-group>
                 </div>
                 <div class="certConfig" v-if="cercontentflag!==1">
                   <h4>标识条码</h4>
                   <el-radio-group v-model="cntRadio" @change="onCntChange">
                     <el-radio :label="0" style="width: 100px">不截取</el-radio>
                     <el-radio :label="1">截取衣物条码前<el-input style="width:50px" size="mini" :maxlength="2" @blur="onCntInputChg" :disabled="!cntRadio" v-model="certCnt"></el-input>位</el-radio>
                   </el-radio-group>
                 </div>
                 <div class="certConfig">
                   <auth perm="setting.parameter.print">
                     <el-button type="primary"
                                @click="application"
                                :loading="loading">保存并应用该模板</el-button>
                   </auth>
                 </div>
                </div>
            </td>
          </tr>
        </table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import vTabNav from "../../../Common/tab_nav.vue";
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import printContent from "../components/print_Content";
export default {
  components: {
    vTabNav
  },
  data() {
    return {
      tmpScanCode: '1020800499815',
      tmpStoreCode: '102',
      nameRadio:1,
      phoneRadio:1,
      codeRadio:1,
      cntRadio:0,
      tabsNavList: [{ val: 1, text: "模板一" }, { val: 2, text: "模板二" },{val:3,text:'模板三'}],
      cercontentflag: '',
      certConfig:[],
      btnstatu: false,
      prompt: false, //提示文字,
      id: "",
      certStyle: "",
      certCnt:"",
      loading: false,
      showBtn:false,
    };
  },
  created() {
    this.getContent();
  },
  watch: {
    "certCnt"(val) {
      if (val && val > 0) {
        if (val >= this.tmpScanCode.length) {
          this.tmpStoreCode = this.tmpScanCode;
        } else {
          this.tmpStoreCode = this.tmpScanCode.substring(0, val);
        }
      } else {
        this.tmpStoreCode = this.tmpScanCode.substring(0, 3);
      }
    }
  },
  methods: {
    onClickTab(item) {
      this.cercontentflag = item.val;
      this.btnstan();
    },
    application() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "mercCityParam/updateCertStyle",
          data: {
            certStyle: this.cercontentflag,
            certCnt: this.certCnt,
            certConfig:`${this.nameRadio}${this.phoneRadio}${this.codeRadio}`,
            id: this.id
          }
        })
        .then(res => {
          this.loading = false;
          msg.success();
          this.getContent();
        });
    },
    btnstan() {
      let _this = this;
      if (this.cercontentflag === this.certStyle) {
        _this.btnstatu=true;
        _this.prompt = true;
        _this.nameRadio=parseInt(_this.certConfig[0]);
        _this.phoneRadio=parseInt(_this.certConfig[1]);
        _this.codeRadio=parseInt(_this.certConfig[2]);
      } else {
        _this.btnstatu = false;
        _this.prompt = false;
        _this.nameRadio=1;
        _this.phoneRadio=1;
        _this.codeRadio=0;
      }
    },
    showBtnfn(){
       this.btnstatu=false
    },
    onCntInputChg() {
      if (isNaN(this.certCnt) || (this.certCnt && this.certCnt <=0)) {
        this.certCnt = '';
      }
      this.btnstatu=false;
    },
    onCntChange(val) {
      if (!val || val <= 0) {
        this.certCnt = '';
      }
      this.btnstatu=false;
    },
    getContent() {
      this.$store
        .dispatch("post", {
          uri: "mercCityParam/detail",
          data: {}
        })
        .then(res => {
          this.id = res.data.data.id;
          this.certStyle = res.data.data.certStyle;
          this.certCnt = res.data.data.certCnt;
          if (this.certCnt) {
            this.cntRadio = 1;
          }
          this.cercontentflag=parseInt(res.data.data.certStyle);
          this.$refs.vtab.getIndex(this.cercontentflag);
          this.certConfig=res.data.data.certConfig.split("");
          this.btnstan();
        });
    },
  }
};
</script>
>