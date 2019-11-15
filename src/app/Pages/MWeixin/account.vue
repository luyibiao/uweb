<template>
	<div>
    <div class="ukao-v-loading" v-loading="loading">
		<div class="ukao-tb-default" v-show="showBindWeixin===false" style="display:none;">
			<table class="ukao-table b-t" style="width: 100%">
				<tbody>
					<tr>
						<td class="w-lg">公众号微信号</td>
						<td>
							<span class="m-r" v-if="wxInfo.alias">{{wxInfo.alias}}</span>
							<span class="m-r text-muted" v-else>未设置</span>
							<el-button type="text" @click="toUnbind">绑定到其他微信号</el-button>
						</td>
					</tr>
					<tr>
						<td>公众号呢称</td>
						<td>{{wxInfo.nickName}}</td>
					</tr>
          <tr>
            <td>微信账号类型</td>
            <td>
              <template v-if="wxInfo.verifyTypeInfo == -1">未认证</template>
              <template v-else>已认证</template>
              <template v-if="wxInfo.serviceTypeInfo == 2">服务号</template>
              <template v-else>订阅号</template>
              <template v-if="showInitTemp">
                <el-button type="text" :loading="initTempLoading" @click="initTemplate">初始化模板消息</el-button>
              </template>
            </td>
          </tr>
					<tr>
						<td>头像</td>
						<td>
							<div>
								<img class="thumb-md" :src="wxInfo.headImg" alt="">
							</div>
						</td>
					</tr>
					<tr>
						<td>二维码</td>
						<td>
							<span>
								<img class="thumb-md-ef" :src="wxInfo.qrcodeUrl" alt="">
							</span>
							<span v-if="wxInfo.qrcodeUrl" style="margin-left: 40px;" class="text-primary">
								<a :href="wxInfo.qrcodeUrl" target="_blank" download="" >下载二维码</a>
							</span>
						</td>

					</tr>
				</tbody>
			</table>
			<div class="discription">
				<p>您的店铺已经获得该公众号的所有接口权限，可以正常对接微信</p>
				<p>如果使用中发现接口有异常，请点此&nbsp;<el-button type="text" @click="reBind">重新授权</el-button>&nbsp;试试</p>
			</div>
		</div>
		<div class="m-t text-center" v-show="showBindWeixin===true" style="display:none;">
			<p class="text-success text-md">绑定微信公众号，把店铺和微信打通</p>
			<p class="m-t-sm">绑定后即可在这里管理您的公众号，通洗提供比微信官方后台更加强大的功能！</p>
			<div class="b-a weixin-block m-t-lg">
				<div class="m-b">
					<img class="thumb-md" src="/static/img/logo/weixin.png" alt="">
					<p>微信</p>
				</div>
				<el-button type="success" class="btn" size="small" @click="toBind">马上绑定</el-button>
			</div>
		</div>
    </div>
    <el-dialog class="ukao-el-dialog" title="提示" size="tiny" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div>
        <p class="text-danger">解除绑定微信号，会造成微信的重要信息丢失（<!--包括图文素材、自动回复、-->自定义菜单等），请谨慎操作！</p>
        <div class="m-t">
          <p>短信验证码</p>
          <el-input class="m-t-xs" placeholder="请输入内容" v-model="unbindCode">
            <el-button slot="append" class="ukao-el-button-default" :disabled="codeBtnDisable" @click="getCode">{{codeBtnName}}</el-button>
          </el-input>
          <p class="text-muted m-t-xs">验证短信将发到您绑定的手机：{{phone}}，请查收</p>
          <el-checkbox class="m-t" v-model="checked">已知晓解除绑定的风险，确认解绑</el-checkbox>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="enableUnbind" @click="unbind">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
  import consts from '@/utils/consts'
  import bizconsts from '@/utils/bizconsts'
  import auth from '@/utils/auth'
  import msg from '@/utils/msg'

	export default {
		data: function() {
			return {
        loading: true,
        codeBtnName:'获取',
        codeBtnDisable:false,
			  wxInfo: {
          alias:'',
          nickName:'',
          verifyTypeInfo:'',
          serviceTypeInfo:'',
          headImg:''
        },
        initTempLoading: false,
        showInitTemp: false,
				phone: null,
				dialogVisible: false,
				unbindCode: null,
				checked: false,
				showBindWeixin: null
			}
		},
		created () {
		  let auth_code = this.$route.query.auth_code;
		  if (auth_code) {
        this.bind(auth_code);
      } else {
        this.detail();
      }
    },
    computed: {
      enableUnbind(){
        return !this.checked||!this.unbindCode;
      }
    },
		methods: {
		  detail: function() {
        this.$store.dispatch('post', {
          uri: 'wxAuthorizerInfo/detail',
          data: {origin: bizconsts.COMMON.ORIGIN_WX}
        }).then((res)=>{
          if (res.data.data) {
            this.wxInfo = res.data.data;
            this.showBindWeixin = false;
            this.templateCheck();
          } else {
            this.showBindWeixin = true;
          }
          this.loading = false;
        });
			},
      templateCheck(){
        this.$store.dispatch('post', {
          uri: 'wxTemplate/check'
        }).then((res)=>{
          this.showInitTemp = !res.data.data;
        });
      },
      initTemplate() {
        let _this = this;
        this.initTempLoading = true;
//        console.log("initTemplate");
//        return ;
        this.$store.dispatch('post', {
          uri: 'wxTemplate/init',
          forceResolve:true,
        }).then((res)=>{
          if (res.data.httpCode != 200) {
            _this.initTempLoading = false;
            msg.error(res.data.msg);
          } else {
            msg.success("操作成功");
            _this.showInitTemp = false;
					}
				});
      },
      reBind: function () {
        const h = this.$createElement;
        let _this = this;
        msg.confirm({msg:h('div', null, [h('p', null, '请您注意：'),
          h('ul', null, [
            h('li', { 'class': 'text-danger' }, '必须使用当前绑定的公众号进行授权，否则将可能导致某些重要数据丢失或其它异常情况'),
            h('li', { 'class': 'text-danger' }, '为保证您在通洗平台功能的正常使用，授权时请保持默认选择，把权限统一授权给通洗')
					])
				]), confirmFn: function () {
          _this.toBind(_this.wxInfo.appid);
          msg.confirm({msg:'请在新窗口中完成授权', confirmButtonText:'已完成授权', cancelButtonText:"授权失败，重试",
            closeOnClickModal:false, closeOnPressEscape: false,
            confirmFn:_this.detail, cancelFn:_this.detail});
        }});
      },
			toBind: function (appid) {
        this.$store.dispatch('post', {
          uri: 'wxAuthorizerInfo/toBind',
          data: {authType: 1, bizAppid:appid}
        }).then((res)=>{
          if (res.data.data) {
            window.open(res.data.data);
					}
				});
      },
			bind: function (auth_code) {
        this.$store.dispatch('post', {
          uri: 'wxAuthorizerInfo/bind',
          data: {auth_code, origin: bizconsts.COMMON.ORIGIN_WX},
          forceResolve: true
        }).then((res)=>{
          if (res && res.data.httpCode == 200) {
            msg.success("绑定成功");
          } else {
            msg.error("绑定失败");
            this.loading = false;
          }
          this.$router.replace('account');
          this.detail();
        });
      },
      getCode() {
        let _this = this;

		    if (!_this.phone) {
		      return ;
        }

        this.codeBtnDisable = true;
        this.codeBtnName = 60;
        let t = setInterval(function (){
          _this.codeBtnName --;
          if (_this.codeBtnName <= 0) {
            clearInterval(t);
            _this.codeBtnName = '获取';
            _this.codeBtnDisable = false;
          }
        }, 1000);

        this.$store.dispatch('post', {
          uri: 'wxAuthorizerInfo/getUnbindCode',
          forceResolve:true,
          data: {phone: _this.phone}
        }).then((res) => {
          if (res.data.httpCode != 200) {
            clearInterval(t);
            _this.codeBtnName = '获取';
            _this.codeBtnDisable = false;
          }
        });
      },
			toUnbind() {
        this.phone = auth.getWorkInfo().phone;
        this.dialogVisible = true;
      },
			unbind() {
        this.$store.dispatch('post', {
          uri: 'wxAuthorizerInfo/unbind',
          data: {code:this.unbindCode, phone: this.phone, origin: bizconsts.COMMON.ORIGIN_WX}
        }).then((res) => {
          msg.success('解绑成功');
          this.showBindWeixin = true;
          this.dialogVisible = false;
        });
      }
		}
	}
</script>

<style scoped>
	.discription {
		padding: 10px 20px;
		line-height: 24px;
		display: inline-block;
		margin-left: 298px;
		margin-top: 15px;
		background-color: #f3f7ff;
		border-radius: 10px;
	}
	.ukao-el-button-default:hover {
		background-color: #fff;
	}
	.thumb-md-ef{
		width: 110px;
		vertical-align: middle;
	}
	.weixin-block {
		display: inline-block;
		width: 400px;
		border-radius: 10px;
		padding: 40px 20px;
	}
	.btn {
		border-radius: 15px;
	}
</style>

<style>
	.ukao-el-dialog .el-dialog__footer {
		border-top: 1px solid #dee5e7;
	}
</style>