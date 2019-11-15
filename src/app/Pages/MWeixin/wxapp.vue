<template>
	<div>
    <div class="ukao-v-loading" v-loading="loading">
		<div class="ukao-tb-default" v-show="showBindWeixin===false" style="display:none;">
			<table class="ukao-table b-t" style="width: 100%">
				<tbody>
					<tr>
						<td class="w-lg">微信小程序</td>
						<td>
							<span class="m-r">{{wxInfo.nickName}}</span>
							<el-button type="text" @click="toUnbind">绑定到其他小程序</el-button>
						</td>
					</tr>
          <tr>
            <td>小程序账号类型</td>
            <td>
              <template v-if="wxInfo.verifyTypeInfo == -1">未认证</template>
              <template v-else>已认证</template>
							<span class="m-l">{{audit.auditStatus | getValText('WX_APP_AUDIT')}}</span>
              <template v-if="audit.auditStatus!=2">
                <el-button type="text" :loading="commitAuditLoading" @click="commitAudit">提交审核</el-button>
              </template>
							<template v-else>
								<el-button type="text" @click="checkAudit">刷新</el-button>
							</template>
							<template v-if="audit.auditStatus === 0 || audit.auditStatus === '0'">
								<span class="m-l">{{audit.releaseStatus | getValText('RELEASE_STATUS')}}</span>
								<template v-if="!audit.releaseStatus">
									<el-button type="text" :loading="releaseLoading" @click="release">发布小程序</el-button>
								</template>
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
					<!--<tr>-->
						<!--<td>二维码</td>-->
						<!--<td>-->
							<!--<span>-->
								<!--<img class="thumb-md-ef" :src="wxInfo.qrcodeUrl+'?wx_fmt=jpeg&wxfrom=5&wx_lazy=1'" alt="">-->
							<!--</span>-->
							<!--<span  v-if="wxInfo.qrcodeUrl" style="margin-left: 40px;" class="text-primary">-->
								<!--<a :href="wxInfo.qrcodeUrl" target="_blank" download="">下载二维码</a>-->
							<!--</span>-->
						<!--</td>-->
					<!--</tr>-->
					<template v-if="test.enable">
						<tr>
							<td>体验二维码</td>
							<td>
								<div>
									<img class="thumb-lg" :src="test.qrcodeUrl">
								</div>
								<el-button type="text" @click="getQrcodeUrl">生成二维码</el-button>
								<el-button type="text" @click="showVersionDialog">设置基础库版本</el-button>
							</td>
						</tr>
						<tr>
							<td>服务器域名</td>
							<td>
								<div>{{test.requestdomain}}</div>
								<div>{{test.wsrequestdomain}}</div>
								<div>{{test.uploaddomain}}</div>
								<div>{{test.downloaddomain}}</div>
								<el-button type="text" @click="modifyDomain('get')">获取</el-button>
								<el-button type="text" @click="modifyDomain('add')">添加</el-button>
								<el-button type="text" @click="modifyDomain('set')">覆盖</el-button>
							</td>
						</tr>
						<tr>
							<td>业务域名</td>
							<td>
								<div>{{test.webviewdomain}}</div>
								<el-button type="text" @click="setWebViewDomain('get')">获取</el-button>
								<el-button type="text" @click="setWebViewDomain('add')">添加</el-button>
								<el-button type="text" @click="setWebViewDomain('set')">覆盖</el-button>
							</td>
						</tr>
						<tr>
							<td>跳转二维码</td>
							<td>
								<div>{{test.fileName}}:{{test.fileContent}}</div>
								<div>{{test.qrcodejumpJson}}</div>
								<el-button type="text" @click="qrcodeJumpDownload">获取校验文件</el-button>
								<el-button type="text" @click="qrcodeJumpGet">获取二维码</el-button>
								<el-button type="text" @click="showQrcodeDialog">操作</el-button>
								<!--<el-button type="text" @click="qrcodeJumpAdd">生成二维码</el-button>-->
								<!--<el-button type="text" @click="qrcodeJumpPublish">发布二维码</el-button>-->
							</td>
						</tr>
						<tr>
							<td>插件</td>
							<td>
								<div>{{test.plugin}}</div>
								<el-button type="text" @click="plugin('list')">获取</el-button>
								<el-button type="text" @click="doPlugin()">操作</el-button>
							</td>
						</tr>
					</template>
				</tbody>
			</table>
			<div class="discription">
				<p>您的店铺已经获得该小程序的所有接口权限，可以正常对接微信</p>
				<p>如果使用中发现接口有异常，请点此&nbsp;<el-button type="text" @click="reBind">重新授权</el-button>&nbsp;试试</p>
			</div>
		</div>
		<div class="m-t text-center" v-show="showBindWeixin===true" style="display:none;">
			<p class="text-success text-md">绑定微信小程序，把店铺和微信小程序打通</p>
			<!--<p class="m-t-sm">绑定后即可在这里管理您的小程序，通洗提供比微信官方后台更加强大的功能！</p>-->
			<div class="b-a weixin-block m-t-lg">
				<div class="m-b">
					<img class="thumb-md" src="/static/img/logo/wxapp.png" alt="">
					<p>微信小程序</p>
				</div>
				<el-button type="success" class="btn" size="small" @click="toBind">马上绑定</el-button>
			</div>
		</div>
    </div>
    <el-dialog class="ukao-el-dialog" title="提示" size="tiny" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div>
        <p class="text-danger">确定解除绑定小程序，将导致小程序无法使用，请谨慎操作！</p>
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

		<el-dialog class="ukao-dialog"
							 title="设置最低基础库版本"
							 :visible.sync="versionDialog.show"
							 size="small">
			<div>
				<el-form ref="versionForm" :model="versionDialog.form" label-width="160px">
					<el-form-item label="最低基础库版本"
												prop="version"
												:rules="[{ min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}]">
						<div class="w-lg">
							<el-input v-model="versionDialog.form.version" auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="versionDialog.show=false">取消</el-button>
						<el-button type="primary"
											 @click="setWeappSupportVersion()">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>

		<el-dialog class="ukao-dialog" title="设置插件" :visible.sync="pluginDialog.show" size="small">
			<div>
				<el-form ref="pluginForm" :model="pluginDialog.form" label-width="160px">
					<el-form-item label="插件appid"
												prop="pluginAppid"
												:rules="[{ required: true, min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}]">
						<div class="w-lg">
							<el-input v-model="pluginDialog.form.pluginAppid" auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="版本号"
												prop="userVersion"
												:rules="[{ min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}]">
						<div class="w-lg">
							<el-input v-model="pluginDialog.form.userVersion" auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="pluginDialog.show=false">取消</el-button>
						<el-button type="success" @click="plugin('apply')">添加</el-button>
						<el-button type="primary" @click="plugin('update')">更新</el-button>
						<el-button type="danger" @click="plugin('unbind')">删除</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>

		<el-dialog class="ukao-dialog" title="编辑二维码规则" :visible.sync="qrcodeDialog.show" size="small">
			<div>
				<el-form ref="qrcodeForm" :model="qrcodeDialog.form" label-width="160px">
					<el-form-item label="二维码规则" prop="prefix" :rules="[{ required: true, message: '请输入二维码规则', trigger: 'blur'}]">
						<div class="w-lg">
							<el-input v-model="qrcodeDialog.form.prefix" auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="前缀占用规则">
						<div class="w-lg">
							<el-radio v-model="qrcodeDialog.form.permit_sub_rule" :label="2">占用</el-radio>
							<el-radio v-model="qrcodeDialog.form.permit_sub_rule" :label="1">不占用</el-radio>
						</div>
					</el-form-item>
					<el-form-item label="小程序功能页面" prop="path" :rules="[{ required: true, message: '请输入功能页面路径', trigger: 'blur'}]">
						<div class="w-lg">
							<el-input v-model="qrcodeDialog.form.path" auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="测试范围">
						<!--<div class="w-lg">-->
							<div>
								<el-radio v-model="qrcodeDialog.form.open_version" :label="1">开发版（配置只对开发者生效）</el-radio>
							</div>
							<div>
								<el-radio v-model="qrcodeDialog.form.open_version" :label="2">体验版（配置对管理员、体验者生效）</el-radio>
							</div>
							<div>
								<el-radio v-model="qrcodeDialog.form.open_version" :label="3">线上版本（配置对管理员、开发者和体验者生效）</el-radio>
							</div>
						<!--</div>-->
					</el-form-item>
					<el-form-item label="测试链接（选填）">
						<div class="w-lg">
							<el-input v-model="qrcodeDialog.form.debug_url" placeholder="多链接以;分隔,不多于5个" auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="qrcodeDialog.show=false">取消</el-button>
						<el-button type="primary" @click="qrcodeJumpAdd(0)">添加</el-button>
						<el-button type="primary" @click="qrcodeJumpAdd(1)">修改</el-button>
						<el-button type="primary" @click="qrcodeJumpDelete()">删除</el-button>
						<el-button type="success" @click="qrcodeJumpPublish()">发布</el-button>
					</el-form-item>
				</el-form>
			</div>
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
        test: {
          enable: false,
					qrcodeUrl: '',
          qrcodejumpJson:'',
					fileName:'',
					fileContent:'',
          requestdomain:'',
          wsrequestdomain:'',
          uploaddomain:'',
          downloaddomain:'',
          webviewdomain:'',
          plugin:''
				},
			  versionDialog: {
          show : false,
					form: {
            version: ''
					}
				},
			  pluginDialog: {
          show: false,
					form: {
            action:'list',
            pluginAppid:'',
            userVersion:''
					}
				},
			  qrcodeDialog: {
          show: false,
          form:{
            prefix: consts.WX_URL + '/wxapp/' + auth.getMercInfo().code + '?action=XXXXX',
            permit_sub_rule:1,
						path:'',
            open_version:1,
            debug_url:''
					}
				},
			  audit: {
          id:'',
					auditStatus: '',
					releaseStatus: ''
				},
			  wxInfo: {
          alias:'',
          nickName:'',
          verifyTypeInfo:'',
          serviceTypeInfo:'',
          headImg:''
        },
        commitAuditLoading: false,
        releaseLoading: false,
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
        let test = this.$route.query.test;
        if (test) {
          this.test.enable = test;
        }
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
					data: {origin: bizconsts.COMMON.ORIGIN_WX_APP}
        }).then((res)=>{
          if (res.data.data) {
            this.wxInfo = res.data.data;
            this.showBindWeixin = false;
            this.getLastAudit();
          } else {
            this.showBindWeixin = true;
          }
          this.loading = false;
        });
			},
      getQrcodeUrl() {
        this.$store.dispatch('post', {
          uri: 'wxApp/getQrcodeUrl',
        }).then((res)=>{
					this.test.qrcodeUrl = res.data.data;
        });
			},
      modifyDomain(action) {
        this.$store.dispatch('post', {
          uri: 'wxApp/modifyDomain',
					data: {action}
        }).then((res)=>{
          if (action == 'get') {
            this.test.requestdomain = res.data.data.requestdomain;
            this.test.wsrequestdomain = res.data.data.wsrequestdomain;
            this.test.uploaddomain = res.data.data.uploaddomain;
            this.test.downloaddomain = res.data.data.downloaddomain;
					} else {
            msg.success();
          }
        });
			},
      setWebViewDomain(action) {
        this.$store.dispatch('post', {
          uri: 'wxApp/setWebViewDomain',
          data: {action}
        }).then((res)=>{
          if (action == 'get') {
            this.test.webviewdomain = res.data.data.webviewdomain;
          } else {
            msg.success();
          }
        });
      },
      showVersionDialog() {
        this.versionDialog.show = true;
			},
      setWeappSupportVersion() {
		    this.$refs['versionForm'].validate(valid => {
		      if (valid) {
		        let version = this.versionDialog.form.version;
            this.$store.dispatch('post', {
              uri: 'wxApp/setWeappSupportVersion',
              data: {version}
            }).then(res => {
              this.versionDialog.show = false;
              msg.success();
						});
					}
				});
			},
      doPlugin() {
        this.pluginDialog.form.pluginAppid = '';
        this.pluginDialog.form.userVersion = '';
        this.pluginDialog.show = true;
			},
      plugin(action) {
		    if (action) {
          this.pluginDialog.form.action = action;
				}
				let _valid = true;
        if (action != 'list') {
          this.$refs['pluginForm'].validate(valid => {
            _valid = valid;
          });
        }

        if (_valid) {
          let form = {...this.pluginDialog.form};
          this.$store.dispatch('post', {
            uri: 'wxAppPlugin',
            data: form
          }).then(res => {
            if (action == 'list') {
              this.test.plugin = res.data.data;
            } else {
              this.pluginDialog.show = false;
              msg.success();
            }
          });
				}
      },
      qrcodeJumpDownload() {
        this.$store.dispatch('post', {
          uri: 'wxApp/qrcodeJumpDownload',
        }).then((res)=>{
          let data = res.data.data;
          this.test.fileName = data.file_name;
          this.test.fileContent = data.file_content;
        });
			},
      qrcodeJumpGet() {
        this.$store.dispatch('post', {
          uri: 'wxApp/qrcodeJumpGet',
        }).then((res)=>{
          this.test.qrcodejumpJson = res.data.data;
        });
      },
      showQrcodeDialog() {
        this.qrcodeDialog.form.prefix = consts.WX_URL + '/wxapp/' + auth.getMercInfo().code + '?action=XXXXX';
				this.qrcodeDialog.show = true;
			},
      qrcodeJumpAdd(isEdit) {
        this.$refs['qrcodeForm'].validate(valid => {
          if (valid) {
            let qrcodeForm = {...this.qrcodeDialog.form};
            qrcodeForm.is_edit = isEdit;
            if (qrcodeForm.debug_url) {
              qrcodeForm.debug_url = qrcodeForm.debug_url.split(";");
						} else {
              delete qrcodeForm.debug_url;
            }

            this.$store.dispatch('post', {
              uri: 'wxApp/qrcodeJumpAdd',
							data: {parameters:JSON.stringify(qrcodeForm)}
            }).then(_=>{
              this.qrcodeDialog.show = false;
              msg.success();
            });
					}
        });
      },
      qrcodeJumpDelete() {
        let prefix = this.qrcodeDialog.form.prefix;
        if (!prefix) {
          msg.error('请输入要删除的二维码规则');
          return;
        }

        this.$store.dispatch('post', {
          uri: 'wxApp/qrcodeJumpDelete',
          data: {parameters:JSON.stringify({prefix})}
        }).then(_=>{
          msg.success();
        });
			},
      qrcodeJumpPublish() {
        let prefix = this.qrcodeDialog.form.prefix;
        if (!prefix) {
          msg.error('请输入要发布的二维码规则');
          return;
				}

        this.$store.dispatch('post', {
          uri: 'wxApp/qrcodeJumpPublish',
          data: {parameters:JSON.stringify({prefix})}
        }).then(_=>{
          msg.success();
        });
      },
      commitAudit() {
		    this.commitAuditLoading = true;
        this.$store.dispatch('post', {
          uri: 'wxApp/submitAudit',
          forceResolve:true
        }).then((res)=>{
          if (res.data.httpCode != 200) {
            this.commitAuditLoading = false;
            msg.error(res.data.msg);
          } else {
            msg.success("操作成功");
            this.audit.auditStatus = 2;
          }
				});
			},
      checkAudit() {
        this.$store.dispatch('post', {
          uri: 'wxApp/checkAudit',
          data:{id: this.audit.id},
        }).then((res)=>{
          this.audit = res.data.data;
				})
			},
      release() {
        this.releaseLoading = true;
        this.$store.dispatch('post', {
          uri: 'wxApp/release',
          data:{id: this.audit.id},
          forceResolve:true
        }).then((res)=>{
          if (res.data.httpCode != 200) {
            this.releaseLoading = false;
            msg.error(res.data.msg);
          } else {
            msg.success("操作成功");
            this.audit.releaseStatus = 1;
          }
        });
      },
      getLastAudit() {
        this.$store.dispatch('post', {
          uri: 'wxApp/getLastAudit',
        }).then((res)=>{
          if (res.data.data) {
            this.audit = res.data.data;
					}
        });
			},
      reBind: function () {
        const h = this.$createElement;
        let _this = this;
        msg.confirm({msg:h('div', null, [h('p', null, '请您注意：'),
          h('ul', null, [
            h('li', { 'class': 'text-danger' }, '必须使用当前绑定的小程序进行授权，否则将可能导致某些重要数据丢失或其它异常情况'),
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
					data: {authType: 2, bizAppid:appid}
        }).then((res)=>{
          if (res.data.data) {
            window.open(res.data.data);
					}
				});
      },
			bind: function (auth_code) {
        this.$store.dispatch('post', {
          uri: 'wxAuthorizerInfo/bind',
          data: {auth_code, origin: bizconsts.COMMON.ORIGIN_WX_APP},
          forceResolve: true
        }).then((res)=>{
          if (res && res.data.httpCode == 200) {
            msg.success("绑定成功");
          } else {
            msg.error("绑定失败");
            this.loading = false;
          }
          this.$router.replace('wxapp');
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
          data: {code:this.unbindCode, phone: this.phone, origin: bizconsts.COMMON.ORIGIN_WX_APP}
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
	.weixin-block {
		display: inline-block;
		width: 400px;
		border-radius: 10px;
		padding: 40px 20px;
	}
	.thumb-md-ef{
		width: 110px;
		vertical-align: middle;
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