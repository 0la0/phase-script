const GET = 'GET';
const LOAD = 'load';
const ERROR = 'error';
const TIMEOUT = 'timeout';

function xhrPromise (url, data, method, responseType) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('content-type', 'text/plain;charset=UTF-8');
  xhr.send(data);

  if (responseType) {
    xhr.responseType = responseType;
  }

  return new Promise((resolve, reject) => {
    xhr.addEventListener(LOAD, () => {
      try {
        resolve(xhr.response);
      }
      catch (error) {
        reject({data: xhr.response, error: error});
      }
    });
    xhr.addEventListener(ERROR, event => reject({error: event}));
    xhr.addEventListener(TIMEOUT, event => reject({error: event}));
  });
}



export default class Http {
  static get (url) {
    return xhrPromise(url, undefined, GET);
  }
  static getAudioBuffer(url) {
    return xhrPromise(url, undefined, GET, 'arraybuffer');
  }
}
