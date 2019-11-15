<template>  
</template>
<script>
export default {
  data () {
    return {
      strPath:'',
      type:''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      vm.strPath=from.path;
      vm.type=JSON.stringify(from.query)!=='{}' ? "?type="+from.query.type : "";
      vm.routerFn();
    })
  },
  methods: {
    routerFn(){
      console.log(this.strPath)
      this.$router.replace(this.strPath+this.type);
    }
  }
}
</script>

