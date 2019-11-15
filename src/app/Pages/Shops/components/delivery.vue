<template>
  <div>
    <el-table
      :data="goods"
      border
      tooltip-effect="dark"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column label="商品">
        <template slot-scope="scope">
          <p class="text-primary l-h">{{scope.row.goodsName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="count" width="80"></el-table-column>
      <el-table-column label="物流 | 单号">
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statusText" width="100"></el-table-column>
    </el-table>
    <el-form ref="form" :model="form" label-width="90px" class="m-t-sm">
      <p class="text-center text-xs l-h36"><span class="text-danger">*</span>请仔细填写物流公司及快递单号，发货后24小时内仅支持做一次更正，逾期不可修改</p>
      <el-form-item label="收货地址">
        <div>{{address}}</div>
      </el-form-item>
      <el-form-item label="发送方式">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">物流发货</el-radio>
          <el-radio :label="2">无需物流</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row v-show="form.type !== 2">
        <el-col :span="12">
          <el-form-item label="物流公司" prop="companyName" :rules="rules">
            <el-input v-model="form.companyName"></el-input>
            <!-- <el-select 
              v-model="form.companyName" 
              filterable
              allow-create>
              <el-option
                v-for="item in companys"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>       -->
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="快递单号" prop="transNo" :rules="rules">
            <el-input v-model="form.transNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="form.type !== 2">
        <el-col :span="12">
          <el-form-item label="配送员姓名">
            <el-input v-model="form.name"></el-input>   
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-right">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button :loading="saving" type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";
export default {
  props: ["goods", "address"],
  data() {
    return {
      saving: false,
      // 选择的商品
      selectedGoods: [],
      // 物流公司
      companys: [],
      // 表单
      form: {
        type: 1,
        goodsIds: "",
        companyVal: "",
        companyName: "",
        transNo: "",
        name: "",
        phone: ""
        // deliverDime: "",
        // price: ""
      },
      rules: [
        {
          validator:(rule, value, callback)=> {
            if (this.form.type === 1) {
              value ? callback() : callback(new Error("请输入内容"));
            } else {
              callback();
            }
          },
          trigger: "blur"
        }
      ]
    };
  },
  methods: {
    handleSelectionChange(arr) {
      this.selectedGoods = arr;
    },
    checkForm() {
      if (!this.selectedGoods.length) {
        msg.warning("请选择商品");
        return false;
      }
      return true;
    },
    submit() {
      if (this.checkForm()) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.saving = true;
            let data = {};
            let goodsIds = [];
            this.selectedGoods.forEach(item => {
              goodsIds.push(item.id);
            });
            data.goodsIds = goodsIds.join(",");
            let uri = "mall/logistics/send";
            if (this.form.type === 1) {
              data.companyName = this.form.companyName;
              data.transNo = this.form.transNo;
              data.name = this.form.name;
              data.phone = this.form.phone;
              uri = "mall/logistics/add";
            }
            this.save(uri, data).then(res => {
              this.$emit("success");
              this.saving = false;
            });
          }
        });
      }
    },
    // 提交 订单物流信息
    save(uri, data) {
      return this.$store.dispatch("post", {
        uri,
        data
      });
    }
  }
};
</script>

// 发货
