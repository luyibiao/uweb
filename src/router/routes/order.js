export default {
  path: "/order",
  component: resolve => require(["@/app/Pages/Order"], resolve),
  children: [
    {
      path: "/",
      component: resolve => require(["@/app/Pages/Order/order.vue"], resolve),
      redirect: "/order/overall",
      children: [
        {
          path: "overall",
          component: resolve =>
            require(["@/app/Pages/Order/overall.vue"], resolve),
          meta: { title: "订单概况" }
        },
        {
          path: "add",
          component: resolve =>
            require(["@/app/Pages/Order/Create/index.vue"], resolve),
          redirect: "add/search",
          children: [
            {
              path: "search",
              component: resolve =>
                require(["@/app/Pages/Order/Create/search.vue"], resolve),
              meta: { title: "洗衣下单" }
            }
          ]
        },
        {
          path: "list",
          component: resolve =>
            require(["@/app/Pages/Order/List/index.vue"], resolve),
          redirect: "list/all",
          children: [
            {
              path: "all",
              component: resolve =>
                require(["@/app/Pages/Order/List/all.vue"], resolve),
              meta: { title: "全部订单" }
            },
            {
              path: "weixin",
              component: resolve =>
                require(["@/app/Pages/Order/List/weixin.vue"], resolve),
              meta: { title: "微信订单" }
            },
            {
              path: "store",
              component: resolve =>
                require(["@/app/Pages/Order/List/store.vue"], resolve),
              meta: { title: "门店订单" }
            },
            {
              path: "cabinet",
              component: resolve =>
                require(["@/app/Pages/Order/List/cabinet.vue"], resolve),
              meta: { title: "智柜订单" }
            },
            {
              path: "backstage",
              component: resolve =>
                require(["@/app/Pages/Order/List/backstage.vue"], resolve),
              meta: { title: "后台订单" }
            },
            {
              path: "pos",
              component: resolve =>
                require(["@/app/Pages/Order/List/pos.vue"], resolve),
              meta: { title: "管家订单" }
            },
            {
              path: "detail/:id",
              component: resolve =>
                require(["@/app/Pages/Order/List/detail.vue"], resolve),
              meta: { title: "订单详情" }
            },
            {
              path: "refund/:id",
              component: resolve =>
                require(["@/app/Pages/Order/List/refund.vue"], resolve),
              meta: { title: "退款记录" }
            }
          ]
        },
        {
          path: 'express',
          component: resolve =>
            require(["@/app/Pages/Order/Express/index.vue"], resolve),
          redirect: "express/take",
          children: [
            {
              path: "take",
              component: resolve =>
                require(["@/app/Pages/Order/Express/take_list.vue"], resolve),
              meta: { title: "取件服务商" }
            },
            {
              path: "send",
              component: resolve =>
                require(["@/app/Pages/Order/Express/send_list.vue"], resolve),
              meta: { title: "送件服务商" }
            }
          ]
        },
        {
          path:'map',
          component: resolve =>
            require(["@/app/Pages/Order/Map/index.vue"], resolve),
          redirect: "map/map",
          children: [
            {
              path: "map",
              component: resolve =>
                require(["@/app/Pages/Order/Map/map.vue"], resolve),
              meta: { title: "取送地图" }
            }
          ]
        }
      ]
    }
  ]
};
