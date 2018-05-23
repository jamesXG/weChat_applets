import {
  Config
} from 'config'; //配置文件

class Base {
  constructor() {
    this.baseRequestUrl = Config.baseUrl;
  }
  // 请求API方法
  request(params) {
    var url = this.baseRequestUrl + params.url;
    if (!params.type) {
      params.type = 'GET';
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageInfoSync('token')
      },
      success: function (res) {
        params.sCallback && params.sCallback(res.data);
      },
      fail: function (err) {
        params.sCallback && params.sCallback(res);
      }
    })
  }
  // 获取元素绑定的值
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }
  showLoading(title = '加载中……') {
    wx.showLoading({
      title: title
    })
  }
  /**
   * @successRunClass 需要执行的方法
   */
  showModal(content, isReturn = true, isShowCancel = false, callback) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: isShowCancel,
      success: function (res) {
        if (isReturn) {
          wx.navigateBack({
            data: 1
          })
        } else if (res.cancel) {
          wx.navigateBack({
            data: 1
          })
        } else if (res.confirm) {
          callback('ok')
        }
      }
    })
  }
  // 设置缓存
  setLocationStorage(key, data, callback) {
    // let isExist = this.isExistCached(key, (res) => {
    let res = wx.getStorageSync(key);
    // console.log(res)
    if (!res.hasOwnProperty('data')) {
      wx.setStorage({
        key: key,
        data: this.setCacheData(data)
      });
      callback('success');
    } else {
      callback(key + ' is existed');
    }
    // });
  }
  // 设置给定缓存的有效期(已废弃，请采用setCacheData())
  getCacheExpired(cacheName) {
    let expired = new Date().getTime() + Config.expired;
    if (cacheName instanceof Array) {
      cacheName[cacheName.length] = expired;
    } else {
      cacheName.expired = expired;
    }
  }

  // 设置需要缓存的数据并给加上缓存时间
  setCacheData(data) {
    let expired = new Date().getTime() + Config.expired;
    function oResult(data) {
      this.result = data;
      this.expired = expired;
    }

    return new oResult(data);
  }

  /**
   * 判断缓存是否过期
   * @param cacheName 缓存的key值
   * @param data 传入的缓存数据
   * @return true:过期了；false:没有过期
   */
  isExpired(cacheName, data) {
    let nowTime = new Date().getTime();
    if (data instanceof Array) {
      let len = data.length;
      return nowTime > data[len - 1] ? true : false;
    } else {
      return nowTime > data.expired ? true : false;
    }
  }
  /**
   * 最佳路径路径导航  driving: 驾车  walking： 步行  transit： 公交
   */
  mapNavigation(froms, to, pathType, callback) {
    wx.request({
      url: Config.mapApi + pathType + '/',
      data: {
        from: froms,
        to: to,
        key: Config.key
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        callback(res)
      },
      fail: function (err) {
        callback(err)
      }
    })
  }

  // 获取当前位置经纬度
  getCurrentLocation(callback) {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        callback(res)
      },
      fail: function (err) {
        callback(err)
        // wx.showModal({
        //   title: '提示',
        //   content: '你点击了拒绝授权，将无法进行下一步操作，请先同意授权',
        //   success: function (res) {
        //     if (res.confirm) {
        //       wx.getSetting({
        //         success: function (res) {
        //           res.authSetting = {
        //             "scope.userLocation": true
        //           }
        //           wx.getLocation({
        //             success: function(res) {
        //               callback(res)
        //             },
        //           })
        //         }
        //       })
        //     }
        //   }
        // })
      }
    })
  }

  // 依据分钟计算时分
  setRuleTime(time) {
    let duration = parseInt(time); //分钟
    if (duration <= 60) {
      return duration + '分钟';
    }
    let hour = parseInt(duration / 60),
      min = parseInt(duration % 60);
    return hour + '小时' + min + '分钟';
  }

  setRuleDistance(distance) {
    return distance / 1000 + '公里';
  }

  // 检查对象中是否含有某key
  isContainKey(arr, key) {
    let len = arr.length;
    if (len == 1) {
      if (key in arr[0]) {
        return true;
      }
      return false;
    } else {
      for (let i = 0; i < len; i++) {
        if (key in arr[i]) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

}

export {
  Base
};