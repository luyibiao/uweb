<style>
.contentdiv {
  margin-top: 30px;
  background-color: #f7f7f7;
  width: 400px;
  border: 1px solid #e5e5e5;
  font-size: 12px;
}
font{
  font-size: 12px;
}
.classform {
  margin-left: 10px;
  margin-right: 10px;
}

.search_input {
  width: 280px;
}
.addres_styl{
  border:1px solid #e5e5e5; 
  border-radius:5px; 
  width:400px;
  position: relative;
  min-height:40px;
  font-size:12px;
}
</style>

<template>
  <div>
    <el-row>
      <el-col :lg="10"
              :md="10">

        <div class="search">
          <el-input v-model="search.keywords"
                    :maxlength="32"
                    placeholder="请输入手机号/会员卡号"
                    class="search_input">
          </el-input>
          <el-button @click="onSearch"
                     type="primary"
                     :loading="btnStatu.searchStatu">搜索</el-button>
          <div v-show="search.tipShow"
               class="text-danger">{{search.tipMsg}}</div>
        </div>

        <!-- ruleFormUser-->
        <div class="contentdiv"
             v-show="ruleFormUser.show">
          <div class="classform">
            <el-form :label-position="labelPosition"
                     label-width="80px"
                     :model="ruleFormUser"
                     ref="ruleFormUser"
                     style="padding-top:30px;padding-bottom:30px;padding-right:10px;">
              <el-form-item label="手机号"
                            prop="phone"
                            :rules="[
						{ required: true, message: '请填写手机号'},
						{ min: 11, max: 11, message: '请输入手机号格式错误', trigger: 'blur'},
             { validator: checkPhone, message: '请输入正确的手机号', trigger: 'blur' }
					]">
                <el-input v-model="ruleFormUser.phone"
                          placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="姓名"
                            prop="name"
                            :rules="[
						{ required: true, message: '姓名不能为空'},
					]">
                <el-input v-model="ruleFormUser.name"
                          placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="性别"
                            prop="sex">

                <template>
                  <el-radio-group v-model="ruleFormUser.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
              <el-form-item label="出生日期">
                <el-date-picker v-model="ruleFormUser.birthday"
                                type="date"
                                placeholder="选择日期"
                                :editable=false>
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="save('ruleFormUser')"
                           :loading="btnStatu.userStatu">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- ruleFormUser-->

        <!-- UserInfo-->
        <div class="contentdiv"
             v-show="ruleFormOrder.show"
             style="text-align:left">
          <div class="clearfix"
               style="height:60px;margin:10px;">
            <span class="pull-left"><img class="thumb"
                   :src="UserInfo.headimgPath || '/static/img/user/def.png' "
                   alt=""
                   style="width:60px;" /></span>
            <span class="pull-left"
                  style="margin-left:20px;">
              <p>
                {{UserInfo.name}}
              </p>
              <p class="text-muted">微信昵称：{{UserInfo.nickname}}</p>
              <p>
                <router-link class="text-primary"
                             :to="'/client/list/'+UserInfo.id+'/basic'"
                             target="_blank">{{UserInfo.phone}}</router-link>
              </P>
            </span>
          </div>
          <p class="text-muted"
             style="margin-left:15px;">余额：
            <span class="text-danger">￥{{UserInfo.balance| amtFormat}}</span>
          </p>
          <p class="text-muted"
             style="margin-left:15px; margin-top:10px;">会员卡号：
            <span style="color:black;">{{UserInfo.cardNo}}</span>
          </p>
          <p style="margin-left:15px; margin-top:10px;"
             class="text-muted"
             v-if="UserInfo.grouper && UserInfo.grouper.groupCardName">团卡：
            <span color="red">{{UserInfo.grouper.groupCardName}}</span>
          </p>
          <p style="margin-left:15px; margin-top:10px;"
             class="text-muted">等级：
            <span style="color:black">{{UserInfo.cardName}}</span>
          </p>
          <p style="margin-left:15px; margin-top:10px;"
             class="text-muted">分组：
            <span style="color:black">{{UserInfo.groupName}}</span>
          </p>
          <p style="margin-left:15px; margin-top:10px;"
             class="text-muted">性别：
            <span v-if="UserInfo.sex===0"
                  style="color:black">未知</span>
            <span v-else-if="UserInfo.sex===1"
                  style="color:black">男</span>
            <span v-else-if="UserInfo.sex===2"
                  style="color:black">女</span>
          </p>
          <p style="margin-left:15px; margin-top:10px;"
             class="text-muted">积分：
            <span style="color:black">{{UserInfo.point}}</span>
          </p>
          <p style="margin-left:15px; margin-top:10px;margin-bottom:10px;">标签：
            <font>
              <el-tag class="m-r-sm m-b-xs "
                      type="primary"
                      :key="tag.relId"
                      v-for="tag in UserInfo.labelList">
                {{tag.name}}
              </el-tag>
            </font>
          </p>
        </div>
        <!-- UserInfo-->
      </el-col>

      <el-col :lg="13"
              :md="13"
              v-show="ruleFormOrder.show">
        <el-form :label-position="ruleFormPosition"
                 label-width="100px"
                 :model="ruleFormOrder"
                 ref="ruleFormOrder">
          <el-form-item prop="project"
                        label="经营项目：">
            <div>
              <template>
                <el-checkbox-group v-model="pageParams.business">
                  <el-checkbox v-for="item in pageParams.businessList"
                               :label="item.id"
                               :key="item.id">{{item.name}}</el-checkbox>

                </el-checkbox-group>
              </template>
            </div>
          </el-form-item>
          <el-form-item prop="takeMode"
                        label="取件方式：">
            <span style="margin-right:30px;">上门取件</span>
            <span>
              <font>取件员：</font>
              <template>
                <el-select v-model="ruleFormOrder.takeWorkId"
                           placeholder="请选择:"
                           @change="takeWorkId">
                  <el-option v-for="item in pageParams.workList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: left; color: #8492a6; font-size: 13px"
                          v-if="item.phone">({{ item.phone }})</span>
                  </el-option>
                </el-select>
              </template>
            </span>
          </el-form-item>
          <el-form-item prop="takeDate"
                        label="取件时间：">
            <el-date-picker v-model="ruleFormOrder.takeDate"
                            type="date"
                            placeholder="选择日期时间"
                            :editable=false
                            :picker-options="takeDateOptions"
                            @change="getTakeTimeList">
            </el-date-picker>
            <template>
              <el-select v-model="ruleFormOrder.takeTimeId"
                         placeholder="请选择"
                         @change="onTakeTime">
                <el-option v-for="item in takeTimeList"
                           :key="item.id"
                           :label="item.startEndTime"
                           :value="item.id"
                           :disabled="item.disabled">
                  <span>{{item.timeStart}}-{{item.timeEnd}}</span>
                </el-option>
              </el-select>
            </template>

          </el-form-item>
          <el-form-item prop="takeAddrId"
                        label="取件地址：">
            <div class="addres_styl">
              <span v-if="ruleFormOrder.takeAddres"
                    style="display:inline-block;width:350px;">
                <span>{{ruleFormOrder.takeUserPhone || ""}}</span>
                <span>{{ruleFormOrder.takeUserName || ""}}</span>
                <p style="margin-right:30px;">{{ruleFormOrder.takeAddres}}</p>
              </span>
              <el-button type="text"
                         style="position:absolute;right:0;top:0"
                         @click="onSelectAddr(1)">新增地址</el-button>
            </div>

          </el-form-item>
          <el-form-item label="客户备注：">
            <el-input type="textarea"
                      :rows="3"
                      placeholder="请输入客户备注"
                      v-model="ruleFormOrder.userRemark"
                      style="width:350px;">
            </el-input>
          </el-form-item>
          <el-form-item label="管理备注：">
            <el-input type="textarea"
                      :rows="3"
                      placeholder="请输入管理备注,仅自己可见"
                      v-model="ruleFormOrder.remark"
                      style="width:350px;">
            </el-input>
          </el-form-item>
          <el-form-item prop="sendMode"
                        label="送件方式：">
            <span style="margin-right:30px;">送件上门</span>
            <span>
              <font>送件员：</font>
              <template>
                <el-select v-model="ruleFormOrder.sendWorkId"
                           placeholder="请选择">
                  <el-option v-for="item in pageParams.workList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: left; color: #8492a6; font-size: 13px"
                          v-if="item.phone">({{ item.phone }})</span>
                  </el-option>
                </el-select>
              </template>
            </span>
          </el-form-item>
          <el-form-item label="快慢：">
            <el-radio-group v-model="ruleFormOrder.priority">
              <el-radio :label="1">普通</el-radio>
              <el-radio :label="2">加急</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="date"
                        label="送件时间：">
            <el-date-picker v-model="ruleFormOrder.sendDate"
                            type="date"
                            placeholder="选择日期时间"
                            :editable=false
                            :picker-options="takeDateOptions"
                            @change="getSendTimeList">
            </el-date-picker>
            <template>
              <el-select v-model="ruleFormOrder.sendTimeId"
                         placeholder="请选择"
                         @change="onSendTime">
                <el-option v-for="item in sendTimeList"
                           :key="item.id"
                           :label="item.startEndTime"
                           :value="item.id"
                           :disabled="item.disabled">
                  <span>{{item.timeStart}}-{{item.timeEnd}}</span>
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="送件地址："
                        prop="sendAddrId">
            <div class="addres_styl"
                 @click="onSelectAddr(2)">
              <span v-if="ruleFormOrder.takeAddres"
                    style="display:inline-block;width:350px;">
                <span>{{ruleFormOrder.sendUserPhone || ""}}</span>
                <span>{{ruleFormOrder.sendUserName || ""}}</span>
                <p>{{ruleFormOrder.sendAddres}}</p>
              </span>
            </div>
          </el-form-item>
          <el-form-item>
            <template>
              <el-button type="primary"
                         @click="onsubOrder('ruleFormOrder')"
                         :loading="btnStatu.orderStatu">提交订单</el-button>
            </template>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--取件地址弹出框-->
    <el-dialog :title="dialog_title"
               :visible.sync="dialogAddr.visible"
               size="small"
               center>
      <el-table :data="pageParams.userAddresList"
                class="ukao-el-table"
                ref="dialogTableData.list"
                max-height="450">
        <el-table-column>
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
            <span>{{scope.row.name}}</span>
            <p>{{scope.row.regionalDesc}}{{scope.row.detail}}</p>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-radio-group v-model="dialogAddr.selectId"
                            :max="1"
                            style="float:right;"
                            @change="addressChange">
              <el-radio :label="scope.row.id"
                        :key="scope.row.id">&nbsp;</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogAddr.visible=false">取消</el-button>
        <el-button type="primary"
                   @click="dialogAddrConfirm">确定</el-button>
        <el-button type="success"
                   @click="onAddAddres">添加地址</el-button>
      </div>

    </el-dialog>

    <el-dialog title="添加地址"
               :visible.sync="dialogAddr.innerDialog.innerVisible"
               size="small">
      <mapAdd :paramsObj="mapObj.params"
              :callback="mapCallbackFn"
              :callbackCancel="callbackCancel"></mapAdd>
    </el-dialog>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import consts from "@/utils/consts";
