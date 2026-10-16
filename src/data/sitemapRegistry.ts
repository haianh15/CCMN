import { ScreenId, SitemapScreenMeta, CrossLinkMeta } from '../types';

export const ALL_86_SCREENS: SitemapScreenMeta[] = [
  // F.1 Khởi động (1 ID)
  {
    id: 'START',
    name: 'Khởi động ứng dụng',
    parent: 'root',
    uc: 'Nhóm điều hướng',
    fr: '—',
    category: 'Khởi động',
    description: 'Splash ngắn và kiểm tra phiên: chưa đăng nhập → LOGIN, đổi mật khẩu lần đầu → FIRSTPASS, hợp lệ → HOME'
  },
  // F.2 Đăng nhập và bảo mật (4 ID)
  {
    id: 'LOGIN',
    name: 'Đăng nhập',
    parent: 'START',
    uc: 'UC-TK-01',
    fr: 'UR-TK-01-01, UR-TK-01-02',
    category: 'Tài khoản & Bảo mật',
    description: 'Form đăng nhập Chủ nhà/Quản lý, ẩn/hiện mật khẩu, khóa tạm 15 phút sau 5 lần sai, không đăng ký ngoài luồng'
  },
  {
    id: 'FIRSTPASS',
    name: 'Đổi mật khẩu lần đầu',
    parent: 'LOGIN',
    uc: 'UC-TK-01',
    fr: 'UR-TK-01-01, UR-TK-01-02',
    category: 'Tài khoản & Bảo mật',
    description: 'Bắt buộc đổi mật khẩu >= 12 ký tự trước khi vào giao diện quản trị chính'
  },
  {
    id: 'FORGOT',
    name: 'Quên mật khẩu',
    parent: 'LOGIN',
    uc: 'UC-TK-04',
    fr: 'UR-TK-04-01',
    category: 'Tài khoản & Bảo mật',
    description: 'Nhập email khôi phục đã xác minh, mô phỏng gửi liên kết đặt lại an toàn'
  },
  {
    id: 'RESET',
    name: 'Đặt lại mật khẩu',
    parent: 'FORGOT',
    uc: 'UC-TK-04',
    fr: 'UR-TK-04-01',
    category: 'Tài khoản & Bảo mật',
    description: 'Nhập và xác nhận mật khẩu mới từ liên kết hợp lệ, chuyển về LOGIN và vô hiệu hóa phiên cũ'
  },
  // F.3 Điều hướng gốc và trang tổng quan (5 ID)
  {
    id: 'HOME',
    name: 'Tổng quan',
    parent: 'START',
    uc: 'UC-BC-01, UC-BC-02',
    fr: 'UR-BC-01-01, UR-BC-02-01',
    category: 'Tổng quan & Điều hướng',
    description: 'Dashboard 4-6 thẻ trọng tâm: phòng trống, hợp đồng sắp hết hạn, khoản cần thu, nợ quá hạn'
  },
  {
    id: 'ROOMS',
    name: 'Danh sách phòng',
    parent: 'HOME',
    uc: 'UC-PH-01',
    fr: 'UR-PH-01-01',
    category: 'Phòng',
    description: 'Danh sách phòng dạng thẻ gọn, mã phòng, tầng, giá thuê, trạng thái suy ra từ hợp đồng/bàn giao'
  },
  {
    id: 'TENANTS',
    name: 'Khách thuê',
    parent: 'HOME',
    uc: 'UC-HSKT-01',
    fr: 'UR-HSKT-01-01',
    category: 'Khách thuê',
    description: 'Danh sách người thuê, mã hồ sơ, phòng hiện tại, tìm kiếm và tạo hồ sơ'
  },
  {
    id: 'PAY',
    name: 'Thu tiền',
    parent: 'HOME',
    uc: 'UC08.1',
    fr: 'UR-8-1-01',
    category: 'Thu tiền & Tài chính',
    description: 'Bảng điều khiển tác vụ theo tháng: ghi chỉ số, tính tiền, đối chiếu, thông báo QR, công nợ'
  },
  {
    id: 'MORE',
    name: 'Thêm',
    parent: 'HOME',
    uc: 'Nhóm điều hướng',
    fr: '—',
    category: 'Điều hướng mở rộng',
    description: 'Menu mở rộng gom Hợp đồng, Quyết toán cọc, Báo cáo và Cài đặt đơn giá/ngân hàng'
  },
  // F.4 Quản lý phòng và kế hoạch trả (13 ID)
  {
    id: 'ROOM_NEW',
    name: 'Thêm phòng mới',
    parent: 'ROOMS',
    uc: 'UC-PH-02',
    fr: 'UR-PH-02-01, UR-PH-02-02',
    category: 'Phòng',
    description: 'Nhập mã phòng duy nhất, tầng, diện tích, giá thuê, kiểm tra trùng mã'
  },
  {
    id: 'ROOM_DETAIL',
    name: 'Chi tiết phòng',
    parent: 'ROOMS',
    uc: 'UC-PH-01, UC-PH-04',
    fr: 'UR-PH-01-01, UR-PH-04-01',
    category: 'Phòng',
    description: 'Toàn cảnh phòng, trạng thái suy ra, khách hiện tại, hợp đồng, tài sản, kế hoạch trả'
  },
  {
    id: 'ROOM_EDIT',
    name: 'Sửa thông tin phòng',
    parent: 'ROOM_DETAIL',
    uc: 'UC-PH-02',
    fr: 'UR-PH-02-01, UR-PH-02-02',
    category: 'Phòng',
    description: 'Chỉ cho sửa diện tích, tầng, giá thuê cơ bản; không sửa trạng thái bằng tay'
  },
  {
    id: 'ROOM_CHECK',
    name: 'Kiểm tra khả năng cho thuê',
    parent: 'ROOM_DETAIL',
    uc: 'UC-PH-03',
    fr: 'UR-PH-03-01',
    category: 'Phòng',
    description: 'Checklist điều kiện cho thuê: phòng trống, tài sản hoàn tất, sạch sẽ, sẵn sàng tạo điều kiện'
  },
  {
    id: 'ROOM_IN',
    name: 'Tiếp nhận phòng',
    parent: 'ROOM_DETAIL',
    uc: 'UC-PH-05',
    fr: 'UR-PH-05-01',
    category: 'Phòng',
    description: 'Kiểm tra 4 điều kiện: hợp đồng ký, thanh toán đủ cọc+tháng đầu, biên bản giấy ký, bàn giao thực tế'
  },
  {
    id: 'ROOM_MISSING',
    name: 'Ghi nhận điều kiện còn thiếu',
    parent: 'ROOM_IN',
    uc: 'UC-PH-06',
    fr: 'UR-PH-06-01',
    category: 'Phòng',
    description: 'Danh sách các điều kiện chưa đạt, lý do và link dẫn tới màn hình bổ sung chứng cứ'
  },
  {
    id: 'ROOM_FIRSTPAY',
    name: 'Thanh toán ban đầu',
    parent: 'ROOM_IN',
    uc: 'UC-PH-07',
    fr: 'UR-PH-07-01',
    category: 'Phòng',
    description: 'Đối chiếu đúng 1 tháng cọc + 1 tháng thuê đầu tiên, chứng từ chuyển khoản'
  },
  {
    id: 'ROOM_TERM',
    name: 'Theo dõi thời hạn thuê',
    parent: 'ROOMS',
    uc: 'UC-PH-10',
    fr: 'UR-PH-10-01',
    category: 'Phòng',
    description: 'Danh sách phòng theo hạn thuê còn lại, sắp hết hạn trong 30-60 ngày'
  },
  {
    id: 'ROOM_PLAN',
    name: 'Kế hoạch & phản hồi trả phòng',
    parent: 'ROOMS',
    uc: 'UC-PH-13, UC-PH-14',
    fr: 'UR-PH-13-01, UR-PH-13-02, UR-PH-14-01',
    category: 'Phòng',
    description: 'Kế hoạch trả dự kiến, lịch sử phản hồi Zalo/Điện thoại; kế hoạch cũ tự hủy khi có nối tiếp'
  },
  {
    id: 'ROOM_PLAN_NEW',
    name: 'Ghi ngày dự kiến trả',
    parent: 'ROOM_PLAN',
    uc: 'UC-PH-11',
    fr: 'UR-PH-11-01',
    category: 'Phòng',
    description: 'Ghi nhận ngày dự kiến trả phòng do khách thông báo, kênh xác nhận'
  },
  {
    id: 'ROOM_PLAN_EDIT',
    name: 'Sửa ngày dự kiến trả',
    parent: 'ROOM_PLAN',
    uc: 'UC-PH-12',
    fr: 'UR-PH-12-01',
    category: 'Phòng',
    description: 'Cập nhật ngày dự kiến trả phòng mới kèm căn cứ trao đổi'
  },
  {
    id: 'ROOM_PLAN_FEED',
    name: 'Lịch sử phản hồi trả phòng',
    parent: 'ROOM_PLAN',
    uc: 'UC-PH-13',
    fr: 'UR-PH-13-01, UR-PH-13-02',
    category: 'Phòng',
    description: 'Timeline ghi nhận các lần liên lạc về kế hoạch trả phòng'
  },
  {
    id: 'ROOM_RENEW_CHECK',
    name: 'Kiểm tra tiếp tục thuê',
    parent: 'ROOM_DETAIL',
    uc: 'UC-PH-15, UC-PH-14',
    fr: 'UR-PH-15-01, UR-PH-14-01',
    category: 'Phòng',
    description: 'Đối chiếu hợp đồng nối tiếp hợp lệ, hủy kế hoạch trả cũ theo sự kiện, duy trì Đang thuê'
  },
  // F.5 Hồ sơ khách thuê và người ở cùng (7 ID)
  {
    id: 'TENANT_NEW',
    name: 'Tạo hồ sơ khách thuê',
    parent: 'TENANTS',
    uc: 'UC-HSKT-01',
    fr: 'UR-HSKT-01-01',
    category: 'Khách thuê',
    description: 'Biểu mẫu nhập thông tin người thuê chính, CCCD, số điện thoại, quê quán'
  },
  {
    id: 'TENANT_DETAIL',
    name: 'Chi tiết khách thuê',
    parent: 'TENANTS',
    uc: 'UC-HSKT-05',
    fr: 'UR-HSKT-05-01',
    category: 'Khách thuê',
    description: 'Xem thông tin khách, người ở cùng, hợp đồng liên quan, phòng đang thuê, lịch sử cập nhật'
  },
  {
    id: 'TENANT_PEOPLE',
    name: 'Người ở cùng',
    parent: 'TENANT_DETAIL',
    uc: 'UC-HSKT-02',
    fr: 'UR-HSKT-02-01, UR-HSKT-02-02',
    category: 'Khách thuê',
    description: 'Danh sách thành viên ở cùng theo lượt thuê, ngày đến, ngày chuyển đi'
  },
  {
    id: 'TENANT_PERSON_EDIT',
    name: 'Thêm / sửa người ở cùng',
    parent: 'TENANT_PEOPLE',
    uc: 'UC-HSKT-02',
    fr: 'UR-HSKT-02-01, UR-HSKT-02-02',
    category: 'Khách thuê',
    description: 'Thêm hoặc cập nhật thông tin người ở cùng, quan hệ, giấy tờ tạm trú'
  },
  {
    id: 'TENANT_CHECK',
    name: 'Kiểm tra thay đổi hồ sơ',
    parent: 'TENANT_DETAIL',
    uc: 'UC-HSKT-03',
    fr: 'UR-HSKT-03-01',
    category: 'Khách thuê',
    description: 'So sánh dữ liệu trước và sau thay đổi, xác minh căn cứ trước khi lưu'
  },
  {
    id: 'TENANT_EDIT',
    name: 'Cập nhật hồ sơ khách',
    parent: 'TENANT_CHECK',
    uc: 'UC-HSKT-04',
    fr: 'UR-HSKT-04-01',
    category: 'Khách thuê',
    description: 'Lưu thay đổi đã qua kiểm tra, ghi nhật ký ai sửa và lý do'
  },
  {
    id: 'TENANT_HISTORY',
    name: 'Lịch sử hồ sơ khách',
    parent: 'TENANT_DETAIL',
    uc: 'UC-HSKT-05',
    fr: 'UR-HSKT-05-01',
    category: 'Khách thuê',
    description: 'Dòng thời gian biến động thông tin khách thuê và các lượt thuê'
  },
  // F.6 Hợp đồng và gia hạn (8 ID)
  {
    id: 'CONTRACTS',
    name: 'Danh sách hợp đồng',
    parent: 'MORE',
    uc: 'UC-HDT-05',
    fr: 'UR-HDT-05-01',
    category: 'Hợp đồng',
    description: 'Tìm kiếm, lọc hợp đồng theo trạng thái: nháp, đã ký, chờ hiệu lực, hiệu lực, kết thúc'
  },
  {
    id: 'RENTAL_TERMS',
    name: 'Thỏa thuận điều kiện thuê',
    parent: 'CONTRACTS',
    uc: 'UC-HDT-01',
    fr: 'UR-HDT-01-01',
    category: 'Hợp đồng',
    description: 'Biểu mẫu thống nhất điều kiện thuê: phòng, khách, giá, cọc (1 tháng), tiền thuê trả trước'
  },
  {
    id: 'CONTRACT_NEW',
    name: 'Dự thảo hợp đồng lần đầu',
    parent: 'CONTRACTS',
    uc: 'UC-HDT-02',
    fr: 'UR-HDT-02-01',
    category: 'Hợp đồng',
    description: 'Sinh hợp đồng nháp từ điều kiện đã duyệt, xem trước nội dung điều khoản'
  },
  {
    id: 'CONTRACT_DETAIL',
    name: 'Chi tiết hợp đồng',
    parent: 'CONTRACTS',
    uc: 'UC-HDT-05, UC-HDT-03',
    fr: 'UR-HDT-05-01, UR-HDT-03-01',
    category: 'Hợp đồng',
    description: 'Xem chi tiết hợp đồng, bản giấy ký, các CTA phù hợp: sửa nháp, ghi nhận ký, lập nối tiếp'
  },
  {
    id: 'CONTRACT_EDIT',
    name: 'Sửa dự thảo hợp đồng',
    parent: 'CONTRACT_DETAIL',
    uc: 'UC-HDT-03',
    fr: 'UR-HDT-03-01',
    category: 'Hợp đồng',
    description: 'Chỉ áp dụng cho hợp đồng ở trạng thái Nháp, kiểm tra tính hợp lệ'
  },
  {
    id: 'CONTRACT_SIGN',
    name: 'Ghi nhận hợp đồng đã ký',
    parent: 'CONTRACT_DETAIL',
    uc: 'UC-HDT-04',
    fr: 'UR-HDT-04-01',
    category: 'Hợp đồng',
    description: 'Ghi ngày ký và ảnh/chứng cứ bản giấy hai bên đã ký, chuyển sang Đã ký'
  },
  {
    id: 'CONTRACT_RENEW',
    name: 'Lập hợp đồng nối tiếp',
    parent: 'CONTRACT_DETAIL',
    uc: 'UC-HDT-06',
    fr: 'UR-HDT-06-01',
    category: 'Hợp đồng',
    description: 'Dự thảo hợp đồng nối tiếp: KẾ THỪA CỌC CŨ (chỉ đọc), không tạo khoản cọc mới'
  },
  {
    id: 'CONTRACT_RENEW_SIGN',
    name: 'Ghi nhận ký nối tiếp',
    parent: 'CONTRACT_RENEW',
    uc: 'UC-HDT-07',
    fr: 'UR-HDT-07-01',
    category: 'Hợp đồng',
    description: 'Ghi nhận bản nối tiếp đã ký giấy, đồng bộ kiểm tra tiếp tục thuê'
  },
  // F.7 Bàn giao, tài sản và sự cố (7 ID)
  {
    id: 'ASSET',
    name: 'Tài sản & Bàn giao',
    parent: 'ROOM_DETAIL',
    uc: 'Nhóm điều hướng',
    fr: '—',
    category: 'Tài sản & Bàn giao',
    description: 'Trung tâm quản lý tài sản, kiểm kê bàn giao, biên bản nhận phòng và sự cố'
  },
  {
    id: 'ASSET_INV',
    name: 'Kiểm kê tài sản',
    parent: 'ASSET',
    uc: 'UC-BG01',
    fr: 'UR-BG01-01',
    category: 'Tài sản & Bàn giao',
    description: 'Danh mục thiết bị/nội thất trong phòng, số lượng, tình trạng ban đầu'
  },
  {
    id: 'ASSET_STATUS',
    name: 'Hiện trạng bàn giao',
    parent: 'ASSET',
    uc: 'UC-BG02',
    fr: 'UR-BG02-01',
    category: 'Tài sản & Bàn giao',
    description: 'Ghi nhận mô tả hiện trạng phòng và ảnh bằng chứng lúc bàn giao'
  },
  {
    id: 'ASSET_RECEIVE',
    name: 'Biên bản nhận phòng',
    parent: 'ASSET',
    uc: 'UC-BG03',
    fr: 'UR-BG03-01',
    category: 'Tài sản & Bàn giao',
    description: 'Xem biên bản nhận phòng, ghi nhận chữ ký trên biên bản giấy'
  },
  {
    id: 'ASSET_INCIDENTS',
    name: 'Lịch sử sự cố tài sản',
    parent: 'ASSET',
    uc: 'UC-BG05',
    fr: 'UR-BG05-01',
    category: 'Tài sản & Bàn giao',
    description: 'Danh sách sự cố hỏng hóc trong phòng theo thời gian và trạng thái xử lý'
  },
  {
    id: 'ASSET_INCIDENT_NEW',
    name: 'Ghi nhận sự cố tài sản',
    parent: 'ASSET_INCIDENTS',
    uc: 'UC-BG04',
    fr: 'UR-BG04-01',
    category: 'Tài sản & Bàn giao',
    description: 'Báo sự cố thiết bị: ngày, mô tả, ảnh hiện trường, phương án xử lý'
  },
  {
    id: 'ASSET_INCIDENT_DETAIL',
    name: 'Chi tiết sự cố tài sản',
    parent: 'ASSET_INCIDENTS',
    uc: 'UC-BG05',
    fr: 'UR-BG05-01',
    category: 'Tài sản & Bàn giao',
    description: 'Chi tiết sự cố, tiến độ sửa chữa, chi phí và người chịu trách nhiệm'
  },
  // F.8 Trả phòng và biên bản (9 ID)
  {
    id: 'RETURN',
    name: 'Quy trình trả phòng',
    parent: 'ROOM_DETAIL',
    uc: 'UC-PH-08',
    fr: 'UR-PH-08-01',
    category: 'Trả phòng & Thanh lý',
    description: 'Quy trình 6 bước: Biên bản nháp → Nhận lại thực tế → Đối chiếu tài sản → Quyết toán cọc → Hoàn tất biên bản → Kiểm tra giải phóng'
  },
  {
    id: 'RETURN_DRAFT',
    name: 'Biên bản trả phòng (nháp)',
    parent: 'RETURN',
    uc: 'UC-BG08',
    fr: 'UR-BG08-01',
    category: 'Trả phòng & Thanh lý',
    description: 'Khởi tạo biên bản trả phòng nháp, chuẩn bị các hạng mục kiểm tra'
  },
  {
    id: 'RETURN_ACTUAL',
    name: 'Kết quả nhận lại phòng thực tế',
    parent: 'RETURN',
    uc: 'UC-BG09',
    fr: 'UR-BG09-01, UR-BG09-02',
    category: 'Trả phòng & Thanh lý',
    description: 'Ghi nhận kiểm tra thực tế (chỉ số điện nước chốt, tình trạng bàn giao thực tế) và xác nhận bước 3.05'
  },
  {
    id: 'RETURN_PENDING',
    name: 'Chưa bàn giao xong',
    parent: 'RETURN_ACTUAL',
    uc: 'UC-PH-09',
    fr: 'UR-PH-09-01',
    category: 'Trả phòng & Thanh lý',
    description: 'Ghi nhận lý do chưa thể nhận phòng (chưa dọn đồ, thiếu chìa khóa, cần khắc phục), phòng chưa thể chuyển Trống'
  },
  {
    id: 'RETURN_COMPARE',
    name: 'Đối chiếu tài sản',
    parent: 'RETURN',
    uc: 'UC-BG06',
    fr: 'UR-BG06-01',
    category: 'Trả phòng & Thanh lý',
    description: 'Đối chiếu song song hiện trạng lúc nhận và lúc trả phòng để tìm chênh lệch'
  },
  {
    id: 'RETURN_COMPARE_RESULT',
    name: 'Kết quả đối chiếu tài sản',
    parent: 'RETURN_COMPARE',
    uc: 'UC-BG07',
    fr: 'UR-BG07-01',
    category: 'Trả phòng & Thanh lý',
    description: 'Ghi nhận các chênh lệch, hư hỏng, thỏa thuận phương án bồi thường'
  },
  {
    id: 'RETURN_DEPOSIT',
    name: 'Đối soát cọc trong biên bản',
    parent: 'RETURN',
    uc: 'UC-BG10',
    fr: 'UR-BG10-01',
    category: 'Trả phòng & Thanh lý',
    description: 'Bản xem CHỈ ĐỌC từ mô-đun Quyết toán cọc, không cho sửa số tiền cọc tại đây'
  },
  {
    id: 'RETURN_FINAL',
    name: 'Hoàn thiện biên bản trả phòng',
    parent: 'RETURN',
    uc: 'UC-BG11',
    fr: 'UR-BG11-01',
    category: 'Trả phòng & Thanh lý',
    description: 'Kiểm tra điều kiện ký biên bản giấy hai bên, đính kèm ảnh biên bản hoàn chỉnh'
  },
  {
    id: 'RETURN_CHECK',
    name: 'Kiểm tra kết quả trả phòng',
    parent: 'RETURN',
    uc: 'UC-PH-08',
    fr: 'UR-PH-08-01',
    category: 'Trả phòng & Thanh lý',
    description: 'Xác minh toàn bộ điều kiện đã hoàn tất để chuyển trạng thái phòng thành TRỐNG'
  },
  // F.9 Tính tiền, thông báo và xác nhận thu (11 ID)
  {
    id: 'PAY_PERIOD',
    name: 'Kỳ tính tiền',
    parent: 'PAY',
    uc: 'UC-TT-03',
    fr: 'UR-TT-03-01',
    category: 'Tính tiền & Thu tiền',
    description: 'Danh sách các kỳ tính tiền theo tháng, lọc theo trạng thái và phòng'
  },
  {
    id: 'PAY_METER',
    name: 'Ghi chỉ số điện nước',
    parent: 'PAY_PERIOD',
    uc: 'UC-TT-01',
    fr: 'UR-TT-01-01, UR-TT-01-02',
    category: 'Tính tiền & Thu tiền',
    description: 'Nhập số điện, số nước mới, tải ảnh công tơ làm chứng cứ; số mới >= số cũ'
  },
  {
    id: 'PAY_METER_EDIT',
    name: 'Sửa chỉ số điện nước',
    parent: 'PAY_PERIOD',
    uc: 'UC-TT-02',
    fr: 'UR-TT-02-01',
    category: 'Tính tiền & Thu tiền',
    description: 'Sửa chỉ số nhầm có ghi lý do, cảnh báo tác động đến bảng tính kỳ'
  },
  {
    id: 'PAY_CALC',
    name: 'Bảng tính tiền kỳ',
    parent: 'PAY_PERIOD',
    uc: 'UC-TT-03',
    fr: 'UR-TT-03-01',
    category: 'Tính tiền & Thu tiền',
    description: 'Tách rõ: Tiền thuê tháng tới (trả trước) + Điện nước dịch vụ tháng này (vừa dùng)'
  },
  {
    id: 'PAY_RECON',
    name: 'Đối chiếu khoản phải thu',
    parent: 'PAY',
    uc: 'UC07.1',
    fr: 'UR-7-1-01',
    category: 'Tính tiền & Thu tiền',
    description: 'Đối soát các thành phần phải thu, không gộp sai nợ cũ vào thông báo kỳ mới'
  },
  {
    id: 'PAY_NOTICES',
    name: 'Danh sách thông báo thanh toán',
    parent: 'PAY',
    uc: 'UC07.2, UC07.3',
    fr: 'UR-7-2-01, UR-7-3-01',
    category: 'Tính tiền & Thu tiền',
    description: 'Quản lý thông báo phát hành theo phòng và kỳ, xem thông báo đang hiệu lực'
  },
  {
    id: 'PAY_NOTICE_NEW',
    name: 'Lập thông báo thanh toán kèm QR',
    parent: 'PAY_NOTICES',
    uc: 'UC07.2',
    fr: 'UR-7-2-01',
    category: 'Tính tiền & Thu tiền',
    description: 'Sinh thông báo và mã VietQR chuẩn theo tổng tiền và tài khoản ngân hàng đang hiệu lực'
  },
  {
    id: 'PAY_NOTICE_DETAIL',
    name: 'Chi tiết thông báo & QR',
    parent: 'PAY_NOTICES',
    uc: 'UC07.3, UC08.1',
    fr: 'UR-7-3-01, UR-8-1-01',
    category: 'Tính tiền & Thu tiền',
    description: 'Xem thông báo chi tiết, mã QR, tải ảnh phiếu hoặc mô phỏng chia sẻ Zalo'
  },
  {
    id: 'PAY_TRACK',
    name: 'Theo dõi thanh toán',
    parent: 'PAY',
    uc: 'UC08.1',
    fr: 'UR-8-1-01',
    category: 'Tính tiền & Thu tiền',
    description: 'Danh sách khoản thu: Chưa thu, Đã thu, Quá hạn; chỉ đổi trạng thái khi có xác nhận thực tế'
  },
  {
    id: 'PAY_CONFIRM',
    name: 'Xác nhận thu tiền',
    parent: 'PAY_TRACK',
    uc: 'UC08.2',
    fr: 'UR-8-2-01, UR-8-2-02',
    category: 'Tính tiền & Thu tiền',
    description: 'Đối chiếu chuyển khoản: Đúng 1 giao dịch đủ 100% tổng tiền QR; KHÔNG cho trả một phần'
  },
  {
    id: 'PAY_CORRECT',
    name: 'Sửa xác nhận thu',
    parent: 'PAY_TRACK',
    uc: 'UC08.2',
    fr: 'UR-8-2-01, UR-8-2-02',
    category: 'Tính tiền & Thu tiền',
    description: 'Sửa xác nhận thu nhầm, bắt buộc có lý do và chứng cứ, điều chỉnh công nợ/báo cáo có lưu vết'
  },
  // F.10 Công nợ quá hạn (5 ID)
  {
    id: 'DEBT',
    name: 'Công nợ quá hạn',
    parent: 'PAY',
    uc: 'UC-CN-01',
    fr: 'UR-CN-01-01',
    category: 'Công nợ',
    description: 'Chỉ danh sách khoản ĐÃ QUÁ HẠN chưa thanh toán, không trộn khoản chưa đến hạn'
  },
  {
    id: 'DEBT_DETAIL',
    name: 'Chi tiết khoản nợ',
    parent: 'DEBT',
    uc: 'UC-CN-01',
    fr: 'UR-CN-01-01',
    category: 'Công nợ',
    description: 'Thông tin khoản nợ quá hạn, hạn gốc, số tiền, lịch sử nhắc và phản hồi'
  },
  {
    id: 'DEBT_REMIND',
    name: 'Ghi nhận lịch sử nhắc nợ',
    parent: 'DEBT_DETAIL',
    uc: 'UC-CN-02',
    fr: 'UR-CN-02-01',
    category: 'Công nợ',
    description: 'Ghi nhận lần nhắc qua điện thoại/Zalo thực tế, nội dung và người thực hiện'
  },
  {
    id: 'DEBT_REPLY',
    name: 'Phản hồi & hẹn thanh toán',
    parent: 'DEBT_DETAIL',
    uc: 'UC-CN-03',
    fr: 'UR-CN-03-01',
    category: 'Công nợ',
    description: 'Ghi nhận phản hồi và ngày hẹn của khách, ngày hẹn KHÔNG tự sửa hạn gốc'
  },
  {
    id: 'DEBT_BASIS',
    name: 'Căn cứ nợ kéo dài',
    parent: 'DEBT_DETAIL',
    uc: 'UC-CN-04',
    fr: 'UR-CN-04-01',
    category: 'Công nợ',
    description: 'Chủ nhà chọn khoản quá hạn để đối chiếu toàn bộ căn cứ: hợp đồng, thông báo, nhật ký nhắc nợ'
  },
  // F.11 Quyết toán cọc (4 ID)
  {
    id: 'DEPOSIT',
    name: 'Danh sách quyết toán cọc',
    parent: 'MORE',
    uc: 'UC-QTC-01',
    fr: 'UR-QTC-01-01',
    category: 'Quyết toán cọc',
    description: 'Quản lý quyết toán cọc theo lượt thuê: nháp, tranh chấp, đã chốt hoàn cọc'
  },
  {
    id: 'DEPOSIT_NEW',
    name: 'Lập quyết toán cọc',
    parent: 'DEPOSIT',
    uc: 'UC-QTC-01',
    fr: 'UR-QTC-01-01',
    category: 'Quyết toán cọc',
    description: 'Tính số tiền hoàn: Cọc gốc (1 tháng) trừ tiền nhà còn thiếu, điện nước cuối, khấu trừ hư hại'
  },
  {
    id: 'DEPOSIT_DETAIL',
    name: 'Chi tiết / sửa quyết toán cọc',
    parent: 'DEPOSIT',
    uc: 'UC-QTC-02',
    fr: 'UR-QTC-02-01, UR-QTC-02-02',
    category: 'Quyết toán cọc',
    description: 'Xem chi tiết khấu trừ, trao đổi ý kiến, điều chỉnh có căn cứ'
  },
  {
    id: 'DEPOSIT_FINAL',
    name: 'Ghi nhận kết quả quyết toán',
    parent: 'DEPOSIT_DETAIL',
    uc: 'UC-QTC-03',
    fr: 'UR-QTC-03-01',
    category: 'Quyết toán cọc',
    description: 'Ghi nhận chuyển khoản hoàn cọc thực tế hoặc thu thêm, có mã giao dịch chứng từ'
  },
  // F.12 Báo cáo và đối soát (5 ID)
  {
    id: 'REPORTS',
    name: 'Báo cáo thống kê',
    parent: 'MORE',
    uc: 'UC-BC-01, UC-BC-02',
    fr: 'UR-BC-01-01, UR-BC-02-01',
    category: 'Báo cáo',
    description: 'Menu các báo cáo: lấp đầy phòng, doanh thu phải thu/thực thu, đối soát sai lệch, báo cáo tổng hợp'
  },
  {
    id: 'REPORT_OCC',
    name: 'Báo cáo phòng & tỷ lệ lấp đầy',
    parent: 'REPORTS',
    uc: 'UC-BC-01',
    fr: 'UR-BC-01-01',
    category: 'Báo cáo',
    description: 'Phòng trống, đang thuê, sắp trả, tỷ lệ lấp đầy có giải thích công thức và drill-down'
  },
  {
    id: 'REPORT_MONEY',
    name: 'Báo cáo phải thu – thực thu',
    parent: 'REPORTS',
    uc: 'UC-BC-02',
    fr: 'UR-BC-02-01',
    category: 'Báo cáo',
    description: 'Số liệu phải thu và thực thu theo kỳ, tách riêng tiền nhà và dịch vụ'
  },
  {
    id: 'REPORT_CHECK',
    name: 'Đối soát số liệu báo cáo',
    parent: 'REPORTS',
    uc: 'UC-BC-03',
    fr: 'UR-BC-03-01, UR-BC-03-02',
    category: 'Báo cáo',
    description: 'Phát hiện sai lệch giữa thông báo, thực thu và bảng tính, điều hướng sửa ở nguồn'
  },
  {
    id: 'REPORT_SUM',
    name: 'Báo cáo quản trị tổng hợp',
    parent: 'REPORTS',
    uc: 'UC-BC-04',
    fr: 'UR-BC-04-01',
    category: 'Báo cáo',
    description: 'Báo cáo tổng hợp kinh doanh toàn tòa nhà, kiểm tra đối soát trước khi xuất tệp'
  },
  // F.13 Cấu hình và tài khoản (6 ID)
  {
    id: 'SETTINGS',
    name: 'Cài đặt hệ thống',
    parent: 'MORE',
    uc: 'Nhóm điều hướng',
    fr: '—',
    category: 'Cài đặt & Cấu hình',
    description: 'Quản lý đơn giá điện/nước/dịch vụ, tài khoản ngân hàng thụ hưởng, tài khoản quản trị'
  },
  {
    id: 'SET_TARIFF',
    name: 'Đơn giá điện, nước & phí dịch vụ',
    parent: 'SETTINGS',
    uc: 'UC-CH-01',
    fr: 'UR-CH-01-01',
    category: 'Cài đặt & Cấu hình',
    description: 'Cấu hình đơn giá theo phiên bản hiệu lực, không hồi tố các kỳ đã chốt'
  },
  {
    id: 'SET_TARIFF_HISTORY',
    name: 'Lịch sử đơn giá',
    parent: 'SET_TARIFF',
    uc: 'UC-CH-01',
    fr: 'UR-CH-01-01',
    category: 'Cài đặt & Cấu hình',
    description: 'Xem các phiên bản giá cũ và mới, ngày bắt đầu hiệu lực'
  },
  {
    id: 'SET_BANK',
    name: 'Tài khoản nhận thanh toán',
    parent: 'SETTINGS',
    uc: 'UC-CH-02',
    fr: 'UR-CH-02-01',
    category: 'Cài đặt & Cấu hình',
    description: 'Thiết lập ngân hàng và số tài khoản nhận tiền tạo mã QR; thông báo cũ giữ snapshot cũ'
  },
  {
    id: 'SET_BANK_HISTORY',
    name: 'Lịch sử tài khoản nhận',
    parent: 'SET_BANK',
    uc: 'UC-CH-02',
    fr: 'UR-CH-02-01',
    category: 'Cài đặt & Cấu hình',
    description: 'Danh sách các tài khoản ngân hàng từng sử dụng theo thời gian'
  },
  {
    id: 'ACCOUNT',
    name: 'Tài khoản & bảo mật',
    parent: 'SETTINGS',
    uc: 'UC-TK-03',
    fr: 'UR-TK-03-01, UR-TK-03-02',
    category: 'Tài khoản & Bảo mật',
    description: 'Xem thông tin Quản lý, đổi mật khẩu định kỳ, mô phỏng phiên làm việc và đăng xuất'
  },
  // F.14 Thao tác dùng chung (1 ID)
  {
    id: 'LOGOUT',
    name: 'Đăng xuất',
    parent: 'ACCOUNT',
    uc: 'UC-TK-02',
    fr: 'UR-TK-02-01',
    category: 'Tài khoản & Bảo mật',
    description: 'Thu hồi phiên đăng nhập, xóa bộ nhớ tạm và chuyển hướng an toàn về màn hình LOGIN'
  }
];

