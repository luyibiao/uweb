<template>
  <div>
    <el-cascader
      :value="selected"
      :options="options"
      @active-item-change="handleItemChange"
      @change="itemChange"
      :props="props"
    ></el-cascader>
    <!--<p class="text-muted">当会员满足条件时会自动发放上一等级对应的会员卡</p>-->
      </div>
</template>


<script>
  export default {
    props:['callback'],
    data: function() {
      return {
        businessList:[],
        proTypeList:[],
        proList:[],
        select:{
          business:'',
          type:'',
          pro:''
        },
        options:[],
        selected:[],
        props: {
          label: 'label',
          value: 'value',
          children: 'cities'
        },
        ruleForm: {
          name: '',
          businessId:'',
          typeId:'',
          productId:'',
        },
        special:'_@_'  //特殊标识
      }
    },
    mounted () {
      this.queryBusiness()
    },
    methods: {
      setIdPacking(id, index, grade){
        //id index grade级联等级
        return id + this.special + index + this.special + grade
      },
      getIdPacking(idStr){
        return idStr.toString().split(this.special)
      },
      queryBusiness(){
        this.$store.dispatch('post', {
          uri: 'mercBusiness/business/list',
          data: {}
        }).then((res) => {
          var _this = this
          this.businessList = res.data.data || []
          _this.options.push({label:'所有类型可用', value:'-1',cities:[{label:'所有类型可用', value:'-1'}]})
          this.businessList.forEach(function (item, index) {
              _this.options.push({label: item.name , value: _this.setIdPacking(item.businessId, index+1 , 2), cities:[]})
          })
        })
      },
      queryProTypeList(businessId, fn){
        var _this = this
        this.$store.dispatch('post', {
          uri: 'productType/list',
          data: {
            businessId : businessId
          }
        }).then((res) => {
          _this.proTypeList = res.data.data.list || []
           if(typeof (fn) === 'function'){
             var options = []
             options.push({label:'所有类型可用', value:'-1'})
             _this.proTypeList.forEach(function (item, index) {
               options.push({label: item.name , value: _this.setIdPacking(item.id, index +1 , 3)})
             })
             fn(options)
           }
        })
      },
      //暂时不考虑第三级，过于复杂
      queryProList(businessId, typeId, fn){
        var _this = this
        this.$store.dispatch('post', {
          uri: 'productType/list',
          data: {
            businessId : businessId,
            typeId : typeId,
          }
        }).then((res) => {
           this.proList = res.data.data.list || []
          if(typeof (fn) === 'function'){
            var options = []
            options.push({label:'所有类型可用', value:'-1'})
            _this.proList.forEach(function (item, index) {
              options.push({label: item.name, value: item.id})
            })
            fn(options)
          }
        })
      },
      handleItemChange(idStr){
        var _this = this
        var id = _this.getIdPacking(idStr)[0]
        var index = Number(_this.getIdPacking(idStr)[1])
        var grade = _this.getIdPacking(idStr)[2]
        if (grade === '2') {
          _this.queryProTypeList(id, function (options) {
            _this.options[index].cities = options
          })
        }

      },
      itemChange(val){
        var _this = this
        _this.ruleForm.businessId = _this.getIdPacking(val[0])[0]
        if(_this.ruleForm.businessId !== '-1') {
          let index = _this.getIdPacking(val[0])[1]
          _this.ruleForm.name = _this.businessList[index-1].name || ''
          _this.ruleForm.typeId = _this.getIdPacking(val[1])[0]
          if(_this.ruleForm.typeId !== '-1') {
            index = _this.getIdPacking(val[1])[1]
            _this.ruleForm.name += _this.proTypeList[index-1].name || ''
          }else{
            _this.ruleForm.typeId = ''
          }
        }else{
          _this.ruleForm.businessId=''
          _this.ruleForm.name = '通用'
        }

        if(typeof (_this.callback) === 'function'){
           _this.callback(this.ruleForm)
        }
      }
    }
  }
</script>
