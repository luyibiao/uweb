<template>
		<div class="b-a map-container" >
			<iframe id="container" class="map-iframe"
              frameborder="0" width="100%" height="100%"
							:src="map.src">
			</iframe>
		</div>
</template>


<script>
	export default {
		data: function() {
			return {
        map: {
          src: '',
          api: 'http://apis.map.qq.com/tools/poimarker',
          key: 'YLMBZ-7CHCF-T3WJ4-NCHGK-PVHZ3-GDFBV',
          type: '0',
          search: '0',
          referer: 'myapp',
          marker: {
            coord: '39.96554,116.26719'
          }
        }
			}
    },
		created() {
//      this.initMap()
      this.initAMap()
		},
		methods: {
		  initAMap(){

      },
      initMap (){
       const map = this.map
       this.map.src = map.api+'?key='+map.key+'&type='+map.type+'&search='+map.search+'&referer='+map.referer+'&marker=coord:'+map.marker.coord
      },
      getJson(jsonObj, key){
        var eValue = eval('jsonObj.' + key);
        for(var item in jsonObj){
          if(item === key){
            return jsonObj[item]
          }
        }
      }
    }
  }
</script>

<style scoped>
	.map-iframe{
		width: 100%;
		height: 100%;
	}
	.map-container {
		position: fixed;
		top: 120px;
		left: 40px;
		right: 40px;
		bottom: 40px;
		z-index: 10;
	}
</style>