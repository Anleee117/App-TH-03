# ỨNG DỤNG QUẢN LÝ HỌC TẬP (API & OFFLINE MODE) - THỰC HÀNH 4

Ứng dụng React Native quản lý học tập hỗ trợ kết nối REST API qua json-server, lưu trữ bộ nhớ đệm (cache) và hàng đợi thao tác offline (outbox) với cơ chế tự động đồng bộ khi có mạng.

---

## 1. Cài đặt và chuẩn bị môi trường

### 1.1. Cài đặt thư viện
```bash
npm install
```

### 1.2. Cài đặt và khởi chạy mock API server
Chạy json-server với file `db.json` và độ trễ 800ms:
```bash
npm run server
```
hoặc chạy trực tiếp bằng lệnh:
```bash
json-server --watch db.json --host 0.0.0.0 --port 3000 --delay 800
```

### 1.3. Cấu hình địa chỉ API (src/config.js)
Mở file `src/config.js` để chỉnh `BASE_URL` phù hợp với thiết bị chạy ứng dụng:
- **Máy ảo Android**: `http://10.0.2.2:3000`
- **Máy ảo iOS**: `http://localhost:3000`
- **Điện thoại thật (Expo Go / Debug build)**: `http://<IP-LAN-may-tinh>:3000` (máy tính và điện thoại cùng mạng Wifi).

### 1.4. Khởi chạy bằng React Native CLI
Dự án được cấu hình thuần React Native CLI (không dùng Expo Go):

**Bước 1: Chạy Metro bundler:**
```bash
npx react-native start
# hoặc: npm start
```

**Bước 2: Mở một terminal khác để build và chạy ứng dụng lên máy ảo / thiết bị:**
- **Trên Android:**
```bash
npx react-native run-android
# hoặc: npm run android
```
- **Trên iOS (Mac):**
```bash
npx react-native run-ios
# hoặc: npm run ios
```

> **Mẹo hữu ích khi chạy React Native CLI trên máy thật Android qua cáp USB:**
> Chạy lệnh reverse cổng để điện thoại gọi trực tiếp vào máy tính qua localhost mà không sợ lệch Wifi:
> ```bash
> adb reverse tcp:3000 tcp:3000
> adb reverse tcp:8081 tcp:8081
> ```
> Khi đó trong `src/config.js` có thể để `BASE_URL = 'http://localhost:3000'`.

---

## 2. Sơ đồ luồng dữ liệu

```
+-------------------------------------------------------------------+
|                        Màn hình (Screens)                         |
|  HomeScreen, CourseList, Schedule, AssignmentList, Profile...     |
+---------------------------------+---------------------------------+
                                  |
                                  v
+---------------------------------+---------------------------------+
|                        Context & Hooks                            |
|  - AppDataContext & SyncContext                                   |
|  - useCachedQuery, useOutboxSync, useNetworkStatus               |
+-----------------+-------------------------------+-----------------+
                  |                               |
       (Đọc/Ghi Offline)                 (Gọi API khi Online)
                  v                               v
+-----------------+---------------+   +-----------+-----------------+
|        Tầng lưu trữ cục bộ       |   |         Tầng Service        |
|  - cache.js: getCache, setCache |   |  - studentService, course...|
|  - outbox.js: enqueue, remove   |   |  - client.js (Timeout 10s)  |
|    (AsyncStorage)               |   +-----------+-----------------+
+-----------------+---------------+               |
                  ^                               v
                  |===================+ (REST API JSON)
                                      |
                                      v
                      +---------------+---------------+
                      |      Mock Server (json-server) |
                      |      http://localhost:3000     |
                      +-------------------------------+
```

---

## 3. Cơ chế xử lý xung đột (Conflict Resolution - Yêu cầu B5)

Khi ứng dụng hoạt động ở chế độ Offline:
1. Mọi thao tác thay đổi (đổi trạng thái bài tập, thêm bài tập, chỉnh sửa thông tin cá nhân) đều được ghi vào hàng đợi Outbox trong AsyncStorage dạng:
   `{ id, method, url, body, createdAt }`
