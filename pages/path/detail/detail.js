import {
  pathDetail
} from 'detail-model';

let PathDetail = new pathDetail();
Page({
  data: {
    key: ''
  },
  onLoad: function (options) {
    let key = options.key; 
    this._loadData(key);
  },

  _loadData: function (cacheName) {
    var that = this;
    wx.getStorage({
      key: cacheName,
      success: function (res) {
        res.data.result.push([]);
        that.setData({
          pathList: res.data.result
        });
      },
      fail: function (err) {
        PathDetail.showModal('路径规划失败');
      }
    });
  },

// 打开App
  openApp(){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 25
        })
      }
    })
  }
})