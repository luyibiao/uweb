<template>
  <div >
    <div class="price-copy-container clearfix" v-loading="loading">
      <div v-if="scList && scList.length > 0">
        <div class="pull-left w-lg m-t-xs">
          <div class="u-select v-middle m-r-lg">
            <el-select v-model="productObj.authWorkId"  @change="chooseSelectItem" placeholder="请选择">
              <el-option
                  v-for="item in scList"
                  :key="item.wkId"
                  :label="item.showName"
                  :value="item.wkId"
                  :disabled="item.disabled">
                </el-option>
            </el-select>
          </div>
        </div>
        <div class="dis-inline text-center v-middle m-r pull-left w-xs">
          <img class="thumb" src="/static/img/price_copy.jpg" alt="">
          <p class="text-success">授权给</p>
        </div>
        <div class="text-left" style="margin-left: 400px;">
          <el-select v-model="productObj.acceptWorkId"  placeholder="请选择">
            <el-option
                v-for="item in scSelectedList"
                :key="item.wkId"
                :label="item.showName"
                :value="item.wkId"
                :disabled="item.disabled">
              </el-option>
          </el-select>
            <el-button  style="margin-left: 20px"  type="success" @click="confirmAdd">确定</el-button>
        </div>

      </div>
    </div>

    <div class="m-t-xl" >
      <p class="text-md m-b-sm">授权记录</p>
      <el-table class="ukao-el-table"
        :data="tableData.list"
        style="width: 100%">
        <el-table-column
          label="授权时间">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | getDate }}</div>
            <div>{{ scope.row.createTime | getTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="授权人">
          <template slot-scope="scope">
            <div>{{ scope.row.createByName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="授权对象">
          <template slot-scope="scope">
            <div >{{scope.row.authCityName}}{{ scope.row.authRoleName }}</div>
            <div>{{scope.row.authName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="接受对象">
          <template slot-scope="scope">
            <div>{{scope.row.acceptCityName}}{{ scope.row.acceptRoleName }}</div>
            <div>{{scope.row.acceptName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间">
          <template slot-scope="scope">
            <div>{{ scope.row.updateTime | getDate }}</div>
            <div>{{ scope.row.updateTime | getTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="更新人">
          <template slot-scope="scope">
            <div>{{ scope.row.updateByName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status===1">正有效</div>
            <div v-else>已取消</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.status===1">
              <el-button  @click="cancelAuth(scope.row)">取消授权</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="m-t-sm text-right">
        <el-pagination
          :page-size="tableData.pagination.size"
          :current-page="tableData.pagination.current"
          layout="total, prev, pager, next"
          :total="tableData.pagination.total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import consts from '@/utils/consts'
 	import msg from '@/utils/msg'

  export default {
    data() {
      return {
        loading: false,
        selectedText: '请选择',
        showSelectList: false,
        scList: [], // 要拷贝的账号列表
        showAddList: false,
        scSelectedList: [], // 授权至的账号列表
        addBtnState: false,
        copyBtnState: true,
        visible2: false,
        tableData: {
          pageStart: 0,
          list : [],
          pagination : {
            current: 0,
            size: consts.PAGE_SIZE,
            total: 0
          }
        },
        productObj:{
          authRoleId:'',
          authWorkId:'',
          acceptWorkId:'',
        }
      }
    },
    created(){
      this.recordList(0)
      this.queryManagerList()
    },
    methods: {
      recordList(start){
        this.$store.dispatch('getList', {
          uri : 'accountAuth/recordList',
          params: {
            startRow: start || 0,
            pageSize: this.tableData.pagination.size
          }
        }).then((res) =>{
          var list = res.data.data.list || []
          this.tableData.list = list
          this.tableData.pagination.total = res.data.data.total || 0
          this.tableData.pagination.current = 1
        })
      },
      queryManagerList(){
        this.$store.dispatch('getList', {
          uri : 'workerInfo/queryManagerList',
          params:{}
        }).then((res) =>{
          var tmpList  = res.data.data || []
          tmpList.forEach(function (item) {
             item.showName = item.cityName + item.roleName
             item.showName += item.wkName ?  '(' + item.wkName + ')' : ""
             item.disabled = false;
          })
          this.scList = tmpList
        })
      },

      confirmAdd(){
        this.$store.dispatch('post', {
          uri : 'accountAuth/add',
          data:{
            authWorkId: this.productObj.authWorkId,
            acceptWorkId: this.productObj.acceptWorkId
          }
        }).then((res) =>{
          this.productObj.authWorkId = ''
          this.productObj.acceptWorkId = ''
          this.recordList(0)
          msg.success()
        })
      },
      // 取消授权
      cancelAuth(item){
        var _this = this
        msg.confirm({msg:'确定取消授权？', confirmFn: function () {
          _this.$store.dispatch('post', {
            uri : 'accountAuth/cancel',
            data: {
              id: item.id
            }
          }).then((res) =>{
            _this.recordList(0)
            msg.success()
          })
        }})
      },
      chooseSelectItem(){
        var _this = this, tmpList = [];
        _this.productObj.acceptWorkId = _this.productObj.authWorkId === _this.productObj.acceptWorkId ? '' : _this.productObj.acceptWorkId
        this.scList.forEach(function(item) {
          if(item.wkId != _this.productObj.authWorkId){
            tmpList.push(item)
          }
        });
        this.scSelectedList = tmpList
      },
      handleCurrentChange(val){
        this.tableData.pageStart = (val-1) * this.tableData.pagination.size
        this.recordList(this.tableData.pageStart)
      }
    }
  }
</script>
<style scoped>
	.no-data {
		background: #f3f7ff;
		display: inline-block;
		width: 40%;
		min-width: 360px;
		padding: 20px 0;
		border-radius: 10px;
	}

	.u-select {
		position: relative;
		display: inline-block;
		min-width: 240px;
	}
	.u-selected-item {
		padding: 8px 30px 8px 10px;
		border: 1px solid #3d97ee;
		background: #cde8fb;
		border-radius: 6px;
		position: relative;
		/*overflow: hidden;*/
	}
	.u-select-icon {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
	}
	.u-select-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 42px;
    z-index: 1001;
    border: 1px solid #d1dbe5;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.04);
    box-sizing: border-box;
    margin: 5px 0;
    overflow: hidden;
    transform-origin: 0% 0% 0;
	}
	.u-select-list ul {
		padding: 6px 0;
		max-height: 300px;
		overflow-y: auto;
		box-sizing: border-box;
	}
	.u-select-list ul li {
		padding: 8px 10px;
		line-height: 20px;
		white-space: nowrap;
	}
	.u-select-list ul li:hover {
		background: #e4e8f1;
	}
	.u-select-list ul li.active {
		background: #20a0ff;
		color: #fff;
	}
	.u-select-list ul li.active:hover {
		background: #1c8de0;
	}

	.sc-selected-list li {
		float: left;
		padding-right: 50px;
		margin-bottom: 15px;
	}
	.sc-selected-list .item {
		position: relative;
		padding: 8px 20px;
		line-height: 20px;
		background: #fceeee;
		border: 1px solid #f64643;
		border-radius: 6px;
	}
	.sc-selected-list li .item > a {
		display: none;
		position: absolute;
		top: 0;
		right: -34px;
		color: #f56866;
	}
	.sc-selected-list li:hover .item > a {
		display: block;
	}

	.u-add {
		position: relative;
	}
	.u-add-list {
		position: absolute;
		left: 0;
		top: 42px;
    z-index: 1001;
    border: 1px solid #d1dbe5;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.04);
    box-sizing: border-box;
    margin: 5px 0;
    overflow: hidden;
    transform-origin: 0% 0% 0;
    padding-bottom: 50px;
	}
	.u-add-list .u-add-btn {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px 10px;
	}
	.u-add-list ul {
		min-width: 240px;
		padding: 6px 0;
		max-height: 300px;
		overflow-y: auto;
		box-sizing: border-box;
	}
	.u-add-list ul li {
		padding: 8px 10px;
		line-height: 20px;
		white-space: nowrap;
	}
	.price-copy-container {
		width: 80%;
		margin: 0 auto;
	}



	.fade-enter-active  {
	  transition: transform .2s;
	}
	.fade-leave-active {
		transform: scaleY(0);
		transition: transform .2s;
	}
	.fade-enter {
		transform: scaleY(0);
	}
	.b-t-dashed {
		border-top: 1px dashed #d9d9d9;;
	}
</style>