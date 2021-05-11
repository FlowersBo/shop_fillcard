const app = getApp();
const siteRoots = app.data.siteroot;
const wxRequest = (url, data) => {
  let token = wx.getStorageSync('token');
  console.log("请求里的token", token);
  let version = '1.0';
  data.version = version;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: siteRoots + url,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'authToken': token,
      },
      success: function (res) {
        console.log('请求数据地址', url);
        console.log("请求返回code",res.data.code)
        if (res.statusCode != 200) {
          resolve(res.data);
          wx.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none',
            duration: 1000
          });
          reject({ error: '服务器忙，请稍后重试', code: 500});
          return;
        }else if(res.data.code=="1010"){
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
        resolve(res.data);
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 });
      },
      complete: function (res) {
        // complete
      }
    })
  })
}

module.exports = wxRequest