import axios from 'axios'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/util'
import { Toast } from 'vant'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

export const httpupload = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'bearer' + localStorage.getItem('token')
  }
})

/** 跳转到微信授权登录 */
export function redirectLogin () {
  clearLoginInfo()
  var scope = 'snsapi_userinfo'
  if (localStorage.getItem('isAuth')) {
    scope = 'snsapi_base'
  }
  var { protocol, host, pathname, hash } = window.location
  var redirectUrl = `${protocol}//${host}${pathname}${hash}`

  var appId = process.env.APPID
  window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=' + scope + '#wechat_redirect'
}

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  var forbidden = sessionStorage.getItem('forbidden');
  if(forbidden){
    Toast('您已被禁用，无法进行相关操作，请联系客服')
    return
  }
  if (localStorage.getItem('isLogined')) {
    config.headers['Authorization'] = 'bearer' + localStorage.getItem('token') // 请求头带上token
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  return response
}, error => {
  if (!error.response) {
    return Promise.reject(error)
  }
  switch (error.response.status) {
    case 400:
      Toast(error.response.data)
      break
    case 401:
      redirectLogin()
      break
    case 405:
      Toast('http请求方式有误')
      break
    case 500:
      Toast('服务器出了点小差，请稍后再试')
      break
    case 501:
      Toast('服务器不支持当前请求所需要的某个功能')
      break
    default:
      Toast('服务器出了点小差，请稍后再试')
  }
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  return (process.env.NODE_ENV === 'production' ? process.env.HOST : '') + '/apis' + actionName
  // return "http://www.13511351.com:8089"+actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : data
}

export default http
