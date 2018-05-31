const config = require('../../config.js')
const api = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
    ],
    hasMoreData: true,
    pageNum: 0,
    numPerPage: 10,
    iconUrl: config.kBaseNginxUrlStr,
  },
  onLoad: function () {
    this.getData();
  },
  // 获取数据
  getData: function () {
    let that = this;

    api.queryPlanList(this.data.pageNum, function (res) {
      //停止刷新

      wx.stopPullDownRefresh()

      var contentlistTem = that.data.dataList;
      //清空
      if (that.data.pageNum == 0) {
        contentlistTem = [];
      }
      var contentList = res;
      //区分是否多于10个
      if (contentList.length < that.data.numPerPage) {
        that.setData({
          dataList: contentlistTem.concat(contentList),
          hasMoreData: false
        })
      } else {
        that.setData({
          dataList: contentlistTem.concat(contentList),
          hasMoreData: true,
          pageNum: that.data.pageNum + 1
        })
      }
    })
  },
  gotoDetail(e) {
    var ind = e.currentTarget.dataset.index;
    var data = this.data.dataList[ind];
    wx.navigateTo({
      url: 'plan?bussinessOrderId=' + data.bussinessOrderId,
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
    // if (this.data.hasMoreData) {
    //   this.getData();
    // } else {
    //   wx.showToast({
    //     title: '没有更多数据',
    //     icon: 'none'
    //   })
    // }
  },
})