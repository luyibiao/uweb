经营项目展示类型

<style lang="less" scoped>
@success: #13ce66;
.business-type {
  border: 1px solid #e5e5e5;
  width: 134px;
  display: inline-block;
  cursor: pointer;
  & + & {
    margin-left: 15px;
  }
  &.active {
    position: relative;
    border-color: @success;
    &::before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border: 14px solid;
      border-color: transparent @success @success transparent;
    }
    &::after {
      content: "\2714";
      font-family: element-icons !important;
      position: absolute;
      bottom: 0;
      right: 2px;
      font-size: 12px;
      font-weight: normal;
      color: #fff;
    }
  }
}
.business-box {
  font-size: 0;
  overflow: hidden;
}
.business-tips {
  padding: 2px 0 6px;
  color: #797979;
  text-align: center;
}
.business-item {
  background-color: #d5eeff;
}
.type1 {
  padding: 4px;
  .business-item {
    width: 38px;
    height: 38px;
    margin: 2px;
    display: inline-block;
  }
}
.type2 {
  padding: 2px 4px;
  .business-item {
    margin: 4px 2px;
    height: 24px;
  }
}
</style>

<template>
  <div>
    <auth perm="weixin.project.update">
      <div class="business-type"
           :class="{'active' :type == 1}"
           @click="chagneType(1)">
        <div class="business-box type1"
             v-once>
          <div class="business-item"
               v-for="item in 6"></div>
        </div>
        <div class="business-tips">1行3个</div>
      </div>
      <div class="business-type"
           :class="{'active' :type == 2}"
           @click="chagneType(2)">
        <div class="business-box type2"
             v-once>
          <div class="business-item"
               v-for="item in 3"></div>
        </div>
        <div class="business-tips">1行1个</div>
      </div>
      <template slot="noPerm">
        <div class="business-type"
             :class="{'active' :type == 1}">
          <div class="business-box type1"
               v-once>
            <div class="business-item"
                 v-for="item in 6"></div>
          </div>
          <div class="business-tips">1行3个</div>
        </div>
        <div class="business-type"
             :class="{'active' :type == 2}">
          <div class="business-box type2"
               v-once>
            <div class="business-item"
                 v-for="item in 3"></div>
          </div>
          <div class="business-tips">1行1个</div>
        </div>
      </template>
    </auth>
  </div>
</template>
<script>
import msg from "@/utils/msg";
export default {
  props: {
    type: {
      default: 1,
      type: [String, Number]
    }
  },
  methods: {
    chagneType(type) {
      if (type != this.type) {
        msg.confirm({
          msg: "确定选用当前模式？",
          confirmFn: _ => {
            this.postType(type).then(res => {
              this.$emit("update:type", type);
              msg.success();
            });
          }
        });
      }
    },
    postType(type) {
      return this.$store.dispatch("post", {
        uri: "mercCityParam/update",
        data: {
          bizStyle: type
        }
      });
    }
  }
};
</script>
