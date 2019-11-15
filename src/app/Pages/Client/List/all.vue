<template>
	<div class="ukao-pt-md all-css">
		<ul class="uk-search">
			<li class="uk-search-item">
				<el-select class="uk-search-label w-xs"
				           v-model="searchKeys.type"
				           placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option label="手机号" value="1"></el-option>
					<el-option label="卡号" value="2"></el-option>
					<el-option label="姓名" value="3"></el-option>
				</el-select>
				<el-input class="uk-search-content w-sm"
									prefix-icon="el-icon-search"
				          v-model="searchKeys.value"
				          placeholder="请输入内容"></el-input>
			</li>
			<li class="uk-search-item">
				<storeSelect v-model="searchKeys.storeIds"></storeSelect>
			</li>
			<li class="uk-search-item">
				<citySelect v-model="searchKeys.cityId"></citySelect>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">性别：</span>
				<el-select class="uk-search-content w-sm"
				           v-model="searchKeys.sex"
				           placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option label="男" value="1"></el-option>
					<el-option label="女" value="2"></el-option>
					<el-option label="未知" value="3"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">会员：</span>
				<el-select class="uk-search-content w-sm"
									 v-model="searchKeys.isVip"
									 placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option label="会员" value="1"></el-option>
					<el-option label="非会员" value="0"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">客户状态：</span>
				<el-select class="uk-search-content w-sm"
				           v-model="searchKeys.status"
				           placeholder="请选择">
					<el-option label="全部"
					           value=""></el-option>
					<el-option label="正常"
					           value="1"></el-option>
					<el-option label="黑名单"
					           value="2"></el-option>
					<el-option label="销户"
					           value="3"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">客户分组：</span>
				<el-select class="uk-search-content w-sm"
				           clearable multiple collapse-tags
				           filterable
				           v-model="searchKeys.groupIds"
				           placeholder="请选择">
					<el-option v-for="item in groupList"
					           :key="item.id"
					           :label="item.name"
					           :value="item.id"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">会员卡等级：</span>
				<el-select class="uk-search-content w-sm"
				           clearable multiple collapse-tags
				           filterable
				           v-model="searchKeys.cardIds"
				           placeholder="请选择">
					<el-option v-for="item in cardLevel"
					           :key="item.id"
					           :label="item.name"
					           :value="item.id">
						{{item.name}}（{{item.discount | cardDiscount(item.discountType)}}）
					</el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="uk-search-label">标签：</span>
				<el-select class="uk-search-content w-sm"
									 clearable multiple collapse-tags
									 filterable
									 v-model="searchKeys.tagIds"
									 placeholder="请选择">
					<el-option v-for="item in tagList"
										 :key="item.id"
										 :label="item.name"
										 :value="item.id">
						{{item.name}}
					</el-option>
				</el-select>
			</li>

			<li class="uk-search-item">
				<span class="uk-search-label">实体会员卡：</span>
				<el-select class="uk-search-content w-sm"
				           clearable
				           v-model="searchKeys.isBinding"
				           placeholder="请选择">
					<el-option label="已绑定"
					           value="1"></el-option>
					<el-option label="未绑定"
					           value="0"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">创建日期：</span>
				<el-date-picker v-model="searchKeys.createTimeObj"
				                type="daterange"
				                align="right"
												start-placeholder="开始日期"
												end-placeholder="结束日期"
				                :picker-options="createTimeOptions">
				</el-date-picker>
			</li>
			<li class="uk-search-item prepend-css">
				<el-input placeholder="输入金额" v-model="searchKeys.balanceSta " value="number" class="icon-head">
					<template slot="prepend" >￥</template>
				</el-input>
				-
				<el-input placeholder="输入金额" v-model="searchKeys.balanceEnd " class="icon-head">
					<template slot="prepend">￥</template>
				</el-input>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">重要客户：</span>
				<el-select class="uk-search-content w-sm"
									 clearable multiple collapse-tags
									 filterable
									 v-model="searchKeys.gradeIds"
									 placeholder="请选择">
					<el-option v-for="item in grades"
										 :key="item.id"
										 :label="item.name"
										 :value="item.id"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">微信关注状态：</span>
				<el-select class="uk-search-content w-sm"
									 clearable
									 filterable
									 v-model="searchKeys.subscribe"
									 placeholder="请选择">
					<el-option label="已关注" value="1"></el-option>
					<el-option label="未关注" value="0"></el-option>
					<el-option label="已跑路" value="-1"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">验证手机状态：</span>
				<el-select class="uk-search-content w-sm"
									 clearable
									 filterable
									 v-model="searchKeys.verifyPhone"
									 placeholder="请选择">
					<el-option label="已验证" value="1"></el-option>
					<el-option label="未验证" value="0"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">绑定微信：</span>
				<el-select class="uk-search-content w-sm"
									 clearable
									 filterable
									 v-model="searchKeys.bindWx"
									 placeholder="请选择">
					<el-option label="已绑定" value="1"></el-option>
					<el-option label="未绑定" value="0"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">绑定小程序：</span>
				<el-select class="uk-search-content w-sm"
									 clearable
									 filterable
									 v-model="searchKeys.bindWxApp"
									 placeholder="请选择">
					<el-option label="已绑定" value="1"></el-option>
					<el-option label="未绑定" value="0"></el-option>
				</el-select>
			</li>
			<!--<li class="uk-search-item">-->
				<!--<span class="uk-search-label">账户：</span>-->
				<!--<el-select class="uk-search-content w"-->
									 <!--clearable multiple collapse-tags-->
									 <!--filterable-->
									 <!--v-model="searchKeys.signs"-->
									 <!--placeholder="请选择">-->
					<!--<el-option label="关注微信" value="1"></el-option>-->
					<!--<el-option label="微信" value="1"></el-option>-->
					<!--<el-option label="绑定微信" value="2"></el-option>-->
					<!--<el-option label="绑定小程序" value="3"></el-option>-->
					<!--<el-option label="已验证手机" value="4"></el-option>-->
					<!--<el-option label="未验证手机" value="5"></el-option>-->
				<!--</el-select>-->
			<!--</li>-->
			<li class="uk-search-item" v-if="mercApiList.length">
				<span class="uk-search-label">外部渠道：</span>
				<el-select class="uk-search-content w-sm"
									 clearable
									 filterable
									 v-model="searchKeys.mercApiId"
									 placeholder="请选择">
					<el-option v-for="item in mercApiList"
										 :key="item.id"
										 :label="item.name"
										 :value="item.id"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<el-button type="primary" @click="searchData">筛选</el-button>
				<auth perm="client.list.all.update">
					<router-link to="/client/list/add"><el-button type="success">新建客户</el-button></router-link>
				</auth>
			</li>
		</ul>
		<div class="m-t-xxl">
			<table class="or-table ukao-order-table w-full ukao-v-loading"
			       v-loading="loading">
				<thead>
					<tr>
						<th style="width:20px;">
							<el-checkbox v-model="checkAll"
							             @change="changeCheckAll"></el-checkbox>
						</th>
						<th style="width:50px;">头像</th>
						<th>客户</th>
						<th>创建时间</th>
						<th>消费次数</th>
						<th>所属门店</th>
						<th>等级</th>
						<th style="width: 200px;">客户标签</th>
						<th>余额 <!--| 优惠券--> | 优付卡（元）</th>
						<th>积分</th>
						<!--<th style="width: 120px;">操作</th>-->
					</tr>
				</thead>

				<tr class="tr-content"
				    v-if="!tableData.list || tableData.list.length == 0">
					<td colspan="11"
					    style="text-align: center">暂无数据</td>
				</tr>

				<tbody v-else>
					<template v-for="(item, index) in tableData.list">
						<tr>
							<td colspan="10"></td>
						</tr>
						<tr class="tr-th">
							<td colspan="2">
								<span v-if="item.info.subscribe == 1" class="icon-svg icon-svg-weixin"></span>
								<span v-if="item.info.wxId!=-1" class="icon-svg icon-svg-wx-bind"></span>
								<span v-if="item.info.subscribe==-1" class="icon-svg icon-svg-wx-run"></span>
								<span class="icon-svg icon-svg-mobile2" v-if="item.info.phone && item.info.verifyPhone != 1"></span>
								<span v-if="item.info.verifyPhone==1" class="icon-svg icon-svg-mobile1"></span>
								<span v-if="item.info.wxAppId != -1" class="icon-svg icon-svg-wxApp"></span>
							</td>
							<td colspan="4">
								<div class="text-xs">
									<span class="group-ico" v-show="item.unionInfo && item.unionInfo.id">团</span>
									<auth perm="client.list.all.union">
										<el-dropdown trigger="click"
															 class="text-primary"
															 @command="updateUnion">
											<span class="el-dropdown-link text-xs">
												{{item.unionInfo ? item.unionInfo.name : '无团体'}}
												<i class="el-icon-caret-bottom el-icon--right"></i>
											</span>
											<el-dropdown-menu slot="dropdown"
																				style="height: 300px;overflow: auto">
												<el-dropdown-item :command="JSON.stringify({index:index, union:{id:'', name:'无团体'}})">-无-</el-dropdown-item>
												<el-dropdown-item class="clearfix"
																					v-for="union in unionList"
																					:key="union.id"
																					:command="JSON.stringify({index:index, union:union})">
													{{union.name}}
												</el-dropdown-item>
											</el-dropdown-menu>
										</el-dropdown>
										<template slot="noPerm">{{item.unionInfo ? item.unionInfo.name : ''}}</template>

									</auth>
									<span class="el-badge__content m-l-sm"  v-if="item.card && item.card.isVip">会员</span>
								</div>
							</td>

							<td colspan="1">
								<div class="text-xs" v-if="item.friend">
									<span class="tx ts-icon ">友</span>
									<span class="text-base">
										<a :href="'/marketing/friend/detail/'+item.friend.id" class="text-primary text-xs" target="_blank">{{item.friend.name || ""}}</a>
									</span>
								</div>
							</td>
							<td style="text-align: right" colspan="3">
								<auth perm="client.list.all.recharge">
									<span v-if="workInfo.roleId !== 1">
										<a class="text-primary"
											 @click="cashRecharge(item,1)">余额充值</a><span style="padding: 0px 5px">-</span>
									</span>

									<span v-if="mercInfo && mercInfo.otherEnable && workInfo.roleId !== 1">
										<a class="text-primary"
											 @click="cashRecharge(item,2)">通洗卡充值</a><span style="padding: 0px 5px">-</span>
									</span>
								</auth>
								<!--<span style="margin: 0 5px"> </span>-->
								<auth perm="client.list.all.update">
									<el-dropdown trigger="click"
															 class="text-primary"
															 @command="updateGroup">
										<span class="el-dropdown-link text-xs">
											{{item.group.name}}
											<i class="el-icon-caret-bottom el-icon--right"></i>
										</span>
										<el-dropdown-menu slot="dropdown"
																			style="height: 300px;overflow: auto">
											<el-dropdown-item :command="JSON.stringify({index:index, group:{id:-1, name:'默认分组'}})" class="text-xs">默认分组</el-dropdown-item>
											<el-dropdown-item class="clearfix text-xs"
																				v-for="group in groupList"
																				:key="group.id"
																				:command="JSON.stringify({index:index, group:group})">
												{{group.name}}
												<el-badge class="mark"
																	:value="group.cnt"
																	:max="1000" />
											</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
									<span style="padding: 0px 5px">-</span>
								</auth>
								<span class="text-primary " @click="openGradeDialog(item)"><a>
									{{item.info.grade == 1 ? '蓝冠' :
									  item.info.grade == 2 ? '皇冠' :
										item.info.grade == 3 ? '紫冠'  : '加入重要客户'}}
								</a><i class="el-icon-caret-bottom el-icon--right"></i></span>
							</td>
						</tr>
						<tr class="tr-content">
							<td>
								<el-checkbox v-model="item.check"
								             @change="changeCheckList($event, item, index)"></el-checkbox>
							</td>
							<td>
								<img class="thumb"
								     :src="item.info.headimgPath || '/static/img/user/def.png'"
								     alt="">
							</td>
							<td>
								<div>
									<p>
										<img
											style="vertical-align: middle;width: 14px"
											:src="item.info.grade == 1 ? '/static/img/user/crown_blue.png' :
												 item.info.grade == 2 ? '/static/img/user/crown_yellow.png' :
												  item.info.grade == 3 ? '/static/img/user/crown_purple.png'  : ''"
											alt=""/>
										<router-link class="text-primary"
										             :to="'/client/list/'+item.info.id+'/basic'">
											{{item.info.name || ""}}</router-link>
									</p><p>
									<router-link class="text-primary"
									             :to="'/client/list/'+item.info.id+'/basic'">{{item.info.phone}}</router-link>
									</p>
									<p v-if="item.card">
										<router-link class="text-primary" :to="'/client/list/'+item.info.id+'/basic'">{{item.card.rfidNo || item.card.no}}</router-link>
									</p>
								</div>
							</td>
							<td>
								<div>
									<p>{{item.info.createTime | getDate}}</p>
									<p>{{item.info.createTime | getTime}}</p>
								</div>
							</td>
							<td>
								<div>{{item.ext.payCnt}}</div>
							</td>
							<td>
								<div v-if="item.storeList">
									<template v-for="(store,index) in item.storeList">
										<div :key="index">{{store ? store.name : ''}}</div>
									</template>
								</div>
							</td>
							<td>
								<div v-if="item.card && item.card.info">
									<p>{{item.card.info.name || ''}}
										<i class="isbind-card"
										   :class="{bind:item.card.isBinding}"></i>
									</p>
									<p class="text-muted">{{item.card.info.discount ? item.card.info.discount+"%":""}}</p>
								</div>
							</td>
							<td>
								<auth perm="client.list.all.update">
									<el-tag class="m-r-sm m-b-sm"
													size="medium"
													:key="index"
													type="primary"
													v-for="(tag,index) in item.tagList"
													:closable="true"
													:close-transition="false"
													@close="delTag(item, tag)">
										{{tag.userTag.name}}
									</el-tag>
									<el-input class="w-xxs"
														v-show="item.showTagInput"
														v-model="item.tagInputValue"
														:ref="item.tagInput"
														size="mini"
														@keyup.enter.native="addTagConfirm(item)"
														@blur="addTagConfirm(item)">
									</el-input>
									<el-button v-show="!item.showTagInput"
														 class="button-new-tag"
														 size="mini"
														 @click="showInput(item, index)">+标签</el-button>
									<template slot="noPerm">
										<el-tag class="m-r-sm m-b-sm"
														size="medium"
														:key="index"
														type="primary"
														v-for="(tag,index) in item.tagList"
														:close-transition="false">
											{{tag.userTag.name}}
										</el-tag>
									</template>
								</auth>
							</td>
							<td>
								<div title="余额">
									￥{{item.ext.balance | amtFormat}}
										<label v-if="mercInfo && mercInfo.otherEnable"> <span> / ￥{{item.ext.otherBalance | amtFormat}}</span> <span title="通洗卡" class="text-xs coupon-ico">通</span></label>
								</div>
								<!--<div title="优惠券">￥{{(item.couponAmount || 0) | amtFormat}}-->
									<!--<span class="text-xs coupon-ico">券</span>-->
								<!--</div>-->
								<div title="优付卡" v-if="item.uPayCard">
									￥{{(item.uPayCard.balance || 0) | amtFormat}}
									<span class="text-xs coupon-ico">卡</span>
								</div>
							</td>
							<td>
								<div>{{item.ext.point}}</div>
							</td>

						</tr>
					</template>
				</tbody>
			</table>
			<div class="m-t-sm clearfix">
				<span><el-checkbox v-model="checkAll"
													 @change="changeCheckAll">当前页全选</el-checkbox></span>
				<auth perm="marketing.coupon.distribute">
					<span class="batch-css" v-show="tableData.pagination.total">
						<el-dropdown trigger="click"
												 class=" "
												 @command="sendCoupon"
												 >
							<span class="el-dropdown-link" style="font-size: 12px">
								给优惠券
								<i class="el-icon-caret-bottom el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="1">给选中的人发券</el-dropdown-item>
								<el-dropdown-item command="2">给筛选的{{tableData.pagination.total}}人发券</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</span>

				</auth>

				<auth perm="marketing.coupon.distribute">
					<span  class="batch-css"  v-show="tableData.pagination.total">
						<el-dropdown trigger="click"
												 class=""
												 @command="batchSaveUnion">
											<span class="el-dropdown-link text-xs">
												加入团体
												<i class="el-icon-caret-bottom el-icon--right"></i>
											</span>
											<el-dropdown-menu slot="dropdown"
																				style="height: 300px;overflow: auto">
												<el-dropdown-item :command="{id:'', name:'无团体'}">-无-</el-dropdown-item>
												<el-dropdown-item class="clearfix"
																					v-for="union in unionList"
																					:key="union.id"
																					:command="union">
													{{union.name}}
												</el-dropdown-item>
											</el-dropdown-menu>
										</el-dropdown>
					</span>
				</auth>

				<auth perm="marketing.coupon.distribute">
					<span  class="batch-css" v-show="tableData.pagination.total" @click="openGradeDialog">
						<!--<el-dropdown trigger="click"-->
												 <!--class=""-->
												 <!--@command="sendCoupon"-->
												 <!--&gt;-->
							<span class="el-dropdown-link" style="font-size: 12px" >
								加入重要客户
								<i class="el-icon-caret-bottom el-icon--right"></i>
							</span>
							<!--<el-dropdown-menu slot="dropdown">-->
								<!--<el-dropdown-item command="1">给选中的人加入重要客户</el-dropdown-item>-->
								<!--<el-dropdown-item command="2">给筛选的{{tableData.pagination.total}}加入重要客户</el-dropdown-item>-->
							<!--</el-dropdown-menu>-->
						<!--</el-dropdown>-->

					</span>

				</auth>


				<el-dropdown trigger="click"
				             class="text-primary"
				             @command="sendMsg"
				             style="display: none">
					<span class="el-dropdown-link">
						发短信
						<i class="el-icon-caret-bottom el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="1">给选中的人发短信</el-dropdown-item>
						<el-dropdown-item command="2">给筛选的{{tableData.pagination.total}}人发短信</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-button size="small"
				           v-if="exportUser"
				           @click="exportXls">导出</el-button>
				<el-pagination class="pull-right"
				               :page-size="tableData.pagination.size"
				               layout="total, prev, pager, next"
				               :total="tableData.pagination.total"
				               :current-page.sync="tableData.pagination.page"
				               @current-change="updateUrl">
				</el-pagination>
			</div>
		</div>
		<!-- 充值弹窗 -->
		<el-dialog class="ukao-dialog"
		           :title="rechargeUser.title"
		           size="small"
		           :visible.sync="showRecharge">
			<recharge :name="rechargeUser.name"
			          :phone="rechargeUser.phone"
			          :id="rechargeUser.id"
			          :type="rechargeUser.type"
			          @cancel="showRecharge = false"
			          @success="cashRechargeSuccess"></recharge>
		</el-dialog>

		<el-dialog class="ukao-dialog"
							 title="加入重要客户"
							 size="small"
							 :visible.sync="showGrade">
			<div style="margin-left: 75px;">
				<div class="text-danger">注：重要客户分为三个等级：其中蓝冠等级最低，紫冠等级最高</div>
				<div style="margin-top: 20px">
					<el-form :model="gradeForm"  ref="ruleForm" label-width="60px">

						<el-form-item label="重要客户等级" prop="grade" >
							<div style="padding-top: 12px;box-sizing: border-box">
								<el-radio-group v-model="gradeForm.grade">
									<div class="">
										<el-radio label="-1" style="width: 150px">不是重要客户</el-radio>
										<el-radio label="1"><img style="vertical-align: bottom;margin-right: 1px" src="/static/img/user/crown_blue.png"/>蓝冠</el-radio>
									</div>
									<div class="" style="margin-top: 30px">
										<el-radio label="2"  style="width: 150px"><img style="vertical-align: bottom;margin-right: 1px" src="/static/img/user/crown_yellow.png"/>皇冠</el-radio>
										<el-radio label="3"><img style="vertical-align: bottom;margin-right: 1px" src="/static/img/user/crown_purple.png"/>紫冠</el-radio>
									</div>

								</el-radio-group>
							</div>

						</el-form-item>
						<div style="margin-left: 60px;margin-top: 50px">
							<el-button @click="showGrade=false">取消</el-button>
							<el-button type="primary"
												 @click="updateGrade">保存</el-button>
						</div>


					</el-form>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import msg from "@/utils/msg";
