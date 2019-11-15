export default {
	path: '/mweixin',
	component: resolve => require(['@/app/Pages/MWeixin'], resolve),
	children: [
		{ 
			path: '/', 
			component: resolve => require(['@/app/Pages/MWeixin/mweixin.vue'], resolve),
			redirect: '/mweixin/message',
      children: [
        {
          path: 'message', 
          component: resolve => require(['@/app/Pages/MWeixin/message.vue'], resolve),
          meta: {title: '实时消息'}
        },
        {
          path: 'reply', 
          component: resolve => require(['@/app/Pages/MWeixin/reply.vue'], resolve),
          meta: {title: '自动回复'}
        },
        {
          path: 'account', 
          component: resolve => require(['@/app/Pages/MWeixin/account.vue'], resolve),
          meta: {title: '公众号绑定'}
        },
        {
          path: 'wxapp',
          component: resolve => require(['@/app/Pages/MWeixin/wxapp.vue'], resolve),
          meta: {title: '微信小程序'}
        },
        {
          path: 'menu', 
          component: resolve => require(['@/app/Pages/MWeixin/menu.vue'], resolve),
          meta: {title: '自定义菜单'}
        },
        {
          path: 'material', 
          component: resolve => require(['@/app/Pages/MWeixin/material.vue'], resolve),
          redirect: 'material/list',
          children: [
            {
              path: 'list', 
              component: resolve => require(['@/app/Pages/MWeixin/list.vue'], resolve),
              meta: {title: '素材管理'}
            },
            {
              path: 'new', 
              component: resolve => require(['@/app/Pages/MWeixin/new.vue'], resolve),
              meta: {title: '新建素材'}
            }
          ]
        },
      ]
		}
	]
}