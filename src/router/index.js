// 基础
import Vue from 'vue'
import Router from 'vue-router'
import { getUrlKey } from '../util'
import httpRequest from '../util/httpRequest'
// 页面
import index from '@/view/index'
import payResult from '@/view/payResults'
// 支付成功
import paySuccessed from '@/components/paySuccessed'
// 琴侣
import goodsList from '@/view/QLpurchase/goodsList'
import goodsDetails from '@/view/QLpurchase/goodsDetails'
import payment from '@/view/QLpurchase/payment'
import car from '@/view/QLpurchase/shoppingCar'
import order from '@/view/QLpurchase/order'
import address from '@/view/QLpurchase/addressList'
import addAddr from '@/view/QLpurchase/addAddress'
// 个人
import personal from '@/view/personal/personal'
import wallet from '@/view/personal/wallet'
import friends from '@/view/personal/friends'
import myOrders from '@/view/personal/myOrders'
import beStar from '@/view/personal/beStar'
import question from '@/view/personal/question'
// 交流中心
import forum from '@/view/forum/forumCenter'
import postList from '@/view/forum/postList'
import searchPostList from '@/view/forum/searchPostList'
import rewardPostList from '@/view/forum/rewardPostList'
import splendidPostList from '@/view/forum/splendidPostList'
import postDetail from '@/view/forum/postDetail'
import posting from '@/view/forum/posting'
import postComment from '@/view/forum/postComment'
import search from '@/view/forum/forumSearch'

