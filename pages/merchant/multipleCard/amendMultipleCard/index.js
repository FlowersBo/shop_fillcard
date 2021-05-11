// pages/merchant/vipCard/additionallyCard/index.js
var that;
var app = getApp();
var siteRoots = app.data.siteroot;
var wxRequest = require('../../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked1: true,
    checked2: false,
    disabled: false, //input是否禁用
    uploadPics: [],
    isShow: "item",
    message: '', //回显
    merchantId: '',
    disabledBtn: false, //提交是否禁用
    color: '',
    auto_height: false, //textarea高度自适应
    checkbox: false, //是否选择有效期
    state: 'flang' //是否隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var merchantId = options.merchantId;
    that.setData({
      merchantId: merchantId
    });
    if (merchantId) {
      that.productFun(merchantId);
      wx.setNavigationBarTitle({
        title: '修改多倍储值卡',
      })
      // that.setData({
      //   color: '#DCDCDC;'
      // })
    }
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

  //回显
  productFun(merchantId) {
    var dataUrl = "/product/labelProduct";
    var param = {
      merchantId: merchantId,
      productLabel: 0
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log("回显", res);
        if (res.code == "0000") {
          var message = res.data;
          var sNum = '';
          var startTime = '';
          if (message.validityType == "0") {
            sNum = message.validityNum;
            var checked1 = true;
            var checked2 = false;
            if (sNum) {
              var state = 'state';
              var checkbox = true;
              that.setData({
                state: state,
                checkbox: checkbox
              })
            }
          } else if (message.validityType == "1") {
            startTime = message.validityNum;
            var checked2 = true;
            var checked1 = false;
            if (startTime) {
              var state = 'state';
              var checkbox = true;
              that.setData({
                state: state,
                checkbox: checkbox
              })
            }
          } else {
            var checked1 = true;
            var checked2 = false;
          }
          var uploadPics = [];
          uploadPics.push(message.pic)
          if (uploadPics.length >= 1) {
            that.setData({
              isShow: "none"
            })
          }
          that.setData({
            disabled: false,
            auto_height: true,
            cardName: message.productName,
            checked1: checked1,
            checked2: checked2,
            sNum: sNum,
            startTime: startTime,
            time: startTime,
            uploadPics: uploadPics,
            placeholder: message.usageRule,
            cardOnce: message.multiple, //倍数
            tNum: message.useLimitHour,
          })
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


  //储值倍数
  cardOnceFun: function (e) {
    let cardOnce = e.detail.value;
    var str = cardOnce;
    var len1 = str.substr(0, 1);
    var len2 = str.substr(1, 1);
    //如果第一位是0，第二位不是点，就用数字把点替换掉
    if (str.length > 1 && len1 == 0 && len2 != ".") {
      str = str.substr(1, 1);
    }
    //第一位不能是.
    if (len1 == ".") {
      str = "";
    }
    //限制只能输入一个小数点
    if (str.indexOf(".") != -1) {
      var str_ = str.substr(str.indexOf(".") + 1);
      if (str_.indexOf(".") != -1) {
        str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
      }
    }
    //正则替换，保留数字和小数点
    str = (str.match(/^\d*(\.?\d{0,1})/g)[0]) || null
    // return str;
    console.log("输入倍数", str);
    that.setData({
      cardOnce: str
    });
  },

  //设置有效期显示隐藏
  checkboxChange: function (e) {
    console.log('显示有效期', e);
    var state = false;
    if (e.detail.value[0] == 'cb') {
      that.setData({
        state: 'state'
      })
    } else {
      that.setData({
        state: 'flang',
        checked1: true,
        sNum: '',
        checked2: false,
        startTime: '请选择截止时间',
        time: ''
      })
    }
  },
  //小时
  timerNumber: function (e) {
    let tNum = e.detail.value;
    if (tNum.length == 1) {
      tNum = tNum.replace(/[^1-9]/g, '')
    } else {
      tNum = tNum.replace(/\D/g, '')
    }
    console.log("输入的小时数", tNum);

    that.setData({
      tNum: tNum,
    });
  },
  //天数
  watchNumber: function (e) {
    let sNum = e.detail.value;
    if (sNum.length == 1) {
      sNum = sNum.replace(/[^1-9]/g, '')
    } else {
      sNum = sNum.replace(/\D/g, '')
    }
    console.log("输入的次数", sNum);
    var checked1 = true;
    var checked2 = false;
    that.setData({
      sNum: sNum,
      checked1: true,
      checked2: false
    });
  },

  //时间选择
  bindTimeChange: function (e) {
    var checked1 = false;
    var checked2 = true;
    that.setData({
      checked1: false,
      checked2: true,
      startTime: e.detail.value
    });
  },
  //textarea输入
  inputs: function (e) {
    var cursor = e.detail.cursor;
    var cursorValue = e.detail.value;
    that.setData({
      cursorValue: cursorValue,
      cursor: cursor
    })
  },
  chooseImage: function () {
    // 选择图片
    var uploadPics = that.data.uploadPics;
    uploadPics = [];
    var count = 1;
    var index = uploadPics.length;
    count = count - index;
    if (count > 0) {
      wx.chooseImage({
        count: count, // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          var tempFilesSize = res.tempFiles[0].size; //获取图片的大小，单位B
          console.log("图片大小", tempFilesSize);
          if (tempFilesSize > 2000000) {
            wx.showToast({
              title: '上传图片不能大于2M!',
              icon: 'none',
              duration: 2000
            })
            return false;
          }
          console.log(tempFilePaths);
          let token = wx.getStorageSync('token');
          for (var i = 0; i < tempFilePaths.length; i++) {
            wx.uploadFile({
              url: siteRoots + "/communal/upload/upload_oss?module=product",
              header: {
                'content-type': 'application/json', // 默认值
                'authToken': token,
              },
              filePath: tempFilePaths[i],
              name: 'file',
              success: function (res) {
                // var uploadPics = that.data.uploadPics;
                var res = JSON.parse(res.data);
                console.log('返回参数', res);
                if (res.code == "0000") {
                  uploadPics.push(res.filePath);
                  var fileName = res.fileName;
                  that.setData({
                    uploadPics: uploadPics,
                    fileName: fileName
                  });
                  console.log('本地返回uploadPics', that.data.uploadPics);
                  if (uploadPics.length >= 1) {
                    that.setData({
                      isShow: "none"
                    })
                  }
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          }
        }
      })
    }
  },

  // 提交
  formSubmit: function (e) {
    console.log('submit携带数据：', e.detail.value);
    wx.showModal({
      title: '提示',
      content: '是否提交会员卡信息',
      success(res) {
        if (res.confirm) {
          console.log('传参', e.detail.value);
          var fileName = that.data.fileName;
          console.log('state状态', that.data.state);
          if (that.data.state == 'state') {
            if (e.detail.value.radioGroup == '0') {
              var validityType = e.detail.value.radioGroup;
              var validityNum = e.detail.value.timer;
              if (!validityNum) {
                wx.showToast({
                  title: '请输入过期天数',
                  icon: 'none',
                  duration: 2000
                })
                return false;
              }
            } else {
              var validityType = e.detail.value.radioGroup;
              var validityNum = e.detail.value.startTime;
              if (!validityNum) {
                wx.showToast({
                  title: '请选择截止日期',
                  icon: 'none',
                  duration: 2000
                })
                return false;
              }
            }
          }
          if (!e.detail.value.cardName) {
            wx.showToast({
              title: '请输入会员卡名称',
              icon: 'none',
              duration: 2000
            })
            return false;
          } else if (!e.detail.value.cardOnce) {
            wx.showToast({
              title: '请输入储值倍数',
              icon: 'none',
              duration: 2000
            })
            return false;
          } else if (!e.detail.value.placeholder) {
            wx.showToast({
              title: '请输入会员卡消费须知',
              icon: 'none',
              duration: 2000
            })
            return false;
          } else {
            var dataUrl = "/product/multipleStoreCardSet";
            // var discount = e.detail.value.cardOnce ? e.detail.value.cardOnce : '0';
            var param = {
              productName: e.detail.value.cardName,
              multiple: e.detail.value.cardOnce, //倍数
              useLimitHour: e.detail.value.effectiveTime,
              validityNum: validityNum,
              validityType: validityType,
              usageRule: e.detail.value.placeholder,
              pic: fileName,
            };
            wxRequest(dataUrl, param)
              .then(function (res) {
                //业务逻辑
                console.log("上传结果", res);
                if (res.code == "0000") {
                  that.setData({
                    disabledBtn: true
                  });
                  wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function () {
                    that.setData({
                      disabledBtn: false
                    });
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 2000)
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
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 图片预览
  // previewImage: function (e) {
  //   var current = e.target.dataset.src;
  //   console.log(current);
  //   var uploadPics = that.data.uploadPics;
  //   wx.previewImage({
  //     current: current,
  //     urls: uploadPics
  //   })
  // },
  //删除图片
  // delete: function (e) {
  //   var that = this;
  //   console.log(e);
  //   var key = e.currentTarget.dataset.key;
  //   var index = e.currentTarget.dataset.index;
  //   var dataUrl = '/t_pile/upload/delete';
  //   var param = {
  //     key: key
  //   }
  //   wxRequest(dataUrl, param).then(res => {
  //     console.log("返回的参数", res)
  //   })
  //   var uploadPics = that.data.uploadPics;
  //   console.log(uploadPics.length);
  //   uploadPics.splice(index, 1);
  //   if (uploadPics.length <= 3) {
  //     that.setData({ isShow: "item" });
  //   }
  //   that.setData({
  //     uploadPics: uploadPics
  //   });
  // },


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
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500)
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