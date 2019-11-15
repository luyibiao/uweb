<template>
  <div class="info-group">
    <div class="info-group-title relase-bg">库存/规格</div>
    <div class="info-group-cont relase-bg">
      <el-form ref="formatForm"
               label-width="120px"
               :model="form">
        <el-form-item label="商品规格：">
          <div class="bg-white-only b-a standard">
            <div class="standard-item"
                 v-for="(item,i) in  standardList"
                 :key="i">
              <div class="relase-bg standard-title ">
                <el-select class="thumb-xl"
                           size="small"
                           filterable
                           allow-create
                           v-model.trim="item.name"
                           @change="changeStandard(item)"
                           placeholder="选择商品规格">
                  <el-option v-for="item in selectSpecsList"
                             :key="item.id"
                             :value="item.name">
                  </el-option>
                </el-select>
                <i @click="closeStandard(i)"
                   class="close-btn el-icon-close"></i>
              </div>
              <div class="standard-cont"
                   v-if="item.val">
                <el-tag class="m-r-xs m-b-xs"
                        type="primary"
                        :key="j"
                        v-for="(tag,j) in item.tagList"
                        :closable="true"
                        :close-transition="true"
                        @close="closeTag(i,j)">
                  {{tag}}
                </el-tag>
                <addTag @before="beforeTag(i)"
                        @save="pushTag"></addTag>
              </div>
            </div>
            <div class="standard-item"
                 v-if="standardList.length < 3">
              <div class="relase-bg standard-title">
                <el-button size="small"
                           @click="addStandard">添加规格项目</el-button>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="商品库存："
                      v-if="instockData.length">
          <div class="bg-white-only b-a instock">
            <table class="instock-tabel">
              <thead>
                <tr>
                  <th v-for="(item,i) in standardList"
                      :key="i"
                      v-if="item.tagList.length">{{item.val}}</th>
                  <th>价格（元）</th>
                  <th>库存</th>
                  <th>商品编号</th>
                  <th>成本价</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,i) in instockData"
                    :key="i">
                  <td v-for="(value, j) in item.specs">{{value.name}}</td>
                  <td>
                    <el-input v-model.number="item.price"
                              class="w-xs"
                              @blur="validPrice(item)"></el-input>
                    <p class="text-danger text-xs l-h m-t-xs"
                       v-show="!item.valiPrice">金额格式错误</p>
                  </td>
                  <td>
                    <el-input v-model="item.store"
                              @blur="validStore(item)"
                              class="w-xs"></el-input>
                    <p class="text-danger text-xs l-h m-t-xs"
                       v-show="!item.valiStore">库存格式错误</p>
                  </td>
                  <td>
                    <el-input v-model="item.seq"
                              class="w-xs"></el-input>
                  </td>
                  <td>
                    <el-input v-model.number="item.cost"
                              @blur="validCost(item)"
                              class="w-xs"></el-input>
                    <p class="text-danger text-xs l-h m-t-xs"
                       v-show="!item.valiCost">金额格式错误</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="5"
                      class="instock-set">
                    <span class="m-r-sm">批量设置：</span>
                    <span v-show="!batch.show">
                      <el-button type="text"
                                 @click="batchSetAttr('price')">价格</el-button>
                      <el-button type="text"
                                 @click="batchSetAttr('store')">库存</el-button>
                    </span>
                    <span v-show="batch.show">
                      <el-input v-focusUpdate="batch.show"
                                class="w-xs m-r-sm"
                                size="small"
                                v-model="batch.value"
                                @keyup.enter.native="saveBatchSet"
                                :placeholder="`请输入${batch.type == 'price' ? '价格' :'库存'}`"></el-input>
                      <el-button type="text"
                                 @click="saveBatchSet">保存</el-button>
                      <el-button type="text"
                                 @click="batch.show = false">取消</el-button>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-form-item>
        <el-form-item label="总库存："
                      required
                      :rules="[{ validator: valiAllStore }]"
                      prop="store">
          <el-input class="w-xs m-b-sm"
                    v-model.trim="form.store"
                    :disabled="!!instockData.length"></el-input>
          <p class="text-muted l-h text-xs">总库存为0时，会上架到【已售罄的商品】列表里</p>
          <p class="text-muted l-h text-xs">发布后商品同步更新，已库存数字为准</p>
        </el-form-item>

        <el-form-item label="初始销量："
                      required
                      :rules="[{ validator: valiSales }]"
                      prop="startSales">
          <el-input class="w-xs m-b-sm"
                    v-model.trim="form.startSales"
                    :disabled="!form.store.length && !id"></el-input>
          <p class="text-muted l-h text-xs">初始销量不计入库存,并无法修改</p>
        </el-form-item>

        <el-form-item label="商品编号：">
          <el-input class="w-xs m-b-sm"
                    v-model.trim="form.seq"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import validate from "@/utils/helpers/validate";
