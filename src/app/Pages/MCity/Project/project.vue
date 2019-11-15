<template>
	<div class="clearfix" v-loading="loading">
		<div class="sidebar pull-left">
			<v-project-model v-bind:cityId="cityInfo.id"></v-project-model>
		</div>
		<div class="main">
			<div class="project-lists">
				<div>
					<p class="m-l-lg">已启用的项目</p>
					<v-project-content v-bind:project-content="enabledItems" v-if="enabledItems && enabledItems.length > 0"></v-project-content>
				</div>

				<div class="m-t-lg" v-if="disabledItems && disabledItems.length > 0">
					<p class="m-l-lg">未启用的项目</p>
					<v-project-content class="disabled-lists"  v-bind:project-content="disabledItems" ></v-project-content>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import auth from '@/utils/auth'
	import vProjectContent from './project_content.vue'
	import vProjectModel from './project_model.vue'

	export default {
		components: {
			vProjectContent, vProjectModel
		},
		data: function() {
			return {
				loading: true,
				carouselLoading: true,
				cityInfo:{
					id: this.$route.params.cityId,
				},
				enabledItems: [],	//已启用的项目
				disabledItems: [],	//停用
			}
		},
		created () {
		  var _this = this
			_this.queryRepeatCity(function (cnt) {
				if(cnt){
					_this.list()
				}else{
				  _this.initCityBusiness()
        }
      })
    },
		methods: {
			queryRepeatCity(fn) {
				this.$store.dispatch('post', {
					uri : 'mercBusiness/queryRepeatCity',
					data: {
						cityId: this.cityInfo.id
					}
				}).then((res) =>{
					let cnt = res.data.data ? res.data.data : 0
				  this.cityInfo = res.data.city
					this.cityInfo.isClientAdveVal = this.cityInfo.isClientAdve ? true : false
				  if(typeof (fn) === 'function'){
						fn(cnt)
					}
        })
			},
			list (){
				this.$store.dispatch('post', {
					uri : 'mercBusiness/list',
					data: {
						cityId: this.cityInfo.id
					}
				}).then((res) =>{
					let list = res.data.data.list || []
					this.screenList (list)
					this.loading = false
        })
			},
      initCityBusiness (){
        this.$store.dispatch('post', {
          uri : 'mercBusiness/initCity',
          data: {}
        }).then((res) =>{
          let list = res.data.data.list || []
          this.screenList (list)
          this.loading = false
        })
      },
			screenList (list){			//数据拆分
			  var _this = this
			  if(list){
			    var enabledList = [], disabledList = []
			    list.forEach(function (item) {
						if(item.status == 1){
							enabledList.push(item)
						}else if(item.status == 0){
							disabledList.push(item)
						}
          })
					_this.enabledItems = enabledList;
					_this.disabledItems = disabledList;
				}
			}
    }
	}
</script>

<style lang="scss" scoped src="./theme/styles/project.scss">
</style>