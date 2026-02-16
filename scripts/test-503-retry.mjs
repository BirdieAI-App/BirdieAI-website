/**
 * Test that 503 "Backend initializing" responses are retried and eventually succeed.
 * Runs a stub server that returns 503 twice then 200; verifies the client logic would succeed.
 *
 * Run: node scripts/test-503-retry.mjs
 */

import http from 'http';
import axios from 'axios';

const RETRY_DELAYS_MS = [50, 50, 100]; // short delays for fast test
const MAX_RETRIES = 3;

function createStubServer(respond503Count) {
  let requestCount = 0;
  const server = http.createServer((req, res) => {
    requestCount++;
    if (req.url === '/call/auth/login' && req.method === 'POST' && requestCount <= respond503Count) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Backend initializing', retry: true }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ redirect: true, url: '/chat' }));
    }
  });
  return { server, getRequestCount: () => requestCount };
}

const retryOn503 = async (config, retries = MAX_RETRIES) => {
  const client = axios.create({
    baseURL: config.baseURL,
    validateStatus: (s) => s >= 200 && s < 400,
    ...config,
  });
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const cfg = { ...config, _skip503Retry: true };
      const res = await client.request(cfg);
      return res;
    } catch (err) {
      const is503 = err?.response?.status === 503;
      const data = err?.response?.data;
      const retryFlag = typeof data === 'object' && data !== null && data.retry === true;
      const shouldRetry = is503 && retryFlag && attempt < retries - 1;
      if (shouldRetry && RETRY_DELAYS_MS[attempt] != null) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
        continue;
      }
      throw err;
    }
  }
};

async function run() {
  const { server, getRequestCount } = createStubServer(2); // 503 twice, then 200
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseURL = `http://127.0.0.1:${port}`;

  const client = axios.create({
    baseURL,
    validateStatus: (s) => s >= 200 && s < 400,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!error.config?._skip503Retry && error.response?.status === 503 && error.response?.data?.retry === true && error.config) {
        try {
          return await retryOn503({ ...error.config, baseURL }, MAX_RETRIES);
        } catch (retryErr) {
          throw retryErr;
        }
      }
      throw error;
    }
  );

  try {
    const res = await client.post('/call/auth/login', { email: 'test@test.com', password: 'test' });
    const requestCount = getRequestCount();
    if (res.status !== 200) {
      console.error('FAIL: expected 200, got', res.status);
      process.exit(1);
    }
    if (!res.data?.redirect || res.data?.url !== '/chat') {
      console.error('FAIL: expected { redirect: true, url: "/chat" }, got', res.data);
      process.exit(1);
    }
    if (requestCount < 2) {
      console.error('FAIL: expected at least 2 requests (503 then retry), got', requestCount);
      process.exit(1);
    }
    console.log('OK: 503 retry test passed. Requests:', requestCount, '-> 200 with redirect.');
  } catch (err) {
    console.error('FAIL:', err.response?.data || err.message);
    process.exit(1);
  } finally {
    server.close();
  }
}

run();
