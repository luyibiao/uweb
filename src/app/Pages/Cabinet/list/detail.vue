<template>
	<div class="ukao-mt-lg">
		<div>
			<p class="ukao-tb-title text-black">智柜信息</p>
			<div class="ukao-tb-default">
				<table class="ukao-table b-t" style="width: 100%">
					<tbody>
						<tr>
							<td >编号</td>
							<td>{{dataInfo.code}}</td>
							<td></td>
							<td>
								<a href="http://mp.ukao.xin" target="_blank" class="text-primary">智柜管理</a>
							</td>
						</tr>
						<tr>
							<td>名称</td>
							<td>{{dataInfo.name}}</td>
							<td></td>
							<td>
								<!--<el-button>修改</el-button>-->
							</td>
						</tr>
						<tr>
							<td>型号</td>
							<td>{{extendInfo.model || ''}}</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td>坐标</td>
							<td>{{dataInfo.longitude}},{{dataInfo.latitude}}</td>
							<td>
								<!--<el-button>修改</el-button>-->
							</td>
							<td></td>
						</tr>
						<tr>
							<td>地址</td>
							<td>
								{{dataInfo.province}}{{dataInfo.city}}{{dataInfo.district}}{{dataInfo.details}}
							</td>
							<td>
								<!--<el-button>修改</el-button>-->
							</td>
							<td></td>
						</tr>
						<tr>
							<td>WI-FI账号</td>
							<td>{{extendInfo.wifiAccount || ''}}，{{extendInfo.wifiPassword || ''}}</td>
							<td>
								<!--<el-button>修改</el-button>-->
							</td>
							<td></td>
						</tr>
						<tr>
							<td>智柜账号</td>
							<td>
								{{extendInfo.localUserName || ''}}，{{extendInfo.localUserPassword || ''}}
							</td>
							<td></td>
							<td>
								<!--<el-button>修改</el-button>-->
							</td>
						</tr>
						<tr>
							<td>智柜二维码</td>
							<td><Qrcode :value="qrcodeUrl" :options="{ size: 80 }"></Qrcode></td>
							<td><Qrcode :value="qrcodeUrl" id="qrcode" v-show="false"  :options="{ size: 600 }"></Qrcode></td>
							<td><a id="downloadLink"></a><el-button type="text" @click="downCode">下载二维码</el-button></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="m-t-lg">
			<p class="ukao-tb-title text-black">系统信息</p>
			<div class="ukao-tb-default">
				<table class="ukao-table b-t" style="width: 100%">
					<tbody>
						<tr>
							<td >运行状态</td>
							<td >
								<span class="text-danger" v-if="dataInfo.runningState==-1">运行异常</span>
								<span class="text-success" v-if="dataInfo.runningState==0">重启中</span>
								<span class="text-success" v-if="dataInfo.runningState==1">运行正常</span>
							</td>
							<td></td>
							<td>
								<el-button @click="onSyncExtend" v-if="dataInfo.code">{{btn.refresh}}</el-button>
							</td>
						</tr>
						<tr>
							<td>软件版本</td>
							<td><span class="text-success">{{extendInfo.softwareVersion}}</span></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td>网络</td>
							<td>
								<span class="text-success" v-if="extendInfo.networkStatus==1">正常</span>
								<span class="text-danger" v-if="extendInfo.networkStatus==-1">异常</span>
							</td>
							<td>{{extendInfo.networkName}}</td>
							<td></td>
						</tr>
						<tr>
							<td>打印机</td>
							<td>
								<span class="text-success" v-if="extendInfo.printStatus==1">正常</span>
								<span class="text-danger" v-if="extendInfo.printStatus==-1">异常</span>
							</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td>扫码器</td>
							<td>
								<span class="text-success" v-if="extendInfo.codeReaderStatus==1">正常</span>
								<span class="text-danger" v-if="extendInfo.codeReaderStatus==-1">异常</span>
							</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td>更新时间</td>
							<td>
								<span class="text-success">{{extendInfo.versionUpdateTime | getDate}}</span>
								<span class="text-success">{{extendInfo.versionUpdateTime | getTime}}</span>
							</td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="m-t-lg" style="display: none">
			<p class="ukao-tb-title text-black">微信（附近的智能洗衣柜）</p>
			<div class="ukao-tb-default">
				<table class="ukao-table b-t" style="width: 100%">
					<tbody>
						<tr class="tr-bb-none">
							<td style="width: 20%">营业时间</td>
							<td>00:00-24:00</td>
							<td style="width: 188px;">
								<el-button>修改</el-button>
							</td>
						</tr>
						<tr class="tr-bb-none">
							<td style="width: 20%; vertical-align: top; padding-top: 20px;">智柜图片</td>
							<td colspan="2">
								<table class="ukao-table" style="width: 100%">
									<tbody>
										<tr>
											<td>图片</td>
											<td>排列序号</td>
											<td>操作</td>
										</tr>
										<tr>
											<td>
												<img class="w" src="/static/img/sc_map001.png" alt="">
											</td>
											<td><span class="text-primary">1</span></td>
											<td style="width: 170px;">
												<el-button>编辑</el-button>
												<el-button plain type="danger">删除</el-button>
											</td>
										</tr>
										<tr>
											<td>
												<img class="w" src="/static/img/sc_map001.png" alt="">
											</td>
											<td><span class="text-primary">2</span></td>
											<td>
												<el-button>编辑</el-button>
												<el-button plain type="danger">删除</el-button>
											</td>
										</tr>
										<tr>
											<td>
												<img class="w" src="/static/img/sc_map001.png" alt="">
											</td>
											<td><span class="text-primary">3</span></td>
											<td>
												<el-button>编辑</el-button>
												<el-button plain type="danger">删除</el-button>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
  import Qrcode from '@xkeshi/vue-qrcode'
	import auth from '@/utils/auth'

	export default {
    components:{
      Qrcode
		},
	  data:function () {
			return {
			  qrcodeUrl:"",
				dataInfo:{},
				extendInfo:{},
				btn: {
          refresh:'更新'
        }
			}
    },
		created () {
	    let _this = this
			_this.detail(function () {
				_this.extend()
      })
    },
		methods: {
			detail(fn){
				this.$store.dispatch('post', {
					uri : 'cupboardInfo/detail',
					data: {id:this.$route.params.id}
				}).then((res) =>{
					this.dataInfo = res.data.data;

          this.qrcodeUrl = consts.WX_URL + '/wxapp/' + auth.getMercInfo().code + "?action=cupboard&code=" + this.dataInfo.code;

					if(typeof (fn) === 'function'){
					  fn()
					}
				})
			},
			extend(){
				this.$store.dispatch('post', {
					uri : 'cupboardInfo/extend',
					data: {id:this.$route.params.id}
				}).then((res) =>{
					this.extendInfo = res.data.data;
				})
			},
			onSyncExtend(){
				let _this = this
				_this.btn.refresh = '更新中...'
				_this.$store.dispatch('post', {
					uri : 'cupboardInfo/syncExtend',
					data: {
					  code: this.dataInfo.code
					}
				}).then((res) =>{
					_this.detail(function () {
						_this.extend()
						msg.success("已更新最新配置")
						setTimeout(()=>{
							_this.btn.refresh = '更新'
						},500)

					})
				})
			},
      downCode() {
        var qrcode = document.getElementById("qrcode");
        //构造url
        var url = qrcode.toDataURL("image/png");
        // 构造a标签并模拟点击
        var downloadLink = document.getElementById("downloadLink");
        downloadLink.setAttribute("href", url);
        downloadLink.setAttribute("download", "二维码.png");
        downloadLink.click();
        msg.success('下载成功')
      },
    }
  }

</script>

<style scoped>
	.tr-bb-none > td {
		border-bottom: 0;
	}
	td{
		width:25%
	}
</style>