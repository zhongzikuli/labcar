const api = require('../../utils/api.js')
const config = require('../../config.js')
const localStorage = require('../../utils/localStorage.js');
const util = require('../../utils/jhUtil.js');
Page({
  data: {
    tel: "手机未登录",
    portrait:"../../images/mine-portrait.png",
    isLogin:true,
  },
  onLoad:function(option){
    
  },
  onShow:function(option){
    //判断是否登录
    let isLogin = api.isLogin();
    if (isLogin) {
      this.getUserInfo();
      this.setData({
        isLogin: true,
      })
    }else{
      this.setData({
        isLogin: false,
        tel: "手机未登录",
        portrait: "../../images/mine-portrait.png",
      })
    }
    
  },
  // 获取用户信息
  getUserInfo:function(){
    let that = this;
    api.getUserInfo(function (res){
    var portarit;
  //判断服务器是否有图片，有则显示，无则使用微信url
    if (res.weixinPortraitGroup != null && res.weixinPortraitGroup != undefined && res.weixinPortraitPath != null && res.weixinPortraitPath != undefined){
      portarit = config.kBaseNginxUrlStr + res.weixinPortraitGroup + "/" + res.weixinPortraitPath
    } else if (res.weixinPortraitUrl != null && res.weixinPortraitUrl != undefined){
      portarit = res.weixinPortraitUrl;
    }else{
      portrait = "../../images/mine-portrait.png"
    }
    //保存用户姓名
    if(res.name){
      localStorage.setStorageSync(config.kname, res.name)
    }
    
      //展示数据
    that.setData({
      tel: util.hiddenTel(res.tel),
      portrait: portarit
    })
    });
  },

  // 跳转我的信息
  mineInfo:function(){
    let isLogin = api.isLogin();
    if (isLogin) {
      //跳转
      wx.navigateTo({
        url: './myInfo',
      })
    } else {
      //前往登录
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  // 跳转我的车贷申请
  mineLend:function(){
    let isLogin = api.isLogin();
    if (isLogin) {
      //跳转
      wx.navigateTo({
        url: '../lend/lendList',
      })
    } else {
      //前往登录
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  // 退出登录
  logout:function(){
    //弹窗，删除数据并跳转到登录
    wx.showModal({
      title: '提示',
      content: '您确定退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          api.logout(function () {
            wx.navigateTo({
              url: '../login/login',
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }
})