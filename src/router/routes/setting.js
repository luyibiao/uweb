export default {
  path: "/setting",
  component: resolve => require(["@/app/Pages/Setting"], resolve),
  children: [
    {
      path: "/",
      component: resolve =>
        require(["@/app/Pages/Setting/setting.vue"], resolve),
      redirect: "/setting/account",
      children: [
        {
          path: "account",
          component: resolve =>
            require(["@/app/Pages/Setting/Account/index.vue"], resolve),
          redirect: "account/basic",
          children: [
            {
              path: "basic",
              component: resolve =>
                require(["@/app/Pages/Setting/Account/account.vue"], resolve),
              meta: { title: "基本设置" }
            },
            {
              path: "agent",
              component: resolve =>
                require(["@/app/Pages/Setting/Account/agent.vue"], resolve)
            },
            {
              path: "safe",
              component: resolve =>
                require(["@/app/Pages/Setting/Account/safe.vue"], resolve),
              meta: { title: "安全设置" }
            },
            {
              path: "authorize",
              component: resolve =>
                require(["@/app/Pages/Setting/Account/authorize.vue"], resolve),
              meta: { title: "账号授权" }
            },
            {
              path:'invite',
              component: resolve =>
              require(["@/app/Pages/Setting/Account/invite.vue"], resolve),
              meta:{title:'邀请奖励'}
            },
            {
              path:'merc_auth',
              component: resolve =>
                require(["@/app/Pages/Setting/Account/merc_auth.vue"], resolve),
              meta:{title:'商家认证'}
            }
          ]
        },
        {
          path: "public",
          component: resolve =>
            require(["@/app/Pages/Setting/Public/index.vue"], resolve),
          redirect: "public/data",
          children: [
            {
              path: "data",
              component: resolve =>
                require(["@/app/Pages/Setting/Public/data.vue"], resolve),
              redirect: "data/project",
              children: [
                {
                  path: "project",
                  component: resolve =>
                    require([
                      "@/app/Pages/Setting/Public/project.vue"
                    ], resolve),
                  meta: { title: "经营项目" }
                },
                {
                  path: "category",
                  component: resolve =>
                    require([
                      "@/app/Pages/Setting/Public/category.vue"
                    ], resolve),
                  meta: { title: "产品类别" }
                },
                {
                  path: "color",
                  component: resolve =>
                    require(["@/app/Pages/Setting/Public/color.vue"], resolve),
                  meta: { title: "产品颜色" }
                },
                {
                  path: "flaw",
                  component: resolve =>
                    require(["@/app/Pages/Setting/Public/flaw.vue"], resolve),
                  meta: { title: "产品瑕疵" }
                },
                {
                  path: "effect",
                  component: resolve =>
                    require(["@/app/Pages/Setting/Public/effect.vue"], resolve),
                  meta: { title: "预计效果" }
                },
                {
                  path: "service",
                  component: resolve =>
                    require([
                      "@/app/Pages/Setting/Public/service.vue"
                    ], resolve),
                  meta: { title: "服务项" }
                },
                {
                  path: "brand",
                  component: resolve =>
                    require(["@/app/Pages/Setting/Public/brand.vue"], resolve),
                  meta: { title: "产品品牌" }
                },
                {
                  path: "attachment",
                  component: resolve =>
                    require([
                      "@/app/Pages/Setting/Public/attachment.vue"
                    ], resolve),
                  meta: { title: "衣物附件" }
                },
                {
                  path: "additional_service",
                  component: resolve =>
                    require([
                      "@/app/Pages/Setting/Public/additional_service.vue"
                    ], resolve),
                  meta: { title: "附加服务" }
                }
              ]
            },
            {
              path: "record",
              component: resolve =>
                require(["@/app/Pages/Setting/Public/record.vue"], resolve),
              meta: { title: "添加记录" }
            }
          ]
        },
        {
          path: "copy",
          component: resolve =>
            require(["@/app/Pages/Setting/Copy/copy.vue"], resolve),
          meta: { title: "拷贝数据" }
        },
        {
          path: "payment",
          component: resolve =>
            require(["@/app/Pages/Setting/Payment/payment.vue"], resolve),
          meta: { title: "支付/交易" }
        },
        {
          path: "parameter",
          component: resolve =>
            require(["@/app/Pages/Setting/Parameter/index.vue"], resolve),
          redirect: "parameter/amount",
          children: [
            {
              path: "amount",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/amount.vue"], resolve),
              meta: { title: "参数设置" }
            },
            {
              path: "clothing_photo",
              component: resolve =>
                require([
                  "@/app/Pages/Setting/Parameter/clothing_photo.vue"
                ], resolve),
              meta: { title: "衣物照片设置" }
            },
            {
              path: "add_card_user",
              component: resolve =>
                require([
                  "@/app/Pages/Setting/Parameter/add_card_user.vue"
                ], resolve),
              meta: { title: "新建会员设置" }
            },
            {
              path: "clothing_price",
              component: resolve =>
                require([
                  "@/app/Pages/Setting/Parameter/clothing_price.vue"
                ], resolve),
              meta: { title: "衣物价格设置" }
            },
            {
              path: "refund",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/refund.vue"], resolve),
              meta: { title: "退款设置" }
            },
            {
              path: "aide",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/aide.vue"], resolve),
              meta: { title: "通洗管家" }
            },
            {
              path: "shops",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/shops.vue"], resolve),
              meta: { title: "商城" }
            },
            {
              path: "ucard",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/ucard.vue"], resolve),
              meta: { title: "优付卡设置" }
            },
            {
              path: "process",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/process.vue"], resolve),
              meta: { title: "流程设置" }
            },
            {
              path: "wxshop",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/wx_shop.vue"], resolve),
              meta: { title: "微信店铺" }
            },
            {
              path: "other",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/other.vue"], resolve),
              meta: { title: "提现设置" }
            },
            {
              path: "print",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/print.vue"], resolve),
              meta: { title: "打印设置" }
            },
            {
              path: "protocol",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/protocol.vue"], resolve),
              meta: {title: "服务协议设置"}
            },
            {
              path: "recharge_setting",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/recharge_setting.vue"], resolve),
              meta: {title: "零散充值设置"}
            },
            {
              path: "show_all_user",
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/show_all_user.vue"], resolve),
              meta: {title: "店员查看客户权限"}
            },
            {
              path:'cash_control',
              component: resolve =>
              require(["@/app/Pages/Setting/Parameter/cash.vue"], resolve),
            meta: {title: "收银机功能控制"}
            },
            {
              path: 'vip_price',
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/vip_price.vue"], resolve),
              meta: {title: "会员价设置"}
            },
            {
              path: 'profits',
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/profits.vue"], resolve),
              meta: {title: "员工提成设置"}
            },
            {
              path: 'order_assign',
              component: resolve =>
                require(["@/app/Pages/Setting/Parameter/order_assign.vue"], resolve),
              meta: {title: "订单指派设置"}
            }
          ]
        },
        {
          path:'mytask',
          component:resolve=>require(["@/app/Pages/Setting/Mytask/task_complete.vue"],resolve),
          meta:{title:'我的任务'}
        }
      ]
    }
  ]
};
