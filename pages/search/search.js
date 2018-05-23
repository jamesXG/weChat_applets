import { Search } from 'search-model';

let SearchData = new Search();

Page({
  data: {
    content: '',
    searchStatus: false, //false:搜索有内容，true:无内容
    listShowStatus: false,
    closeShowStatus: false,
    contentList: [],
    navigationIcon: "../../image/icon/navigation.png",
    nullImg: "../../image/null.jpg",
    isLoaded: false  //监听所有数据是否全部加载完毕
  },

  onLoad: function (options) {

  },
  // 获取用户输入的值
  onSearchContent(event) {
    this.data.content = event.detail.value;
    if (this.data.content == '') {
      this.setData({
        'searchStatus': false,
        'listShowStatus': false,
        'closeShowStatus': false
      })
    } else {
      this.setData({
        'closeShowStatus': true
      })
    }
  },
  // 将数据添加到指定数组中
  appendList: function (arr, appendArr) {
    for (let i = 0; i < arr.length; i++) {
      appendArr.push(arr[i]);
    }
  },
  startSearch(event) {
    this.data.isLoaded = false;
    this.data.contentList = [];
    SearchData.showLoading('查询中……');
    this.data.page = 1;
    SearchData.searchLocationByName(this.data.content, this.data.page, (res) => {
      this.appendList(res, this.data.contentList)
      if ('msg' in res) {
        this.setData({
          'searchStatus': true,
          'listShowStatus': false
        })
      } else {
        this.setData({
          'contentList': this.data.contentList,
          'listShowStatus': true
        })
      }
      wx.hideLoading();
    });
  },
  clearInput(event) {
    this.setData({
      'content': '',
      'searchStatus': false,
      'listShowStatus': false,
      'closeShowStatus': false
    })
  },
  // 点击列表跳转到详情页
  onMarkerDetail (event) {
    let id = SearchData.getDataSet(event, 'listid');
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },
  // 点击导航图标跳转至地图进行标记
  startPosition(event) {
    let coordinateItem = SearchData.getDataSet(event, 'info');
    wx.navigateTo({
      url: `../path/path?marker_Id=${coordinateItem.id}&lat=${coordinateItem.lat}&lon=${coordinateItem.lon}`,
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (!this.data.isLoaded) {
      this.data.page += 1;
      SearchData.showLoading('加载中……');
      SearchData.searchLocationByName(this.data.content, this.data.page, (res) => {
        this.appendList(res, this.data.contentList)
        if ('msg' in res) {
          this.data.isLoaded = true;
        } else {
          this.setData({
            'contentList': this.data.contentList
          })
        }
        wx.hideLoading();
      });
    }
  },
})