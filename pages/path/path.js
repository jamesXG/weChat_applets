import {
  Path
} from 'path-model';
import {
  Config
} from '../../utils/config';

let PathData = new Path()
Page({
  data: {
    Lon: 113.266811,
    Lat: 35.189522,
    mapScale: 17,
    isCar: true,
    isWalk: false,
    isBus: false,
    hidden: true
  },

  onLoad: function (options) {
    this.data.options = options;
    // this._onload(this.data.options)
  },

  onReady: function () {
    this.mapCtx = wx.createMapContext('map-container')
  },
  onShow(event) {
    this._onload(this.data.options);
    this.setData({
      select: 'car',
      isCar: true,
      isBus: false,
      isWalk: false
    });
  },

  _onload: function (options) {
    PathData.getCurrentLocation(res => {
      if (!('latitude' in res)) {
        PathData.showModal('您已拒绝授权,进行下一步操作，请先授权', false, true, (res) => {
          wx.openSetting({
            success: (res) => {
              res.authSetting = {
                "scope.userLocation": true
              }
            }
          })
        })
        return
      }
      PathData.showLoading();
      this.data.latStart = options.lat;
      this.data.lonStart = options.lon;
      this.data.latEnd = res.latitude;
      this.data.lonEnd = res.longitude;
      this.data.toCoord = `${this.data.latStart},${this.data.lonStart}`,
        // this.data.fromCoord = '35.274214,113.239861';
        this.data.fromCoord = `${this.data.latEnd},${this.data.lonEnd}`; //35.206776,113.247757
      this.navigationPoints(this.data.fromCoord, this.data.toCoord, 'driving');
      this.setMarkers(res, options);
    })
  },
  includePoints() {
    this.mapCtx.includePoints({
      padding: [50],
      points: [{
        latitude: this.data.latStart,
        longitude: this.data.lonStart,
      }, {
        latitude: this.data.latEnd,
        longitude: this.data.lonEnd,
      }]
    })
  },
  // 设置起点终点标记
  setMarkers(froms, to) {
    this.setData({
      'pathArr': [{
        iconPath: '../../image/icon/point/start-point.png',
        id: 1,
        latitude: froms.latitude,
        longitude: froms.longitude,
        width: 35,
        height: 35
      }, {
        iconPath: '../../image/icon/point/end-point.png',
        id: 2,
        latitude: to.lat,
        longitude: to.lon,
        width: 35,
        height: 35
      }]
    })
  },
  // 最佳路径导航
  navigationPoints(fromsCoordinate, toCoordinate, pathType) {
    PathData.showLoading();
    PathData.mapNavigation(fromsCoordinate, toCoordinate, pathType, this.callback); //默认是驾车
  },
  callback(res) {
    let data = res.data.result.routes;
    if (!PathData.isContainKey(data, 'mode')) {
      if (data === undefined || data.length == 0) {
        PathData.showModal('该路段暂未开通公交', false);
      } else {
        this.data.busStorage = 'transit-' + this.data.toCoord + this.data.fromCoord;
        // 将详细路径指引存储在缓存中
        PathData.setLocationStorage(this.data.busStorage, res.data, (res) => {
          console.log(res);
        });
        wx.navigateTo({
          url: '../bus/bus?key=' + this.data.busStorage,
        });
      }
      this.setData({
        polyline: [],
        hidden: true
      })
    } else {
      if (data[0].distance > Config.distanceMax) {
        wx.hideLoading();
        PathData.showModal('起点终点距离过长');
        return;
      }
      this.data.keyStorage = data[0].mode + '-' + this.data.toCoord + this.data.fromCoord;
      // 将详细路径指引存储在缓存中
      PathData.setLocationStorage(this.data.keyStorage, data[0].steps, (res) => {
        console.log(res);
      });
      let polyArr = [],
        snapArr = [],
        roughlyArr = [],
        polylines = data[0].polyline;
      let duration = PathData.setRuleTime(data[0].duration),
        distance = PathData.setRuleDistance(data[0].distance);

      for (let i = 2, len = polylines.length; i < len; i++) {
        polylines[i] = polylines[i - 2] + polylines[i] / 1000000
      }
      for (let item = 0; item < polylines.length; item += 2) {
        snapArr.push(polylines.slice(item, item + 2))
      }
      for (let i = 0; i < snapArr.length; i++) {
        polyArr[i] = {}
        polyArr[i].longitude = snapArr[i][1]
        polyArr[i].latitude = snapArr[i][0]
      }
      this.setData({
        polyline: [{
          points: polyArr,
          color: "#3385FF",
          width: 6,
          arrowLine: true
        }],
        duration: duration,
        distance: distance,
        hidden: false
      })
    }
    wx.hideLoading();
  },
  // 清除导航被选中状态
  clearAll: function () {
    this.setData({
      isCar: false,
      isWalk: false,
      isBus: false
    });
  },

  onSwitchTap: function (event) {
    let pathType = PathData.getDataSet(event, 'type');
    this.clearAll();
    switch (pathType) {
      case 'car':
        this.navigationPoints(this.data.fromCoord, this.data.toCoord, 'driving');
        this.setData({
          select: 'car',
          isCar: true
        });
        break;
      case 'walk':
        this.navigationPoints(this.data.fromCoord, this.data.toCoord, 'walking');
        this.setData({
          select: 'walk',
          isWalk: true
        });
        break;
      case 'bus':
        this.navigationPoints(this.data.fromCoord, this.data.toCoord, 'transit');
        this.setData({
          select: 'bus',
          isBus: true
        });
        break;
    }
  },

  // 跳转路径详情
  onDetail: function (e) {
    wx.navigateTo({
      url: './detail/detail?key=' + this.data.keyStorage,
    })
  }
})