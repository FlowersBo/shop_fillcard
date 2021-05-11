// pages/merchant/multipleCard/index.js
var that;
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectOpen:["",""],
    _num: '',
  },
  
  // 上下架
  switchChange(_ref) {
    var tab = _ref.currentTarget.dataset.index;
    var selectOpen = that.data.selectOpen;
    var productId = that.data.productId;
    var status =  that.data.status;
    console.log(productId)
    if (tab == "0") {
      selectOpen[1] = '已下架';
      selectOpen[0] = '';
      status = 1;
      var statusName = "下架";
      var _num = 0;
    } else{
      selectOpen[1] = '';
      selectOpen[0] = '已上架';
      var statusName = "上架";
      status = 0;
      var _num = 1;
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
            selectOpen:selectOpen
                that.setData({
                  selectOpen:selectOpen,
                  _num:_num
                })
                that.multipleCardFn();
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var merchantId = options.merchantId;
    console.log(merchantId);
    that.setData({merchantId:merchantId});
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
    that.multipleCardFn();
  },
  multipleCardFn: function(){
    var merchantId = that.data.merchantId;
    var dataUrl = "/product/labelProduct";
    var param = {
      merchantId: merchantId,
      productLabel: 0
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log('多倍卡', res);
        if (res.code == "0000") {
          var multipleCard = res.data;
          var count = res.count;
          console.log(count=='0');
          if(count=='0'){
            var mpCode = multipleCard.mpCode;
            var status = multipleCard.status;
            var productId = multipleCard.productId;
            var selectOpen = that.data.selectOpen;
            var _num = that.data._num;
            if(status == 0){
              selectOpen[1] = '';
              selectOpen[0] = '已上架';
              _num = 1;
            }else{
              selectOpen[1] = '已下架';
              selectOpen[0] = '';
              _num = 0;
            }
            that.setData({
              multipleCard: multipleCard,
              mpCode: mpCode,
              status: status,
              productId: productId,
              count: count,
              selectOpen:selectOpen,
              _num:_num
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

  // 二维码
  multipleQrCode:function(){
    var status =  that.data.status;
    if(status=='0'){
      var mpCode = that.data.mpCode;
      wx.navigateTo({
        url: 'multipleQrCode/index?mpCode='+mpCode,
      })
    }
  },
  
  // 修改
  amendMultipleCard:function(){
    var merchantId = that.data.merchantId;
    wx.navigateTo({
      url: 'amendMultipleCard/index?merchantId='+merchantId,
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
    that.multipleCardFn();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.multipleCard) {
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