class Config {
  constructor() {

  }
}
// 本地：http://map_hnlg.cn/index.php/api/v1
// API接口根url
Config.baseUrl = 'http://map_hnlg.cn/index.php/api/v1';
// 缓存有效期(毫秒)
Config.expired = 7200000;

Config.key = '*****-*****-*****-*****-*****-*****'; //在腾讯地图开放平台可以申请

// 地图导航Api
Config.mapApi = 'https://apis.map.qq.com/ws/direction/v1/';

// 导航智能语音
Config.navApi = 'https://api.ai.qq.com/path/to/api';

// 最长距离限制
Config.distanceMax = 21000;

export { Config };
