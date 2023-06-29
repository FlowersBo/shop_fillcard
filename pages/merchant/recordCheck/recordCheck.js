// pages/merchant/recordCheck/recordCheck.js
let that;
var wxRequest = require('../../../utils/requestUrl.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordsList: [],
    current: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var dataUrl = "/card/expireRemindList";
    wxRequest(dataUrl, {
        page: {
          size: 20,
          current: 1
        }
      })
      .then(res => {
        //业务逻辑
        console.log("过期告警", res);
        if (res.code == "0000") {
          this.setData({
            recordsList: res.records,
            current: 1
          })
        }
      }).catch(err => {
        console.log(res)
      })
  },
    // 拨打电话
    calling(e){
      console.log(e)
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.telephone,
        success(){},
        fail(){}
      })
    },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.onShow();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    that.setData({
      current: 1
    })
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 页数+1  
    let current = that.data.current;
    current = current + 1;
    var dataUrl = "/card/expireRemindList";
    var param = {
      page: {
        size: 20,
        current: current
      },
    };
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages;
      if (pages < current) {
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
          var recordsList = that.data.recordsList;
          res.records.forEach(element => {
            recordsList = recordsList.push(element)
          });
          that.setData({
            recordsList: recordsList,
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
  onShareAppMessage() {

  }
})