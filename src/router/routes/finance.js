export default {
  path: 'finance',
  component: resolve => require(['@/app/Pages/Finance/finance.vue'], resolve),
  redirect: '/finance/income',
  children: [
    // {
    //   path: 'income',
    //   component: resolve => require(['@/app/Pages/Finance/my_income.vue'], resolve),
    //   meta: {title: '我的收入'}
    // },
    {
      path: 'income',
      component: resolve => require(['@/app/Pages/Finance/income/index.vue'], resolve),
      //redirect: 'receivable/summary',
      children: [
        {
          path: '',
          component: resolve => require(['@/app/Pages/Finance/income/income.vue'], resolve),
          meta: {title: '我的收入'}
        },
        {
          path: 'withdrawal',
          component: resolve => require(['@/app/Pages/Finance/income/withdrawal.vue'], resolve),
          meta: {title: '提现'}
        },
        {
          path: 'withdrawal/edit',
          component: resolve => require(['@/app/Pages/Finance/income/withdrawal_edit.vue'], resolve),
          meta: {title: '设置提现账户'}
        },
        {
          path: 'withdrawal/edit/:id',
          component: resolve => require(['@/app/Pages/Finance/income/withdrawal_edit.vue'], resolve),
          meta: {title: '设置提现账户'}
        },
        {
          path: 'withdrawal/list',
          component: resolve => require(['@/app/Pages/Finance/income/withdrawal_list.vue'], resolve),
          meta: {title: '提现记录'}
        },
        {
          path: 'freeze',
          component: resolve => require(['@/app/Pages/Finance/income/freeze.vue'], resolve),
          meta: {title: '不可用余额'}
        },
        {
          path:'coin',
          component: resolve => require(['@/app/Pages/Finance/income/coin.vue'], resolve),
          meta: { title:'通洗币'}
        }
      ]
    },
    {
      path: 'withdrawal_record',
      component: resolve => require(['@/app/Pages/Finance/withdrawal_record.vue'], resolve),
      meta: {title: '提现记录'}
    },
    {
      path: 'recharge',
      component: resolve => require(['@/app/Pages/Finance/recharge.vue'], resolve),
      meta: {title: '充值'}
    },
    {
      path: 'recharge_record',
      component: resolve => require(['@/app/Pages/Finance/recharge_record.vue'], resolve),
      meta: {title: '充值记录'}
    },
    {
      path: 'trade',
      component: resolve => require(['@/app/Pages/Finance/trade_order/index.vue'], resolve),
      redirect: 'trade/list',
      children: [
        {
          path: 'list',
          component: resolve => require(['@/app/Pages/Finance/trade_order/list.vue'], resolve),
          meta: {title: '交易记录'}
        },
        {
          path: 'settle_record',
          component: resolve => require(['@/app/Pages/Finance/trade_order/settle_record.vue'], resolve),
          meta: {title: '结算记录'}
        },
        {
          path: 'audit_refund',
          component: resolve => require(['@/app/Pages/Finance/trade_order/audit_refund.vue'], resolve),
          meta: {title: '退款申请'}
        },
        {
          path: 'refund',
          component: resolve => require(['@/app/Pages/Finance/trade_order/refund.vue'], resolve),
          meta: {title: '退款记录'}
        }
      ]
    },
    {
      path: 'check',
      component: resolve => require(['@/app/Pages/Finance/check/index.vue'], resolve),
      redirect: 'check/summary',
      children: [
        {
          path: 'summary',
          component: resolve => require(['@/app/Pages/Finance/check/summary.vue'], resolve),
          meta: {title: '账单汇总'}
        },
        {
          path: 'list',
          component: resolve => require(['@/app/Pages/Finance/check/list.vue'], resolve),
          meta: {title: '账单明细'}
        },
        {
          path: 'summary/:settleDate',
          component: resolve => require(['@/app/Pages/Finance/check/detail.vue'], resolve),
          meta: {title: '账单汇总'}
        }
      ]
    },
    {
      path: 'receivable',
      component: resolve => require(['@/app/Pages/Finance/receivable/index.vue'], resolve),
      redirect: 'receivable/summary',
      children: [
        {
          path: 'summary',
          component: resolve => require(['@/app/Pages/Finance/receivable/summary.vue'], resolve),
          meta: {title: '应收汇总'}
        },
        {
          path: 'list',
          component: resolve => require(['@/app/Pages/Finance/receivable/list.vue'], resolve),
          meta: {title: '应收明细'}
        }
      ]
    },
    {
      path:"service_order",
      component: resolve => require(['@/app/Pages/Finance/service_order/index.vue'], resolve),
      redirect: 'service_order/service_market',
      children:[
        {
          path:'service_market',
          component: resolve => require(['@/app/Pages/Finance/service_order/service_market.vue'], resolve),
          meta:{title:'服务市场'}
        },
        {
          path:'my_service',
          component: resolve => require(['@/app/Pages/Finance/service_order/my_service.vue'], resolve),
          meta:{title:'我的服务'}
        },
        {
          path:"buy_record",
          component: resolve => require(['@/app/Pages/Finance/service_order/buy_record.vue'], resolve),
          meta: { title:"订购记录"}
        },
        {
          path:'confirm_single',
          component: resolve => require(['@/app/Pages/Finance/service_order/confirm_single.vue'], resolve),
          meta: { title:"确认订购单" }
        },
        {
          path:'active_code',
          component: resolve => require(['@/app/Pages/Finance/service_order/active_code.vue'], resolve),
          meta: { title:'激活码兑换'}
        },
        {
          path:"order_detail/:seq/:status",
          component: resolve => require(['@/app/Pages/Finance/service_order/order_detail.vue'], resolve),
          meta:{title:"订购单详情"}
        }
      ]
    }
  ]
}
