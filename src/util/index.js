
/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  localStorage.removeItem('token')
  localStorage.removeItem('userinfo')
  localStorage.removeItem('isLogined')
  localStorage.removeItem('isAuth')
  sessionStorage.removeItem('forbidden')
}

/**
 * 获取链接上对应的参数
 */
export function getUrlKey (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ['', ''])[1].replace(/\+/g, '%20')) || null
}

