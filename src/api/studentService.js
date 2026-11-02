import { request } from './client';

export const studentService = {
  getById(id = 1) {
    return request('GET', `/students/${id}`);
  },
  update(id = 1, data) {
    return request('PATCH', `/students/${id}`, data);
  },
};
