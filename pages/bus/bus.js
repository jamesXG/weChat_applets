import {
  Bus
} from 'bus-model';

let BusDetail = new Bus();
Page({
  data: {
    'forwardSymbol': ' > '
  },

  onLoad: function (options) {
    this.data.key = options.key;
    this._loadData(this.data.key);
  },
  _loadData: function (cacheName) {
    var that = this;
    wx.getStorage({
      key: cacheName,
      success: function (res) {
        let data = res.data.result.result.routes;
        that.setSnapData(data);
      },
      fail: function (err) {
        BusDetail.showModal('路径规划失败');
      }
    });
  },
  // 公交线路快照数据
  setSnapData: function (data) {
    let snapDetail = [];
    data.forEach((item, index) => {
      item.duration = BusDetail.setRuleTime(item.duration); //格式化时间
      item.distance = BusDetail.setRuleDistance(item.distance); //格式化距离
      let steps = item.steps;
      for (let i = 0, len = steps.length; i < len; i++) {
        let itemList = steps[i];
        if (itemList.mode == 'WALKING') {
          var direction = itemList.direction,
            distance = itemList.distance;
        } else if (itemList.mode == 'TRANSIT') {
          for (let j = 0, jLen = itemList.lines.length; j < jLen; j++) {
            var getOn = itemList.lines[0].geton.title;
          }
        }
      }
      let list = {
        direction,
        distance,
        getOn
      };
      snapDetail.push(list);
    });
    this.setData({
      pathList: data,
      snap: snapDetail
    });
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

  // 跳转到公交详情
  bindDetailPlan(event) {
    let bounds = BusDetail.getDataSet(event,'id');
    wx.navigateTo({
      url: './detail/detail?key=' + this.data.key + '&bounds='+bounds
    })
  }
})