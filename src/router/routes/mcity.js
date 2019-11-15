export default {
	path: '/mcity',
	component: resolve => require(['@/app/Pages/MCity'], resolve),
	children: [
		{ 
			path: '/', 
			component: resolve => require(['@/app/Pages/MCity/mcity.vue'], resolve),
			redirect: '/mcity/list',
			children: [
				{
					path: 'list', 
					component: resolve => require(['@/app/Pages/MCity/list.vue'], resolve),
          meta: {title: '城市管理'}
				},
				{
          path: 'add',
          component: resolve => require(['@/app/Pages/MCity/City/city_add.vue'], resolve),
          meta: {title: '添加城市'}
        },
				{
          path: 'detail/:id',
          component: resolve => require(['@/app/Pages/MCity/City/city_detail.vue'], resolve),
          meta: {title: '城市详情'}
        }
			]
		},
	 	{
      path: '/',
      component: resolve => require(['@/app/Pages/MCity/Project/city_tab.vue'], resolve),
      redirect: '/mcity/project/:cityId',
      children: [
        {
          path: 'project/:cityId',
          component: resolve => require(['@/app/Pages/MCity/Project/project.vue'], resolve)
        },
        {
          path: 'project/detail/:cityId/:id',
          component: resolve => require(['@/app/Pages/MCity/Project/project_detail.vue'], resolve)
        },
        {
          path: 'project/products/:cityId/:id',
          component: resolve => require(['@/app/Pages/MCity/Project/project_products.vue'], resolve)
        },
        {
          path: 'project/newproducts/:cityId/:businessId',
          component: resolve => require(['@/app/Pages/MCity/Project/project_newproducts.vue'], resolve)
        },
        {
          path: 'project/products/info/:cityId/:businessId/:id',
          component: resolve => require(['@/app/Pages/MCity/Project/project_products_info.vue'], resolve)
        },
        {
          path: 'mode/:cityId',
          component: resolve => require(['@/app/Pages/MCity/mode.vue'], resolve)
        },
        {
          path: 'carousel/:cityId',
          component: resolve => require(['@/app/Pages/MCity/Carousel/carousel.vue'], resolve)
        },
        {
          path: 'price/:cityId',
          component: resolve => require(['@/app/Pages/MCity/Price/index.vue'], resolve),
          redirect: 'price/:cityId/list',
          children: [
          	{
          		path: 'list',
          		component: resolve => require(['@/app/Pages/MCity/Price/list.vue'], resolve),
          	},
          	{
          		path: 'new',
          		component: resolve => require(['@/app/Pages/MCity/Price/new.vue'], resolve),
          	},
          	{
          		path: 'product/:id',
          		component: resolve => require(['@/app/Pages/MCity/Price/revise.vue'], resolve),
          	},
            {
          		path: 'info/:id',
          		component: resolve => require(['@/app/Pages/MCity/Price/info.vue'], resolve),
          	}
          ]
        },
        {
          path: 'time/:cityId',
          component: resolve => require(['@/app/Pages/MCity/Time/time.vue'], resolve),
          redirect: 'time/:cityId/period',
          children: [
          	{
          		path: 'period',
          		component: resolve => require(['@/app/Pages/MCity/Time/service_time.vue'], resolve),
          	},
          	{
		          path: 'get',
		          component: resolve => require(['@/app/Pages/MCity/Time/service_time_get.vue'], resolve)
		        },
		        {
		          path: 'send',
		          component: resolve => require(['@/app/Pages/MCity/Time/service_time_send.vue'], resolve)
		        }
          ]
        }
      ]
    }
	]
}