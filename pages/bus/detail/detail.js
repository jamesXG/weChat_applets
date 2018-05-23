import {
  busDetail
} from 'detail-model';

let BusDetail = new busDetail();
Page({
  data: {

  },
  onLoad: function (options) {
    let key = options.key;
    this.data.bounds = options.bounds;
    this._loadData(key);
  },

  _loadData: function (cacheName) {
    var that = this;
    wx.getStorage({
      key: cacheName,
      success: function (res) {
        that.extractData(res.data.result.result.routes);
      },
      fail: function (err) {
        BusDetail.showModal('路径规划失败');
      }
    });
  },
  // 根据上一级传递的参数选出需要渲染的数据
  extractData: function (data) {
    for (let i = 0, len = data.length; i < len; i++) {
      let item = data[i];
      if (item.bounds === this.data.bounds) {
        this.setPathData(item);
        break;
      }
    }
  },
  // 准备要加载的公交线路数据
  setPathData: function (data) {
    // console.log(data.steps)
    let list = [];
    for (let i = 0, len = data.steps.length; i < len; i++) {
      let item = data.steps[i];
      if (item.mode == 'WALKING') {
        if ('steps' in item) {
          for (let j = 0, j_len = item.steps.length; j < j_len; j++) {
            let items = {
              id: i,
              mode: item.mode,
              distance: item.distance,
              instruction: item.steps[j].instruction,
              road_name: item.steps[j].road_name,
              direction: item.steps[j].dir_desc
            };
            list.push(items);
          }
        }
      } else {
        let items = {
          id: i,
          mode: item.mode,
          distance: item.lines[0].distance,
          getOn: item.lines[0].geton.title,
          getOff: item.lines[0].getoff.title,
          station_count: item.lines[0].station_count
        };
        list.push(items);
      }
    }
    list.push([]);
    // console.log(list);
    this.setData({
      busPath: list
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

  }
})