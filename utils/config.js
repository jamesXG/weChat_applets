class Config {
  constructor() {

  }
}
// 网络：https://myjjxy.top/map_hnlg-api/public/index.php/api/v1
// 本地：http://map_hnlg.cn/index.php/api/v1
// API接口根url
Config.baseUrl = 'https://myjjxy.top/map_hnlg-api/public/index.php/api/v1';
// 缓存有效期(毫秒)
Config.expired = 7200000;

Config.key = 'J5RBZ-ZINWQ-MWT5D-GHK6G-O6JPJ-D6B7F';

// 地图导航Api
Config.mapApi = 'https://apis.map.qq.com/ws/direction/v1/';

// 导航智能语音
Config.navApi = 'https://api.ai.qq.com/path/to/api';

// 最长距离限制
Config.distanceMax = 21000;

export { Config };
