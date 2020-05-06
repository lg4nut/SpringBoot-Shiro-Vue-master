import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard', component: _import('dashboard/index')
    }]
  }
]
export const asyncRouterMap = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/article',
    name: '功能模块',
    meta: {title: '功能模块', icon: 'tree'},
    children: [
      {
        path: 'article',
        name: '文章',
        component: _import('article/article'),
        meta: {title: '文章', icon: 'example'},
        menu: 'article'
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/',
    name: '',
    meta: {title: '基础管理', icon: 'table'},
    children: [
      {
        path: '', name: '机构列表', component: _import('user/user'), meta: {title: '机构列表', icon: 'user'}, menu: 'user'
      },
      {
        path: 'role',
        name: '权限管理',
        component: _import('user/role'),
        meta: {title: '权限管理', icon: 'password'},
        menu: 'role'
      },
      {
        path: 'job',
        name: '指标管理',
        component: _import('user/job'),
        meta: {title: '指标管理', icon: 'table'},
        menu: 'job'
      },
      {
        path: 'step',
        name: 'step',
        component: _import('user/step'),
        meta: {title: 'step', icon: 'table'},
        menu: 'job'
      }
    ]
  },
  {
    path: '/bank',
    component: Layout,
    redirect: '/bank/creditcard',
    name: '',
    meta: {title: '银行', icon: 'table'},
    children: [
      {
        path: '', name: '信用卡', component: _import('creditcard/creditcard'), meta: {title: '信用卡', icon: 'eye'}, menu: 'creditcard'
      },
      {
        path: 'role',
        name: '本外币存款',
        component: _import('creditcard/creditcard'),
        meta: {title: '本外币存款', icon: 'table'},
        menu: 'role'
      },
      {
        path: 'role',
        name: '信贷',
        component: _import('creditcard/creditcard'),
        meta: {title: '信贷', icon: 'table'},
        menu: 'role'
      },
    ]
  },
  {path:'/insurance',
    children: [
      {
        path: '',
        name: '保险',
        component: _import('article/article'),
        meta: {title: '保险', icon: 'user'},
        menu: 'article'
      }
    ]},

  {path: '*', redirect: '/404', hidden: true}
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
