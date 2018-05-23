import { Campus } from 'campus-model';

const CampusData = new Campus();
let detailStorage;
Page({

  data: {
    navigationIcon: "../../image/icon/navigation.png",
  },

  onLoad: function (options) {
    CampusData.showLoading();
    this._onload();
  },

  _onload: function () {
    let banner_id = 1;
    CampusData.getBannerId(banner_id, (res) => {
      this.setData({
        banner: res.item
      })
    });
    this._loadDetail();
    wx.hideLoading();
  },
  _loadDetail: function () {
    let detail_id = 2;
    CampusData.getDetailById(detail_id, (res) => {
      this.setData({
        detailInfo: res
      });
    });
  },
  toMapTap: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  }
})