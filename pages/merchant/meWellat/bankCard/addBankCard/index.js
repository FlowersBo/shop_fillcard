// pages/merchant/meWellat/bankCard/index.js
var that;
var app = getApp();
var wxRequest = require('../../../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscode: null, //用于存放验证码接口里获取到的code
    codename: '获取验证码',
    bankCard: '',
    bankName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var telephone = wx.getStorageSync('telephone')
    that.setData({
      telephone: telephone
    });
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


  bankCardFun(e) {
    var bankCard = e.detail.value;
    console.log(bankCard)
    that.setData({
      bankCard: bankCard
    });
  },
  bankNameFun(e) {
    var bankName = e.detail.value;
    that.setData({
      bankName: bankName
    });
  },
  //获取验证码
  getVerificationCode(e) {
    var bankCard = that.data.bankCard;
    var bankName = that.data.bankName;
    if (bankCard == "") {
      wx.showToast({
        title: '银行卡号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (bankCard.length < 16 || bankCard.length > 19) {
      wx.showToast({
        title: '银行卡号输入错误',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (bankName.length < 2 || bankName.length >= 10) {
      wx.showToast({
        title: '请输入持卡人姓名',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      that.getCode();
      that.setData({
        disabled: true
      })
    }
  },
  getCode: function() {
    var telephone = that.data.telephone;
    if (telephone) {
      var dataUrl = '/communal/sms/validateSms';
      var param = {
        telephone: telephone
      };
      wxRequest(dataUrl, param).then(res => {
        console.log("验证码返回", res)
        if (res.code == "0000") {
          var num = 61;
          var timer = setInterval(function() {
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
                timer: timer,
                disabled: true
              })
            }
          }, 1000)
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请稍后重试',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //表单提交
  formSubmit(e) {
    console.log(e);
    var bankCard = e.detail.value.bankCard;
    var bankName = e.detail.value.bankName;
    var bankCode = e.detail.value.bankCode;
    if (bankCard == "") {
      wx.showToast({
        title: '银行卡号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (bankCard.length < 16 || bankCard.length > 19) {
      wx.showToast({
        title: '银行卡号输入错误',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (bankCode == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (bankName.length < 2 || bankName.length >= 10) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      var dataUrl = '/merchant/bindBankCard';
      var param = {
        cardNO: bankCard,
        cardUserName: bankName,
        smsCode: bankCode
      };
      wxRequest(dataUrl, param).then(res => {
        console.log("表单返回信息", res);
        if (res.code == "0000") {
          wx.showToast({
            title: '绑卡成功',
            icon: 'success',
            duration: 800
          })
          setTimeout(function() {
            clearInterval(that.data.timer);
            that.setData({
              codename: '获取验证码',
              disabled: false
            })
            wx.redirectTo({
              url: '/pages/merchant/meWellat/bankCard/index'
            })
          }, 900)
        } else {
          var msg = res.msg;
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
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