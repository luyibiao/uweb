<style lang="less" scoped>
.mode .title {
  text-align: center;
  margin: 30px auto 40px;
}
.mode {
  width: 280px;
  & + & {
    margin-top: 15px;
  }
}
.mode-container {
  overflow: hidden;
  width: 100%;
  border-radius: 8px;
  padding-bottom: 10px;
  border: 1px solid #dee5e7;
  background-color: #f4f5f9;
  text-align: center;
  box-sizing: border-box;
  .title {
    margin: 15px 0;
  }
  .mode-text {
    cursor: pointer;
    padding: 15px 0;
  }
}
.mode-active {
  position: relative;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    margin-top: -10px;
    border: 10px solid transparent;
  }
  &::after {
    right: -42px;
    border-right-color: #fff;
  }
  &::before {
    right: -40px;
    border-right-color: #dee5e7;
  }
  .mode-container {
    position: relative;
    background-color: #f6fdf5;
    border-color: #36c924;
    &:before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 1;
      border: 16px solid;
      border-color: transparent #36c924 #36c924 transparent;
    }
    &:after {
      content: "\2714";
      font-family: element-icons !important;
      position: absolute;
      right: 3px;
      bottom: 1px;
      z-index: 2;
      color: #fff;
      font-size: 12px;
    }
  }
}
.pages {
  margin-left: 320px;
  min-height: 650px;
  padding: 15px 30px 40px;
  box-sizing: border-box;
}
.picture {
  margin: 15px -40px -20px 20px;
}
.wx {
  display: inline-block;
  width: 300px;
  margin: 0 40px 20px 0;
}
</style>
<template>
  <div>
    <div v-if="isShopOpen">
      <p class="m-b">选择下单模式</p>
      <div class="clearfix">
        <div class="pull-left">
          <div v-for="(item,index) in modeList"
               :class="{'mode':true,'mode-active':item.active}">
            <div class="mode-container">
              <auth perm="weixin.mode.update">
                <div class="mode-text"
                     @click="changeMode(item,index)">
                  <h3 class="title">{{item.name}}</h3>
                  <p class="text-muted">{{item.tips}}</p>
                </div>
                <div>
                  <p class="m-b-sm"
                     v-for="key in item.checks">
                    <el-checkbox :value="item[key]"
                                 @input="changeCheck(item,key)"
                                 :disabled="!item.active"
                                 :true-label="1"
                                 :false-label="0">{{modeNames[key]}}</el-checkbox>
                  </p>
                </div>
                <template slot="noPerm">
                  <div class="mode-text">
                    <h3 class="title">{{item.name}}</h3>
                    <p class="text-muted">{{item.tips}}</p>
                  </div>
                  <div>
                    <p class="m-b-sm"
                       v-for="key in item.checks">
                      <el-checkbox :value="item[key]"
                                   :disabled="true">{{modeNames[key]}}</el-checkbox>
                    </p>
                  </div>
                </template>
              </auth>
            </div>
          </div>
        </div>
        <div class="pages  b-a">
          <div class="l-h-2x">微信预览界面</div>
          <div class="picture">
            <img class="wx b-a"
                 v-for="item in wxImgs"
                 :src="item"></div>
        </div>
      </div>
    </div>
    <vBanner v-else
             :isShow="1"></vBanner>
  </div>
</template>

<script>
import msg from "@/utils/msg";
import vBanner from "./banner.vue";

