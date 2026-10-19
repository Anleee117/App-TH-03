import { Assignment, Course, ResultItem, ScheduleSession, Student } from './types';

export const initialStudent: Student = {
  id: 'B23DCCC001',
  fullName: 'Lê Hải An',
  className: 'D23CQCC01',
  major: 'Khoa học máy tính',
  email: 'anlh.b23cc001.stu.ptit.edu.vn',
  phone: '0349178521',
};

export const courses: Course[] = [
  {
    id: 'c1',
    code: 'INT201',
    name: 'Cấu trúc dữ liệu và giải thuật',
    credits: 3,
    lecturer: 'TS. Trần Minh Quân',
    description: 'Học về các cấu trúc dữ liệu cơ bản như mảng, danh sách liên kết, ngăn xếp, hàng đợi, cây và các giải thuật sắp xếp, tìm kiếm.',
  },
  {
    id: 'c2',
    code: 'INT202',
    name: 'Cơ sở dữ liệu',
    credits: 3,
    lecturer: 'ThS. Lê Thu Hà',
    description: 'Học về mô hình quan hệ, thiết kế cơ sở dữ liệu, ngôn ngữ truy vấn SQL và chuẩn hóa dữ liệu.',
  },
  {
    id: 'c3',
    code: 'INT203',
    name: 'Lập trình hướng đối tượng',
    credits: 3,
    lecturer: 'ThS. Phạm Đức Long',
    description: 'Học về lớp, đối tượng, kế thừa, đa hình, đóng gói và áp dụng vào xây dựng ứng dụng.',
  },
  {
    id: 'c4',
    code: 'INT301',
    name: 'Mạng máy tính',
    credits: 3,
    lecturer: 'TS. Võ Thanh Sơn',
    description: 'Học về mô hình OSI, TCP/IP, địa chỉ IP, định tuyến và các giao thức mạng cơ bản.',
  },
  {
    id: 'c5',
    code: 'INT302',
    name: 'Lập trình di động',
    credits: 3,
    lecturer: 'ThS. Nguyễn Hoài Nam',
    description: 'Học về xây dựng ứng dụng di động với React Native, điều hướng, quản lý trạng thái và lưu trữ dữ liệu.',
  },
  {
    id: 'c6',
    code: 'MA201',
    name: 'Xác suất thống kê',
    credits: 2,
    lecturer: 'TS. Đặng Thị Mai',
    description: 'Học về biến ngẫu nhiên, phân phối xác suất, ước lượng và kiểm định giả thuyết.',
  },
];

export const sessions: ScheduleSession[] = [
  { id: 's1', courseId: 'c1', day: 2, startTime: '07:00', endTime: '09:30', room: 'A2-301', type: 'Lý thuyết' },
  { id: 's2', courseId: 'c2', day: 2, startTime: '13:00', endTime: '15:30', room: 'B1-205', type: 'Lý thuyết' },
  { id: 's3', courseId: 'c3', day: 3, startTime: '09:30', endTime: '12:00', room: 'A2-102', type: 'Lý thuyết' },
  { id: 's4', courseId: 'c4', day: 4, startTime: '07:00', endTime: '09:30', room: 'C1-401', type: 'Lý thuyết' },
  { id: 's5', courseId: 'c5', day: 5, startTime: '13:00', endTime: '16:00', room: 'Lab-02', type: 'Thực hành' },
  { id: 's6', courseId: 'c6', day: 6, startTime: '09:30', endTime: '11:30', room: 'A1-201', type: 'Lý thuyết' },
  { id: 's7', courseId: 'c1', day: 6, startTime: '13:00', endTime: '15:30', room: 'Lab-01', type: 'Thực hành' },
  { id: 's8', courseId: 'c3', day: 7, startTime: '07:00', endTime: '09:30', room: 'Lab-03', type: 'Thực hành' },
];

export const initialAssignments: Assignment[] = [
  {
    id: 'a1',
    courseId: 'c1',
    title: 'Bài tập cây nhị phân tìm kiếm',
    description: 'Cài đặt cây nhị phân tìm kiếm với các thao tác thêm, xóa, tìm kiếm và duyệt cây.',
    dueDate: '2026-10-22',
    completed: false,
  },
  {
    id: 'a2',
    courseId: 'c2',
    title: 'Thiết kế mô hình ERD',
    description: 'Thiết kế mô hình thực thể liên kết cho hệ thống quản lý thư viện.',
    dueDate: '2026-10-24',
    completed: false,
  },
  {
    id: 'a3',
    courseId: 'c3',
    title: 'Xây dựng lớp quản lý sinh viên',
    description: 'Xây dựng các lớp Sinh viên, Lớp học và áp dụng tính kế thừa, đa hình.',
    dueDate: '2026-10-28',
    completed: false,
  },
  {
    id: 'a4',
    courseId: 'c4',
    title: 'Báo cáo mô hình OSI',
    description: 'Viết báo cáo trình bày chức năng của từng tầng trong mô hình OSI.',
    dueDate: '2026-10-20',
    completed: true,
  },
  {
    id: 'a5',
    courseId: 'c5',
    title: 'Xây dựng giao diện đăng nhập',
    description: 'Xây dựng màn hình đăng nhập bằng React Native có kiểm tra dữ liệu nhập.',
    dueDate: '2026-11-02',
    completed: false,
  },
  {
    id: 'a6',
    courseId: 'c6',
    title: 'Bài tập phân phối xác suất',
    description: 'Giải các bài tập về phân phối nhị thức và phân phối chuẩn.',
    dueDate: '2026-10-15',
    completed: true,
  },
  {
    id: 'a7',
    courseId: 'c1',
    title: 'Bài tập sắp xếp và tìm kiếm',
    description: 'Cài đặt và so sánh các thuật toán sắp xếp chọn, chèn, nhanh và trộn.',
    dueDate: '2026-10-12',
    completed: true,
  },
];

export const results: ResultItem[] = [
  { id: 'r1', courseId: 'c1', processScore: 8.5, midtermScore: 7.5, finalScore: 8.0, totalScore: 8.0, grade: 'B+' },
  { id: 'r2', courseId: 'c2', processScore: 9.0, midtermScore: 8.0, finalScore: 8.5, totalScore: 8.5, grade: 'A' },
  { id: 'r3', courseId: 'c3', processScore: 7.0, midtermScore: 7.5, finalScore: 7.0, totalScore: 7.2, grade: 'B' },
  { id: 'r4', courseId: 'c4', processScore: 8.0, midtermScore: 8.0, finalScore: 7.5, totalScore: 7.8, grade: 'B' },
  { id: 'r5', courseId: 'c5', processScore: 9.5, midtermScore: 9.0, finalScore: 9.0, totalScore: 9.1, grade: 'A+' },
  { id: 'r6', courseId: 'c6', processScore: 7.0, midtermScore: 6.5, finalScore: 7.5, totalScore: 7.1, grade: 'B' },
];
