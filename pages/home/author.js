const api = require('../../utils/api.js')
const localStorage = require('../../utils/localStorage.js');
const config = require('../../config.js');
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code:null,
    nickName:"掌上行车",
    iconUrl:"../../images/mine-portrait.png",
  },
  onLoad:function(optine){
  // wx.showToast({
  //   icon:'none',
  //   title: '由于业务需求，请先授权获取用户信息！',
  // })
  var that = this;
  wx.login({
    success: function (res) {
      if (res.code) {
          that.setData({
            code: res.code
          })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  });

  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    //处理用户授权信息
    if (e.detail.errMsg == "getUserInfo:fail auth deny"){
      //授权失败
      wx.showToast({
        icon: 'none',
        title: '您点了拒绝将会无法获取到用户信息！',
      })
    }else{
      //保存数据
      let that = this;
      localStorage.setStorage(config.kuserInfo, e.detail.userInfo);
      this.setData({
        iconUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
      })
      //解密openId
      api.decryptedData(this.data.code, e.detail.encryptedData, e.detail.iv, function(res){
          
        setTimeout(function () {
          //解密完成后返回
          wx.switchTab({
            url: '../home/home',
          })
        }, 1000) //延迟时间 这里是3秒  
        
      });
      
    }

  }
})