// pages/merchant/meWallet/index.js
var that;
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billList: [],
    current: 1,
    amount: '',
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
    var dataUrl = "/account/myInfoM";
    var param = {
      page: {}
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log('钱包返回', res);
        console.log("余额", res.amount);
        var personal = res;
        var amount = personal.amount; //余额
        var bindCardStatus = personal.bindCardStatus;
        if (res.code == "0000") {
          that.setData({
            amount: amount,
            bindCardStatus: bindCardStatus
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
    that.billFun();
  },
  //账单列表
  billFun() {
    var dataUrl = "/trade/bill/billListM";
    var param = {
      page: {
        size: 20,
        current: 1
      }
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("账单列表", res);
        if (res.code == "0000") {
          var records = res.records;
          that.setData({
            billList: records,
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
        }
      })
      .catch(function(res) {
        console.log(res)
      })
  },
  //跳转银行卡
  bankCard() {
    var bindCardStatus = that.data.bindCardStatus;
    if (bindCardStatus == '0') {
      wx.navigateTo({
        url: 'bankCard/index',
      })
    } else {
      wx.navigateTo({
        url: 'bankCard/addBankCard/index',
      })
    }
  },
  //提现
  withdrawFun() {
    var amount = that.data.amount;
    if (amount >= 100) {
      var dataUrl = '/trade/withdraw/withdrawFee';
      var param = {
        accountType: 1,
        amount: amount
      };
      wxRequest(dataUrl, param).then(res => {
          console.log("提现信息返回", res);
          if (res.code == "0000") {
            var feeDesc = res.feeDesc;
            wx.showModal({
              title: '提示',
              content: feeDesc,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  var dataUrl = '/trade/withdraw/withdraw';
                  var param = {
                    accountType: 1,
                    amount: amount
                  };
                  wxRequest(dataUrl, param).then(res => {
                      console.log("提现返回", res);
                      if (res.code == "0000") {
                        wx.showToast({
                          title: '提现金额在1-2个工作日到您的银行账户',
                          icon: 'none',
                          duration: 3000
                        })
                        that.onShow();
                      } else {
                        wx.showToast({
                          title: res.msg,
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    })
                    .catch(function(res) {
                      wx.showToast({
                        title: res.error,
                        icon: 'none',
                        duration: 1000
                      })
                    })

                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
        .catch(function(res) {
          wx.showToast({
            title: res.error,
            icon: 'none',
            duration: 1000
          })
        })

    } else {
      wx.showToast({
        title: '金额小于100无法提现',
        icon: 'none',
        duration: 1000
      })
    }
  },

  //提现记录
  withdrawRecordFun() {
    wx.navigateTo({
      url: 'withdrawRecord/index',
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
    if (that.data.billList) {
      that.data.current = 1;
      // 隐藏导航栏加载框  
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
    var dataUrl = "/trade/bill/billListM";
    var param = {
      page: {
        size: 20,
        current: current
      },
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
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      } else {
        console.log("玩命加载中")
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.billList;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            billList: moment_list,
            current: current
          })
          // 隐藏加载框  
          setTimeout(function() {
            wx.hideLoading()
          }, 500)
        } else {
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