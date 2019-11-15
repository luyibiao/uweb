<template>
	<div class="order-list">
		<ul class="uk-search">
			<li class="uk-search-item">
				<el-select class="uk-search-label w-sm"
				           v-model="tableData.searchInputType"
				           placeholder="请选择">
					<el-option v-for="item in searchOptions"
					           :key="item.index"
					           :label="item.text"
					           :value="item.val">
					</el-option>
				</el-select>
				<el-input class="uk-search-content w-sm"
									prefix-icon="el-icon-search"
				          v-model="tableData.searchInput"
				          placeholder="请输入内容"></el-input>
			</li>
			<li class="uk-search-item">
				<storeSelect v-model="tableData.storeId"></storeSelect>
			</li>
			<li class="uk-search-item">
				<citySelect v-model="tableData.cityId"></citySelect>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">付款状态：</span>
				<el-select class="thumb-xl"
				           v-model="tableData.payStatus"
				           filterable
				           clearable
				           placeholder="全部">
					<el-option v-for="item in payStatusOptions"
					           :key="item.index"
					           :label="item.text"
					           :value="item.val">
					</el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">取件方式：</span>
				<el-select class="w-sm"
				           v-model="tableData.takeMode"
				           filterable
				           clearable
				           placeholder="全部">
					<el-option v-for="item in orderTakeModeOptions"
					           :key="item.index"
					           :label="item.text"
					           :value="item.val">
					</el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">送件方式：</span>
				<el-select class="w-sm"
									 v-model="tableData.sendMode"
									 filterable
									 clearable
									 placeholder="全部">
					<el-option v-for="item in orderSendModeOptions"
										 :key="item.index"
										 :label="item.text"
										 :value="item.val">
					</el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">团体：</span>
				<el-select class="w-sm"
				           v-model="tableData.unionId"
									 filterable
				           clearable
				           placeholder="全部">
					<el-option v-for="item in unionList"
					           :key="item.id"
					           :label="item.name"
					           :value="item.id">
					</el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="uk-search-label">取送服务商：</span>
				<el-select class="w-sm"
									 filterable placeholder="全部"
									 clearable v-model="tableData.expressType">
					<el-option v-for="item in expressOptions"
										 :key="item.val"
										 :label="item.text"
										 :value="item.val">
					</el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="uk-search-label">是否赊账：</span>
				<el-select class="w-sm"
									 filterable placeholder="全部"
									 clearable v-model="tableData.creditStatus">
					<el-option v-for="item in creditStatusList"
										 :key="item.val"
										 :label="item.text"
										 :value="item.val">
					</el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="uk-search-label">修改订单金额：</span>
				<el-select class="w-sm"
									 filterable placeholder="全部"
									 clearable v-model="tableData.isModifyPrice">
					<el-option label="未修改" value="0"></el-option>
					<el-option label="有修改" value="1"></el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="m-r-sm">订单状态：</span>
				<el-select class="w-sm"
				           v-model="tableData.orderStatus"
				           filterable
				           clearable
									 @change="statusChange"
				           placeholder="全部">
					<el-option v-for="item in orderStatusOptions"
					           :key="item.index"
					           :label="item.text"
					           :value="item.val">
					</el-option>
				</el-select>
			<!--	<el-checkbox v-show="tableData.orderStatus == 1" v-model="tableData.noAssignTakeWork">未指派</el-checkbox>
				<el-checkbox v-show="tableData.orderStatus == 1" v-model="tableData.outOfRange">超出取送范围</el-checkbox>-->
				<el-select v-show="tableData.orderStatus == 1"
					v-model="statusList"
					multiple
					collapse-tags
					style="margin-left: 20px;"
					placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>

				<el-date-picker v-model="tableData.createTimeObj"
				                type="daterange"
				                align="right"
												start-placeholder="开始日期"
												end-placeholder="结束日期"
				                :picker-options="pickerOptions0">
				</el-date-picker>
			</li>
			
				<li class="uk-search-item">
				<span class="uk-search-label">取送员：</span>
				<el-select class="w-sm"
				           v-model="tableData.takeOrSendWorkId"
									 filterable
				           clearable
				           placeholder="全部">
					<el-option v-for="item in takeOrSendWorkIdList"
					           :key="item.id"
					           :label="item.name"
					           :value="item.id">
					</el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span>取件日期：</span>
				<el-date-picker v-model="tableData.takeDateObj"
				                type="daterange"
				                align="right"
												start-placeholder="开始日期"
												end-placeholder="结束日期"
				                :picker-options="pickerOptions0">
				</el-date-picker>
			</li>

			<li class="uk-search-item" v-if="mercApiList.length">
				<span class="uk-search-label">外部渠道：</span>
				<el-select class="uk-search-content w"
									 clearable
									 filterable
									 v-model="tableData.mercApiId"
									 placeholder="请选择">
					<el-option v-for="item in mercApiList"
										 :key="item.id"
										 :label="item.name"
										 :value="item.id"></el-option>
				</el-select>
			</li>

			<li class="uk-search-item" v-if="originTab == 5">
				<span class="uk-search-label">送洗柜：</span>
				<el-select class="uk-search-content w"
									 clearable
									 filterable
									 v-model="tableData.takeCupboardId"
									 placeholder="请选择">
					<el-option v-for="item in cupboardInfoList"
										 :key="item.id"
										 :label="item.name"
										 :value="item.id"></el-option>
				</el-select>
			</li>

			<li class="uk-search-item" v-if="originTab == 5">
				<span class="uk-search-label">回柜：</span>
				<el-select class="uk-search-content w"
									 clearable
									 filterable
									 v-model="tableData.sendCupboardId"
									 placeholder="请选择">
					<el-option v-for="item in cupboardInfoList"
										 :key="item.id"
										 :label="item.name"
										 :value="item.id"></el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<el-button type="primary"
				           @click="updateUrl(1)">筛选</el-button>
			</li>
		</ul>
		<div class="m-t-xl"
		     v-loading="loading">
			<table class="ukao-order-table w-full">
				<thead>
					<tr>
						<th>客户</th>
						<th>下单时间</th>
						<th>地址坐标 | 派发人员</th>
						<th>地址 | 取/送时间</th>
						<th>标签</th>
						<th>取送员</th>
						<th>取送服务商</th>
						<th>所属门店 | 智柜</th>
						<th>订单状态</th>
						<th>付款状态</th>
						<th>金额</th>
						<th>操作</th>
					</tr>
				</thead>
				<tr class="tr-content"
				    v-if="!tableData.list || tableData.list.length == 0">
					<td colspan="20"
					    style="text-align: center">暂无数据</td>
				</tr>

				<tbody v-for="item in tableData.list"
				       :key="item.id">
					<tr>
						<td colspan="11"></td>
					</tr>
					<tr class="tr-th">
						<td colspan="13">
							<p class="dis-inline w m-r text-black">{{item.originText}} - {{item.takeModeText}}</p>
							<p class="dis-inline m-r-xl">
								<span class="text-muted">订单号：</span>
								<a :href="'/order/list/detail/'+item.id"
														 class="text-primary" target="_blank">{{item.orderNo}}</a>
							</p>
							<p class="dis-inline m-r-xl">下单件数：{{item.createCnt || 0}} <template v-if="item.businessStr">({{item.businessStr}})</template></p>
							<p class="dis-inline" v-if="item.unionId"><span class="group-ico">团</span>{{item.unionName}}</p>
							<span class="pull-right" style="margin-right:10px;">
								<span v-if="item.isEnableDestroy">
									<auth perm="order.list.destroy">
										<el-button type="text" @click="destroy(item)" class="text-danger" style="padding: 0">作废</el-button>
										-
									</auth>
								</span>
								<auth perm="order.list.remark">
									<el-button type="text" @click="mercRemark(item)" style="padding: 0">备注</el-button>
								</auth>
							</span>
						</td>
					</tr>
					<tr class="tr-content">
						<td>
							<div>
								<p><img
									style="vertical-align: middle;width: 14px; margin-right: 2px"
									:src="item.grade == 1 ? '/static/img/user/crown_blue.png' :
												 item.grade == 2 ? '/static/img/user/crown_yellow.png' :
												  item.grade == 3 ? '/static/img/user/crown_purple.png'  : ''"
									alt=""/>{{item.userName || item.userRemark}}</p>
								<p>
									<a target="_blank"
									   :href="'/client/list/'+item.userId+'/basic'"
									   class="text-primary">{{item.userPhone || ''}}</a>
								</p>
								<p>
									<a target="_blank"
										 :href="'/client/list/'+item.userId+'/basic'"
										 class="text-primary">{{item.cardNo || ''}}</a>
								</p>
								<p class="dis-inline text-space" v-if="item.userUnionName!==null"><span class="group-ico">团</span>{{item.userUnionName}}</p>
							</div>
						</td>
						<td>
							<div> {{item.date}}</div>
							<div> {{item.time}}</div>
						</td>
						<td>
							<div v-if="item.takeLng"> {{item.takeLng}},{{item.takeLat}}</div>
							<div>
								<span v-for="work in item.waitWorkList">
									<a target="_blank"
									   :href="'/worker/detail/'+work.workId"
									   class="text-primary">{{work.name}}</a> | </span>
								<template v-if="item.waitWorkList != null && item.waitWorkList.length == 0" ><span class="text-muted">不在取送范围内</span></template>
							</div>
						</td>
						<td>
							<div style="padding: 3px;border: 1px dashed #167efb;" v-if="item.takeMode ==2">
								<p>{{(item.takePhone ||'')}} &nbsp; {{(item.takeName || '')}}</p>
								<p>{{(item.takeAddress || '')}}<template v-if="item.isEnableUpdateTakeAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckAddress(0, item)"> - 修改</a></auth></template></p>
								<p>取件时间：{{item.takeDate}} &nbsp;{{item.takeTimeStart}}-{{item.takeTimeEnd}}<template v-if="item.isEnableUpdateTakeAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(0, item)"> - 修改</a></auth></template></p>
							</div>
							<div style="margin-top: 5px;padding: 3px;border: 1px dashed #3dc700;" v-if="item.sendMode ==2">
								<p>{{(item.sendPhone ||'')}} &nbsp; {{(item.sendName || '')}}</p>
								<p>{{(item.sendAddress || '')}} <template v-if="item.isEnableUpdateSendAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckAddress(1, item)"> - 修改</a></auth></template></p>
								<p>送件时间：{{item.sendDate}} &nbsp;{{item.sendTimeStart}}-{{item.sendTimeEnd}}<template v-if="item.isEnableUpdateSendAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(1, item)"> - 修改</a></auth></template></p>
							</div>
						</td>
						<td style="max-width:140px;">
							<div class="m-r-sm m-b-sm item-tag" v-for="tag in item.tags" :key="tag.id">{{tag.name}}</div>
						</td>
						<td>
							<div class="text-xs" v-if="item.takeMode == 2">
								<span class="tx ts-icon">取</span>
								<span>{{item.takeWorkName || "未指派"}}</span>
								<span v-if="!item.takeExpressType && item.statusVal < 5"><auth perm="order.list.assign"> - <a class="text-primary" @click="startCheckStaff(0, item)">指派</a></auth></span>
							</div>
							<div class="text-xs m-t-xs" v-if="item.sendMode == 2">
								<span class="sx ts-icon">送</span>
								<span>{{item.sendWorkName || "未指派"}}</span>
								<span v-if="!item.sendExpressType && item.statusVal < 41"><auth perm="order.list.assign"> - <a class="text-primary" @click="startCheckStaff(1, item)">指派</a></auth></span>
							</div>
						</td>
						<td>
							<div class="text-xs" v-if="item.takeMode == 2">
								<span class="tx ts-icon">取</span>
								<template v-if="item.takeExpressType">
									{{item.takeExpressType | getValText('EXPRESS_TYPE')}}：{{item.takeExpressNo}}
								</template>
								<template v-else>
									未指派<span v-if="item.statusVal < 5 || item.expressStatus == -1"><auth perm="order.list.assign"> - <a class="text-primary" @click="showExpress(1, item)">指派</a></auth></span>
								</template>
							</div>
							<div class="text-xs m-t-xs" v-if="item.sendMode == 2">
								<span class="sx ts-icon">送</span>
								<template v-if="item.sendExpressType">
									{{item.sendExpressType | getValText('EXPRESS_TYPE')}}：{{item.sendExpressNo}}
								</template>
								<template v-else>
									未指派
								</template>
							</div>
						</td>
						<td>
							<div>
								<a target="_blank"
								   :href="'/store/info/'+item.storeId"
								   class="text-primary">{{item.storeName || ''}}</a>
							</div>
							<div></div>
						</td>
						<td>
							<!--订单状态-->
							<div :class="(item.statusVal===3 || item.statusVal===47 || item.statusVal===29 || item.statusVal===50) ? 'text-success' :''">{{item.statusText}}</div>
						</td>
						<td>
							<div :class="item.payStatus != 1 ? 'text-danger' : 'text-success'">{{item.payStatusText}} <span class="bg-danger ts-icon" v-if="item.creditStatus == 1">赊</span></div>
						</td>
						<td colspan="2" >
							<div style="width: 50px">{{item.paymentPrice | amtFormat}} <span class="bg-danger ts-icon" v-if="item.isModifyPrice == 1">改</span></div>
						</td>
					</tr>
					<tr class="tr-tip"
					    v-show="item.userRemark || item.remark || (item.rList && item.rList.length > 0)">
						<td colspan="12">
							<span class="m-r-lg text-warning light"
							   v-if="item.userRemark" style="font-size:10px;">用户：{{item.userRemark || '-'}}</span>
							<span class="text-danger light"
							   v-if="item.remark" style="font-size:10px;">管理：{{item.remark || '-'}}</span>
							<span class="text-danger light"
										v-if="item.rList && item.rList.length > 0" style="font-size:10px;">
								管理：<template v-for="r in item.rList">{{r.remark}}<span class="text-muted">【{{r.workName}}】</span> </template>
							</span>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="text-right m-t-sm">
				<div class="pull-left">
					<auth perm="order.list.export">
						<el-button size="small" @click="exportReportData">导出</el-button>
						<el-button size="small" @click="showExportReport = true">查看报表</el-button>
					</auth>
				</div>
				<el-pagination :page-size="tableData.pagination.size"
				               layout="total, prev, pager, next"
				               :total="tableData.pagination.total"
				               :current-page.sync="tableData.pagination.page"
				               @current-change="handleCurrentChange">
				</el-pagination>
			</div>
		</div>

		<!-- 管理备注-->
		<el-dialog class="ukao-dialog"
		           title="备注"
		           :visible.sync="remarkDialog.visible"
		           size="small">
			<div>
				<el-form :model="remarkDialog.ruleForm"
				         ref="remarkDialog.ruleForm"
				         label-width="160px">

					<el-form-item label="用户:">
						<div>
							<p v-if="remarkDialog.ruleForm.userRemark"
							   class="w-lg text-warning ">{{remarkDialog.ruleForm.userRemark || '未备注'}}</p>
							<p v-else
							   class="text-muted">未备注</p>
						</div>
					</el-form-item>

					<el-form-item label="管理"
					              prop="remark"
					              :rules="[
							{ min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}
						]">
						<div class="w-lg">
							<el-input type="textarea"
							          :autosize="{ minRows: 4, maxRows: 6}"
							          v-model="remarkDialog.ruleForm.remark"
							          auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="remarkDialog.visible=false">取消</el-button>
						<el-button type="primary"
						           @click="mercRemarkSave('remarkDialog.ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<!-- end管理备注-->

		<!-- 订单作废-->
		<el-dialog class="ukao-dialog"
		           title="订单作废"
		           :visible.sync="destroyDialog.visible"
		           size="small">
			<div>
				<el-form :model="destroyDialog.ruleForm"
				         ref="destroyDialog.ruleForm"
				         label-width="160px">
					<div class="w-full m-b-sm m-l-xxl">
						{{destroyDialog.msg}}
					</div>
					<el-form-item label="作废备注"
					              prop="remark"
					              :rules="[
						  { required: true, message: '请输入作废内容', trigger: 'blur' },
							{ min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}
						]">
						<div class="w-lg">
							<el-input type="textarea"
							          :autosize="{ minRows: 4, maxRows: 6}"
							          v-model="destroyDialog.ruleForm.remark"
							          auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="destroyDialog.visible=false">取消</el-button>
						<el-button type="primary"
						           @click="destroySave('destroyDialog.ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<!-- end订单作废-->

		<!-- 指定派送收人员弹窗 -->
		<el-dialog :title="editStatus?'请指定送件员':'请指定收件员'" :visible.sync="personbox" :lock-scroll='false'>
			<div class="scrollbox">
				<div class="staff-item" @click="checkedStaff(item)" :class="{selected:item.checked}" v-for="(item,index) in staffList" :key="index">
					<div class="user-logo">
						<img :src="item.imgPath?item.imgPath:'/static/img/user/def.png'" alt="">
						<div class="mask text-center">
							<i class="el-icon-check text-xl"></i>
						</div>
					</div>
					<p class="text-center">
						<span class="name">{{item.name}}</span>
					</p>
				</div>
			</div>
			<div class="footer text-right" slot="footer">
				<el-button @click="personbox = false">取消</el-button>
				<el-button type="primary" @click="subStaff">确认</el-button>
			</div>
		</el-dialog>

		<!-- 指定取送服务商 -->
		<el-dialog :title="expressMode==1?'指定取件服务商':'指定送件服务商'" :visible.sync="expressbox" :lock-scroll='false' :width="dialogWidth"  style="height: 100%">

			<div class="new_scrollbox">
				<div class="staff-item" @click="checkedExpress(item)" :class="{selected:item.checked}" v-for="(item,index) in expressList" :key="index">
					<div class="user-logo">
						<img src="/static/img/marketing/sf_logo.png" alt="">
						<div class="mask text-center">
							<i class="el-icon-check text-xl"></i>
						</div>
					</div>
					<p class="text-center">
						<span class="name">{{item.type | getValText('EXPRESS_TYPE')}}</span>
					</p>
				</div>
				<div style="border-top:1px dotted #e5e5e5; margin:10px"></div>
				<div v-if="expressObj">
					<el-form label-width="130px" class ="el-frin-express">
						<!--<p class="text-center">-->
							<!--<span class="name">收件人：{{expressObj.pickupName}} {{expressObj.pickupPhone}}</span>-->
						<!--</p>-->
						<!--<p class="text-center">-->
							<!--<span class="name">收件地址：{{expressObj.pickupRegionalDesc}} {{expressObj.pickupDetail}}</span>-->
						<!--</p>-->
						<el-form-item class="m-b-none input_width" label="寄件人姓名：">
							<el-input  type="text" v-model="orderInfo.takeName"></el-input>
						</el-form-item>
						<el-form-item class="m-b-none input_width" label="寄件人手机号：">
							<el-input type="text"  v-model="orderInfo.takePhone"></el-input>
						</el-form-item>
						<!--<el-form-item class="m-b-none input_width" label="寄件人地址：">-->
							<!--<el-input type="text" v-model="orderInfo.takeAddressHead"> </el-input>-->
							<!--<el-input type="text" class="input_width" style="width: 100%;text-align:right" v-model="orderInfo.takeAddressTrail"></el-input>-->
						<!--</el-form-item>-->
						<el-form-item label="收件人地址：" style="margin-bottom:0px" :rules="{required:!orderInfo.takeAddressHead,message:'收件地址不能为空',trigger:'change'}">
							<div class="add-w-lg w-lg">
								<p @click="selecetAddres"><el-input v-model="orderInfo.takeAddressHead" readonly="readonly" :class="{'b-t-none':addresShow }" style="margin-top: 15px;" placeholder="请选择所在地区，如：湖南省-长沙市-岳麓区" ></el-input></p>
								<!-- {{}} -->
								<div class="ul-wrap" v-show="addresShow">
									<a class="a-btn" :class="{'curr-active':addActive===1}" @click="onAbtn(1)">{{addresName.provinceName || '省/直辖市'}}</a>
									<a class="a-btn" :class="{'curr-active':addActive===2,'curr-hidden':!recordAddes.city}" @click="onAbtn(2)">{{addresName.cityName || '请选择'}}</a>
									<a class="a-btn" :class="{'curr-active':addActive===3,'curr-hidden':!recordAddes.distri}" @click="onAbtn(3)">{{addresName.districtName || '请选择'}}</a>
									<div class="ul">
										<ul v-if="addActive===1">
											<li v-for="item in provinceItems" :key="item.value"><a @click="chooseProv(item)" :class="{'is-selected':item.selectProm}" :title="item.label">{{item.label}}</a></li>
										</ul>
										<ul v-else-if="addActive===2">
											<li v-for="item in cityItems" :key="item.value"><a @click="chooseCity(item)" :class="{'is-selected':item.selectCity}" :title="item.label">{{item.label}}</a></li>
										</ul>
										<ul v-else-if="addActive===3">
											<li v-for="item in districtItem" :key="item.value"><a @click="chooseDis(item)" :class="{'is-selected':item.selectDistri}" :title="item.label">{{item.label}}</a></li>
										</ul>
									</div>
								</div>
								<el-input type="text" class="input_width" style="width: 100%"  v-model="orderInfo.takeAddressTrail"></el-input>
							</div>

						</el-form-item>
						<el-form-item class="m-b-none input_width" label="客户下单取件时间：">
							<p>{{orderInfo.takeDate}} &nbsp;{{orderInfo.takeTimeStart}}-{{orderInfo.takeTimeEnd}}<template><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(0, orderInfo)"> - 修改</a></auth></template></p>
						</el-form-item>
						<el-form-item class="m-b-none input_width"  :rules="{validator: checkTime, required:true, trigger:'change'}" label="发送顺丰取件时间：" prop="expressTakeDate">
							<el-date-picker
								@change="changeTakeDate"
								v-model="expressTakeDate"
                format="yyyy-MM-dd HH:mm"
								type="datetime"
								sizr="large"
								:default-value="expressTakeDate"
								placeholder="选择日期时间">
							</el-date-picker>
							<!--<p v-show="takeDateErrFlag" class="text-danger express-take-err" >已过客户下单取件时间，请联系客户修改取件时间后再指派</p>-->
            </el-form-item>
          </el-form>
					<el-form  style="float: right; width: 50%" label-width="120px">
						<el-form-item class="m-b-none input_width" label="收件人：">
							<el-input  type="text" disabled v-model="expressObj.pickupName"></el-input>
						</el-form-item>
						<el-form-item class="m-b-none input_width" label="收件人手机号：">
							<el-input type="text" disabled v-model="expressObj.pickupPhone"></el-input>
						</el-form-item>
						<el-form-item class="m-b-none  input_width" label="收件人地址：">
							<el-input type="text" disabled v-model="expressObj.pickupRegionalDesc"> </el-input>
							<el-input type="text" disabled class="input_width" style="width: 100%;" v-model="expressObj.pickupDetail"></el-input>
						</el-form-item>
						<el-form-item class="m-b-none input_width" label="备注：">
							<!--<div >-->
								<el-input type="textarea"
													:autosize="{ minRows: 4, maxRows: 6}"
													v-model="expressRemark"
													auto-complete="off"></el-input>
							<!--</div>-->
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="footer text-right" slot="footer">
				<el-button @click="expressbox = false">取消</el-button>
				<el-button type="primary" @click="subExpress" :loading="expressIng" :disabled="takeDateErrFlag">确认</el-button>
			</div>

		</el-dialog>

		<!-- 地址修改弹窗 -->
		<el-dialog :title="editAddress?'请选择送件地址':'请选择取件地址'" :visible.sync="addressbox" :lock-scroll='false'>
		 <div class="scrollbox">
			<el-row :gutter="0" class="b-b">
				<el-col :span="4"><div class="grid-content">联系人</div></el-col>
				<el-col :span="6"><div class="grid-content">手机/电话</div></el-col>
				<el-col :span="6"><div class="grid-content">地址</div></el-col>
				<el-col :span="8"><div class="grid-content">详细地址</div></el-col>
			</el-row>
			<el-row class="b-b" :gutter="0" v-for="(item,index) in addressList" :key="index" @click.native="checkedAddress(item)">
					<el-col :span="4"><div class="grid-content">{{item.name}}</div></el-col>
					<el-col :span="6"><div class="grid-content"><span>{{item.phone}}</span></div></el-col>
					<el-col :span="6"><div class="grid-content">{{item.regionalDesc}}</div></el-col>
					<el-col :span="6"><div class="grid-content">{{item.detail}}</div></el-col>
					<el-col :span="2"><div class="grid-content"><i class="el-icon-circle-check" :class="item.checked?'text-success':' text-muted'"></i></div></el-col>
			</el-row>
		 </div>
			 <div class="footer text-right" slot="footer">
				<el-button @click="addressbox = false">取消</el-button>
				<el-button type="primary" @click="subAddress">确认</el-button>
			</div>
		</el-dialog>

		<!-- 时间弹窗 -->
		<el-dialog :title="editTime?'请选择送件时间':'请选择取件时间'" :visible.sync="timebox" :lock-scroll='false'>
			<div class="timebox">
				<div class="m-b-md">
					<span class="time-item" :class="{'selected':selectedTimes.dayIndex == index}" v-for="(item,index) in daysList" :key="index" @click="selectedDay(item,index)">{{item}}</span>
				</div>
				<div>
					<span class="time-item" :class="{'disable':(!item.status || timeIsLapse(item)),'selected':selectedTimes.id == item.id}" v-for="(item,index) in timeBoxList" :key="index" @click="selectedTimeSlot(item)">{{item.timeStart}}-{{item.timeEnd}}</span>
				</div>
			</div>
			 <div class="footer text-right" slot="footer">
				<el-button @click="timebox = false">取消</el-button>
				<el-button type="primary"  @click="subTimes">确认</el-button>
			</div>
		</el-dialog>

		<el-dialog class="ukao-dialog"
							 title="订单报表"
							 size="small"
							 :visible.sync="showExportReport">
			<exportReport bizType="order" :toQuery="showExportReport" @cancel="showExportReport = false"></exportReport>
		</el-dialog>

	</div>
