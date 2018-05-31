const api = require('../../utils/api.js')
const localStorage = require('../../utils/localStorage.js');
const config = require('../../config.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemDatas: [
      { "image": "../../images/mine-name.png", "title": "姓名", "inputType": "text", "name": "name", "maxLength": "20" },
      { "image": "../../images/mine-phone.png", "title": "手机号", "inputType": "number", "name": "tel", "maxLength": "11" },
      { "image": "../../images/mine-location.png", "title": "购车城市", "inputType": "text", "name": "city", "maxLength": "100" },
      { "image": "../../images/home-lend.png", "title": "车型", "inputType": "text", "name": "carType", "maxLength": "100" }
    ],

    details: {
    },
    allowedEdit: true

  },
  onLoad: function (option) {

    //传递数据
    if (option.details) {
      this.setData({
        details: JSON.parse(option.details),
        allowedEdit: false
      })
    }else{

      let name = localStorage.getStorageSync(config.kname);
      let tel = localStorage.getStorageSync(config.ktel);
      var data = {
        name: name == undefined ? '' :name,
        city: '',
        tel: tel ==undefined ? '' :tel,
        carType: '',
        customerBak: '',
      }
      this.setData({
        details: data,
        allowedEdit: true
      })
    }

  },

  formSubmit(e) {
    let data = e.detail.value;
    data.city = this.data.details.city;

    let idReg = /^1\d{10}$/
    //表单校验
    if (data.name.length == 0) {
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    } else if (!idReg.test(data.tel)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: "none"
      })
      return;
    } else if (data.city.length == 0) {
      wx.showToast({
        title: '请选择购车城市',
        icon: "none"
      })
      return;
    }
    //提交
    api.saveCarLoanInfo(data, function (res) {
      wx.showToast({
        title: "提交成功！",
      })
      setTimeout(function () {
        wx.navigateBack({
        })
      }, 1000)//延迟时间 这里是1秒
    });
  },
  bindInput(e) {
    //处理输入框
    var details = this.data.details;

    if (e.currentTarget.dataset.idx ==0){
      details.name = e.detail.value;
    } else if (e.currentTarget.dataset.idx == 1) {
      details.tel = e.detail.value;
    } else if (e.currentTarget.dataset.idx == 3) {
      details.carType = e.detail.value;
    }
    this.setData({
      details: details
    })
  },
  //选择器
  bindRegionChange: function (e) {
    console.log(e.detail.value)
    let area = e.detail.value;
    var details = this.data.details;
    details.city = area[0] + "-" + area[1] + "-" + area[2]
    this.setData({
      details: details
    })
  },
  //备注
  bindRemarks: function (e) {

    var details = this.data.details;
    details.customerBak = e.detail.value;
    this.setData({
      details: details
    })
  },
})