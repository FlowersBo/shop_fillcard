// pages/index/merchant/statement/index.js
var that;
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
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
  //按办卡时间排序
  // cardTimer: function() {
  //   console.log("111")
  //   var memberList = that.data.memberList;
  //   memberList.sort(function(a, b) {
  //     return Date.parse(b.time) - Date.parse(a.time); //时间倒序
  //   });
  //   that.setData({
  //     memberList: memberList
  //   })
  // },
  // cardJoinTime: function() {
  //   console.log("111")
  //   var memberList = that.data.memberList;
  //   memberList.sort(function(a, b) {
  //     return Date.parse(a.writeOffValue) - Date.parse(b.writeOffValue); //时间正序
  //   });
  //   that.setData({
  //     memberList: memberList
  //   })
  // },
  // cards: function() {
  //   console.log("111")
  //   var memberList = that.data.memberList;
  //   memberList.sort(function(a, b) {
  //     return Date.parse(b.writeOffValue) - Date.parse(a.writeOffValue);
  //   });
  //   that.setData({
  //     memberList: memberList
  //   })
  // },
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
  // wx.navigateToMiniProgram({
    //   appId: 'wxe1d4583743a72332',
    //   path: 'pages/index/index',
    //   extraData: {
    //     foo: 'bar'
    //   },
    //   envVersion: 'release',
    //   success(res) {
    //     // 跳转其他小程序成功
    //     console.log(res)
    //   }
    // });
  //查找
  formSubmit(e) {
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
    var dataUrl = "/trade/stat/orderStat";
    var param = { orderType: 2};
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("核销统计", res);
        if (res.code == "0000") {
          var records = res.data;
          that.setData({
            tradeStat: records
          });
        }
      })
      .catch(function(res) {
        console.log(res)
      })
    var startTime = '';
    var endTime = '';
    that.statementList(startTime, endTime);
  },
  //报表列表
  statementList(startTime, endTime) {
    console.log(startTime, endTime);
    var dataUrl = '/trade/order/orderListM';
    var param = {
      page: {
        size: 10,
        current: 1
      },
      orderType: 2,
      writeOffStatus: 2,
      startTime: startTime,
      endTime: endTime
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("推广报表列表", res);
        if (res.code == '0000') {
          var records = res.records;
          // that.writeOffStatusFun(records);
          that.setData({
            memberList: records,
            current: 1
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
  writeOffStatusFun: function (orderList) {
    for (var i = 0; i < orderList.length; i++) {
      if (orderList[i].writeOffStatus == 0) {
        orderList[i].writeOffStatus = '未核销'
      } else if (orderList[i].writeOffStatus == 1) {
        orderList[i].writeOffStatus = ''
      } else if (orderList[i].writeOffStatus == 2) {
        orderList[i].writeOffStatus = '已核销'
      } else if (orderList[i].writeOffStatus == 3) {
        orderList[i].writeOffStatus = '已过期'
      }
    }
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
    that.setData({ startTime: startTime, endTime: endTime})
    that.onShow();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.tradeStat) {
      that.data.current = 1;
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 页数+1  
    let current = that.data.current;
    current = current + 1;
    var dataUrl = "/trade/stat/reportDataList";
    var startTime = that.data.startTime;
    var endTime = that.data.endTime;
    var param = {
      page: {
        size: 10,
        current: current
      },
      startTime: startTime,
      endTime: endTime,
      orderType: 2,
      writeOffStatus: 2,
    };
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages;
      console.log("服务器总页数", pages);
      console.log("卡列表", res.records);
      if (pages < current) {
        console.log("暂时没有更多了")
        wx.showLoading({
          title: '暂时没有更多了',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else {
        console.log("玩命加载中")
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.memberList;
          // that.writeOffStatusFun(res.records);
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            memberList: moment_list,
            current: current
          })
          // 隐藏加载框  
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})