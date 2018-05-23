import { Base } from '../../utils/base.js';

class Campus extends Base {
  constructor() {
    super();
  }
  // banner
  getBannerId(id = 1, callback) {
    let params = {
      url: `/banner/${id}`,
      sCallback: function (res) {
        callback && callback(res)
      }
    };
    this.request(params);
  }

  // 校园详情
  getDetailById(id = 2, callback) {
    let params = {
      url: `/detail/${id}`,
      sCallback: function (res) {
        callback && callback(res)
      }
    };
    this.request(params);
  }
}

export { Campus };