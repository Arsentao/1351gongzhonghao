'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  disableHostCheck: true,
  port: 8080,
  proxyTable: {
    '/apis': {    //将www.exaple.com印射为/apis
      target: "http://192.168.0.153:8186",  // 接口域名
      secure: false,  // 如果是https接口，需要配置这个参数
      changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/apis': ''   //需要rewrite的,
      }
    },
  }
})
