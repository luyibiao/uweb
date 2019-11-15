export default {
  path: '/data',
  component: resolve => require(['@/app/Pages/Data'], resolve),
  children: [
    {
      path: '/',
      component: resolve => require(['@/app/Pages/Data/data.vue'], resolve),
      redirect: '/data/analysis',
      children:[
        {
          path: 'center',
          component: resolve => require(['@/app/Pages/Data/center.vue'], resolve),
          meta: {title: '数据中心'}
        },
        {
          path: 'analysis',
          component: resolve => require(['@/app/Pages/Data/analysis.vue'], resolve),
          meta: {title: '营收分析'}
        },
        {
          path: 'balance',
          component: resolve => require(['@/app/Pages/Data/balance.vue'], resolve),
          meta: {title: '门店统计'}
        },
        {
          path: 'order',
          component: resolve => require(['@/app/Pages/Data/order.vue'], resolve),
          meta: {title: '订单统计'}
        },
        {
          path: 'product',
          component: resolve => require(['@/app/Pages/Data/product.vue'], resolve),
          meta: {title: '衣物统计'}
        },
      ]
    }
  ]
}
