import Utils from './Utils';
import Toast from '../widget/ToastUtils';
import Mock from '../assets/mock';

InvokeRequest = (url, method, opts) => {
  let urlCtx = Utils.getUrlCtx(url),
    queryStr = '';
  let opt = {
    headers: {
      platform: 'mweb',
      clientip: '127.0.0.1',
      clienturi: '/',
      appversion: '1.0',
      'Content-Type': 'application/x-www-form-urlencoded',
      uuid: '2180630160212erxdzhzpzm25jnfh0000000'
    },
    timeout: 15,
    method: method || 'GET'
  };
  if (opts && opts.data && Object.keys(opts.data).length > 0) {
    queryStr = Utils.urlByAppendingParams('', opts.data);
    if (opt.method === 'POST') opt.body = queryStr;
    if (opt.method === 'GET') url = url + '?' + queryStr;
  }

  if (Mock.enable) {
    return Mock.api(url).then(res => {
      return res.data;
    });
  } else {
    return fetch(url, opt)
      .then(res => {
        // 处理响应中的文本信息
        if (res.ok && res.status === 200) {
          return res.json();
        } else {
          Toast.Long('not 200:' + JSON.stringify(res));
          return res;
        }
      })
      .then(res => {
        if (res && res.success) {
          return res.data;
        }
        // 弹出系统alert
        Toast.Long('not success:' + JSON.stringify(res));
        console.warn(JSON.stringify(res || {}) + '\n ' + url + '\n' + JSON.stringify(opts.data || {}));
        return null;
      })
      .catch(err => {
        Toast.Long('error:' + JSON.stringify(err));
        console.warn('Fetch Error :' + err);
        return null;
      });
  }
};

const GET = function(url, opts) {
  return InvokeRequest(url, 'GET', opts);
};
const POST = function(url, opts) {
  return InvokeRequest(url, 'POST', opts);
};

export default {
  GET,
  POST
};
