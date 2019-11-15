export default {
  path: "/marketing",
  component: resolve => require(["@/app/Pages/Marketing"], resolve),
  children: [
    {
      path: "/",
      component: resolve =>
        require(["@/app/Pages/Marketing/marketing.vue"], resolve),
      meta: { title: "营销中心" }
    },
    {
      path: "coupon",
      component: resolve =>
        require(["@/app/Pages/Marketing/coupon/coupon.vue"], resolve),
      redirect: "coupon/get",
      children: [
        {
          path: "get",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/get.vue"], resolve),
          meta: { title: "优惠券" }
        },
        {
          path: "getDetail",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/getDetail.vue"], resolve),
          meta: { title: "优惠券" }
        },
        {
          path: "send",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/send.vue"], resolve),
          meta: { title: "优惠券" }
        },
        {
          path: "nc_rules",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/nc_rules.vue"], resolve),
          meta: { title: "优惠券" }
        },
        {
          path: "nc_record",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/nc_record.vue"], resolve),
          meta: { title: "优惠券" }
        },
        {
          path: "share_rule",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/share_rule.vue"], resolve),
          meta: { title: "优惠券" }
        },
        {
          path: "share_record",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/share_record.vue"], resolve),
          meta: { title: "优惠券" }
        },
        {
          path: "share_record/receive/:couponId",
          component: resolve =>
            require([
              "@/app/Pages/Marketing/coupon/share_receive.vue"
            ], resolve),
          meta: { title: "赠券领取记录" }
        },
        {
          path: "new",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/new.vue"], resolve),
          meta: { title: "优惠券" }
        },
        {
          path: "distribute",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/distribute.vue"], resolve),
          meta: { title: "优惠券" }
        },
        {
          path: "edit",
          component: resolve =>
            require(["@/app/Pages/Marketing/coupon/edit.vue"], resolve),
          meta: { title: "优惠券" }
        }
      ]
    },
    {
      path: "friend",
      component: resolve =>
        require(["@/app/Pages/Marketing/mercFriend/index.vue"], resolve),
      children: [
        {
          path: "list",
          component: resolve =>
            require(["@/app/Pages/Marketing/mercFriend/list.vue"], resolve),
          meta: { title: "友商列表" }
        },
        {
          path: "recruit",
          component: resolve =>
            require(["@/app/Pages/Marketing/mercFriend/recruit.vue"], resolve),
          meta: { title: "招募计划" }
        },
        {
          path: "poster",
          component: resolve =>
            require(["@/app/Pages/Marketing/mercFriend/poster.vue"], resolve),
          meta: { title: "海报管理" }
        },
        {
          path: "set",
          component: resolve =>
            require(["@/app/Pages/Marketing/mercFriend/set.vue"], resolve),
          meta: { title: "友商设置" }
        },
        {
          path: "",
          component: resolve =>
            require(["@/app/Pages/Marketing/mercFriend/detail"], resolve),
          redirect: "*",
          children: [
            {
              path: "detail/:id",
              component: resolve =>
                require([
                  "@/app/Pages/Marketing/mercFriend/detail/detail.vue"
                ], resolve),
              meta: { title: "基本信息" }
            },
            {
              path: "harvest/:id",
              component: resolve =>
                require([
                  "@/app/Pages/Marketing/mercFriend/detail/harvest.vue"
                ], resolve),
              meta: { title: "收成概况" }
            },
            {
              path: "spending/:id",
              component: resolve =>
                require([
                  "@/app/Pages/Marketing/mercFriend/detail/spending.vue"
                ], resolve),
              meta: { title: "收支明细" }
            },
            {
              path: "withdraw/:id",
              component: resolve =>
                require([
                  "@/app/Pages/Marketing/mercFriend/detail/withdraw.vue"
                ], resolve),
              meta: { title: "提现记录" }
            },
            {
              path: "fans/:id",
              component: resolve =>
                require([
                  "@/app/Pages/Marketing/mercFriend/detail/fans.vue"
                ], resolve),
              meta: { title: "加粉列表" }
            },
            {
              path: "profit/:id",
              component: resolve =>
                require([
                  "@/app/Pages/Marketing/mercFriend/detail/profit.vue"
                ], resolve),
              meta: { title: "分润明细" }
            }
          ]
        }
      ]
    },
    {
      path: "recharge",
      component: resolve =>
        require([
          "@/app/Pages/Marketing/rechargeCard/recharge.vue"
        ], resolve),
      redirect: "recharge/list",
      children: [
        {
          path: "list",
          component: resolve =>
            require([
              "@/app/Pages/Marketing/rechargeCard/list.vue"
            ], resolve),
          meta: { title: "充值卡" }
        },
        {
          path: "detail/:id",
          component: resolve =>
            require([
              "@/app/Pages/Marketing/rechargeCard/detail.vue"
            ], resolve),
          meta: { title: "兑换码" }
        },
        {
          path: "add",
          component: resolve =>
            require([
              "@/app/Pages/Marketing/rechargeCard/add.vue"
            ], resolve),
          meta: { title: "创建充值卡" }
        }
      ]
    },
    {
      path: "discountCode",
      component: resolve =>
        require(["@/app/Pages/Marketing/discountCode/index.vue"], resolve),
      redirect: "discountCode/list",
      children: [
        {
          path: "list",
          component: resolve =>
            require(["@/app/Pages/Marketing/discountCode/list.vue"], resolve),
          meta: { title: "优惠码" }
        },
        {
          path: "create",
          component: resolve =>
            require(["@/app/Pages/Marketing/discountCode/create.vue"], resolve),
          meta: { title: "优惠码" }
        },
        {
          path: "codelibrary/:id/:codeType",
          component: resolve =>
            require(["@/app/Pages/Marketing/discountCode/codelibrary.vue"], resolve),
          meta: { title: "优惠码" }
        },
        {
          path: "receive/:status/:id/:codeType",
          component: resolve =>
            require(["@/app/Pages/Marketing/discountCode/receive.vue"], resolve),
          meta: { title: "优惠码" }
        },
        {
          path: "edit/:id",
          component: resolve =>
            require(["@/app/Pages/Marketing/discountCode/edit.vue"], resolve),
          meta: { title: "优惠码" }
        },
        {
          path:'imdata',
          component: resolve =>
          require(["@/app/Pages/Marketing/discountCode/imdata.vue"], resolve),
        meta: { title: "优惠码" }
        },
        {
          path: "imdetail/:id",
          component: resolve =>
            require(["@/app/Pages/Marketing/discountCode/imdetail.vue"], resolve),
          meta: { title: "优惠码" }
        },
      ]
    },
    {
      path: "visitors",
      component: resolve =>
        require(["@/app/Pages/Marketing/visitors/index.vue"], resolve),
      redirect: "visitors/list",
      children: [
        {
          path: "list",
          component: resolve =>
            require(["@/app/Pages/Marketing/visitors/list.vue"], resolve),
          meta: { title: "团卡" }
        },
        {
          path: "all",
          component: resolve =>
            require(["@/app/Pages/Marketing/visitors/all.vue"], resolve),
          meta: { title: "团卡" }
        },
        {
          path: "detail/:id",
          component: resolve =>
            require(["@/app/Pages/Marketing/visitors/detail.vue"], resolve),
          meta: { title: "团卡详情" }
        }
      ]
    },
    {
      path: "store",
      component: resolve =>
        require(["@/app/Pages/Marketing/card/store.vue"], resolve),
      redirect: "store/rule",
      children: [
        {
          path: "rule",
          component: resolve =>
            require(["@/app/Pages/Marketing/card/store_rule.vue"], resolve),
          meta: { title: "门店储值规则" }
        }
      ]
    },
    {
      path: "message",
      component: resolve => require(["@/app/Pages/Marketing/message"], resolve),
      redirect: "message/push",
      children: [
        {
          path: "push",
          component: resolve =>
            require(["@/app/Pages/Marketing/message/push.vue"], resolve),
          meta: { title: "消息推送" }
        },
        {
          path: "recharge",
          component: resolve =>
            require(["@/app/Pages/Marketing/message/recharge.vue"], resolve),
          meta: { title: "短信充值" }
        },
        {
          path: "statistics",
          component: resolve =>
            require(["@/app/Pages/Marketing/message/statistics.vue"], resolve),
          meta: { title: "短信推送统计" }
        },
        {
          path: "weixin",
          component: resolve =>
            require(["@/app/Pages/Marketing/message/weixin.vue"], resolve),
          meta: { title: "微信推送统计" }
        },
        {
          path: "work",
          component: resolve =>
            require(["@/app/Pages/Marketing/message/work.vue"], resolve),
          meta: { title: "微信推送统计" }
        },
        {
          path:"detail/:id",
          component: resolve =>
          require(["@/app/Pages/Marketing/message/detail.vue"], resolve),
          
        }
        // {
        //   path: 'content',
        //   component: resolve => require(['@/app/Pages/Marketing/message/content.vue'], resolve),
        //   meta: { title: '短信内容' },
        // },
      ]
    },
    {
      // 优付卡
      path: "ucard",
      component: resolve => require(["@/app/Pages/Marketing/ucard"], resolve),
      redirect: "ucard/list",
      children: [
        {
          // 优付卡列表
          path: "list",
          component: resolve =>
            require(["@/app/Pages/Marketing/ucard/list"], resolve),
          meta: { title: "优付卡" }
        },
        {
          // 优付卡详情
          path: "detail/:id",
          component: resolve =>
            require(["@/app/Pages/Marketing/ucard/detail"], resolve),
          meta: { title: "优付卡详情" }
        }
      ]
    },
    {
      // RFID标签卡
      path: "mark",
      component: resolve => require(["@/app/Pages/Marketing/mark"], resolve),
      redirect: "mark/list",
      children: [
        {
          // RFID标签卡列表
          path: "list",
          component: resolve =>
            require(["@/app/Pages/Marketing/mark/list"], resolve),
          meta: { title: "RFID标签卡" }
        },
        {
          // RFID标签卡详情
          path: "detail/:markNo",
          component: resolve =>
            require(["@/app/Pages/Marketing/mark/detail"], resolve),
          meta: { title: "RFID标签卡详情" }
        }
      ]
    },
    {
      path: "group",
      component: resolve => require(["@/app/Pages/Marketing/group"], resolve),
      redirect: "group/list",
      children: [
        {
          path: "list",
          component: resolve =>
            require(["@/app/Pages/Marketing/group/list"], resolve),
          meta: { title: "团体客户" }
        },
        {
          path: "detail/:id",
          component: resolve =>
            require(["@/app/Pages/Marketing/group/detail"], resolve),
          meta: { title: "团体客户" }
        },
        {
          path: "new/:id",
          component: resolve =>
            require(["@/app/Pages/Marketing/group/new"], resolve),
          meta: { title: "团体客户" }
        },
        {
          path: "info/:id",
          component: resolve =>
            require(["@/app/Pages/Marketing/group/info"], resolve),
          meta: { title: "团体客户" }
        }
      ]
    },
    {
      // 优惠券礼包
      path: "couponGift",
      component: resolve =>
        require(["@/app/Pages/Marketing/couponGift"], resolve),
      redirect: "couponGift/new",
      children: [
        {
          // 制作优惠券礼包
          path: "new",
          component: resolve =>
            require(["@/app/Pages/Marketing/couponGift/new"], resolve),
          meta: { title: "制作优惠券礼包" }
        },
        {
          // 制作优惠券礼包
          path: "list",
          component: resolve =>
            require(["@/app/Pages/Marketing/couponGift/list"], resolve),
          meta: { title: "礼包列表" }
        },
        {
          // 制作优惠券礼包
          path: "detail",
          component: resolve =>
            require(["@/app/Pages/Marketing/couponGift/detail"], resolve),
          meta: { title: "批次详情" }
        }
      ]
    },
    {
      path: 'code',
      component: resolve => require(['@/app/Pages/Marketing/code'], resolve),
      redirect: 'code/list',
      children: [
        {
          path: 'list',
          component: resolve => require(['@/app/Pages/Marketing/code/list'], resolve),
          meta: { title: '收款码' }
        },
        {
          path: 'record',
          component: resolve => require(['@/app/Pages/Marketing/code/record'], resolve),
          meta: { title: '收款记录' }
        },
        {
          path: 'preferential',
          component: resolve => require(['@/app/Pages/Marketing/code/preferential'], resolve),
          meta: { title: '收款码优惠' }
        },
        {
          path: 'label',
          component: resolve => require(['@/app/Pages/Marketing/code/label'], resolve),
          meta: { title: '标签管理' }
        },
        {
          path: 'statistics',
          component: resolve => require(['@/app/Pages/Marketing/code/statistics'], resolve),
          meta: { title: '收款统计' }
        },
        {
          path: 'create',
          component: resolve => require(['@/app/Pages/Marketing/code/create'], resolve),
          meta: { title: '新建收款码' }
        },
      ]
    },
    {
      path:'serviceShop',
      component: resolve => require(['@/app/Pages/Marketing/serviceShop'], resolve),
      redirect:'serviceShop/service_shop',
      children:[
        {
          path:'service_shop',
          component: resolve => require(['@/app/Pages/Marketing/serviceShop/service_shop'], resolve),
          meta: { title: '服务商' }
        },
        {
          path:'trade_find',
          component: resolve => require(['@/app/Pages/Marketing/serviceShop/trade_find'], resolve),
          meta: { title: '服务商' }
        },
        {
          path:'single',
          component: resolve => require(['@/app/Pages/Marketing/serviceShop/single'], resolve),
          meta: { title: '服务商' }
        },
        {
          path:'detail/:id',
          component: resolve => require(['@/app/Pages/Marketing/serviceShop/detail'], resolve),
          meta: { title: '详情' }
        },
        {
          path:'carriage',
          component: resolve => require(['@/app/Pages/Marketing/serviceShop/carriage'], resolve),
          beforeEnter: (to, from, next) => {
            if(JSON.stringify(to.query)!=="{}"){
              next();
            }
            else{
              next('/marketing/serviceShop/service_shop')
            }
          },
          meta: { title: '取送费' }
        }
      ]
    },
    {
      path: 'subCard',
      component: resolve => require(['@/app/Pages/Marketing/subCard'], resolve),
      redirect:'subCard/buy_record',
      children: [
        {
          path: 'buy_record',
          component: resolve => require(['@/app/Pages/Marketing/subCard/buy_record'], resolve),
          meta: { title: '购买记录' }
        },
        {
          path: 'list',
          component: resolve => require(['@/app/Pages/Marketing/subCard/list'], resolve),
          meta: { title: '次卡列表' }
        }
      ]
    }
  ]
};
