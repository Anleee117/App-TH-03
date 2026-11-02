import { request } from './client';

export const gradeService = {
  getAll() {
    return request('GET', '/grades?_expand=course');
  },
  getById(id) {
    return request('GET', `/grades/${id}?_expand=course`);
  },
};
