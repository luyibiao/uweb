<template>
<div>
	<div class="text-right"><el-button type="primary">同步更新</el-button></div>
  <div class="ukao-sc-layout m-t clearfix">
  	<div class="sidebar">
  		<img class="sidebar-bg" src="/static/img/cabinet/sc_ad001.png" alt="">
  		<p class="text-center m-t-sm">智能柜界面预览</p>
  	</div>
  	<div class="mainbar">
  		<ul class="mainbar-ad-list clearfix">
  			<li v-for="item in adList">
  				<div class="mainbar-ad-item">
  					<img class="ad" :src="'/static/img/cabinet/'+item.src" alt="">
  					<p class="clearfix">
  						<span v-if="item.state" class="pull-right text-success">已同步</span>
  						<span v-else class="text-muted">未同步</span>
  						{{item.num}}
  					</p>
  				</div>
  			</li>
  		</ul>
  	</div>
  </div>
</div>
</template>

<script>
	export default {
		data() {
			return {
				adList: [
					{ num: 1, state: true, src: 'sc_ad001.png'},
					{ num: 2, state: false, src: 'sc_ad001.png'},
					{ num: 3, state: true, src: 'sc_ad001.png'},
					{ num: 4, state: true, src: 'sc_ad001.png'},
					{ num: 5, state: true, src: 'sc_ad001.png'},
					{ num: 6, state: true, src: 'sc_ad001.png'},
					{ num: 7, state: false, src: 'sc_ad001.png'},
					{ num: 8, state: false, src: 'sc_ad001.png'}
				]
			}
		}
	}
</script>

<style scoped>
	.ukao-sc-layout .mainbar-ad-list li {
		float: left;
		margin-right: 50px;
		margin-bottom: 20px;
	}
	.ukao-sc-layout .mainbar-ad-item .ad {
		width: 160px;
		height: auto;
	}
</style>