export const ALL_61_CROSS_LINKS: CrossLinkMeta[] = [
  { id: 1, from: 'HOME', to: 'ROOM_TERM', label: 'Hợp đồng sắp hết hạn' },
  { id: 2, from: 'HOME', to: 'DEBT', label: 'Khoản nợ quá hạn' },
  { id: 3, from: 'HOME', to: 'PAY_TRACK', label: 'Theo dõi thu tiền' },
  { id: 4, from: 'HOME', to: 'REPORTS', label: 'Báo cáo tổng quan' },
  { id: 5, from: 'ROOM_DETAIL', to: 'TENANT_DETAIL', label: 'Hồ sơ khách hiện tại', paramKey: 'tenantId' },
  { id: 6, from: 'ROOM_DETAIL', to: 'CONTRACT_DETAIL', label: 'Hợp đồng hiện hành', paramKey: 'contractId' },
  { id: 7, from: 'ROOM_DETAIL', to: 'PAY_TRACK', label: 'Khoản tiền phải thu phòng này', paramKey: 'roomId' },
  { id: 8, from: 'ROOM_DETAIL', to: 'ROOM_PLAN', label: 'Kế hoạch trả phòng', paramKey: 'roomId' },
  { id: 9, from: 'ROOM_DETAIL', to: 'DEPOSIT', label: 'Quyết toán cọc phòng này', paramKey: 'roomId' },
  { id: 10, from: 'ROOM_CHECK', to: 'RENTAL_TERMS', label: 'Đủ điều kiện → Thỏa thuận điều kiện thuê', paramKey: 'roomId' },
  { id: 11, from: 'TENANT_DETAIL', to: 'RENTAL_TERMS', label: 'Lập điều kiện thuê cho khách', paramKey: 'tenantId' },
  { id: 12, from: 'RENTAL_TERMS', to: 'CONTRACT_NEW', label: 'Thống nhất điều kiện → Lập hợp đồng', paramKey: 'roomId' },
  { id: 13, from: 'CONTRACT_NEW', to: 'CONTRACT_DETAIL', label: 'Lưu hợp đồng nháp → Xem chi tiết', paramKey: 'contractId' },
  { id: 14, from: 'CONTRACT_SIGN', to: 'ROOM_FIRSTPAY', label: 'Ký giấy xong → Thu đủ tiền ban đầu', paramKey: 'roomId' },
  { id: 15, from: 'ROOM_FIRSTPAY', to: 'ASSET_INV', label: 'Đã thanh toán đủ → Kiểm kê bàn giao', paramKey: 'roomId' },
  { id: 16, from: 'ASSET_INV', to: 'ASSET_STATUS', label: 'Kiểm kê xong → Ghi hiện trạng', paramKey: 'roomId' },
  { id: 17, from: 'ASSET_STATUS', to: 'ASSET_RECEIVE', label: 'Ghi hiện trạng → Lập biên bản nhận', paramKey: 'roomId' },
  { id: 18, from: 'ASSET_RECEIVE', to: 'ROOM_IN', label: 'Ký biên bản → Kiểm tra tiếp nhận phòng', paramKey: 'roomId' },
  { id: 19, from: 'ROOM_IN', to: 'ROOM_DETAIL', label: 'Tiếp nhận thành công → Trạng thái Đang thuê', paramKey: 'roomId' },
  { id: 20, from: 'ROOM_MISSING', to: 'ROOM_FIRSTPAY', label: 'Thiếu tiền → Tra soát thanh toán ban đầu', paramKey: 'roomId' },
  { id: 21, from: 'ROOM_MISSING', to: 'CONTRACT_DETAIL', label: 'Thiếu hợp đồng ký → Tra soát hợp đồng', paramKey: 'contractId' },
  { id: 22, from: 'TENANT_DETAIL', to: 'CONTRACTS', label: 'Lịch sử hợp đồng của khách', paramKey: 'tenantId' },
  { id: 23, from: 'TENANT_DETAIL', to: 'ROOM_DETAIL', label: 'Xem phòng đang thuê', paramKey: 'roomId' },
  { id: 24, from: 'CONTRACT_DETAIL', to: 'TENANT_DETAIL', label: 'Xem hồ sơ bên thuê', paramKey: 'tenantId' },
  { id: 25, from: 'CONTRACT_DETAIL', to: 'ROOM_DETAIL', label: 'Xem phòng liên quan', paramKey: 'roomId' },
  { id: 26, from: 'CONTRACT_RENEW_SIGN', to: 'ROOM_RENEW_CHECK', label: 'Ký nối tiếp xong → Kiểm tra tiếp tục thuê', paramKey: 'roomId' },
  { id: 27, from: 'ROOM_RENEW_CHECK', to: 'ROOM_PLAN', label: 'Hợp đồng mới hiệu lực → Hủy kế hoạch trả cũ', paramKey: 'roomId' },
  { id: 28, from: 'ROOM_TERM', to: 'ROOM_PLAN', label: 'Xem hoặc lập kế hoạch trả', paramKey: 'roomId' },
  { id: 29, from: 'ROOM_PLAN', to: 'RETURN', label: 'Đến ngày trả → Bắt đầu quy trình trả phòng', paramKey: 'roomId' },
  { id: 30, from: 'RETURN_DRAFT', to: 'RETURN_ACTUAL', label: 'Biên bản nháp → Nhận lại thực tế', paramKey: 'roomId' },
  { id: 31, from: 'RETURN_ACTUAL', to: 'RETURN_COMPARE', label: 'Đã nhận thực tế (3.05) → Đối chiếu tài sản', paramKey: 'roomId' },
  { id: 32, from: 'RETURN_COMPARE_RESULT', to: 'DEPOSIT_NEW', label: 'Có hư hại → Căn cứ khấu trừ cọc', paramKey: 'roomId' },
  { id: 33, from: 'DEPOSIT_FINAL', to: 'RETURN_DEPOSIT', label: 'Chốt cọc xong → Cập nhật vào biên bản trả', paramKey: 'roomId' },
  { id: 34, from: 'RETURN_DEPOSIT', to: 'RETURN_FINAL', label: 'Kiểm tra cọc xong → Hoàn thiện biên bản', paramKey: 'roomId' },
  { id: 35, from: 'RETURN_FINAL', to: 'RETURN_CHECK', label: 'Ký biên bản trả → Kiểm tra giải phóng phòng', paramKey: 'roomId' },
  { id: 36, from: 'RETURN_CHECK', to: 'ROOM_DETAIL', label: 'Đủ điều kiện → Cập nhật phòng TRỐNG', paramKey: 'roomId' },
  { id: 37, from: 'RETURN_PENDING', to: 'RETURN_ACTUAL', label: 'Bổ sung khắc phục → Kiểm tra lại thực tế', paramKey: 'roomId' },
  { id: 38, from: 'RETURN_COMPARE', to: 'ASSET_INCIDENTS', label: 'Tra cứu lịch sử sự cố tài sản', paramKey: 'roomId' },
  { id: 39, from: 'RETURN_DEPOSIT', to: 'DEPOSIT_DETAIL', label: 'Xem chi tiết nguồn quyết toán cọc', paramKey: 'settlementId' },
  { id: 40, from: 'PAY_METER', to: 'PAY_CALC', label: 'Ghi chỉ số xong → Bảng tính tiền kỳ', paramKey: 'periodId' },
  { id: 41, from: 'PAY_METER_EDIT', to: 'PAY_CALC', label: 'Sửa chỉ số → Cần tính lại bảng tiền', paramKey: 'periodId' },
  { id: 42, from: 'PAY_CALC', to: 'PAY_RECON', label: 'Tính xong → Đối chiếu khoản phải thu', paramKey: 'periodId' },
  { id: 43, from: 'PAY_RECON', to: 'PAY_NOTICE_NEW', label: 'Đã đối chiếu → Lập thông báo QR', paramKey: 'periodId' },
  { id: 44, from: 'PAY_NOTICE_NEW', to: 'PAY_NOTICE_DETAIL', label: 'Lập xong → Xem thông báo & QR', paramKey: 'noticeId' },
  { id: 45, from: 'PAY_NOTICE_DETAIL', to: 'PAY_TRACK', label: 'Xem chi tiết → Theo dõi thu tiền', paramKey: 'periodId' },
  { id: 46, from: 'PAY_TRACK', to: 'PAY_CONFIRM', label: 'Có sao kê đủ tiền → Xác nhận thu tiền', paramKey: 'noticeId' },
  { id: 47, from: 'PAY_TRACK', to: 'PAY_CORRECT', label: 'Xác nhận nhầm → Sửa xác nhận thu', paramKey: 'noticeId' },
  { id: 48, from: 'PAY_TRACK', to: 'DEBT', label: 'Khoản quá hạn chưa nộp → Xem công nợ' },
  { id: 49, from: 'DEBT_DETAIL', to: 'PAY_NOTICE_DETAIL', label: 'Xem thông báo thanh toán gốc', paramKey: 'noticeId' },
  { id: 50, from: 'DEBT_BASIS', to: 'CONTRACT_DETAIL', label: 'Xem điều khoản hợp đồng gốc', paramKey: 'contractId' },
  { id: 51, from: 'REPORT_CHECK', to: 'PAY_CALC', label: 'Sai lệch tính tiền → Sửa tại nguồn tính', paramKey: 'periodId' },
  { id: 52, from: 'REPORT_CHECK', to: 'PAY_TRACK', label: 'Sai lệch thu tiền → Sửa tại nguồn thu', paramKey: 'periodId' },
  { id: 53, from: 'REPORT_OCC', to: 'ROOM_DETAIL', label: 'Drill-down chi tiết phòng từ báo cáo', paramKey: 'roomId' },
  { id: 54, from: 'REPORT_MONEY', to: 'PAY_TRACK', label: 'Xem danh sách chi tiết các khoản thu' },
  { id: 55, from: 'REPORT_SUM', to: 'REPORT_CHECK', label: 'Kiểm tra đối soát trước khi xuất báo cáo' },
  { id: 56, from: 'SET_TARIFF', to: 'PAY_CALC', label: 'Đơn giá áp dụng cho tính tiền kỳ' },
  { id: 57, from: 'SET_BANK', to: 'PAY_NOTICE_NEW', label: 'Tài khoản nhận áp dụng cho thông báo QR' },
  { id: 58, from: 'ACCOUNT', to: 'LOGIN', label: 'Đổi mật khẩu thành công → Thu hồi phiên cũ' },
  { id: 59, from: 'LOGOUT', to: 'LOGIN', label: 'Đăng xuất → Quay về màn đăng nhập' },
  { id: 60, from: 'FORGOT', to: 'RESET', label: 'Nhận link email → Đặt lại mật khẩu' },
  { id: 61, from: 'RESET', to: 'LOGIN', label: 'Đặt lại thành công → Đăng nhập lại' }
];
