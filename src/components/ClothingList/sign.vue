<style lang="less" scoped>
.square {
  position: relative;
  padding-bottom: 100%;
  .content {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
.enlarge-img {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  max-width: 90%;
  max-height: 90%;
  vertical-align: middle;
}
</style>
<style lang="less">
.clothing-bg {
  .el-dialog {
    background: #000;
  }
  .el-dialog__body {
    position: absolute;
    left: 0;
    top: 38px;
    bottom: 0;
    right: 0;
  }
  .el-carousel__arrow{
    font-size: 36px;
    border-radius:0;
  }
}
</style>

<template>
  <div v-if="list.length">
    <p class="text-md text-black  m-b-md">签名图片</p>
    <el-row :gutter="20">
      <el-col class="m-b-md" :sm="6" :md="4" :lg="3" v-for="(item,index) in list" :key="index">
        <div class="square">
          <div class="content" :style="`background-image: url(${item.cameraImg});`" @click="enlargeImg(index)"></div>
        </div>
      </el-col>
    </el-row>
    <!-- 图片放大弹窗 -->
    <el-dialog class="clothing-bg" :visible.sync="enlarge" :fullscreen="true">
      <el-carousel
        ref="carousel"
        class="h-full"
        height="100%"
        indicator-position="none"
        :initial-index="imgIndex"
        :autoplay="false"
        arrow="always">
        <el-carousel-item class="text-center" v-for="(item,index) in list" :key="index">
          <img class="enlarge-img" :src="item.cameraImg" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    //订单id
    orderId: {
      type: [Number, String],
      default: ""
    },
    // 衣物id
    orderProId: {
      type: [Number, String],
      default: ""
    }
  },
  data() {
    return {
      // 放大图片
      enlarge: false,
      // 图片列表
      list: [],
      imgIndex: 0
    };
  },
  created() {
    document.addEventListener("keydown", this.keyboardChangeImg);
    this.getImgList();
  },
  methods: {
    // 获取订单列表
    getImgList() {
      this.$store
        .dispatch("post", {
          uri: "orderProductSignImg/list",
          data: {
            orderId: this.orderId,
            orderProId: this.orderProId
          }
        })
        .then(res => {
          this.list = res.data.data;
        });
    },
    // 放大查看图片
    enlargeImg(index) {
      this.imgIndex = index;
      this.enlarge = true;
      this.$nextTick(_ => {
        //移动到目标图片
        this.$refs.carousel.setActiveItem(index);
      });
    },
    keyboardChangeImg(e) {
      e || (e = window.event);
      if (this.enlarge) {
        if (e.keyCode === 37) {
          this.$refs.carousel.prev();
        } else if (e.keyCode == 39) {
          this.$refs.carousel.next();
        }
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keyboardChangeImg);
  }
};
</script>
/*
衣物照片组件
 */