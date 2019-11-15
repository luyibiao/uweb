<style lang="less" scoped>
.side-left {
  width: 320px;
}
.content {
  margin-left: 350px;
  overflow: hidden;
}
.el-tag {
  & + & {
    margin-left: 10px;
  }
}
.card {
  padding: 15px 20px;
  background-color: #c8a450;
  border-radius: 6px;
  color: #fff;
  &-title {
    font-size: 16px;
  }
  .amount {
    font-size: 24px;
    margin-right: 4px;
  }
}
.card-cnt {
  border-top: 1px solid #e7e7e7;
  padding-top: 10px;
  position: relative;
  &::before,
  &::after {
    position: absolute;
    left: 50%;
    margin-left: -10px;
    content: "";
    width: 0;
    height: 0;
    border: 10px solid transparent;
  }
  &::before {
    top: -20px;
    border-bottom-color: #e7e7e7;
  }
  &::after {
    top: -19px;
    border-bottom-color: #fff;
  }
}
</style>

<template>
	<div class="clearfix">
    <div class="m-b-md">
      <el-breadcrumb class="link-back" separator="/">
        <el-breadcrumb-item to="/marketing/recharge">
          <i class="el-icon-arrow-left icon-smaller"></i>充值卡列表</el-breadcrumb-item>
        <el-breadcrumb-item>新建充值卡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
		<div class="pull-left side-left">
			<div class="card m-b-lg">
				<div class="card-title m-b-md">充值卡</div>
				<div class="text-center m-b-lg">
					<p class="m-b"><span class="amount">{{form.faceValue || 0}}</span>元</p>
          <p v-if="form.limitType && form.useNumLimit">每人领取限制{{form.useNumLimit}}张</p>
          <p v-else>没有领取限制</p>
				</div>
				<div class="text-center text-xs">
          <template v-if="form.timeStart">
            {{form.timeStart | getDate}}
          </template>
          <template v-else>-</template>
            至
          <template v-if="form.timeEnd">
            {{form.timeEnd | getDate}}
          </template>
          <template v-else>-</template>
				</div>
			</div>
			<div class="card-cnt text-center">
        制作<span class="text-xl m-l-xs m-r-xs">{{form.cnt || 0}}</span>张卡
      </div>
		</div>
		<div class="content">
			<el-form ref="form" :model="form" :rules="rules" label-width="120px">
				<el-form-item label="面值" prop="faceValue">
					<el-input class="w m-r-xs" placeholder="输入每张的面值" v-model="form.faceValue"></el-input>元
				</el-form-item>
				<el-form-item label="制作总数量" prop="cnt">
					<el-input class="w m-r-xs" placeholder="输入制作卡的数量" v-model="form.cnt"></el-input>张
				</el-form-item>
				<el-form-item label="每人领取限制" required>
					<el-radio-group v-model="form.limitType" @change="limitTypeChange">
						<div>
							<el-radio :label="0">不限制</el-radio>
						</div>
						<el-radio :label="1">
							每人限制领取
							<el-form-item class="dis-inline" prop="useNumLimit">
								<el-input class="w m-l-xs m-r-xs" v-model="form.useNumLimit"></el-input>张
							</el-form-item>
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="生效时间" prop="timeStart">
					<el-date-picker
						v-model="form.timeStart"
						type="date"
						placeholder="选择日期"
						:picker-options="pickerOptionsStart">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="失效时间" prop="timeEnd">
					<el-date-picker
						v-model="form.timeEnd"
						type="date"
						placeholder="选择日期"
						:picker-options="pickerOptionsEnd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="兑换同步打标签">
          <el-select v-model="form.tagIds" multiple placeholder="请选择">
            <el-option
              v-for="item in tags.list"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
            <p class="text-center" v-if="tags.list.length < tags.total">
              <el-button type="text" size="small" :loading="tags.loading" @click="getTagList">查找更多</el-button>
            </p>
          </el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input class="w-xl" type="textarea" :rows="3" v-model.trim="form.detail"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button>取消</el-button>
					<el-button type="primary" @click="submit('form',createRecharge)" :loading="saving">保存</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import timeLite from "@/utils/helpers/timeLite";
