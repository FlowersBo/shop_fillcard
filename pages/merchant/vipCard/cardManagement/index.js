// pages/index/merchant/vipCard/cardManagement/index.js
var that;
var app = getApp();
var wxRequest = require('../../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productName:'',
    current: 1,
    memberCardList:[],
    isFang: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options)
    var productId = options.productId;
    var productName = options.productName;
    var cardType = options.cardType;
    if (cardType == '0') {
      wx.setNavigationBarTitle({
        title: '次卡管理'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '储值卡管理'
      })
    }
    that.setData({ productId: productId, productName: productName, cardType: cardType});
  },
  //按办卡时间排序
  cardTimer:function(){
    console.log("111")
    var memberCardList = that.data.memberCardList;
    memberCardList.sort(function (a, b) {
      return Date.parse(b.createdTime) - Date.parse(a.createdTime);//时间倒序
    });
    that.setData({ memberCardList: memberCardList})
  },
  cardJoinTime: function () {
    console.log("111")
    var memberCardList = that.data.memberCardList;
    memberCardList.sort(function (a, b) {
      return Date.parse(a.lastTradeTime) - Date.parse(b.lastTradeTime);//时间正序
    });
    that.setData({ memberCardList: memberCardList })
  },
  cards: function () {
    console.log("111")
    var memberCardList = that.data.memberCardList;
    memberCardList.sort(function (a, b) {
      return Date.parse(b.surplusCount) - Date.parse(a.surplusCount);
    });
    that.setData({ memberCardList: memberCardList })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  //手机号查找
  telephoneFun(e){
    console.log(e);
    var telephone = e.detail.value;
    if (!(/^1[3456789]\d{9}$/.test(telephone)) || telephone.length < 11) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.setData({ telephone: telephone });
    }
  },
  //查找
  formSubmit(){
    var telephone = that.data.telephone;
    that.memberCardFun(telephone);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var productId = that.data.productId;
    var dataUrl = "/card/cardStat?productId=" + productId;
    var param = {
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log("统计", res);
        if (res.code == "0000") {
          var statistics = res;
          that.setData({ statistics: statistics});
        }
      })
      .catch(function (res) {
        console.log(res)
      })
    var telephone = '';
    that.memberCardFun(telephone);
  },
  //会员管理列表
  memberCardFun(telephone){
    var productId = that.data.productId;
    var dataUrl = "/card/memberCardListM";
    var param = {
      page: {
        size: 10,
        current: 1
      },
      productId: productId,
      telephone: telephone
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log("列表", res);
        if (res.code == "0000") {
          var memberCardList = res.records;
          that.setData({ memberCardList: memberCardList, current: 1});
          if (res.records.length > 0) {
            that.setData({
              isFang: true
            });
          } else {
            that.setData({
              isFang: false
            });
          }
        }
        //调用下一个请求
        // var dataUrl = "";
        // var param = {}
        // return wxRequest(dataUrl, param);
      })
      .catch(function (res) {
        console.log(res)
      })
      //   .then(function(res) {
      //     //业务逻辑

      //   })
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
    that.onShow();
    var telephone = '';
    that.setData({ telephone: telephone});
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.statistics) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 页数+1  
    let current = that.data.current;
    var productId = that.data.productId;
    current = current + 1;
    var dataUrl = "/card/memberCardListM";
    var telephone = '';
    var param = {
      page: {
        size: 10,
        current: current
      },
      productId: productId,
      telephone: telephone,
    };
    console.log("页数", param);
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages;
      console.log("服务器总页数", pages);
      console.log("卡列表", res.records);
      if (pages < current) {
        console.log("暂时没有更多了")
        wx.showLoading({
          title: '暂时没有更多了',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else {
        console.log("玩命加载中")
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.memberCardList;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            memberCardList: moment_list,
            current: current
          })
          // 隐藏加载框  
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})