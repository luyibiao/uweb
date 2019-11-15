<style lang="less" scoped>
.main-l {
  width: 320px;
  .link-back {
    line-height: 36px;
  }
}

.main-r {
  margin-left: 380px;
  overflow: hidden;
}

.num {
  font-size: 32px;
}

.details {
  padding: 30px 0;
  border: 1px solid #ecb07a;
  background-color: #fff3d3;
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
}

.fanchart {
  .title {
    padding: 0 20px;
    line-height: 32px;
    background-color: #f7f7f7;
  }
  .main {
    border: 1px solid #e5e5e5;
    width: 100%;
    height: 270px;
    box-sizing: border-box;
  }
}

.operation {
  overflow: hidden;
}

.formbox {
  margin: 0 auto;
  max-width: 410px;
  padding-right: 10px;
  line-height: 36px;
}

.form-label {
  width: 90px;
}

.form-input {
  margin-left: 100px;
}
</style>

<template>
  <div class="clearfix">
    <!-- 左侧 -->
    <div class="pull-left main-l">
      <!-- 面包屑 -->
      <el-breadcrumb class="link-back"
                     separator="/">
        <el-breadcrumb-item to="/marketing/visitors/list">
          <i class="el-icon-arrow-left icon-smaller"></i>团卡</el-breadcrumb-item>
        <el-breadcrumb-item>团卡详情</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 会员卡信息 -->
      <div class="details m-t-lg text-center"
           v-if="cardMessage.name">
        <auth perm="marketing.visitors.update">
          <el-button type="text"
                   class="edit"
                   @click="detailForm.show = true">编辑</el-button>
        </auth>
        <el-input class="w-sm m-b-sm"
                  v-focus="detailForm.show"
                  v-if="detailForm.show"
                  v-model.trime="detailForm.name"
                  @blur="updateVisitorDetail"
                  @keyup.enter.native="updateVisitorDetail"></el-input>
        <h3 class="m-b-md"
            v-else>{{cardMessage.name}}</h3>
        <p class="m-b-md">{{cardMessage.cardName}}（{{ cardMessage.cardDiscount | discount(cardMessage.rights)}}）</p>
        <p class="m-b-md">创建时间：{{cardMessage.createTime | getDate}} {{cardMessage.createTime | getTime}}</p>
        <p>共
          <span class="num">&nbsp;{{cardMessage.cardCnt}}&nbsp;</span>张</p>
      </div>
      <!-- 金额数据扇形图 -->
      <div class="fanchart m-t-lg">
        <p class="title">会员卡统计</p>
        <div class="main">
          <IEcharts v-if="options.legend.data.length>0"
                    :option="options"></IEcharts>
          <p style="text-align:center;line-height:240px;"
             v-else>暂无数据</p>
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="main-r">
      <!-- 搜索发卡 -->
      <div class="operation clearfix">
        <ul class="pull-left">
          <li class="pull-left m-r-lg">
            <label>会员卡状态：</label>
            <el-select class="thumb-xl"
                       v-model="search.cardStatus"
                       placeholder="全部">
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li class="pull-left"
              style="width:240px;">
            <el-input placeholder="请输入会员卡号"
                      v-model="search.cardNo">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="tabHandleClick"></el-button>
            </el-input>
          </li>
        </ul>
        <auth perm="marketing.visitors.recharge">
          <el-button class="pull-right"
                   type="primary"
                   @click="startAddCard">发卡充值</el-button>
        </auth>
      </div>

      <div class="m-t-lg">
        <el-tabs v-model="activeName"
                 type="card"
                 @tab-click="tabHandleClick">
          <el-tab-pane label="团卡列表"
                       name="carList">
            <!-- 表格数据 -->
            <el-table class="ukao-el-table"
                      :data="tableList"
                      v-loading="loading">
              <el-table-column label="会员卡号"
                               prop="rfidNo">
              </el-table-column>
              <el-table-column label="卡金额（元）">
                <template slot-scope="scope">
                  <div class="text-success font-bold">{{scope.row.balance | amtFormat}}</div>
                </template>
              </el-table-column>
              <el-table-column label="赠送金额（元）">
                <template slot-scope="scope">
                  <div class="text-success font-bold">{{scope.row.giftAmount | amtFormat}}</div>
                </template>
              </el-table-column>
              <el-table-column label="团体" prop="unionName">
              </el-table-column>
              <el-table-column label="享受会员价">
                <template slot-scope="scope">
                  <template v-if="scope.row.isVip">是</template>
                  <template v-else>否</template>
                </template>
              </el-table-column>
              <el-table-column label="用户"
                               prop="user">
                <template slot-scope="scope">
                  <p>
                    <a target="_blank"
                       :href="'/client/list/'+scope.row.userId+'/basic'"
                       class="text-primary">{{scope.row.userName}}</a>
                  </p>
                  <p>
                    <a target="_blank"
                       :href="'/client/list/'+scope.row.userId+'/basic'"
                       class="text-primary">{{scope.row.userPhone}}</a>
                  </p>
                  <p>
                    <a target="_blank"
                       :href="'/client/list/'+scope.row.userId+'/basic'"
                       class="text-primary">{{scope.row.cardNo}}</a>
                  </p>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <p :class="{ 'text-muted':scope.row.rfStatus == 1 && !scope.row.userId ,'text-danger':scope.row.rfStatus == -1}">{{scope.row | cardState}}</p>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               width="140">
                <template slot-scope="scope">
                  <!--<el-button v-if="scope.row.rfStatus == 1 && !scope.row.userName" size="small" @click="modifyMoney(scope.row.id,scope.row.balance,scope.row)">修改</el-button>-->
                  <template v-if="scope.row.rfStatus == 1 && scope.row.status == 1">
                    <auth perm="marketing.visitors.recharge">
                      <el-button type="success" size="small" @click="recharge(scope.row.id, scope.row)">充值</el-button>
                    </auth>
                  </template>
                  <template v-if="scope.row.rfStatus == 1 && !scope.row.userId">
                    <auth perm="marketing.visitors.withhold">
                      <el-button size="small" @click="deduction(scope.row.id, scope.row)">扣款</el-button>
                    </auth>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <div class="m-sm">
              <auth perm="marketing.visitors.export">
                <el-button size="small" @click="exportXls">导出</el-button>
              </auth>
            </div>
            <!-- 分页 -->
            <div class="text-right "
                 v-if="pagination.total > 0">
              <el-pagination :current-page.sync="pagination.current"
                             :page-size="pagination.size"
                             layout="total, prev, pager, next"
                             :total="pagination.total"
                             @current-change="updateUrl">
              </el-pagination>
            </div>
          </el-tab-pane>
          <!-- 发卡log记录 -->
          <el-tab-pane label="发卡充值记录"
                       name="carLog">
            <el-table class="ukao-el-table"
                      :data="tableLogList"
                      v-loading="loading">
              <el-table-column label="会员卡号"
                               prop="rfidNo">
              </el-table-column>
              <el-table-column label="时间">
                <template slot-scope="scope">
                  <p>{{scope.row.createTime | getDate}} {{scope.row.createTime | getTime}}</p>
                </template>
              </el-table-column>
              <el-table-column label="实充金额（元）">
                <template slot-scope="scope">
                  <div class="text-success font-bold">{{scope.row.amount | amtFormat}}</div>
                </template>
              </el-table-column>
              <el-table-column label="赠送金额（元）">
                <template slot-scope="scope">
                  <div class="text-success font-bold">{{scope.row.giftAmount | amtFormat}}</div>
                </template>
              </el-table-column>
              <el-table-column label="团体" prop="unionName">
              </el-table-column>
              <el-table-column label="享受会员价">
                <template slot-scope="scope">
                  <template v-if="scope.row.isVip">是</template>
                  <template v-else>否</template>
                </template>
              </el-table-column>
              <el-table-column label="类型">
                <template slot-scope="scope">
                  <div class="text-success"
                       v-if="scope.row.amount >= 0">充值</div>
                  <div class="text-muted"
                       v-else>扣款</div>
                </template>
              </el-table-column>
              <el-table-column label="用户"
                               prop="user">
                <template slot-scope="scope">
                  <p>
                    <a target="_blank"
                       :href="'/client/list/'+scope.row.userId+'/basic'"
                       class="text-primary">{{scope.row.userName}}</a>
                  </p>
                  <p>
                    <a target="_blank"
                       :href="'/client/list/'+scope.row.userId+'/basic'"
                       class="text-primary">{{scope.row.userPhone}}</a>
                  </p>
                  <p>
                    <a target="_blank"
                       :href="'/client/list/'+scope.row.userId+'/basic'"
                       class="text-primary">{{scope.row.cardNo}}</a>
                  </p>
                </template>
              </el-table-column>
              <el-table-column label="操作人"
                               prop="createName">
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <p class="text-success"
                     v-if="scope.row.status == 1">成功</p>
                  <p class="text-danger"
                     v-if="scope.row.status == 0">失败</p>
                  <p class="text-danger"
                     v-if="scope.row.status == -1">已删除</p>
                </template>
              </el-table-column>
              <!--<el-table-column label="操作" width="100">-->
              <!--<template slot-scope="scope">-->
              <!--</template>-->
              <!--</el-table-column>-->
            </el-table>
            <div class="m-sm">
              <auth perm="marketing.visitors.export">
                <el-button size="small" @click="exportLogXls">导出</el-button>
              </auth>
            </div>
            <!-- 分页 -->
            <div class="text-right "
                 v-if="pagination.logTotal > 0">
              <el-pagination :current-page.sync="pagination.logCurrent"
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
    <!-- 发卡弹窗 -->
    <el-dialog title="发卡充值"
               :visible.sync="dialogVisible"
               @close="closeSendCard"
               :lock-scroll="false"
               custom-class="ukao-dialog-xs">
      <div class="formbox">
        <div class="clearfix">
          <label class="pull-left text-right form-label">实充金额</label>
          <div class="form-input">
            <el-input v-model.trim="form.amount"
                      v-focus="dialogVisible"
                      v-focusUpdate="dialogVisible"
                      placeholder="请输入充值金额">
              <span slot="append">元</span>
            </el-input>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">赠送金额</label>
          <div class="form-input">
            <el-input v-model.trim="form.giftAmount"
                      v-focus="dialogVisible"
                      v-focusUpdate="dialogVisible"
                      placeholder="请输入赠送金额">
              <span slot="append">元</span>
            </el-input>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">团体</label>
          <div class="form-input">
            <el-select v-model="form.unionId"
                       filterable
                       clearable
                       placeholder="全部">
              <el-option v-for="item in unionList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="clearfix m-t-md" v-if="mercInfo.isOpenVipPrice">
          <label class="pull-left text-right form-label">享受会员价</label>
          <div class="form-input">
            <el-radio-group v-model="form.isVip">
              <el-radio :label="1">享受</el-radio>
              <el-radio :label="0">不享受</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">
            <span class="text-danger m-r-xs">*</span>会员卡号</label>
          <div class="form-input">
            <el-input @keyup.enter.native="addCard"
                      v-model.trim="form.card"
                      placeholder="请输入或扫描会员卡背面条码"></el-input>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <div class="form-input">
            <el-button @click="dialogVisible = false">关 闭</el-button>
            <el-button type="primary" @click="addCard(true)">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 修改金额弹窗 -->
    <!-- <el-dialog title="修改金额" :visible.sync="moneyVisible" :lock-scroll="false" size="tiny">
      <div class="formbox">
        <div class="clearfix">
          <label class="pull-left text-right form-label">
            <span class="text-danger m-r-xs">*</span>金额</label>
          <div class="form-input">
            <el-input v-model.trim="moneyForm.amount" v-focus="moneyVisible" v-focusUpdate="moneyVisible"  placeholder="请输入金额">
              <span slot="append">元</span>
            </el-input>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <div class="form-input">
            <el-button @click="moneyVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitModifyMoney">保 存</el-button>
          </div>
        </div>
      </div>
    </el-dialog> -->

    <!-- 充值 扣款-->
    <el-dialog :title="regMoneyForm.title"
               :visible.sync="regMoneyVisible"
               :lock-scroll="false"
               custom-class="ukao-dialog-xs">
      <div class="formbox">
        <div class="clearfix">
          <div class="pull-left text-right form-label">
            会员卡号
          </div>
          <div class="form-input form-label">
            {{regMoneyForm.rfidNo}}
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">实充金额</label>
          <div class="form-input">
            <el-input v-model.trim="regMoneyForm.amount"
                      v-focus="dialogVisible"
                      v-focusUpdate="dialogVisible"
                      placeholder="请输入充值金额">
              <span slot="append">元</span>
            </el-input>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">赠送金额</label>
          <div class="form-input">
            <el-input v-model.trim="regMoneyForm.giftAmount"
                      v-focus="dialogVisible"
                      v-focusUpdate="dialogVisible"
                      placeholder="请输入赠送金额">
              <span slot="append">元</span>
            </el-input>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">团体</label>
          <div class="form-input">
            <el-select v-model="regMoneyForm.unionId"
                       filterable
                       clearable
                       placeholder="全部">
              <el-option v-for="item in unionList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="clearfix m-t-md" v-if="mercInfo.isOpenVipPrice">
          <label class="pull-left text-right form-label">享受会员价</label>
          <div class="form-input">
            <el-radio-group v-model="regMoneyForm.isVip">
              <el-radio :label="1">享受</el-radio>
              <el-radio :label="0">不享受</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <div class="form-input">
            <el-button @click="regMoneyVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitRegModifyMoney">保 存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import consts from "@/utils/consts";
