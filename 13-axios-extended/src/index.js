import axios from 'axios';
import { ALLOWED_METHODS, HEADERS } from './constants.json';
import { getevents, to, isUndefined } from './utils';
import Request from './request';

axios.defaults.withCredentials = true;
const instance = axios.create();
let DEFAULT_CLIENT_HEADERS = HEADERS.DEFAULT;
/** * @description Invoker module is used for send request to url **/
class Invoker {
  /** * Creates an instance of Invoker **/
  constructor() {
    ALLOWED_METHODS.forEach((method) => { this[method] = this.callMethod.bind(this, method); });
    // instance.interceptors.request.use((config) => this.requestHandlerForCheckingTokenRefresh(config, this.requestHandler));
    // setDefaultHeader is a public method. needs to be leveled up from prototype
    this.setDefaultHeader = this.setDefaultHeader.bind(this); this.guid = '';
    //use for GUID header in every request
    instance.interceptors.response.use(undefined, (err) => this.responseOnError(err));
  }
  /** *  This method is called before the every request send **/
  requestHandler(config) {
    const newConfig = { ...config };
    newConfig.headers = { ...HEADERS.DEFAULT, ...DEFAULT_CLIENT_HEADERS, ...newConfig.headers, ...HEADERS.CONSTANT };
    return newConfig;
  }
  /** *  This method is called for request send. This is the method that does the main job **/
  async callMethod(method, { key = '', options = {}, ...params }) {
    const { url, ...opts } = params;
    const axiosMethod = method.toLowerCase();
    const callDataObj = this.getCallData(axiosMethod, opts);
    let { config } = callDataObj;
    const { data } = callDataObj;
    const { token: cancelToken, cancel } = axios.CancelToken.source(); config = { ...config, cancelToken };
    const events = getevents(opts);
    const Call = new Request({ key, url, data, config, cancel, events }, options);
    Call.startRequest({ url, data, config });
    const resultPromise = instance[axiosMethod].call(this, Call.url, Call.data, Call.config);
    Call.onAfter();
    const [err, result] = await to(resultPromise);
    if (!err && !isUndefined(result)) {
      // Get error node part: TypeError: Converting circular structure to JSON to solve this we can send 'result.data'
      Call.onSuccess(result);
    } else if (result === null) {
      Call.onError(err);
    }
    return { err, result };
  }

  getCallData(method, { data = {}, config = {} }) {
    const newConfig = { ...config };
    let newData = { ...data }; newConfig.headers = newConfig.headers || {};
    const hasUrlParams = Object.prototype.hasOwnProperty.call(newData, 'params');
    switch (method) {
      case 'post':
        if (hasUrlParams) { // has queryString
          newConfig.params = newData.params;
          delete newData.params;
        }
        newData = newData.body || {};
        break;
      case 'get': // has queryString
        newData = { ...newConfig, ...newData, data: '' };
        break;
    }
    return { data: newData, config: newConfig };
  }

  setDefaultHeader(key, value) { DEFAULT_CLIENT_HEADERS = { ...DEFAULT_CLIENT_HEADERS, [key]: value }; }

  async responseOnError(error) {
    if (!isUndefined(error.response)) {
      const { config, response: { status } } = error;
    }
    return Promise.reject(error);
  }
}
const Instance = new Invoker();
export default Instance;


