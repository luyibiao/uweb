// 概况
export default {
  path: 'dashboard',
  component: resolve => require(['@/app/Pages/Dashboard'], resolve),
  children: [
    {
      path: '/',
      component: resolve => require(['@/app/Pages/Dashboard/dashboard.vue'], resolve),
      meta: {title: '概况'}
    }
  ]
}
