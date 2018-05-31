const api = require('../../utils/api.js')
const localStorage = require('../../utils/localStorage.js');
const config = require('../../config.js');
var app = getApp();
var interval = null //倒计时函数
Page({
  data: {
    message:null,
    buttonText: '登录',
    register: '<<用户注册协议>>',
    time: '发送验证码', //倒计时 
    currentTime: 60,
    tel: '',
    latitude:  '',
    longitude: '',

    formInfo: [{
      label: "手机号",
      placeholder: "请输入手机号",
      type: "number",
      class: "tel",
      funcName: "telInput",
      maxlength: 11,
      method: 'telInput'
    }, {
      label: "验证码",
      placeholder: "请输入验证码",
      type: "number",
      class: "number",
      funcName: "numberInput",
      maxlength: 6,
      method: 'numberInput'
    }],
  },
  /**
   * 发送验证码处理
   */
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + 'S 后重发'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    let idReg = /^1\d{10}$/
    if (!idReg.test(this.data.tel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: "none",
        duration: 1500
      })
      return;
    }
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
    //发送验证码
    api.sendValidateCode(this.data.tel ,function(res){

      if(res.data.error == -1){
        wx.showToast({
          title: res.data.message,
          icon:"none"
        })
      }
    })
  },
  telInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  numberInput: function (e) {
  },
  tap:function(){
  wx.navigateTo({
    url: 'register',
  })
  },
  /**
   * 登录
   */
  formSubmit(e) {

    let idReg = /^1\d{10}$/
    if (!idReg.test(e.detail.value.tel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: "none",
        duration: 1500
      })
    } else if (e.detail.value.number.length == 0) {
      wx.showToast({
        title: '验证码不能为空',
        icon: "none",
        duration: 1500
      })
    } else {
    //获取一些基础数据
  //用户基本信息
      let userInfo = localStorage.getStorageSync(config.kuserInfo);
      let openId = localStorage.getStorageSync(config.kopenId);
      let unionId = localStorage.getStorageSync(config.kunionId);

  var baseData = {
    "tel": e.detail.value.tel,
    "validateCode": e.detail.value.number,
    "weixinName": userInfo.nickName,
    "weixinPortraitUrl": userInfo.avatarUrl,
    "lastLoginLon": this.data.longitude,
    "lastLoginLat": this.data.latitude,
    "miniProgramOpenid": openId,
    "unionId": unionId,
  }

  api.login(baseData , function(res){
  if(res.error == 1){
    localStorage.setStorageSync(config.kuId, res.rows.uId);
    localStorage.setStorageSync(config.korgId, res.rows.orgId);
    localStorage.setStorageSync(config.kdevId, res.rows.devId);
    localStorage.setStorageSync(config.ktel, e.detail.value.tel);
    wx.switchTab({
      url: '../home/home',
    })
  }else{
    wx.showToast({
      title: res.message,
      icon: "none",
      duration: 2500
    })
  }
  })
    }

  },


  onLoad: function (options) {

    if (options.message){
    wx.showToast({
      title: options.message,
      icon : 'none'
    })
    }
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  }
})