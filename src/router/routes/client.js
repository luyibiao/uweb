export default {
  path: "/client",
  component: resolve => require(["@/app/Pages/Client"], resolve),
  children: [
    {
      path: "/",
      component: resolve => require(["@/app/Pages/Client/client.vue"], resolve),
      redirect: "/client/overall",
      children: [
        {
          path: "overall",
          component: resolve =>
            require(["@/app/Pages/Client/overall.vue"], resolve),
          meta: { title: "客户概览" }
        },
        {
          path: "list",
          component: resolve =>
            require(["@/app/Pages/Client/List/index.vue"], resolve),
          redirect: "list/all",
          children: [
            {
              path: "all",
              component: resolve =>
                require(["@/app/Pages/Client/List/all.vue"], resolve),
              meta: { title: "所有客户" }
            },
            {
              path: "add",
              component: resolve =>
                require(["@/app/Pages/Client/List/useradd.vue"], resolve),
              meta: { title: "添加客户" }
            },
            {
              path: ":id/address",
              component: resolve =>
                require(["@/app/Pages/Client/List/address.vue"], resolve),
              meta: { title: "客户详情" }
            },
            {
              path: ":id/basic",
              component: resolve =>
                require(["@/app/Pages/Client/List/basic.vue"], resolve),
              meta: { title: "客户详情" }
            },
            {
              path: ":id/recharge",
              component: resolve =>
                require(["@/app/Pages/Client/List/recharge.vue"], resolve),
              meta: { title: "客户详情" }
            },
            {
              path: ":id/consump",
              component: resolve =>
                require(["@/app/Pages/Client/List/consump.vue"], resolve),
              meta: { title: "客户详情" }
            },
            {
              path: ":id/order",
              component: resolve =>
                require(["@/app/Pages/Client/List/order.vue"], resolve),
              meta: { title: "客户详情" }
            },
            {
              path: ":id/coupon",
              component: resolve =>
                require(["@/app/Pages/Client/List/coupon.vue"], resolve),
              meta: { title: "客户详情" }
            },
            {
              path: ":id/refund",
              component: resolve =>
                require(["@/app/Pages/Client/List/refund.vue"], resolve),
              meta: { title: "客户详情" }
            },
            {
              path: ":id/feedback",
              component: resolve =>
                require(["@/app/Pages/Client/List/feedback.vue"], resolve),
              meta: { title: "客户反馈" }
            },
            {
              path: ":id/txtrade",
              component: resolve =>
                require(["@/app/Pages/Client/List/txtrade.vue"], resolve),
              meta: { title: "通洗卡交易记录" }
            },
            {
              path: ":id/tradeuser",
              component: resolve =>
                require(["@/app/Pages/Client/List/tradeuser.vue"], resolve),
              meta: { title: "余额明细" }
            }
          ]
        },
        {
          path: "group",
          component: resolve =>
            require(["@/app/Pages/Client/group.vue"], resolve),
          meta: { title: "分组管理" }
        },
        {
          path: "label",
          component: resolve =>
            require(["@/app/Pages/Client/label.vue"], resolve),
          meta: { title: "标签管理" }
        },
        {
          path: "card",
          component: resolve =>
            require(["@/app/Pages/Client/Card/index.vue"], resolve),
          redirect: "card/manage",
          children: [
            {
              path: "manage",
              component: resolve =>
                require(["@/app/Pages/Client/Card/manage.vue"], resolve),
              meta: { title: "会员卡管理" }
            },
            {
              path: "get",
              component: resolve =>
                require(["@/app/Pages/Client/Card/get.vue"], resolve),
              meta: { title: "领取记录" }
            },
            {
              path: "refund",
              component: resolve =>
                require(["@/app/Pages/Client/Card/refund.vue"], resolve),
              meta: { title: "退卡记录" }
            },
            {
              path: "new",
              component: resolve =>
                require(["@/app/Pages/Client/Card/new.vue"], resolve),
              meta: { title: "创建会员卡" }
            },
            {
              path: ":id/edit",
              component: resolve =>
                require(["@/app/Pages/Client/Card/edit.vue"], resolve),
              meta: { title: "编辑会员卡" }
            }
          ]
        },
        {
          path: "import",
          component: resolve =>
            require(["@/app/Pages/Client/Import/index.vue"], resolve),
          redirect: "import/list",
          children: [
            {
              path: "list",
              component: resolve =>
                require(["@/app/Pages/Client/Import/list.vue"], resolve),
              meta: { title: "客户列表" }
            },
            {
              path: "detail/:id",
              component: resolve =>
                require(["@/app/Pages/Client/Import/detail.vue"], resolve),
              meta: { title: "导入详情" }
            },
            {
              path: "create",
              component: resolve =>
                require(["@/app/Pages/Client/Import/create.vue"], resolve),
              meta: { title: "批量导入" }
            }
          ]
        },
        {
          path: "recharge",
          component: resolve =>
            require(["@/app/Pages/Client/Recharge/index.vue"], resolve),
          redirect: "recharge/search",
          children: [
            {
              path: "search",
              component: resolve =>
                require(["@/app/Pages/Client/Recharge/search.vue"], resolve),
              meta: { title: "批量充值" }
            },
            {
              path: "add/:wkPhone",
              component: resolve =>
                require(["@/app/Pages/Client/Recharge/add.vue"], resolve),
              meta: { title: "添加用户" }
            }
          ]
        }
      ]
    }
  ]
};
