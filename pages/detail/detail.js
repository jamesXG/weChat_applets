import { Detail } from 'detail-model';

let DetailData = new Detail();
Page({

  data: {
    navigationIcon: "../../image/icon/navigation.png",
  },
  onLoad: function (options) {
    DetailData.showLoading();
    // 点击后获取的位置ID值
    this.data.id = options.id;
    this._onLoad();
  },

  _onLoad: function () {
    let that = this;
    wx.getStorage({
      key: that.data.id,
      success: function (res) {
        if (DetailData.isExpired(that.data.id, res.data)) {
          // console.log('过期了');
          wx.removeStorageSync(that.data.id);
          that._loadDetail();
        } else {
          // console.log('没有过期');
          that.setData({
            'detail': res.data
          });
        }
        wx.hideLoading();
      },
      fail: function (res) {
        that._loadDetail();
      }
    })
  },

  _loadDetail: function () {
    DetailData.showLoading()
    let detailStorge = '';
    DetailData.getLocationDetail(this.data.id, (res) => {
      detailStorge = res;
      this.setData({
        'detail': res
      });
      DetailData.getCacheExpired(detailStorge);
      wx.hideLoading();
      wx.setStorage({
        key: this.data.id,
        data: detailStorge,
      })
    });
  },
  // 点击导航图标跳转至地图进行标记
  startPosition(event) {
    let coordinateItem = DetailData.getDataSet(event, 'info');
    wx.navigateTo({
      url: `../path/path?marker_Id=${coordinateItem.id}&lat=${coordinateItem.lat}&lon=${coordinateItem.lon}`,
    })
  }
})