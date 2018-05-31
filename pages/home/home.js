var app = getApp();
const localStorage = require('../../utils/localStorage.js');
const config = require('../../config.js');
const api = require('../../utils/api.js')
Page({
  data: {
    userInfo :null,
    money:"0",
  },
  // 点击
  planTap:function(){
    let isLogin = api.isLogin();
    if(isLogin){
      //判断是否为当个还款信息，只有一个则直接进入详情
      api.queryPlanList(this.data.pageNum, function (res) {
        if (res.length == 0){
          wx.showToast({
            title: '您目前没有还款计划',
            icon:'none'
          })
        }else if(res.length==1){
          var ind = 0;
          var data = res[ind];
          wx.navigateTo({
            url: '../plan/plan?bussinessOrderId=' + data.bussinessOrderId,
          })
        }else{
          //跳转
          wx.navigateTo({
            url: '../plan/planList',
          })
        }
       
      });
      
    }else{
      //前往登录
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  lendTap: function () {
    let isLogin = api.isLogin();
    if (isLogin) {
      //跳转
      wx.navigateTo({
        url: '../lend/lend',
      })
    } else {
      //前往登录
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  onShow:function (options) {
    var that = this;
    //openId有则说明这个微信已经有了该数据，不再次请求login和getUserInfo
    var openId = localStorage.getStorageSync(config.kopenId);
    if (!(openId == undefined || openId == '' || openId == null)) {

      //判断是否登录
      let isLogin = api.isLogin();
      if (isLogin) {
        //逾期金额
        api.getOverDueMoney(function (res) {
          that.setData({
            money: (res == null ? '0' : res)
          })
        })
      }

      return;
    }
    //跳转授权页面
    wx.navigateTo({
      url: 'author',
    })
  },
  onLoad: function (options) {

    console.log("onLoad=====");
    
  }
})