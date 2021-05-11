// pages/index/merchant/verificationQRcode/index.js
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card: '',
    disabled: true,
    codename: '该卡已失效',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var orderId = options.data;
    var source = options.source;
    console.log(options)
    that.setData({
      orderId: orderId
    });
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
    that.cardDetail();
  },

  //核销详情
  cardDetail() {
    var orderId = that.data.orderId;
    var dataUrl = "/trade/order/writeOffScan";
    var param = {
      orderId: orderId
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log("核销卡页面返回", res);
        if (res.code == "0000") {
          var records = res.data;
          that.setData({
            card: records,
            cardType: records.writeOffStatus,
          });
          if (records.writeOffStatus == '0'){
            that.setData({
              disabled: false,
              codename: '核销',
            })
          } else{
            that.setData({
              disabled: true,
              codename: '该卡已失效',
            });
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          });
        }
      })
      .catch(function (res) {
        console.log(res)
      })
  },

 
  //核销
  formPrice() {
    var orderId = that.data.orderId;
    var cardType = that.data.cardType;
    var text = '确定要核销该商品吗？'
    if (cardType == '0'){
      wx.showModal({
        title: '提示',
        content: text,
        success(res) {
          if (res.confirm) {
            var dataUrl = "/trade/order/writeOff";
            var param = {
              orderId: orderId
            };
            wxRequest(dataUrl, param)
              .then(function (res) {
                //业务逻辑
                console.log("核销结果", res);
                if (res.code == "0000") {
                  wx.showToast({
                    title: '核销成功',
                    icon: 'success',
                    duration: 800
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/merchant/index'
                    })
                  }, 900)
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 800
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/merchant/index'
                    })
                  }, 900)
                }
              })
              .catch(function (res) {
                console.log(res)
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  //取消
  calloff:function(){
    wx.switchTab({
      url: '/pages/merchant/index'
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
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.cardDetail();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.card) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
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

  }
})