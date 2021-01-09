import { expect } from 'chai';
import sinon from 'sinon';
import { ALLOWED_METHODS } from '../src/constants.json';
import { default as REST, baseUrl } from './fake.server';

const { default: Invoker } = require('../src');
const { default: Request } = require('../src/request');

describe('Invoker Module tests', () => {
  const URL = { GET: `${baseUrl}/get`, POST: `${baseUrl}/post`, REFRESH: `${baseUrl}/refresh` }; const key = 'rest-test';

  function fakeOnBeforeCallback({ ...params }) { return params; } function fakeOnAfterCallback() { } function fakeOnSuccessCallback(response) { } function fakeOnErrorCallback(error) { }
  let callMethodSpy; beforeEach(() => { callMethodSpy = sinon.spy(Invoker, 'callMethod'); });
  afterEach(() => { callMethodSpy.restore(); });
  it('allowed methods should be binded correctly', () => { ALLOWED_METHODS.forEach((method) => { expect(Invoker[method]).to.be.an.instanceof(Function); }); });
  it('should work without key parameter', async () => { REST.FAKE_GET.reply(200, { RESPONSE: 'data' }); await Invoker.callMethod.call(Invoker, 'get', { url: URL.GET }); const callResult = await callMethodSpy.returnValues[0]; expect(callResult).have.all.keys('err', 'result'); });

  describe('Request config/headers test', () => {
    let requestHandlerSpy; afterEach(() => { requestHandlerSpy.restore(); });
    it('should not change constant headers from outside', () => {
      requestHandlerSpy = sinon.spy(Invoker, 'requestHandler'); Invoker.requestHandler({ headers: { Accept: 'application/dummy', 'Content-Type': 'application/dummy' } }); const { returnValues: [requestConfig] } = requestHandlerSpy; // const requestConfig = requestHandlerSpy.returnValues[0]
      expect(requestConfig).to.have.nested.include({ 'headers.Accept': 'application/json', 'headers.Content-Type': 'application/json' });
    });
    it('should pass header values and combine with the default headers', () => { requestHandlerSpy = sinon.spy(Invoker, 'requestHandler'); Invoker.requestHandler({ headers: { property: 'value' } }); const { returnValues: [requestConfig] } = requestHandlerSpy; expect(requestConfig).to.have.any.keys('headers'); expect(requestConfig).to.have.nested.include({ 'headers.property': 'value', 'headers.Accept': 'application/json', 'headers.Content-Type': 'application/json' }); });
  });
  describe('Execution sequence test', () => {
    it('should execute functions in that order: ' + 'requestHandler >> callMethod >> startRequest >> onAfterRequest >> endRequest', async () => {
      const callStartRequestSpy = sinon.spy(Request.prototype, 'startRequest'); const callonAfterRequestSpy = sinon.spy(Request.prototype, 'internalOnAfter'); const callEndRequestSpy = sinon.spy(Request.prototype, 'endRequest'); await Invoker.callMethod.call(Invoker, 'get', { url: URL.GET, key }); sinon.assert.callOrder(callMethodSpy, callStartRequestSpy, callonAfterRequestSpy, callEndRequestSpy);
      after(() => { callStartRequestSpy.restore(); callonAfterRequestSpy.restore(); callEndRequestSpy.restore(); });
    });
  });
  describe('Appending params correctly', () => {
    let getCallDataSpy; afterEach(() => { getCallDataSpy.restore(); callMethodSpy.restore(); });
    it('should append data property with empty string on GET', async () => { getCallDataSpy = sinon.spy(Invoker, 'getCallData'); await Invoker.getCallData.call(Invoker, 'get', { url: URL.GET, data: { params: { query: 'string' } } }); const [callData] = getCallDataSpy.returnValues; expect(callData).have.all.keys('data', 'config').and.to.have.nested.property('data.data').is.empty; });
    it('should not append data property on POST', async () => {
      getCallDataSpy = sinon.spy(Invoker, 'getCallData');
      await Invoker.getCallData.call(Invoker, 'post', { url: URL.POST, key, data: { params: { query: 'value' } } }); const [callData] = getCallDataSpy.returnValues; expect(callData).have.all.keys('data', 'config').and.to.have.nested.property('config.params').is.an('object').not.to.have.nested.property('data.data');
    });
    it('should append body on POST', async () => {
      getCallDataSpy = sinon.spy(Invoker, 'getCallData'); await Invoker.getCallData.call(Invoker, 'post', { url: URL.POST, data: { params: { query: 'value' }, body: { property1: 'value1', property2: { field1: 'value1', field2: 999 } } } });
      const [callData] = getCallDataSpy.returnValues; expect(callData).to.have.nested.property('data.property1', 'value1'); expect(callData).to.have.nested.property('data.property2').is.an('object').that.includes({ field1: 'value1', field2: 999 });
    });
  });
  describe('Execution of internal events & callbacks ', () => {
    it('should execute internalOnAfter with timeStamp arguments on methods', async () => {
      REST.FAKE_GET.reply(200, { RESPONSE: 'data' }); const RequestSpy = sinon.spy(Request); const events = { onAfter: fakeOnAfterCallback }; const RequestInstance = new RequestSpy({ url: URL.GET, key, events }); const onAfterCallbackSpy = sinon.spy(RequestInstance.callbacks, 'onAfter'); await Invoker.callMethod.call(Invoker, 'get', { url: URL.GET, key, onAfter: onAfterCallbackSpy }); sinon.assert.calledWithNew(RequestSpy); sinon.assert.calledOnce(onAfterCallbackSpy); sinon.assert.calledWith(onAfterCallbackSpy, sinon.match.has('startsAt')); sinon.assert.calledWith(onAfterCallbackSpy, sinon.match.has('endsAt'));
      after(() => { onAfterCallbackSpy.restore(); });
    });
    it('should execute onBefore when has onBefore callback with params', async () => {
      REST.FAKE_GET.reply(200, { RESPONSE: 'data' }); const RequestSpy = sinon.spy(Request); const events = { onBefore: fakeOnBeforeCallback }; const RequestInstance = new RequestSpy({ url: URL.GET, key, events, data: { params: { query: 'string' } } }); const onBeforeCallbackSpy = sinon.spy(RequestInstance.callbacks, 'onBefore'); await Invoker.callMethod.call(Invoker, 'get', { url: URL.GET, key, onBefore: onBeforeCallbackSpy }); sinon.assert.calledWithNew(RequestSpy); sinon.assert.calledOnce(onBeforeCallbackSpy);
      after(() => { onBeforeCallbackSpy.restore(); });
    });
    it('should execute onBefore when has onBefore callback without params', async () => {
      REST.FAKE_GET.reply(200, { RESPONSE: 'data' }); const RequestSpy = sinon.spy(Request); const events = { onBefore: function fakeOnBeforeCallback() { } }; const RequestInstance = new RequestSpy({ url: URL.GET, key, events }); const onBeforeCallbackSpy = sinon.spy(RequestInstance.callbacks, 'onBefore'); await Invoker.callMethod.call(Invoker, 'get', { url: URL.GET, key, onBefore: onBeforeCallbackSpy }); sinon.assert.calledWithNew(RequestSpy); sinon.assert.calledOnce(onBeforeCallbackSpy);
      after(() => { onBeforeCallbackSpy.restore(); });
    });
    it('should execute internalOnSuccess with response (w/o timeStamps) on GET', async () => {
      REST.FAKE_GET.reply(200, { RESPONSE: 'data' }); const callOnSuccessSpy = sinon.spy(Request.prototype, 'internalOnSuccess'); await Invoker.callMethod.call(Invoker, 'get', { url: URL.GET, key }); sinon.assert.calledWith(callOnSuccessSpy, sinon.match.has('data'));
      after(() => { callOnSuccessSpy.restore(); });
    });
    it('should execute internalOnError with error instance (w/o timeStamps) on GET', async () => {
      REST.FAKE_GET.reply(500); const callOnErrorSpy = sinon.spy(Request.prototype, 'internalOnError'); await Invoker.callMethod.call(Invoker, 'get', { url: URL.GET, key }); sinon.assert.calledWith(callOnErrorSpy, sinon.match.instanceOf(Error));
      after(() => { callOnErrorSpy.restore(); });
    });
    it('should execute onSuccess callback with response (w timeStamps) on POST', async () => {
      REST.FAKE_POST.reply(200, 'OK'); const RequestSpy = sinon.spy(Request); const events = { onSuccess: fakeOnSuccessCallback }; const RequestInstance = new RequestSpy({ url: URL.POST, key, events }); sinon.assert.calledWithNew(RequestSpy); const onSuccessCallbackSpy = sinon.spy(RequestInstance.callbacks, 'onSuccess'); await Invoker.callMethod.call(Invoker, 'post', { url: URL.POST, key, onSuccess: onSuccessCallbackSpy }); sinon.assert.calledOnce(onSuccessCallbackSpy); sinon.assert.calledWith(onSuccessCallbackSpy, sinon.match.has('data')); sinon.assert.calledWith(onSuccessCallbackSpy, sinon.match.has('startsAt')); sinon.assert.calledWith(onSuccessCallbackSpy, sinon.match.has('endsAt'));
      after(() => { onSuccessCallbackSpy.restore(); });
    });
    it('should execute onError callback with error (w timeStamps) on POST', async () => {
      REST.FAKE_POST.reply(500); const RequestSpy = sinon.spy(Request); const events = { onError: fakeOnErrorCallback }; const RequestInstance = new RequestSpy({ url: URL.POST, key, events }); sinon.assert.calledWithNew(RequestSpy); const onErrorCallbackSpy = sinon.spy(RequestInstance.callbacks, 'onError'); await Invoker.callMethod.call(Invoker, 'post', { url: URL.POST, key, onError: onErrorCallbackSpy }); sinon.assert.calledOnce(onErrorCallbackSpy); sinon.assert.calledWith(onErrorCallbackSpy, sinon.match.has('error')); sinon.assert.calledWith(onErrorCallbackSpy, sinon.match.has('startsAt')); sinon.assert.calledWith(onErrorCallbackSpy, sinon.match.has('endsAt'));
      after(() => { onErrorCallbackSpy.restore(); });
    });
  });

});
