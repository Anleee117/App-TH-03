import {courses} from '../data/mockData';
import {Course} from '../data/types';

export const dayLabels: Record<number, string> = {
  2: 'Thứ 2',
  3: 'Thứ 3',
  4: 'Thứ 4',
  5: 'Thứ 5',
  6: 'Thứ 6',
  7: 'Thứ 7',
  8: 'Chủ nhật',
};

export const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};

export const getCourse = (courseId: string): Course | undefined =>
  courses.find(item => item.id === courseId);

export const getCourseName = (courseId: string): string =>
  getCourse(courseId)?.name ?? '';
