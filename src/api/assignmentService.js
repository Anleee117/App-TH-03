import { request } from './client';

export const assignmentService = {
  getAll() {
    return request('GET', '/assignments?_expand=course&_sort=dueDate');
  },
  getById(id) {
    return request('GET', `/assignments/${id}?_expand=course`);
  },
  create(data) {
    return request('POST', '/assignments', data);
  },
  update(id, data) {
    return request('PATCH', `/assignments/${id}`, data);
  },
};
