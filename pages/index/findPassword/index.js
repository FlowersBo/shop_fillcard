var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    statusBarHeights: app.globalData.statusBarHeights,
    codename: '获取验证码',
    mobile: ''
  },

  onLoad: function() {
    that = this;
  },

  //获取手机验证码
  //获取手机号
  bindMobile(e) {
    var mobile = e.detail.value;
    that.setData({
      mobile: mobile
    });
  },
  getVerificationCode() {
    var mobile = that.data.mobile;
    if (mobile == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!(/^1[3456789]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
    } else {
      that.getCode(mobile);
      that.setData({
        disabled: true
      })
    }
  },
  getCode: function(mobile) {
    var dataUrl = '/communal/sms/validateSms';
    var param = {
      telephone: mobile
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("验证码返回", res)
      if (res.code == "0000") {
        var num = 61;
        let timer = setInterval(function() {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            that.setData({
              codename: '重新发送',
              disabled: false
            })
          } else {
            that.setData({
              codename: num + "s",
              disabled: true,
              timer: timer
            })
          }
        }, 1000)
      } else {
        setTimeout(function() {
          that.setData({
            disabled: false
          })
        }, 2000)
      }
    })
  },
  //验证码
  bindCode(e) {
    console.log(e);
    if (e.detail.value.length >= 4) {
      that.setData({
        disabled1: false
      });
    } else {
      that.setData({
        disabled1: true
      });
    }
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

  },


  //提交
  formSubmit: function(e) {
    console.log('提交所需参数', e);
    var account = e.detail.value.account;
    var newPassword = e.detail.value.newPassword;
    var password = e.detail.value.password;
    var smsCode = e.detail.value.mobileCode;
    if (account == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (smsCode == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (newPassword.length < 6 && password.length < 6) {
      wx.showToast({
        title: '密码不能小于6位',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (newPassword !== password) {
      wx.showToast({
        title: '两次输入密码不一致',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      var dataUrl = "/auth/passwordSet";
      var param = {
        telephone: account,
        password: password,
        smsCode: smsCode
      };
      wxRequest(dataUrl, param)
        .then(function(res) {
          //业务逻辑
          console.log("改密码", res);
          if (!(/^1[3456789]\d{9}$/.test(account)) || account.length < 11) {
            wx.showToast({
              title: '手机号有误',
              icon: 'none',
              duration: 2000
            })
          } else {
            if (res.code == "0000") {
              that.setData({
                codename: '获取验证码',
                disabled: false
              })
              clearInterval(that.data.timer);
              wx.navigateBack({
                delta: 1
              })
            } else {
              var msg = res.msg;
              wx.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
              })
            }
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(that.data.timer)
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