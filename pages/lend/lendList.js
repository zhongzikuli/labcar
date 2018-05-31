const api = require('../../utils/api.js')
const util = require('../../utils/jhUtil.js');
const initdata = function (that) {
  var dataList = that.data.dataList
  for (var i = 0; i < dataList.length; i++) {
    dataList[i].txtStyle = ""
  }
  that.setData({ dataList: dataList })
}

Page({
  data: {
    delBtnWidth: 180,//删除按钮宽度单位（rpx）  
    dataList : [],
    hasMoreData: true,
    titles: [{ "key": "name", 'title': "申请姓名：" }, { "key": "tel", 'title': "手机号码：" }, { "key": "city", 'title': "购车城市：" }, { "key": "carType", 'title': "意向车型：" }, { "key": "ctime", 'title':"申请时间："}],

    pageNum: 0,
    numPerPage:10
  },
  onLoad:function(){
    this.getData();
    this.initEleWidth();
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var dataList = this.data.dataList;
      dataList[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        dataList: dataList
      });
    }
  },

  touchM: function (e) {
    var that = this
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var dataList = this.data.dataList;
      dataList[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        dataList: dataList
      });
    }
  },
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },

  //初始化宽度
  initEleWidth:function(){
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  delItem: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.dataList[index].id;
    
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if(res.cancel){
        return;
        }
        api.deleteCarLoanInfo(id,function(res){
          wx.showToast({
            title: "删除成功！"
          })
          that.getData();
        })
      }
    })
  },
  // 获取数据
  getData:function(){
    let that = this;
    api.queryLendList(this.data.pageNum,function (res){
      //停止刷新
      wx.stopPullDownRefresh()
      var contentlistTem = that.data.dataList;
      //清空
      if (that.data.pageNum == 0){
        contentlistTem = [];
      }
      res.recordList.forEach(function(item){
        item.txtStyle=''
      })
      var contentList = res.recordList;
      //修改title文本,修改手机号
      for (var i = 0 ;i<contentList.length; i++){
        var data = contentList[i];
        var thisNumber = i + 1;
        data.title = util.numberToChinese(thisNumber);
        data.tel = util.hiddenTel(data.tel);
      }
      //区分是否多于10个
      if (contentList.length < that.data.numPerPage){
        that.setData({
          dataList: contentlistTem.concat(contentList),
          hasMoreData :false
        })
      }else{
        that.setData({
          dataList: contentlistTem.concat(contentList),
          hasMoreData: true,
          pageNum: that.data.pageNum + 1
        })
      }
    })
  },

  gotoDetail(e){
    var ind = e.currentTarget.dataset.index;
    var data = this.data.dataList[ind];
    wx.navigateTo({
      url: 'lend?details='+JSON.stringify(data),
    })
  },

  onPullDownRefresh: function () {
    this.setData({
      pageNum: 0
    });
    this.getData();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getData();
    } else {
      // wx.showToast({
      //   title: '没有更多数据',
      //   icon:'none'
      // })
    }
  },

})