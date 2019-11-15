<!-- 微信店铺横幅 -->
<template>
  <div v-show="isShow">
    <div class="enabled-tip text-center text-white wrapper">
        <p class="title m-b-sm">{{title || "微信店铺未启用" }}</p>
        <p>{{msg || "若要启用该功能，需由品牌管理员开启"}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["isShow", "title", "msg"],
    data () {
      return {
        mercCity:{

        },
      }
    },
    created (){

    },
    mounted (){

    },
    methods:{


    }
  }
</script>

<style scoped>
.enabled-tip {
 	background-color: #f17a3f;
 	border: 1px solid #c8000d;
  margin-bottom: 15px;
 }
 .enabled-tip .title {
 	font-size: 18px;
 }
</style>