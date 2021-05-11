// pages/index/merchant/verification/index.js
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card: '',
    codename: '扣次数',
    codename1: '扣金额',
    disabled: false,
    surplusCount: '',
    cardType: '0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var memberCardId = options.memberCardId;
    that.setData({
      memberCardId: memberCardId
    });
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
    that.cardDetail();
  },

  //核销详情
  cardDetail() {
    var memberCardId = that.data.memberCardId;
    var dataUrl = "/card/memberCardScan";
    var param = {
      memberCardId: memberCardId,
      scanType: 0
    };
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("核销卡页面返回", res);
        if (res.code == "0000") {
          var records = res;
          if(res.status==='6'){
            wx.redirectTo({
              url: 'refund/index?memberCardId='+memberCardId,
            })
          }
          that.setData({
            card: records,
            cardType: res.cardType,
            surplusCount: res.surplusCount,
            surplusAmount: res.surplusAmount
          });
          if (res.status === '1'||res.status === '7') {
            that.setData({
              disabled: true,
              codename: '该卡已失效',
              codename1: '该卡已失效',
            });
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          });
          that.setData({
            disabled: true,
            codename: '该卡已失效',
            codename1: '该卡已失效',
          });
        }
      })
      .catch(function(res) {
        console.log(res)
      })
  },

  //扣次数
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

  //核销次数
  formSubmit() {
    var writeOffCount = that.data.sNum;
    var memberCardId = that.data.memberCardId;
    let surplusCount = that.data.surplusCount;
    if (writeOffCount > surplusCount) {
      wx.showToast({
        title: '扣除失败',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var text = '确定要扣除' + writeOffCount + '次吗？'
    wx.showModal({
      title: '提示',
      content: text,
      success(res) {
        if (res.confirm) {
          var dataUrl = "/card/writeOff";
          var param = {
            writeOffCount: writeOffCount,
            memberCardId: memberCardId
          };
          wxRequest(dataUrl, param)
            .then(function(res) {
              //业务逻辑
              console.log("核销结果", res);
              if (res.code == "0000") {
                wx.showToast({
                  title: '核销成功',
                  icon: 'success',
                  duration: 800
                })
                setTimeout(function() {
                  wx.switchTab({
                    url: '/pages/merchant/index'
                  })
                }, 900)
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 800
                })
                setTimeout(function() {
                  wx.switchTab({
                    url: '/pages/merchant/index'
                  })
                }, 900)
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

  //扣金额
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
    console.log("输入的金额", price);
    that.setData({
      price: price
    });
    return price;
  },

  //核销金额
  formPrice: function() {
    //去除小数点
    if (that.data.price) {
      console.log('去除小数点')
      var y = String(that.data.price).indexOf(".") + 1;
      console.log('获取小数点的位置', y);
      var count = String(that.data.price).length - y;
      console.log('获取小数点后的个数', count);
      if (y > 0) {
        console.log("这个数字是小数，有" + count + "位小数");
        if (count == 0) {
          const reg2 = /(?:\.0*|(\.\d+?)0+)$/;
          that.data.price = that.data.price.replace(reg2, '$1');
          that.setData({
            price: that.data.price
          });
        }
      }
    }
    var price = that.data.price;
    var memberCardId = that.data.memberCardId;
    let surplusAmount = that.data.surplusAmount;
    if (price > surplusAmount) {
      wx.showToast({
        title: '扣除失败',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var text = '确定要扣除' + price + '元吗？'
    wx.showModal({
      title: '提示',
      content: text,
      success(res) {
        if (res.confirm) {
          var dataUrl = "/card/writeOff";
          var param = {
            writeOffCount: price,
            memberCardId: memberCardId
          };
          wxRequest(dataUrl, param)
            .then(function(res) {
              //业务逻辑
              console.log("核销结果", res);
              if (res.code == "0000") {
                wx.showToast({
                  title: '核销成功',
                  icon: 'success',
                  duration: 800
                })
                setTimeout(function() {
                  wx.switchTab({
                    url: '/pages/merchant/index'
                  })
                }, 900)
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 800
                })
                setTimeout(function() {
                  wx.switchTab({
                    url: '/pages/merchant/index'
                  })
                }, 900)
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
    that.cardDetail();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.card) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
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