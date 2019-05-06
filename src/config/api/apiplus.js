/**
 * @authors ITENL
 * @date    2018-07-02 11:35:45
 * 业务域名获取及编码规范
 */
//   属性名需遵循 驼峰命名规范
export default {
  entrance: {},
  home: {
    showV1: '/cms/home/showV1.do', //首页,
    recommend: '/cms/home/recommend.do' //加载更多
  },
  category: {
    tree: '/cms/category/all/tree.do', //获取分类树结构
    productlist: '/cms/category/all/productlist.do' //通过分类列表获取商品信息
  },
  _global: {
    protocal: 'http://',
    domain: 'apiplus.xyz.itenl.com',
    port: '80',
    isprocess: false
  }
};
