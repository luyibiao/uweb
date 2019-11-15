<template>
	<div>
		<div class="text-right">
			<!--<span>地域：</span>-->
      <div class="w dis-inline m-l m-r-lg">
        <el-input placeholder="请输入名称、编号" v-model="tableData.keywords" @keyup.enter.native="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
			<auth perm="store.list.update">
				<router-link to="new_store"><el-button type="primary">新建门店</el-button></router-link>
			</auth>
		</div>

		<div class="m-t">
			<el-table class="ukao-el-table w-full ukao-v-loading"
				v-loading="loading" 
		    :data="tableData.list">
		    <el-table-column  label="店名">
		      <template slot-scope="scope">
		        <router-link :to="'info/'+scope.row.id" target="_blank"><span class="text-primary">{{ scope.row.name }}</span></router-link>
		      </template>
		    </el-table-column>
				<el-table-column label="设备 | 版本" width="250px">
					<template slot-scope="scope" >
						<ul  class="icon-li">
							<li v-for="(item, index) in scope.row.cashierList" v-if="item">
								<img v-if="item.monitor == 'T2lite'" src="/static/img/machine/T2little.png" />
								<img v-else-if="item.monitor && item.monitor.substring(0,1) == 'T'" src="/static/img/machine/T.png"/>
								<img v-else="" src="/static/img/machine/L1.png"/>
								{{ item.monitor}}<span>{{'(V'+item.bizVersion+')'}}</span>
							</li>

							<li v-for="(item, index) in scope.row.clientList" v-if="item">
								<img  src="/static/img/machine/PC.png" class=""/>
								PC<span>{{'(V'+item.version+')'}}</span>
							</li>

						</ul>
					</template>
				</el-table-column>
		    <el-table-column  label="编号" prop="code">
		    </el-table-column>
				<el-table-column  label="门店标记" prop="mark">
				</el-table-column>
				<el-table-column label="到期时间" v-if="chargeMode && chargeMode>1">
					<template slot-scope="scope">
						<p>{{scope.row.validDate | getDate}} 00:00</p>
						<p :class="{'text-success':selectTime(scope.row.validDate,timestamp)==='生效中','text-danger':selectTime(scope.row.validDate,timestamp)==='已过期'}">{{selectTime(scope.row.validDate,timestamp)}}</p>
					</template>
				</el-table-column>
		    <el-table-column label="创建时间">
		      <template slot-scope="scope" >
		        <p>{{scope.row.date }}</p>
		        <p>{{scope.row.time }}</p>
		      </template>
		    </el-table-column>
		    <!-- <el-table-column  label="地址">
          <template slot-scope="scope">
            <p>{{scope.row.regionalDesc}}</p>
            <p>{{scope.row.addrDesc}}</p>
          </template>
		    </el-table-column> -->
		    <!-- <el-table-column  label="服务电话"  prop="tel">
		    </el-table-column>
				<el-table-column label="收银机">
					<template slot-scope="scope">
						<div v-if="scope.row.expCnt && scope.row.expCnt > 0">
							<p>已绑定</p>
							<p class="text-muted">{{scope.row.expCnt}}台</p>
						</div>
						<p v-else class="text-muted">未绑定</p>
					</template>
    		</el-table-column>
				<el-table-column label="客户端">
					<template slot-scope="scope">
						<div v-if="scope.row.clientCnt && scope.row.clientCnt > 0">
							<p>已绑定</p>
							<p class="text-muted">{{scope.row.clientCnt}}个</p>
						</div>
						<p v-else class="text-muted">未绑定</p>
					</template>
				</el-table-column> -->
				<el-table-column
					label="登录账号">
					<template slot-scope="scope">
						<div>{{ scope.row.workAccount }}</div>
					</template>
				</el-table-column>
		    <el-table-column   label="状态">
		      <template slot-scope="scope">
						<p v-show="scope.row.status===1" class="text-success">已启用</p>
						<p v-show="scope.row.status===0" class="text-danger">已停用</p>
						<!-- <auth perm="store.list.update">
							<el-switch
								v-model="scope.row.statusVal"
								active-color="#13ce66"
								inactive-color="#dcdcdc"
								:width="74"
								on-text="已启用"
								off-text="未启用" @change="updateStatus(scope.row)">
							</el-switch>
							<template slot="noPerm">
								<template v-if="scope.row.statusVal == 1">
									<span class="text-success">{{scope.row.statusVal | getValText('DATE_STATUS')}}</span>
								</template>
								<template v-else>
									<span class="text-danger">{{scope.row.statusVal | getValText('DATE_STATUS')}}</span>
								</template>
							</template>
						</auth> -->
		      </template>
		    </el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text"   @click="option(scope.row)" v-if="chargeMode && chargeMode>1">
							<span v-if="selectTime(scope.row.validDate,timestamp)==='生效中'">续费</span>
							<span v-else-if="selectTime(scope.row.validDate,timestamp)==='已过期'">立即订购</span>
						</el-button>
						<!-- <el-button type="text"   @click="option(2)">立即订购</el-button> -->
						<!-- <router-link class="text-primary" :to="'/finance/service_order'" v-show="selectTime(scope.row.validDate,timestamp)==='生效中'">续费</router-link>
						<router-link class="text-primary" :to="'/finance/service_order/'+scope.row.id" v-show="selectTime(scope.row.validDate,timestamp)==='已过期'">立即订购</router-link> -->
					</template>
				</el-table-column>
		  </el-table>
			<div class="m-t-sm text-right">
        <el-pagination
          :page-size="tableData.pagination.size"
          layout="total, prev, pager, next"
          :total="tableData.pagination.total"
          @current-change="handleCurrentChange">
        </el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import time from '@/utils/helpers/timeLite'

	export default {
		data: function() {
			return {
				loading: true,
				chargeMode:'',
        tableData: {
          keywords : '',
          pageStart: 0,
					list : [],
					timestamp:'',
          pagination : {
            size: consts.PAGE_SIZE20,
            total: 0
          }
        }
			}
		},
		created () {
      this.list(0)
    },
		methods: {
			option(item){
				this.$router.push({path:'/finance/service_order',query:{id:item.id}})
			},
      search (){
          this.list(0)
      },
		  list (start) {
        var _this = this
				_this.loading = true
        this.$store.dispatch('post', {
          uri : 'storeInfo/list',
          params: {
            startRow: start || 0,
            pageSize: _this.tableData.pagination.size,
            keywords: this.tableData.keywords || '',
            machineIconFlag: true
          }
        }).then((res) =>{
					this.chargeMode=res.data.chargeMode;
					this.timestamp=res.data.timestamp;
					this.timestamp=this.$options.filters.getDate(this.timestamp);
					// console.log(this.timestamp,'aaa');
					let list = res.data.data.list || []
					let expList = res.data.expList || []
					let storeIds = '';
					list.forEach(function (item) {
						if(item.createTime){
						 item.date = time.getDate(item.createTime)
						 item.time = time.getTime(item.createTime)
						}
						item.statusVal = item.status === 1 ? true : false
						let cnt = 0
						expList.forEach(function (eitem) {
							if(eitem.storeId === item.id){
								cnt += 1
							}
						})
						item.expCnt = cnt
            storeIds += item.id + ',';
					});
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false;
          this.queryClientCnt(storeIds);
        })
      },
			queryClientCnt(storeIds) {
        this.$store.dispatch('post', {
          uri : 'clientAct/queryStoreCnt',
          data: {
            storeIds: storeIds
          }
        }).then((res) =>{
					if (res.data.data) {
					  let _this = this;
					  let list = this.tableData.list;
					  let sCntList = res.data.data;
            list.forEach(function (item) {
              sCntList.forEach(function (eitem) {
                if(eitem.storeId === item.id){
                  _this.$set(item,"clientCnt",eitem.cnt);
                }
							});
            });
					}
        })
			},
			filterData (list, id){	//数据过滤
				if(!list && !id) return
				let tmpItem = null
				list.forEach(function (item) {
						if(id && item.id === id){
							tmpItem = item
							return false
						}
        })
				return tmpItem;
			},
			updateStatus (item){
        this.$store.dispatch('post', {
          uri: item.status ? 'storeInfo/disable' : 'storeInfo/enable',
          params: {
            id: item.id
          }
        }).then((res) => {
            msg.success();
        })
      },
      handleCurrentChange (val){
        this.tableData.pageStart = (val-1) * this.tableData.pagination.size
        this.list(this.tableData.pageStart)
			},
			selectTime(Vtime,timestamp){
				return Date.parse(new Date(Vtime))-Date.parse(new Date(timestamp))>0 ? "生效中" : "已过期"
			}
		},

	}
</script>

<style scoped>
	.icon-li{
		/*width: 50%;*/
	}
	.icon-li > li{
		width: 50%;
		float: left;
	}

	.icon-li > li> img{
		width:20px;
	}

	.icon-li>li>span{
		color: #98a6ad;
	}
</style>
