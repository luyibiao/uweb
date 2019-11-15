export default {
  path: '/shops',
  component: resolve => require(['@/app/Pages/Shops'], resolve),
  redirect: '/shops/list',
  children: [
    { path: 'list', component: resolve => require(['@/app/Pages/Shops/list'], resolve), meta: { title: '商品管理' } },
    { path: 'group', component: resolve => require(['@/app/Pages/Shops/group'], resolve), meta: { title: '商品分组' } },
    { path: 'create', component: resolve => require(['@/app/Pages/Shops/edit'], resolve), meta: { title: '发布商品' } },
    { path: 'edit/:id', component: resolve => require(['@/app/Pages/Shops/edit'], resolve), meta: { title: '编辑商品' } },
    { path: 'order', component: resolve => require(['@/app/Pages/Shops/order'], resolve), meta: { title: '订单管理' } },
    { path: 'order/detail/:id', component: resolve => require(['@/app/Pages/Shops/detail'], resolve), meta: { title: '订单管理' } },
    { path: 'coupon', component: resolve => require(['@/app/Pages/Shops/coupon/list'], resolve), meta: { title: '礼券列表' } },
    { path: 'coupon/library/:id', component: resolve => require(['@/app/Pages/Shops/coupon/library'], resolve), meta: { title: '礼券' } },
    { path: 'coupon/edit/:id', component: resolve => require(['@/app/Pages/Shops/coupon/edit'], resolve), meta: { title: '编辑礼券' } },
    { path: 'coupon/create', component: resolve => require(['@/app/Pages/Shops/coupon/edit'], resolve), meta: { title: '创建礼券' } },
    { path: 'cardCoupon', component: resolve => require(['@/app/Pages/Shops/card_coupon'], resolve), meta: { title: '卡券列表' } },
  ]
}