</template>

<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";
import orderConfig from "@/models/order/config";
import storeSelect from "@/components/DropDownList/store";
import citySelect from "@/components/DropDownList/city";
import keyval from '@/utils/dickeyval';
import regional from '@/utils/regional';
import exportReport from '@/components/ExportReport';

export default {
  props: ["originTab"],
  data: function() {
    return {
			dialogWidth:'70%',
      takeDateErrFlag:false,
      loading: true,
      expressIng:false,
      showExportReport: false,
      page: 1,
      tableData: {
        keywords: "",
        list: [],
        pagination: {
          size: consts.PAGE_SIZE,
          total: 0,
          page: 1
        },
        takeCupboardId: "",
        sendCupboardId: "",
        expressType: "",
        creditStatus: "",
        isModifyPrice: "",
        origin: "",
        origins: "",
        payStatus: "",
        orderStatus: "",
        takeMode: "",
        sendMode: "",
        searchInputType: "",
        searchInput: "",
				searchValue:'',
				unionId:'',//团体ID
				userUnionId:'',//用户团体id
				takeOrSendWorkId:'',//取送人员ID
        orderNo: "",
        phone: "",
        cardNo: "",
        storeId: "",
        cityId: "",
				takeAddress : "",
    		takeName : "",
        takePhone : "",
        mercApiId : '',
        noAssignTakeWork: false,
        outOfRange: false,
        searchDateType: "1",
        createTimeObj: [new Date() - 3600 * 1000 * 24 * 30, new Date()],
				takeDateObj:"",//取件日期
      },
			takeOrSendWorkIdList:[],//取件员列表
			unionList:[],//团体列表
			staffList:[],  //取送人员列表
			personbox:false, //是否显示选人弹窗
			editStatus:0, //修改人员状态 0：收件员  1：送件员
			selectedStaff:null, // 当前选中的人员

			expressbox:false,		// 是否显示选择服务商列表
			expressList:[],			// 服务商列表
			expressMode: null, // 取送模式 1：收件  1：送件
			expressObj: null, // 当前选中的服务商
			expressRemark: '', // 快递备注
      expressTakeDate: '',//取送服务商指派时间
			addressList:[],  //地址列表
			addressbox:false, //是否显示地址选择弹窗
			editAddress:0, //修改地址状态 0：取件地址  1：送件地址
			selectedAddress: null, //当前选中的地址

			timer:null, //当前时间
			daysList:null, //天列表
      cupboardInfoList: [],
			takeTimeList:[],  //取件时间段列表
			sendTimeList:[],  //送件时间段列表
			timeBoxList:[],  //时间选择弹窗的时间段列表
      mercApiList: [], // 外部渠道
			timebox: false, //是否显示时间选择弹窗
			editTime:0,  //修改时间  0:取件时间   1：送件时间
			selectedTimes:{ //选择的时间
			 day:'',
			 date:'',
			 dayIndex:0,
			 timeStart:'',
			 timeEnd:'',
			 id:0, //时间段id
			},

			orderInfo:{
        id:'',
				storeId:'',
				sendWorkId:'',
				takeWorkId:'',

			},
      remarkDialog: {
        visible: false,
        ruleForm: {
          id: "",
          userRemark: "",
          remark: ""
        }
      },
      destroyDialog: {
        //作废
        visible: false,
        msg: "",
        ruleForm: {
          id: "",
          remark: ""
        }
      },
      options:[{
        value: "noAssignTakeWork",
        label: '未指派'
			},{
        value:"outOfRange",
				label:"超出取送范围"
			},{
        value:"overtime",
        label:"超期"
			}
			],
      statusList:[],
      searchOptions: [
				{ val: "", text: "全部" },
        { val: "1", text: "订单编号" },
        { val: "2", text: "客户电话" },
        { val: "3", text: "会员卡号" },
        { val: "4", text: "下单地址" },
        { val: "5", text: "下单联系人" },
        { val: "6", text: "下单电话" }
      ],
      dateOptions: [{ val: "1", text: "下单时间" }],
      pickerOptions0: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const date = new Date();
              picker.$emit("pick", [date, date]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [date, date]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      payStatusOptions: [],
      orderStatusOptions: [],
      orderTakeModeOptions: [],
      orderSendModeOptions: [],
      expressOptions:keyval['EXPRESS_TYPE'],
      creditStatusList: keyval['CREDIT_STATUS'],
      provinceItems: [],//省份选择
      cityItems:[],//城市选择
      districtItem:[],//区域选择
      addActive:1,//选择地址进度标志
      addresShow:false,//地址选择框出现
      addresName:{//存储城市名字
      provinceName:'',
        cityName:'',
        districtName:''
    	},
			recordAddes:{//记录省市菜单是否被选择过
        city:false,
        distri:false
      },
//      rules: {
//        expressTakeDate:[{
//          required: this.takeDateErrFlag, message:"已过客户下单取件时间，请联系客户修改取件时间后再指派",trigger:"change"
//				}]
//			}
    };
  },
  created() {
    this.initProvinceItems();
    if (this.originTab) {
      let origins = this.originTab.split(",");
      if (origins.length > 1) {
        this.tableData.origins = this.originTab;
			} else {
        this.tableData.origin = this.originTab;
			}
			if (this.originTab == 5) {
        this.getCupboardInfoList();
			}
		}
    this.initParams();
    this.list();
		this.queryUnionList();
    this.queryMercApiList();
		this.queryTakeOrSendWorkIdList();
    this.payStatusOptions = orderConfig.orderPayStatusList() || [];
    this.orderStatusOptions = orderConfig.orderStatusList() || [];
    this.orderTakeModeOptions = orderConfig.orderTakeModeList() || [];
    this.orderSendModeOptions = orderConfig.orderSendModeList() || [];
  },
  //设置搜索时间范围
  banDate: {
    disabledDate(newTime) {
      let startTime = this.orderInfo.takeDate +' '+this.orderInfo.takeTimeStart+":00";
      return newTime.getTime() > time.getDateTime(startTime);
    }
  },
  watch: {
    addresShow: {
      handler(){
        if (!this.addresShow) {
          this.addActive = 1;
          this.orderInfo.takeAddressHead = `${this.addresName.provinceName} ${this.addresName.cityName}${this.addresName.districtName === "" ? "" : " " + this.addresName.districtName}`
        }
      }
    },
    $route() {
      this.initParams();
      this.list();
    }
  },
  methods: {
    initProvinceItems(){
      let Arr=regional.getProvince();
      Arr.forEach(function(item){
        item.selectProm=""
      })
      this.provinceItems = Arr;
		},
		queryTakeOrSendWorkIdList(){
			this.$store.dispatch('post',{
				uri:'workerInfo/takeAndSend/list',
			}).then(res=>{
				this.takeOrSendWorkIdList=res.data.data;
			})
		},
    getCupboardInfoList (){
      this.$store.dispatch('getList', {
        uri : 'cupboardInfo/queryForSelect',
        data: {status: 1}
      }).then((res) =>{
        this.cupboardInfoList = res.data.data || []
      })
    },
    queryMercApiList() {
      this.$store
        .dispatch("post", {
          uri: "mercApi/queryForSelect",
          data: {type : 1}
        }).then(res => {
        this.mercApiList = res.data.data || [];
      });
    },
		queryUnionList() {
      this.$store
        .dispatch("post", {
          uri: "unionInfo/queryForSelect"
        })
        .then(res => {
          this.unionList = res.data.data || [];
        });
    },
    updateUrl(page = 1) {
			if (!this.tableData.createTimeObj) this.tableData.createTimeObj = [];
			if (!this.tableData.takeDateObj) this.tableData.takeDateObj = [];
      this.searchInput(this.tableData.searchInputType);
      this.$router.push({
        path: this.$route.path,
        query: {
          page: page,
          searchType: this.tableData.searchInputType, //查询方式 订单号，电话，会员卡号
					searchValue:this.tableData.searchValue,
          orderNo: this.tableData.orderNo, //订单编号
          phone: this.tableData.phone, //查询的电话
          cardNo: this.tableData.cardNo, //会员卡号
          startCreateTime: time.getDate(this.tableData.createTimeObj[0]), //下单时间
          endCreateTime: time.getDate(this.tableData.createTimeObj[1]), //下单时间
					startTakeDate:time.getDate(this.tableData.takeDateObj[0]), //取件时间
					endTakeDate:time.getDate(this.tableData.takeDateObj[1]), //取件时间
          payStatus: this.tableData.payStatus, //支付方式
          takeCupboardId: this.tableData.takeCupboardId, //送洗柜
          sendCupboardId: this.tableData.sendCupboardId, //回柜
          takeMode: this.tableData.takeMode, //取件方式
          sendMode: this.tableData.sendMode, //送件方式
          statusVal: this.tableData.orderStatus, // 订单状态
          expressType: this.tableData.expressType, // 取送服务商(物流公司)类型
          creditStatus: this.tableData.creditStatus,
          isModifyPrice: this.tableData.isModifyPrice,
          mercApiId: this.tableData.mercApiId,
					unionId:this.tableData.unionId,//团体客户
					userUnionId:this.tableData.unionId,
					takeOrSendWorkId:this.tableData.takeOrSendWorkId,//取送人ID
					takeDate:'',//取件时间
          origin: this.tableData.origin,
          origins: this.tableData.origins,
          storeId: this.tableData.storeId,
          cityId: this.tableData.cityId,
					takeAddress : this.tableData.takeAddress,
	    		takeName : this.tableData.takeName,
          takePhone : this.tableData.takePhone,
          statusList : this.statusList,
          noAssignTakeWork: this.tableData.noAssignTakeWork,
          outOfRange: this.tableData.outOfRange
          //  keywords: this.tableData.keywords || '',
        }
      });
    },
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(this.$route.query) !== "{}") {
        this.tableData.pagination.page = parseInt(data.page || 1);
        this.page = parseInt(data.page || 1);
        this.tableData.searchInputType = data.searchType || "";
				this.tableData.searchValue=data.searchValue || "";
        this.tableData.orderNo = data.orderNo || "";
        this.tableData.phone = data.phone || "";
        this.tableData.cardNo = data.cardNo || "";
				this.tableData.unionId=data.unionId || "";
				this.tableData.userUnionId=data.unionId || "";
				this.tableData.takeOrSendWorkId=parseInt(data.takeOrSendWorkId)|| "";
				this.tableData.takeCupboardId=parseInt(data.takeCupboardId)|| "";
				this.tableData.sendCupboardId=parseInt(data.sendCupboardId)|| "";
				this.tableData.takeAddress = data.takeAddress || "";
				this.tableData.takeName = data.takeName || "";
				this.tableData.takePhone = data.takePhone || "";
        this.tableData.expressType=data.expressType || "";
        this.tableData.creditStatus = data.creditStatus|| "";
        this.tableData.isModifyPrice = data.isModifyPrice|| "";
        this.statusList = data.statusList || [];
        this.tableData.noAssignTakeWork = eval(data.noAssignTakeWork)==true;
        this.tableData.outOfRange = eval(data.outOfRange)==true;
        this.tableData.payStatus = data.payStatus
          ? data.payStatus.toString()
          : "";
        this.tableData.takeMode = data.takeMode? data.takeMode.toString() : "";
        this.tableData.sendMode = data.sendMode? data.sendMode.toString() : "";
        this.tableData.mercApiId = parseInt(data.mercApiId) || "";
        this.tableData.orderStatus = data.statusVal
          ? data.statusVal.toString()
          : "";
        this.tableData.searchInput =
					this.tableData.searchValue ||
          this.tableData.orderNo ||
          this.tableData.phone ||
          this.tableData.cardNo ||
					this.tableData.takeAddress ||
					this.tableData.takePhone ||
					this.tableData.takeName;
        this.tableData.createTimeObj = [
          data.startCreateTime,
          data.endCreateTime
        ];
				this.tableData.takeDateObj=[
					data.startTakeDate,
					data.endTakeDate
				]
        this.tableData.cityId = parseInt(data.cityId) || "";
        this.tableData.storeId = parseInt(data.storeId) || "";
      }
		},
		exportData(){
			let params="startCreateTime="+(time.getDate(this.tableData.createTimeObj[0]) || "");
			params+="&endCreateTime="+(time.getDate(this.tableData.createTimeObj[1]) || "");
			params+="&orderNo="+(this.tableData.orderNo || "");
			params+="&phone="+(this.tableData.phone || "");
			params+="&cardNo="+(this.tableData.cardNo || "");
			params+="&payStatus="+(this.tableData.payStatus || "");
			params+="&statusVal="+(this.tableData.orderStatus || "");
			params+="&takeMode="+(this.tableData.takeMode || "");
			params+="&sendMode="+(this.tableData.sendMode || "");
			params+="&takeCupboardId="+(this.tableData.takeCupboardId || "");
			params+="&sendCupboardId="+(this.tableData.sendCupboardId || "");
			params+="&searchType="+(this.tableData.searchInputType || "");
			params+="&searchValue="+(this.tableData.searchValue || "");
			params+="&origin="+(this.tableData.origin || "");
			params+="&origins="+(this.tableData.origins || "");
			params+="&unionId="+(this.tableData.unionId || "");
			params+="&userUnionId="+(this.tableData.userUnionId || "");
			params+="&mercApiId="+(this.tableData.mercApiId || "");
			params+="&storeId="+(this.tableData.storeId || "");
			params+="&cityId="+(this.tableData.cityId || "");
			params+="&takeAddress="+(this.tableData.takeAddress || "");
			params+="&takeName="+(this.tableData.takeName || "");
			params+="&takePhone="+(this.tableData.takePhone || "");
			params+="&statusList="+(this.statusList || []);
			params+="&noAssignTakeWork="+(this.tableData.noAssignTakeWork || "");
			params+="&outOfRange="+(this.tableData.outOfRange || "");
			params+="&expressType="+(this.tableData.expressType || "");
			params+="&creditStatus="+(this.tableData.creditStatus || "");
			params+="&isModifyPrice="+(this.tableData.isModifyPrice || "");
			params+="&takeOrSendWorkId="+(this.tableData.takeOrSendWorkId || "");
			params+="&startTakeDate="+(this.tableData.takeDateObj[0] || "");
			params+="&endTakeDate="+(this.tableData.takeDateObj[1] || "");
			window.open(consts.BASE_URL + "/export/order/list?" + params);
		},
    exportReportData() {
      this.$store.dispatch("post", {
				uri: "export/order/report",
				data: {
					startCreateTime: time.getDate(this.tableData.createTimeObj[0]),
					endCreateTime: time.getDate(this.tableData.createTimeObj[1]),
					startTakeDate:time.getDate(this.tableData.takeDateObj[0]),
					endTakeDate:time.getDate(this.tableData.takeDateObj[1]),
					orderNo: this.tableData.orderNo,
					phone: this.tableData.phone,
					cardNo: this.tableData.cardNo,
					payStatus: this.tableData.payStatus,
					statusVal: this.tableData.orderStatus,
					takeMode: this.tableData.takeMode,
					sendMode: this.tableData.sendMode,
          takeCupboardId: this.tableData.takeCupboardId,
          sendCupboardId: this.tableData.sendCupboardId,
					mercApiId: this.tableData.mercApiId,
					searchType: this.tableData.searchInputType,
					searchValue:this.tableData.searchValue,
					origin: this.tableData.origin,
					origins: this.tableData.origins,
					expressType: this.tableData.expressType,
					creditStatus: this.tableData.creditStatus,
          isModifyPrice: this.tableData.isModifyPrice,
					unionId:this.tableData.unionId,
					userUnionId:this.tableData.unionId,
					takeOrSendWorkId:this.tableData.takeOrSendWorkId,
					storeId: this.tableData.storeId,
					cityId: this.tableData.cityId,
					takeAddress: this.tableData.takeAddress,
					takeName: this.tableData.takeName,
					takePhone: this.tableData.takePhone,
				}
      }).then(res => {
        this.showExportReport = true;
      });
		},
    statusChange(val) {
			if (val != 1) {
			  this.statusList = [];
				this.tableData.noAssignTakeWork = false;
				this.tableData.outOfRange = false;
			}
		},
    list(page) {
      this.loading = true;
      if (page) this.tableData.pagination.page = parseInt(page || 1);
      let noAssignTakeWork = '';
      let outOfRange = '';
      let overtime = '';
     /* if (this.tableData.orderStatus == 1) {
        if (this.tableData.noAssignTakeWork) {
          noAssignTakeWork = 1
				}
        if (this.tableData.outOfRange) {
          outOfRange = 1
        }
			}*/
     if(this.statusList){
       if (typeof(this.statusList) == 'string') {
         this.statusList = [this.statusList];
			 }
       this.statusList.forEach(function (item) {
				 switch (item){
					 case "noAssignTakeWork":
             noAssignTakeWork = 1;
						 break;
					 case "outOfRange":
             outOfRange = 1;
					   break;
					 case "overtime":
					   overtime = 1;
					   break;
				 }
       });

		 }
      this.$store
        .dispatch("post", {
           uri: "orderInfo/list",
          data: {
            startRow:
              (this.tableData.pagination.page - 1) *
              this.tableData.pagination.size,
            pageSize: this.tableData.pagination.size,
            startCreateTime: time.getDate(this.tableData.createTimeObj[0]),
            endCreateTime: time.getDate(this.tableData.createTimeObj[1]),
						startTakeDate:time.getDate(this.tableData.takeDateObj[0]),
						endTakeDate:time.getDate(this.tableData.takeDateObj[1]),
            orderNo: this.tableData.orderNo,
            phone: this.tableData.phone,
            cardNo: this.tableData.cardNo,
            payStatus: this.tableData.payStatus,
            statusVal: this.tableData.orderStatus,
            takeMode: this.tableData.takeMode,
            sendMode: this.tableData.sendMode,
            takeCupboardId: this.tableData.takeCupboardId,
            sendCupboardId: this.tableData.sendCupboardId,
            mercApiId: this.tableData.mercApiId,
            searchType: this.tableData.searchInputType,
						searchValue:this.tableData.searchValue,
            origin: this.tableData.origin,
            origins: this.tableData.origins,
            expressType: this.tableData.expressType,
            creditStatus: this.tableData.creditStatus,
            isModifyPrice: this.tableData.isModifyPrice,
						unionId:this.tableData.unionId,
						userUnionId:this.tableData.unionId,
						takeOrSendWorkId:this.tableData.takeOrSendWorkId,
            storeId: this.tableData.storeId,
            cityId: this.tableData.cityId,
						takeAddress: this.tableData.takeAddress,
						takeName: this.tableData.takeName,
            takePhone: this.tableData.takePhone,
            noAssignTakeWork: noAssignTakeWork,
            outOfRange: outOfRange,
            overtime: overtime
          }
        })
        .then(res => {
          let list = res.data.data.list || [];
          list.forEach(function(item) {
            if (item.createTime) {
              item.date = time.getDate(item.createTime);
              item.time = time.getTime(item.createTime);
            }
            item.destroy = orderConfig.destroy(item.statusVal);

            if(item.business) {
              let bList = JSON.parse(item.business);
              let tmpList = [];
              bList.forEach(function (bi) {
                tmpList.push(bi.name)
              });
              item.businessStr = tmpList.join('/')
            }
            if (item.remarkJson) {
              let rJson = JSON.parse(item.remarkJson);
              let rList = [];
              rJson.forEach(function (ri) {
                rList.push(ri)
              });
              item.rList = rList;
						}
          });
					this.tableData.list = list;
					if(this.tableData.list.length!==0){
						this.getTags();
					}
          this.tableData.pagination.total = res.data.data.total || 0;
          this.tableData.pagination.page = this.page;
          this.loading = false;
        });
		},
		getTags(){
			let userIds=[];
			let ArrId=this.tableData.list;
			for(let i=0;i<ArrId.length;i++){
				userIds.push(ArrId[i].userId);
			}
			this.$store.dispatch('post',{
				uri:'userTagRel/queryUserTagList',
				data:{
					userIds:userIds.join(',')
				}
			}).then(res=>{
        let tagArr = res.data.data;
				let list = this.tableData.list;
				let _this = this;

        list.forEach(function(item){
          if (tagArr[item.userId]) {
            _this.$set(item, "tags", tagArr[item.userId]);
          }
				});
			})
		},
    searchInput(val) {
      let txt = this.tableData.searchInput;
			this.tableData.searchValue ="";
      this.tableData.orderNo = "";
      this.tableData.phone = "";
      this.tableData.cardNo = "";
      this.tableData.takeAddress = "";
      this.tableData.takeName = "";
      this.tableData.takePhone = "";
      switch (val) {
				case "":
          this.tableData.searchValue = txt;
          break;
        case "1":
          this.tableData.orderNo = txt;
          break;
        case "2":
          this.tableData.phone = txt;
          break;
        case "3":
          this.tableData.cardNo = txt;
          break;
				case "4":
          this.tableData.takeAddress = txt;
          break;
				case "5":
      		this.tableData.takeName = txt;
          break;
        case "6":
          this.tableData.takePhone = txt;
          break;
        default:
          break;
      }
    },
    destroy(item) {
      var _this = this;
      _this.destroyDialog.msg =
        "此操作将订单【" + item.orderNo + "】永久作废, 是否继续?";
      _this.destroyDialog.visible = true;
      _this.destroyDialog.ruleForm.id = item.id;
    },
    destroySave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("post", {
              uri: "orderInfo/destroy",
              data: {
                id: this.destroyDialog.ruleForm.id,
                remark: this.destroyDialog.ruleForm.remark
              }
            })
            .then(res => {
              this.destroyDialog.visible = false;
              msg.success();
              this.list();
            });
        }
      });
    },
    mercRemark(item) {
      this.remarkDialog.ruleForm.id = item.id || "";
      this.remarkDialog.ruleForm.remark = item.remark || "";
      this.remarkDialog.ruleForm.userRemark = item.userRemark || "";
      this.remarkDialog.visible = true;
    },
    mercRemarkSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("post", {
              uri: "orderExt/addRemark",
              data: {
                id: this.remarkDialog.ruleForm.id,
                remark: this.remarkDialog.ruleForm.remark
              }
            })
            .then(res => {
              this.remarkDialog.visible = false;
              msg.success();
              this.list();
            });
        } else {
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      this.updateUrl(val);
    },
    queryExpressList(cityId, fn) {
      this.$store.dispatch('post',{
        uri:'expressParam/list',
        data:{
          cityId: cityId
        }
      }).then(res=>{
        this.expressList = res.data.data.list || [];
        this.expressList.forEach(item=>{
          this.$set(item,'checked',false)
        });
        if(typeof (fn) === 'function'){
          fn(res.data.data.list[0])
        }
      })
		},
		initExpressTakeDate(_this){
      let startDate = _this.orderInfo.takeDate+" "+_this.orderInfo.takeTimeStart+":00";
      let endDate = _this.orderInfo.takeDate+" "+_this.orderInfo.takeTimeEnd+":00";
      let addTime = time.difference(startDate, endDate, "minutes")/2;
      _this.expressTakeDate = time.format(time.add(startDate, addTime, "minutes"), "YYYY-MM-DD hh:mm");
		},
    showExpress(mode, item) {
      let _this = this;
      _this.takeDateErrFlag = false;
      _this.expressIng = false;
      _this.orderInfo = item;
      let headLength = item.takeAddress.indexOf("  ");
			_this.orderInfo.takeAddressHead = item.takeAddress.substr(0,headLength == -1 ? item.takeAddress.indexOf("区")+1 : headLength);
			_this.orderInfo.takeAddressTrail = item.takeAddress.substr(headLength == -1 ? item.takeAddress.indexOf("区") +2 : headLength +2, item.takeAddress.length);
      _this.initExpressTakeDate(_this);
      _this.expressMode = mode;
			_this.expressObj = null;
			_this.queryExpressList(item.cityId, function (item) {
        _this.expressbox = true;
        if(item){
          _this.checkedExpress(item);
				}
			});
    },
    // 选取人员
    checkedExpress(val){
      this.expressList.forEach(item=>{
        if(item.checked) item.checked = false;
      })
      val.checked = true;
      this.expressObj = val;
      if (!this.expressRemark) {
        this.expressRemark = this.expressObj.remark;
			}
    },
		// 获取可指派的人员
		getStaffList(storeId, fn){
			this.$store.dispatch('get',{
				uri:'workerInfo/takeAndSend/list',
				data:{
					storeId: storeId
				}
			}).then(res=>{
				this.staffList = res.data.data || [];
				this.staffList.forEach(item=>{
					this.$set(item,'checked',false)
				})
				if(typeof (fn) === 'function'){
					fn()
				}
			})
		},
    subExpress() {
      this.expressIng = true;
			let uri = this.expressMode == 1 ? 'expressInfo/assignTake':'';
			this.$store.dispatch('post',{
				uri,
        forceResolve:true,
				data:{
					orderId: this.orderInfo.id,
          type: this.expressObj.type,
					remark: this.expressRemark,
          expressTakeDate: time.getDateTime(this.expressTakeDate)
				}
			}).then(res=>{
			  if (res.data.httpCode == 200) {
          this.expressbox = false;
          msg.success();
          this.list();
				} else {
          this.expressIng = false;
          msg.error(res.data.msg);
				}
			})
		},
    newSubExpress() {
			let uri = this.expressMode == 1 ? 'orderExt/updateRecoilTakeAddress':'';
			this.$store.dispatch('post',{
				uri,
				data:{
					orderId: this.orderInfo.id,
          takeAddress: this.orderInfo.takeAddressHead + "  " + this.orderInfo.takeAddressTrail,
          takeName: this.orderInfo.userName,
          takePhone: this.orderInfo.userPhone
				}
			}).then(res=>{
				this.subExpress();
			})
		},
	// 开始选择收送件人员
	startCheckStaff(i, item){
    let _this = this
		_this.orderInfo = item
		_this.getStaffList(item.storeId, function () {
			_this.editStatus = i;
			_this.personbox = true;
			if(i){
				_this.staffList.forEach(item=>{
				 item.checked = (item.id == _this.orderInfo.sendWorkId) ? true: false;
				 if(item.checked){
					 _this.selectedStaff = item;
				}
			})
			} else{
				_this.staffList.forEach(item=>{
					item.checked = (item.id == _this.orderInfo.takeWorkId) ? true: false;
					if(item.checked){
						_this.selectedStaff = item;
					}
				})
			}
		})
	},
	// 选取人员
	checkedStaff(val){
		this.staffList.forEach(item=>{
			if(item.checked) item.checked = false;
		})
		val.checked = true;
		this.selectedStaff = val;
	},
		// 提交修改的人员信息
	subStaff(){
		 let id = this.editStatus ? this.orderInfo.sendWorkId : this.orderInfo.takeWorkId;
		 if(this.selectedStaff.id != id){
			 let uri = this.editStatus ? 'orderExt/assignSendWork':'orderExt/assignTakeWork';
			 this.$store.dispatch('post',{
				 uri,
				 data:{
					 id:this.orderInfo.id,
					 workId:this.selectedStaff.id
				 }
			 }).then(res=>{
				 this.personbox = false;
				 msg.success()
				 this.list();
			 })
		 }else{
			 this.personbox = false;
		 }
 		},

		// 开始选择收送件地址
		startCheckAddress(i, item){
	  	let _this = this
			_this.orderInfo = item
			_this.getAddressList(function () {
				_this.editAddress = i;
				_this.addressbox = true;
				_this.selectedAddress = null;
				_this.addressList.forEach(item=>{
					item.checked = false;
				})
      })

		},
		// 获取地址列表
		getAddressList(fn){
			this.$store.dispatch('get',{
				uri:'userAddress/list',
				params:{
					userId:this.orderInfo.userId
				}
			}).then(res=>{
				this.addressList = res.data.data.list;
				this.addressList.forEach(item=>{
					this.$set(item,'checked',false);
				})
				if(typeof (fn) === 'function'){
				  fn()
				}
			})
		},
		// 选取地址
		checkedAddress(val){
			val.checked = !val.checked;
			this.addressList.forEach(item=>{
				if(item.checked && item.id !=val.id) item.checked = false;
			})
			this.selectedAddress = val.checked? val:null;
		},
		// 提交地址
		subAddress(){
			if(this.selectedAddress){
				let uri = this.editAddress ? 'orderExt/updateSendAddress':'orderExt/updateTakeAddress';
				this.$store.dispatch('post',{
					uri,
					params:{
						id:this.orderInfo.id,
						addressId:this.selectedAddress.id
					}
				}).then(res=>{
					this.addressbox = false;
					msg.success()
				 this.list();
				})
			}else{
				msg.error('请选择地址');
			}
		},

		// 开始修改时间
		startCheckTime(i, item){
		  this.orderInfo = item
			this.editTime = i;
			this.selectedTimes = {
				day:'',
				date:'',
				dayIndex:0,
				timeStart:'',
				timeEnd:'',
				id:0, //时间段id
			}
			if(this.editTime && !this.sendTimeList.length){
				this.getSendTimeList().then(_=>{
					this.setDayList();
					this.timeBoxList = this.sendTimeList;
				});
			}else if(!this.takeTimeList.length){
				this.getTakeTimeList().then(_=>{
					this.setDayList();
					this.timeBoxList = this.takeTimeList;
				});
			}else{
				 this.timeBoxList = this.editTime ? this.sendTimeList : this.takeTimeList;
			}
			this.timebox = true;
		},

		// 设置日期数组
		setDayList(){
			if(!this.daysList){
				this.daysList = Array.apply(null,Array(20)).map((item,i)=>{
					return new Date(this.timer+1000*60*60*24*i).getMonth()+1+ '-' + new Date(this.timer+1000*60*60*24*i).getDate();
				});
			}
		},
		// 时间段是否失效
		timeIsLapse(item){
			return this.selectedTimes.dayIndex == 0 && (new Date(this.timer).getHours()+1) >= parseInt(item.timeEnd);
		},
		// 选择日期
		selectedDay(val,index){
			this.selectedTimes.day = val;
			this.selectedTimes.date = new Date(this.timer+1000*60*60*24*index).getFullYear()+'-'+val;
			this.selectedTimes.dayIndex = index;
			if(index == 0){
				this.selectedTimes.id = 0;
			}
		},
		// 选择时间段
		selectedTimeSlot(item){
			if(item.status && !this.timeIsLapse(item)){
				this.selectedTimes.timeStart = item.timeStart;
				this.selectedTimes.timeEnd = item.timeEnd;
				this.selectedTimes.id = item.id;
			}
		},
		// 提交时间
		subTimes(){
			if(this.selectedTimes.id){
				if(!this.selectedTimes.date) this.selectedTimes.date = new Date(this.timer).getFullYear()+'-'+this.daysList[0];
				let uri = this.editTime ? 'orderExt/updateSendDate':'orderExt/updateTakeDate';
				this.$store.dispatch('post',{
					uri,
					data:{
						id:this.orderInfo.id,
						date : this.selectedTimes.date,
						timeStart : this.selectedTimes.timeStart,
						timeEnd : this.selectedTimes.timeEnd,
					}
				}).then(res=>{
					if(this.editTime){
						this.orderInfo.sendDate = this.selectedTimes.date;
						this.orderInfo.sendTimeStart = this.selectedTimes.timeStart;
						this.orderInfo.sendTimeEnd = this.selectedTimes.timeEnd;
					}else{
						this.orderInfo.takeDate = this.selectedTimes.date;
						this.orderInfo.takeTimeStart = this.selectedTimes.timeStart;
						this.orderInfo.takeTimeEnd = this.selectedTimes.timeEnd;
					}
					if(this.expressTakeDate){
            this.initExpressTakeDate(this);
					}
					this.timebox = false;
				})
			}else{
				msg.error('请选择时间日期');
			}
		},
		getTakeTimeList(){
			return this.$store.dispatch('get',{
				uri:'serviceTime/take/list',
				params:{
					cityId:this.orderInfo.cityId
				}
			}).then(res=>{
				this.takeTimeList = res.data.data || [];
				this.timer = res.data.timestamp;
			})
		},
		getSendTimeList(){
			return this.$store.dispatch('get',{
				uri:'serviceTime/send/list',
				 params:{
					cityId:this.orderInfo.cityId
				}
			}).then(res=>{
				this.sendTimeList = res.data.data || [];
				this.timer = res.data.timestamp;
			})
		},
    changeTakeDate(){
		  let _this = this;
      if(!_this.expressTakeDate){
        _this.takeDateErrFlag = true;
        return ;
      }
      let startDate = _this.orderInfo.takeDate+" "+_this.orderInfo.takeTimeStart;
      let endDate = _this.orderInfo.takeDate+" "+_this.orderInfo.takeTimeEnd;
      let num = time.difference(startDate, _this.expressTakeDate, "minutes",  true);
      if(num < 0){
        _this.takeDateErrFlag = true;
        return ;
      }
      num = time.difference(endDate, _this.expressTakeDate, "minutes", true);
      if(num > 0){
        _this.takeDateErrFlag = true;
        return ;
      }
      _this.takeDateErrFlag = false;
		},
  chooseProv(selectedItem){
    this.recordAddes.city=true
    this.provinceItems.forEach( function (item, index) {
      item.selectProm = false
    });
    selectedItem.selectProm = true;
    let Arr=regional.getCity(selectedItem.value);
    Arr.forEach(function(item){
      item.selectCity=""
    })
    if(!this.addresName.provinceName.includes(selectedItem.label)){
      this.addresName.cityName="";
      this.addresName.districtName=""
    }
    this.addresName.provinceName=selectedItem.label
    this.cityItems = Arr;
    this.addActive=2;
    this.cheak();
  },
  chooseCity(selectedItem){
    this.cityItems.forEach( function (item, index) {
      item.selectCity = false
    });
    selectedItem.selectCity = true;
    let Arr=regional.getArea(selectedItem.parentId, selectedItem.value);
    Arr.forEach(function(item){
      item.selectDistri=""
    })
    // if(!this.addresName.cityName.includes(selectedItem.label)){
    //   this.addresName.districtName=""
    // }
    this.addresName.cityName=selectedItem.label
    this.districtItem = Arr
    if(Arr.length<=0){
      this.addresShow=false;
      this.addresName.districtName=""
      return;
    }
    this.recordAddes.distri=true;
    this.addActive=3;
    this.cheak();
  },
	cheak(){
		this.orderInfo.takeAddressHead  = this.addresName.provinceName+(this.addresName.cityName==="" ? "" : ' '+this.addresName.cityName)+(this.addresName.districtName==="" ? "" : ' '+this.addresName.districtName)
	},
	chooseDis(selectedItem){
		this.districtItem.forEach( function (item, index) {
			item.selectDistri = false
		});
		selectedItem.selectDistri = true;
		this.addresName.districtName=selectedItem.label;
		this.addresShow=false;
		this.cheak();
	},
    selecetAddres(){
      this.addresShow=true
    },
  onAbtn(type){
    this.addActive=type
  },
		checkTime(rule, value, callback){
      if (this.takeDateErrFlag && !value) {
        callback(new Error("请联系客户修改预约时间，或选择客户预约时段内再指派"));
      } else {
        callback();
      }
		}
 	},
  components: {
    citySelect,
    storeSelect,
    exportReport
  }
};
</script>

