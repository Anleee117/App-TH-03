# ACCEPTANCE CRITERIA – STUDY MANAGER

> **Cơ sở:** Đề bài Thực hành 4 – Ứng dụng Quản lý học tập: API & Offline Mode.  
> **Nền tảng triển khai:** React Native CLI (theo yêu cầu của người thực hiện).  
> **Lưu ý:** Đề gốc quy định React Native (Expo). Tài liệu này thay Expo bằng React Native CLI; các yêu cầu chức năng, dữ liệu và kiểm thử khác vẫn bám sát đề gốc.

## 1. Tổng quan dự án

**Tên dự án:** Study Manager – Ứng dụng quản lý học tập.

**Mục tiêu:** Xây dựng ứng dụng quản lý học tập trên thiết bị di động, sử dụng REST API để lấy và cập nhật dữ liệu, đồng thời hỗ trợ hoạt động offline thông qua cache và hàng đợi đồng bộ.

### 1.1. Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Mobile | React Native CLI |
| Ngôn ngữ | JavaScript |
| Điều hướng | React Navigation – Bottom Tab + Native Stack |
| API | Fetch API |
| Mock Server | json-server 0.17.4 |
| Local Storage | AsyncStorage |
| Network Detection | NetInfo |
| State Management | Context API |

## 2. Acceptance Criteria theo chức năng

### 2.1. Quản lý dữ liệu và kết nối API

#### AC-API-01 – Kết nối REST API

- Ứng dụng phải lấy dữ liệu từ REST API thay vì sử dụng dữ liệu mẫu viết cứng trong các màn hình.
- API được triển khai bằng `json-server`.
- Địa chỉ `BASE_URL` phải được khai báo tập trung tại `src/config.js`.
- Không được khai báo URL API trực tiếp trong từng màn hình.

#### AC-API-02 – Quản lý thông tin sinh viên

- Khi mở màn hình Tổng quan và Cá nhân, ứng dụng phải lấy thông tin sinh viên từ `GET /students/1`.
- Thông tin hiển thị bao gồm:
  - Mã sinh viên.
  - Họ và tên.
  - Lớp.
  - Ngành học.
  - Email.
  - Số điện thoại.
- Khi chỉnh sửa thông tin cá nhân, ứng dụng phải gửi dữ liệu bằng `PATCH /students/1`.
- Sau khi lưu thành công, thông tin mới phải được cập nhật trên giao diện.

#### AC-API-03 – Quản lý môn học

- Ứng dụng phải lấy danh sách môn học từ `GET /courses`.
- Danh sách phải hiển thị mã môn, tên môn, số tín chỉ và giảng viên.
- Người dùng có thể tìm kiếm môn học theo tên.
- Người dùng có thể lọc môn học theo học kỳ.
- Khi chọn một môn học, ứng dụng mở màn hình chi tiết và lấy dữ liệu bằng `GET /courses/:id`.
- Màn hình chi tiết phải hiển thị thông tin môn học, lịch học và bài tập liên quan.

#### AC-API-04 – Quản lý thời khóa biểu

- Ứng dụng phải lấy danh sách buổi học từ `GET /sessions?_expand=course`.
- Người dùng có thể chọn một trong bảy ngày từ Thứ 2 đến Chủ nhật.
- Danh sách buổi học phải hiển thị:
  - Tên môn học.
  - Thời gian bắt đầu và kết thúc.
  - Phòng học.
- Khi chọn một buổi học, ứng dụng mở màn hình chi tiết tương ứng.

#### AC-API-05 – Quản lý bài tập

- Ứng dụng phải lấy danh sách bài tập từ `GET /assignments?_expand=course&_sort=dueDate`.
- Mỗi bài tập phải hiển thị:
  - Tiêu đề.
  - Tên môn học.
  - Hạn nộp.
  - Trạng thái hoàn thành.
- Người dùng có thể lọc bài tập theo:
  - Tất cả.
  - Chưa xong.
  - Đã xong.
  - Quá hạn.
- Khi thay đổi trạng thái bài tập, ứng dụng gửi `PATCH /assignments/:id`.
- Khi thêm bài tập mới, ứng dụng gửi `POST /assignments`.