import auth from "@/utils/auth";
import consts from "@/utils/consts";
import base from "@/utils/helpers/base";
import time from "@/utils/helpers/timeLite";
import recharge from "@/components/Recharge/index";
import citySelect from "@/components/DropDownList/city";
import storeSelect from "@/components/DropDownList/stores";
import validate from "@/utils/helpers/validate";
import calculation from "@/utils/helpers/calculation";
import { mapState } from "vuex";
export default {
  data: function() {
    return {
      mercInfo: auth.getMercInfo(),
      showRecharge: false, //显示充值框
			showGrade:false,
      exportUser: false,
      gradeForm:{
        id:'',
        grade:'-1',
        userIds:[]
			},
      rechargeUser: {
				title:"充值",
        name: "",
        phone: null,
        id: null,
				type:1
      }, //待充值客户信息
      tableData: {
        list: [],
        pagination: {
          size: consts.PAGE_SIZE,
          total: 0,
          page: 1
        }
      },
      checkList: [],
      unionList: [],
      groupList: [],
      mercApiList: [],
      cardLevel: [],
      tagList:[],
      loading: true,
      searchKeys: {
        type: "",
        isVip: "",
        subscribe:'',
        verifyPhone:'',
        bindWx:'',
        bindWxApp:'',
        value: "",
        signs: [],
        storeIds: [],
        cityId: "",
        groupIds: [],
        cardIds: [],
        tagIds:[],
        isBinding: "",
        sex: "",
        status: "",
        createTimeObj: [],
        balanceSta: '',
        balanceEnd: '',
        gradeIds:[],
        mercApiId:''
      },
      grades:[
				{
          id: '1',
					name:'蓝冠'
				},{
          id: '2',
        	name:'皇冠'
				},{
          id: '3',
        	name:'紫冠'
				}
			],
      createTimeOptions: {
        shortcuts: [
          {
            text: "近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      checkAll: false
    };
  },
  watch: {
    $route() {
      this.initParams();
      this.list();
    }
  },
  created() {
    this.initParams();
    this.list();
    this.queryUnionList();
    this.queryGroupList();
    this.queryMercApiList();
    this.queryCardLevel();
    this.queryTagList();
    this.queryMercParam();
  },
  methods: {
    // 初始化参数
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.tableData.pagination.page = parseInt(data.page || 1);
        this.searchKeys.type = data.searchType || "";
        this.searchKeys.isVip = data.isVip || "";
        this.searchKeys.subscribe = data.subscribe || "";
        this.searchKeys.verifyPhone = data.verifyPhone || "";
        this.searchKeys.bindWx = data.bindWx || "";
        this.searchKeys.bindWxApp = data.bindWxApp || "";
        this.searchKeys.value = data.searchValue || "";
        this.searchKeys.storeIds = base.formatArr(data.storeIds,this.searchKeys.storeIds) || [];
        this.searchKeys.gradeIds = base.formatArr(data.gradeIds,this.searchKeys.gradeIds) || [];
        this.searchKeys.cityId = parseInt(data.cityId) || "";
        this.searchKeys.sex = data.sex || "";
        this.searchKeys.status = data.status || "";
        this.searchKeys.isBinding = data.isBinding || "";
        this.searchKeys.groupIds = base.formatArr(data.groupIds, this.searchKeys.groupIds) || [];
        this.searchKeys.mercApiId = parseInt(data.mercApiId) || "";
        this.searchKeys.cardIds = base.formatArr(data.cardIds, this.searchKeys.cardIds) || [];
        this.searchKeys.tagIds = base.formatArr(data.tagIds, this.searchKeys.tagIds) || [];
        this.searchKeys.createTimeObj = [
          data.startCreateTime,
          data.endCreateTime
        ];
        this.searchKeys.balanceEnd = data.balanceEnd || "";
        this.searchKeys.balanceSta = data.balanceSta || "";
      }
    },
    // 更新url
    updateUrl() {

      if (!this.searchKeys.createTimeObj) this.searchKeys.createTimeObj = [];

      this.$router.push({
        path: this.$route.path,
        query: {
          page: this.tableData.pagination.page,
          searchType: this.searchKeys.type,
          searchValue: this.searchKeys.value,
          isVip: this.searchKeys.isVip,
          subscribe: this.searchKeys.subscribe,
          verifyPhone: this.searchKeys.verifyPhone,
          bindWx: this.searchKeys.bindWx,
          bindWxApp: this.searchKeys.bindWxApp,
          storeIds: this.searchKeys.storeIds,
          cityId: this.searchKeys.cityId,
          sex: this.searchKeys.sex,
          status: this.searchKeys.status,
          groupIds: this.searchKeys.groupIds,
          mercApiId: this.searchKeys.mercApiId,
          cardIds: this.searchKeys.cardIds,
          tagIds: this.searchKeys.tagIds,
          isBinding: this.searchKeys.isBinding,
          startCreateTime: time.getDate(this.searchKeys.createTimeObj[0]),
          endCreateTime: time.getDate(this.searchKeys.createTimeObj[1]),
          balanceSta: this.searchKeys.balanceSta,
          balanceEnd: this.searchKeys.balanceEnd,
					gradeIds: this.searchKeys.gradeIds
        }
      });

    },
    searchData() {
      if(this.searchKeys.balanceSta && this.searchKeys.balanceEnd){
        if(!validate.number(this.searchKeys.balanceSta) || !validate.number(this.searchKeys.balanceEnd)){
          msg.error("客户余额必须为数字");
          return
				}

        this.searchKeys.balanceSta = this.$options.filters.amtFormat(calculation.accMul(this.searchKeys.balanceSta,100))
        this.searchKeys.balanceEnd = this.$options.filters.amtFormat(calculation.accMul(this.searchKeys.balanceEnd,100))
			}else{
        if((this.searchKeys.balanceSta && !this.searchKeys.balanceEnd) || (!this.searchKeys.balanceSta && this.searchKeys.balanceEnd)){
          msg.error("客户余额必须为区间");
          return
				}
			}

      this.tableData.pagination.page > 1
        ? (this.tableData.pagination.page = 1)
        : this.updateUrl();
    },
    list() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "userInfo/list",
          data: {
            startRow:
              (this.tableData.pagination.page - 1) *
              this.tableData.pagination.size,
            pageSize: this.tableData.pagination.size,
            searchType: this.searchKeys.type,
            searchValue: this.searchKeys.value,
            storeId: this.searchKeys.storeIds.length <= 1 ? this.searchKeys.storeIds : '',
            storeIds: this.searchKeys.storeIds.length > 1 ? this.searchKeys.storeIds : '',
            cityId: this.searchKeys.cityId,
            isVip: this.searchKeys.isVip,
            subscribe: this.searchKeys.subscribe,
            verifyPhone: this.searchKeys.verifyPhone,
            bindWx: this.searchKeys.bindWx,
            bindWxApp: this.searchKeys.bindWxApp,
            sex: this.searchKeys.sex,
            status: this.searchKeys.status,
            groupId: this.searchKeys.groupIds.length <= 1 ? this.searchKeys.groupIds : '',
            groupIds: this.searchKeys.groupIds.length > 1 ? this.searchKeys.groupIds : '',
            cardId: this.searchKeys.cardIds.length <= 1 ? this.searchKeys.cardIds : '',
            cardIds: this.searchKeys.cardIds.length > 1 ? this.searchKeys.cardIds : '',
            mercApiId: this.searchKeys.mercApiId,
            tagId: this.searchKeys.tagIds.length <= 1 ? this.searchKeys.tagIds : '',
            tagIds: this.searchKeys.tagIds.length > 1 ? this.searchKeys.tagIds : '',
            isBinding: this.searchKeys.isBinding,
            startCreateTime: time.getDate(this.searchKeys.createTimeObj[0]),
            endCreateTime: time.getDate(this.searchKeys.createTimeObj[1]),
            balanceSta: this.searchKeys.balanceSta ? calculation.accMul(this.searchKeys.balanceSta,100) : '',
            balanceEnd: this.searchKeys.balanceEnd ? calculation.accMul(this.searchKeys.balanceEnd,100) : '',
            grade: this.searchKeys.gradeIds.length <= 1 ? this.searchKeys.gradeIds : '',
            grades: this.searchKeys.gradeIds.length > 1 ? this.searchKeys.gradeIds : ''
          }
        })
        .then(res => {
          let list = res.data.data.list || [];
          this.clearCheck(list);
          this.tableData.list = list;
          this.tableData.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
    },
    clearCheck(list){
      for(let item in list){
        list[item].check = false;
			}
      this.checkAll=false;
		},
    queryCardLevel() {
      this.$store
        .dispatch("get", {
          uri: "userCard/listForSelect"
        })
        .then(res => {
          this.cardLevel = res.data.data.list || [];
        });
    },
    queryTagList(){
      this.$store
        .dispatch("get", {
          uri: "userTag/list"
        })
        .then(res => {
          this.tagList = res.data.data.list || [];
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
    queryGroupList() {
      this.$store
        .dispatch("post", {
          uri: "userGroup/list"
        })
        .then(res => {
          this.groupList = res.data.data.list || [];
        });
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
    delTag(item, tag) {
      item.tagList.splice(item.tagList.indexOf(tag), 1);
      this.$store.dispatch("post", {
        uri: "userTagRel/delete",
        data: {
          id: tag.relId
        }
      });
    },
    showInput(item, index) {
      this.$set(item, "showTagInput", true);
      this.$set(item, "tagInputValue", "");
      this.$set(item, "tagInput", "tagInput" + index);
      this.$nextTick(_ => {
        this.$refs["tagInput" + index][0].$refs.input.focus();
      });
    },
    addTagConfirm(item) {
      let name = item.tagInputValue;
      let tag = null;
      if (name) {
        if (!item.tagList) {
          this.$set(item, "tagList", []);
        }
        tag = { userTag: { name } };

        let addSign = true;
        item.tagList.forEach(function(item) {
          if (item.userTag.name == name) {
            addSign = false;
            return false;
          }
        });

        if (addSign) {
          item.tagList.push(tag);
          this.$store
            .dispatch("post", {
              uri: "userTagRel/add",
              data: {
                userId: item.info.id,
                tagName: name
              }
            })
            .then(res => {
              tag.relId = res.data.data;
            });
        }
      }
      item.showTagInput = false;
      item.tagInputValue = "";
    },
    updateUnion(command) {
      command = JSON.parse(command);
      let item = this.tableData.list[command.index];

      if (item.unionInfo && item.unionInfo.id == command.union.id) {
        return;
      }
      if (!item.unionInfo) {
        this.$set(item, "unionInfo", {});
			}
      item.unionInfo = command.union;

      if (command.union.id) {
        this.$store.dispatch("post", {
          uri: "unionUserRel/save",
          data: {
            userId: item.info.id,
            unionId: command.union.id
          }
        });
			} else {
        this.$store.dispatch("post", {
          uri: "unionUserRel/deleteByUserId",
          data: {
            userId: item.info.id
          }
        });
			}

    },
    batchSaveUnion(command){
      let userIds = [];
      for(let i in this.checkList){
        let item = this.tableData.list[i];
        if(this.checkList[i]){
          if(!item.unionInfo ||  item.unionInfo.id != command.id){
            userIds.push(this.tableData.list[i].info.id);
          }
        }
      }
      if(userIds.length){
				if(command.id){
					this.$store.dispatch("post", {
						uri: "unionUserRel/batchSave",
						data: {
							userIds: userIds.join(","),
							unionId: command.id
						}
					});
				}else{
					this.$store.dispatch("post", {
						uri: "unionUserRel/batchDelete",
						data: {
							userIds: userIds.join(","),
						}
					});
				}
        this.list();
      }

		},
    updateGroup(command) {
      command = JSON.parse(command);
      let item = this.tableData.list[command.index];

      if (item.group.id == command.group.id) {
        return;
      }

      item.group = command.group;

      this.$store.dispatch("post", {
        uri: "userGroupRel/add",
        data: {
          userId: item.info.id,
          groupId: command.group.id
        }
      });
    },
    changeCheckList(checked, item, index) {
      this.$set(item, "check", checked);

      this.checkList[index] = checked;
      let dataList = this.tableData.list;
      let checkAll = true;
      for (let i = 0; i < dataList.length; i++) {
        if (!this.checkList[i]) {
          checkAll = false;
          break;
        }
      }
      this.checkAll = checkAll;
    },
    changeCheckAll(checked) {
      let cList = this.checkList;
      let dataList = this.tableData.list;
      for (let i = 0; i < dataList.length; i++) {
        let item = dataList[i];
        cList[i] = checked;
        this.$set(item, "check", checked);
      }
    },
    sendCoupon(command) {
      let query = {
        _disType: command
      };
      let cnt = 0;
      if (command == 1) {
        let cList = this.checkList;
        let dataList = this.tableData.list;
        let ids = "";
        for (let i = 0; i < cList.length; i++) {
          if (cList[i]) {
            ids += dataList[i].info.id + ",";
            cnt++;
          }
        }
        query._ids = ids;
      } else {
        query.searchType = this.searchKeys.type;
        query.searchValue = this.searchKeys.value;
        query.storeId = this.searchKeys.storeIds.length == 1 ? this.searchKeys.storeIds : '';
				query.storeIds = this.searchKeys.storeIds.length > 1 ? this.searchKeys.storeIds : '';
        query.cityId = this.searchKeys.cityId;
        query.sex = this.searchKeys.sex;
        query.isVip = this.searchKeys.isVip;
        query.subscribe = this.searchKeys.subscribe;
        query.verifyPhone = this.searchKeys.verifyPhone;
        query.bindWx = this.searchKeys.bindWx;
        query.bindWxApp = this.searchKeys.bindWxApp;
        query.status = this.searchKeys.status;
        query.groupId = this.searchKeys.groupIds.length == 1 ? this.searchKeys.groupIds : '';
        query.groupIds = this.searchKeys.groupIds.length > 1 ? this.searchKeys.groupIds : '';
        query.cardId = this.searchKeys.cardIds.length == 1 ? this.searchKeys.cardIds : '';
        query.cardIds = this.searchKeys.cardIds.length > 1 ? this.searchKeys.cardIds : '';
        query.tagId = this.searchKeys.tagIds.length == 1 ? this.searchKeys.tagIds : '';
        query.tagIds = this.searchKeys.tagIds.length > 1 ? this.searchKeys.tagIds : '';
        query.mercApiId = this.searchKeys.mercApiId;
        query.isBinding = this.searchKeys.isBinding;
        query.startCreateTime = time.getDate(this.searchKeys.createTimeObj[0]);
        query.endCreateTime = time.getDate(this.searchKeys.createTimeObj[1]);
        query.balanceSta = this.searchKeys.balanceSta;
        query.balanceEnd = this.searchKeys.balanceEnd;
        query.grade = this.searchKeys.gradeIds.length == 1 ? this.searchKeys.gradeIds : '';
        query.grades = this.searchKeys.gradeIds.length > 1 ? this.searchKeys.gradeIds : '';
        cnt = this.tableData.pagination.total;
      }
      if (cnt <= 0) {
        msg.error("请选择用户");
        return;
      }

      this.$router.push({
        path: "/marketing/coupon/distribute",
        query: { _cnt: cnt, ...query }
      });
    },
    queryMercParam() {
      this.$store
        .dispatch("post", {
          uri: "mercParam/detail"
        })
        .then(res => {
          let mercParam = res.data.data;
          if (mercParam.exportUser == 1) {
            this.exportUser = true;
          }
        });
    },
    exportXls() {
      var params = "searchType=" + (this.searchKeys.type || "");
      params += "&searchValue=" + (this.searchKeys.value || "");
      params += this.searchKeys.storeIds.length > 1 ? "&storeIds=" + (this.searchKeys.storeIds || "") : "&storeId=" + (this.searchKeys.storeIds || "");
      params += "&cityId=" + (this.searchKeys.cityId || "");
      params += "&sex=" + (this.searchKeys.sex || "");
      params += "&isVip=" + (this.searchKeys.isVip || "");
      params += "&subscribe=" + (this.searchKeys.subscribe || "");
      params += "&verifyPhone=" + (this.searchKeys.verifyPhone || "");
      params += "&bindWx=" + (this.searchKeys.bindWx || "");
      params += "&bindWxApp=" + (this.searchKeys.bindWxApp || "");
      params += "&status=" + (this.searchKeys.status || "");
      params += "&isBinding=" + (this.searchKeys.isBinding || '');
      params += this.searchKeys.groupIds.length > 1 ? "&groupIds=" + (this.searchKeys.groupIds || "") : "&groupId=" + (this.searchKeys.groupIds || "");
      params += this.searchKeys.cardIds.length > 1 ? "&cardIds=" + (this.searchKeys.cardIds || "") : "&cardId=" + (this.searchKeys.cardIds || "");
      params += this.searchKeys.tagIds.length > 1 ? "&tagIds=" + (this.searchKeys.tagIds || "") : "&tagId=" + (this.searchKeys.tagIds || "");
      params += "&mercApiId=" + (this.searchKeys.mercApiId || '');
      params += "&balanceSta="+ (this.searchKeys.balanceSta ? calculation.accMul(this.searchKeys.balanceSta,100) : '');
      params += "&balanceEnd="+ (this.searchKeys.balanceEnd ? calculation.accMul(this.searchKeys.balanceEnd,100) : '');
      params += this.searchKeys.gradeIds.length > 1 ? "&grades=" + (this.searchKeys.gradeIds || "") : "&grade=" + (this.searchKeys.gradeIds || "");
      params += "&startCreateTime=" + time.getDate(this.searchKeys.createTimeObj[0]);
      params += "&endCreateTime=" + time.getDate(this.searchKeys.createTimeObj[1]);
      window.open(consts.BASE_URL + "/export/userInfo/list?" + params);
    },
    sendMsg(command) {},
    cashRecharge(item, type) {
      //充值金额
      this.rechargeUser = item.info; //获取客户相关信息
			this.rechargeUser.type = type; //
      this.showRecharge = true; //打开弹窗
			this.rechargeUser.title = type == 1  ? "余额充值" : "通洗卡充值"
    },
    cashRechargeSuccess() {
      // 充值金额成功
      this.list(); //刷新列表
      this.showRecharge = false; //关闭弹窗
    },
    openGradeDialog(item){
      if(item.info){
        this.gradeForm.grade = item.info.grade ? item.info.grade.toString() : '-1';
        this.gradeForm.id = item.info.id;
			}
			this.showGrade = true;
		},
		updateGrade(){
      if(!this.gradeForm.id){
        let userIds = [];
        for(let i in this.checkList){
          let item = this.tableData.list[i];
          if(this.checkList[i]){
            if(item.info.grade != this.gradeForm.grade){
              userIds.push(this.tableData.list[i].info.id);
						}
          }
        }
        this.gradeForm.userIds = userIds;
			}
      this.$store
        .dispatch("post", {
          uri:this.gradeForm.id ? "userInfo/update" : "userInfo/updateBatch",
          data: {
            id: this.gradeForm.id,
            grade: this.gradeForm.grade,
						userIds: this.gradeForm.userIds.length ?  this.gradeForm.userIds.join(",") : ''
          }
        })
        .then(res => {
          this.list(); //刷新列表
					this.showGrade = false;
					this.gradeForm.id='';
					this.gradeForm.grade = '-1';
        });
		}
  },
  computed: {
    ...mapState(["workInfo"])
  },
  components: {
    recharge,
    citySelect,
    storeSelect
  }
};
</script>

<style lang="less" >
	.all-css {

	.or-table .tr-content td:first-child,
	.or-table .tr-content td:nth-child(2),
	.or-table .tr-content td:last-child {
		border-right: 0;
	}

	.isbind-card {
		width: 16px;
		height: 12px;
		display: inline-block;
		background: url("/static/img/user/isbinding.png") 0 0 /cover no-repeat;

	&
	.bind {
		background-position: left bottom;
	}

	}
	.batch-css {
		cursor: pointer;
		border: 1px solid #dcdfe6;
		color: #606266;
		border-radius: 4px;
		padding: 7px;
	}

	.friend-ico {
		color: #fff;
		background: #00A4C3;
		border-radius: 100%;
		padding: 3px;
	}

	.coupon-ico {
		border-radius: 100%;
		color: #F5A623;
		padding: 2px;
		border: 1px solid #F5A623;
		font-size: 12px;
		margin-left: 2px;
		text-align: center
	}

	.group-ico {
		color: #fff;
		background: #9a74f4;
		border-radius: 100%;
		padding: 2px;
		font-size: 12px;
	}

	.prepend-css .el-input-group__prepend {
		padding: 0 6px !important;
	}

	.icon-head {
		width: 120px;
	}

	}

</style>