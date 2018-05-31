//app.js
const config = require('config');
const localStorage = require('./utils/localStorage');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //openId有则说明这个微信已经有了该数据，不再次请求login
    var openId = localStorage.getStorageSync(config.kopenId);
    if (!(openId == undefined || openId == '' || openId == null)) {
      return;
    }
    //第一次打开初始增加一个空的DevId用于请求
    wx.setStorageSync(config.kdevId, '');
  },
  globalData: {
    userInfo: null,
  },
})
