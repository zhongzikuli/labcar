// 数据请求类
const config = require('../config');
const dataRequest = require("dataRequest.js");
const localStorage = require('./localStorage.js');

//Http Get
function requestGet(url, data, isLogin, cb) {
  //数据请求的加密方法
  var finalData = dataRequest.addBaseKeyWithData(data, isLogin);
  var body = JSON.parse(JSON.stringify(finalData));
  //生成签名
  var sign = dataRequest.md5Prram(finalData, true);
  body.sign = sign;
  var requestHeader = {
    "devId": finalData.devId,
    "time": finalData.time,
    'content-type': 'application/x-www-form-urlencoded',
  }
  delete body["devId"];
  delete body["key"];
  delete body["time"];
  wx.request({
    url: config.url + url,
    data: body,
    method: 'GET',
    header: requestHeader,
    success: function (res) {
      cb(res, true)
    },
    fail: function () {
      cb(data, false)
    }
  })
}
/**
 * post请求 url,data,islogin,callback
 */
function requestPost(url, data, isLogin, cb) {
  //数据请求的加密方法
  var finalData = dataRequest.addBaseKeyWithData(data, isLogin);
  var body = JSON.parse(JSON.stringify(finalData));
  //生成签名
  var sign = dataRequest.md5Prram(finalData, true);
  body.sign = sign;
  var requestHeader = {
    "devId": finalData.devId,
    "time": finalData.time,
    'content-type': 'application/x-www-form-urlencoded',
  }
  delete body["devId"];
  delete body["key"];
  delete body["time"];

  console.log("请求体：" + JSON.stringify(body));
  wx.request({
    url: config.url + url,
    data: body,
    method: 'POST',
    header: requestHeader,
    success: function (res) {
      if (res.data == null || res.data == undefined || res.data == ""){
        wx.hideLoading();
        wx.showToast({
          title: '网络加载失败',
          icon: "none"
        })
        return;
      }
      console.log(res);
      if (res.data) {
        if (res.data.error == "20020014" || res.data.error == "20020013" || res.data.error == "40030002") {
          //重新登录
          wx.navigateTo({
            url: '../login/login?message=' + res.data.message,
          })
        } else {
          cb(res, true)
        }
      } else {
        if (res.error == "20020014" || res.error == "20020013" || res.error == "40030002") {
          //重新登录
          wx.navigateTo({
            url: '../login/login?message=' + res.message,
          })
        } else {
          cb(res, true)
        }
      }

    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '网络加载失败',
        icon: "none"
      })
    }
  })
}