import addTag from "./add_tag";

export default {
  props: {
    id: '',
    store: "",
    startSales: '',
    seq: "",
    specsTypeList: {
      default: _ => []
    },
    specsList: {
      default: _ => []
    }
  },
  data() {
    return {
      form: {
        store: 0, // 总库存
        startSales: 0, //初始销量
        seq: "" // 商家编码
      },
      // 供选择的规格列表
      selectSpecsList: [],
      // 用户添加的规格列表
      standardList: [],
      // 用户当前编辑的规格列表序号
      editStandardIndex: 0,
      // 库存信息
      instockData: [],
      // 批量设置
      batch: {
        show: false,
        type: "",
        value: ""
      }
    };
  },
  watch: {
    store(n) {
      this.form.store = n;
    },
    startSales(n) {
      this.form.startSales = n;
    },
    seq(n) {
      this.form.seq = n;
    },
    specsTypeList(n) {
      if (n.length) this.standardList = n;
    },
    specsList(n) {
      if (n.length) this.instockData = n;
    }
  },
  created() {
    // this.form.store = this.store;
    // this.form.seq = this.seq;
    this.getSpecs();
  },
  methods: {
    // 获取规格列表
    getSpecs() {
      this.$store
        .dispatch("post", {
          uri: "goodsSpecsAttr/list"
        })
        .then(res => {
          this.selectSpecsList = res.data.data.list;
          this.$emit("loaded");
        });
    },
    // 提交添加的新规格
    addSpecs(name) {
      return this.$store.dispatch("post", {
        uri: "goodsSpecsAttr/add",
        data: {
          name: name
        },
        forceResolve: true
      });
    },
    // 规格
    // 判断新增规格名是否存在已添加的规格列表中
    checkoutStandard(value) {
      for (let index = 0; index < this.standardList.length; index++) {
        if (this.standardList[index].val === value.name) {
          return false;
        }
      }
      return true;
    },
    // 用户选择的规格变化
    changeStandard(value) {
      if (value.name && value.name !== value.val) {
        // 已添加的规格列表中是否存在该name
        if (this.checkoutStandard(value)) {
          // 规格名是否为新值
          let exist = false;
          for (let index = 0; index < this.selectSpecsList.length; index++) {
            if (this.selectSpecsList[index].name === value.name) {
              value.type = this.selectSpecsList[index].id;
              exist = true;
              break;
            }
          }
          value.val = value.name;
          // 新值则 提交 添加新的规格
          if (!exist) {
            this.addSpecs(value.name).then(res => {
              if (res.data.httpCode === 200) {
                value.type = res.data.data.id;
                this.selectSpecsList.unshift(res.data.data);
                value.tagList = [];
                this.initInstockData();
              }
            });
          } else {
            value.tagList = [];
            this.initInstockData();
          }
        } else {
          msg.error("规格名不能重复");
          value.name = value.val;
        }
      }
    },
    // 添加规格
    addStandard() {
      if (this.standardList.length < 3) {
        this.standardList.push({
          name: "", //修改值
          val: "", //有效值
          type: "", //类型
          tagList: [] //标签列表
        });
      }
    },
    // 删除规格
    closeStandard(i) {
      this.standardList.splice(i, 1);
      this.initInstockData();
    },
    // 规格加入标签之前
    beforeTag(i) {
      this.editStandardIndex = i;
    },
    // 规格加入标签
    pushTag(value) {
      if (
        this.standardList[this.editStandardIndex].tagList.indexOf(value) < 0
      ) {
        this.standardList[this.editStandardIndex].tagList.push(value);
        this.initInstockData();
      }
    },
    // 规格关闭标签
    closeTag(i, j) {
      this.standardList[i].tagList.splice(j, 1);
      this.initInstockData();
    },
    // 库存
    // 初始化商品规格数据
    initInstockData() {
      let arr = [];
      let len = 0;
      let standardList = this.standardList.filter(item => {
        return item.tagList.length;
      });
      this.addInstock(arr, [], standardList, 0, standardList.length);
      this.instockData = arr;
      this.form.store = 0;
      this.form.startSales = 0;
      this.$emit("instockChange", arr.length);
      this.$emit("priceChange", 0);
    },
    /**
     * 递归增加库存
     * @param {Arrary} arr:添加数据的数组
     * @param {Arrary} specs:添加单个商品规格的数组
     * @param {Arrary} standardList:需要循环的规格数组
     * @param {Number} currentIndex:从第几个开始
     * @param {Number} maxLength:从第几个结束
     */
    addInstock(arr, specs, standardList, currentIndex, maxLength) {
      let data = {
        id: "",
        goodsId: "",
        sort: "",
        store: "",
        price: "",
        cost: "",
        seq: "",
        valiStore: true,
        valiPrice: true,
        valiCost: true
      };
      // 跳出递归
      if (currentIndex >= maxLength) {
        return false;
      }
      // 获取当前规格val,type
      specs[currentIndex] = {
        type: standardList[currentIndex].type,
        val: standardList[currentIndex].val
      };
      // 循环当前规格标签名列表
      standardList[currentIndex].tagList.forEach(item => {
        // 在组合到最后一个规格之前，不停的往添加单个商品规格的数组上添加name属性
        specs[currentIndex].name = item;
        if (currentIndex === maxLength - 1) {
          // 组合到最后一个后，创建一个新的对象，然后放置入列表中
          let result = {
            ...data,
            specs: JSON.parse(JSON.stringify(specs))
          };
          arr.push(result);
        } else {
          // 递归循环下一个规格 currentIndex + 1
          this.addInstock(
            arr,
            specs,
            standardList,
            currentIndex + 1,
            maxLength
          );
        }
      });
    },
    // 批量设置（价格，库存）
    batchSetAttr(attr) {
      this.batch.type = attr;
      this.batch.value = "";
      this.batch.show = true;
    },
    // 保存批量设置（价格，库存）
    saveBatchSet() {
      let vali =
        this.batch.type == "price"
          ? validate.amount(this.batch.value, 2, 0.01, 999999)
          : validate.amount(this.batch.value, 0, 0, 999999);
      let valiKeys = this.batch.type == "price" ? "valiPrice" : "valiStore";
      if (vali) {
        this.instockData.forEach(item => {
          item[this.batch.type] = this.batch.value;
          item[valiKeys] = true;
        });
        this.batch.show = false;
        this.batch.type == "store"
          ? (this.form.store =
              parseInt(this.batch.value) * this.instockData.length)
          : this.$emit("priceChange", this.batch.value);
      } else {
        let err = this.batch.type == "price" ? "金额" : "库存";
        msg.error(err + "格式错误");
      }
    },
    // 输入金额时 获取最小金额
    getMiniPrice() {
      let mini = 0;
      if (this.instockData.length) {
        this.instockData.forEach(item => {
          if (item.price) {
            if (mini === 0 || item.price < mini) {
              mini = item.price;
            }
          }
        });
      }
      this.$emit("priceChange", mini);
    },
    // 获取最小成本
    // 校验金额
    validPrice(value) {
      value.valiPrice = validate.amount(value.price, 2, 0.01, 9999999);
      this.getMiniPrice();
    },
    // 校验成本
    validCost(value) {
      if (value.cost !== "") {
        value.valiCost = validate.amount(value.cost, 2, 0, 9999999);
      } else {
        value.valiCost = true;
      }
    },
    // 校验库存
    validStore(value) {
      value.valiStore = validate.amount(value.store, 0, 0, 9999999);
      if (value.valiStore) {
        let all = 0;
        this.instockData.forEach(item => {
          if (item.store) {
            all += parseInt(item.store);
          }
        });
        this.form.store = all;
      }
    },
    // 校验总库存
    valiAllStore(rule, value, callback) {
      validate.amount(value, 0, 0, 999999)
        ? callback()
        : callback(new Error("库存格式错误"));
    },
    // 校验初始销量
    valiSales(rule, value , callback) {
      validate.amount(value, 0, 0, this.form.store-1)
        ? callback()
        : callback(new Error("库存格式必须在0到"+this.form.store+'之间'));
    },
    // 校验规格数据
    valiInstockData() {
      let vali = true;
      this.instockData.forEach((item, index) => {
        this.validPrice(item);
        this.validCost(item);
        this.validStore(item);
        if (!item.valiCost || !item.valiPrice || !item.valiStore) {
          vali = false;
        }
        if (item.valiPrice) {
          item.sort = index;
        }
      });
      return vali;
    },
    // 校验表单
    validate() {
      let flag = false;
      if (this.instockData.length) {
        flag = this.valiInstockData();
      } else {
        this.$refs.formatForm.validate(valid => {
          flag = valid;
        });
      }
      return flag;
    },
    // 获取表单信息
    getData() {
      return {
        list: this.instockData.length ? this.instockData : [], //规格列表
        store: this.form.store, //总库存
        startSales: this.form.startSales,//初始销量
        seq: this.form.seq //商品编号
      };
    }
  },
  components: {
    addTag
  },
  directives: {
    focusUpdate: {
      //绑定参数更新时 并且由false->true  input框选为中状态
      update(el, { value, oldValue }) {
        if (value && !oldValue) {
          //绑定的值为true  并且旧值为false则 focus
          el.children[0].focus();
        }
      }
    }
  }
};
</script>
// 规格库存
// Events
//  name|params|description
//  priceChange|miniPrice(最小金额)|商品价格变化时触发 
//  instockChange|length(商品规格数量)|商品规格变化时触发
//  loaded|无|数据加载完成触发