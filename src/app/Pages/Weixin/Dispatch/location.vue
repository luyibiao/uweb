<template>
  <div class="ukao-pt-md ukao-padder">
    <div class="ukao-v-loading" v-loading="loading">
      <q-draw :callback="draw" :center="drarMap.center"></q-draw>
    </div>
  </div>
</template>



<script>
  import consts from '@/utils/consts'
  import msg from '@/utils/msg'
  import qDraw from '@/components/Map/QMap/Search'
  export default {
    components :{
      qDraw
    },
    data: function() {
      return {
        loading: true,
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
      this.list()
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
          }
        })
      },
      list(start){
        var _this = this
        this.$store.dispatch('post', {
          uri: 'regionAssign/list',
          data: {
            startRow: start || 0,
            pageSize: consts.PAGE_SIZE
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
            _this.saveRegionAssign(res.data, res.fn)
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

    }
  }
</script>

