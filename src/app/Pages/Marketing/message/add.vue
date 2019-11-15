<style lang="less" scoped>
  ul,li{
    list-style-type: disc;
  }
  .add-box{
    position: relative;
  }
  .description{
    padding: 20px 20px 20px 30px;
    position: absolute;
    left: 590px;
    top: 50px;
    width: 40%;
    max-width: 600px;
    background-color: #F2F7FF;
    border-radius: 8px;
    &:after{
      content: "\E605";
      position: absolute;
      top:20px;
      left:-15px;
      width: 24px;
      height:24px;
      font-size: 20px;
      color: #F2F7FF;
      font-family: element-icons!important;
    }
  }
  .preview{
    position: relative;
    margin: 0 auto;
    width: 390px;
    height: 430px;
    background-color: #BAECF5;
    border: 1px solid #5AD3E8;
    border-bottom: none;
    border-radius: 50px 50px 0 0; 
    &:after{
      content:'';
      position: absolute;
      top: 45px;
      left: 50%;
      margin-left: -50px;
      width: 100px;
      height: 20px;
      border-radius: 10px;
      background-color: #fff;
      border: 1px solid #5AD3E8;
    }
    .content{
      width: 340px;
      height: 305px;
      position: absolute;
      bottom: 0;
      left: 25px;
      background-color: #fff;
      border: 1px solid #5AD3E8;
      border-bottom: none;
      .msg{
        width: 250px;
        border-radius: 8px;
        padding: 10px;
        min-height: 80px;
        background-color: #e6e7ec;
        margin: 25px auto 0;
        color: #000;
        position: relative;
        &::after{
          content: '';
          position: absolute;
          top: 16px; 
          left: -26px;
          width:0;
          height:0;
          border-width: 14px;
          border-style:solid;
          border-color: transparent #e6e7ec transparent   transparent;
        }
      }
    }
  }
</style>

<template>
  <div>
     <div class="second-nav-list">
      <div class="back-to-nav bg-subnav text-center">
        <v-back-to v-bind:linkto="'/marketing'" v-bind:title="'消息推送'" v-bind:totext="'营销中心'"></v-back-to>
      </div>
    </div>
    <div class="ukao-pt-md ukao-padder">
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="list"><i class="el-icon-arrow-left icon-smaller"></i>短信内容</el-breadcrumb-item>
			  <el-breadcrumb-item>添加短信</el-breadcrumb-item>
			</el-breadcrumb>
      <div class="add-box">
        <div style="width:560px;" class="m-t-xxl">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="模板名称" prop="name" :required='true'>
              <el-input v-model="form.name" placeholder="请输入名称 不超过30个字符"></el-input>
            </el-form-item>
            <el-form-item label="短信内容" prop="txt" :required='true'>
              <el-input type="textarea" v-model="form.txt" placeholder="短信内容不能含有变量 不超过300个字符"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="form.td">
                <span>短信支持退订</span>
                <span>（结尾自动加上“—回复T退订”，占模板内容6个字数）</span>
              </el-checkbox>
            </el-form-item>
            <el-form-item label="申请说明" prop="description" :required='true'>
              <el-input type="textarea" v-model="form.description" placeholder="请描述您的业务使用场景 不超过1000个字符"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">提交</el-button>
              <el-button @click="preview">短信预览</el-button>
            </el-form-item>
            <el-form-item>
              <ul>
                <li class="text-muted">预计两小时完成审核</li>
                <li class="text-muted">审核工作时间：周一至周日9:00-23:00(法定节假日顺延)</li>
              </ul>
            </el-form-item>
          </el-form>
        </div>
        <div class="description">
          <ul>
            <li>不支持中奖,金融理财,教育,留学移民,房产,保险,彩票类短信;</li>
            <li>短信内容不能带变量,请将短信内容全部写明; 不能含有“黄赌毒”等低俗敏感字样，不能含有政治敏感字眼;</li>
            <li>短信内容不支持特殊符号如,￥, ★,?,ヾ(●?▽`●)ノ ^_^;</li>
            <li>短信内容如需链接请提供已ICP备案的网址,短链接不支持拼接;</li>
            <li>短信内容不用添加签名, 签名请单独申请，短信发送需要签名和短信模板;</li>
            <li>短信首尾不能添加[ ]且任意位置不能添加【】符号;</li>
            <li>支持TD或T或N进行短信退订回复,其它参数回复不支持;</li>
            <li>根据国家规定短信内容出现违规违法或者损害到相关企业/消费者/用户的权益，平台将保留最终追究的权利。</li>
            <li>短信字数<=70个字数，按照70个字数一条短信计算</li>
            <li>短信字数>70个字数，即为长短信，按照67个字数记为一条短信计算</li>

          </ul>
        </div>
        <el-dialog
          title="短信预览"
          :visible.sync="dialogVisible"
          size="small">
          <div class="preview">
            <div class="content">
              <div class="msg">短信首尾不能添加[ ]且任意位置不能添加【】符号;</div>
            </div>
          </div>
          <div class="text-right m-t-md">
            <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
          </div>
        </el-dialog>
      </div>
		</div>
  </div>
</template>
<script>
import vBackTo from "../../Common/backto.vue";
import msg from "@/utils/msg";
export default {
  data(){
    return {
      dialogVisible:false,
      form:{
        name:'',
        txt:'',
        description:'',
        td:false
      }
    }
  },
  methods:{
    submit(){ //提交
      this.success();
    },
    success(){
      const vnode = this.$createElement;
      msg.confirm({
        msg: vnode('div',null,[
          vnode('div',{class:'text-md font-bold m-b-sm'},'提交成功！'),
          vnode('ul',{ style: 'padding-left: 10px' },[
            vnode('li',{class:'text-muted'},'预计两小时完成审核'),
            vnode('li',{class:'text-muted'},'审核工作时间：周一至周日9:00-23:00(法定节假日顺延)')
          ])
        ]),
        showCancelButton:false,
        title: "提示",
        type: 'success'
      });
    },
    preview(){//预览
      this.dialogVisible = true
    }
  },
  components: {
    vBackTo
  },
};
</script>
