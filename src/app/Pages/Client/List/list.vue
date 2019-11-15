<template>
	<div class="ukao-pt-md">
		<ul class="uk-search">
			<li class="uk-search-item">
				<el-select class="uk-search-label w-xs" v-model="searchKeys.type" placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option label="手机号" value="1"></el-option>
					<el-option label="卡号" value="2"></el-option>
					<el-option label="姓名" value="3"></el-option>
				</el-select>
				<el-input class="uk-search-content w-sm" v-model="searchKeys.value" placeholder="请输入内容"></el-input>
			</li>
			<li class="uk-search-item">
				<storeSelect v-model="searchKeys.storeId"></storeSelect>
			</li>
			<li class="uk-search-item">
				<citySelect v-model="searchKeys.cityId"></citySelect>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">性别：</span>
				<el-select class="uk-search-content w-sm" v-model="searchKeys.sex" placeholder="请选择">
					<el-option label="全部" value=""></el-option>
					<el-option label="男" value="1"></el-option>
					<el-option label="女" value="2"></el-option>
					<el-option label="未知" value="3"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">客户状态：</span>
				<el-select class="uk-search-content w-sm" v-model="searchKeys.status" placeholder="请选择">
					<el-option label="全部" value="" style="font-size:12px;"></el-option>
					<el-option label="正常" value="1"></el-option>
					<el-option label="黑名单" value="2"></el-option>
					<el-option label="销户" value="3"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">客户分组：</span>
				<el-select class="uk-search-content w" clearable filterable v-model="searchKeys.groupId" placeholder="请选择">
					<el-option label="默认" :value="-1"></el-option>
					<el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">会员卡等级：</span>
				<el-select class="uk-search-content w" clearable filterable v-model="searchKeys.cardId" placeholder="请选择">
					<el-option v-for="item in cardLevel" :key="item.id" :label="item.name" :value="item.id" :disabled="item.status != 1">
            {{item.name}}（{{item.discount | cardDiscount(item.discountType)}}）
					</el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">实体会员卡：</span>
				<el-select class="uk-search-content w-sm" clearable v-model="searchKeys.isBinding" placeholder="请选择">
					<el-option label="已绑定" value="1"></el-option>
					<el-option label="未绑定" value="0"></el-option>
				</el-select>
			</li>
			<li class="uk-search-item">
				<span class="uk-search-label">创建时间：</span>
				<el-date-picker
					v-model="searchKeys.createTimeObj" type="daterange"
					align="right" placeholder="选择日期范围"
					:picker-options="createTimeOptions">
				</el-date-picker>
			</li>
			<li class="uk-search-item">
				<el-button type="primary" @click="searchData">筛选</el-button>
			</li>
		</ul>
		<div class="m-t-xxl">
			<table class="or-table ukao-order-table w-full ukao-v-loading" v-loading="loading">
				<thead>
					<tr>
						<th style="width:20px;">
							<el-checkbox v-model="checkAll" @change="changeCheckAll"></el-checkbox>
						</th>
						<th style="width:50px;">头像</th>
						<th>客户</th>
						<th>创建时间</th>
						<th>所属门店</th>
						<th>等级</th>
						<th>余额（元）</th>
						<th style="width: 120px;">操作</th>
					</tr>
				</thead>

				<tr class="tr-content" v-if="!tableData.list || tableData.list.length == 0">
					<td colspan="8" style="text-align: center">暂无数据</td>
				</tr>

				<tbody v-else>
					<template v-for="(item, index) in tableData.list">
					<tr >
						<td colspan="8"></td>
					</tr>
					<tr class="tr-th" >
						<td colspan="7">
							<span v-if="item.wxId!=-1" class="icon-svg icon-svg-weixin"></span>
							<span v-if="item.verifyPhone==1" class="icon-svg icon-svg-mobile1"></span>
							<span v-if="item.subscribe==3" class="text-danger">微信已跑路</span>
						</td>
						<td>
							<el-button size="small" v-if="workInfo.roleId !== 1" @click="cashRecharge(item)">充值</el-button>
						</td>
					</tr>
					<tr class="tr-content" >
						<td><el-checkbox v-model="item.check" @change="changeCheckList($event, item, index)"></el-checkbox></td>
						<td>
							<img class="thumb" :src="item.headimgPath || '/static/img/user/def.png'" alt="">
						</td>
						<td>
							<div>
								<p><router-link  class="text-primary" :to="'/client/list/'+item.id+'/basic'">{{item.name}}</router-link></p>
								<router-link  class="text-primary" :to="'/client/list/'+item.id+'/basic'">{{item.phone}}</router-link>
							</div>
						</td>
						<td>
							<div>
								<p>{{item.createTime | getDate}}</p>
								<p>{{item.createTime | getTime}}</p>
							</div>
						</td>
						<td>
							<!--<div v-if="item.storeList">-->
								<!--<template v-for="(store,index) in item.storeList">-->
									<!--<div :key="index">{{store ? store.name : ''}}</div>-->
								<!--</template>-->
							<!--</div>-->
							{{item.storeNames }}
						</td>
						<td>
							<p>{{item.cardName || ''}} <i class="isbind-card" :class="{bind:item.isBinding}"></i> </p>
							<p class="text-muted">{{item.cardDiscount ? item.cardDiscount+"%":""}}</p>
						</td>
						<td>
							<div>￥{{item.balance | amtFormat}}</div>
						</td>
						<td>
							<div>
								<el-dropdown trigger="click" class="text-primary" @command="updateGroup">
								  <span class="el-dropdown-link">
									{{item.groupName|| '默认分组'}}<i class="el-icon-caret-bottom el-icon--right"></i>
								  </span>
								  <el-dropdown-menu slot="dropdown" style="height: 300px;overflow: auto">
										<el-dropdown-item :command="JSON.stringify({index:index, group:{id:-1, name:'默认分组'}})">默认分组</el-dropdown-item>
										<el-dropdown-item class="clearfix" v-for="group in groupList" :key="group.id" :command="JSON.stringify({index:index, group:group})">
											{{group.name}}
											 <el-badge class="mark" :value="group.cnt" :max="1000" />
										</el-dropdown-item>
								  </el-dropdown-menu>
						    	</el-dropdown>
							</div>
						</td>
					</tr>
					</template>
				</tbody>
			</table>
			<div class="m-t-sm clearfix">
				<el-dropdown trigger="click" class="text-primary m-r" @command="sendCoupon" v-show="tableData.pagination.total">
		      <span class="el-dropdown-link">
		        给优惠券<i class="el-icon-caret-bottom el-icon--right"></i>
		      </span>
		      <el-dropdown-menu slot="dropdown">
		        <el-dropdown-item command="1">给选中的人发券</el-dropdown-item>
		        <el-dropdown-item command="2">给筛选的{{tableData.pagination.total}}人发券</el-dropdown-item>
		      </el-dropdown-menu>
		    </el-dropdown>
		    <el-dropdown trigger="click" class="text-primary" @command="sendMsg" style="display: none">
		      <span class="el-dropdown-link">
		        发短信<i class="el-icon-caret-bottom el-icon--right"></i>
		      </span>
		      <el-dropdown-menu slot="dropdown">
		        <el-dropdown-item command="1">给选中的人发短信</el-dropdown-item>
		        <el-dropdown-item command="2">给筛选的{{tableData.pagination.total}}人发短信</el-dropdown-item>
		      </el-dropdown-menu>
		    </el-dropdown>
				<el-button size="small" v-if="exportUser" @click="exportXls">导出</el-button>
		    <el-pagination class="pull-right"
		      :page-size="tableData.pagination.size"
		      layout="total, prev, pager, next"
		      :total="tableData.pagination.total"
					:current-page.sync = "tableData.pagination.page"
					@current-change="updateUrl" >
		    </el-pagination>
			</div>
		</div>
		<!-- 充值弹窗 -->
		<el-dialog class="ukao-dialog" title="充值" size="small" :visible.sync="showRecharge">
			<recharge :name="rechargeUser.name" :phone="rechargeUser.phone" :id="rechargeUser.id" @cancel="showRecharge = false" @success="cashRechargeSuccess"></recharge>
		</el-dialog>
	</div>
