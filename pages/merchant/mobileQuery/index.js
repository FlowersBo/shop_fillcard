// pages/mobileQuery/index.js
var that;
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList: [],
    current: 1,
    isFang: true,
    accountId: '',
    telephone: ''
  },

  //手机号查找
  telephoneFun(e) {
    console.log(e);
    var telephone = e.detail.value;
    that.setData({
      telephone: telephone
    });
  },

  formSubmit() {
    var telephone = that.data.telephone;
    if (!(/^1[3456789]\d{9}$/.test(telephone)) || telephone.length < 11) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.memberCardFun();
    }
  },

  //列表
  memberCardFun() {
    var accountId = that.data.accountId;
    var dataUrl = "/card/memberCardListM";
    var param = {
      page: {
        size: 20,
        current: 1
      },
      telephone: that.data.telephone
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log("会员卡列表", res);
        if (res.code == '0000') {
          var records = res.records;
          that.setData({
            memberList: records,
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
      .catch(function (res) {
        console.log(res)
      })
  },

  //卡跳转
  gotocardConsume: function (e) {
    var memberCardId = e.currentTarget.dataset.membercardid;
    var memberCardName = e.currentTarget.dataset.membercardname;
    var cardType = e.currentTarget.dataset.cardtype;
    console.log(memberCardId, memberCardName, cardType)
    wx.navigateTo({
      url: '/pages/merchant/verification/index?memberCardId=' + memberCardId + '&memberCardName=' + memberCardName + '&cardType=' + cardType,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    if (that.data.telephone) {
      that.memberCardFun();
    }
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.memberList) {
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
    current = current + 1;
    var dataUrl = "/card/memberCardListM";
    var param = {
      page: {
        size: 20,
        current: current
      },
      telephone: that.data.telephone
    };
    console.log("页数", param);
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages;
      console.log("服务器总页数", pages)
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
          var moment_list = that.data.memberList;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            memberList: moment_list,
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