export default {
  path: '/rfid',
  component: resolve => require(['@/app/Pages/Rfid'], resolve),
  children: [
    {
      path: '/',
      component: resolve => require(['@/app/Pages/Rfid/rfid.vue'], resolve),
      redirect: '/rfid/membership',
      children: [
        {
          path: 'membership',
          component: resolve => require(['@/app/Pages/Rfid/Membership/index.vue'], resolve),
          redirect: 'membership/list',
          children: [
            {
              path: 'list',
              component: resolve => require(['@/app/Pages/Rfid/Membership/list.vue'], resolve)
            },
            {
              path: 'list/:batchId',
              component: resolve => require(['@/app/Pages/Rfid/Membership/list.vue'], resolve)
            },
            {
              path: 'all',
              component: resolve => require(['@/app/Pages/Rfid/Membership/all.vue'], resolve)
            },
            {
              path: 'all/:batchId',
              component: resolve => require(['@/app/Pages/Rfid/Membership/all.vue'], resolve)
            },
            {
              path: 'new',
              component: resolve => require(['@/app/Pages/Rfid/Membership/new.vue'], resolve)
            }
          ]
        },
        {
          path: 'label',
          component: resolve => require(['@/app/Pages/Rfid/Label/index.vue'], resolve),
          redirect: 'label/list',
          children: [
            {
              path: 'list',
              component: resolve => require(['@/app/Pages/Rfid/Label/list.vue'], resolve)
            },
            {
              path: 'all',
              component: resolve => require(['@/app/Pages/Rfid/Label/all.vue'], resolve)
            },
            {
              path: 'all/:batchId',
              component: resolve => require(['@/app/Pages/Rfid/Label/all.vue'], resolve)
            },
            {
              path: 'new',
              component: resolve => require(['@/app/Pages/Rfid/Label/new.vue'], resolve)
            }
          ]
        }
      ]
    }
  ]
}