import base from "@/utils/helpers/base";
import auth from "@/utils/auth";
import validate from "@/utils/helpers/validate";
import time from "@/utils/helpers/timeLite";
import mapAdd from "@/components/Map/QMap/Search";
export default {
  data: function() {
    return {
      show: true,
      ruleFormPosition: "right",
      labelPosition: "right",
      findbtnstatu: false,
      dialog_title:'',
      mapObj: {
        params: {
          userId: "",
          name: "",
          phone: "",
          sex: "0"
        }
      },
      search: {
        keywords: "",
        tipShow: false,
        tipMsg: ""
      },
      btnStatu: {
        userStatu: false,
        searchStatu: false,
        orderStatu: false
      },
      pageParams: {
        business: [],
        businessList: [],
        workList: [],
        userAddresList: []
      },
      ruleFormUser: {
        show: false,
        phone: "",
        name: "",
        birthday: "",
        sex: 1
      },
      ruleFormOrder: {
        show: false,
        userId: "",
        storeId: "",
        takeAddrId: "",
        takeWorkId: "",
        takeMode: "2", //取件方式
        takeDate: "",
        takeTimeStart: "",
        takeTimeEnd: "",
        takeTimeId: "",
        sendAddrId: "",
        sendWorkId: "",
        sendMode: "2",
        sendDate: "",
        sendTimeStart: "",
        sendTimeEnd: "",
        sendTimeId: "",
        business: [], // [{id:id;name:name}]
        userRemark: "",
        remark: "",
        priority: 1,
        mode: "1",
        takeAddres: "",
        takeAddresIdchange: "",
        sendAddres: ""
      },
      UserInfo: {
        id: "",
        headimgPath: "",
        name: "",
        nickname: "",
        phone: "",
        balance: "",
        card: "",
        grouper: {},
        grade: "",
        group: "",
        sex: "",
        integral: "",
        label: "",
        labelList: []
      },
      dialogAddr: {
        //控制选择地址弹出层
        visible: false,
        type: "1", //1选择取件地址 2选择送件地址
        selectId: "",
        innerDialog: {
          innerVisible: false
        }
      },
      takeDateOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() - 8.64e7 ||
            time.getTime() > Date.now() + 15 * 24 * 60 * 60 * 1000
          );
        }
      },
      takeTimeList: [], //取件时间段列表
      sendTimeList: [], //送件时间段列表
      timer: null
    };
  },
  created() {},
  methods: {
    // 保存用户地址回调函数
    mapCallbackFn(obj) {
      this.dialogAddr.innerDialog.innerVisible = false;
      this.userAddress(this.UserInfo.id);
    },
    callbackCancel(){
			this.dialogAddr.innerDialog.innerVisible=false
		},
    onSearch() {
      this.search.tipShow = false;
      if (
        this.search.keywords
      ) {
        this.btnStatu.searchStatu = true;
        this.$store
          .dispatch("post", {
            uri: "userInfo/queryByKey",
            data: {
              key: this.search.keywords
            }
          })
          .then(res => {
            this.btnStatu.searchStatu = false;
            var data = res.data.data;
            if (!data || !data.user) {
              this.ruleFormOrder.show = false;
              this.ruleFormUser.show = true;
              if (validate.tel(this.search.keywords)) {
                this.ruleFormUser.phone = this.search.keywords;
              }
              this.search.keywords = "";
            } else {
              this.ruleFormOrderClear();
              this.ruleFormUser.show = false;
              this.ruleFormOrder.show = true;
              this.UserInfo = res.data.data.user;
              this.UserInfo.grouper = res.data.data.groupCard || {};
              this.UserInfo.labelList = res.data.data.tagList || [];
              this.ruleFormOrder.userId = this.UserInfo.id;
              this.userAddress(this.UserInfo.id);
              this.getmercBusiness();
              this.getworkList();
              this.search.keywords = "";

              //初始化添加地址参数
              this.mapObj.params.userId = this.UserInfo.id;
              this.mapObj.params.name = this.UserInfo.name || "";
              this.mapObj.params.phone = this.UserInfo.phone || "";
              this.mapObj.params.sex = this.UserInfo.sex || "0";
            }
          });
      } else {
        this.search.tipShow = true;
        this.search.tipMsg = "请输入手机号/会员卡号";
      }
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnStatu.userStatu = true;
          this.ruleFormUser.birthday = this.ruleFormUser.birthday
            ? time.getDate(this.ruleFormUser.birthday)
            : "";
          this.$store
            .dispatch("post", {
              uri: "userInfo/add",
              data: {
                name: this.ruleFormUser.name,
                phone: this.ruleFormUser.phone,
                sex: this.ruleFormUser.sex,
                birthday: this.ruleFormUser.birthday
              }
            })
            .then(res => {
              this.search.keywords = this.ruleFormUser.phone;
              this.onSearch();
              this.ruleFormUser.show = false;
              this.ruleFormOrder.show = true;
              msg.success();
              this.search.keywords = "";
              this.btnStatu.userStatu = false;
              (this.ruleFormUser.name = ""),
                (this.ruleFormUser.phone = ""),
                (this.ruleFormUser.birthday = "");
            });
        }
      });
    },
    onSelectAddr(type) {
      this.dialogAddr.visible = true;
      this.dialogAddr.type = type;
      if(type===1){
        this.dialog_title='取件地址'
      }
      else{
        this.dialog_title='送件地址'
      }
    },
    dialogAddrConfirm() {
      let _this = this;
      let userAddresList = this.pageParams.userAddresList || [];
      for (var i = 0, len = userAddresList.length; i < len; i++) {
        var item = userAddresList[i];
        if (_this.dialogAddr.type === 1) {
          //取件地址
          if (item.id === this.dialogAddr.selectId) {
            _this.initUserDefAddress(item);
          }
        } else {
          // 送件地址
          if (item.id === this.dialogAddr.selectId) {
            _this.ruleFormOrder.sendAddrId = item.id;
            _this.ruleFormOrder.sendAddres = item.regionalDesc + item.detail;
            _this.ruleFormOrder.sendUserName = item.name;
            _this.ruleFormOrder.sendUserPhone = item.phone;
          }
        }
      }
      this.dialogAddr.visible = false;
    },
    onAddAddres() {
      this.dialogAddr.innerDialog.innerVisible = true;
      this.dialogAddr.visible = false;
    },
    onTakeTime(val) {
      let timeArr = this.takeTimeList;
      let _this = this;
      timeArr.forEach(function(item) {
        if (val === item.id) {
          _this.ruleFormOrder.takeTimeStart = item.timeStart;
          _this.ruleFormOrder.takeTimeEnd = item.timeEnd;
        }
      });
    },
    onSendTime(val) {
      let timeArr = this.sendTimeList;
      let _this = this;
      timeArr.forEach(function(item) {
        if (val === item.id) {
          _this.ruleFormOrder.sendTimeStart = item.timeStart;
          _this.ruleFormOrder.sendTimeEnd = item.timeEnd;
        }
      });
    },
    onsubOrder(formName) {
      var saveFormOrder = this.ruleFormOrder;
      var businessList = this.pageParams.business || [];
      if (businessList.length > 0) {
        var tmpBusList = [];
        for (var i = 0, len = businessList.length; i < len; i++) {
          var id = businessList[i];
          var item = this.getBusinessItem(id);
          tmpBusList.push({ id: item.id, name: item.name });
        }
        saveFormOrder.business = JSON.stringify(tmpBusList);
      }
      saveFormOrder.takeDate = saveFormOrder.takeDate
        ? time.getDate(saveFormOrder.takeDate)
        : "";
      saveFormOrder.sendDate = saveFormOrder.sendDate
        ? time.getDate(saveFormOrder.sendDate)
        : "";

      if (saveFormOrder.sendDate && saveFormOrder.takeDate) {
        if (saveFormOrder.sendDate < saveFormOrder.takeDate) {
          msg.error("送件日期不能小于取件日期");
          return ;
        } else if (saveFormOrder.sendDate == saveFormOrder.takeDate) {
          if (saveFormOrder.sendTimeEnd < saveFormOrder.takeTimeEnd) {
            msg.error("送件时间不能小于取件时间");
            return ;
          }
        }
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnStatu.orderStatu = true;
          this.$store
            .dispatch("post", {
              uri: "orderInfo/add",
              data: saveFormOrder,
              forceResolve: true
            })
            .then(res => {
              if (res.data.httpCode == 200) {
                msg.success();
                this.btnStatu.orderStatu = false;
                this.$router.push({
                  path: "/order/list/all"
                });
              } else {
                msg.error(res.data.msg);
                this.btnStatu.orderStatu = false;
              }
            });
        }
      });
    },
    ruleFormOrderClear() {
      this.ruleFormOrder.userId = "";
      this.ruleFormOrder.takeDate = "";
      this.ruleFormOrder.takeTimeStart = "";
      this.ruleFormOrder.takeTimeEnd = "";
      this.ruleFormOrder.takeAddrId = "";
      this.ruleFormOrder.takeWorkId = "";
      this.ruleFormOrder.sendDate = "";
      this.ruleFormOrder.sendTimeStart = "";
      this.ruleFormOrder.sendTimeEnd = "";
      this.ruleFormOrder.sendAddrId = "";
      this.ruleFormOrder.sendWorkId = "";
      this.ruleFormOrder.userRemark = "";
      this.ruleFormOrder.remark = "";
      this.ruleFormOrder.takeUserName = "";
      this.ruleFormOrder.takeUserPhone = "";
      this.ruleFormOrder.takeAddres = "";
      this.ruleFormOrder.sendAddres = "";
      this.ruleFormOrder.sendUserName = "";
      this.ruleFormOrder.sendUserPhone = "";
    },
    addressChange(val) {
      this.ruleFormOrder.takeAddresIdchange = val;
    },
    takeWorkId() {
      this.ruleFormOrder.sendWorkId = this.ruleFormOrder.takeWorkId;
    },
    getTakeTimeList(val) {

      let isNow = time.getDate(val) == time.getDate(new Date());

      return this.$store
        .dispatch("get", {
          uri: "serviceTime/take/list"
        })
        .then(res => {
          this.takeTimeList = res.data.data || [];
          this.takeTimeList.forEach(function(item) {
            item.startEndTime = item.timeStart + "-" + item.timeEnd;
            if (
              isNow &&
              item.timeEnd.substr(0, 2) <=
                time.getTime(res.data.timestamp).substr(0, 2)
            ) {
              item.disabled = true;
            }
          });
        });
    },
    getSendTimeList(val) {

      let isNow = time.getDate(val) == time.getDate(new Date());

      return this.$store
        .dispatch("get", {
          uri: "serviceTime/send/list"
        })
        .then(res => {
          this.sendTimeList = res.data.data || [];
          this.sendTimeList.forEach(function(item) {
            item.startEndTime = item.timeStart + "-" + item.timeEnd;
            if (
              isNow &&
              item.timeEnd.substr(0, 2) <=
                time.getTime(res.data.timestamp).substr(0, 2)
            ) {
              item.disabled = true;
            }
          });
        });
    },
    getmercBusiness() {
      this.$store
        .dispatch("post", {
          uri: "mercBusiness/business/list"
        })
        .then(res => {
          this.pageParams.businessList = res.data.data || [];
        });
    },
    getBusinessItem(bussId) {
      var tmpItem = null;
      this.pageParams.businessList.forEach(function(item) {
        if (item.id == bussId) {
          return (tmpItem = item);
        }
      });
      return tmpItem;
    },
    userAddress(userId) {
      if (!userId) {
        return;
      }
      this.$store
        .dispatch("post", {
          uri: "userAddress/list",
          data: {
            userId: userId
          }
        })
        .then(res => {
          this.pageParams.userAddresList = res.data.data.list || [];
          let userAddreds = this.pageParams.userAddresList;
          let _this = this;
          if (userAddreds && userAddreds.length > 0) {
            var item = userAddreds[0];
            this.initUserDefAddress(item);
            _this.dialogAddr.selectId = item.id;
          }
        });
    },
    initUserDefAddress(item) {
      this.ruleFormOrder.takeAddrId = item.id;
      this.ruleFormOrder.sendAddrId = item.id;
      this.ruleFormOrder.takeUserName = item.name;
      this.ruleFormOrder.takeUserPhone = item.phone;
      this.ruleFormOrder.takeAddres = item.regionalDesc + item.detail;
      this.ruleFormOrder.sendAddres = item.regionalDesc + item.detail;
      this.ruleFormOrder.sendUserName = item.name;
      this.ruleFormOrder.sendUserPhone = item.phone;
    },
    getworkList() {
      let _this = this;
      _this.$store
        .dispatch("post", {
          uri: "workerInfo/takeAndSend/list",
          data: {}
        })
        .then(res => {
          _this.pageParams.workList = res.data.data;
        });
    },
    checkPhone(rule, value, callback) {
      if (!validate.tel(value)) {
        callback(new Error());
      } else {
        callback();
      }
    }
  },
  components: {
    mapAdd
  }
};
</script>

