import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/utils/auth'
import Root from '@/app/Root'
import Layout from '@/app/Layout'
import notFound from './routes/notFound'
import home from './routes/home'
import login from './routes/login'
import register from './routes/register'
import logout from './routes/logout'
import weixin from './routes/weixin'
import dashboard from './routes/dashboard'
import client from './routes/client'
import order from './routes/order'
import store from './routes/store'
import data from './routes/data'
import cabinet from './routes/cabinet'
import finance from './routes/finance'
import marketing from './routes/marketing'
import setting from './routes/setting'
import mcity from './routes/mcity'
import mweixin from './routes/mweixin'
import plant from './routes/plant'
import product from './routes/product'
import worker from './routes/worker'
import clothingList from './routes/clothingList'
import shops from './routes/shops'
import stac from './routes/stac'
import transfer from './routes/transfer'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Root,
      children: [
        {
          path: '/',
          component: Layout,
          children: [
            home,
            weixin,
            dashboard,
            client,
            order,
            store,
            data,
            cabinet,
            finance,
            marketing,
            setting,
            mcity,
            mweixin,
            plant,
            product,
            worker,
            shops,
            transfer
          ],
          meta: {
            requiresAuth: true
          }
        },
        login,
        logout,
        // notFound,
        register,
        clothingList,
        stac
      ]
    }
  ]
})

function toNextChk(toPath, next) {
  if (toPath === "/") {
    let menuList = auth.getMenuList();
    let menu = menuList[0];
    let indexPage = menu.requestUrl;
    if ("#"===indexPage) {
      indexPage = menu.children[0].requestUrl;
    }
    next({path: indexPage})
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => {
  if(auth.loggedIn() && to.path ==='/login' && to.query.signCode){
    auth.logout()
    next({
     path: '/login',
     query: {signCode: to.query.signCode}
   })
  }else {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!auth.loggedIn()) {
        next({
          path: '/login',
          query: {redirect: to.fullPath}
        })
      } else {
        toNextChk(to.path, next);
      }
    } else {
      toNextChk(to.path, next);
    }
  }
  let mercInfo = auth.getMercInfo();
  if (mercInfo && to.matched.some(record => record.meta.title)) {
    let mercName = mercInfo.name ? ' - ' + mercInfo.name:'';
    document.title = to.meta.title + mercName;
  } else {
    document.title = '通洗 - 新时代互联网洗涤管理软件';
  }

});

export default router
