import { request } from './client';

export const sessionService = {
  getAll() {
    return request('GET', '/sessions?_expand=course');
  },
  getById(id) {
    return request('GET', `/sessions/${id}?_expand=course`);
  },
};
