// pages/index/merchant/index.js
var app = getApp();
var wxRequest = require('../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    circular: true,
    interval: 2000,
    autoplay: true,
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //扫码
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log("扫码",res)
        var path = decodeURIComponent(res.path);
        // var path = res.path;
        console.log(path)
        // var pathPart1 = path.split('&');
        // console.log(pathPart1)
        // var pathPart = path.substring(0, path.lastIndexOf('='));
        var pathPart = path.substring(0, 6);
        console.log("截取后", pathPart);
        if (path){
          if (pathPart == 'source') {
            wx.navigateTo({
              url: '/pages/merchant/verificationQRcode/index?' + path,
            })
          } else{
            var memberCardId = res.path;
            wx.navigateTo({
              url: "/pages/merchant/verification/index?memberCardId=" + memberCardId
            })
          }
        }else {
          wx.showToast({
            title: '扫码失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  gotomobileQuery:e=>{
    wx.navigateTo({
      url: 'mobileQuery/index',
    })
  },

  //会员卡
  vipCard(e){
    var cardType = e.currentTarget.dataset.cardtype;
    var merchantId = that.data.merchantId;
    wx.navigateTo({
      url: "/pages/merchant/vipCard/index?merchantId=" + merchantId + '&cardType=' + cardType
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var dataUrl = "/account/myInfoM";
    var param = {};
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("首页", res);
        var records = res;
        if (res.code == "0000") {
          var telephone = res.telephone;
          var merchantId = res.merchantId;
          wx.setStorageSync('telephone', telephone); 
          wx.setStorageSync('merchantId', merchantId);
          that.setData({
            records: records,
            merchantId: merchantId
          });
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
    that.onShow();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.records) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})