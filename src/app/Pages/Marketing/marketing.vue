<template>
  <div class="ukao-padder ukao-pt-md">
    <div class="second-nav-list">
      <p class="text-center bg-subnav b-b b-t wrapper-sm">营销中心</p>
    </div>
    <div>
      <div>
        <p class="title text-md">热门畅销</p>
        <ul class="categorys clearfix">
          <li class="category-item"
              v-for="(item,index) in list"
              :key="index">
            <router-link :to="item.requestUrl"
                         tag="div"
                         class="clearfix item-box">
              <img class="logo pull-left"
                   :src="item.iconcls"
                   alt="">
              <div class="content">
                <p class="l-h-2x">
                  {{item.name}}
                </p>
                <p class="l-h-2x text-muted text-xs text-ellipsis">{{item.remark}}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import vBackTo from "../Common/backto.vue";
import auth from '@/utils/auth';
export default {
  components: {
    vBackTo
  },
  data: function() {
    return {
      list: auth.getChildMenu('marketing')
    };
  }
};
</script>

<style lang="less" scoped>
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
.categorys {
  margin-right: -30px;
}
.category-item {
  float: left;
  width: 20%;
  padding: 22px 30px 0 0;
  box-sizing: border-box;
  cursor: pointer;
  .logo {
    width: 60px;
    height: 60px;
    display: inline-block;
  }
  .content {
    margin-top: 4px;
    margin-left: 70px;
  }
}
@media screen and (max-width: 1366px) {
  .category-item {
    width: 25%;
  }
}
</style>