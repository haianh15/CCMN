# Ứng Dụng Quản Lý Chung Cư Mini (Mobile-First Prototype)

Hệ thống prototype tương tác hoàn chỉnh dành cho **User có role Quản lý / Chủ nhà**, bao phủ toàn bộ **86 điểm giao diện trong sitemap**, **63 Use Case**, **61 liên kết liên phân hệ**, và **8 kịch bản nghiệp vụ chuẩn SOP (TO-BE)**.

---

## 1. Thông Tin Kiến Trúc & Công Nghệ

- **Framework:** React 19 + TypeScript + Vite + Tailwind CSS (Mobile-First UI).
- **Responsive Viewport:** Thiết kế tối ưu cho kích thước mobile 360–428 px (iPhone SE 375px, iPhone 14/15 390px, Android 414px) kèm thanh điều khiển chuyển đổi viewport và chế độ toàn màn hình.
- **Quản lý trạng thái:** `AppContext` tập trung với relational Mock Repository lưu trữ quan hệ thực tế giữa: Phòng ↔ Khách thuê ↔ Người ở cùng ↔ Hợp đồng ↔ Lượt thuê ↔ Chỉ số điện nước ↔ Bảng tính tiền ↔ Thông báo VietQR ↔ Theo dõi thanh toán ↔ Công nợ quá hạn ↔ Nhật ký nhắc nợ ↔ Tài sản kiểm kê ↔ Sự cố ↔ Quyết toán cọc ↔ Báo cáo quản trị & Lịch sử kiểm toán (Audit Trail).
- **Công cụ QA:** Tích hợp sẵn modal **Ma Trận Kiểm Thử 86 Màn Hình & 61 Liên Kết** kèm chức năng **Chạy Kiểm Thử Smoke & Sanity Tests** tự động.

---

## 2. Tài Khoản Đăng Nhập Demo

| Tên đăng nhập | Mật khẩu | Mục đích kiểm thử |
|---|---|---|
| `admin` | `Admin@12345678` | Đăng nhập thẳng vào Dashboard quản lý Chủ nhà (GreenHouse) |
| `firstuser` | `123456` | Kiểm thử quy tắc **bắt buộc đổi mật khẩu lần đầu (FIRSTPASS) >= 12 ký tự** |

*Ghi chú:*
- Sai quá 5 lần liên tiếp sẽ kích hoạt cơ chế tạm khóa bảo mật 15 phút.
- Quên mật khẩu hỗ trợ mô phỏng gửi liên kết khôi phục qua email an toàn.

---

## 3. Tuân Thủ 9 Quy Tắc Nghiệp Vụ Bắt Buộc (Section D)

1. **D1. Tài khoản & Phiên:** Chỉ 1 vai trò Quản lý / Chủ nhà. Không có cổng khách thuê hay phân quyền dư thừa.
2. **D2. Nhận phòng:** Trạng thái phòng không cho người dùng tự chuyển Trống ↔ Đang thuê tùy ý. Chỉ nhận phòng khi đối chiếu đủ: hợp đồng đã ký + thanh toán đủ 1 tháng cọc + 1 tháng thuê đầu + biên bản bàn giao giấy hợp lệ.
3. **D3. Hợp đồng nối tiếp:** Khi gia hạn, **kế thừa khoản cọc gốc** (chỉ đọc), **không sinh cọc mới**; kế hoạch trả phòng cũ tự động bị hủy theo sự kiện hợp đồng nối tiếp có hiệu lực.
4. **D4. Tính tiền kỳ:** Tách riêng **tiền thuê tháng kế tiếp (trả trước)** và **tiền điện/nước/dịch vụ vừa dùng trong tháng này**. Phí dịch vụ cố định tính đủ theo từng lượt thuê trong kỳ.
5. **D5. Thông báo VietQR & Thu tiền:** Mã QR và thông báo lưu snapshot tài khoản ngân hàng lúc phát hành. Chỉ khi đối chiếu đúng 1 giao dịch chuyển khoản **đủ 100% tổng tiền trên QR** mới được xác nhận; **KHÔNG cho phép trả một phần**. Sửa xác nhận thu phải có lý do và lưu vết.
6. **D6. Công nợ quá hạn:** Chỉ khoản nợ quá hạn chưa thu mới xuất hiện tại DEBT; lời hẹn trả của khách **không tự động làm thay đổi hạn nộp gốc**.
7. **D7. Trả phòng & Cọc:** Stepper 6 bước, mốc 3.05 xác nhận nhận lại thực tế; chốt đối soát cọc và ký biên bản thanh lý giấy mới giải phóng phòng thành Trống.
8. **D8. Đơn giá & Báo cáo:** Đơn giá theo phiên bản hiệu lực, không hồi tố kỳ cũ; đối soát số liệu báo cáo điều hướng người dùng sửa tại nguồn phát sinh, không sửa ép số liệu trên biểu đồ.
9. **D9. Reset Dữ Liệu Mẫu:** Nút "Reset Dữ Liệu" ở thanh công cụ cho phép đưa 12 phòng, 15 khách, hợp đồng, cọc và chỉ số về trạng thái ban đầu để demo lại bất kỳ lúc nào.

---

## 4. Danh Mục 5 Tab Điều Hướng Chính

- **Tổng quan (`HOME`):** Thẻ chỉ số trọng tâm (Phòng trống, HĐ sắp hết hạn, Khoản cần thu, Công nợ quá hạn).
- **Phòng (`ROOMS`):** Danh sách 12 phòng (4 tầng), tìm kiếm, lọc trạng thái (Trống, Đang thuê, Sắp trả, Chưa xong), xem chi tiết phòng.
- **Khách thuê (`TENANTS`):** 15 hồ sơ khách thuê, masked CCCD, người ở cùng, lịch sử hồ sơ.
- **Thu tiền (`PAY`):** Ghi chỉ số điện nước, tính tiền kỳ, thông báo VietQR, theo dõi sao kê chuyển khoản.
- **Thêm (`MORE`):** Hợp đồng, Quyết toán cọc, Báo cáo tài chính & lấp đầy, Cài đặt đơn giá & ngân hàng.
