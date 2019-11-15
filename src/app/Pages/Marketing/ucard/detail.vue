<style lang="less" scoped>
@media screen and (max-width: 1200px) {
  .ucard-form > .pull-right {
    float: left;
  }
}
.ucard-form {
  max-width: 980px;
}

.title {
  padding: 0 20px;
  line-height: 32px;
  background-color: #f7f7f7;
}
.main-l {
  width: 320px;
}

.main-r {
  margin-left: 380px;
}

.card-details {
  cursor: pointer;
  padding: 30px 0;
  border: 1px solid #7ac5ec;
  background-color: #d3f6ff;
  border-radius: 5px;
  position: relative;
  .edit {
    /*display: none;*/
    position: absolute;
    right: 15px;
    top: 5px;
  }
  /*&:hover {*/
    /*.edit {*/
      /*display: block;*/
    /*}*/
  /*}*/
  .card-num {
    font-size: 32px;
  }
}

.fanchart {
  border: 1px solid #e5e5e5;
  width: 100%;
  height: 245px;
  box-sizing: border-box;
}
</style>

<template>
  <div class="clearfix">
    <!-- 左侧 -->
    <div class="pull-left main-l">
      <!-- 面包屑 -->
      <el-breadcrumb class="l-h36" separator="/">
        <el-breadcrumb-item to="/marketing/ucard/list">
          <i class="el-icon-arrow-left icon-smaller"></i>优付卡</el-breadcrumb-item>
        <el-breadcrumb-item>优付卡详情</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 优付卡信息 -->
      <div class="card-details m-t-lg text-center" >
        <auth perm="marketing.ucard.update">
          <el-button type="text" class="edit" @click="detailForm.show = true">编辑</el-button>
        </auth>
        <el-input 
          class="w-sm m-b-sm"
          v-focus="detailForm.show"
          v-if="detailForm.show"
          v-model.trime="detailForm.name" 
          @blur="updateUcardDetail"
          @keyup.enter.native="updateUcardDetail"></el-input>
        <h3 class="m-b-md" v-else>{{cardMessage.name}}</h3>
        <p class="m-b-md">优付卡</p>
        <p class="m-b-md">创建时间：{{cardMessage.createTime | getDate}} {{cardMessage.createTime | getTime}}</p>
        <p>共<span class="card-num">&nbsp;{{cardMessage.cardCnt}}&nbsp;</span>张</p>
      </div>
      <!-- 金额数据扇形图 -->
      <div class=" m-t-lg">
        <p class="title">优付卡统计</p>
        <div class="fanchart">
          <IEcharts v-if="options.legend.data.length>0" :option="options"></IEcharts>
          <p style="text-align:center;line-height:240px;" v-else>暂无数据</p>
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="main-r of-hide ">
      <!-- 发卡充值 -->
      <auth perm="marketing.ucard.send.card">
        <div class="b-a m-b-md">
        <div class="title b-b">发卡充值</div>
        <el-form class="clearfix wrapper ucard-form" ref="form" label-width="100px" :model="form" :rules="rules">
          <div class="pull-left">
            <el-form-item label="支付比例" prop="payRatio">
              <el-input class="w-sm" v-model="form.payRatio"></el-input>
              <span>%</span>
            </el-form-item>
            <el-form-item label="有效期" required prop="timeEnable">
              <p>
                <el-radio class="radio" v-model="form.timeEnable" :label="0">长期有效</el-radio>
              </p>
              <el-radio class="radio" v-model="form.timeEnable" :label="1">有效期</el-radio>
              <el-date-picker
                v-model="form.times"
                align="right"
                type="daterange"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="使用优惠券" required prop="useCoupon">
              <el-radio-group v-model="form.useCoupon">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">不允许</el-radio>
              </el-radio-group>
              <p class="text-sm text-muted">允许使用优惠券，用户用优付卡付款时可以抵扣优惠券</p>
            </el-form-item>
          </div>
          <div class="pull-right">
            <el-form-item label="金额" prop="money" label-width="60px">
              <el-input placeholder="请输入这张卡的金额" class="w" v-model="form.money"></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="卡号" prop="rfidNo" label-width="60px">
              <el-input placeholder="请输入或扫描卡背面条码" @keyup.enter.native="submit('form',postAddUcard)" class="w" v-model="form.rfidNo"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button>取消</el-button>
              <el-button type="primary" @click="submit('form',postAddUcard)">确定</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      </auth>
      <!-- 搜索发卡 -->
      <div class="clearfix">
        <ul class="pull-left">
          <li class="pull-left m-r-lg">
            <label>优付卡状态：</label>
            <el-select class="thumb-xl" v-model="search.cardStatus" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li class="pull-left">
            <el-input placeholder="输入卡号/手机号" class="w-md" v-model="search.cardNo" @keyup.enter.native="tabHandleClick">
              <el-button slot="append" icon="el-icon-search" @click="tabHandleClick"></el-button>
            </el-input>
          </li>
        </ul>
      </div>

      <div class="m-t-lg">
        <el-tabs v-model="activeName" type="card" @tab-click="tabHandleClick">
          <el-tab-pane label="发卡列表" name="carList">
            <!-- 表格数据 -->
            <el-table class="ukao-el-table" :data="tableList" v-loading="loading" :row-class-name="lightColumn">
              <el-table-column label="卡号" prop="rfidNo"></el-table-column>

              <el-table-column label="支付比例"  width="100">
                <template slot-scope="scope">
                  <div>{{scope.row.payRatio}}%</div>
                </template>
              </el-table-column>

              <el-table-column label="金额（元）">
                <template slot-scope="scope">
                  <div class="text-success font-bold">{{scope.row.balance | amtFormat}}</div>
                </template>
              </el-table-column>

              <el-table-column label="用户" prop="user" min-width="125">
                <template slot-scope="scope">
                  <p v-if="scope.row.userId">
                    <img
                      style="vertical-align: middle;width: 14px; margin-right: 1px"
                      :src="scope.row.grade == 1 ? '/static/img/user/crown_blue.png' :
											scope.row.grade == 2 ? '/static/img/user/crown_yellow.png' :
											scope.row.grade == 3 ? '/static/img/user/crown_purple.png'  : ''"
                      alt=""/>
                    <a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.userName}}</a></p>
                  <p v-if="scope.row.userId"><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.userPhone}}</a></p>
                </template>
              </el-table-column>

              <el-table-column label="使用优惠券" min-width="110">
                <template slot-scope="scope">
                  {{scope.row.useCoupon ? '允许' : '不允许'}}
                </template>
              </el-table-column>

              <el-table-column label="有效期" min-width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.timeEnable == 1">
                    <p>{{scope.row.timeStart | getDate}}</p>至<p>{{scope.row.timeEnd | getDate}}</p>
                  </div>
                  <div v-else>长期有效</div>
                </template>
              </el-table-column>

              <el-table-column label="状态" min-width="80">
                <template slot-scope="scope">
                  <span :class="{'text-success':(scope.row.rfStatus == 1 && (scope.row.userId!=='' || scope.row.userId!==null)) ,'text-danger':scope.row.rfStatus == -1,'text-danger': ( scope.row.rfStatus===1 && (scope.row.userId==='' || scope.row.userId===null))}">
                    {{scope.row.rfStatus | status(scope.row.userId)}}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <auth perm="marketing.ucard.recharge">
                    <el-button type="text" @click="editMoney(scope.row,1)">充值</el-button><span class="m-l-xs m-r-xs">-</span>
                  </auth>
                  <auth perm="marketing.ucard.withhold">
                    <el-button type="text" @click="editMoney(scope.row,0)">扣款</el-button><span class="m-l-xs m-r-xs">-</span>
                  </auth>
                  <auth perm="marketing.ucard.update">
                    <el-button type="text" @click="editUcard(scope.row)">编辑</el-button>
                  </auth>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="text-right m-t-sm" v-if="pagination.total > 0">

              <div class="pull-left">
                <auth perm="marketing.ucard.export">
                  <el-button size="small" @click="exportXls">导出</el-button>
                </auth>
              </div>

              <el-pagination 
                :current-page.sync="pagination.current" 
                :page-size="pagination.size" 
                layout="total, prev, pager, next" 
                :total="pagination.total" 
                @current-change="updateUrl">
              </el-pagination>
            </div>
          </el-tab-pane>
            <!-- 充值记录 -->
          <el-tab-pane label="充值记录" name="carLog">
            <el-table class="ukao-el-table" :data="tableLogList" v-loading="loading">
              <el-table-column label="卡号" prop="rfidNo"></el-table-column>

              <el-table-column label="金额（元）">
                <template slot-scope="scope">
                  <div class="text-success font-bold">{{scope.row.amount | amtFormat}}</div>
                </template>
              </el-table-column>

              <el-table-column label="用户" prop="user">
                <template slot-scope="scope">
                  <p><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.userName}}</a></p>
                  <p><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.userPhone}}</a></p>
                </template>
              </el-table-column>

              <el-table-column label="时间">
                <template slot-scope="scope">
                  <p>{{scope.row.createTime | getDate}}
                   {{scope.row.createTime | getTime}}</p>
                </template>
              </el-table-column>

              <el-table-column label="状态">
                <template slot-scope="scope">
                  <!--<p :class="{ 'text-muted':scope.row.rfStatus == 1 && !scope.row.userName ,'text-danger':scope.row.rfStatus == -1}">{{getCardState(scope.row)}}</p>-->
                  <p class="text-success" v-if="scope.row.status == 1">成功</p>
                  <p class="text-danger" v-if="scope.row.status == 0">失败</p>
                  <p class="text-danger" v-if="scope.row.status == -1">已删除</p>
                </template>
              </el-table-column>

              <el-table-column label="操作人" prop="createName"></el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="text-right m-t-sm" v-if="pagination.logTotal > 0">
              <div class="pull-left">
                <auth perm="marketing.ucard.export">
                  <el-button size="small" @click="exportLogXls">导出</el-button>
                </auth>
              </div>

              <el-pagination 
                :current-page.sync="pagination.logCurrent" 
                :page-size="pagination.size" 
                layout="total, prev, pager, next" 
                :total="pagination.logTotal" 
                @current-change="updateUrl">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog :visible.sync="dialog.show" :title="dialog.title" class="ukao-dialog">
      <!-- 发卡列表编辑 -->
      <el-form  ref="editForm" label-width="100px" :model="editForm" v-if="dialog.type === 3">
        <el-form-item label="卡号">
          <span>{{editForm.rfidNo}}</span>
        </el-form-item>
        <el-form-item label="支付比例" prop="payRatio" :rules="rules.payRatio">
          <el-input class="w-sm" v-model="editForm.payRatio"></el-input>
          <span>%</span>
        </el-form-item>
        <el-form-item label="有效期" required prop="timeEnable" :rules="rules.editTimeEnable">
          <p>
            <el-radio class="radio" v-model="editForm.timeEnable" :label="0">长期有效</el-radio>
          </p>
          <el-radio class="radio" v-model="editForm.timeEnable" :label="1">有效期</el-radio>
          <el-date-picker
            v-model="editForm.times"
            align="right"
            type="daterange"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用优惠券" required prop="useCoupon">
          <el-radio-group v-model="editForm.useCoupon">
            <el-radio :label="1">允许</el-radio>
            <el-radio :label="0">不允许</el-radio>
          </el-radio-group>
          <p class="text-sm text-muted">允许使用优惠券，用户用优付卡付款时可以抵扣优惠券</p>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="w-lg" type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialog.show = false">取消</el-button>
          <el-button type="primary" @click="submit('editForm',postEditUcard)">确定</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="moneyForm" label-width="100px" :model="moneyForm" v-else>
        <el-form-item label="卡号">
          <span>{{moneyForm.rfidNo}}</span>
        </el-form-item>
        <el-form-item label="金额" prop="money" :rules="rules.money">
          <el-input placeholder="请输入金额" class="w" v-model="moneyForm.money"></el-input>
          <span>元</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialog.show = false">取消</el-button>
          <el-button type="primary" @click="submit('moneyForm',postMoneyUpdate)">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import validate from "@/utils/helpers/validate";
