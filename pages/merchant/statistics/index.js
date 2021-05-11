// pages/merchant/statistics/index.js
var that;
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList: [],
    isFang: false,
    startTime: '',  
    endTime: '', 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //时间选择
  bindTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindTimeChange1: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  // 跳转
  cardAdmin:function(){
    wx.navigateTo({
      url: 'vipCardAdmin/index',
    })
  },
  //查找
  formSubmit(e) {
    // wx.navigateToMiniProgram({
    //   appId: 'wxe1d4583743a72332',
    //   path: 'pages/index/index',
    //   extraData: {
    //     foo: 'bar'
    //   },
    //   envVersion: 'release',
    //   success(res) {
    //     // 打开成功
    //     console.log(res)
    //   }
    // });
    console.log(e);
    var startTime = e.detail.value.startTime;
    var endTime = e.detail.value.endTime;
    if (startTime || endTime){
      that.statementList(startTime, endTime);
    }else{
      wx.showToast({
        title: '请输入查找时间',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var startTime = '';
    var endTime = '';
    that.statementList(startTime, endTime);
  },
  //报表列表
  statementList(startTime, endTime) {
    console.log(startTime, endTime);
    var dataUrl = '/trade/stat/productTradeStat';
    var param = {
      startTime: startTime,
      endTime: endTime
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("统计", res);
        if (res.code == '0000') {
          var records = res.data.productTradeList;
          var statistics = res.data;
          that.setData({
            memberList: records,
            statistics: statistics
          });
          if (records.length > 0) {
            that.setData({
              isFang: true
            });
          } else {
            that.setData({
              isFang: false
            });
          }
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch(function(res) {
        console.log(res)
      })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var startTime = '';
    var endTime = '';
    that.setData({ startTime: startTime, endTime: endTime});
    that.statementList(startTime, endTime);
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.statistics) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // // 页数+1  
    // let current = that.data.current;
    // current = current + 1;
    // var dataUrl = "/trade/stat/productTradeStat";
    // var startTime = that.data.startTime;
    // var endTime = that.data.endTime;
    // var param = {
    //   page: {
    //     size: 10,
    //     current: current
    //   },
    //   startTime: startTime,
    //   endTime: endTime
    // };
    // console.log("页数", param);
    // wxRequest(dataUrl, param).then(res => {
    //   var pages = res.pages;
    //   console.log("服务器总页数", pages);
    //   console.log("统计", res.data.productTradeList);
    //   if (pages < current) {
    //     console.log("暂时没有更多了")
    //     wx.showLoading({
    //       title: '暂时没有更多了',
    //     })
    //     setTimeout(function () {
    //       wx.hideLoading()
    //     }, 500)
    //   } else {
    //     console.log("玩命加载中")
    //     wx.showLoading({
    //       title: '玩命加载中',
    //     })
    //     if (res.code == "0000") {
    //       var moment_list = that.data.memberList;
    //       for (var i = 0; i < res.data.productTradeList.length; i++) {
    //         moment_list.push(res.data.productTradeList[i]);
    //       }
    //       console.log("push列表", moment_list)
    //       // 设置数据  
    //       that.setData({
    //         memberList: moment_list,
    //         current: current
    //       })
    //       // 隐藏加载框  
    //       setTimeout(function () {
    //         wx.hideLoading()
    //       }, 500)
    //     }
    //   }
    // });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})