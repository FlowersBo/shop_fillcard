// pages/user/index.js
var app = getApp();
var wxRequest = require('../../utils/requestUrl.js');
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    personal:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var dataUrl = "/account/myInfoM";
    var param = {
      page: {
      }
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log("个人中心", res);
        var personal = res;
        var amount = personal.amount; //余额
        var mpCode = personal.mpCode; //二维码
        if(res.code=="0000"){
          that.setData({ personal: personal, amount: amount});
        }
      })
      .catch(function (res) {
        console.log(res)
      })
  },
  //跳转基本信息
  order(){
    var personal = JSON.stringify(that.data.personal);
    wx.navigateTo({
      url: 'orderUser/index?personal=' + personal,
    })
  },
  //跳转钱包
  gotoWallet(){
    var amount = that.data.amount;
    wx.navigateTo({
      url: '/pages/merchant/meWellat/index?amount=' + amount,
    })
  },
  //跳转商家二维码
  twoDimension(){
    var personal = JSON.stringify(that.data.personal);
    wx.navigateTo({
      url: 'twoDimension/index?personal=' + personal,
    })
  },
  //退出登录
  quitBtn(){
    wx.showModal({
      title: '提示',
      content: '确定退出当前账号',
      success(res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'token',
            success(res) {
              wx.navigateTo({
                url: '/pages/index/index',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //更改密码
  findPassword: function () {
    wx.navigateTo({
      url: '/pages/index/findPassword/index',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})