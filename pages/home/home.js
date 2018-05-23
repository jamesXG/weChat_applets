Page({

  data: {

  },

  onLoad: function (options) {

  },
  onDetailTap: function () {
    wx.navigateTo({
      url: '../campus/campus',
    })
  },
  onMapTap: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  }
})