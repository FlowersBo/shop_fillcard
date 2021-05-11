// pages/index/index.js
var app = getApp();
var wxRequest = require('../../utils/requestUrl.js');
var random = require('../../resource/js/random.js');
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    statusBarHeights: app.globalData.statusBarHeights,
    nonce: '', //随机数
  },

  onLoad: function() {
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
    that.verificationCodeFun();
  },
  //获取验证码
  verificationCodeFun() {
    var nonce = random();
    console.log('随机数', nonce);
    wx.request({
      url: app.data.siteroot + '/communal/config/getCaptcha',
      responseType: 'arraybuffer',
      method: 'POST',
      data: {
        nonce: nonce,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("返回验证码", res);
        var code = wx.arrayBufferToBase64(res.data);
        code = 'data:image/png;base64,' + code
        console.log(code)
        that.setData({
          nonce: nonce,
          code: code
        })
      }
    })
  },

  //登录
  formSubmit: function(e) {
    console.log(e);
    var account = e.detail.value.account;
    var password = e.detail.value.password;
    var verificationCode = e.detail.value.verificationCode;
    var nonce = that.data.nonce;
    var dataUrl = "/auth/loginM";
    var param = {
      telephone: account,
      password: password,
      code: verificationCode,
      nonce: nonce
    };
    if (!(/^1[3456789]\d{9}$/.test(account)) || account.length < 11) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
      })
    } else {
      wxRequest(dataUrl, param)
        .then(function(res) {
          //业务逻辑
          console.log("登录", res);
          if (res.code == "0000") {
            var authToken = res.authToken;
            wx.setStorageSync('token', authToken);
            wx.switchTab({
              url: '/pages/merchant/index',
            })
          } else {
            var msg = res.msg;
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
          }
          //调用下一个请求
          // var dataUrl = "";
          // var param = {}
          // return wxRequest(dataUrl, param);
        })
        .catch(function(res) {
          console.log(res)
        })
      //   .then(function(res) {
      //     //业务逻辑
      //   })
    }
  },

  //找回密码
  findPassword: function() {
    wx.navigateTo({
      url: 'findPassword/index',
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
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 500)
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