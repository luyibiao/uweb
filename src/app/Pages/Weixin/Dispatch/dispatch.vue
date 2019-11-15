<template>
	<div>
		<div class="ukao-v-loading" v-loading="loading">
			<q-draw v-if="!loading" :callback="draw" :center="drarMap.center"></q-draw>
		</div>

		<!-- 弹出选择人员层 -->
		<el-dialog class="ukao-dialog"
			:title="dialog.title"
			:visible.sync="dialog.visible"
			size="small">
			<div>
				<div>
					<div class="m-b-xs">ID:{{selectRegionCode}}，已选人员：{{multipleSelection.length}} 人</div>
					<div class="sender-list-container">
						<ul class="sender-list clearfix">
							<li v-for="item in multipleSelection" :key="item.id">
								<img class="thumb-sm img-circle"  :src="item.imgPath || '/static/img/work/def.png'" :title="(item.name || '')+''+(item.phone || '')" :alt="item.name">
								<!--<div>{{item.name}}</div>-->
							</li>
						</ul>
					</div>
					<div class="m-b-xs m-t-xs">
						<el-input placeholder="请输入姓名/电话" v-model="work.keywords" @keyup.enter.native="searchWork">
							<el-button slot="append" icon="el-icon-search" @click="searchWork"></el-button>
						</el-input>
					</div>
				</div>
				<el-table :data="workShowList" height="350" style="width: 100%;" ref="multipleTable" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="date" label="头像" >
						<template slot-scope="scope">
							<img class="thumb-sm img-circle" :src="scope.row.imgPath || '/static/img/work/def.png' " alt="">
						</template>
					</el-table-column>
					<el-table-column prop="name" label="姓名" width="180"></el-table-column>
					<el-table-column prop="phone" label="手机号"> </el-table-column>
				</el-table>
				<div class="m-t-sm text-right">
					<el-button @click="dialog.visible=false">取消</el-button>
					<el-button type="primary" :loading="dialog.btn" @click="saveRegionAssignWork">保存</el-button>
				</div>
			</div>
		</el-dialog>
		<!-- end 弹出选择人员层-->
	</div>
</template>



