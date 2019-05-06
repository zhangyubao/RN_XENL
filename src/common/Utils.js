urlByAppendingParams = (url: string, params: Object) => {
  let result = url;
  if (result && result.substr(result.length - 1) != '?') {
    result = result + `?`;
  }
  for (let key in params) {
    let value = params[key];
    result += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
  }
  result = result.substring(0, result.length - 1);
  return result;
};

getArrayPermuteByAll = (arr: Array<String>) => {
  let permArr = [],
    usedChars = [];
  function main(arr) {
    let i, ch;
    for (i = 0; i < arr.length; i++) {
      ch = arr.splice(i, 1)[0];
      usedChars.push(ch);
      if (arr.length == 0) {
        permArr.push(usedChars.slice());
      }
      main(arr);
      arr.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr;
  }
  return main(arr);
};

getUrlCtx = (url: string) => {
  let parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
  let result = parse_url.exec(url);
  let names = [
    'url',
    'scheme',
    'slash',
    'host',
    'port',
    'path',
    'query',
    'hash'
  ];
  let i;
  let obj = {};
  for (i = 0; i < names.length; i += 1) {
    if (!result[i]) {
      if (names[i] === 'port') {
        result[i] = '80';
      } else {
        result[i] = '';
      }
    }
    obj[names[i]] = result[i];
  }
  return obj;
};

export default { urlByAppendingParams, getArrayPermuteByAll, getUrlCtx };
