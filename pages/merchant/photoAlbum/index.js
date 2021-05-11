// pages/merchant/photoAlbum/index.js
const app = getApp();
var siteRoots = app.data.siteroot;
var wxRequest = require('../../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // uploadedImages: [],
    current: 1,
    uploadPics: [],
    fileName: [],
    screenWidth: app.data.screenWidth, //屏幕宽度
  },

  onLoad: function (options) {
    that = this;
    var merchantId = options.merchantId;
    that.setData({
      merchantId: merchantId
    })
    that.photoAlbumFn();
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
  // 图片预览
  photoAlbumFn: function () {
    var merchantId = that.data.merchantId;
    console.log('店铺ID', merchantId);
    var dataUrl = "/merchant/photoList";
    var param = {
      merchantId: merchantId,
      page: {
        size: 15,
        current: 1
      },
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log('商家相册', res.records);
        if (res.code == '0000') {
          var uploadPics = res.records;
          that.setData({
            uploadPics: uploadPics,
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch(function (res) {
        console.log('请求失败', res);
      })
  },
  chooseImage: function () {
    // 选择图片
    var uploadPics = that.data.uploadPics;
    var count = 9;
    // var index = uploadPics.length;
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album'], // , 'camera'可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // var tempFilesSize = res.tempFiles[0].size; //获取图片的大小，单位B
        // console.log("图片大小", tempFilesSize);
        // if (tempFilesSize > 2000000) {
        //   wx.showToast({
        //     title: '上传图片不能大于2M!',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return false;
        // }
        console.log("返回相册", tempFilePaths);
        let images = uploadPics.concat(tempFilePaths);
        let token = wx.getStorageSync('token');
        console.log(images)
        images.forEach(function (tempFilePath) {
          wx.uploadFile({
            url: siteRoots + "/communal/upload/upload_oss?module=product",
            header: {
              'content-type': 'application/json', // 默认值
              'authToken': token,
            },
            filePath: tempFilePath,
            name: 'file',
            success: function (res) {
              console.log('返回参数', res);
              var res = JSON.parse(res.data);
              console.log('返回参数', res);
              if (res.code == "0000") {
                // uploadPics.push(res.filePath);
                // that.data.fileName.push(res.fileName);
                that.photoAddFn(res.fileName);
                // that.setData({
                //   uploadPics: uploadPics
                // });
                console.log('本地uploadPics', that.data.uploadPics);
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        })
      }
    })
  },
  // 图片添加
  photoAddFn: function (fileName) {
    wx.showLoading({
      title: '上传中...',
      mask: true,
    })
    var dataUrl = "/merchant/photoAdd";
    var param = {
      photoUrl: fileName
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log('添加图片', res);
        if (res.code == '0000') {
          wx.hideLoading();
          var photoItem= {};
          photoItem.photoUrl = res.photoUrl;
          photoItem.photoId = res.photoId;
          console.log('item',photoItem);
          var uploadPics = that.data.uploadPics;
          uploadPics.push(photoItem);
          // uploadPics.unshift(photoItem);
          console.log('添加后的',uploadPics)
          that.setData({
            uploadPics:uploadPics
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
        console.log('请求失败', res);
      })
  },
  
  // 图片预览
  previewImage: function (e) {
    console.log(e)
    var uploadPics = that.data.uploadPics;
    var images =[];
    for(var i=0;i<uploadPics.length;i++){
      images.push(uploadPics[i].photoUrl);
    }
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: images
    })
  },
  // 图片删除
  deleteFn: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var photoId = e.currentTarget.dataset.photoid;
    var uploadPics = that.data.uploadPics;
    wx.showModal({
      title: '提示',
      content: '是否删除该图片',
      success (res) {
        if (res.confirm) {
          uploadPics.splice(index, 1);
          that.setData({uploadPics:uploadPics});
          var dataUrl = "/merchant/photoDelete";
          var param = {
            photoId: photoId
          };
          wxRequest(dataUrl, param)
            .then(function (res) {
              //业务逻辑
              console.log('删除图片', res);
              if (res.code == '0000') {
      
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
            .catch(function (res) {
              console.log('请求失败', res);
            })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 图片置顶
  photoUpdateFn: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.index;
    var photoId = e.currentTarget.dataset.photoid;
    console.log('当前置顶id', id);
    var uploadPics = that.data.uploadPics;
    var fileName = that.data.fileName;
    if (id != 0) {
      // fieldData[index] = fieldData.splice(0, 1, fieldData[index])[0]; 这种方法是与另一个元素交换了位子，
      uploadPics.unshift(uploadPics.splice(id, 1)[0]);
      console.log('置顶', uploadPics);
      that.setData({
        uploadPics: uploadPics
      });
    }
    // uploadPics.forEach(function(){

    // })
    var dataUrl = "/merchant/photoUpdate";
    var param = {
      sort: 0,
      photoId: photoId
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log('图片置顶', res);
        if (res.code == '0000') {

        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch(function (res) {
        console.log('请求失败', res);
      })
  },

  // chooseImage: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     // count: 3, // 默认9
  //     sizeType: ['compressed'],//original 原图，compressed 压缩图，默认二者都有
  //     sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       var tempFilePaths = res.tempFilePaths;
  //       console.log(tempFilePaths);
  //       that.setData({
  //         images: that.data.images.concat(tempFilePaths)
  //       });
  //     }
  //   })
  // },
  // submit: function () {        
  //   // 提交图片，事先遍历图集数组
  //   that.data.images.forEach(function (tempFilePath) {
  //     new AV.File('file-name', {
  //       blob: {
  //         uri: tempFilePath,
  //       },
  //     }).save().then(                
  //       // file => console.log(file.url())
  //     function (file) {                    
  //       // 先读取
  //       var uploadedImages = that.data.uploadedImages;
  //       uploadedImages.push(file.url());                    
  //       // 再写入
  //       that.setData({
  //         uploadedImages: uploadedImages
  //       }); console.log(uploadedImages);
  //     }
  //     ).catch(console.error);
  //   });
  //   wx.showToast({
  //     title: '评价成功', success: function () {
  //       wx.navigateBack();
  //     }
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
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.photoAlbumFn();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.uploadPics) {
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
    var merchantId = that.data.merchantId;
    var dataUrl = "/merchant/photoList";
    var param = {
      page: {
        size: 15,
        current: current
      },
      merchantId: merchantId,
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
          var moment_list = that.data.uploadPics;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            uploadPics: moment_list,
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
  onShareAppMessage: function () {

  }
})