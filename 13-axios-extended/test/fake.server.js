import nock from 'nock';

export const baseUrl = "http://127.0.0.1:8080";
export default {
  FAKE_GET: nock(baseUrl).get('/get'),
  FAKE_POST: nock(baseUrl).post('/post'),
  FAKE_REFRESH: nock(baseUrl).post('/refresh').query(true)
}
