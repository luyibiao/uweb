export default {
  path: 'register',
  component: resolve => require(['@/app/Register/index.vue'], resolve),
  // redirect: '/register/create',
  // children: [
  // 	{
  // 		path: 'create',
  // 		component: resolve => require(['@/app/Register/create.vue'], resolve)
  // 	},
  // 	{
  // 		path: 'bind',
  // 		component: resolve => require(['@/app/Register/bind.vue'], resolve)
  // 	},
  // 	{
  // 		path: 'brand',
  // 		component: resolve => require(['@/app/Register/brand.vue'], resolve)
  // 	},
  // 	{
  // 		path: 'invite',
  // 		component: resolve => require(['@/app/Register/invite.vue'], resolve)
  // 	},
  // 	{
  // 		path: 'success',
  // 		component: resolve => require(['@/app/Register/success.vue'], resolve)
  // 	}
  // ]
}
