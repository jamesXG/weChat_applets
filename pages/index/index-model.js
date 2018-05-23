import { Base } from '../../utils/base.js';

class Home extends Base {
  constructor() {
    super();
  }
  // 首页位置点，通过分类获取
  getLocationListById(id, callback) {
    let params = {
      url: `/list/${id}`,
      sCallback: function (res) {
        callback && callback(res);
      }
    };
    this.request(params);
  }

  getPointListById(id, callback) {
    let params = {
      url: `/location/list/${id}`,
      sCallback: function (res) {
        callback && callback(res);
      }
    };
    this.request(params);
  }

  getSortList(callback) {
    let params = {
      url: `/sort`,
      sCallback: function (res) {
        callback && callback(res);
      }
    };
    this.request(params);
  }
}
export { Home };
