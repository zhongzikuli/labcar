const api = require('../../utils/api.js')
const config = require('../../config.js')
const localStorage = require('../../utils/localStorage.js');
const util = require('../../utils/jhUtil.js')
Page({
  data: {
    tel: "",
    portrait: "",
    name: "",
    cardNo: ""
  },
  setName:function(){
    var that = this;
  wx.navigateTo({
    url: 'settingDetail?type=name&text='+that.data.name,
  })
  },
  setIdcard: function () {
    var that = this;
    wx.navigateTo({
      url: 'settingDetail?type=idcard&text='+that.data.cardNo,
    })
  },
  onLoad:function (option){

  },
  onShow:function(option){
  this.getUserInfo();
  },
  // 获取用户信息
  getUserInfo: function () {
    let that = this;
    api.getUserInfo(function (res) {
      var portarit;
      //判断服务器是否有图片，有则显示，无则使用微信url
      if (res.weixinPortraitGroup != null && res.weixinPortraitGroup != undefined && res.weixinPortraitPath != null && res.weixinPortraitPath != undefined) {
        portarit = config.kBaseNginxUrlStr + res.weixinPortraitGroup + "/" + res.weixinPortraitPath
      } else if (res.weixinPortraitUrl != null && res.weixinPortraitUrl != undefined) {
        portarit = res.weixinPortraitUrl;
      } else {
        portrait = "../../images/mine-portrait.png"
      }
      //展示数据
      that.setData({
        'tel': util.hiddenTel(res.tel),
        'portrait': portarit,
        'name': res.name ? res.name :'',
        'cardNo': res.cardNo ? res.cardNo : ''
      })
    });
  },
})