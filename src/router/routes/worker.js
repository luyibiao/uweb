export default {
  path: '/worker',
  component: resolve => require(['@/app/Pages/Worker/worker.vue'], resolve),
  redirect: '/worker/list',
  children: [
    {
      path: 'list',
      component: resolve => require(['@/app/Pages/Worker/List/list.vue'], resolve),
      meta: { title: '员工管理' }
    },
    {
      path: 'detail',
      component: resolve => require(['@/app/Pages/Worker/Detail/index.vue'], resolve),
      redirect: '*',
      children: [
        {
          path:':id',
          component: resolve => require(['@/app/Pages/Worker/Detail/detail.vue'], resolve),
          meta: { title: '员工详情' },
        },
        {
          path:'/worker/harvest/:id',
          component: resolve => require(['@/app/Pages/Worker/Detail/harvest.vue'], resolve),
          meta: { title: '收成概况' },
        },
        {
          path:'/worker/spending/:id',
          component: resolve => require(['@/app/Pages/Worker/Detail/spending.vue'], resolve),
          meta: { title: '收支明细' },
        },
        {
          path:'/worker/withdraw/:id',
          component: resolve => require(['@/app/Pages/Worker/Detail/withdraw.vue'], resolve),
          meta: { title: '提现记录' },
        },
        {
          path:'/worker/instead/:id',
          component: resolve => require(['@/app/Pages/Worker/Detail/instead.vue'], resolve),
          meta: { title: '代付记录' },
        }
      ],
    },
    {
      path: 'new',
      component: resolve => require(['@/app/Pages/Worker/List/new.vue'], resolve),
      meta: { title: '新建员工' }
    },
    {
      path: 'role',
      redirect: '/worker/role/list',
      component: resolve => require(['@/app/Pages/Worker/Role/index.vue'], resolve),
      children: [
        {
          path: 'list',
          component: resolve => require(['@/app/Pages/Worker/Role/list.vue'], resolve),
          meta: { title: '角色管理' }
        },
        {
          path: 'new',
          component: resolve => require(['@/app/Pages/Worker/Role/edit.vue'], resolve),
          meta: { title: '角色管理' }
        },
        {
          path: 'edit',
          component: resolve => require(['@/app/Pages/Worker/Role/edit.vue'], resolve),
          meta: { title: '角色管理' }
        }
      ]
    }
  ]
}