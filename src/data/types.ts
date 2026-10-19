export type Student = {
  id: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
};

export type ScheduleSession = {
  id: string;
  courseId: string;
  day: number;
  startTime: string;
  endTime: string;
  room: string;
  type: string;
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
};

export type ResultItem = {
  id: string;
  courseId: string;
  processScore: number;
  midtermScore: number;
  finalScore: number;
  totalScore: number;
  grade: string;
};
