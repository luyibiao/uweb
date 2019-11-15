<template>
  <div class="info-group">
    <div class="info-group-title relase-bg">商品信息</div>
    <div class="info-group-cont relase-bg">
      <el-form ref="infoForm"
               label-width="120px"
               :model="form">
        <el-form-item label="商品名："
                      prop="name"
                      :rules="[
          { required: true, message: '请输商品名' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]">
          <el-input v-model.trim="form.name"
                    class="w-md"></el-input>
        </el-form-item>
        <el-form-item label="价格："
                      required
                      prop="price"
                      :rules="[
              { required: true, message: '请输入金额'},
              amountRules
            ]">
            <el-input v-model="form.price"
                      class="w-sm"
                      :disabled="disabledPrice">
              <!--<template slot="prepend">￥</template>-->
            </el-input>
        </el-form-item>
        <el-form-item label="划线价：">
          <el-input v-model="form.mktprice"
                    class="w-sm"
                    :disabled="disabledPrice">
            <!--<template slot="prepend">￥</template>-->
          </el-input>
          <div class="text-muted text-xs">商品有优惠的情况下，划线价在商品详情会以划线形式显示。<a class="text-primary" target="_blank" :href="'www.baidu.com'">示例</a></div>
        </el-form-item>
        <el-form-item label="商品图片："
                      required
                      prop="imglist"
                      :rules="imgsRules">
          <div class="goods-imgs">
            <div class="img-box"
                 v-for="(item,index) in form.imglist"
                 :key="index">
              <img :src="item.path">
              <i class="close-btn el-icon-close"
                 @click="removeImg(index)"></i>
            </div>
            <div class="img-box"
                 v-if="form.imglist.length < 16">
              <Uploader customClass="u-mini-uploader"
                        :saveSuccessFn="addImg"
                        tip=""
                        :hideImg="true"
                        :action="'/attachment/uploadImg'"></Uploader>
            </div>
          </div>
          <p class="text-muted text-xs l-h">建议尺寸：640 x 640 像素。</p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import calculation from "@/utils/helpers/calculation";
import validate from "@/utils/helpers/validate";
import Uploader from "@/components/Uploader";
export default {
  props: {
    miniPrice: "", //最小价格
    disabledPrice: false, //价格输入框是否禁用
    name: "", //商品名
    mktprice: "", //原价
    cost: "", //成本
    // 图片列表
    imgList: {
      default: _ => []
    }
  },
  data() {
    return {
      form: {
        name: "",
        price: "",
        mktprice: "",
        cost: "",
        imglist: []
      },
      amountRules: { validator: this.checkAmount, trigger: "blur" },
      imgsRules: [{ validator: this.checkImgs, trigger: "blur" }]
    };
  },
  watch: {
    name(n) {
      this.form.name = n;
    },
    mktprice(n) {
      if (n) {
        this.form.mktprice = n;
      }
    },
    cost(n) {
      if (n) {
        this.form.cost = n;
      }
    },
    miniPrice(n, o) {
      this.form.price = n;
    },
    imgList(n) {
      if (n.length) {
        this.form.imglist = n;
      }
    }
  },
  methods: {
    checkAmount(rule, value, callback) {
      // 如果禁用价格输入则直接判断为true
      if (this.disabledPrice) {
        callback();
      } else {
        validate.amount(value, 2, 0.01, 999999, true)
          ? callback()
          : callback(new Error("金额格式错误"));
      }
    },
    checkImgs(rule, value, callback) {
      value.length ? callback() : callback(new Error("请输选择商品图片"));
    },
    addImg(data) {
      this.form.imglist.push({
        code: data.data.code,
        path: data.data.path,
        width: data.data.width,
        height: data.data.height
      });
      this.$refs.infoForm.validateField("imglist");
    },
    removeImg(index) {
      this.form.imglist.splice(index, 1);
      this.$refs.infoForm.validateField("imglist");
    },
    // 校验表单
    validate() {
      let flag = false;
      this.$refs.infoForm.validate(valid => {
        flag = valid;
      });
      return flag;
    },
    // 获取数据
    getData() {
      return {
        name: this.form.name, //名称
        imgs: JSON.stringify(this.form.imglist), //图片列表
        mktprice: calculation.accMul(this.form.mktprice || 0, 100), //原价/建议价
        cost: calculation.accMul(this.form.cost || 0, 100), //成本价
        price: calculation.accMul(this.form.price, 100) //显示价格
      };
    }
  },
  components: {
    Uploader
  }
};
</script>
