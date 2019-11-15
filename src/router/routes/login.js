import auth from '@/utils/auth'

export default {
  path: 'login',
  component: resolve => require(['@/app/Login'], resolve),
  beforeEnter (to, from, next) {
    if (auth.loggedIn()) {
      next('/')
    } else {
      next()
    }
  },
  children: [
  	{
  		path: '/',
  		component: resolve => require(['@/app/Login/account.vue'], resolve)
  	},
    // {
    //   path: 'scan',
    //   component: resolve => require(['@/app/Login/scan.vue'], resolve)
    // },
  	{
  		path: 'secret',
  		component: resolve => require(['@/app/Login/secret.vue'], resolve)
  	}
  ]
}
