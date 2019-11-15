export default {
  path: '/product',
  component: resolve => require(['@/app/Pages/Product'], resolve),
  children: [
  {
    path: '/',
    component: resolve => require(['@/app/Pages/Product/product.vue'], resolve),
    redirect: '/product/all',
    children: [
    {
      path: 'all',
      component: resolve => require(['@/app/Pages/Product/List/all.vue'], resolve),
      meta: {title: '所有衣物'}
    },
    {
      path: 'detail/:id',
      component: resolve => require(['@/app/Pages/Product/List/detail.vue'], resolve),
      meta: {title: '衣物详情'}
    },
    {
       path: 'batchIn',
       component: resolve => require(['@/app/Pages/Product/BatchIn/index.vue'], resolve),
       children: [{
         path: '/',
         component: resolve => require(['@/app/Pages/Product/BatchIn/list.vue'], resolve),
         meta: {title: '入厂袋号'}
       },{
         path: 'detail/:id',
         component: resolve => require(['@/app/Pages/Product/BatchIn/detail.vue'], resolve),
         meta: {title: '入厂详情'}
       }]
    },
    {
       path: 'batchOut',
       component: resolve => require(['@/app/Pages/Product/BatchOut/index.vue'], resolve),
       children:[{
         path :'/',
         component: resolve => require(['@/app/Pages/Product/BatchOut/list.vue'], resolve),
         meta: {title: '出厂批次'}
       },{
         path: 'detail/:id',
         component: resolve => require(['@/app/Pages/Product/BatchOut/detail.vue'], resolve),
         meta: {title: '出厂详情'}
       }]
    }

    ]
  }]
}