// pages/index/merchant/vipCard/index.js
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    cardList: [],
    isFang: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var merchantId = options.merchantId;
    var cardType = options.cardType;
    that.setData({
      merchantId: merchantId,
      cardType: cardType
    })
    if (cardType == '0') {
      wx.setNavigationBarTitle({
        title: '次卡管理'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '储值卡管理'
      })
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
    that.shopCardList();
  },

  //卡列表
  shopCardList() {
    var merchantId = that.data.merchantId;
    var dataUrl = "/product/productListM";
    var param = {
      page: {
        size: 10,
        current: 1
      },
      merchantId: merchantId,
      cardType: that.data.cardType
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("卡列表", res);
        var records = res.records;
        for (var i = 0; i < records.length; i++) {
          console.log('当前卡类型', records[i].cardType);
          if (records[i].cardType=='1'){
            records[i].price = records[i].price + records[i].giveAmount;
            records[i].price = records[i].price.toFixed(2);
            var regexp = /(?:\.0*|(\.\d+?)0+)$/;
            records[i].price = records[i].price.replace(regexp, '$1')
          }
        }
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
  //跳转会员卡管理
  cardManagement: function(e) {
    console.log(e)
    var cardType = that.data.cardType;
    var productId = e.currentTarget.dataset.productid;
    var productName = e.currentTarget.dataset.productname;
    wx.navigateTo({
      url: 'cardManagement/index?productId=' + productId + '&productName=' + productName + '&cardType=' + cardType,
    })
  },

  // 添加会员卡
  additionFun() {
    var cardType = that.data.cardType;
    if (cardType == '0') {
      wx.navigateTo({
        url: 'additionCard/index',
      })
    } else {
      wx.navigateTo({
        url: 'additionallyCard/index',
      })
    }
  },
  // 上下架
  soldOutFun(e) {
    var productId = e.currentTarget.dataset.productid;
    var status = e.currentTarget.dataset.status;
    if (status == 1) {
      status = 0;
      var statusName = "上架";
    } else {
      status = 1;
      var statusName = "下架";
    }
    console.log('上下架状态', status);
    wx.showModal({
      title: '提示',
      content: '是否' + statusName + '该会员卡',
      success(res) {
        if (res.confirm) {
          var dataUrl = "/product/startOrStop";
          var param = {
            productId: productId,
            status: status
          };
          wxRequest(dataUrl, param)
            .then(function(res) {
              //业务逻辑
              console.log("上下架", res);
              if (res.code == "0000") {
                that.shopCardList();
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //修改
  amendFun(e) {
    var productId = e.currentTarget.dataset.productid;
    var cardType = e.currentTarget.dataset.cardtype;
    if (cardType == '0') {
      wx.navigateTo({
        url: 'additionCard/index?productId=' + productId,
      })
    } else {
      wx.navigateTo({
        url: 'additionallyCard/index?productId=' + productId,
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
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.shopCardList();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.cardList) {
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
    let cardType = that.data.cardType;
    current = current + 1;
    var merchantId = that.data.merchantId;
    var dataUrl = "/product/productListM";
    var param = {
      page: {
        size: 10,
        current: current
      },
      merchantId: merchantId,
      cardType: cardType
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
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
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