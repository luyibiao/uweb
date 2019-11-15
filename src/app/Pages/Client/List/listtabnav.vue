<template>
	<div>
		<vDetail v-bind:id="id" style="margin-bottom:20px;" v-bind:currentKey="navKey"></vDetail>
		<v-tab-nav2 v-bind:tab-nav-list="tabsNavList" v-bind:akey="navKey"></v-tab-nav2>
	</div>
</template>

<script>
	import vTabNav2 from '../../Common/tabnav2.vue';
	import vDetail from '@/app/Pages/Client/List/userdetail';
	export default {
		components: {
			vTabNav2,vDetail
		},
		props: ['navKey'],
		data: function() {
		  let id = this.$route.params.id;
			return {
				id:this.$route.params.id,
				tabsNavList: [
					{ text: '基本信息', index: '/client/list/'+id+'/basic', key: '1' },
					{ text: '常用地址', index: '/client/list/'+id+'/address', key: '2' },
					{ text: '消费记录',  index: '/client/list/'+id+'/consump', key: '3' },
					{ text: '充值记录',  index: '/client/list/'+id+'/recharge', key: '4' },
					{ text: '订单', index: '/client/list/'+id+'/order', key: '5' },
					{ text: '优惠券',  index: '/client/list/'+id+'/coupon', key: '6' },
					{ text: '退卡记录',  index: '/client/list/'+id+'/refund', key: '7' },
					{ text: '意见反馈',  index: '/client/list/'+id+'/feedback', key: '8' },
					{ text: '余额明细',  index: '/client/list/'+id+'/tradeuser', key: '9' },
					{ text: '通洗卡交易记录',  index: '/client/list/'+id+'/txtrade', key: '10' }
				],
			}
		},
	}
</script>