// 页面
import explain from '@/view/customized/explain'
import explain1 from '@/view/customized/explain1'
import customPayment from '@/view/customized/customPayment'
import filesUpload from '@/view/customized/filesUpload'
import customPay from '@/view/customized/customPay'
import video from '@/view/videoShow/video'
import songSearch from '@/view/songSearch/songSearch'
import player from '@/view/songSearch/player'
import songPay from '@/view/songSearch/songPay'
import songCart from '@/view/songSearch/songCart'
import paySuccess from '@/view/songSearch/paySuccess'
import songOrders from '@/view/songSearch/songOrders'
import songOrderList from '@/view/customized/songOrderList'
import orderDetail from '@/view/QLpurchase/orderDetail'
import orderList from '@/view/QLpurchase/orderList'
import token from '@/components/token'
import priceSearch from '@/view/songSearch/priceSearch'
import garden from '@/view/videoShow/garden'
import QA from '@/view/forum/QA'
import gundong from '@/view/forum/gundong'
import knowledge from '@/view/songSearch/knowledge'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/knowledge',
      name: 'knowledge',
      component: knowledge,
      meta: {
        title: '乐谱知识'
      }
    },
    {
      path: '/gundong',
      name: 'gundong',
      component: gundong
    },
    {
      path: '/QA',
      name: 'QA',
      component: QA,
      meta: {
        title: '问询服务'
      }
    },
    {
      path: '/garden',
      name: 'garden',
      component: garden,
      meta: {
        title: '原创音乐'
      }
    },
    {
      path: '/priceSearch',
      name: 'priceSearch',
      component: priceSearch,
      meta: {
        title: '选择类别'
      }
    },
    {
      path: '/token',
      component: token,
    },
    {
      path: '/',
      redirect: '/index' // 重定向
    },
    {
      path: '/index',
      component: index,
      meta: {
        title: '新概念琴唱平台'
      }
    },
    // 曲谱购买-曲谱详情
    {
      path: '/player/:musicId',
      name: 'player',
      component: player,
      meta: {
        title: '曲谱详情'
      }
    },
    // 琴侣-列表
    {
      path: '/goodsList',
      name: 'goodsList',
      component: goodsList,
      meta: {
        title: '琴侣旗舰'
      }
    },
    // 琴侣-详情
    {
      path: '/goodsDetails/:prodId',
      name: 'goodsDetails',
      component: goodsDetails,
      meta: {
        title: '琴侣 —— 商品详情'
      }
    },
    // 琴侣-购物车
    {
      path: '/car',
      name: 'car',
      component: car,
      meta: {
        title: '琴侣 —— 购物车'
      }
    },
    // 琴侣-提交订单
    {
      path: '/order',
      name: 'order',
      component: order,
      meta: {
        title: '琴侣 —— 提交订单'
      }
    },
    // 琴侣-地址列表
    {
      path: '/address',
      name: 'address',
      component: address,
      meta: {
        title: '收货地址'
      }
    },
    // 琴侣-编辑地址
    {
      path: '/addAddr',
      name: 'addAddr',
      component: addAddr,
      meta: {
        title: '编辑收货地址'
      }
    },
    // 琴侣-支付
    {
      path: '/payment',
      name: 'payment',
      component: payment,
      meta: {
        title: '订单支付'
      }
    },
    // 曲谱-支付
    {
      path: '/songPay',
      name: 'songPay',
      component: songPay,
      meta: {
        title: '曲谱 —— 订单支付'
      }
    },
    // 支付成功
    {
      path: '/paySuccessed',
      name: 'paySuccessed',
      component: paySuccessed,
      meta: {
        title: '支付成功'
      }
    },
    // 琴侣-支付失败
    {
      path: '/payResult',
      name: 'payResult',
      component: payResult
    },
    // 曲谱定制-评估完成提醒支付页
    {
      path: '/customPay',
      name: 'customPay',
      component: customPay
    },
    // 交流中心
    {
      path: '/forum',
      name: 'forum',
      component: forum
    },
    // 帖子详情
    {
      path: '/postDetail/:postId',
      name: 'postDetail',
      component: postDetail
    },
    // 帖子列表
    {
      path: '/postList/:postCategoryId',
      name: 'postList',
      component: postList
    },
    // 发帖
    {
      path: '/posting',
      name: 'posting',
      component: posting
    },
    // 发布评论
    {
      path: '/postComment/:postId',
      name: 'postComment',
      component: postComment
    },
    // 论坛悬赏列表
    {
      path: '/rewardPostList/',
      name: 'rewardPostList',
      component: rewardPostList
    },
    // 论坛精华列表
    {
      path: '/splendidPostList/',
      name: 'splendidPostList',
      component: splendidPostList
    },
    // 论坛搜索
    {
      path: '/search',
      name: 'search',
      component: search
    },
    // 论坛搜索列表
    {
      path: '/searchPostList/:keyword',
      name: 'searchPostList',
      component: searchPostList
    },
    // 视频
    {
      path: '/video',
      name: 'video',
      component: video,
      meta: {
        title: '琴侣微漫'
      }
    },

    // 其他页面
    {
      path: '/songSearch',
      name: 'songSearch',
      component: songSearch,
      meta: {
        title: '鸟然谱库'
      }
    },
    {
      path: '/songCart',
      name: 'songCart',
      component: songCart
    },
    {
      path: '/orderDetail/:orderNumber',
      name: 'orderDetail',
      component: orderDetail,
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList,
    },
    {
      path: '/songOrderList',
      name: 'songOrderList',
      component: songOrderList,
      meta: {
        title: '定制订单'
      }
    },
    
    {
      path: '/songOrders',
      name: 'songOrders',
      component: songOrders
    },
    {
      path: '/paySuccess',
      name: 'paySuccess',
      component: paySuccess,
      meta: {
        title: '支付成功'
      }
    },
    {
      path: '/explain',
      name: 'explain',
      component: explain
    },
    {
      path: '/explain1',
      name: 'explain1',
      component: explain1 ,
      meta: {
        title: '用户定制'
      }
    },
    {
      path: '/customPayment',
      name: 'customPayment',
      component: customPayment
    },
    {
      path: '/filesUpload',
      name: 'filesUpload',
      component: filesUpload
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: wallet,
      meta: {
        title: '我的钱包'
      }
    },
    {
      path: '/friends',
      name: 'friends',
      component: friends
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal,
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/myOrders',
      name: 'myOrders',
      component: myOrders,
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/beStar',
      name: 'beStar',
      component: beStar,
      meta: {
        title: '品牌大使'
      }
    },
    {
      path: '/question',
      name: 'question',
      component: question,
      meta: {
        title: '历史提问'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title

  // var { protocol, host, pathname, hash } = window.location
  // var redirectUrl = `${protocol}//${host}${pathname}${hash}`
  var code = getUrlKey('code')
  // window.location.search. = undefined;
  history.replaceState(null, '', location.pathname + location.hash)
  if (title) {
    document.title = title
  }
  if (!code || localStorage.getItem('token')) {
    next()
    return
  }

  httpRequest({
    url: httpRequest.adornUrl('/login?grant_type=weixin_mp'),
    method: 'POST',
    data: httpRequest.adornData({ principal: code })
  }).then(({ data }) => {
    localStorage.setItem('isLogined', true)
    localStorage.setItem('token', data.access_token)
    // 获取用户信息
    localStorage.setItem('userinfo', JSON.stringify(data))
    localStorage.setItem('isAuth', true)
    if (data.enabled != null && data.enabled != undefined && !data.enabled){
      sessionStorage.setItem('forbidden', true)
    }
    next()
  }).catch(() => {

  })
})

export default router
