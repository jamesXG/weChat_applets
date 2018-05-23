import { Base } from '../../utils/base.js';

class Detail extends Base {
  constructor() {
    super();
  }

  // 位置点详情
  getLocationDetail(id, callback) {
    let params = {
      url: `/location/${id}`,
      sCallback: function (res) {
        callback && callback(res)
      }
    };
    this.request(params);
  }
}

export { Detail };