<template>
  <div class="m-t-lg"
       v-loading="loading">
    <p class="title text-black l-h-2x">产品详情</p>
    <table class="ukao-tb-default ukao-table b-t w-full">
      <tbody>
        <tr>
          <td style="width: 30%">所属经营项目</td>
          <td>
            <span>{{exp.mercBusinessName}}</span>
            <!--<span v-if="exp.mercBusinessName != exp.businessName">（{{exp.businessName}}）</span>-->
          </td>
          <td style="width: 20%">
          </td>
        </tr>
        <tr>
          <td>产品图片</td>
          <td>
            <img class="thumb"
                 :src="productInfo.imgPath || '/static/img/product/def.png'">
          </td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                         @click="imgVisible = true">修改</el-button>
            </auth>
          </td>
        </tr>
        <tr>
          <td>产品名称</td>
          <td>{{productInfo.name}}</td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                       @click="openBaseDialog('产品名称','name')">修改</el-button>
            </auth>
          </td>
        </tr>
        <tr>
          <td>首字母</td>
          <td>{{productInfo.firstWord}}</td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                       @click="openBaseDialog('首字母','firstWord')">修改</el-button>
            </auth>
          </td>
        </tr>
        <tr>
          <td>所属类别</td>
          <td>
            <span>{{exp.typeName}}</span>
          </td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                       @click="openBaseDialog('所属类别','type',beforeEditType)">修改</el-button>
            </auth>
          </td>
        </tr>
        <tr>
          <td>计价方式</td>
          <td>
            <span>{{exp.unitName}}</span>
          </td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                       @click="openBaseDialog('计价方式','unit',getUnitList)">修改</el-button>
            </auth>
          </td>
        </tr>
        <template v-for="(item, index) in serviceRel">
          <tr v-if="serviceRel && serviceRel.length > 0"
              :key="item.index">
            <td>&nbsp;&nbsp;&nbsp;&nbsp;{{item.serviceName}}</td>
            <td>
              <span class="m-r-md" style="width: 60px;display: inline-block;">{{item.price | amtFormat}} {{exp.unit || '元'}}</span>
              <span v-if="mercInfo.isOpenVipPrice">会员价
                <span v-if="typeof(item.vipPrice) == 'number'">{{item.vipPrice | amtFormat}} {{exp.unit || '元'}}</span>
                <span v-else="">无</span>
              </span>
            </td>
            <td>
              <auth perm="weixin.price.list.update">
                <el-button size="small"
                         @click="openPriceDialog(item)">修改</el-button>
              </auth>
            </td>
          </tr>
        </template>
        <tr>
          <td>折扣</td>
          <td>
            <span>{{exp.saleTypeName}}</span>
            <span v-if="productInfo.saleType == 2">（{{productInfo.discount}}%）</span>
          </td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                       @click="openBaseDialog('折扣','saleType',getSaleTypeList)">修改</el-button>
            </auth>
          </td>
        </tr>
        <tr>
          <td>输送类别</td>
          <td>
            <span>{{exp.tranTypeName}}</span>
            <p class="text-xs text-muted">输送线也选择滑杆，使用滑杆或输送线需要设置
              <a style="margin-left: 20px; color: #20a0ff"  target="_blank" href="http://help.twash.cn/archives/1951">怎样设置输送线和滑杆？</a>
            </p>
          </td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                       @click="openBaseDialog('输送类别','tranType',getTranTypeList)">修改</el-button>
            </auth>
          </td>
        </tr>
        <tr>
          <td>自定义数量</td>
          <td>
            <span v-if="productInfo.isCustomNum">是</span>
            <span v-if="!productInfo.isCustomNum">否</span>
          </td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                       @click="openBaseDialog('自定义数量','isCustomNum')">修改</el-button>
            </auth>
          </td>
        </tr>
        <tr>
          <td>序号</td>
          <td>{{productInfo.sortNo}}</td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                       @click="openBaseDialog('序号','sortNo')">修改</el-button>
            </auth>
          </td>
        </tr>
        <tr>
          <td>状态</td>
          <td>
            <span>{{exp.statusName}}</span>
          </td>
          <td>
            <auth perm="weixin.price.list.update">
              <el-button size="small"
                       @click="openBaseDialog('状态','status')">修改</el-button>
            </auth>
          </td>
        </tr>
        <tr>
          <td>创建时间</td>
          <td>
            <span>{{productInfo.createTime | getDateTime}}</span>
          </td>
          <td>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 修改-->
    <el-dialog class="ukao-dialog"
               v-loading="dialog.loading"
               :title="dialog.title"
               :visible.sync="dialog.visible"
               size="small">
      <div>
        <el-form :model="ruleForm"
                 ref="ruleForm"
                 label-width="150px">
          <el-form-item class="w-xxl"
                        label="产品名称"
                        prop="name"
                        v-if="dialog.attr == 'name'"
                        :rules="[
							{ required: true, message: '请输入产品名称', trigger: 'blur' },
							{ min: 1, max: 8, message: '长度在1到8个长度' } ]">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>

          <el-form-item class="w-xxl"
                        label="首字母"
                        prop="name"
                        v-if="dialog.attr == 'firstWord'"
                        :rules="[
							{ required: true, message: '请输入首字母', trigger: 'blur' },
							{ min: 1, max: 8, message: '长度在1到8个长度' } ]">
            <el-input v-model="ruleForm.firstWord"></el-input>
          </el-form-item>

          <el-form-item class="w-lg"
                        label="所属类别"
                        prop="typeId"
                        v-if="dialog.attr == 'type'"
                        :rules="[{ required: true, message: '请选择所属类别'}]">
            <el-select v-model="ruleForm.typeId"
                       clearable
                       placeholder="请选择所属类别"
                       @change="selectedProductType">
              <el-option :label="item.name + '('+item.businessName+')'"
                         :value="item.id"
                         :key="item.id"
                         v-for="item in productTypeList"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="w-lg"
                        label="计价方式"
                        prop="unit"
                        v-if="dialog.attr == 'unit' || dialog.attr == 'type'"
                        :rules="[{ required: true, message: '请选择计价方式' }]">
            <el-select v-model="ruleForm.unit"
                       placeholder="请选择计价方式">
              <el-option :label="item.showText"
                         :value="item.val"
                         :key="item.id"
                         v-for="item in unitList"></el-option>
            </el-select>
          </el-form-item>

          <!-- 修改服务项-->
          <div class="price-item"
               v-if="ruleForm.priceList && ruleForm.priceList.length > 0 &&dialog.attr == 'type'"
               v-loading="priceLoading">
            <el-form-item :label="item.serviceName"
                          :key="index"
                          v-for="(item, index) in ruleForm.priceList"
                          :prop="'priceList.' + index + '.price'"
                          :rules="[
										{ required: true, message: '请输入价格' },
										{ type: 'number', message: '请输入有效价格' },
										{validator: checkAmount, min:0, max:99999, message: '有效金额0至99999', trigger: 'blur'}
									]">
              <el-input style="margin-right: 0px" v-model.number="item.price"
                        type="number"
                        placeholder="请输入价格"></el-input>
              <span class="m-r-md ">{{unit || '元'}}</span>
              <span v-if="mercInfo.isOpenVipPrice">
                <span>会员价</span>
                <el-input v-model.number="item.vipPrice"
                          type="number"
                          placeholder="请输入价格"></el-input>
                <span>{{unit || '元'}}</span>
              </span>
            </el-form-item>
          </div>

          <el-form-item class="w-lg"
                        label="折扣"
                        prop="saleType"
                        v-if="dialog.attr == 'saleType'"
                        :rules="[
							{ required: true, message: '请选择折扣' }]">
            <el-select v-model="ruleForm.saleType"
                       placeholder="请选择折扣">
              <el-option :label="item.showText"
                         :value="item.val"
                         :key="item.id"
                         v-for="item in saleTypeList"></el-option>
            </el-select>
          </el-form-item>

          <div class="price-item"
               v-if="ruleForm.saleType == 2 && dialog.attr == 'saleType'">
            <el-form-item class="w-xxl"
                          label="折扣比例"
                          prop="discount"
                          :rules="[
									{ required: true, message: '请输入折扣比例' },
									{ type: 'number', message: '折扣比例1至100之间的整数' },
								]">
              <el-input v-model.number="ruleForm.discount"
                        type="number"
                        placeholder="请输入折扣比例"></el-input>
              <span>%</span>
            </el-form-item>
          </div>

          <el-form-item label="输送类别"
                        prop="tranType"
                        v-if="dialog.attr == 'tranType'"
                        :rules="[
					    { required: true, message: '请选择输送类别' }
					  ]">
            <el-select class="w-lg"
                       v-model="ruleForm.tranType"
                       placeholder="请选择输送类别">
              <el-option :label="item.showText"
                         :value="item.val"
                         :key="item.id"
                         v-for="item in tranTypeList"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="自定义数量"
                        v-if="dialog.attr == 'isCustomNum'"
                        prop="isCustomNum">
            <el-switch active-color="#13ce66"
                       v-model="ruleForm.isCustomNum"
                       inactive-color="#dcdcdc"
                       :width="74"
                       :active-value="1"
                       :inactive-value="0"
                       on-text="是"
                       off-text="否">
            </el-switch>
            <p class="text-muted text-xs">门店入库选择服务项是否允许自定义数量</p>
          </el-form-item>

          <el-form-item class="w-xxl"
                        label="序号"
                        prop="sortNo"
                        v-if="dialog.attr == 'sortNo'"
                        :rules="[
								{ type:'number', required: false, message: '序号必须为整数'}]">
            <el-input v-model.number="ruleForm.sortNo"
                      type="number"></el-input>
          </el-form-item>

          <el-form-item label="状态"
                        v-if="dialog.attr == 'status'"
                        prop="status">
            <el-switch active-color="#13ce66"
                       v-model="ruleForm.status"
                       inactive-color="#dcdcdc"
                       :active-value="1"
                       :inactive-value="0"
                       active-text="已启用"
                       inactive-text="已停用">
            </el-switch>
          </el-form-item>

          <el-form-item>
            <el-button @click="dialog.visible=false">取消</el-button>
            <el-button type="primary"
                       @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 修改单项服务项-->
    <el-dialog class="ukao-dialog"
               :title="dialogPrice.title"
               :visible.sync="dialogPrice.visible"
               size="small">
      <el-form :model="rulePriceForm"
               ref="rulePriceForm"
               label-width="150px">
        <div class="price-item">
          <el-form-item class="w-xxl"
                        :label="dialogPrice.label"
                        prop="price"
                        :rules="[
								{ required: true, message: '请输入价格' },
								{ type: 'number', message: '请输入有效价格' },
								{validator: checkAmount, min:0, max:99999, message: '有效金额0至99999', trigger: 'blur'}
							]">
            <el-input v-model.number="rulePriceForm.price"
                      type="number"
                      placeholder="请输入价格"></el-input>
            <span>{{exp.unit || '元'}}</span>
          </el-form-item>
          <el-form-item class="w-xxl" v-if="mercInfo.isOpenVipPrice" label="会员价" prop="vipPrice" :rules="[
								{validator: checkAmount, ignoreEmpty:true, min:0, max:99999, message: '有效金额0至99999', trigger: 'blur'}
							]">
            <el-input v-model.number="rulePriceForm.vipPrice"
                      type="number"
                      placeholder="请输入价格"></el-input>
            <span>{{exp.unit || '元'}}</span>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button @click="dialogPrice.visible=false">取消</el-button>
          <el-button type="primary"
                     @click="submitPriceForm('rulePriceForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <imgDialog v-model="imgVisible"
               :imgPath="productInfo.imgPath"
               :keywords="productInfo.name"
               @confirm="submitImg"></imgDialog>
  </div>
</template>

<script>
import imgDialog from "@/components/Product/upload_img_dialog";
import product from "@/utils/mixins/product_detail";

export default {
  mixins: [product],

  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.loading = true;
      this.getDetail(this.$route.params.id).then(res => {
        this.productInfo = res.data.data;
        this.exp = res.data.exp;
        this.serviceRel = res.data.serviceRel;
        this.loading = false;
        this.getServiceRel(this.productInfo.businessId);
      });
    }
  },
  components: {
    imgDialog
  }
};
</script>

<style scoped>
.price-item {
  margin-bottom: 15px;
}
.price-item:last-child {
  margin-bottom: 0;
}
.price-item .el-checkbox {
  width: 120px;
}
.price-item .el-input {
  width: 120px;
  margin-right: 10px;
}
</style>