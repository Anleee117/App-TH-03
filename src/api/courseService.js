import { request } from './client';

export const courseService = {
  getAll() {
    return request('GET', '/courses');
  },
  getById(id) {
    return request('GET', `/courses/${id}`);
  },
};
