<template>
  <div>
    <el-dialog class="clothing-bg" :visible.sync="dialogShow" :fullscreen="true" @open="" @close="closeDialog">
      <img class="enlarge-img" :src="imgUrl">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: [
      "imgUrl",
      "show"
    ],
    watch: {
      show(val){
        this.dialogShow = val
      }
    },
    data() {
      return {
        dialogShow: false,
      }
    },
    created () {
      document.addEventListener("keydown", this.keyboardClosedDialog);
    },
    methods: {
      keyboardClosedDialog(e) {
        e || (e = window.event);
        if (this.show && e.keyCode === 27) {
          this.closeDialog();
        }
      },
      closeDialog() {
        this.$emit('update:show', false);
      }
    }
  }
</script>
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
<style scoped>
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

