// pages/merchant/meWellat/bankCard/index.js
var that;
var app = getApp();
var wxRequest = require('../../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    that.bankCard();
  },

  //更换
  addBackCard: function() {
    wx.navigateTo({
      url: 'addBankCard/index',
    })
  },

  //银行卡信息
  bankCard() {
    var dataUrl = '/merchant/bankCardInfo';
    var param = {};
    wxRequest(dataUrl, param).then(res => {
      if (res.code == "0000") {
        console.log("银行卡", res);
        var bank = res;
        that.setData({
          bank: bank
        })
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1000
        })
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
    var dataUrl = "/merchant/bankCardInfo";
    var param = {};
    wxRequest(dataUrl, param).then(res => {
      console.log("银行卡返回", res);
      wx.showLoading({
        title: '玩命加载中',
      })
      if (res.code == "0000") {
        // 设置数据  
        var bank = res;
        that.setData({
          bank: bank
        })
        // 隐藏加载框  
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      }else{
        wx.hideLoading();
        wx.showToast({
          title: '刷新失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
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