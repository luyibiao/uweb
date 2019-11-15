<template>
  <el-upload
    :class="customClass || 'u-avatar-uploader'"
    :action="uploadUrl()"
    :disabled="disabled"
    :with-credentials="true"
    :on-change="handleAvatarChange"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :auto-upload="!manual"
    :show-file-list="false">
    <slot slot="trigger">
      <template v-if="imgPath">
        <img v-if="type == 'image' && !hideImg" :src="imgPath" class="u-avatar">
        <video v-if="type == 'video'" :src="imgPath"></video>
      </template>
      <i v-else class="el-icon-plus"></i>
    </slot>
    <div slot="tip" class="text-muted text-xs">{{tips}}</div>
  </el-upload>
</template>

<script>
  import msg from '@/utils/msg'
 	import consts from '@/utils/consts'
 	import validate from '@/utils/helpers/validate'

export default {
  props: [
    'customClass', //自定义class
    'disabled', //是否停用
    'path', //图片路径
    'tip',  //上传信息说明
    'action', //上传地址
    'accept', //文件格式
    'fileType', // 当前文件类型
    'size',  //大小（单位:M）
    'beforeFn',  //文件上传前调用
    'changeFn', //上传文件改变调用
    'successFn', //上传成功调用
    'saveSuccessFn', //保存成功调用
    'errorFn', //格式错误处理
    'manual', //是否手动上传
    'hideImg' //隐藏图片
  ],
  data(){
    return {
      imgPath:'',
      tips:'文件大小不能超过2M',
      act:'/attachment/uploadFile',
      clas:'u-avatar-uploader',
      acct:'image',
      type: 'image',
      sz: 2 , //大小(M)
      global:{
        state: true
      },
      file:{
        name:'',
        type:'',
        uid:0,
        url:'',
      },
    }
  },
  created () {
    this.initData()
  },
  watch :{
    'path'(){
      this.imgPath = this.path;
    },
    'size'(){
      this.sz = this.size || this.sz
    },
    'action'(){
      this.act = this.action || this.act
    },
    'tip'(){
      this.tips = this.tip || this.tips
    },
    'accept'(){
      this.acct = this.accept || this.acct
    },
    'fileType'(){
      this.type = this.fileType || this.type
    }
  },
  methods: {
    initData(){
      this.imgPath = this.path || this.imgPath
      this.tips = (this.tip || this.tip === "") ?  this.tip : this.tips;
      this.act = this.action || this.act
      this.acct = this.accept || this.acct
      this.type = this.fileType || this.type
      this.sz = this.size || this.sz
    },
    uploadUrl(){
      return consts.BASE_URL + this.act
    },
    handleAvatarChange(file){
      if(file.status == 'ready'){
        if(this.manual){ //手动上传,判断图片大小和格式，合格则保存图片链接
          if(this.acct === 'image') {
            const isImg = validate.image(file.raw.type)
            if (!isImg) {
              msg.error('上传文件不是图片！');
              return isImg
            }
          }
          const isLtNM = file.size / Math.pow(1024, this.sz)  < this.sz;
          if (!isLtNM) {
            msg.error('上传图片大小不能超过 '+this.sz+'MB!');
            return isLtNM
          }
        }
        this.file.uid = file.uid;
        this.file.url = file.url;
        this.imgPath = file.url;
        //修改时调用
        if(typeof (this.changeFn) === 'function'){
            this.changeFn(file)
        }
      }
    },
    handleAvatarSuccess(res, file) {
      let fileNames = res.data||[]
      if(fileNames[0]){
        this.imgPath = fileNames[0].path
        this.saveAttachment({
          sortNo:1,
          name: file.raw.name || this.file.name,
          path: this.imgPath,
          size: file.raw.size,
          type: file.raw.type || this.file.type,
          remark:null
        })
      }

      if(this.global.state && validate.image(file.type)) {
        var imgPath = URL.createObjectURL(file.raw);
        this.imgPath = imgPath
      }
      
      //成功调用
      if(typeof (this.successFn) === 'function'){
        this.successFn([this.imgPath], this.type)
      }
    },
    beforeAvatarUpload(file) {
      if(!this.uploadNewest(file)){
        return false;
      }

      this.file.type = file.type;
      this.file.name = file.name;
      if(this.acct === 'image') {
        const isImg = validate.image(file.type)
        this.global.state = isImg
        if (!isImg) {
          msg.error('上传文件不是图片！');
          if(typeof (this.errorFn) === 'function'){
            this.errorFn(file)
          }
          return isImg
        }
      } else if (this.acct === 'movie|image') {
        const isImg = validate.image(file.type);
        if (file.type.startsWith('video')) {
          this.type = "video";
        }
        if (!isImg && file.type != 'video/mp4') {
          msg.error('上传文件不是图片或视频！');
          if(typeof (this.errorFn) === 'function'){
            this.errorFn(file)
          }
          return false;
        }
      }
      const isLtNM = file.size / Math.pow(1024, this.sz)  < this.sz;
      this.global.state = !isLtNM
      if (!isLtNM) {
        msg.error('上传图片大小不能超过 '+this.sz+'MB!');
        if(typeof (this.errorFn) === 'function'){
          this.errorFn(file)
        }
        return isLtNM
      }

      if(typeof (this.beforeFn) === 'function'){
        this.beforeFn(file)
      }
    },
    saveAttachment(att){
      this.$store.dispatch('post', {
        uri: 'attachment/save',
        data: att
      }).then((res) => {
        if(typeof (this.saveSuccessFn) === 'function'){
          this.saveSuccessFn(res.data)
        }
      })
    },
    // 只上传最新文件
    uploadNewest(file){
      return file.uid  === this.file.uid;
    }
  }
}
</script>