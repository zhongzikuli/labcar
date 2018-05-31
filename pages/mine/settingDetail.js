const api = require('../../utils/api.js')
const config = require('../../config.js')
const localStorage = require('../../utils/localStorage.js');
const util = require('../../utils/jhUtil.js');
Page({
  data: {
    text:"",
    settingType:"",
    keyboardType:"",
    length:""
  },
  onLoad:function (option){
    this.setData({
      text : option.text,
      settingType : option.type,
    })

  if(option.type == 'name'){
    this.setData({
      keyboardType : "text",
      length : 20,
    })
    wx.setNavigationBarTitle({
      title: '设置姓名'
    })
  } else if (option.type == 'idcard') {
    this.setData({
      keyboardType : "idcard",
      length : 18,
    })
    wx.setNavigationBarTitle({
      title: '设置身份证号'
    })
  }
  },
  formSubmit: function (e) {
    if (this.data.settingType == 'name') {
      if (e.detail.value.input.length == 0) {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return;
      }
      api.updataUserInfo(e.detail.value.input,null,function(res){
        wx.showToast({
          title: "保存成功！",
        })
        setTimeout(function () {
          wx.navigateBack({
          })
        }, 1000) //延迟时间 这里是1秒  
      });
    } else if (this.data.settingType == 'idcard') {

      if (util.identityCodeValid(e.detail.value.input)==false){
        wx.showToast({
          title: '请检查身份证',
          icon:'none'
        })
        return;
      }

      api.updataUserInfo(null,e.detail.value.input, function (res) {
        wx.showToast({
          title: "保存成功！",
        })
        setTimeout(function () {
          wx.navigateBack({
          })
        }, 1000) //延迟时间 这里是1秒  

      });
    }
    

  },
})