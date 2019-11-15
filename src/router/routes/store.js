export default {
  path: '/store',
  component: resolve => require(['@/app/Pages/Store'], resolve),
  children: [
    {
      path: '/',
      component: resolve => require(['@/app/Pages/Store/store.vue'], resolve),
      redirect: '/store/list',
      children: [
        {
          path: 'list',
          component: resolve => require(['@/app/Pages/Store/list.vue'], resolve),
          meta: {title: '门店列表'}
        },
        {
          path: 'new_store',
          component: resolve => require(['@/app/Pages/Store/new_store.vue'], resolve),
          meta: {title: '新建门店'}
        },
        {
          path: 'info/:id',
          component: resolve => require(['@/app/Pages/Store/info.vue'], resolve),
          meta: {title: '门店详情'}
        },
        {
          path: 'price',
          component: resolve => require(['@/app/Pages/Store/price.vue'], resolve),
          meta: {title: '产品价格'}
        },
        {
          path: 'new_price',
          component: resolve => require(['@/app/Pages/Store/new_price.vue'], resolve),
          meta: {title: '新建产品'}
        },
        {
          path: 'price_info/:id',
          component: resolve => require(['@/app/Pages/Store/price_info.vue'], resolve),
          meta: {title: '产品详情'}
        },
        {
          path: 'shelf',
          component: resolve => require(['@/app/Pages/Store/shelf.vue'], resolve),
          meta: {title: '上架号'}
        },
        // {
        //   path: 'casher_register',
        //   component: resolve => require(['@/app/Pages/Store/casher_register.vue'], resolve)
        // }
      ]
    }
  ]
}
