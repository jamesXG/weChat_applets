//index.js #F54336
import { Home } from 'index-model';

let HomeData = new Home();
Page({
  data: {
    currentLon: 113.266811,
    currentLat: 35.189522,
    positonIcon: 35,
    locationIcon: 40,
    mapScale: 16,
    iconAlpha: .8,
    positionIconPath: '../../image/icon/position.png',
    searchIconPath: '../../image/icon/search.png',
    locationIconPath: '../../image/icon/location.png',
    isClickMarker: false,
    // 是否显示map组件
    showIndexMap: false,
    showList: true,
    sortId: 1,
    listHeight: 500,   //500是伸开的高度 80是折叠的高度
    maxlistHeight: 500,
    minlistHeight: 100
  },
  onLoad: function (options) {
    this._onLoad();
  },
  _onLoad: function () {
    // 加载控件
    this._controls();
    this._mapSort();
    this._loadLocation();
  },
  _mapSort: function () {
    HomeData.getSortList(res => {
      this.setData({
        'SortList': res
      })
    })
  },
  setListHeight: function (listheight) {
    return this.data.windowHeight * (750 / this.data.screenWidth) - 70 - listheight;
  },
  // 地图相关控件
  _controls: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.data.windowHeight = res.windowHeight;
        that.data.windowWidth = res.windowWidth;
        that.data.screenWidth = res.screenWidth;
        that.data.control_space = (that.data.listHeight / 2) + 25;
        that.setControls(that.data.windowWidth, that.data.windowHeight, that.data.control_space, that.setListHeight(that.data.listHeight));
      },
    })
  },
  // 设置地图控件
  setControls: function (width, height, control_space, viewHeight) {
    this.setData({
      controls: [{
        id: 1,
        iconPath: this.data.positionIconPath,
        position: {
          left: width - 60,
          top: height - 90 - control_space,
          width: this.data.locationIcon,
          height: this.data.locationIcon
        },
        clickable: true
      }, {
        id: 2,
        iconPath: this.data.searchIconPath,
        position: {
          left: width - 60,
          top: height - 140 - control_space,
          width: this.data.locationIcon,
          height: this.data.locationIcon
        },
        clickable: true
      }],
      showIndexMap: true,
      second_height: viewHeight
    })
  },
  // 加载首页点位、分类数据
  _loadLocation: function (id = 1) {
    HomeData.showLoading()
    this._loadLocationList(id);
    HomeData.getLocationListById(id, (res) => {
      this.data.LocationListArr = [];
      this.setData({
        locationArr: res.map((item, index) => {
          let point =
            {
              iconPath: this.data.locationIconPath,
              id: item.items[0].id,
              latitude: item.lat,
              longitude: item.lon,
              width: this.data.locationIcon,
              height: this.data.locationIcon,
              alpha: this.data.iconAlpha
            };
          this.setPointsList(this.data.LocationListArr, item, index);
          return point;
        }),
        loadingHidden: true
      });
      this.includePoints();
    });
  },
  _loadLocationList: function (id = 1) {
    HomeData.getPointListById(id, (res) => {
      this.data.LocationList = res;
      this.setData({
        'listArr': res
      })
      wx.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('map-container');
  },
  // 移动到定位点
  moveToLocation: function () {
    this.mapCtx.moveToLocation();
    this.setData({
      'mapScale': this.data.mapScale
    })
  },
  // 跳转到搜索页 
  onControlSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  /**
   * 控件点击事件
   * 1：移动到当前定位的点
   * 2：跳转到搜索页
   */
  onControlsTap(event) {
    if (event.controlId == 1) {
      this.moveToLocation();
    } else if (event.controlId == 2) {
      this.onControlSearch();
    }
  },
  // 跳转到地点详情页
  onMarkerDetail(event) {
    let id = HomeData.getDataSet(event, 'listid');
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },
  // 点击标记点移动到对应的列
  onMarkerTap(event) {
    let markerId = event.markerId,
      order = this.data.LocationList;
    for (var i = 0; i < order.length; ++i) {
      if (order[i].id == markerId) {
        this.setData({
          toView: order[i].id
        })
        break
      }
    }
  },
  // 点击地图随机处关闭弹框
  closeList(event) {
    if (this.data.isClickMarker) {
      this.setData({
        'isClickMarker': false
      })
    }
  },
  // 设置经纬度数组对象
  setPointsList(arr, item, index) {
    arr[index] = {};
    arr[index].latitude = item.lat;
    arr[index].longitude = item.lon;
    return arr;
  },
  onHide: function () {
    this.setData({
      'showIndexMap': false
    })
  },
  onShow: function () {
    this.setData({
      'showIndexMap': true,
      'isClickMarker': false
    })
  },
  // 点击类别时触发
  onSortTap(event) {
    let sortId = HomeData.getDataSet(event, 'id'); //指定类别的ID号
    this._loadLocation(sortId);
    this.setData({
      "sortId": sortId
    })
  },

  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [50],
      points: this.data.LocationListArr
    })
  },
  // 点击列表伸缩框，展开/收缩
  onCloseList: function () {
    if (this.data.listHeight == this.data.maxlistHeight) {
      this.setCloseData(this.data.minlistHeight);
    } else if (this.data.listHeight == this.data.minlistHeight) {
      this.setCloseData(this.data.maxlistHeight);
    }
  },
  // 设置onCloseList函数内的传递值
  setCloseData: function (height) {
    this.setData({
      listHeight: height,
      second_height: this.data.windowHeight * (750 / this.data.screenWidth) - 70 - height,
      showList: !this.data.showList
    })
    this.setControls(this.data.windowWidth, this.data.windowHeight, (height / 2) + 25, this.setListHeight(height));
  },
  startPosition: function (event) {
    let coordinateItem = HomeData.getDataSet(event, 'info');
    wx.navigateTo({
      url: `../path/path?marker_Id=${coordinateItem.id}&lat=${coordinateItem.lat}&lon=${coordinateItem.lon}`,
    })
  }

})