<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import qDraw from '@/components/Map/QMap/Draw'
	import coordinate from '@/utils/helpers/coordinate'

	export default {
		components :{
       qDraw
		},
		data: function() {
			return {
				loading: true,
        total: 0,
				maxTotal: 200,
				drarMap:{
					center:{
					  lng:'',
						lat:''
					}
				},
				tableData: {
					pageStart: 0,
					list : [],
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
				work:{
					keywords: ''
				},
				selectRegionCode: '', //选择覆盖与其cod
				multipleSelection: [],	//多选列表
				workShowList: [],			//处理循环
				workList: [],						//查询结果
				dialog: {
				  title: '指派取送员',
					visible: false,
					btn: false
				},
				ruleForm: {
					regionAssignId:'',
					workIds:''
				},
				assign: {
					callback:{}
				},
				cityInfo:{}

			}
    },
		created() {
		  this.initCity()
			this.workShowList = this.workList
		},
		mounted(){
			this.list();
		},
		methods: {
		  initCity(){
				var _this = this
				this.$store.dispatch('post', {
					uri: 'mercCity/city',
					data: {
					}
				}).then((res) => {
					_this.cityInfo = res.data.data ||{}
					if(_this.cityInfo.lng && _this.cityInfo.lat){
					  _this.drarMap.center.lng = _this.cityInfo.lng
					  _this.drarMap.center.lat = _this.cityInfo.lat
					}else{
            let cityName = res.data.data.name || '长沙';
							coordinate.codeAddress(cityName,function (result) {
                _this.drarMap.center.lng =result.detail.location.lng;
                _this.drarMap.center.lat = result.detail.location.lat;
              },_this);
					}
				})
			},
			list(start){
				var _this = this
				this.$store.dispatch('post', {
					uri: 'regionAssign/list',
					data: {
						startRow: start || 0,
						pageSize: this.maxTotal
					}
				}).then((res) => {
					let list = res.data.data.list || []
					let signList = res.data.signList || []
					let workList = res.data.workList || []
					let tmpSignList = this.arrGrouping(signList);
					let tmpWorkList = this.arrGrouping(workList);
					list.forEach(function (item) {
							item.signList = _this.arrCompare(item.id, tmpSignList)
							item.workList = _this.arrCompare(item.id, tmpWorkList)
          })
					 _this.tableData.list = list
					 _this.total = res.data.data.total;
					 _this.loading = false
				})
			},
			//获取已选择覆盖区域的人员
			// getRegionAssignWorkList (id){
			// 	var tmpWorkList = []
			// 	this.tableData.list.forEach(function (item) {
			// 		if(id && id === item.id){
			// 			tmpWorkList = item.workList || []
			// 			return false
			// 		}
      //   })
			// 	this.multipleSelection = tmpWorkList
			// },
			//数组比较
			arrCompare(id, list){
				if(!list || list.length === 0 || !id){
		    	return []
				}
				let tmpList = []
				list.forEach(function (sitem, index) {
					if(id === sitem[0].regionAssignId){
						tmpList = sitem
						return false
					}
				})
				return tmpList
			},
			//同类型数组分组
			arrGrouping(list){
			  if(!list || list.length == 0){
			    return list
				}
				//排序
				list = list.sort(function(a , b){
          return a.regionAssignId - b.regionAssignId;
      	})

				var hash = {}
				var tmpList = []
				var n = -1
				//把数组同类型的regionAssignId拆分成数组
				for(var i = 0, len = list.length; i < len; i++){
					if(!hash[list[i].regionAssignId]){
						n++
						hash[list[i].regionAssignId] = true
						tmpList[n] = []
					}
					tmpList[n].push(list[i]);
				}
				return tmpList
			},
			draw(res){
			  var _this = this
			  switch (res.action){
					case 'init':
					  console.log("地图初始化完成")
						if(typeof (res.fn) === 'function'){
					    res.fn(_this.tableData.list)
						}
					  break
					case 'save':
						console.log("绘制地图保存")
						_this.saveRegionAssign(res.data, res.fn, res.removeFn)
					  break
					case 'addWorker':
					  _this.addWorker(res.data, res.fn)
					  break
					case 'deleteRegion':
					  _this.deleteRegion(res.data, res.fn)
					  break
					default :
					  console.log('default')
						break
				}
			},
			addWorker(data, fn){			//选择添加人员
				var _this = this
				_this.assign.callback = {}
				_this.dialog.btn = false
				_this.getWorkerList(function () {
				  _this.selectRegionCode = data.code || ''
					_this.ruleForm.regionAssignId = data.id
					_this.dialog.visible = true;
					_this.selectedPersonnel(data.id); //获取已选择的人员,并选中
					if(typeof (fn) === 'function') {
				    //保存回调函数
						_this.assign.callback = fn
          }
					// _this.getRegionAssignWorkList(data.id)
        })
			},
			//删除绘图层
			deleteRegion(data, fn){
				var _this = this
				msg.confirm({msg: "删除ID:"+data.code+"选择区域, 是否继续?", confirmFn: function () {
					_this.$store.dispatch('post', {
						uri: 'regionAssign/delete',
						data: {id:data.id}
					}).then((res) => {
 						msg.success('删除成功')
						if(typeof (fn) === 'function'){
 						  fn(data)
						}
					})
				}})
			},
			getWorkerList(fn){ //	选择人员
				this.$store.dispatch('post', {
					uri: 'workerInfo/takeAndSend/list',
				}).then((res) => {
					let list = res.data.data ? res.data.data : []
					if(list.length == 0){
					  msg.error("还未录入取送人员")
						return
					}
					this.workShowList = list
					this.workList = list
					this.multipleSelection = []
					if(typeof (fn) === 'function'){
					  fn()
					}
				})
			},
			searchWork(){
			  var _this = this
				var tmpWorkList = []
				if(_this.work.keywords) {
          _this.workList.forEach(function (item) {
            if ((item.name && item.name.indexOf(_this.work.keywords.toString()) >= 0)
              || (item.phone && item.phone.indexOf(_this.work.keywords.toString()) >= 0)) {
              tmpWorkList.push(item)
            }
          })

        }else{
					 tmpWorkList =  _this.workList
				}
				_this.workShowList = tmpWorkList
			},
			saveRegionAssign(data, fn, removeFn){		//保存绘图区域所有坐标
				if(this.total >= this.maxTotal){
          if(removeFn){
            removeFn(data);
					}
          msg.error("取送区域最多添加"+this.maxTotal+"个");
					return ;
				}
				this.$store.dispatch('post', {
					uri: 'regionAssign/add',
					data: {
						code : data.code || '',
						regionType : data.type, //类型
						points : data.points,
						radius : data.radius || ''    //类型为：circle半径
					},
          forceResolve:true
				}).then((res) => {
				  if(res.data.httpCode == 200){
            var info = res.data.data || {}
            msg.success();
            this.tableData.list.push(info)
            if(typeof (fn) === 'function'){
              var regionAssign = res.data.data
              fn(data, regionAssign)
            }
					}else{
            removeFn(data);
            msg.error(res.data.msg)
					}
				})
			},
			//保存绘图区域选择的人员
			saveRegionAssignWork(){
			  var workIds = []
				var tmpMultipleSelection = this.multipleSelection || []
				tmpMultipleSelection.forEach(function (item) {
					workIds.push(item.id)
        })
				if(workIds.length <= 0){
			    msg.error("请选择指派取送员")
			    return
				}
				this.dialog.btn = true
				this.$store.dispatch('post', {
					uri: 'regionAssign/addWorker',
					data: {
						regionAssignId: this.ruleForm.regionAssignId,
						workIds: workIds.toString()
					}
				}).then((res) => {
				  var _this = this
					msg.success()
					_this.dialog.visible = false
					_this.dialog.btn = false
					var info = res.data.data || {}

					_this.tableData.list.forEach(function (item) {
						if(info && info.id === item.id){
						  item.workList = tmpMultipleSelection || []
							return false
						}
	        })

					if(typeof (_this.assign.callback) === 'function'){
						_this.assign.callback({regionAssign: info, workList: tmpMultipleSelection})
					}
				})
			},
			handleSelectionChange(val) {
			 this.multipleSelection = val;
		 	},
			// handleCurrentChange (val){
			// 	this.tableData.pageStart = (val-1) * this.tableData.pagination.size
			// 	this.list(this.tableData.pageStart)
			// },
			selectedPersonnel(id){ //获取已选择的人员,并选中
				let a = [], //存储所有中人员，符合已选中的人员 
						tmpWorkList = []; // 存储已选中的人员
				this.tableData.list.forEach(function (item) { //获取已选中人员
					if(id && id === item.id){
						tmpWorkList = item.workList || []
						return false
					}
				})
				this.workShowList.forEach((item1,index)=>{ //筛选已选中人员
					tmpWorkList.forEach(item2=>{
						if(item1.id == item2.workId || item1.id == item2.id){
							a.push(this.workShowList[index])
							return false;
						}
					})
				})
				this.$nextTick(()=>{ //设置已选中状态
					a.forEach(item=>{
							this.$refs.multipleTable.toggleRowSelection(item);
					})
				})
			}
    }
  }
</script>

<style scoped>
	.sender-list-container {
		max-height: 100px;
		overflow-y: scroll;
	}
	.sender-list li {
		float: left;
		margin-right: 15px;
		margin-bottom: 5px;
	}
	.sender-list li img{
		height: 40px;
	}
	/* .aa{
		margin-top: 2400px;
	} */
</style>