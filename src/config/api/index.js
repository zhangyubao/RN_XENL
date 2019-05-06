import appapi from './appapi';
import apiplus from './apiplus';
import other from './other';
/**
 * @authors WJ
 * @date    2018-04-24 11:35:45
 * 递归url并在生命周期注入
 */
const deepURI = function(uris, _global) {
  if (typeof uris === 'object') {
    Object.keys(uris).forEach((key, index, keys) => {
      if (key !== '_global') {
        _global = _global || uris._global;
        if (typeof uris[key] === 'object' && uris.hasOwnProperty(key)) {
          deepURI(uris[key], _global);
        } else if (typeof uris[key] === 'string') {
          const url = uris[key].toLocaleLowerCase();
          if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) {
            uris[key] =
              _global.protocal +
              _global.domain +
              (_global.port === '80' || _global.port === '443'
                ? ''
                : ':' + _global.port) +
              uris[key];
          }
        }
      }
    });
  }
  return uris;
};

export default {
  appapi: !appapi._global.isprocess
    ? ((appapi._global.isprocess = true),
      console.warn('deepURI from ' + JSON.stringify(appapi._global || {})),
      deepURI(appapi))
    : appapi,
  apiplus: !apiplus._global.isprocess
    ? ((apiplus._global.isprocess = true),
      console.warn('deepURI from ' + JSON.stringify(apiplus._global || {})),
      deepURI(apiplus))
    : apiplus,
  other: !other._global.isprocess
    ? ((other._global.isprocess = true),
      console.warn('deepURI from ' + JSON.stringify(other._global || {})),
      deepURI(other))
    : other
};
