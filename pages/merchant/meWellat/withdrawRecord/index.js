// pages/merchant/meWellat/withdrawRecord/index.js
var that;
var app = getApp();
var wxRequest = require('../../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    consume: [],
    isFang: false
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    that.billList();
  },

  //提现列表
  billList() {
    var dataUrl = "/trade/withdraw/withdrawListM";
    var param = {
      page: {
        size: 20,
        current: 1
      },
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        var consume = res.records;
        console.log("提现列表", res);
        if (res.code == "0000") {
          that.setData({
            consume: consume,
            current: 1
          });
          if (res.records.length > 0) {
            that.setData({
              isFang: true
            });
          } else {
            that.setData({
              isFang: false
            });
          }
        }
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
    that.billList();
    // 停止下拉动作  
    if (that.data.consume) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 页数+1  
    let current = that.data.current;
    current = current + 1;
    var dataUrl = "/trade/withdraw/withdrawListM";
    var param = {
      page: {
        size: 20,
        current: current
      },
    };
    console.log("页数", param)
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages; //服务器总页数
      console.log("消费列表", res.records);
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
          var moment_list = that.data.consume;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            consume: moment_list,
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