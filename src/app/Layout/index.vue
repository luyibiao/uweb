<template>
  <div>
    <div class="header">
      <v-head ref="headbar"></v-head>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
    <div class="footer">
      <a class="text-xs text-muted" href="https://www.twash.cn/" target="_blank">{{brandName}}</a>
    </div>
  </div>
</template>

<script>
import vHead from "./components/Header/index.vue";
import consts from "@/utils/consts";
export default {
  name: "layout",
  components: {
    vHead
  },
  data: function() {
    return {
      brandName: consts.BRAND_NAME
    };
  }
};
</script>


<style lang="scss" scoped src="./theme/styles/index.scss"></style>