<style lang="less" scoped>
	.el-frin-express{
		height: 365px;
		float: left; width: 50%;
	}

	.time-item{
   display: inline-block;
   line-height: 30px;
   padding: 0 10px;
   margin-right: 10px;
   border: 1px solid #ccc;
   margin-bottom: 10px;
   cursor: pointer;
   &.disable{
     background-color: #ccc;
     color:#fff;
     cursor:no-drop;
   }
   &.selected{
     background-color: #27c24c;
     border-color: #27c24c;
     color: #fff;
   }
 }

	.scrollbox{
   max-height: 450px;
   overflow-y: auto;
 }

	.new_scrollbox{
   max-height: 600px;
   overflow-y: auto;
 }

	.grid-content{
	    height: 100%;
	    line-height: 34px;
	    cursor: pointer;
	  }
	  .staff-item {
	    width: 90px;
	    cursor: pointer;
	    margin: 20px 10px 0;
	    vertical-align: top;
	    display: inline-block;
	    .user-logo {
	      margin: 0 auto;
	      width: 80px;
	      height: 80px;
	      border-radius: 50%;
	      overflow: hidden;
	      position: relative;
	      img {
	        width: 100%;
	      }
	      .mask {
	        position: absolute;
	        left: 0;
	        top: 0;
	        width: 100%;
	        line-height: 80px;
	        display: none;
	        background-color: rgba(0, 0, 0, .1);
	        .el-icon-check {
	          color: #fff;
	        }
	      }
	    }
	    .name {
	      margin-top: 5px;
	      line-height: 28px;
	      display: inline-block;
	      padding: 0 15px;
	      border-radius: 14px;
	      border: 1px solid transparent;
	      max-width: 90px;
	    }
	    &.selected {
	      .name {
	        background-color: #d5e5ff;
	        border-color: #20a0ff;
	        color: #20a0ff;
	      }
	      .mask {
	        display: block;
	      }
	    }
	  }
	.group-ico{
		color: #fff;background: #9a74f4; border-radius: 100%;padding: 2px;
		font-size: 12px;
	}
	.text-space{
		max-width: 120px;
		overflow: hidden; 
		text-overflow:ellipsis; 
		white-space: nowrap;
	}
	.item-tag{
		padding: 0px 5px;
		display:inline-block;
		max-width:133px;
		min-width: 35px;
		white-space:normal;
		min-height: 20px;
		line-height: 19px;
		font-size: 12px;
		border-radius: 4px;
		box-sizing: border-box;
		color: #20a0ff;
		border: 1px solid transparent;
		border-color: rgba(32,160,255,.2);
		background-color: rgba(32,160,255,.1);
	}
	.input_width{
		width: 84%;
		margin-top: 15px;
	}
  .express-take-err{
    font-size:14px;
    width:420px
  }

	.order-list{
	.wrap{
		width: 1100px;
		margin: 0 auto;
		padding: 20px 0px;
		border: 1px solid #e5e5e5;
		overflow: hidden;
	}
	.box{
		display: table;
		width: 96%;
		margin: 0px auto;
	}
	.box>div{
		display: table-cell
	}
	.box>div:first-child{
		width: 17%;
	// background-color: pink;
	img{
		vertical-align: top;
	}
	}
	.box>div:nth-child(2){
		vertical-align: top;
	.btn-option {
		position: relative;
	& p{
			margin-top: 0px;
			margin-bottom: 20px;
		}
	.absou-cp{
		position: absolute;
		left: 50%;
		top: 0px;
		transform: translate(-50%)
	}
	.absou-cr{
		position: absolute;
		right: 0;
		top: 0;
	}
	}
	.row_first{
		position: relative;
	.el-button{
		position: absolute;
		top: 50%;
		left: 45px;
		transform: translate(0,-50%);
		padding: 0px;
	}
	}
	.title{
		font-size: 21px;
		font-weight: 600;
	}
	p{
		margin-top: 20px;
		color: #9c9c9c;
	}
	.text-p{
	label{
		font-size: 13px;
		color: #000;
	}
	}
	}
	.ul-wrap{
		max-width: 100%;
		padding: 0 30px;
		margin-top: -1px;
		overflow: hidden;
		text-align: center;
		border: 1px solid #dcdfe6;
		border-top: none;
	// border-radius: 4px;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	.ul{
		border-top: 2px solid #20a0ff;
	ul{
		list-style: none;
	}
	ul li{
		float: left;
		width: 25%;
		text-align: center;
		font-size: 12px;
		height: 30px;
	a{
		display: inline-block;
		min-width: 40px;
		max-width: 60px;
		height: 30px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: center;
		line-height: 30px;
	}
	a:hover{
		background-color: #e9f3fd
	}
	a.is-selected{
		background-color: #20a0ff;
		color:#ffffff;
	}
	}
	}
	}
	.form{
		width: 80%;
		margin: 0 auto;
	}
	.a-btn{
		width: 33%;
		margin:0px -1px;
		text-align: center;
		display: inline-block;
		color: #20a0ff;
	// overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	// background-color: #fff;
	}
	.curr-active{
		background-color: #20a0ff;
		color:#fff;
		visibility: visible !important;
	}
	.curr-hidden{
		visibility: hidden;
	}
	.add-w-lg{
	// width: 450px;
		min-height: 40px;
	&>P{
			margin-top: 0px !important;
		}
	.el-input__inner{
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		border-bottom-left-radius: 0px;
		border-bottom-right-radius: 0px;
		border-color:#dcdfe6 !important;
	}
	.el-input__inner:focus{
		border-color:#dcdfe6;
	}
	.b-t-none input{
		border-bottom: none !important;
	}
	}
	.w-lg{
		width: 80%;
	}
	}

	.bg_orange{
		background-color:#FB6E00
	}
</style>