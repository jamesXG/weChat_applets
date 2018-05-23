import { Base } from '../../utils/base.js'

class Search extends Base {
  constructor() {
    super();
  }

  // 搜索内容
  searchLocationByName(name, page, callback) {
    let params = {
      url: `/search/${name}/${page}`,
      sCallback: function (res) {
        callback && callback(res);
      }
    };
    this.request(params);
  }
}

export { Search };