import calculation from "@/utils/helpers/calculation";
import validate from "@/utils/helpers/validate";

export default {
  data() {
    let self = this;
    const validateAmt = (rule, value, callback) => {
      validate.amount(value, 2, 0.01, 99999)
        ? callback()
        : callback(new Error("金额格式错误"));
    };
    const validateCnt = (rule, value, callback) => {
      validate.amount(value, 0, 1, 99999)
        ? callback()
        : callback(new Error("数量格式错误"));
    };
    return {
      pickerOptionsStart: {
        disabledDate(time) {
          return (
            (self.form.timeEnd &&
              time.getTime() > self.form.timeEnd.getTime()) ||
            time.getTime() < Date.now() - 8.64e7
          );
        }
      },
      pickerOptionsEnd: {
        disabledDate(time) {
          return (
            (self.form.timeStart &&
              time.getTime() < self.form.timeStart.getTime()) ||
            time.getTime() < Date.now() - 8.64e7
          );
        }
      },
      form: {
        faceValue: "",
        cnt: "",
        limitType: 0,
        useNumLimit: "",
        timeStart: "",
        timeEnd: "",
        detail: "",
        tagIds: []
      },
      saving: false,
      rules: {
        faceValue: [
          { required: true, message: "请输入面值金额" },
          { validator: validateAmt }
        ],
        cnt: [
          { required: true, message: "请输入总数量" },
          { validator: validateCnt }
        ],
        useNumLimit: [
          {
            validator(rule, value, callback) {
              self.form.limitType === 1
                ? validateCnt(rule, value, callback)
                : callback();
            }
          }
        ],
        timeStart: [{ required: true, message: "请选择生效时间" }],
        timeEnd: [{ required: true, message: "请选择失效时间" }]
      },
      tags: {
        total: 0,
        current: 1,
        size: consts.PAGE_SIZE20,
        list: []
      }
    };
  },
  created() {
    this.getTagList();
  },
  methods: {
    // 领取限制改变 清除表单限制数量验证
    limitTypeChange(value) {
      if (value === 0) {
        this.$refs.form.validateField("useNumLimit");
      }
    },
    // form提交
    submit(name, fn) {
      this.$refs[name].validate(valid => {
        if (valid) {
          fn && fn();
        }
      });
    },
    // 获取标签列表
    getTagList() {
      this.tags.loading = true;
      this.$store
        .dispatch("get", {
          uri: "userTag/list",
          params: {
            startRow: (this.tags.current - 1) * this.tags.size,
            pageSize: this.tags.size
          }
        })
        .then(res => {
          this.tags.list = this.tags.list.concat(res.data.data.list);
          this.tags.total = res.data.data.total;
          this.tags.current++;
          this.tags.loading = false;
        });
    },
    // 创建充值卡
    createRecharge() {
      this.saving = true;
      this.$store
        .dispatch("post", {
          uri: "rechargeCard/batch/add",
          data: {
            faceValue: calculation.accMul(this.form.faceValue, 100),
            cnt: this.form.cnt,
            useNumLimit: this.form.limitType == 0 ? 0 : this.form.useNumLimit,
            timeStart: timeLite.getDate(this.form.timeStart),
            timeEnd: timeLite.getDate(this.form.timeEnd),
            tagIds: this.form.tagIds.join(","),
            detail: this.form.detail
          },
          forceResolve: true
        })
        .then(res => {
          if (200 === res.data.httpCode) {
            msg.success("新建成功");
            this.$router.push("list");
          } else {
            msg.error(res.data.msg || consts.ERROR_MSG);
            this.saving = false;
          }
        });
    }
  }
};
</script>
