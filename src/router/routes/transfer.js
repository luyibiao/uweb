export default{
  path:'/transfer',
  component: resolve => require(['@/app/Pages/Transfer'], resolve),
  // redirect: '/transfer/list',
  children:[
    {
      path:'/',
      component: resolve => require(['@/app/Pages/Transfer/list.vue'], resolve),
    },
    {
      path:'detail',
      component: resolve => require(['@/app/Pages/Transfer/detail.vue'], resolve),
    }
  ]
}