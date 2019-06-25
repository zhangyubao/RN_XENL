const apiplus = {
  '/cms/home/showV1.do': require('./apiplus/home/showV1'),
  '/cms/home/recommend.do': require('./apiplus/home/recommend'),
  '/cms/category/all/tree.do': require('./apiplus/category/tree'),
  '/cms/category/all/productlist.do': require('./apiplus/category/productlist')
};
const appapi = {
  '/production/info/productAndRasterEditorData.do': require('./appapi/production/productAndRasterEditorData')
};

const apis = {
  ...apiplus,
  ...appapi
};
const filter = url => {
  const result = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i.exec(url);
  return `${result[4]}${result[5]}`;
};
module.exports = {
  enable: false,
  api: url => {
    return Promise.resolve(apis[filter(url)]);
  }
};
