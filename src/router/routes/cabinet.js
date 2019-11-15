export default {
  path: '/cabinet',
  component: resolve => require(['@/app/Pages/Cabinet'], resolve),
  children: [
    {
      path: '/',
      component: resolve => require(['@/app/Pages/Cabinet/index2.vue'], resolve),
      redirect: '/cabinet/list',
      children: [
        {
          path: '/',
          component: resolve => require(['@/app/Pages/Cabinet/list/index.vue'], resolve),
          children: [
            { 
              path: 'list',
              component: resolve => require(['@/app/Pages/Cabinet/list/list.vue'], resolve),
            }
          ]
        },
        {
          path: 'price',
          component: resolve => require(['@/app/Pages/Cabinet/price/price.vue'], resolve)
        },
        {
          path: 'setting',
          component: resolve => require(['@/app/Pages/Cabinet/setting/setting.vue'], resolve)
        },{
          path:'worker',
          component: resolve => require(['@/app/Pages/Cabinet/work/index.vue'], resolve),
          redirect: 'worker/list',
          children:[
            {
              path: 'list',
              component: resolve => require(['@/app/Pages/Cabinet/work/list.vue'], resolve)
            },
            {
              path: 'detail/:id',
              component: resolve => require(['@/app/Pages/Cabinet/work/detail.vue'], resolve),
            }
          ]
        }
      ]
    },
    {
      path: '/',
      component: resolve => require(['@/app/Pages/Cabinet/list/info_tab.vue'], resolve),
      redirect: '/cabinet/overall/:id',
      children: [
        {
          path: 'overall/:id',
          component: resolve => require(['@/app/Pages/Cabinet/list/overall.vue'], resolve)
        },
        {
          path: 'detail/:id',
          component: resolve => require(['@/app/Pages/Cabinet/list/detail.vue'], resolve)
        },
        {
          path: 'ads/:id',
          component: resolve => require(['@/app/Pages/Cabinet/list/ads.vue'], resolve)
        },
        {
          path: 'surface/:id',
          component: resolve => require(['@/app/Pages/Cabinet/list/surface.vue'], resolve)
        },
        {
          path: 'function/:id',
          component: resolve => require(['@/app/Pages/Cabinet/list/function.vue'], resolve),
          redirect: 'function/:id/fun',
          children: [
            {
              path: 'fun',
              component: resolve => require(['@/app/Pages/Cabinet/list/fun.vue'], resolve)
            },
            {
              path: 'project',
              component: resolve => require(['@/app/Pages/Cabinet/list/project.vue'], resolve)
            },
            {
              path: 'product',
              component: resolve => require(['@/app/Pages/Cabinet/list/product.vue'], resolve)
            },
          ]
        }
      ]
    }
  ]
}
