<template>
  <div v-loading="loading">
    <div>
      <el-breadcrumb class="link-back"
                     separator="/">
        <el-breadcrumb-item to="/store/list">
          <i class="el-icon-arrow-left icon-smaller"></i>门店列表</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="m-t-lg ukao-v-loading">
      <!--<p class="title text-black">门店详情</p>-->
      <div class="ukao-tb-default">
        <table class="ukao-table"
               style="width: 100%">
          <tbody>
            <tr>
              <td style="width: 30%; color:#000;">门店详情</td>
              <td></td>
              <td style="width: 20%">
                <auth perm="store.list.update" v-if="parseInt(deleteFlag)>=0">
                  <el-button type="danger"
                           @click="deleteInfo">删除</el-button>
                </auth>
              </td>
            </tr>
            <tr>
              <td style="width: 30%">门店名称</td>
              <td>{{storeInfo.name}}
                <a class="text-primary m-l"
                   v-show="enableInitProduct"
                   @click="initProduct()">初始化产品数据</a>
              </td>
              <td style="width: 20%">
                <auth perm="store.list.update">
                  <el-button @click="update('name', '门店名称', 1)">修改</el-button>
                </auth>
              </td>
            </tr>
            <tr>
              <td>编号</td>
              <td>{{storeInfo.code}}</td>
              <td></td>
            </tr>
            <tr>
              <td>门店标记</td>
              <td>{{storeInfo.mark}}</td>
              <td>
                <auth perm="store.list.update">
                  <el-button @click="update('mark', '门店标记', 1)">修改</el-button>
                </auth>
              </td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>{{storeInfo.createTimeText}}</td>
              <td></td>
            </tr>
            <tr>
              <td>地址</td>
              <td>{{storeInfo.regionalDesc}} {{storeInfo.addrDesc}}</td>
              <td>
                <auth perm="store.list.update">
                  <el-button @click="update('regionalId', '门店地址', 1)">修改</el-button>
                </auth>
              </td>
            </tr>
            <tr>
              <td>服务电话</td>
              <td>{{storeInfo.tel}}</td>
              <td>
                <auth perm="store.list.update">
                  <el-button @click="update('tel', '服务电话', 1)">修改</el-button>
                </auth>
              </td>
            </tr>
            <tr>
              <td>坐标（经度，纬度）</td>
              <td>
                {{storeInfo.longitude || '-'}}, {{storeInfo.latitude || '-'}}
                <a class="text-primary m-l"
                   target="_blank"
                   href="https://lbs.qq.com/tool/getpoint/">拾取坐标</a>
              </td>
              <td>
                <auth perm="store.list.update">
                  <el-button @click="update('coordinate', '门店坐标', 1)">修改</el-button>
                </auth>
              </td>
            </tr>
            <tr>
              <td>状态</td>
              <td>{{storeInfo.statusText}}</td>
              <td>
                <auth perm="store.list.update">
                  <el-switch v-model="storeInfo.statusVal"
                           active-color="#13ce66"
                           inactive-color="#dcdcdc"
                           :width="74"
                           on-text="已启用"
                           off-text="未启用"
                           @change="updateStoreStatus">
                  </el-switch>
                </auth>
              </td>
            </tr>
            <tr>
              <td>门店属性</td>
              <td>
                <p v-if="storeInfo.type===1">实体店</p>
                <p v-else-if="storeInfo.type===2">虚体店</p>
              </td>
              <td>
                <auth perm="store.list.update">
                  <el-button @click="update('type', '门店属性', 1)">修改</el-button>
                </auth>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="m-t-lg">
      <p class="title text-black">管理信息</p>
      <div class="ukao-tb-default">
        <table class="ukao-table b-t"
               style="width: 100%">
          <tbody>
            <tr>
              <td style="width: 30%">店长登录账号</td>
              <td>{{manager.account}}</td>
              <td style="width: 20%">
                <auth perm="store.list.update">
                  <el-button @click="update('account', '店长登录账号', 3)">修改</el-button>
                </auth>
              </td>
            </tr>
            <tr>
              <td>店长登录密码</td>
              <td>******</td>
              <td>
                <auth perm="store.list.update">
                  <el-button @click="update('pwd', '店长登录密码', 2)">修改</el-button>
                </auth>
              </td>
            </tr>
            <tr>
              <td>状态</td>
              <td>{{manager.statusText}}</td>
              <td>
                <auth perm="store.list.update">
                  <el-switch v-model="manager.statusVal"
                           active-color="#13ce66"
                           inactive-color="#dcdcdc"
                           :width="74"
                           on-text="已启用"
                           off-text="未启用"
                           @change="updateManagerStatus">
                  </el-switch>
                </auth>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="m-t-lg">
      <p class="title text-black">
        <span v-if="!cashier.exis">安卓一体收银机信息</span>
        <span v-if="cashier.exis">已绑定安卓一体收银机（{{cashier.cnt}}台）</span>
        <auth perm="store.list.update">
          <a class="m-l-xl text-primary"
           href="javascript:void(0)">
            <el-button type="text"
                     @click.native="bindingCashier">绑定安卓一体收银机</el-button>
          </a>
        </auth>
      </p>
      <div class="ukao-tb-default">
        <table class="ukao-table b-t"
               style="width: 100%">
          <tbody>
            <tr v-if="!cashier.exis">
              <td style="text-align: center">还未绑定安卓一体收银机</td>
            </tr>
            <tr v-for="(item,index) in cashier.list"
                :key="index">
              <td style="width: 30%" class="td-text-color">
                <p>序列号：{{item.serialNum}}</p>
                <p style="margin-top:5px;">验证码：{{item.actCode}}</p>
              </td>
              <td>
                <div v-if="item.monitor" class="machine-icon-size">
                  <img v-if="item.monitor == 'T2lite'" src="/static/img/machine/T2little.png" />
                  <img v-else-if="item.monitor && item.monitor.substring(0,1) == 'T'" src="/static/img/machine/T.png"/>
                  <img v-else="" src="/static/img/machine/L1.png"/>
                  {{ item.monitor}}<span>{{'(V'+item.bizVersion+')'}}</span>
                </div>
              </td>
              <td style="width: 20%">
                <p :class="item.isVerify ? 'text-success' : 'text-danger'"> {{item.isVerify?"已验证":"未验证"}}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="m-t-lg">
      <!--<p class="title text-black" style="max-width: 1000px">-->
        <!--<span v-if="clientList.length == 0">客户端信息</span>-->
        <!--<span v-if="clientList.length > 0">已绑定客户端（{{clientList.length}}个）</span>-->
        <!--<auth perm="store.list.update">-->
          <!--<a class="m-l-xl text-primary"-->
           <!--href="javascript:void(0)">-->
            <!--<el-button type="text"-->
                     <!--@click="toBindingClient">绑定客户端</el-button>-->
          <!--</a>-->
        <!--</auth>-->

        <!--<span class="pull-right">下载</span>-->

      <!--</p>-->
      <div class="ukao-tb-default">
        <table class="ukao-table "
               style="width: 100%">
          <tbody>
          <tr>
            <td style="width: 50%;border-bottom:none;padding: 5px 18px;" class="td-text-color ft-size-span">
              <span v-if="clientList.length == 0">电脑PC客户端信息</span>
              <span v-if="clientList.length > 0">已绑定电脑PC客户端（{{clientList.length}}个）</span>
              <auth perm="store.list.update">
                <a class="m-l-xl text-primary"
                   href="javascript:void(0)">
                  <el-button type="text"
                             @click="toBindingClient">绑定电脑PC客户端</el-button>
                </a>
              </auth>
            </td>
            <td style="border-bottom:none"></td>
            <td style="width: 20%;border-bottom:none" class="text-primary">
              <a href="http://cdnpos.twash.cn/twashPos_installV1.68.exe" download="" >下载电脑PC客户端</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="ukao-tb-default">
        <table class="ukao-table b-t"
               style="width: 100%">
          <tbody>
            <tr v-if="clientList.length == 0">
              <td style="text-align: center">还未绑定电脑PC客户端</td>
            </tr>
            <tr v-for="(item,index) in clientList"
                :key="index">
              <td style="width: 30%" class="td-text-color">
                <p>序列号：{{item.serialNum}}</p>
                <p style="margin-top:5px;">验证码：{{item.actCode}}</p>
              </td>
              <td>
                <div v-if="item.version != null" class="machine-icon-size">
                  <img  src="/static/img/machine/PC.png" class=""/>
                  PC<span>{{'(V'+item.version+')'}}</span>
                </div>

              </td>
              <td style="width: 20%">
                 <p :class="item.isVerify ? 'text-success' : 'text-danger'"> {{item.isVerify? "已验证":"未验证"}}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 修改基本信息 -->
    <el-dialog class="ukao-dialog"
               :title="dialog.title"
               :visible.sync="dialog.visible"
               size="small">
      <div>
        <el-form :model="ruleForm"
                 ref="ruleForm"
                 label-width="150px">
          <el-form-item label="门店名称"
                        v-if="dialog.attr ==='name'"
                        prop="name"
                        :rules="[
							{ required: true, message: '名称不能为空'},
							{ min: 1, max: 25, message: '长度在1到25位', trigger: 'blur' }
						]">
            <div class="w-lg">
              <el-input v-model="ruleForm.name"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="门店标记"
                        v-if="dialog.attr ==='mark'"
                        prop="mark"
                        :rules="[
							{ required: true, message: '标记不能为空'},
							{ min: 1, max: 3, message: '长度在1到3位', trigger: 'blur' }
						]">
            <div class="w-lg">
              <el-input v-model="ruleForm.mark" type="number"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="店长登录密码"
                        v-if="dialog.attr ==='pwd'"
                        prop="pwd"
                        :rules="[
							{ required: true, message: '密码不能为空'},
							{ validator: validatePass, min: 6, max: 16, message: '请输入6至16位长度密码', trigger: 'blur' }
						]">
            <div class="w-lg">
              <el-input v-model="ruleForm.pwd"
                        type="password"
                        auto-complete="off"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="确定密码"
                        v-if="dialog.attr ==='pwd'"
                        prop="pwd1"
                        :rules="[
							{ required: true, message: '确定密码不能为空'},
							{ validator: validatePass2, min: 6, max: 16,  trigger: 'blur' }
						]">
            <div class="w-lg">
              <el-input v-model="ruleForm.pwd1"
                        type="password"
                        auto-complete="off"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="纬度"
                        v-if="dialog.attr ==='coordinate'">
            <div class="w-lg">
              <el-input v-model="ruleForm.latitude"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="经度"
                        v-if="dialog.attr ==='coordinate'">
            <div class="w-lg">
              <el-input v-model="ruleForm.longitude"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="地址"
                        v-if="dialog.attr ==='regionalId'"
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
          <el-form-item label="详细地址"
                        v-if="dialog.attr ==='regionalId'">
            <div class="w-xl dis-inline m-r-sm">
              <el-input v-model="ruleForm.addrDesc"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="服务电话"
                        v-if="dialog.attr ==='tel'">
            <div class="w-xl dis-inline m-r-sm">
              <el-input v-model="ruleForm.tel"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="店长登录账号"
                        v-if="dialog.attr ==='account'"
                        prop="account"
                        :rules="[
						{ required: true, message: '店长登录账号不能为空'},
						{ min: 3, max: 15, message: '长度在3到15个长度', trigger: 'blur' }
				]">
            <div class="dis-inline w-md">
              <el-input v-model="ruleForm.account"
                        placeholder="请输入门店店长登录账号">
                <template slot="append">{{ruleForm.symbol}}</template>
              </el-input>
            </div>
          </el-form-item>

          <el-form-item label="门店属性"
                        v-if="dialog.attr==='type'"
                        prop="type"
                        :rules="[
						{ required: true, message: '门店不能为空'},
				]">
            <div>
              <template>
                <el-select v-model="ruleForm.type">
                  <el-option label="实体店"
                             value="1"></el-option>
                  <el-option label="虚体店"
                             value="2"></el-option>
                </el-select>
              </template>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button @click="dialog.visible=false">取消</el-button>
            <el-button type="primary"
                       @click="submitForm('ruleForm')"
                       v-if="dialog.act === 1">保存</el-button>
            <el-button type="primary"
                       @click="updatePwd('ruleForm')"
                       v-if="dialog.act === 2">保存</el-button>
            <el-button type="primary"
                       @click="updateWorkerAccount('ruleForm')"
                       v-if="dialog.act === 3">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- end-->

    <!-- 绑定收银机-->
    <el-dialog class="ukao-dialog"
               :visible.sync="binding.dialogVisible"
               size="small">
      <div class="text-center ukao-v-loading"
           v-loading="binding.loading">
        <div class="dis-inline w-xxl b-a bg-cash">
          <div class="m-t-md">
            <img class="cash-register-img v-top"
                 src="/static/img/pos.png"
                 alt="">
          </div>
          <div>
            <div class="text-center text-black m-t m-b">绑定安卓一体收银机</div>
            <div class="padder-md">
              <el-form :model="ruleFormBinding"
                       ref="ruleFormBinding"
                       label-width="65px">
                <el-form-item label="序列号"
                              prop="serialNum"
                              :rules="[
												{ required: true, message: '序列号不能为空'},
												{ min: 6, max: 12, message: '无效的序列号', trigger: 'blur' }]">
                  <el-input v-model="ruleFormBinding.serialNum"
                            placeholder="请输入序列号"></el-input>
                </el-form-item>
                <el-form-item label="验证码"
                              prop="actCode"
                              :rules="[
												{ required: true, message: '验证码不能为空'},
												{ min: 6, max: 16, message: '无效的验证码', trigger: 'blur' }]">
                  <el-input v-model="ruleFormBinding.actCode"
                            placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item class="text-left">
                  <p class="text-muted text-xs">安卓一体绑定序列号，验证成功后，不支持修改</p>
                  <el-button @click="binding.dialogVisible=false">关闭</el-button>
                  <el-button type="primary"
                             :loading="binding.btn.loading"
                             @click="submitFormBinding('ruleFormBinding')">激活并绑定</el-button>
                  <div class="text-right">
                    <a class="text-primary"
                       target="_blank"
                       :href="portals_url">还没有，去购买</a>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- end-->

    <!-- 绑定客户端-->
    <el-dialog class="ukao-dialog"
               :visible.sync="clientDialog.show"
               size="small">
      <div class="text-center ukao-v-loading">
        <div class="dis-inline w-xxl b-a bg-cash">
          <div>
            <div class="text-center text-black m-t m-b">绑定电脑PC客户端</div>
            <div class="padder-md">
              <el-form :model="clientForm"
                       ref="clientForm"
                       label-width="65px">
                <el-form-item label="序列号"
                              prop="serialNum"
                              :rules="[
												{ required: true, message: '序列号不能为空'},
												{ min: 6, max: 16, message: '无效的序列号', trigger: 'blur' }]">
                  <el-input v-model="clientForm.serialNum"
                            placeholder="请输入序列号"></el-input>
                </el-form-item>
                <el-form-item label="验证码"
                              prop="actCode"
                              :rules="[
												{ required: true, message: '验证码不能为空'},
												{ min: 6, max: 16, message: '无效的验证码', trigger: 'blur' }]">
                  <el-input v-model="clientForm.actCode"
                            placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item class="text-left">
                  <el-button @click="clientDialog.show=false">关闭</el-button>
                  <el-button type="primary"
                             :loading="clientDialog.btn.loading"
                             @click="submitClientForm('clientForm')">激活并绑定</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- end-->
  </div>
