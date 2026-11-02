import { BASE_URL, TIMEOUT } from '../config';

export async function request(method, path, body) {
  const fullUrl = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  try {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    };
    if (body) {
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(fullUrl, opts);
    clearTimeout(timer);

    if (!res.ok) {
      throw {
        type: 'http',
        status: res.status,
        message: `Lỗi máy chủ (${res.status})`,
      };
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err && err.type) {
      throw err;
    }
    if (err && err.name === 'AbortError') {
      throw {
        type: 'timeout',
        status: 408,
        message: 'Hết thời gian yêu cầu',
      };
    }
    throw {
      type: 'network',
      status: 0,
      message: 'Lỗi kết nối máy chủ',
    };
  }
}
