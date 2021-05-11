// pages/merchant/verification/refund/index.js
var app = getApp();
var wxRequest = require('../../../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardDetails: '',
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var memberCardId = options.memberCardId;
    // memberCardId = 512;
    that.setData({
      memberCardId: memberCardId
    })
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
    that.refundFn();
  },

  refundFn: function () {
    var memberCardId = that.data.memberCardId;
    var dataUrl = "/card/memberCardScan";
    var param = {
      memberCardId: memberCardId,
      scanType: 0
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("会员卡详情", res);
      if (res.code == "0000") {
        var cardDetails = res;
        that.setData({
          cardDetails: cardDetails
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  // 取消按钮
  cancelClick: function () {
    console.log("11")
    wx.switchTab({
      url: '/pages/merchant/index',
    })
  },

  // 确认/拒绝退卡
  refundClick: function (e) {
    let currentStatu = e.currentTarget.dataset.statu;
    let opertype = e.currentTarget.dataset.opertype;
    that.setData({
      opertype: opertype
    });
    that.util(currentStatu);
  },
  // 模态动画
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 400, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    // 第3步：执行第一组动画
    animation.opacity(0).step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 400)
    // 显示
    if (currentStatu == "open") {
      var opertype = that.data.opertype;
      if(opertype==='0'){
        var refundDesc = '确认退卡吗？';
      }else{
        var refundDesc = '确认拒绝退卡吗？';
      }

      that.setData({
        showModalStatus: true,
        refundDesc: refundDesc
      });
    }
  },
  submitFun: function (e) {
    var memberCardId = that.data.memberCardId;
    var opertype = that.data.opertype;
    var dataUrl = "/card/refundOper";
    var param = {
      memberCardId: memberCardId,
      operType: opertype
    };
    wxRequest(dataUrl, param).then(res => {
      console.log(" 确认/拒绝退卡", res);
      if (res.code == "0000") {
        that.setData({
          showModalStatus: false
        });
        wx.showToast({
          title: '已处理',
          icon: 'success',
          mask: true,
          duration: 2000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/merchant/index',
          })
        }, 2000);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
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
    that.refundFn();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.cardDetails) {
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