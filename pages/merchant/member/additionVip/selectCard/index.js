// pages/merchant/member/additionVip/selectCard/index.js
var that;
var app = getApp();
var wxRequest = require('../../../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '',
    cardList: ''
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
    that.shopCardList();
  },

  //卡列表
  shopCardList() {
    var merchantId = wx.getStorageSync('merchantId');
    console.log(merchantId)
    var dataUrl = "/product/productListM";
    var param = {
      page: {
        size: 10,
        current: 1
      },
      merchantId: merchantId
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("卡列表", res);
        var records = res.records;
        if (res.code == "0000") {
          that.setData({
            cardList: records,
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
  //选择
  gotocardConsume(e) {
    var productId = e.currentTarget.dataset.productid;
    var productName = e.currentTarget.dataset.productname; 
    var cardType = e.currentTarget.dataset.cardtype;
    console.log(productId)
    var cardList = that.data.cardList;
    for (var i = 0; i < cardList.length; i++) {
      if (cardList[i].productId == productId) {
        cardList[i].isShow = 'card_contentShow';
      } else {
        cardList[i].isShow = 'card_content';
      }
    }
    that.setData({
      cardList: cardList
    })
    console.log(that.data.cardList);
    setTimeout(function() {
      var pages = getCurrentPages();
      // var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2]; //上一级页面
      prevPage.setData({
        productId: productId,
        productName: productName,
        cardType: cardType
      })
      wx.navigateBack({
        delta: 1,
      })
    }, 500)
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
    that.shopCardList();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.cardList) {
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
    var merchantId = that.data.merchantId;
    var dataUrl = "/product/productListM";
    var param = {
      page: {
        size: 10,
        current: current
      },
      merchantId: merchantId
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
          var moment_list = that.data.cardList;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            cardList: moment_list,
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