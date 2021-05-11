// pages/merchant/audit/index.js
var that;
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    auditList: [],
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
    that.auditFun();
  },
  auditFun() {
    var dataUrl = "/card/resellVerifyList";
    var param = {
      page: {
        size: 10,
        current: 1
      }
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("审核列表", res);
        if (res.code == '0000') {
          var auditList = res.records;
          that.setData({
            auditList: auditList,
            current: 1
          });
          if (auditList.length>0){
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
      .catch(function(res) {
        console.log(res)
      })
  },
  //拒绝
  refuseFun(e) {
    var verifyStatus = 1;
    var membercardid = e.target.dataset.membercardid;
    that.operationFun(verifyStatus, membercardid);
  },
  //允许
  permitFun(e) {
    var verifyStatus = 0;
    var membercardid = e.target.dataset.membercardid;
    that.operationFun(verifyStatus, membercardid);
  },
  operationFun(status, memberCardId) {
    var dataUrl = "/card/resellVerify";
    var param = {
      verifyStatus: status,
      memberCardId: memberCardId
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("状态", res);
        if (res.code == '0000') {
          that.auditFun();
        } else {
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
    that.auditFun();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.billList) {
      // 隐藏导航栏加载框  
      that.data.current = 1;
      wx.hideNavigationBarLoading();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 页数+1  
    let current = that.data.current;
    current = current + 1;
    var dataUrl = "/card/resellVerifyList";
    var param = {
      page: {
        size: 10,
        current: current
      },
    };
    console.log("页数", param);
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages;
      console.log("服务器总页数", pages);
      console.log("卡列表", res.records);
      if (pages < current) {
        console.log("暂时没有更多了")
        wx.showLoading({
          title: '暂时没有更多了',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      } else {
        console.log("玩命加载中")
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.auditList;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            auditList: moment_list,
            current: current
          })
          // 隐藏加载框  
          setTimeout(function() {
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