<template>
	<div class="add-city">
		<div>
			<el-breadcrumb class="link-back" separator="/">
				<el-breadcrumb-item to="/mcity/list"><i class="el-icon-arrow-left icon-smaller"></i>微信城市</el-breadcrumb-item>
				<el-breadcrumb-item>添加城市</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="city-tree b-a">
			<el-row>
			  <el-col :span="8" class="outer-item b-r">
			  	<ul class="inner-list">
						<li class="inner-item" v-for="item in provinceItems" v-bind:class="{ selected: item.selected }" v-on:click="chooseProvince(item)">
							<div class="clearfix b-a select-item">
								<span class="city" v-text="item.province"></span>
								<i class="icon el-icon-arrow-right pull-right text-xs"></i>
							</div>
						</li>
					</ul>
			  </el-col>
			  <el-col :span="8" class="outer-item b-r">
			  	<ul class="inner-list">
						<li class="inner-item" v-for="item in cityItems" v-bind:class="{ 'is-selected': item.checkedValue }">
							<div class="clearfix b-a select-item">
								<el-checkbox class="city" v-model="item.checkedValue" v-on:change="changeCity(item)"><span v-text="item.city"></span></el-checkbox>
								<i class="icon el-icon-arrow-right pull-right text-xs"></i>
							</div>
						</li>
					</ul>
			  </el-col>
			  <el-col :span="8" class="outer-item">
			  	<ul class="inner-list">
						<li class="inner-item" v-for="item in districtItems" v-bind:class="{ 'is-selected': item.checkedValue }">
							<div class="clearfix b-a select-item">
								<el-checkbox class="city" v-model="item.checkedValue" v-on:change="changeDistrict(item)"><span v-text="item.district"></span></el-checkbox>
								<i class="icon el-icon-arrow-right pull-right text-xs"></i>
							</div>
						</li>
					</ul>
			  </el-col>
			</el-row>
		</div>
		<div class="m-t-lg text-lg"><span class="text-muted m-l-sm m-r-sm">已选定了</span><span class="text-primary" v-text="selectedCity"></span></div>
		<div class="m-t-lg">
			<el-button type="primary" size="small">确定添加</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				selectedCity: '',
				provinceItems: [
				],
				cityItems: [
				],
				districtItems: [
				]
			}
		},
		methods: {
			chooseProvince: function(selectedItem) {
				this.provinceItems.forEach( function (item, index) {
					item.selected = false;
				});
				selectedItem.selected = true;
			},
			changeCity: function(selectedItem) {
				this.cityItems.forEach( function (item, index) {
					if( selectedItem !== item ) {
						item.checkedValue = false;
					}
				});
				this.districtItems.forEach( function (item, index) {
					item.checkedValue = false;
				});
				this.selectedChanged(selectedItem);
			},
			changeDistrict: function(selectedItem) {
				this.districtItems.forEach( function (item, index) {
					if( selectedItem !== item ) {
						item.checkedValue = false;
					}
				});
				this.cityItems.forEach( function (item, index) {
					item.checkedValue = false;
				});
				this.selectedChanged(selectedItem);
			},
			// 已选中城市函数
			selectedChanged: function(item) {
				if (item.checkedValue) {
					this.selectedCity = item.city || item.district;
				} else {
					this.selectedCity = '';
				}
			}
		}
	}
</script>

<style scoped>
	.add-city {
		text-align: center;
	}
	.city-tree {
		width: 800px;
		margin: 50px auto 0;
	}
	.outer-item {
		height: 500px;
		text-align: center;
		padding-top: 30px;
		padding-bottom: 30px;
		overflow: auto;
	}
	.inner-list {
		display: inline-block;
	}
	.inner-item {
		margin-bottom: 20px;
		text-align: left;
	}
	.inner-item.selected .select-item {
		background-color: #8492a6;
		color: #fff;
	}
	.inner-item.is-selected .select-item {
		border-color: #20a0ff;
		color: #20a0ff;
	}
	.select-item {
		width: 160px;
		color: #8492a6;
		position: relative;
		border-radius: 5px;
		background-color: #f4f5f9;
		position: relative;
		overflow: hidden;
		z-index: 1;
	}
	.select-item:hover {
		border-color: #eeeeef;
		background-color: #f4f4f4;
		color: #909090;
	}
	.select-item .city {
		vertical-align: middle;
		line-height: 20px;
		display: block;
		padding: 6px 12px;
	}
	.select-item .city {
		color: #8492a6;
	}
	.inner-item.selected .select-item .city {
		color: #fff;
	}
	.inner-item.is-selected .select-item .city {
		color: #20a0ff;
	}
	.select-item:hover .city {
		color: #909090;
	}
	.select-item .icon {
		vertical-align: middle;
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		line-height: 20px;
		z-index: -1;
	}

</style>