import auth from "@/utils/auth";
import validate from "@/utils/helpers/validate";
import calculation from "@/utils/helpers/calculation";
import msg from "@/utils/msg";
import IEcharts from "vue-echarts-v3";
// import IEcharts from 'vue-echarts-v3/src/lite';
// import 'echarts/lib/chart/pie';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/legend';

export default {
  data() {
    return {
      mercInfo: auth.getMercInfo(),
      id: "",
      changeItem: null, //暂存修改金额项
      cardMessage: {}, //团客卡信息
      dialogVisible: false, //显示弹窗
      // moneyVisible: false, //显示修改金额弹窗
      regMoneyVisible: false, //显示充值
      loading: false, //加载中
      activeName: "carList", //默认选中页签
      statusOptions: [
        { value: "", label: "全部" },
        { value: "1", label: "已使用" },
        { value: "0", label: "未使用" },
        { value: "-1", label: "已作废" }
      ], //会员卡可选状态
      search: {
        //搜索信息
        cardStatus: "", //状态
        cardNo: "" //卡号
      },
      tableList: [], //表格数据
      tableLogList: [], //表格log数据
      unionList: [],
      form: {
        //新建卡填写的表单信息
        card: "", //卡号
        amount: "", //金额
        giftAmount: "", //赠送金额
        isVip: 0, // 是否参与会员价
        unionId: '' // 团体客户
      },
      moneyForm: {
        //修改金额表单提交的数据
        amount: 0,
        id: ""
      },
      regMoneyForm: {
        //充值扣款金额表单提交的数据
        amount: "",
        giftAmount: "", //赠送金额
        isVip: 0, // 是否参与会员价
        unionId: '', // 团体客户
        rfidNo: "",
        id: "",
        title: "充值",
        type: 1
      },
      // 团客改名表单
      detailForm: {
        name: "",
        show: false
      },
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE,
        total: 0, //团客列表总数
        current: 1, //团客列表当前页数
        logTotal: 0, //发卡记录总数
        logCurrent: 1 //发卡记录当前页数
      },
      options: {
        // 扇形图基础配置
        tooltip: {
          trigger: "item",
          formatter: "总数量：{c}张 ({d}%)"
        },
        legend: {
          type: "scroll",
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
      // inputFoucs: false, //input聚焦
      bindCardNum: 0, //连续绑卡的数量
      reset: false //发卡充值标识（发卡充值需重置）
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.initParams();
    this.getTableData();
    this.getContent(); //获取详情
    this.getPieDate(); //获取扇形图数据
    this.queryUnionList();
  },
  watch: {
    $route() {
      // 发卡充值引起的$route 变化不获取数据
      if (!this.reset) {
        this.initParams();
        this.getTableData();
      }
    }
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
    // 获取团体客户
    queryUnionList() {
      this.$store
        .dispatch("post", {
          uri: "unionInfo/queryForSelect"
        })
        .then(res => {
          this.unionList = res.data.data || [];
        });
    },
    // 获取table数据
    getTableData() {
      return this.activeName === "carLog" ? this.getLogList() : this.getList();
    },
    getContent() {
      //获取当前团客详情
      this.$store
        .dispatch("get", {
          uri: "groupCard/detail",
          params: {
            id: this.id
          }
        })
        .then(res => {
          this.cardMessage = res.data.data;
        });
    },
    getPieDate() {
      //获取扇形图数据
      this.$store
        .dispatch("get", {
          uri: "groupCard/report",
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
    getList() {
      //获取会员卡表格数据
      this.loading = true;
      return this.$store
        .dispatch("get", {
          uri: "groupCard/binding/list",
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

    getLogList() {
      //获取会员卡log表格数据
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
    // modifyMoney(id, balance, item) { // 修改未使用会员卡金额
    //   this.moneyForm.amount = calculation.accDiv(balance , 100) || '';
    //   this.moneyForm.id = id;
    //   this.moneyVisible = true;
    //   this.changeItem = item;
    // },
    // submitModifyMoney() {//确认金额修改
    //   if (this.moneyForm.amount * 100 == this.changeItem.balance) { //如果金额没变化则关闭弹窗并退出
    //     this.moneyVisible = false;
    //     return false;
    //   }
    //   let moneyWarn = '';
    //   if (validate.amount(this.moneyForm.amount,2,0.01,999999)) {
    //     moneyWarn = '请输入正确的金额（0-999999之间的整数）！'
    //   } else {
    //     moneyWarn = '';
    //     this.$store.dispatch('post', {
    //       uri: 'groupCard/updateCardMoney',
    //       data: {
    //         id: this.moneyForm.id,
    //         money:  calculation.accMul(this.moneyForm.amount , 100)
    //       }
    //     }).then(res => {
    //       this.getPieDate();
    //       this.changeItem.balance =  calculation.accMul(this.moneyForm.amount ,100);
    //       this.moneyVisible = false;
    //       msg.success("充值成功");
    //     })
    //   }
    //   if (moneyWarn) {
    //     this.$message({
    //       message: moneyWarn,
    //       type: 'error',
    //       duration: 2000,
    //     });
    //   }
    // },
    startAddCard() {
      //开始发卡
      // 清空表单、 input focus、 打开弹窗、已绑定的卡数量为0
      this.form.card = "";
      this.form.amount = "";
      this.form.giftAmount = "";
      this.form.unionId = "";
      this.form.isVip = 0;
      this.dialogVisible = true;
      this.bindCardNum = 0;
    },
    addCard(end) {
      //确认发卡
      let moneyWarn = ""; //错误提醒信息
      let rfidNo = this.form.card.replace(/\s/g, "");

      if (!rfidNo) {
        moneyWarn = "请输入正确的卡号！";
      } else if (!this.form.amount && !this.form.giftAmount) {
        moneyWarn = "请输入实充金额或赠送金额！";
      } else if (!validate.amount(this.form.amount, 2, 0.01, 999999, true)) {
        // 校验是否非零整数
        moneyWarn = "请输入正确的实充金额（0.01至999999之间）！";
      } else if (!validate.amount(this.form.giftAmount, 2, 0.01, 999999, true)) {
        // 校验是否非零整数
        moneyWarn = "请输入正确的赠送金额（0.01至999999之间）！";
      }

      if (moneyWarn) {
        this.$message({
          message: moneyWarn,
          type: "error",
          duration: 2000
        });
        return;
      }

      this.$store.dispatch("post", {
          uri: "groupCard/setUpCardMoney",
          data: {
            groupCardId: this.id,
            rfidNo: rfidNo,
            amount: calculation.accMul(this.form.amount, 100),
            giftAmount: calculation.accMul(this.form.giftAmount, 100),
            unionId: this.form.unionId,
            isVip: this.form.isVip
          }
        })
        .then(res => {
          msg.success("发卡充值成功");
          if (200 == res.data.httpCode) {
            this.bindCardNum++;
            if (end == true) {
              //如果end则关闭
              this.dialogVisible = false;
            } else {
              //继续发卡
              this.$message({
                message: "发卡成功！",
                type: "success",
                duration: 900,
                onClose: () => {
                  this.form.card = "";
                }
              });
            }
          }
        });
    },
    endCard() {
      //结束发卡
      // 发卡充值标识为true
      this.reset = true;
      // 重新获取数据列表
      this.activeName == "carList"
        ? (this.pagination.current = 1)
        : (this.pagination.logCurrent = 1);
      this.search.cardStatus = "";
      this.search.cardNo = "";
      this.cardMessage.cardCnt += this.bindCardNum;
      this.updateUrl();
      this.getTableData().then(_ => {
        this.reset = false;
      });
      // 重新获取扇形图数据
      this.getPieDate();
    },
    closeSendCard() {
      //关闭发卡函数
      if (this.bindCardNum) {
        //如果发过卡 则调用结束发卡函数 刷新数据
        this.endCard();
      }
    },
    exportXls() {
      window.open(
        consts.BASE_URL + "/export/groupCard/list?id=" + this.cardMessage.id
      );
    },
    exportLogXls() {
      window.open(
        consts.BASE_URL +
          "/export/groupCard/log/list?id=" +
          this.cardMessage.id +
          "&code=" +
          this.search.cardNo
      );
    },
    // tab 切换 搜索
    tabHandleClick(tab) {
      this.activeName == "carList"
        ? (this.pagination.current = 1)
        : (this.pagination.logCurrent = 1);
      this.updateUrl();
    },
    recharge(id, item) {
      this.regMoneyForm.id = id;
      this.regMoneyForm.rfidNo = item.rfidNo;
      this.regMoneyForm.amount="";
      this.regMoneyForm.giftAmount="";
      this.regMoneyForm.isVip=0;
      this.regMoneyForm.unionId="";
      this.regMoneyForm.title = "充值";
      this.regMoneyForm.type = 1;
      this.regMoneyVisible = true;
      this.changeItem = item;
    },
    deduction(id, item) {
      this.regMoneyForm.id = id;
      this.regMoneyForm.rfidNo = item.rfidNo;
      this.regMoneyForm.amount="";
      this.regMoneyForm.giftAmount="";
      this.regMoneyForm.isVip=0;
      this.regMoneyForm.unionId="";
      this.regMoneyForm.title = "扣款";
      this.regMoneyForm.type = 2;
      this.regMoneyVisible = true;
      this.changeItem = item;
    },
    submitRegModifyMoney() {
      //确认充值
      let moneyWarn = "";
      if (!this.regMoneyForm.amount && !this.regMoneyForm.giftAmount) {
        moneyWarn = "请输入实充金额或赠送金额！";
      } else if (!validate.amount(this.regMoneyForm.amount, 2, 0.01, 999999, true)) {
        moneyWarn = "请输入正确的实充金额（0.01至999999之间）！";
      } else if (!validate.amount(this.regMoneyForm.giftAmount, 2, 0.01, 999999, true)) {
        moneyWarn = "请输入正确的赠送金额（0.01至999999之间）！";
      }

      if (moneyWarn) {
        this.$message({
          message: moneyWarn,
          type: "error",
          duration: 2000
        });
        return;
      }

      var url = this.regMoneyForm.type === 2
          ? "groupCard/deduction"
          : "groupCard/recharge";
      this.$store
        .dispatch("post", {
          uri: url,
          data: {
            id: this.regMoneyForm.id,
            amount: calculation.accMul(this.regMoneyForm.amount, 100),
            giftAmount: calculation.accMul(this.regMoneyForm.giftAmount, 100),
            unionId: this.regMoneyForm.unionId,
            isVip: this.regMoneyForm.isVip
          }
        })
        .then(res => {
          this.getPieDate();
          if (this.regMoneyForm.type === 2) {
            this.changeItem.balance += -calculation.accMul(this.regMoneyForm.amount,100);
            this.changeItem.giftAmount += -calculation.accMul(this.regMoneyForm.giftAmount,100);
          } else {
            this.changeItem.balance += calculation.accMul(this.regMoneyForm.amount,100);
            this.changeItem.giftAmount += calculation.accMul(this.regMoneyForm.giftAmount,100);
          }
          this.regMoneyVisible = false;
          msg.success(this.regMoneyForm.title + "成功");
        });

    },
    // 修改团客详情
    updateVisitorDetail() {
      if (
        this.detailForm.name &&
        this.detailForm.name != this.cardMessage.name
      ) {
        let len = this.detailForm.name.length;
        if (len >= 2 && len <= 32) {
          this.$store
            .dispatch("post", {
              uri: "groupCard/update",
              data: {
                id: this.id,
                name: this.detailForm.name
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
    }
  },
  filters: {
    discount(dis, rights) {
      if (rights.split("")[1] == 1 && dis > 0 && dis < 100) {
        return dis / 10 + "折";
      }
      return "无折扣";
    },
    cardState(item) {
      //获取会员卡使用状态
      if (item.rfStatus == 1) {
        if (item.userId) {
          return "已使用";
        }
        return "未使用";
      }
      return "已作废";
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
    // enterNext: { //回车跳转下一行
    //   inserted(el, { value },vnode) {
    //     el.children[0].onkeyup = (val) => {  //绑定输入回车事件
    //       if(val.keyCode === 13){ //如果输入enter 则触发
    //         vnode.context.inputFoucs = true; //控制下一行input focus 参数为true
    //       }
    //     }
    //   },
    // },
  },
  components: {
    IEcharts
  }
};
</script>

