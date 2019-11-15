<template>
	<div>
		<div class="second-nav-list">
			<div class="b-b">
				<v-subnav class="second-subnav bg-subnav" v-bind:subNavList="navList"></v-subnav>
			</div>
		</div>
		<div class="ukao-pt-md ukao-padder">
			<transition name="move" mode="out-in">
				<router-view></router-view>
			</transition>
		</div>
	</div>
</template>

<script>
  import auth from '@/utils/auth'
	import vSubnav from '../../Common/subnav.vue'
	export default {
		components: {
			vSubnav
		},
		data: function() {
			return {
        navList: []
			}
		},
    methods: {
      initMenu: function () {
        const path = this.$route.path;
        const permission = path.split('/')[1];
        this.navList = auth.getChildMenu(permission);
      }
    },
    created: function () {
      this.initMenu();
    }
	}
</script>