<template>
	<div>
		<div class="clearfix">
			<auth perm="marketing.coupon.receive.update">
				<router-link to="new"><el-button class="pull-right" type="primary">新建优惠券</el-button></router-link>
			</auth>
			<v-tab-nav v-bind:tab-nav-list="tabsNavList" v-bind:onClick="searchStatus"></v-tab-nav>
		</div>
		<div class="m-t-lg ukao-v-loading">
			<el-table class="ukao-el-table m-t"
				v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="优惠券名称"
		      prop="name">
		    </el-table-column>
		    <el-table-column
		      label="创建时间">
		      <template slot-scope="scope">
		        <div>{{ scope.row.date }}</div>
		        <div>{{ scope.row.time }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="券面值（元）">
		      <template slot-scope="scope">
		        <div v-if="scope.row.random == 0">{{ scope.row.amount | amtFormat }}</div>
		        <div v-if="scope.row.random == 1 ">{{ scope.row.minAmount | amtFormat }} - {{ scope.row.maxAmount | amtFormat }}</div>
		        <div class="text-muted">
							<p v-if="scope.row.fullAmount==0">无限制使用</p>
							<p v-if="scope.row.fullAmount > 0">满{{ scope.row.fullAmount | amtFormat }}元可用</p>
						</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="领取限制">
		      <template slot-scope="scope">
		        <div v-if="scope.row.perUserNum > 0">每人限{{ scope.row.perUserNum }}张</div>
		        <div v-else>无限制</div>
						<div v-if="scope.row.useBalance == 0" class="text-muted">优惠券与余额不能同时使用</div>
		      </template>
		    </el-table-column>
				<el-table-column
		      label="库存">
		      <template slot-scope="scope">
		        <div>{{ scope.row.cnt - scope.row.totalNum }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="有效期">
		      <template slot-scope="scope">
						<div v-if="scope.row.dateType == 1">
							<div>{{ scope.row.timeStart }}至</div>
							<div>{{ scope.row.timeEnd }}</div>
						</div>
						<div v-if="scope.row.dateType == 2">
							<div class="text-muted">领取后{{ scope.row.term }}天失效</div>
						</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="领取人 | 次">
		      <template slot-scope="scope">
            <div>
              <router-link :to="'/marketing/coupon/getDetail?couponId='+scope.row.id" class="text-primary" >{{ scope.row.userNum || 0 }}</router-link>/{{ scope.row.totalNum  || 0}}
						</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="使用规则">
          <template slot-scope="scope">
            <div>
              <a class="text-primary">{{ scope.row.ruleName }}</a>
            </div>
          </template>
		    </el-table-column>
		    <el-table-column
		      label="已使用数">
		      <template slot-scope="scope">
		       <div>
             <a class="text-primary">{{ scope.row.usedNum || 0 }}</a>
           </div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作">
		      <template slot-scope="scope">
						<el-dropdown trigger="click" class="text-primary" @command="handleCommand" v-if="scope.row.status == 1">
								<span class="el-dropdown-link">
									更多<i class="el-icon-caret-bottom el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item>
										<el-tooltip placement="left">
											<qrcode slot="content" :value="wxUrl + '/obtain_list?u_code=' + mercInfo.code + '&ids=' + scope.row.id" :options="{ size: 110 }"></qrcode>
											<i class="el-icon-caret-bottom el-icon-menu"> 公众号二维码</i>
										</el-tooltip>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-tooltip placement="left">
											<div slot="content">
												<input type="text" readonly :id="'js_url_' + scope.row.id" :value="wxUrl + '/obtain_list?u_code=' + mercInfo.code + '&ids=' + scope.row.id"/>
												<el-button @click="copyUrl('js_url_' + scope.row.id)" type="text">复制</el-button>
											</div>
											<i class="el-icon-caret-bottom el-icon-share"> 公众号链接</i>
										</el-tooltip>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-tooltip placement="left">
											<qrcode slot="content" :value="wxUrl + '/wxapp/' + mercInfo.code +'?action=coupon&ids=' + scope.row.id" :options="{ size: 110 }"></qrcode>
											<i class="el-icon-caret-bottom el-icon-menu"> 小程序二维码</i>
										</el-tooltip>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-tooltip placement="left">
											<div slot="content">
												<input type="text" readonly :id="'js_app_url_' + scope.row.id" :value="'pages/mainPackage/user/userCoupon/addCoupon/addCoupon?ids=' + scope.row.id"/>
												<el-button @click="copyUrl('js_app_url_' + scope.row.id)" type="text">复制</el-button>
											</div>
											<i class="el-icon-caret-bottom el-icon-share"> 小程序链接</i>
										</el-tooltip>
									</el-dropdown-item>
									<auth perm="marketing.coupon.receive.update">
										<el-dropdown-item :command="JSON.stringify({type:'edit', id: scope.row.id})"><i class="el-icon-caret-bottom el-icon-edit"></i> 编辑</el-dropdown-item>
									</auth>
									<auth perm="marketing.coupon.receive.disable">
										<el-dropdown-item :command="JSON.stringify({type:'disable', name: scope.row.name, id: scope.row.id})"><i class="el-icon-caret-bottom el-icon-delete"></i> 使失效</el-dropdown-item>
									</auth>
								</el-dropdown-menu>
						</el-dropdown>
						<div class="text-muted" v-else>
							已失效
						</div>
		      </template>
		    </el-table-column>
	    </el-table>
		</div>
		<div class="text-right m-t-sm">
			<el-pagination
			:current-page.sync="tableData.pagination.current"
			:page-size="tableData.pagination.size"
			 layout="total, prev, pager, next"
			 :total="tableData.pagination.total"
			 @current-change="handleCurrentChange">
		 </el-pagination>
	  </div>
	</div>
</template>

<script>
  import auth from '@/utils/auth'
	import vTabNav from '../../Common/tab_nav.vue'
	import helpers from '@/utils/helpers/base'
	import msg from '@/utils/msg'
	import consts from '@/utils/consts'
	import time from '@/utils/helpers/timeLite'
  import qrcode from '@xkeshi/vue-qrcode'
  import BIZ_CST from '@/utils/bizconsts'

	export default {
    components: {
      vTabNav,qrcode
    },
    data: function () {
      return {
        wxUrl: consts.WX_URL,
        mercInfo: auth.getMercInfo(),
        loading: true,
        tableData: {
          keywords: '',
					status: '',
					type: BIZ_CST.TOOL.COUPON_OBTAIN_RECEIVE,
          list: [],
          pagination: {
            size: consts.PAGE_SIZE,
            total: 0,
            current: 1
          }
        },
        tabsNavList: [
          {val:'', text: '全部'},
          {val: '0', text: '已失效'},
          {val: '1', text: '正有效'},
          {val: '-1', text: '已过期'}
        ]
      }
    },
    created(){
			this.list(0)
    },
    methods: {
      search (){
        this.list(0)
      },
      searchStatus(item){
        this.tableData.status = item.val
        this.tableData.pagination.current = 1;
        this.search()
      },
			list(start){
				var _this = this
				_this.loading = true
				this.$store.dispatch('post', {
					uri: 'couponInfo/list',
					params: {
						startRow: (this.tableData.pagination.current-1) * this.tableData.pagination.size || 0,
						status: this.tableData.status,
						type: this.tableData.type,
						pageSize: _this.tableData.pagination.size,
						keywords: this.tableData.keywords || ''
					}
				}).then((res) => {
					let list = res.data.data.list || []
					list.forEach(function (item) {
						if(item.createTime){
						  item.date = time.getDate(item.createTime)
						  item.time = time.getTime(item.createTime)
					  }
						item.timeStart = time.getDate(item.timeStart)
				  	item.timeEnd = time.getDate(item.timeEnd)
					})
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false;
				})
			},
      copyUrl(id) {
        let obj = document.getElementById(id);
        obj.select();
        document.execCommand("Copy");
			},
			handleCurrentChange (){
				 this.list()
	  	},
			handleCommand(cmd){
        if (!cmd) {
          return;
        }
        cmd = JSON.parse(cmd);
        if (cmd.type == 'edit') {
          this.$router.push({
            path: '/marketing/coupon/edit',
						query: {id: cmd.id}
          });
				} else if (cmd.type == 'disable') {
          let _this = this;
          msg.confirm({msg:'失效后，用户无法再领取该优惠券，该券也不能再次编辑，不影响用户已领取的券', title: '确定使['+cmd.name+']失效?',
            confirmFn(){
              _this.$store.dispatch('post', {
                uri: 'couponInfo/disable',
                data: {id: cmd.id}
              }).then((res) => {
                msg.success();
                _this.search();
              });
						}
          })
				}
			}
    }
  }
</script>

<style  lang="less" scoped>
	.qr{
		padding-top: 5px;
		display: none;
		width: 140px;
		position: absolute;
		top: 0;
		left: -155px;
		text-align: center;
		background: #fff;
		border: 1px solid #d1dbe5;
		box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.12);
		&:after{
			content: '';
			position: absolute;
			top: 20px;
			right: -6px;
			width: 10px;
			height: 10px;
			border-top: 1px solid #d1dbe5;
			border-right: 1px solid #d1dbe5;
			transform: rotate(45deg);
			background-color: #fff;
		}
	}
	.qr-box:hover>.qr{
		display: block;
	}
</style>