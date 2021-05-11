// pages/index/merchant/member/index.js
var that;
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    memberList: [],
    isFang: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
  },
  //按办卡时间排序
  cardTimer: function() {
    console.log("111")
    var memberList = that.data.memberList;
    memberList.sort(function(a, b) {
      return Date.parse(b.createdTime) - Date.parse(a.createdTime); //时间倒序
    });
    that.setData({
      memberList: memberList
    })
  },
  //按消费时间
  cardJoinTime: function() {
    console.log("111")
    var memberList = that.data.memberList;
    memberList.sort(function(a, b) {
      return Date.parse(a.tradeLastTime) - Date.parse(b.tradeLastTime); //时间正序
    });
    that.setData({
      memberList: memberList
    })
  },
  //按使用次数
  cards: function() {
    console.log("111")
    var memberList = that.data.memberList;
    memberList.sort(function(a, b) {
      return Date.parse(b.tradeCount) - Date.parse(a.tradeCount);
    });
    that.setData({
      memberList: memberList
    })
  },
  //跳转添加会员
  additionFun(){
    wx.navigateTo({
      url: 'additionVip/index',
    })
  },
  //跳转会员详情
  merchantCard: function(e) {
    var accountId = e.currentTarget.dataset.accountid; 
    var telephone = e.currentTarget.dataset.telephone;
    console.log(accountId, telephone)
    if (accountId){
     wx.navigateTo({
       url: 'merchantCard/index?accountId=' + accountId,
     })
   }else{
      wx.navigateTo({
        url: 'merchantCard/index?telephone=' + telephone,
      })
   }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
      that.memberFun(telephone);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var telephone = '';
    that.memberFun(telephone);
    that.cardStatistics();
  },
  cardStatistics() {
    var productId = '';
    var dataUrl = "/card/cardStat?productId=" + productId;
    var param = {
      productId:productId
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("会员统计", res);
        if (res.code == "0000") {
          var cardstatistics = res;
          that.setData({
            cardstatistics:cardstatistics
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
  },

  //会员列表
  memberFun(telephone) {
    var dataUrl = "/card/memberList";
    var param = {
      page: {
        size: 20,
        current: 1
      },
      telephone: telephone
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("会员列表", res);
        if (res.code == "0000") {
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
      .catch(function(res) {
        console.log(res)
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
    var telephone = '';
    that.setData({
      telephone: telephone
    })
    that.memberFun(telephone);
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.memberList) {
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
    var telephone = that.data.telephone;
    var dataUrl = "/card/memberList";
    var param = {
      page: {
        size: 10,
        current: current
      },
      telephone: telephone
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
        setTimeout(function() {
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