</template>

<script>
  import msg from '@/utils/msg'
  import consts from '@/utils/consts'
  import base from '@/utils/helpers/base'
  import time from '@/utils/helpers/timeLite'
	import recharge from '@/components/Recharge/index'
	import citySelect from '@/components/DropDownList/city'
	import storeSelect from '@/components/DropDownList/store'
	import {mapState} from 'vuex'
	export default {
		data: function() {
			return {
				showRecharge:false, //显示充值框
        exportUser: false,
				rechargeUser:{
					name:null,
					phone:null,
					id:null,
				}, //待充值客户信息
				tableData: {
					list: [],
					pagination: {
						size: consts.PAGE_SIZE,
						total: 0,
						page:1,
					}
				},
				checkList:[],
				groupList:[],
				cardLevel:[],
				loading: true,
				searchKeys: {
					type:'',
					value:'',
					storeId:'',
					cityId:'',
					groupId: '',
					cardId: "",
					isBinding: "",
					sex:'',
					status:'',
					createTimeObj:[]
				},
				createTimeOptions: {
					shortcuts: [{
						text: '近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				checkAll: false
			}
		},
		watch: {
			'$route'(){
				this.initParams();
				this.list();
			}
		},
		created () {
			this.initParams();
			this.list();
			this.queryGroupList();
			this.queryCardLevel();
			this.queryMercParam();
		},
		methods: {
			// 初始化参数
			initParams(){
				let data = this.$route.query;
				if(JSON.stringify(data) !== '{}'){
					this.tableData.pagination.page =  parseInt(data.page || 1);
					this.searchKeys.type = data.searchType || '';
					this.searchKeys.value = data.searchValue || '';
					this.searchKeys.storeId = parseInt(data.storeId) || '';
					this.searchKeys.cityId = parseInt(data.cityId) || '';
					this.searchKeys.sex = data.sex || '';
					this.searchKeys.status = data.status || '';
					this.searchKeys.isBinding = data.isBinding || '';
					this.searchKeys.groupId = parseInt(data.groupId) || '';
					this.searchKeys.cardId = parseInt(data.cardId) || '';
					this.searchKeys.createTimeObj = [data.startCreateTime,data.endCreateTime];
				}
			},
			// 更新url
			updateUrl(){
				if(!this.searchKeys.createTimeObj) this.searchKeys.createTimeObj = [];
				this.$router.push({
					path: this.$route.path,
					query:{
						page: this.tableData.pagination.page,
						searchType: this.searchKeys.type,
						searchValue: this.searchKeys.value,
						storeId: this.searchKeys.storeId,
						cityId: this.searchKeys.cityId,
						sex: this.searchKeys.sex,
						status: this.searchKeys.status,
						groupId: this.searchKeys.groupId,
						cardId: this.searchKeys.cardId,
						isBinding: this.searchKeys.isBinding,
						startCreateTime: time.getDate(this.searchKeys.createTimeObj[0]),
						endCreateTime: time.getDate(this.searchKeys.createTimeObj[1])
					}
				})
			},
			searchData(){
				this.tableData.pagination.page > 1 ? (this.tableData.pagination.page = 1) : this.updateUrl();
			},
			list () {
				this.loading = true;
				this.$store.dispatch('post', {
					uri : 'userInfo/list2',
					data: {
						startRow: (this.tableData.pagination.page - 1) * this.tableData.pagination.size,
						pageSize: this.tableData.pagination.size,
						searchType: this.searchKeys.type,
						searchValue: this.searchKeys.value,
						storeId: this.searchKeys.storeId,
						cityId: this.searchKeys.cityId,
						sex: this.searchKeys.sex,
						status: this.searchKeys.status,
						groupId: this.searchKeys.groupId,
						cardId: this.searchKeys.cardId,
						isBinding: this.searchKeys.isBinding,
						startCreateTime: time.getDate(this.searchKeys.createTimeObj[0]),
						endCreateTime: time.getDate(this.searchKeys.createTimeObj[1])
					}
					}).then((res) =>{
						this.tableData.list = res.data.data.list || []
						this.tableData.pagination.total = res.data.data.total || 0
						this.loading = false;
					})
			},
			queryCardLevel(){
				this.$store.dispatch('get', {
					uri : 'userCard/listForSelect'
				}).then((res) =>{
					this.cardLevel = res.data.data.list || []
				})
				
			},
			queryGroupList() {
				this.$store.dispatch('post', {
					uri : 'userGroup/list'
				}).then((res) =>{
					this.groupList = res.data.data.list || []
				})
			},
			delTag(item, tag) {
				item.tagList.splice(item.tagList.indexOf(tag), 1);
				this.$store.dispatch('post', {
					uri : 'userTagRel/delete',
					data: {
						id: tag.relId
					}
				})
			},
			showInput(item, index) {
				this.$set(item, 'showTagInput', true);
				this.$set(item, 'tagInputValue', '');
			  this.$set(item, 'tagInput', 'tagInput' + index);
				this.$nextTick(_ => {
					this.$refs['tagInput'+index][0].$refs.input.focus();
				});
			},
			addTagConfirm(item) {
				let name = item.tagInputValue;
				let tag = null;
				if (name) {
					if (!item.tagList) {
						this.$set(item, 'tagList', []);
					}
					tag = {userTag:{name}};

					let addSign = true;
					item.tagList.forEach(function(item) {
						if (item.userTag.name == name) {
							addSign = false;
							return false;
						}
					});

					if (addSign) {
						item.tagList.push(tag);
						this.$store.dispatch('post', {
								uri : 'userTagRel/add',
								data: {
										userId: item.info.id,
										tagName: name
								}
						}).then((res)=>{
								tag.relId = res.data.data;
						});
					}

				}
				item.showTagInput = false;
				item.tagInputValue = '';
			},
			updateGroup(command) {
				command = JSON.parse(command);
				let item = this.tableData.list[command.index];

				if (item.groupId == command.group.id) {
					return;
				}

				item.groupName = command.group.name;
				item.groupId = command.group.id;

				this.$store.dispatch('post', {
					uri : 'userGroupRel/add',
					data: {
						userId: item.id,
						groupId: command.group.id
					}
				});
			},
      changeCheckList(event, item, index) {
        this.$set(item, 'check', event.target.checked);

        this.checkList[index] = event.target.checked;
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
      changeCheckAll(event) {
        let cList = this.checkList;
        let dataList = this.tableData.list;
        for (let i = 0; i < dataList.length; i++) {
          let item = dataList[i];
          cList[i] = event.target.checked;
          this.$set(item, 'check', event.target.checked);
        }
			},
			sendCoupon(command) {
			  let query = {
          _disType:command
				};
			  let cnt = 0;
			  if (command == 1) {
          let cList = this.checkList;
          let dataList = this.tableData.list;
          let ids = '';
          for (let i = 0; i < cList.length; i++) {
						if (cList[i]) {
              ids += dataList[i].id + ',';
              cnt ++;
						}
					}
          query._ids = ids;
				} else {
          query.searchType = this.searchKeys.type;
          query.searchValue = this.searchKeys.value;
          query.storeId = this.searchKeys.storeId;
          query.cityId = this.searchKeys.cityId;
          query.sex = this.searchKeys.sex;
          query.status = this.searchKeys.status;
          query.groupId = this.searchKeys.groupId;
          query.cardId = this.searchKeys.cardId;
          query.isBinding = this.searchKeys.isBinding;
          query.startCreateTime = time.getDate(this.searchKeys.createTimeObj[0]);
          query.endCreateTime = time.getDate(this.searchKeys.createTimeObj[1]);
          cnt = this.tableData.pagination.total;
				}
				if (cnt <= 0) {
			    msg.error('请选择用户');
			    return;
				}

        this.$router.push({
          path:'/marketing/coupon/distribute',
          query:{_cnt: cnt, ...query}
        })
			},
      queryMercParam() {
        this.$store.dispatch('post', {
          uri : 'mercParam/detail'
        }).then((res)=>{
          let mercParam = res.data.data;
          if (mercParam.exportUser == 1) {
						this.exportUser = true;
					}
        });
			},
      exportXls(){
        var params = "searchType="+(this.searchKeys.type ||'');
        params += "&searchValue="+(this.searchKeys.value ||'');
        params += "&storeId="+this.searchKeys.storeId ||'';
        params += "&cityId="+(this.searchKeys.cityId ||'');
        params += "&sex="+(this.searchKeys.sex ||'');
        params += "&status="+(this.searchKeys.status ||'');
        params += "&isBinding="+this.searchKeys.isBinding ;
        params += "&groupId="+this.searchKeys.groupId;
        params += "&cardId="+this.searchKeys.cardId;
        params += "&startCreateTime="+time.getDate(this.searchKeys.createTimeObj[0]);
        params += "&endCreateTime="+time.getDate(this.searchKeys.createTimeObj[1]);
        window.open(consts.BASE_URL +"/export/userInfo/list?" + params)
      },
      sendMsg(command) {
			},
			cashRecharge(item){ //充值金额
				this.rechargeUser = item; //获取客户相关信息
				this.showRecharge = true; //打开弹窗
			},
			cashRechargeSuccess(){
				// 充值金额成功
				this.list(); //刷新列表
				this.showRecharge = false; //关闭弹窗
			}
		},
		computed:{
			...mapState([
				'workInfo'
			])
		},
		components:{
			recharge,
			citySelect,
			storeSelect
		}
	}
</script>

<style lang="less" scoped>
	.or-table .tr-content td:first-child,
	.or-table .tr-content td:nth-child(2),
	.or-table .tr-content td:last-child {
		border-right: 0;
	}
	.isbind-card{
		width: 16px;
		height: 12px;
		display: inline-block;
		background: url('/static/img/user/isbinding.png') 0 0 /cover no-repeat;
		&.bind{
			background-position: left bottom;
		}
	}

</style>