

import { isNull, isUndefined } from './utils';
const EVENT_TYPES = Object.freeze({ ON_BEFORE: 'onBefore', ON_AFTER: 'onAfter', ON_SUCCESS: 'onSuccess', ON_ERROR: 'onError' });
class Request {
  constructor({ key, url, data, config, cancel, events }, { ...options } = {}) {
    // debugger;
    this.key = key;
    this.response = null;
    this.callbacks = {};
    this.url = url || '';
    this.data = data || null;
    this.configuration = config || {};
    this.events = events || {};
    this.options = options;
    this.cancelRequest = cancel;
    this.startsAt = null;
    this.endsAt = null;
  }
  get onSuccess() { return this.internalOnSuccess; }
  get onError() { return this.internalOnError; }
  get onAfter() { return this.internalOnAfter; }
  get time() { return { startsAt: this.startsAt, endsAt: this.endsAt }; }
  set events(value) { Object.entries(value).forEach(([name, fn]) => { this.callbacks[name] = fn.bind(this); }); }
  set configuration(value) { this.config = { ...this.config, ...value }; }
  startRequest({ ...params }) { if (this.hasCallbackFunc(EVENT_TYPES.ON_BEFORE)) { this.onBefore(params); } this.startsAt = +new Date(); }
  endRequest() { this.endsAt = +new Date(); }
  onBefore({ ...params }) {
    const returnedParams = this.callbacks.onBefore(params);
    if (!isNull(returnedParams) && !isUndefined(returnedParams)) {
      const { data, url, config } = returnedParams; this.url = url || this.url; this.data = data || this.data; this.config = config || this.config;
    }
  }
  internalOnAfter() { this.endRequest(); this.getCallbackFunc(EVENT_TYPES.ON_AFTER)(this.time); }
  internalOnSuccess(response) { this.response = response; this.endRequest(); return this.getCallbackFunc(EVENT_TYPES.ON_SUCCESS)({ ...response, ...this.time }); }
  internalOnError(error) { this.response = error; return this.getCallbackFunc(EVENT_TYPES.ON_ERROR)({ error, ...this.time }); }
  getCallbackFunc(type) { return this.hasCallbackFunc(type) ? this.callbacks[type] : () => { }; }
  hasCallbackFunc(type) { return typeof this.callbacks[type] === 'function'; }
  getInstanceOption(param) { return this.options[param] || null; }
}
export default Request;