import calculation from "@/utils/helpers/calculation";
import timeLite from "@/utils/helpers/timeLite";
import msg from "@/utils/msg";
import IEcharts from "vue-echarts-v3";

export default {
  data() {
    const checkpayRatio = (rule, value, callback) => {
      validate.amount(value, 0, 0, 100)
        ? callback()
        : callback(new Error("请输入0 ~ 100的整数"));
    };
    const checktimeEnable = (time, value, callback) => {
      value === 0
        ? callback()
        : time && time.length ? callback() : callback(new Error("请选择有效期"));
    };
    const checkmoney = (rule, value, callback) => {
      validate.amount(value, 2, 0.01, 9999999)
        ? callback()
        : callback(new Error("金额格式错误"));
    };
    return {
      id: "",
      cardMessage: null, //优付卡卡信息
      loading: false, //加载中
      activeName: "carList", //默认选中页签
      statusOptions: [
        { value: "", label: "全部" },
        { value: "1", label: "已使用" },
        { value: "0", label: "未使用" },
        { value: "-1", label: "已作废" }
      ], //优付卡可选状态
      search: {
        //搜索信息
        cardStatus: "", //状态
        cardNo: "" //卡号
      },
      tableList: [], //表格数据
      tableLogList: [], //表格log数据
      editDetail: false, //编辑优付卡名判断
      // 发卡表单
      form: {
        payRatio: "",
        timeEnable: 0,
        useCoupon: 1,
        rfidNo: "",
        money: "",
        times: []
      },
      // 优付卡改名表单
      detailForm: {
        name: "",
        show: false
      },
      // 金额表单
      moneyForm: {
        money: "",
        rfidNo: "",
        id: ""
      },
      // 编辑表单
      editForm: {
        id: "",
        rfidNo: "",
        payRatio: "",
        useCoupon: 1,
        timeEnable: 0,
        times: [],
        remark: ""
      },
      // 弹窗
      dialog: {
        show: false,
        title: "充值",
        type: 1 //1充值，2扣款，3编辑
      },
      // 表单验证
      rules: {
        payRatio: [
          { required: true, message: "请输入支付比例" },
          {
            validator: checkpayRatio
          }
        ],
        timeEnable: [
          {
            validator: (rule, value, callback) => {
              checktimeEnable(this.form.times, value, callback);
            }
          }
        ],
        editTimeEnable: [
          {
            validator: (rule, value, callback) => {
              checktimeEnable(this.editForm.times, value, callback);
            }
          }
        ],
        money: [
          { required: true, message: "请输入金额" },
          {
            validator: checkmoney
          }
        ],
        rfidNo: [{ required: true, message: "请输入卡号" }]
      },
      //分页信息
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0, //优付卡列表总数
        current: 1, //优付卡列表当前页数
        logTotal: 0, //发卡记录总数
        logCurrent: 1 //发卡记录当前页数
      },
      // 扇形图基础配置
      options: {
        tooltip: {
          trigger: "item",
          formatter: "总数量：{c}张 ({d}%)"
        },
        legend: {
          type:'scroll',
          orient: "vertical",
          x: "left",
          data: []
        },
        color: [
          "#FFB90F",
          "#5A9AEF",
          "#F35650",
          "#5EC97C",
          "#8A2BE2",
          "#FA8072",
          "#FFFF00",
          "#71C671",
          "#008B8B",
          "#00BFFF"
        ],
        series: [
          {
            data: [],
            type: "pie",
            radius: ["40%", "75%"],
            center: ["60%", "50%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ]
      },
      reset: false //发卡充值标识（发卡充值需重置）
    };
  },
  watch: {
    $route() {
      // 发卡充值引起的$route 变化不获取数据
      if (!this.reset) {
        this.initParams();
        this.getTabelData();
      }
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.initParams();
    this.getContent(res=>{ 
      this.form.payRatio = res.data.data.payRatio;
    }); //获取详情
    this.getTabelData(); //获取表格数据
    this.getPieData(); //获取扇形图数据
  },
  methods: {
    // 初始化 tab 搜索 分页 参数
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.activeName = data.activeName == "carList" ? "carList" : "carLog";
        this.search.cardStatus = data.status || "";
        this.search.cardNo = data.keywords || "";
        this.pagination.current = parseInt(data.current) || 1;
        this.pagination.logCurrent = parseInt(data.logCurrent) || 1;
      }
    },

    // 跳转更新url
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          activeName: this.activeName,
          current: this.pagination.current,
          logCurrent: this.pagination.logCurrent,
          keywords: this.search.cardNo,
          status: this.search.cardStatus
        }
      });
    },

    // 获取tabel数据
    getTabelData() {
      return this.activeName === "carLog" ? this.getLogList() : this.getList();
    },

    // tab 切换 搜索
    tabHandleClick() {
      this.activeName == "carList"
        ? (this.pagination.current = 1)
        : (this.pagination.logCurrent = 1);
      this.updateUrl();
    },

    //获取当前优付卡详情
    getContent(fn) {
      this.$store
        .dispatch("get", {
          uri: "ucard/detail",
          params: {
            id: this.id
          }
        })
        .then(res => {
          this.cardMessage = res.data.data;
          fn && fn(res);
        });
    },

    //获取扇形图数据
    getPieData() {
      this.$store
        .dispatch("get", {
          uri: "ucard/report",
          params: {
            groupCardId: this.id
          }
        })
        .then(res => {
          let a = [],
            b = [];
          res.data.data.forEach(item => {
            a.push(calculation.accDiv(item.balance, 100) + "元");
            b.push({
              value: item.cnt,
              name: calculation.accDiv(item.balance, 100) + "元"
            });
          });
          this.options.legend.data = a;
          this.options.series[0].data = b;
        });
    },

    //获取优付卡表格数据
    getList() {
      this.loading = true;
      return this.$store
        .dispatch("get", {
          uri: "ucard/binding/list",
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size || 0,
            pageSize: this.pagination.size,
            keywords: this.search.cardNo,
            status: this.search.cardStatus,
            groupCardId: this.id
          }
        })
        .then(res => {
          this.tableList = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },

    //获取优付卡log表格数据
    getLogList() {
      this.loading = true;
      return this.$store
        .dispatch("get", {
          uri: "groupCardRelLog/list",
          params: {
            startRow:
              (this.pagination.logCurrent - 1) * this.pagination.size || 0,
            pageSize: this.pagination.size,
            keywords: this.search.cardNo,
            status: this.search.cardStatus,
            groupCardId: this.id
          }
        })
        .then(res => {
          this.tableLogList = res.data.data.list;
          this.pagination.logTotal = res.data.data.total;
          this.loading = false;
        });
    },

    // 编辑优付卡
    editUcard(item) {
      this.dialog.type = 3;
      this.dialog.title = "编辑";
      this.dialog.show = true;
      this.editForm.remark = "";
      this.editForm.rfidNo = item.rfidNo;
      this.editForm.id = item.id;
      this.editForm.payRatio = item.payRatio;
      this.editForm.useCoupon = item.useCoupon;
      this.editForm.timeEnable = item.timeEnable;
      if (item.timeEnable) {
        this.editForm.times = [
          timeLite.getDate(item.timeStart),
          timeLite.getDate(item.timeEnd)
        ];
      } else {
        this.editForm.times = [];
      }
    },

    // 编辑金额
    editMoney(item, type) {
      this.dialog.type = type;
      this.dialog.title = type === 1 ? "充值" : "扣款";
      this.dialog.show = true;
      this.moneyForm.rfidNo = item.rfidNo;
      this.moneyForm.id = item.id;
    },

    // 提交新建
    postAddUcard() {
      let timeEnd = "";
      let timeStart = "";
      if (this.form.timeEnable) {
        timeStart = timeLite.getDate(this.form.times[0]);
        timeEnd = timeLite.getDate(this.form.times[1]);
      }
      this.$store
        .dispatch("post", {
          uri: "ucard/setUpCardMoney",
          data: {
            groupCardId: this.id,
            rfidNo: this.form.rfidNo,
            payRatio: this.form.payRatio,
            timeEnable: this.form.timeEnable,
            useCoupon: this.form.useCoupon,
            timeStart: timeStart,
            timeEnd: timeEnd,
            money: calculation.accMul(this.form.money, 100),
            remark: ""
          }
        })
        .then(res => {
          this.reset = true;
          // 重新获取表单数据
          this.form.rfidNo = "";
          this.activeName == "carList"
            ? (this.pagination.current = 1)
            : (this.pagination.logCurrent = 1);
          this.search.cardStatus = "";
          this.search.cardNo = "";
          this.getTabelData().then(_ => {
            this.reset = false;
          });
          this.getContent();
          this.getPieData();
          this.updateUrl();
          msg.success("发卡充值成功");
        });
    },
    // 更新优付卡名称
    updateUcardDetail() {
      if (
        this.detailForm.name &&
        this.detailForm.name != this.cardMessage.name
      ) {
        let len = this.detailForm.name.length;
        if (len >= 2 && len <= 32) {
          this.$store
            .dispatch("post", {
              uri: "ucard/update",
              data: {
                id: this.id,
                name: this.detailForm.name,
                remark: ""
              }
            })
            .then(res => {
              msg.success("修改成功");
              this.cardMessage.name = this.detailForm.name;
              this.detailForm.show = false;
              this.detailForm.name = "";
            });
        } else {
          msg.warning("长度在 2 到 32 个字符");
        }
      } else {
        this.detailForm.show = false;
        this.detailForm.name = "";
      }
    },

    // 提交金额修改(充值，扣款)
    postMoneyUpdate() {
      let uri = this.dialog.type === 1 ? "ucard/recharge" : "ucard/deduction";
      this.$store
        .dispatch("post", {
          uri,
          data: {
            id: this.moneyForm.id,
            money: calculation.accMul(this.moneyForm.money, 100)
          }
        })
        .then(res => {
          this.getTabelData();
          this.getPieData();
          msg.success((this.dialog.type === 1 ? "充值" : "扣款") + "成功");
          this.dialog.show = false;
        });
    },

    // 提交编辑优付卡
    postEditUcard() {
      let timeEnd = "";
      let timeStart = "";
      if (this.editForm.timeEnable) {
        timeStart = timeLite.getDate(this.editForm.times[0]);
        timeEnd = timeLite.getDate(this.editForm.times[1]);
      }
      this.$store
        .dispatch("post", {
          uri: "ucard/updateUCardRule",
          data: {
            id: this.editForm.id,
            payRatio: this.editForm.payRatio,
            useCoupon: this.editForm.useCoupon,
            timeEnable: this.editForm.timeEnable,
            timeStart: timeStart,
            timeEnd: timeEnd,
            remark: ""
          }
        })
        .then(res => {
          msg.success("发卡成功");
          this.getTabelData();
          this.dialog.show = false;
        });
    },

    // 提交
    submit(name, fn) {
      this.$refs[name].validate(valid => {
        if (valid) {
          fn && fn();
        }
      });
    },

    exportXls() {
      window.open(
        consts.BASE_URL +
          "/export/groupCard/ucard/list?id=" +
          this.cardMessage.id
      );
    },

    exportLogXls() {
      window.open(
        consts.BASE_URL +
          "/export/groupCard/ucard/log/list?id=" +
          this.cardMessage.id +
          "&code=" +
          this.search.cardNo
      );
    },
    lightColumn(row, index) {
      return index === 0 ? "bgc-ligth-yellow" : "";
    }
  },
  filters: {
    // 优付卡使用状态
    status(status, userId) {
      return status == 1 ? (userId ? "已使用" : "未使用") : "已作废";
    }
  },
  directives: {
    // elm  input组件 相关自定义指令
    focus: {
      //input初始化  focus 状态
      inserted(el, { value }) {
        if (value) {
          el.children[0].focus(); //默认选中
        }
      }
    },
    focusUpdate: {
      //绑定参数更新时 并且由false->true  input框选为中状态
      update(el, { value, oldValue }) {
        if (value && !oldValue) {
          //绑定的值为true  并且旧值为false则 focus
          el.children[0].focus();
        }
      }
    }
  },
  components: {
    IEcharts
  }
};
</script>

