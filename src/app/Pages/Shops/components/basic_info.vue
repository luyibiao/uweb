<template>
  <div class="info-group">
    <div class="info-group-title relase-bg">基本信息</div>
    <div class="info-group-cont relase-bg">
      <el-form ref="baseForm"
               label-width="120px"
               :model="form"
               :rules="rules">
        <el-form-item label="商品类目：">
          {{categoryName}}
        </el-form-item>
        <el-form-item label="商品分组："
                      prop="groupIds">
          <el-select class="w-md m-r-sm"
                     v-model="form.groupIds"
                     multiple
                     placeholder="请选择商品分组">
            <el-option v-for="item in groupsList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <a class="text-primary" target="_blank" :href="'/shops/group'">新建分组</a>
          <el-button type="text" @click="getGroup">刷新</el-button>
        </el-form-item>
        <el-form-item label="商品类型："
                      prop="type">
          <el-radio-group v-model="form.type">
            <el-radio v-for="item in typesList"
                      :key="item.val"
                      :label="item.val" @change="getNeedSend(item)">{{item.text}}
              <span class="text-muted text-xs">{{item.attr1Remark}}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    groupIds: {
      default: _ => {
        return [];
      }
    },
    categoryName: {
      default: "无"
    },
    type: {
      default: ""
    }
  },
  data() {
    return {
      form: {
        type: "",
        groupIds: []
      },
      typesList: [],
      groupsList: [],
      rules: {
        type: [{ required: true, message: "请选择商品类型" }],
        groupIds: [{ required: true, message: "请选择商品分组" }]
      }
    };
  },
  created() {
    this.getTypes();
    this.getGroup();
  },
  watch: {
    groupIds(n) {
      if (n.length) {
        this.form.groupIds = n;
      }
    },
    type(n) {
      this.form.type = n.toString();
    }
  },
  methods: {
    // 获取商品类型
    getTypes() {
      this.$store
        .dispatch("post", {
          uri: "sysDicVal/goods/types"
        })
        .then(res => {
          this.typesList = res.data.data;
        });
    },
    // 获取商品分组
    getGroup() {
      this.$store
        .dispatch("post", {
          uri: "goodsGroup/list"
        })
        .then(res => {
          this.groupsList = res.data.data.list;
        });
    },
    // 校验表单
    validate() {
      let flag = false;
      this.$refs.baseForm.validate(valid => {
        flag = valid;
      });
      return flag;
    },
    // 获取表单数据
    getData() {
      return {
        type: this.form.type,
        groupIds: this.form.groupIds.join(",")
      };
    },
    getNeedSend(e){
      this.$emit("getNeedSend", {"needSend": e.attr1, "type": e.val});
    }
  }
};
</script>