// pages/merchant/member/additionVip/index.js
var that;
var app = getApp();
var wxRequest = require('../../../../utils/requestUrl.js');
var getDateStr = require('../../../../utils/dateStr.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '请选择到期时间',
    productId: '', //卡种id
    productName: '请选择卡种', //卡种名称
    cardType: '0' //卡种
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    // let count = Object.keys(options).length;
    // console.log(count)
    // if (count){
    //   var productId = options.productId;
    //   that.setData({ productId: productId });
    // }
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
    var start = getDateStr(null, 1);
    console.log(start);
    that.setData({
      start: start
    })
  },

  //次数
  watchNumber: function(e) {
    let sNum = e.detail.value;
    if (sNum.length == 1) {
      sNum = sNum.replace(/[^1-9]/g, '')
    } else {
      sNum = sNum.replace(/\D/g, '')
    }
    console.log("输入的次数", sNum);
    that.setData({
      sNum: sNum
    });
  },

  //剩余金额
  watchPrice: function(e) {
    let price = e.detail.value;
    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
    if (reg.test(price)) { //正则匹配通过，提取有效文本
      price = price.replace(reg, '$2$3$4');
      const reg1 = /0*([1-9]\d*|0\.\d+)/;
      price = price.replace(reg1, '$1');
    } else { //正则匹配不通过，直接清空
      price = '';
    }
    return price;
  },
  //时间
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //跳转选择卡种
  selectCardFun() {
    wx.navigateTo({
      url: 'selectCard/index',
    })
  },
  formSubmit: function(e) {
    var productId = that.data.productId;
    var mobile = e.detail.value.mobile;
    var number = e.detail.value.number;
    console.log('number', number)
    var date = e.detail.value.date;
    var surplusAmount = e.detail.value.price;
    //去除小数点
    if (e.detail.value.price) {
      console.log('去除小数点')
      var y = String(e.detail.value.price).indexOf(".") + 1;
      console.log('获取小数点的位置', y);
      var count = String(e.detail.value.price).length - y;
      console.log('获取小数点后的个数', count);
      if (y > 0) {
        console.log("这个数字是小数，有" + count + "位小数");
        if (count == 0) {
          const reg2 = /(?:\.0*|(\.\d+?)0+)$/;
          e.detail.value.price = e.detail.value.price.replace(reg2, '$1');
          that.setData({
            price: e.detail.value.price
          });
        }
      }
    }
    if (that.data.cardType == '1' && date == '请选择到期时间') {
      console.log(that.data.cardType)
      date = '';
    }
    var mobile_reg = /^1[3|4|5|6|7|8|9]\d{9}$/; //正则表达式
    if (mobile == "" || (!mobile_reg.test(mobile))) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (productId == '') {
      wx.showToast({
        title: '请选择卡种',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (number == '') {
      wx.showToast({
        title: '请输入会员卡剩余次数',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (surplusAmount == '') {
      wx.showToast({
        title: '请输入会员卡剩余金额',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (that.data.cardType == '0' && date == '请选择到期时间') {
      wx.showToast({
        title: '请选择到期时间',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      console.log('携带数据为：', e.detail.value);
      wx.showModal({
        title: '提示',
        content: '是否新增会员',
        success(res) {
          if (res.confirm) {
            var dataUrl = '/card/memberCardAdd';
            var param = {
              productId: productId,
              validity: date,
              surplusCount: number,
              telephone: mobile,
              cardType: that.data.cardType,
              surplusAmount: surplusAmount
            };
            wxRequest(dataUrl, param)
              .then(function(res) {
                //业务逻辑
                console.log("提交", res);
                if (res.code == '0000') {
                  wx.navigateBack({
                    delta: 1,
                  })
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
                  duration: 2000
                })
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
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
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})