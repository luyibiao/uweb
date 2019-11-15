<template>
	<div>
		<div class="clearfix">
			<auth perm="marketing.discountCode.update">
				<router-link :to="'/marketing/discountCode/create'"><el-button class="pull-right" type="primary">新建优惠码</el-button></router-link>
			</auth>
			<v-tab-nav v-bind:tab-nav-list="tabsNavList" v-bind:onClick="searchStatus"></v-tab-nav>
		</div>
		<div class="m-t-lg  ukao-v-loading">
      <el-table v-loading="loading" :data="tableData.list" style="width: 100%" class="ukao-el-table">
         <el-table-column
		      label="优惠码名称"
		      prop="name">
					<template slot-scope="scope">
						<router-link class="text-primary" :to="'/marketing/discountCode/codelibrary/'+scope.row.id+'/'+scope.row.codeType+'?name='+scope.row.name">{{scope.row.name}}</router-link>
					</template>
		    </el-table-column>
         <el-table-column
		      label="创建时间">
		      <template slot-scope="scope">
		        <div>{{ scope.row.date }}</div>
		        <div>{{ scope.row.time }}</div>
		      </template>
		    </el-table-column>
         <el-table-column
		      label="类型">
		      <template slot-scope="scope">
            <p v-show="scope.row.codeType===1">一卡一码</p>
						<p v-show="scope.row.codeType===2">通用码</p>
		      </template>
		    </el-table-column>
        <el-table-column
		      label="面额（元）">
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
						<p class="text-muted">库存：{{scope.row.cnt}}</p>
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
							<div class="text-muted">领取后{{ scope.row.term }}天效</div>
						</div>
		      </template>
		    </el-table-column>
         <el-table-column
		      label="领取人 | 次">
		      <template slot-scope="scope">
            <div>
              <router-link class="text-primary" :to="'/marketing/discountCode/receive/'+0+'/'+scope.row.id+'/'+scope.row.codeType">{{ scope.row.userNum || 0 }}</router-link>/{{ scope.row.totalNum  || 0}}
						</div>
		      </template>
		    </el-table-column>
         <el-table-column
		      label="已使用">
		      <template slot-scope="scope">
		       <div>
             <router-link class="text-primary" :to="'/marketing/discountCode/receive/'+1+'/'+scope.row.id+'/'+scope.row.codeType">{{ scope.row.usedNum || 0 }}</router-link>
           </div>
		      </template>
		    </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" >
            <div v-if="scope.row.status===1">
              <router-link type="text" class="text-primary" :to="'/marketing/discountCode/codelibrary/'+scope.row.id+'/'+scope.row.codeType+'?name='+scope.row.name">
                码库
              </router-link>
							<auth perm="marketing.discountCode.update">
								<span>-</span>
								<router-link type="text" class="text-primary" :to="'/marketing/discountCode/edit/'+scope.row.id">
									编辑
								</router-link>
							</auth>
							<auth perm="marketing.discountCode.disable">
								<span>-</span>
								<el-button type="text" class="text-danger" @click="handleCommand(scope.row)">
									使失效
								</el-button>
							</auth>
            </div>
						<p v-else-if="scope.row.status===0" class="text-muted">已失效</p>
						<p v-else-if="scope.row.status===-1" class="text-danger">已过期</p>
          </template>
        </el-table-column>
      </el-table>
		</div>
		<div class="text-right m-t-sm">
			<el-pagination
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
  import BIZ_CST from '@/utils/bizconsts'

	export default {
    components: {
      vTabNav
    },
    data: function () {
      return {
        loading:false,
        tableData: {
          type:'7',
          pageStart: 0,
					status: '',
          list: [],
          pagination: {
            size: consts.PAGE_SIZE,
            total: 0
          }
        },
        tabsNavList: [
          {val:'', text: '全部'},
          {val: '0', text: '未生效'},
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
        this.search()
			},
			list(start){
				var _this = this
				_this.loading = true
				this.$store.dispatch('post', {
					uri: 'couponInfo/list',
					params: {
						startRow: start || 0,
						status: this.tableData.status,
						type: this.tableData.type,
						pageSize: _this.tableData.pagination.size,
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
			handleCurrentChange (val){
				 this.tableData.pageStart = (val-1) * this.tableData.pagination.size
				 this.list(this.tableData.pageStart)
	  	},
			handleCommand(cmd){
          let _this = this;
          msg.confirm({msg:'失效后，用户无法再使用该优惠码，该码也不能再次编辑', title: '确定使['+cmd.name+']失效?',
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
</script>

<style  lang="less" scoped>
.el-table::after {
    content: '';
    position: absolute;
     background-color: white; 
    z-index: 1;
}
.el-table--fit{
  border-left: 0;
  border-right: 0;
}
</style>