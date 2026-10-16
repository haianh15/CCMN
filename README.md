# GreenHouse - Quản lý nhà cho thuê

Ứng dụng quản lý phòng, khách thuê, hợp đồng, thu tiền và tài sản. Giao diện dùng React, TypeScript và Vite; tài khoản và dữ liệu được lưu trên Supabase.

## Kết nối Supabase

1. Trong Supabase, mở **SQL Editor**, chạy nội dung file `supabase/migrations/20261016000000_create_app_state.sql`.
2. Trong **Authentication > Users**, tạo tài khoản email cho người quản lý. Ứng dụng không mở đăng ký tự do.
3. Sao chép **Project URL** và khóa **anon/public** (hoặc **publishable**) trong phần API.
4. Trong **Authentication > URL Configuration**, thêm địa chỉ website Vercel vào danh sách URL được phép chuyển về sau khi đặt lại mật khẩu.
5. Tạo file `.env.local` từ `.env.example`, rồi điền:

   ```text
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-key
   ```

6. Chạy `npm install`, sau đó `npm run dev`.
7. Khi triển khai trên Vercel, thêm hai biến trên vào **Project Settings > Environment Variables**, chọn Production (và Preview nếu cần), rồi redeploy.

Không đưa khóa `service_role` vào ứng dụng hoặc Vercel dưới tên biến `VITE_*`. Khóa này có quyền vượt qua chính sách bảo mật dữ liệu.

## Dữ liệu và bảo mật

- Dữ liệu mỗi tài khoản nằm trong một bản ghi PostgreSQL ở bảng `app_state`.
- Row Level Security giới hạn tài khoản chỉ đọc và sửa dữ liệu của chính mình.
- Khi đăng nhập lần đầu, ứng dụng tạo bộ dữ liệu khởi tạo riêng cho tài khoản. Những lần sau, dữ liệu trên Supabase là nguồn chính.
- Mọi thay đổi được tự động lưu sau một khoảng ngắn. Thanh trạng thái đầu trang báo đang lưu, đã lưu hoặc có lỗi.
- Nếu nhiều thiết bị cùng sửa một lúc, ứng dụng phát hiện phiên bản dữ liệu xung đột và yêu cầu tải lại để tránh ghi đè.
- Mỗi tài khoản có dữ liệu riêng. Chia sẻ một tòa nhà giữa nhiều tài khoản cần bổ sung chức năng thành viên/chia sẻ sau.
- Màn hình tài khoản chỉ truy cập khi đã đăng nhập; đổi mật khẩu yêu cầu xác minh mật khẩu hiện tại, mật khẩu mới từ 12 ký tự và xác nhận khớp. Sau khi đổi, phiên hiện tại được giữ và ứng dụng yêu cầu Supabase thu hồi các phiên khác. Đặt lại mật khẩu qua email kết thúc phiên và yêu cầu đăng nhập lại.
- Bộ đếm 5 lần sai cho chức năng đổi mật khẩu được giữ trong phiên chạy hiện tại của trình duyệt; kiểm soát chống thử sai có thẩm quyền vẫn cần được cấu hình ở dịch vụ phía máy chủ.

## Lệnh

- `npm run dev` - chạy ứng dụng trên máy.
- `npm run lint` - kiểm tra TypeScript.
- `npm run build` - tạo bản phát hành trong `dist`.
