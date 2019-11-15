export default {
	path: '/plant',
	component: resolve => require(['@/app/Pages/Plant'], resolve),
  redirect: '/plant/list',
	children: [
		{ 
			path: 'list', 
			component: resolve => require(['@/app/Pages/Plant/list.vue'], resolve),
      meta: {title: '工厂管理'}
		},
    { 
      path: 'info/:id',
      component: resolve => require(['@/app/Pages/Plant/info.vue'], resolve),
      meta: {title: '工厂详情'}
    },
    {
      path: 'station/:id',
      component: resolve => require(['@/app/Pages/Plant/station.vue'], resolve),
      meta: {title: '工位设置'}
    },
    {
      path: 'statistics/:id',
      component: resolve => require(['@/app/Pages/Plant/statistics.vue'], resolve),
      meta: {title: '员工操作统计'}
    },
    { 
      path: 'new', 
      component: resolve => require(['@/app/Pages/Plant/new.vue'], resolve),
      meta: {title: '新建工厂'}
    },
    // {
    //   path: 'bind', 
    //   component: resolve => require(['@/app/Pages/Plant/bind.vue'], resolve)
    // }
	]
}