#### AC-API-06 – Kiểm tra dữ liệu khi thêm bài tập

- Tiêu đề bài tập không được để trống.
- Hạn nộp không được nằm trong quá khứ.
- Nếu dữ liệu không hợp lệ, ứng dụng phải hiển thị lỗi và không gửi yêu cầu POST.
- Nếu dữ liệu hợp lệ, ứng dụng gửi yêu cầu POST đến server.
- Sau khi thêm thành công, ứng dụng quay về màn hình trước và cập nhật danh sách.

#### AC-API-07 – Trạng thái tải dữ liệu

Tất cả màn hình danh sách phải hỗ trợ bốn trạng thái:

| Trạng thái | Tiêu chí chấp nhận |
|---|---|
| Loading | Hiển thị ActivityIndicator hoặc Skeleton |
| Success | Hiển thị dữ liệu nhận được từ API |
| Empty | Hiển thị thông báo khi danh sách không có dữ liệu |
| Error | Hiển thị thông báo lỗi và nút Thử lại |

#### AC-API-08 – Làm mới dữ liệu

- Các màn hình danh sách phải hỗ trợ thao tác kéo xuống để làm mới.
- Sử dụng `refreshing` và `onRefresh` của `FlatList`.
- Sau khi làm mới, dữ liệu phải được tải lại từ API khi có mạng.

#### AC-API-09 – Xử lý lỗi API

- Tầng API phải sử dụng một hàm request chung.
- Thời gian chờ tối đa của mỗi request là 10 giây.
- Phải kiểm tra mã trạng thái HTTP.
- Lỗi phải được chuẩn hóa thành đối tượng gồm `type`, `status`, `message`.
- `type` phải phân biệt được `network`, `timeout` và `http`.

### 2.2. Chế độ Offline và đồng bộ dữ liệu

#### AC-OFF-01 – Phát hiện trạng thái mạng

- Ứng dụng phải sử dụng `@react-native-community/netinfo`.
- Phải có custom hook `useNetworkStatus()`.
- Khi thiết bị mất kết nối Internet, ứng dụng chuyển sang trạng thái offline.
- Khi offline, tất cả màn hình phải hiển thị banner: `Bạn đang offline`.

#### AC-OFF-02 – Lưu dữ liệu Cache

- Mỗi lần GET API thành công, ứng dụng phải lưu dữ liệu vào AsyncStorage.
- Dữ liệu cache phải có cấu trúc:

```js
{
  data: {},
  savedAt: "2026-10-26T08:00:00Z"
}
```

- Mỗi tài nguyên phải có khóa cache riêng.
- Ví dụ: `cache:courses`, `cache:assignments`, `cache:students`.

#### AC-OFF-03 – Hiển thị dữ liệu Cache

- Khi mở màn hình, ứng dụng phải ưu tiên hiển thị dữ liệu đã lưu trong cache.
- Sau đó, nếu có kết nối mạng, ứng dụng tiếp tục gọi API để cập nhật dữ liệu mới nhất.
- Khi offline, ứng dụng không được phụ thuộc vào API để hiển thị dữ liệu đã lưu.
- Phải hiển thị thời điểm cập nhật cuối cùng theo định dạng: `Cập nhật lần cuối: HH:mm, dd/MM/yyyy`.

#### AC-OFF-04 – Lưu thao tác khi Offline

Khi mất mạng, người dùng vẫn có thể thực hiện ba thao tác:

1. Thay đổi trạng thái bài tập.
2. Thêm bài tập mới.
3. Chỉnh sửa thông tin cá nhân.

- Các thao tác không được gửi lên server ngay khi offline.
- Các thao tác phải được lưu vào hàng đợi trong AsyncStorage.
- Mỗi thao tác phải có cấu trúc:

```js
{
  id: "...",
  method: "PATCH",
  url: "/assignments/1",
  body: {},
  createdAt: "..."
}
```

- Các mục chưa đồng bộ phải hiển thị nhãn `Chưa đồng bộ`.
- Giao diện phải phản ánh thay đổi ngay sau khi người dùng thao tác.