export default {
  components: {
    vBanner
  },
  data: function() {
    return {
      loading: true,
      modeNames: {
        oneKeyCreate: "一键下单模式",
        isCupboard: "微信预约智柜"
      },
      // 模式列表
      modeList: [
        {
          active: false,
          name: "预约模式",
          tips: "客户预约下单，由取送员上门取件",
          checks: ["oneKeyCreate", "isCupboard"], //可编辑的选项
          createMode: 1, //固定
          oneKeyCreate: 0,
          isCupboard: 0,
          onlyCupboard: 0 //固定
        },
        {
          active: false,
          name: "一键下单模式",
          tips: "客户预约下单，由取送员上门取件",
          checks: ["isCupboard"], //可编辑的选项
          createMode: 3, //固定
          oneKeyCreate: 1,
          isCupboard: 0,
          onlyCupboard: 0 //固定
        },
        {
          active: false,
          name: "下单支付模式",
          tips: "客户提前支付",
          checks: ["oneKeyCreate"], //可编辑的选项
          createMode: 2, //固定
          oneKeyCreate: 0,
          isCupboard: 0,
          onlyCupboard: 0 //固定
        },
        {
          active: false,
          name: "预约智柜模式",
          tips: "客户只能预约柜子，不能在线下单",
          checks: [], //可编辑的选项
          createMode: 1, //固定
          oneKeyCreate: 0, //固定
          isCupboard: 1,
          onlyCupboard: 1 //固定
        }
      ],
      // 是否开启
      isShopOpen: 1,
      // 用来保存单项模式的默认配置
      defModeConfig: {
        index: 0
      }
    };
  },
  created() {
    this.getMode();
  },
  methods: {
    changeCheck(modeItem, key) {
      let value = modeItem[key] ? 0 : 1;
      msg.confirm({
        msg: `确定${value ? "开启" : "关闭"}${this.modeNames[key]}？`,
        confirmFn: _ => {
          modeItem[key] = value;
          this.updateMode(modeItem).then(res => {
            msg.success();
          });
        }
      });
    },
    changeMode(item, index) {
      if (!item.active) {
        msg.confirm({
          msg: `确定开启${item.name}？`,
          confirmFn: _ => {
            this.updateMode(item).then(res => {
              msg.success();
              // 将上个被选中的单项模式 退回到默认配置,
              this.setOneMode(this.defModeConfig.index, {
                ...this.defModeConfig,
                active: false
              });
              // 当前配置被选中，并将配置保存到默认配置中
              item.active = true;
              this.setDefModeConfig({ index, ...item });
            });
          }
        });
      }
    },
    // 更新模式
    updateMode({ createMode, oneKeyCreate, isCupboard, onlyCupboard }) {
      return this.$store.dispatch("post", {
        uri: "mercCity/updateMode",
        data: {
          createMode,
          oneKeyCreate,
          isCupboard,
          onlyCupboard
        }
      });
    },
    // 获取模式
    getMode() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "mercCity/queryCreateMode"
        })
        .then(res => {
          let data = res.data.data;
          this.isShopOpen = data.isShopOpen;
          // 筛选当前选中的模式
          for (let index = 0; index < this.modeList.length; index++) {
            if (data.onlyCupboard == 1) {
              if (
                this.modeList[index].createMode == data.createMode &&
                this.modeList[index].onlyCupboard == 1
              ) {
                this.modeList[index].active = true;
              }
            } else {
              if (this.modeList[index].createMode == data.createMode) {
                this.modeList[index].active = true;
              }
            }
            if (this.modeList[index].active) {
              // 保存当前模式的默认配置  并修改当前模式的配置
              this.setDefModeConfig({
                index: index,
                ...this.modeList[index]
              });
              this.setOneMode(index, { ...data, active: true });
              break;
            }
          }
          this.loading = false;
        });
    },
    // 保存单项配置的默认配置
    setDefModeConfig({
      index,
      createMode,
      oneKeyCreate,
      isCupboard,
      onlyCupboard
    }) {
      this.defModeConfig.index = index;
      this.defModeConfig.createMode = createMode;
      this.defModeConfig.oneKeyCreate = oneKeyCreate;
      this.defModeConfig.isCupboard = isCupboard;
      this.defModeConfig.onlyCupboard = onlyCupboard;
    },
    // 设置单项模式的配置
    setOneMode(
      index,
      { createMode, oneKeyCreate, isCupboard, onlyCupboard, active }
    ) {
      this.modeList[index].createMode = createMode;
      this.modeList[index].oneKeyCreate = oneKeyCreate;
      this.modeList[index].isCupboard = isCupboard;
      this.modeList[index].onlyCupboard = onlyCupboard;
      this.modeList[index].active = active;
    }
  },
  computed: {
    wxImgs() {
      let index = this.defModeConfig.index,
        mode = this.defModeConfig.createMode,
        home = `/static/img/modes/home${mode == 3 ? "1" : "0"}_${this.modeList[index].oneKeyCreate}_${this.modeList[index].isCupboard}.png`,
        price = `/static/img/modes/price_${mode == 2 ? "1" : "2"}.png`,
        create = `/static/img/modes/create${index}_${
          this.modeList[index].isCupboard
        }.png`;
      let arr = [home, create];
      if (mode != 3) arr.splice(1, 0, price);
      return arr;
    }
  }
};
</script>