2. Khi thiết bị kết nối mạng trở lại (`isOnline = true`):
   - Hook `useOutboxSync` kích hoạt đồng bộ tuần tự (FIFO).
   - Với thao tác cập nhật thông tin cá nhân (`PATCH /students/1`), trước khi gửi dữ liệu lên server, ứng dụng thực hiện gọi `GET /students/1` để lấy bản ghi hiện tại trên server.
   - So sánh mốc thời gian: `serverData.updatedAt` và `item.createdAt` (hoặc `item.body.updatedAt`).
   - **Nếu dữ liệu trên server có `updatedAt` mới hơn thời điểm thao tác offline:**
     + Ứng dụng ưu tiên giữ dữ liệu server.
     + Hiển thị thông báo: *"Dữ liệu sinh viên trên máy chủ mới hơn thao tác offline của bạn. Ưu tiên giữ dữ liệu máy chủ."*
     + Xóa thao tác cũ khỏi hàng đợi outbox để không ghi đè dữ liệu mới của server.
   - **Nếu thao tác offline mới hơn:**
     + Ứng dụng gửi `PATCH` bình thường và cập nhật server thành công.
3. Khi hoàn tất đồng bộ các mục trong hàng đợi, hệ thống hiển thị thông báo: *"Đã đồng bộ X thay đổi"*.

---

## 4. Hướng dẫn kiểm thử 7 kịch bản

1. **Kịch bản 1: Tắt json-server rồi mở ứng dụng lần đầu**
   - Tắt terminal chạy json-server.
   - Mở ứng dụng lần đầu (khi chưa có cache): Màn hình hiển thị thông báo lỗi kèm nút "Thử lại", ứng dụng không bị dừng/crash.
2. **Kịch bản 2: Mở ứng dụng khi có mạng, sau đó bật chế độ máy bay và khởi động lại ứng dụng**
   - Bật json-server, mở ứng dụng để tải dữ liệu và lưu cache.
   - Bật chế độ máy bay trên thiết bị, tắt hẳn app và mở lại.
   - Kết quả: Dữ liệu tải từ cache ra ngay lập tức, xuất hiện banner "Bạn đang offline" ở đầu màn hình và dòng "Cập nhật lần cuối: HH:mm, dd/MM/yyyy".
3. **Kịch bản 3: Khi offline: đánh dấu 2 bài tập đã xong và thêm 1 bài tập mới**
   - Đang offline: vào tab Bài tập, bấm chuyển trạng thái 2 bài tập (todo -> done) và nhấn "+ Thêm bài tập mới" để thêm 1 bài tập.
   - Kết quả: Giao diện cập nhật ngay lập tức (optimistic update), các mục này hiển thị nhãn "Chưa đồng bộ". Tab Tổng quan cũng hiển thị số thay đổi chưa đồng bộ.
4. **Kịch bản 4: Tắt chế độ máy bay**
   - Tắt chế độ máy bay (kết nối mạng trở lại).
   - Kết quả: Ứng dụng tự động gửi các yêu cầu trong outbox lên server, hiển thị thông báo "Đã đồng bộ 3 thay đổi", các nhãn "Chưa đồng bộ" biến mất, kiểm tra file `db.json` thấy dữ liệu đã được cập nhật đúng.
5. **Kịch bản 5: Xung đột cập nhật sinh viên**
   - Bật chế độ máy bay.
   - Vào tab Cá nhân -> Chỉnh sửa họ tên thành "Nguyễn Văn Offline" và bấm Lưu.
   - Mở file `db.json` trên máy tính, sửa `fullName` của student 1 thành "Nguyễn Văn Server" và đổi `updatedAt` thành thời gian tương lai (hoặc thời gian sau thời điểm vừa sửa trên máy).
   - Tắt chế độ máy bay.
   - Kết quả: Ứng dụng phát hiện xung đột, hiển thị thông báo cảnh báo và ưu tiên giữ "Nguyễn Văn Server".
6. **Kịch bản 6: Tìm kiếm hoặc lọc không có kết quả**
   - Vào tab Môn học, gõ tìm kiếm "XYZ123" hoặc chọn học kỳ không có môn.
   - Kết quả: Hiển thị EmptyState thân thiện "Không tìm thấy môn học nào".
7. **Kịch bản 7: Kéo để làm mới**
   - Tại các màn hình danh sách (Tổng quan, Môn học, Thời khóa biểu, Bài tập, Kết quả học tập), vuốt từ trên xuống.
   - Kết quả: Vòng xoay xoay tải lại dữ liệu mới nhất từ server và cập nhật lại thời điểm lưu cache.
