<template>
	<div>
		<v-subnav class="first-subnav bg-subnav" :sub-nav-list="navList" @changeMenu="change"></v-subnav>
		<v-subnav class="second-subnav" :sub-nav-list="children" v-if="children && children.length > 0"></v-subnav>
	</div>
</template>

<script>
  import auth from '@/utils/auth'
  import vSubnav from '../Common/subnav.vue'
	export default {
    components: {
      vSubnav
    },
    data: function() {
      return {
        children: [],
        navList: []
      }
    },
    methods: {
      initMenu: function () {
        const path = this.$route.path;
        const permission = path.split('/')[1];
        this.navList = auth.getChildMenu(permission);
      },
      change: function(children) {
        this.children = children;
      }
    },
    created: function () {
      this.initMenu();
    }
	}
</script>