//用户登录
function login(data, cb) {
  wx.showLoading({
    title: '正在登录...',
  })
  requestPost("customer/login", data, false, function (res, success) {
    wx.hideLoading();
    //存储openId
    cb(res.data);
  });
}
//用户退出登录（清空本地用户数据）
function logout(cb) {
  localStorage.setStorageSync(config.kuId, '');
  localStorage.setStorageSync(config.korgId, '');
  localStorage.setStorageSync(config.kdevId, '');
  localStorage.setStorageSync(config.ktel, '');
  localStorage.setStorageSync(config.kname, '');
  var baseData = {
  };
  //告知后台退出，客户端不做处理
  requestPost("customer/logout", baseData, true, function (res) {

  });
  cb();
}
//用户获取验证码
function sendValidateCode(tel, cb) {
  var baseData = {
    "tel": tel
  };
  requestPost("customer/sendValidateCode", baseData, false, function (res, success) {
    cb(res);
  });
}
//解密(获取openId和unionId)
function decryptedData(code, decryptedData, iv, cb) {
  wx.showLoading({
  })
  var baseData = {
    "jsCode": code, "encryptedData": decryptedData, "iv": iv
  };
  requestPost("customer/decryptedData", baseData, false, function (res) {
    wx.hideLoading();
    //存储openId
    if (res.data.error == 1) {
      localStorage.setStorageSync(config.kopenId, res.data.rows.openId);
      localStorage.setStorageSync(config.kunionId, res.data.rows.unionId);
      cb(res.data.rows);
    } else {

    }
  });
}
//用户登录校验
function isLogin() {
  let uid = localStorage.getStorageSync(config.kuId);
  let orgId = localStorage.getStorageSync(config.korgId);
  if (uid == undefined || orgId == undefined || uid == "" || orgId == "" || uid == null || orgId == null) {
    return false;
  }
  return true;
}
//获取用户信息
function getUserInfo(cb) {
  var baseData = {
  };
  requestPost("customer/userInfo", baseData, true, function (res) {

    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}
//更新用户信息
function updataUserInfo(name, cardNo, cb) {
  var baseData = {};
  if (name) {
    baseData.name = name;
  }
  if (cardNo) {
    baseData.cardNo = cardNo;
  }

  requestPost("customer/updateCustomerInfo", baseData, true, function (res) {

    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}

//我要车贷列表
function queryLendList(pageNum, cb) {
  var baseData = { "pageNum": pageNum };
  wx.showNavigationBarLoading()
  // wx.showLoading({
  //   title: pageNum == 0 ? "加载中..." : "加载更多...",
  // })
  requestPost("customer/queryCarLoanList", baseData, true, function (res) {
    // wx.hideLoading();
    wx.hideNavigationBarLoading();
    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}

//我要车贷申请
function saveCarLoanInfo(data, cb) {

  requestPost("customer/saveCarLoanInfo", data, true, function (res) {

    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}
//我要车贷删除
function deleteCarLoanInfo(id,cb) {
  var baseData = {
    'id':id
  };
  requestPost("customer/deleteCarLoanInfo", baseData, true, function (res) {
    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}
//还款计划列表
function queryPlanList(pageNum, cb) {
  var baseData = { "pageNum": pageNum };
  wx.showNavigationBarLoading()
  // wx.showLoading({
  //   title: pageNum == 0 ? "加载中..." : "加载更多...",
  // })
  requestPost("customer/getCustomerLoanInformationList", baseData, true, function (res) {
    // wx.hideLoading();
    wx.hideNavigationBarLoading();
    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}

//还款计划明细
function getCustomerLoanInformation(bussinessOrderId ,cb){
  var baseData = {
    "bussinessOrderId": bussinessOrderId
  };
  wx.showNavigationBarLoading()
  // wx.showLoading({
  //   title: "加载中...",
  // })
  requestPost("customer/getCustomerLoanInformation", baseData, true, function (res) {
    // wx.hideLoading();
    wx.hideNavigationBarLoading();
    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}
//获取逾期金额
function getOverDueMoney(cb){
  var baseData = {
  };
  wx.showNavigationBarLoading();
  requestPost("customer/getOverDueMoney", baseData, true, function (res) {
  wx.hideNavigationBarLoading();
    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}
//修改提醒日期
function updateRepaymentTipDate(orderId,dateNumber,cb){
  debugger
  var baseData = {
    'bussinessOrderId':orderId,
    'repaymentTipDate': dateNumber
  };
  wx.showLoading({
    title: "加载中...",
  })
  requestPost("customer/updateRepaymentTipDate", baseData, true, function (res) {
    wx.hideLoading();
    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}
//打开提醒开关
function updateRepayTipOpen(orderId, isOpen, cb) {
  var baseData = {
    'bussinessOrderId': orderId,
    'repayTipOpen': isOpen
  };
  wx.showLoading({
    title: "加载中...",
  })
  requestPost("customer/updateRepayTipOpen", baseData, true, function (res) {
    wx.hideLoading();
    if (res.data.error == 1) {
      cb(res.data.rows);
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      })
    }
  });
}

module.exports = {
  isLogin: isLogin,//是否登录校验
  login: login,//登录
  logout: logout,//退出登录
  decryptedData: decryptedData,//解密
  sendValidateCode: sendValidateCode,//发送验证码
  getUserInfo: getUserInfo,//获取用户信息
  updataUserInfo: updataUserInfo,//更新用户信息
  queryLendList: queryLendList,//获取我要车贷列表
  saveCarLoanInfo: saveCarLoanInfo,//我要车贷申请
  deleteCarLoanInfo: deleteCarLoanInfo, //我要车贷删除
  queryPlanList: queryPlanList,//还款计划列表
  getCustomerLoanInformation: getCustomerLoanInformation,//还款计划明细
  getOverDueMoney: getOverDueMoney,//获取逾期金额
  updateRepaymentTipDate: updateRepaymentTipDate,//修改提醒日期
  updateRepayTipOpen: updateRepayTipOpen,//打开关闭提醒
}  