#### AC-OFF-05 – Tự động đồng bộ

- Khi thiết bị chuyển từ offline sang online, ứng dụng phải tự động thực hiện đồng bộ.
- Các thao tác phải được gửi lần lượt theo đúng thứ tự được thêm vào hàng đợi.
- Khi một thao tác thành công, thao tác đó phải bị xóa khỏi hàng đợi.
- Khi một thao tác thất bại, thao tác đó phải được giữ lại để thử lại sau.
- Sau khi đồng bộ thành công, ứng dụng phải cập nhật số lượng thao tác chưa đồng bộ.
- Phải hiển thị thông báo theo mẫu: `Đã đồng bộ 3 thay đổi`.

#### AC-OFF-06 – Xử lý xung đột dữ liệu

- Khi đồng bộ dữ liệu offline, ứng dụng phải so sánh trường `updatedAt`.
- Nếu dữ liệu trên server có thời gian cập nhật mới hơn thao tác offline, phải ưu tiên dữ liệu server.
- Người dùng phải nhận được thông báo về việc xảy ra xung đột.
- Cách xử lý xung đột phải được giải thích trong README.

### 2.3. Quản lý kết quả học tập

#### AC-GRADE-01 – Hiển thị kết quả học tập

- Trong tab Cá nhân, người dùng có thể truy cập danh sách kết quả học tập.
- Dữ liệu phải lấy từ `GET /grades?_expand=course`.
- Danh sách phải hiển thị tên môn học, số tín chỉ, điểm tổng kết và điểm chữ.
- Người dùng có thể lọc kết quả theo học kỳ.

#### AC-GRADE-02 – Chi tiết kết quả học tập

- Khi chọn một môn học, ứng dụng phải mở màn hình chi tiết kết quả.
- Màn hình phải hiển thị:
  - Điểm chuyên cần.
  - Điểm giữa kỳ.
  - Điểm cuối kỳ.
  - Điểm tổng kết.
  - Điểm chữ.

#### AC-GRADE-03 – Tính GPA hệ 4

- Ứng dụng phải chuyển đổi điểm hệ 10 sang hệ 4 theo bảng quy đổi trong đề bài.
- GPA phải được tính theo trọng số số tín chỉ.

\[
GPA = \frac{\sum(\text{Điểm hệ 4}\times\text{Số tín chỉ})}{\sum\text{Số tín chỉ}}
\]

- Môn có điểm F không được tính vào tổng số tín chỉ tích lũy.
- GPA hiển thị phải được làm tròn đến hai chữ số thập phân.

#### AC-GRADE-04 – Tổng tín chỉ tích lũy

- Ứng dụng phải tính tổng số tín chỉ tích lũy từ các môn đạt yêu cầu.
- Các môn có điểm F không được cộng vào tổng tín chỉ tích lũy.

### 2.4. Điều hướng và trải nghiệm người dùng

#### AC-UI-01 – Hệ thống điều hướng

Ứng dụng phải có đủ năm tab:

| Tab | Màn hình chính |
|---|---|
| Tổng quan | HomeScreen |
| Môn học | CourseListScreen |
| Thời khóa biểu | ScheduleScreen |
| Bài tập | AssignmentListScreen |
| Cá nhân | ProfileScreen |

- Mỗi tab phải có một Native Stack riêng.
- Các màn hình chi tiết phải được điều hướng trong Stack tương ứng.
- Tên route phải được khai báo tập trung trong `navigation/routes.js`.
- Màn hình chi tiết chỉ nhận `{ id }` qua `route.params`, không truyền toàn bộ object.
- Header phải hiển thị tên mục được chọn.
- Các màn hình chi tiết phải có nút quay lại.
- Sau khi lưu form thành công, ứng dụng tự quay về màn hình trước.

#### AC-UI-02 – Tab Bài tập

- Tab Bài tập phải có `tabBarBadge`.
- Badge hiển thị số lượng bài tập chưa hoàn thành.
- Khi trạng thái bài tập thay đổi, badge phải được cập nhật tương ứng.

#### AC-UI-03 – Trang Tổng quan

Trang Tổng quan phải hiển thị:

- Họ tên và mã sinh viên.
- Các môn đang học.
- Các bài tập có hạn nộp trong 7 ngày tới.
- Số lượng thao tác chưa đồng bộ.

#### AC-UI-04 – Đồng bộ dữ liệu giữa các màn hình

- Ứng dụng phải sử dụng Context API để chia sẻ dữ liệu.
- Khi thay đổi trạng thái bài tập trong tab Bài tập, dữ liệu tương ứng trên Trang Tổng quan phải được cập nhật.
- Số lượng bài tập chưa hoàn thành trên badge cũng phải được cập nhật.

#### AC-UI-05 – Giao diện và component dùng chung

- Tất cả màn hình phải sử dụng `ScreenContainer`.
- `ScreenContainer` phải quản lý SafeAreaView và banner offline.
- Các component trình bày phải nhận dữ liệu thông qua props.
- Các component trình bày không được gọi API hoặc đọc Context, ngoại trừ `OfflineBanner` theo quy định của đề.
- Văn bản giao diện sử dụng tiếng Việt.
- Ngày giờ phải được định dạng thông qua `utils/date.js`.
- Các nút phải có `accessibilityLabel`.
- Vùng bấm tối thiểu 44 × 44.
- Các item trong FlatList phải được bọc bằng `React.memo`.
- FlatList phải có `keyExtractor` và `ListEmptyComponent`.

## 3. Acceptance Criteria về cấu trúc và chất lượng mã nguồn

#### AC-CODE-01 – Phân tầng mã nguồn

- Màn hình không được gọi trực tiếp `fetch`, `axios` hoặc `AsyncStorage`.
- API phải được tách thành các service riêng.
- Storage chỉ chịu trách nhiệm lưu trữ dữ liệu, không gọi API.
- Hook và Context không được import component hoặc screen.
- Component chỉ chịu trách nhiệm trình bày giao diện và nhận sự kiện qua callback.

#### AC-CODE-02 – Custom Hooks

Ứng dụng phải có ba hook theo cấu trúc đề bài:

- `useNetworkStatus()`: Theo dõi trạng thái mạng.
- `useCachedQuery(key, fetcher)`: Quản lý cache và tải dữ liệu.
- `useOutboxSync()`: Quản lý hàng đợi và đồng bộ.

#### AC-CODE-03 – Context API

Phải có hai Context:

- `AppDataContext`: Quản lý student, courses, assignments và grades.
- `SyncContext`: Quản lý isOnline, pendingCount và syncNow.

#### AC-CODE-04 – Cấu hình dùng chung

- Màu sắc phải được quản lý trong `theme/colors.js`.
- Khoảng cách phải được quản lý trong `theme/spacing.js`.
- Typography phải được quản lý trong `theme/typography.js`.
- Không viết cứng màu sắc, cỡ chữ và khoảng cách trong component.

## 4. Acceptance Criteria về cấu trúc thư mục

#### AC-STRUCT-01 – Cấu trúc dự án

Dự án phải tuân thủ cấu trúc thư mục theo đề bài. Được phép bổ sung file nhưng không được xóa hoặc đổi tên các file bắt buộc.

```text
StudyManager/
├── android/
├── ios/
├── App.js
├── index.js
├── db.json
├── README.md
└── src/
    ├── config.js
    ├── api/
    │   ├── client.js
    │   ├── studentService.js
    │   ├── courseService.js
    │   ├── sessionService.js
    │   ├── assignmentService.js
    │   └── gradeService.js
    ├── storage/
    │   ├── keys.js
    │   ├── cache.js
    │   └── outbox.js
    ├── context/
    │   ├── AppDataContext.js
    │   └── SyncContext.js
    ├── hooks/
    │   ├── useNetworkStatus.js
    │   ├── useCachedQuery.js
    │   └── useOutboxSync.js
    ├── navigation/
    │   ├── routes.js
    │   ├── AppNavigator.js
    │   ├── HomeStack.js
    │   ├── CourseStack.js
    │   ├── ScheduleStack.js
    │   ├── AssignmentStack.js
    │   └── ProfileStack.js
    ├── screens/
    │   ├── home/
    │   ├── courses/
    │   ├── schedule/
    │   ├── assignments/
    │   └── profile/
    ├── components/
    │   ├── common/
    │   ├── course/
    │   ├── schedule/
    │   ├── assignment/
    │   ├── grade/
    │   └── profile/
    ├── theme/
    │   ├── colors.js
    │   ├── spacing.js
    │   └── typography.js
    └── utils/
        ├── date.js
        ├── gpa.js
        └── validators.js
```