</template>

<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";
import md5 from "@/utils/md5";
import validate from "@/utils/helpers/validate";
import regional from "@/utils/regional";
import auth from "@/utils/auth";
import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";

export default {
  components: { ElButton },
  data: function() {
    return {
      deleteFlag:'',
      protype: "",
      loading: true,
      dialog: {
        title: "",
        attr: "",
        visible: false
      },
      portals_url: consts.PORTALS_URL,
      formTitle: "编辑",
      storeInfo: {
        id: this.$route.params.id
      },
      manager: {},
      cashier: {
        //设备
        exis: false,
        cnt: 0, //数量
        list: []
      },
      clientList: [],
      options: [], //选择地区列表
      ruleForm: {
        id: this.$route.params.id,
        mark: "",
        name: "",
        workId: "",
        pwd: "",
        pwd1: "",
        regionalId: "",
        regionalDesc: "",
        addrDesc: "",
        longitude: "",
        latitude: "",
        tel: "",
        symbol: "",
        accountId: "",
        account: "",
        selectedOptions: [], //默认选择省市区
        type: ""
      },

      mercInfo: {},
      binding: {
        dialogVisible: false,
        loading: false,
        act: 1,
        btn: {
          loading: false
        }
      },
      clientDialog: {
        show: false,
        btn: {
          loading: false
        }
      },
      clientForm: {
        storeId: "",
        serialNum: "",
        actCode: ""
      },
      ruleFormBinding: {
        storeId: "",
        serialNum: "",
        actCode: ""
      },
      initTmpProduct: false,
      enableInitProduct: false
    };
  },
  created() {
    this.info();
    this.getRegional();
    this.queryClientList();
    this.enableInit();
  },
  methods: {
    info() {
      this.mercInfo = auth.getMercInfo();

      this.$store
        .dispatch("post", {
          uri: "storeInfo/detail",
          data: {
            id: this.storeInfo.id
          }
        })
        .then(res => {
          this.deleteFlag=res.data.deleteFlag;
          var data = res.data.data;
          var cashierList = res.data.expList || [];
          this.cashier = {
            exis: cashierList && cashierList.length > 0 ? true : false,
            cnt: cashierList ? cashierList.length : 0,
            list: cashierList
          };
          if (data) {
            this.storeInfo = data;
            let sData = this.statusTrans(data.status);
            this.storeInfo.statusVal = sData.val;
            this.storeInfo.statusText = sData.text;
            this.storeInfo.createTimeText = time.getDateTime(data.createTime);
            let manager = res.data.manager;
            let account = "";

            if (manager) {
              this.manager = manager;
              sData = this.statusTrans(manager.status);
              this.manager.statusVal = sData.val;
              this.manager.statusText = sData.text;
              account = manager.account.replace(this.mercInfo.symbol, "");
            }
            let regId = data.regionalId;

            this.ruleForm = {
              id: data.id,
              mark: data.mark,
              name: data.name,
              workId: data.workId,
              longitude: data.longitude,
              latitude: data.latitude,
              accountId: manager.id,
              account: account,
              regionalId: data.regionalId,
              regionalDesc: data.regionalDesc,
              addrDesc: data.addrDesc,
              tel: data.tel,
              symbol: this.mercInfo.symbol,
              selectedOptions: [
                regional.getProvinceId(regId),
                regional.getCityId(regId),
                regId
              ]
            };
            this.loading = false;
          }
        });
    },
    queryClientList() {
      this.$store
        .dispatch("post", {
          uri: "clientAct/queryLess",
          data: {
            storeId: this.storeInfo.id
          }
        })
        .then(res => {
          this.clientList = res.data.data;
        });
    },
    enableInit() {
      this.$store
        .dispatch("post", {
          uri: "tmpProductInfo/enableInit"
        })
        .then(res => {
          this.enableInitProduct = res.data.data == 1;
        });
    },
    initProduct() {
      var _this = this;
      msg.confirm({
        msg: "确认初始化系统预设产品数据?",
        confirmFn: function() {
          _this.$store
            .dispatch("post", {
              uri: "tmpProductInfo/initProduct",
              data: {
                storeId: _this.storeInfo.id
              }
            })
            .then(res => {
              msg.success();
              _this.enableInitProduct = false;
            });
        }
      });
    },
    getRegional() {
      this.options = regional.all();
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
    updateStoreStatus() {
      this.$store
        .dispatch("post", {
          uri: this.storeInfo.status ? "storeInfo/disable" : "storeInfo/enable",
          data: {
            id: this.storeInfo.id
          }
        })
        .then(res => {
          msg.success();
          this.info();
        });
    },
    updateManagerStatus() {
      this.$store
        .dispatch("post", {
          uri: this.manager.status
            ? "workerAccount/disable"
            : "workerAccount/enable",
          data: {
            id: this.manager.id
          }
        })
        .then(res => {
          msg.success();
          this.info();
        });
    },
    statusTrans(status) {
      return {
        val: !!status,
        text: status ? "已启用" : "已停用"
      };
    },
    deleteInfo() {
      let _this = this;
      msg.confirm({
        msg: "确认删除?",
        confirmFn: function() {
          _this.$store
            .dispatch("post", {
              uri: "storeInfo/delete",
              data: {
                id: _this.storeInfo.id
              }
            })
            .then(res => {
              msg.success();
              _this.$router.replace("/store/list");
            });
        }
      });
    },
    update(attr, title, act) {
      this.dialog.title = "修改" + title;
      this.dialog.attr = attr;
      this.dialog.act = act;
      this.dialog.visible = true;
      console.log(attr + "这是什么鬼");
    },
    updateWorkerAccount(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("post", {
              uri: "workerAccount/updateWkAccount",
              data: this.ruleForm
            })
            .then(res => {
              this.dialog.visible = false;
              msg.success();
              this.info();
            });
        } else {
          return false;
        }
      });
    },
    bindingCashier() {
      this.binding.btn.loading = false;
      this.binding.dialogVisible = true;
    },
    toBindingClient() {
      this.clientDialog.btn.loading = false;
      this.clientDialog.show = true;
    },
    submitFormBinding(formName) {
      //激活并绑定
      this.ruleFormBinding.storeId = this.storeInfo.id;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.binding.btn.loading = true;
          this.$store
            .dispatch("post", {
              uri: "cashierMachineInfo/actBinding",
              data: this.ruleFormBinding,
              forceResolve: true
            })
            .then(res => {
              if (!res || res.data.httpCode != 200) {
                msg.error(res.data.msg || consts.ERROR_MSG);
                this.binding.btn.loading = false;
              } else {
                this.binding.dialogVisible = false;
                msg.success("设备激活并绑定成功");
                //清除参数
                this.ruleFormBinding = {
                  storeId: "",
                  serialNum: "",
                  actCode: ""
                };
                this.info();
              }
            });
        } else {
          return false;
        }
      });
    },
    submitClientForm(formName) {
      //激活并绑定
      this.clientForm.storeId = this.storeInfo.id;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.clientDialog.btn.loading = true;
          this.$store
            .dispatch("post", {
              uri: "clientAct/binding",
              data: this.clientForm,
              forceResolve: true
            })
            .then(res => {
              if (!res || res.data.httpCode != 200) {
                msg.error(res.data.msg || consts.ERROR_MSG);
                this.clientDialog.btn.loading = false;
              } else {
                this.clientDialog.show = false;
                msg.success("电脑PC客户端激活并绑定成功");
                //清除参数
                this.clientForm = {
                  storeId: "",
                  serialNum: "",
                  actCode: ""
                };
                this.queryClientList();
              }
            });
        } else {
          return false;
        }
      });
    },
    unbindClient(item) {
      //解绑
      let _this = this;
      msg.confirm({
        msg: "此操作将解除电脑PC客户端绑定该门店, 是否继续?",
        confirmFn: function() {
          _this.$store
            .dispatch("post", {
              uri: "clientAct/unbind",
              data: {
                id: item.id
              }
            })
            .then(res => {
              msg.success("电脑PC客户端解绑成功");
              _this.queryClientList();
            });
        }
      });
    },
    unbind(item) {
      //解绑
      let _this = this;
      msg.confirm({
        msg: "此操作将解除安卓一体收银机绑定该门店, 是否继续?",
        confirmFn: function() {
          _this.$store
            .dispatch("post", {
              uri: "cashierMachineInfo/unbind",
              data: {
                id: item.id
              }
            })
            .then(res => {
              msg.success("设备解绑成功");
              _this.info();
            });
        }
      });
    },
    submitForm(formName) {
      console.log(this.ruleForm.type, "这是Ada");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("post", {
              uri: "storeInfo/update",
              data: this.ruleForm
            })
            .then(res => {
              this.dialog.visible = false;
              this.dialog.attr = "";
              msg.success();
              this.info();
            });
        } else {
          return false;
        }
      });
    },
    updatePwd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.ruleForm.pwd == "" ||
            md5.hex_md5(this.ruleForm.pwd) !== md5.hex_md5(this.ruleForm.pwd1)
          ) {
            msg.error("2次密码不一致");
            return;
          }
          this.$store
            .dispatch("post", {
              uri: "workerAccount/updateWkPwd",
              data: {
                workId: this.storeInfo.workId,
                password: md5.hex_md5(this.ruleForm.pwd)
              }
            })
            .then(res => {
              this.dialog.visible = false;
              msg.success();
              this.info();
            });
        }
      });
    },
    validatePass(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.pwd.length < 6 || this.ruleForm.pwd.length > 16) {
          callback(new Error("请输入6至16位长度密码"));
        } else {
          this.$refs.ruleForm.validateField("pwd1");
        }
        callback();
      }
    },
    validatePass2(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    }
  }
};
</script>

<style scoped>
.title {
  margin: 5px 18px;
}
.cash-register-img {
  max-width: 100%;
  height: auto;
}
.bg-cash {
  background: #f7f7f7;
}
.td-text-color{
  color: #000 !important;
}
  .machine-icon-size > img{
    width: 20px;
  }
.ft-size-span span{
  font-size: 14px;
}
</style>