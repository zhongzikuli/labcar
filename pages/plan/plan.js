const api = require('../../utils/api.js')
const config = require('../../config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    details:{},
    iconUrl: config.kBaseNginxUrlStr,
    dates:[],
    selectIndex:1,
    temp:1,
    bussinessOrderId: 0,
    checked:true,
    isSettleColor: '#F7DC23',
  },
  onLoad(option){
    if (option.bussinessOrderId){
      this.setData({
        bussinessOrderId: option.bussinessOrderId
      })
      this.getData(option.bussinessOrderId);
    }
  },
  getData: function (bussinessOrderId){
    var that = this;
    api.getCustomerLoanInformation(bussinessOrderId,function(res){
      //获取还款日期单独设定
      var repaymentTipDate = res.customerLoanInformationEntity.repaymentTipDate ? res.customerLoanInformationEntity.repaymentTipDate:1;

      //处理数据，传入颜色
      for (var data of res.cfRepaymentPlanEntity) {
        if (data.repayStatus == 2 && (data.isOverdue == 0 || data.isOverdue == null)){
          data.lineColor = '#00b7ee';
          data.statusColor = '#00b7ee'
          data.statusText = "待还"

          } else if (data.repayStatus == 2 && data.isOverdue == 1){
          data.lineColor = '#7A7A7A';
          data.statusColor = 'red'
          data.statusText = "逾期"
        } else if (data.repayStatus == 4 && (data.isOverdue == 0 || data.isOverdue == null)){
          data.lineColor = '#7A7A7A';
          data.statusColor = '#E0E0E0'
          data.statusText = "已还"
        } else if (data.repayStatus == 4 && data.isOverdue == 1){
          data.lineColor = '#7A7A7A';
          data.statusColor = '#F7DC23'
          data.statusText = "逾期后补缴"
        }else{
          data.lineColor = '#7A7A7A';
          data.statusColor = '#7A7A7A'
          data.statusText = "--"
        }
      }
      
      var isSettle = res.customerLoanInformationEntity.isSettle;
      //初始化数据
      that.setData({
        // dates: array,
        details:res,
        isSettleColor: isSettle ? '#00b7ee' :'#F7DC23',
        selectIndex: repaymentTipDate,
        checked: res.customerLoanInformationEntity.repayTipOpen,
      })
      wx.stopPullDownRefresh();
    });
  },
  //选择时间
  bindPickerChange: function (e) {
    var selectIndex = parseInt(e.detail.value) + 1;

    if (this.data.selectIndex == selectIndex){
      return;
    }
    var that = this;

    api.updateRepaymentTipDate(this.data.bussinessOrderId ,selectIndex ,function(res){
        debugger
        that.setData({
          selectIndex: selectIndex
        })
    });
  },
  //开关
  switchChange: function (e) {
    var that = this;
    api.updateRepayTipOpen(this.data.bussinessOrderId, e.detail.value?1:0, function (res) {
      that.setData({
        checked: e.detail.value
      })
    });
  },
//下拉刷新
  onPullDownRefresh: function () {

    this.getData(this.data.bussinessOrderId);
  },
})