export default {
  path: '/weixin',
  component: resolve => require(['@/app/Pages/Weixin'], resolve),
  children: [
    {
      path: '/',
      component: resolve => require(['@/app/Pages/Weixin/Project/city_tab.vue'], resolve),
      redirect: '/weixin/project',
      children: [
        {
          path: 'project',
          component: resolve => require(['@/app/Pages/Weixin/Project/project.vue'], resolve),
          meta: {title: '经营项目'}
        },
        {
          path: 'project/detail/:id',
          component: resolve => require(['@/app/Pages/Weixin/Project/project_detail.vue'], resolve),
          meta: {title: '经营项目'}
        },
        {
          path: 'project/products/:id',
          component: resolve => require(['@/app/Pages/Weixin/Project/project_products.vue'], resolve)
        },
        {
          path: 'project/newproducts/:businessId',
          component: resolve => require(['@/app/Pages/Weixin/Project/project_newproducts.vue'], resolve)
        },
        {
          path: 'project/products/info/:businessId/:id',
          component: resolve => require(['@/app/Pages/Weixin/Project/project_products_info.vue'], resolve)
        },
        {
          path: 'mode',
          component: resolve => require(['@/app/Pages/Weixin/mode.vue'], resolve),
          meta: {title: '下单模式'}
        },
        {
          path: 'carousel',
          component: resolve => require(['@/app/Pages/Weixin/Carousel/index.vue'], resolve),
          meta: {title: '轮播图'}
        },
        {
          path: 'price',
          component: resolve => require(['@/app/Pages/Weixin/Price/index.vue'], resolve),
          redirect: 'price/list',
          children: [
            {
              path: 'list',
              component: resolve => require(['@/app/Pages/Weixin/Price/list.vue'], resolve),
              meta: {title: '产品价格'}
            },
            {
              path: 'new',
              component: resolve => require(['@/app/Pages/Weixin/Price/new.vue'], resolve),
              meta: {title: '新建产品'}
            },
            {
              path: 'info/:id',
              component: resolve => require(['@/app/Pages/Weixin/Price/info.vue'], resolve),
              meta: {title: '产品详情'}
            }
          ]
        },
        {
          path: 'time',
          component: resolve => require(['@/app/Pages/Weixin/Time/time.vue'], resolve),
          redirect: 'time/period',
          children: [
            {
              path: 'period',
              component: resolve => require(['@/app/Pages/Weixin/Time/service_time.vue'], resolve),
              meta: {title: '服务时间段'}
            },
            {
              path: 'get',
              component: resolve => require(['@/app/Pages/Weixin/Time/service_time_get.vue'], resolve),
              meta: {title: '取件时间'}
            },
            {
              path: 'send',
              component: resolve => require(['@/app/Pages/Weixin/Time/service_time_send.vue'], resolve),
              meta: {title: '送件时间'}
            }
          ]
        },
        {
          path: 'dispatch',
          // component: resolve => require(['@/app/Pages/Weixin/Dispatch/dispatch.vue'], resolve),
          // meta: {title: '区域派单'}
          component: resolve => require(['@/app/Pages/Weixin/Dispatch/index.vue'], resolve),
         redirect: "dispatch/dispatch",
         children:[
          {
            path:'dispatch',
            component: resolve => require(['@/app/Pages/Weixin/Dispatch/dispatch.vue'], resolve),
            meta: { title: "取送区域" }
          },
          {
            path: 'location',
            component: resolve => require(['@/app/Pages/Weixin/Dispatch/location.vue'], resolve),
            meta: {title: '地址查找'}
          },
          {
            path:'message',
            component: resolve => require(['@/app/Pages/Weixin/Dispatch/message.vue'], resolve),
            meta: { title: "区域提示" }
          }
         ]
        },
        {
          path: 'carriage',
          component: resolve => require(['@/app/Pages/Weixin/Carriage/carriage.vue'], resolve),
          meta: {title: '取送费'}
        },
        {
          path: 'cancel',
          component: resolve => require(['@/app/Pages/Weixin/Carriage/cancel.vue'], resolve),
          meta: {title: '取送费'}
        },
        {
          path: 'store_rule',
          component: resolve => require(['@/app/Pages/Weixin/Card/store_rule.vue'], resolve),
          meta: {title: '微信储值规则'}
        },
        {
          path: 'store_record',
          component: resolve => require(['@/app/Pages/Weixin/Card/store_record.vue'], resolve),
          meta: {title: '储值记录'}
        }
      ]
    }
  ]
}