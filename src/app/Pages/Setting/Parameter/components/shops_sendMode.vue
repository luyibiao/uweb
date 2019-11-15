<template>
  <div>
    <!-- 配送方式信息 -->
    <el-table class="ukao-el-table"
              :data="sendData">
      <el-table-column min-width="100px"
                       label="配送方式">
        <template slot-scope="scope">
          {{scope.row.showName || scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column min-width="100px"
                       label="免运费">
        <template slot-scope="scope">
          <span :class="{'text-danger':scope.row.attr == '1'}">
            {{scope.row.attr == '1' ? '否' : '是'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px"
                       label="自提门店">
        <template slot-scope="scope">
          <span :class="scope.row.ext.storeEnable == 1 ? 'text-success' : 'text-danger'">
            {{scope.row.ext.storeEnable == 1 ? '开启' : '关闭'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px"
                       label="状态">
        <template slot-scope="scope">
          <span :class="scope.row.enable == 1 ? 'text-success' : 'text-danger'">
            {{scope.row.enable == 1 ? '开启' : '关闭'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px"
                       label="操作">
        <template slot-scope="scope">
          <auth perm="setting.parameter.mall">
            <el-button size="small"
                     @click="openDialog(scope.row)">修改</el-button>
            <template slot="noPerm">-</template>
          </auth>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改弹窗 -->
    <el-dialog title="修改"
               custom-class="ukao-dialog-md"
               :visible.sync="dialogVisible"
               size="tiny">
      <el-form ref="sendForm"
               :model="form"
               :rules="rules"
               label-width="120px">
        <el-form-item prop="showName"
                      label="配送方式名称：">
          <el-input class="w-md"
                    v-model.trim="form.showName"></el-input>
        </el-form-item>
        <el-form-item prop="attr"
                      required
                      label="免运费：">
          <el-radio-group v-model="form.attr">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item required
                      label="自提门店：">
          <el-switch v-model="form.ext.storeEnable"
                     :active-value="1"
                     :inactive-value="0"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     active-text="开启"
                     inactive-text="关闭">
          </el-switch>
        </el-form-item>
        <el-form-item required
                      prop="enable"
                      label="使用状态：">
          <el-switch v-model="form.enable"
                     :active-value="1"
                     :inactive-value="0"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     active-text="开启"
                     inactive-text="关闭">
          </el-switch>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary"
                   :loading="updating"
                   @click="onSubmit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import msg from "@/utils/msg";

export default {
  data() {
    return {
      dialogVisible: false,
      updating: false,
      sendData: [],
      form: {
        id: "",
        showName: "",
        enable: 1,
        attr: "1",
        ext: {
          storeEnable: 0
        }
      },
      rules: {
        showName: [
          { required: true, message: "请输入配送名称" },
          { min: 2, max: 32, message: "长度在 2 到 32 个字符" }
        ],
        enable: {
          validator: (rule, value, callback) => {
            if (value) {
              callback();
            } else {
              this.sendData
                .filter(item => item.id !== this.form.id)
                .filter(item => item.enable).length > 0
                ? callback()
                : callback(new Error("不能关闭所有配送方式"));
            }
          }
        }
      }
    };
  },
  created() {
    this.getSendMode();
  },
  methods: {
    getSendMode() {
      this.$store
        .dispatch("get", {
          uri: "mall/config/send/list"
        })
        .then(res => {
          res.data.data.forEach(item => {
            item.ext = JSON.parse(item.ext);
            if (!item.ext || item.ext.storeEnable === undefined)
              item.ext = { storeEnable: 0 };
          });
          this.sendData = res.data.data;
        });
    },
    openDialog(item) {
      if (this.$refs.sendForm) this.$refs.sendForm.resetFields();
      Object.keys(this.form).forEach(key => {
        this.form[key] = item[key];
      });
      this.dialogVisible = true;
      this.updating = false;
    },
    onSubmit() {
      let data = {
        ...this.form
      };
      data.ext = JSON.stringify(data.ext);
      this.$refs.sendForm.validate(valid => {
        if (valid) {
          this.updating = true;
          this.updatedSendMode(data, this.updatedSuccess);
        }
      });
    },
    updatedSuccess() {
      msg.success("修改成功!");
      let index = this.sendData.findIndex(item => item.id === this.form.id);
      Object.keys(this.form).forEach(key => {
        this.sendData[index][key] = this.form[key];
      });
      this.dialogVisible = false;
    },
    updatedSendMode(data, success) {
      this.$store
        .dispatch("post", {
          uri: "mall/config/update",
          data,
          forceResolve: true
        })
        .then(res => {
          200 === res.data.httpCode
            ? success && success()
            : msg.error(res.data.msg);
          this.updating = false;
        });
    }
  }
};
</script>

配送方式设置