**Lưu ý:** Đây là cấu trúc dành cho React Native CLI. Hai thư mục `android/`, `ios/` và file `index.js` thuộc phần khởi tạo native của React Native CLI. Không sử dụng cấu hình Expo hoặc yêu cầu chạy ứng dụng bằng Expo Go.

#### AC-STRUCT-02 – Component chuẩn

Mỗi component phải đáp ứng:

- Sử dụng Function Component.
- Mỗi file chứa một component và export default.
- Tên file và tên component sử dụng PascalCase.
- Sử dụng `StyleSheet.create` để quản lý style.
- Props tùy chọn phải có giá trị mặc định.
- Props bắt buộc được ghi chú bằng JSDoc.
- Không viết inline style, ngoại trừ giá trị động.

## 5. Acceptance Criteria về dữ liệu

#### AC-DATA-01 – Dữ liệu Mock API

File `db.json` phải có đủ năm tập dữ liệu:

| Tập dữ liệu | Trường bắt buộc |
|---|---|
| students | id, studentCode, fullName, className, major, email, phone, updatedAt |
| courses | id, code, name, credits, lecturer, description, semester |
| sessions | id, courseId, dayOfWeek, startTime, endTime, room, note |
| assignments | id, courseId, title, description, dueDate, status, updatedAt |
| grades | id, courseId, semester, attendance, midterm, final, total, letter |

#### AC-DATA-02 – Tính nhất quán dữ liệu

- Mỗi tập dữ liệu có ít nhất 5 bản ghi.
- Các `courseId` phải tham chiếu đến môn học tồn tại.
- Trạng thái bài tập chỉ nhận `todo` hoặc `done`.
- `dayOfWeek` sử dụng giá trị từ 2 đến 8.
- Thời gian sử dụng định dạng ISO 8601 theo yêu cầu của đề.

## 6. Acceptance Criteria về kiểm thử

Ứng dụng phải vượt qua đầy đủ 7 kịch bản kiểm thử bắt buộc.

| ID | Kịch bản kiểm thử | Kết quả mong đợi |
|---|---|---|
| TC-01 | Tắt json-server rồi mở ứng dụng lần đầu | Hiển thị lỗi và nút Thử lại, không bị crash |
| TC-02 | Mở ứng dụng có mạng, bật chế độ máy bay rồi khởi động lại | Hiển thị cache, banner offline và thời gian cập nhật cuối |
| TC-03 | Offline, hoàn thành 2 bài tập và thêm 1 bài tập mới | Giao diện cập nhật ngay, các mục có nhãn Chưa đồng bộ |
| TC-04 | Tắt chế độ máy bay | Tự đồng bộ, nhãn biến mất và db.json được cập nhật |
| TC-05 | Offline sửa họ tên, đồng thời sửa db.json với updatedAt mới hơn | Áp dụng quy tắc xung đột, ưu tiên dữ liệu server và thông báo người dùng |
| TC-06 | Tìm môn học không tồn tại hoặc lọc học kỳ không có dữ liệu | Hiển thị trạng thái danh sách rỗng |
| TC-07 | Kéo xuống làm mới các danh sách | Dữ liệu được tải lại |

## 7. Acceptance Criteria về bàn giao

#### AC-DEL-01 – Mã nguồn

- Có repository GitHub chứa mã nguồn.
- Có file `db.json`.
- Có README hướng dẫn cài đặt và chạy ứng dụng.
- Có hướng dẫn cấu hình địa chỉ API cho Android Emulator và thiết bị thật.

#### AC-DEL-02 – README

README phải có:

- Giới thiệu dự án.
- Công nghệ sử dụng.
- Cấu trúc thư mục.
- Hướng dẫn cài đặt dependencies.
- Hướng dẫn chạy json-server.
- Hướng dẫn chạy ứng dụng React Native CLI.
- Sơ đồ luồng dữ liệu: `Màn hình → Hook → Service → Cache / Outbox → API`.
- Giải thích cơ chế xử lý xung đột dữ liệu.

#### AC-DEL-03 – Video demo

- Thời lượng từ 3–5 phút.
- Thực hiện đầy đủ 7 kịch bản kiểm thử.
- Thể hiện được cả chế độ online và offline.

## 8. Điều kiện kỹ thuật riêng khi sử dụng React Native CLI

Đây là phần điều chỉnh so với đề gốc, không phải chức năng mới.

| Hạng mục | Yêu cầu |
|---|---|
| Khởi tạo | React Native CLI |
| Chạy Android | `npm run android` hoặc `npx react-native run-android` |
| Metro | `npx react-native start` |
| Android Emulator | Dùng `10.0.2.2:3000` để truy cập json-server trên máy tính |
| Điện thoại thật | Dùng IP LAN của máy tính |
| AsyncStorage | Cài package và sử dụng native autolinking |
| NetInfo | Cài package và sử dụng native autolinking |
| Navigation | React Navigation Bottom Tabs và Native Stack |

### 8.1. Các thư viện cần thiết

```powershell
npm install @react-navigation/native
npm install @react-navigation/bottom-tabs
npm install @react-navigation/native-stack
npm install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
npm install react-native-screens react-native-safe-area-context
```

Không sử dụng `expo install`, `expo start`, `expo-router` hoặc Expo Go trong quy trình triển khai.

## 9. Phạm vi không được tự ý mở rộng

| Không tự ý thêm | Lý do |
|---|---|
| Đăng nhập / đăng ký | Đề không yêu cầu |
| Phân quyền Admin / Student | Đề không yêu cầu |
| Firebase | Đề sử dụng json-server |
| Redux Toolkit / Zustand | Đề yêu cầu Context API |
| SQLite | Chỉ là lựa chọn điểm cộng |
| Push Notification | Không nằm trong yêu cầu bắt buộc |
| Chat / nhắn tin | Không nằm trong yêu cầu |
| Quản lý tài chính sinh viên | Không nằm trong yêu cầu |

## 10. Tiêu chí hoàn thành dự án

### 10.1. Definition of Done (DoD)

Một chức năng chỉ được xem là hoàn thành khi:

- [ ] Đúng yêu cầu Acceptance Criteria tương ứng.
- [ ] Dữ liệu được xử lý đúng qua API hoặc cache.
- [ ] Có xử lý loading, error và empty nếu là màn hình danh sách.
- [ ] Hoạt động đúng trong điều kiện online/offline theo yêu cầu.
- [ ] Không vi phạm quy tắc phân tầng mã nguồn.
- [ ] Không gây lỗi cho các màn hình liên quan.
- [ ] Có thể kiểm thử và trình diễn được.

### 10.2. Điều kiện hoàn thành toàn bộ project

- [ ] Hoàn thành toàn bộ AC-API.
- [ ] Hoàn thành toàn bộ AC-OFF.
- [ ] Hoàn thành toàn bộ AC-GRADE.
- [ ] Hoàn thành toàn bộ AC-UI.
- [ ] Hoàn thành toàn bộ AC-STRUCT và AC-DATA.
- [ ] Vượt qua 7 kịch bản kiểm thử.
- [ ] Bàn giao GitHub, README và video demo.

---

## 11. Thang điểm theo đề bài gốc

| Phần | Nội dung | Điểm |
|---|---|---:|
| A | Gọi API | 4 |
| B | Chế độ offline | 4 |
| C | Kết quả học tập | 1 |
| D | Chất lượng mã nguồn và cấu trúc | 1 |
| | Điểm cộng | Tối đa +1 |
| | **Tổng điểm tối đa** | **10** |

> Các AC trong tài liệu được phân nhóm để quản lý và nghiệm thu; không tạo ra thang điểm mới. Điểm chỉ được tính khi chức năng chạy đúng trong video demo và các kịch bản kiểm thử theo đề bài.
