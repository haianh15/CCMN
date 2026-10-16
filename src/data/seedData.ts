import {
  Room,
  Tenant,
  CoResident,
  Contract,
  RentalTerms,
  AssetInventoryItem,
  AssetStatusReport,
  AssetHandoverProtocol,
  AssetIncident,
  CheckoutPlan,
  CheckoutProtocol,
  TariffConfig,
  BankConfig,
  BillingPeriod,
  MeterReading,
  PeriodCalculation,
  PaymentNotice,
  PaymentTransaction,
  OverdueDebt,
  DepositSettlement
} from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'P101',
    roomNumber: '101',
    floor: 1,
    area: 28,
    basePrice: 4500000,
    status: 'DANG_THUE',
    currentTenantId: 'KT001',
    currentContractId: 'HD-2026-001',
    currentRentalId: 'LT-P101-01',
    note: 'Căn studio tầng 1 thoáng, ban công riêng',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-01'
  },
  {
    id: 'P102',
    roomNumber: '102',
    floor: 1,
    area: 32,
    basePrice: 5000000,
    status: 'DANG_THUE',
    currentTenantId: 'KT002',
    currentContractId: 'HD-2026-002',
    currentRentalId: 'LT-P102-01',
    note: 'Căn 1 ngủ 1 khách, full nội thất gỗ',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-01'
  },
  {
    id: 'P103',
    roomNumber: '103',
    floor: 1,
    area: 25,
    basePrice: 4200000,
    status: 'TRONG',
    note: 'Phòng trống đã dọn sạch, sẵn sàng khách mới vào ở',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-12'
  },
  {
    id: 'P201',
    roomNumber: '201',
    floor: 2,
    area: 30,
    basePrice: 4800000,
    status: 'SAP_TRA',
    currentTenantId: 'KT004',
    currentContractId: 'HD-2026-004',
    currentRentalId: 'LT-P201-01',
    note: 'Khách đã báo kế hoạch trả phòng ngày 28/10/2026',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-05'
  },
  {
    id: 'P202',
    roomNumber: '202',
    floor: 2,
    area: 30,
    basePrice: 4800000,
    status: 'DANG_THUE',
    currentTenantId: 'KT005',
    currentContractId: 'HD-2026-005',
    currentRentalId: 'LT-P202-01',
    note: 'Đang thuê ổn định, đã đóng tiền tháng 10',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-01'
  },
  {
    id: 'P203',
    roomNumber: '203',
    floor: 2,
    area: 26,
    basePrice: 4300000,
    status: 'TRONG',
    note: 'Phòng sạch, vừa thay vòi sen và bảo dưỡng điều hòa',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-14'
  },
  {
    id: 'P301',
    roomNumber: '301',
    floor: 3,
    area: 35,
    basePrice: 5200000,
    status: 'DANG_THUE',
    currentTenantId: 'KT007',
    currentContractId: 'HD-2026-007',
    currentRentalId: 'LT-P301-01',
    note: 'Khoản thu tháng 09/2026 bị quá hạn 12 ngày, đã nhắc 2 lần',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-12'
  },
  {
    id: 'P302',
    roomNumber: '302',
    floor: 3,
    area: 30,
    basePrice: 4800000,
    status: 'DANG_THUE',
    currentTenantId: 'KT008',
    currentContractId: 'HD-2026-008-NT',
    currentRentalId: 'LT-P302-02',
    note: 'Đã ký hợp đồng nối tiếp thành công, kế thừa cọc gốc',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-08'
  },
  {
    id: 'P303',
    roomNumber: '303',
    floor: 3,
    area: 28,
    basePrice: 4600000,
    status: 'CHUA_BAN_GIAO_XONG',
    currentTenantId: 'KT009',
    currentContractId: 'HD-2026-009',
    currentRentalId: 'LT-P303-01',
    note: 'Chưa bàn giao xong: Khách chưa dọn hết tủ đồ và chưa trả chìa khóa phụ',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-14'
  },
  {
    id: 'P401',
    roomNumber: '401',
    floor: 4,
    area: 32,
    basePrice: 5000000,
    status: 'TRONG',
    note: 'Vừa thanh lý hợp đồng và hoàn cọc ngày 10/10/2026, phòng trống',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-10'
  },
  {
    id: 'P402',
    roomNumber: '402',
    floor: 4,
    area: 28,
    basePrice: 4500000,
    status: 'TRONG',
    note: 'Đã ký hợp đồng nhưng chưa nhận phòng: Thiếu tiền cọc và tháng đầu',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-13'
  },
  {
    id: 'P403',
    roomNumber: '403',
    floor: 4,
    area: 40,
    basePrice: 5800000,
    status: 'DANG_THUE',
    currentTenantId: 'KT012',
    currentContractId: 'HD-2026-012',
    currentRentalId: 'LT-P403-01',
    note: 'Căn góc 2 mặt thoáng, gia đình 2 người ở',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-01'
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'KT001',
    code: 'KT001',
    fullName: 'Nguyễn Văn An',
    phone: '0912 345 678',
    idCardNumber: '001095******',
    idCardIssuedDate: '15/04/2021',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội',
    email: 'an.nguyen95@gmail.com',
    currentRoomId: 'P101',
    status: 'DANG_THUE',
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15'
  },
  {
    id: 'KT002',
    code: 'KT002',
    fullName: 'Trần Thị Bích',
    phone: '0988 123 456',
    idCardNumber: '024198******',
    idCardIssuedDate: '20/08/2022',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'Phường Hạ Long, TP. Hạ Long, Quảng Ninh',
    email: 'bich.tran98@outlook.com',
    currentRoomId: 'P102',
    status: 'DANG_THUE',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01'
  },
  {
    id: 'KT003',
    code: 'KT003',
    fullName: 'Lê Hoàng Cường',
    phone: '0903 888 999',
    idCardNumber: '031092******',
    idCardIssuedDate: '10/11/2020',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'Quận Ngô Quyền, Hải Phòng',
    email: 'cuong.le@techcorp.vn',
    status: 'TIEM_NANG',
    createdAt: '2026-10-10',
    updatedAt: '2026-10-10'
  },
  {
    id: 'KT004',
    code: 'KT004',
    fullName: 'Phạm Minh Đức',
    phone: '0977 444 555',
    idCardNumber: '019097******',
    idCardIssuedDate: '12/03/2021',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'TP. Thái Bình, Thái Bình',
    email: 'duc.pham97@gmail.com',
    currentRoomId: 'P201',
    status: 'DANG_THUE',
    createdAt: '2026-03-01',
    updatedAt: '2026-10-05'
  },
  {
    id: 'KT005',
    code: 'KT005',
    fullName: 'Hoàng Thu Dung',
    phone: '0936 222 333',
    idCardNumber: '027196******',
    idCardIssuedDate: '05/06/2022',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'TP. Bắc Ninh, Bắc Ninh',
    email: 'dung.hoang@company.com',
    currentRoomId: 'P202',
    status: 'DANG_THUE',
    createdAt: '2026-02-15',
    updatedAt: '2026-02-15'
  },
  {
    id: 'KT006',
    code: 'KT006',
    fullName: 'Vũ Đức Giang',
    phone: '0966 777 888',
    idCardNumber: '035099******',
    idCardIssuedDate: '18/09/2021',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'TP. Nam Định, Nam Định',
    email: 'giang.vu99@gmail.com',
    status: 'TIEM_NANG',
    createdAt: '2026-10-12',
    updatedAt: '2026-10-12'
  },
  {
    id: 'KT007',
    code: 'KT007',
    fullName: 'Đỗ Mạnh Hùng',
    phone: '0915 678 901',
    idCardNumber: '001090******',
    idCardIssuedDate: '25/01/2020',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'Thanh Xuân, Hà Nội',
    email: 'hung.do@freelance.vn',
    currentRoomId: 'P301',
    status: 'DANG_THUE',
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12'
  },
  {
    id: 'KT008',
    code: 'KT008',
    fullName: 'Đặng Mai Lan',
    phone: '0982 999 111',
    idCardNumber: '026194******',
    idCardIssuedDate: '09/07/2021',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'TP. Vĩnh Yên, Vĩnh Phúc',
    email: 'lan.dang@edu.vn',
    currentRoomId: 'P302',
    status: 'DANG_THUE',
    createdAt: '2026-01-05',
    updatedAt: '2026-10-08'
  },
  {
    id: 'KT009',
    code: 'KT009',
    fullName: 'Bùi Tuấn Kiệt',
    phone: '0943 111 222',
    idCardNumber: '038096******',
    idCardIssuedDate: '14/05/2022',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'TP. Thanh Hóa, Thanh Hóa',
    email: 'kiet.bui@gmail.com',
    currentRoomId: 'P303',
    status: 'DANG_THUE',
    createdAt: '2026-01-20',
    updatedAt: '2026-10-14'
  },
  {
    id: 'KT010',
    code: 'KT010',
    fullName: 'Lý Quốc Nam',
    phone: '0904 555 666',
    idCardNumber: '001089******',
    idCardIssuedDate: '11/02/2020',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'Đống Đa, Hà Nội',
    email: 'nam.ly@gmail.com',
    status: 'DA_TRA',
    createdAt: '2026-01-01',
    updatedAt: '2026-10-10'
  },
  {
    id: 'KT011',
    code: 'KT011',
    fullName: 'Dương Thị Oanh',
    phone: '0979 333 444',
    idCardNumber: '020198******',
    idCardIssuedDate: '28/08/2021',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'TP. Lạng Sơn, Lạng Sơn',
    email: 'oanh.duong@agency.com',
    currentRoomId: 'P402',
    status: 'TIEM_NANG',
    createdAt: '2026-10-13',
    updatedAt: '2026-10-13'
  },
  {
    id: 'KT012',
    code: 'KT012',
    fullName: 'Phan Bảo Phúc',
    phone: '0918 000 777',
    idCardNumber: '040093******',
    idCardIssuedDate: '03/12/2021',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'TP. Vinh, Nghệ An',
    email: 'phuc.phan@design.com',
    currentRoomId: 'P403',
    status: 'DANG_THUE',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'KT013',
    code: 'KT013',
    fullName: 'Trịnh Thảo Quyên',
    phone: '0934 888 222',
    idCardNumber: '001199******',
    idCardIssuedDate: '19/10/2022',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'Cầu Giấy, Hà Nội',
    email: 'quyen.trinh@gmail.com',
    status: 'TIEM_NANG',
    createdAt: '2026-10-11',
    updatedAt: '2026-10-11'
  },
  {
    id: 'KT014',
    code: 'KT014',
    fullName: 'Tạ Minh Sơn',
    phone: '0968 444 111',
    idCardNumber: '017094******',
    idCardIssuedDate: '07/04/2021',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'TP. Hòa Bình, Hòa Bình',
    email: 'son.ta@consulting.vn',
    status: 'TIEM_NANG',
    createdAt: '2026-10-09',
    updatedAt: '2026-10-09'
  },
  {
    id: 'KT015',
    code: 'KT015',
    fullName: 'Đoàn Thúy Vy',
    phone: '0912 999 555',
    idCardNumber: '025197******',
    idCardIssuedDate: '22/06/2022',
    idCardIssuedPlace: 'Cục CSQLHC về TTXH',
    permanentAddress: 'TP. Hải Dương, Hải Dương',
    email: 'vy.doan@gmail.com',
    status: 'TIEM_NANG',
    createdAt: '2026-10-08',
    updatedAt: '2026-10-08'
  }
];

export const INITIAL_CO_RESIDENTS: CoResident[] = [
  {
    id: 'CR001',
    tenantId: 'KT001',
    fullName: 'Nguyễn Văn Bình',
    relationship: 'Em trai',
    phone: '0912 345 679',
    idCardNumber: '001099******',
    arrivalDate: '16/01/2026',
    residenceStatus: 'DANG_O',
    proofDocumentNote: 'Đã nộp bản sao CCCD cho công an phường'
  },
  {
    id: 'CR002',
    tenantId: 'KT002',
    fullName: 'Trần Thị Hà',
    relationship: 'Bạn cùng trường',
    phone: '0988 123 457',
    idCardNumber: '024199******',
    arrivalDate: '05/02/2026',
    residenceStatus: 'DANG_O',
    proofDocumentNote: 'Có xác nhận tạm trú của công an'
  },
  {
    id: 'CR003',
    tenantId: 'KT012',
    fullName: 'Lê Thị Mai',
    relationship: 'Vợ',
    phone: '0918 000 778',
    idCardNumber: '040195******',
    arrivalDate: '02/01/2026',
    residenceStatus: 'DANG_O',
    proofDocumentNote: 'Đăng ký tạm trú cùng chủ hợp đồng'
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'HD-2026-001',
    code: 'HD-2026-001',
    roomId: 'P101',
    tenantId: 'KT001',
    rentalId: 'LT-P101-01',
    type: 'LAN_DAU',
    depositAmount: 4500000,
    isInheritedDeposit: false,
    firstMonthRent: 4500000,
    monthlyRent: 4500000,
    startDate: '15/01/2026',
    endDate: '15/01/2027',
    signedDate: '14/01/2026',
    paperContractProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    status: 'HIEU_LUC',
    terms: 'Hợp đồng thuê căn 101 thời hạn 12 tháng. Đặt cọc 1 tháng, thanh toán tiền thuê đầu mỗi tháng trước ngày 05.',
    createdAt: '2026-01-14',
    updatedAt: '2026-01-14'
  },
  {
    id: 'HD-2026-002',
    code: 'HD-2026-002',
    roomId: 'P102',
    tenantId: 'KT002',
    rentalId: 'LT-P102-01',
    type: 'LAN_DAU',
    depositAmount: 5000000,
    isInheritedDeposit: false,
    firstMonthRent: 5000000,
    monthlyRent: 5000000,
    startDate: '01/02/2026',
    endDate: '01/02/2027',
    signedDate: '31/01/2026',
    paperContractProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    status: 'HIEU_LUC',
    terms: 'Hợp đồng thuê căn 102. Đặt cọc 1 tháng, tiền thuê thanh toán trả trước từng tháng.',
    createdAt: '2026-01-31',
    updatedAt: '2026-01-31'
  },
  {
    id: 'HD-2026-004',
    code: 'HD-2026-004',
    roomId: 'P201',
    tenantId: 'KT004',
    rentalId: 'LT-P201-01',
    type: 'LAN_DAU',
    depositAmount: 4800000,
    isInheritedDeposit: false,
    firstMonthRent: 4800000,
    monthlyRent: 4800000,
    startDate: '01/03/2026',
    endDate: '01/11/2026',
    signedDate: '28/02/2026',
    paperContractProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    status: 'HIEU_LUC',
    terms: 'Hợp đồng thuê 8 tháng căn 201. Sắp hết hạn, khách đã gửi kế hoạch trả phòng.',
    createdAt: '2026-02-28',
    updatedAt: '2026-10-05'
  },
  {
    id: 'HD-2026-005',
    code: 'HD-2026-005',
    roomId: 'P202',
    tenantId: 'KT005',
    rentalId: 'LT-P202-01',
    type: 'LAN_DAU',
    depositAmount: 4800000,
    isInheritedDeposit: false,
    firstMonthRent: 4800000,
    monthlyRent: 4800000,
    startDate: '15/02/2026',
    endDate: '15/02/2027',
    signedDate: '14/02/2026',
    paperContractProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    status: 'HIEU_LUC',
    terms: 'Hợp đồng thuê căn 202 chuẩn 12 tháng.',
    createdAt: '2026-02-14',
    updatedAt: '2026-02-14'
  },
  {
    id: 'HD-2026-007',
    code: 'HD-2026-007',
    roomId: 'P301',
    tenantId: 'KT007',
    rentalId: 'LT-P301-01',
    type: 'LAN_DAU',
    depositAmount: 5200000,
    isInheritedDeposit: false,
    firstMonthRent: 5200000,
    monthlyRent: 5200000,
    startDate: '01/01/2026',
    endDate: '01/01/2027',
    signedDate: '30/12/2025',
    paperContractProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    status: 'HIEU_LUC',
    terms: 'Hợp đồng thuê căn 301. Khoản kỳ 09/2026 đang nợ quá hạn.',
    createdAt: '2025-12-30',
    updatedAt: '2026-10-12'
  },
  {
    id: 'HD-2026-008-NT',
    code: 'HD-2026-008-NT',
    roomId: 'P302',
    tenantId: 'KT008',
    rentalId: 'LT-P302-02',
    type: 'NOI_TIEP',
    parentContractId: 'HD-2025-008-OLD',
    depositAmount: 4800000,
    isInheritedDeposit: true, // KẾ THỪA CỌC CŨ
    firstMonthRent: 4800000,
    monthlyRent: 4800000,
    startDate: '01/10/2026',
    endDate: '01/10/2027',
    signedDate: '25/09/2026',
    paperContractProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    status: 'HIEU_LUC',
    terms: 'Hợp đồng nối tiếp 12 tháng. Kế thừa khoản cọc 4.800.000 VNĐ từ hợp đồng trước, không thu cọc mới.',
    createdAt: '2026-09-25',
    updatedAt: '2026-10-01'
  },
  {
    id: 'HD-2026-009',
    code: 'HD-2026-009',
    roomId: 'P303',
    tenantId: 'KT009',
    rentalId: 'LT-P303-01',
    type: 'LAN_DAU',
    depositAmount: 4600000,
    isInheritedDeposit: false,
    firstMonthRent: 4600000,
    monthlyRent: 4600000,
    startDate: '20/01/2026',
    endDate: '10/10/2026',
    signedDate: '19/01/2026',
    status: 'KET_THUC',
    terms: 'Hợp đồng đã kết thúc kỳ hạn, đang vướng trả phòng chưa xong.',
    createdAt: '2026-01-19',
    updatedAt: '2026-10-10'
  },
  {
    id: 'HD-2026-011-DRAFT',
    code: 'HD-2026-011-DRAFT',
    roomId: 'P402',
    tenantId: 'KT011',
    rentalId: 'LT-P402-01',
    type: 'LAN_DAU',
    depositAmount: 4500000,
    isInheritedDeposit: false,
    firstMonthRent: 4500000,
    monthlyRent: 4500000,
    startDate: '15/10/2026',
    endDate: '15/10/2027',
    signedDate: '13/10/2026',
    paperContractProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    status: 'DA_KY', // Đã ký nhưng chưa thanh toán cọc + thuê đầu nên chưa được nhận phòng!
    terms: 'Hợp đồng thuê căn 402. Đang chờ đối chiếu đủ 1 tháng cọc (4.500.000đ) và 1 tháng thuê đầu (4.500.000đ).',
    createdAt: '2026-10-13',
    updatedAt: '2026-10-13'
  },
  {
    id: 'HD-2026-012',
    code: 'HD-2026-012',
    roomId: 'P403',
    tenantId: 'KT012',
    rentalId: 'LT-P403-01',
    type: 'LAN_DAU',
    depositAmount: 5800000,
    isInheritedDeposit: false,
    firstMonthRent: 5800000,
    monthlyRent: 5800000,
    startDate: '01/01/2026',
    endDate: '01/01/2027',
    signedDate: '30/12/2025',
    paperContractProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    status: 'HIEU_LUC',
    terms: 'Hợp đồng thuê căn góc 403.',
    createdAt: '2025-12-30',
    updatedAt: '2025-12-30'
  }
];

export const INITIAL_RENTAL_TERMS: Record<string, RentalTerms> = {
  P103: {
    roomId: 'P103',
    tenantId: 'KT003',
    durationMonths: 12,
    startDate: '20/10/2026',
    endDate: '20/10/2027',
    monthlyRent: 4200000,
    depositAmount: 4200000,
    firstMonthRent: 4200000,
    serviceFeePerMonth: 120000,
    electricityRateType: 'Theo công tơ (3.800 đ/kWh)',
    waterRateType: 'Theo đồng hồ (25.000 đ/m3)',
    notes: 'Khách Lê Hoàng Cường đồng ý dọn vào ngày 20/10/2026',
    agreedAt: '2026-10-14'
  }
};

export const INITIAL_ASSET_ITEMS: AssetInventoryItem[] = [
  // Room 101
  {
    id: 'AST-101-01',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    assetName: 'Điều hòa Panasonic 12000BTU Inverter',
    category: 'DIEN_MAY',
    quantity: 1,
    initialCondition: 'Mới 98%, làm mát nhanh, điều khiển kèm pin tốt',
    isDamagedOrMissing: false
  },
  {
    id: 'AST-101-02',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    assetName: 'Tủ lạnh Casper 185L',
    category: 'DIEN_MAY',
    quantity: 1,
    initialCondition: 'Hoạt động êm, không trầy xước, đầy đủ khay kính',
    isDamagedOrMissing: false
  },
  {
    id: 'AST-101-03',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    assetName: 'Giường ngủ gỗ MDF An Cường 1m6 x 2m',
    category: 'NOI_THAT',
    quantity: 1,
    initialCondition: 'Chắc chắn, dát giường nguyên vẹn, kèm đệm cao su 10cm',
    isDamagedOrMissing: false
  },
  {
    id: 'AST-101-04',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    assetName: 'Bình nóng lạnh Ariston 30L',
    category: 'THIET_BI_VE_SINH',
    quantity: 1,
    initialCondition: 'Chống giật hoạt động chuẩn, đủ van an toàn',
    isDamagedOrMissing: false
  },
  // Room 201 (Sắp trả)
  {
    id: 'AST-201-01',
    roomId: 'P201',
    rentalId: 'LT-P201-01',
    assetName: 'Điều hòa Daikin 9000BTU',
    category: 'DIEN_MAY',
    quantity: 1,
    initialCondition: 'Hoạt động tốt, gas đủ',
    returnCondition: 'Chưa đối chiếu lúc trả',
    isDamagedOrMissing: false
  },
  {
    id: 'AST-201-02',
    roomId: 'P201',
    rentalId: 'LT-P201-01',
    assetName: 'Tủ quần áo 3 cánh gỗ công nghiệp',
    category: 'NOI_THAT',
    quantity: 1,
    initialCondition: 'Cánh cửa trơn tru, kèm 2 chìa',
    isDamagedOrMissing: false
  },
  // Room 303 (Chưa bàn giao xong - có chênh lệch)
  {
    id: 'AST-303-01',
    roomId: 'P303',
    rentalId: 'LT-P303-01',
    assetName: 'Cửa kính ban công & khóa tay gạt',
    category: 'NOI_THAT',
    quantity: 1,
    initialCondition: 'Kính trong suốt, khóa trơn tru',
    returnCondition: 'Tay gạt bị lỏng, nứt nhẹ góc nẹp nhôm',
    difference: 'Hư hỏng tay gạt khóa cần thay phụ kiện',
    isDamagedOrMissing: true,
    compensationAmount: 250000,
    note: 'Đã lập biên bản ghi nhận hiện trường'
  },
  {
    id: 'AST-303-02',
    roomId: 'P303',
    rentalId: 'LT-P303-01',
    assetName: 'Chìa khóa phòng & thẻ từ thang máy',
    category: 'KHAC',
    quantity: 2,
    initialCondition: 'Đủ 2 chìa phòng cơ và 2 thẻ từ',
    returnCondition: 'Chỉ mới giao 1 chìa cơ, thiếu 1 chìa phụ và 1 thẻ từ',
    difference: 'Thiếu 01 chìa khóa phụ + 01 thẻ từ thang máy',
    isDamagedOrMissing: true,
    compensationAmount: 150000,
    note: 'Khách hẹn tìm lại trước ngày 16/10'
  }
];

export const INITIAL_ASSET_REPORTS: AssetStatusReport[] = [
  {
    id: 'RP-101',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    recordedDate: '15/01/2026',
    overallDescription: 'Tường sơn mới màu trắng ngà, trần thạch cao không thấm dột, sàn gạch men 60x60 bóng sạch.',
    evidenceImages: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80'
    ],
    inspector: 'Nguyễn Văn Minh (Chủ nhà)',
    tenantConfirmed: true
  }
];

export const INITIAL_HANDOVER_PROTOCOLS: AssetHandoverProtocol[] = [
  {
    id: 'BB-101',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    contractId: 'HD-2026-001',
    date: '15/01/2026',
    paperHandoverSigned: true,
    paperProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    notes: 'Đã kiểm tra vận hành thử các thiết bị điện máy, hai bên cùng ký biên bản giấy.',
    status: 'DA_KY'
  }
];

export const INITIAL_INCIDENTS: AssetIncident[] = [
  {
    id: 'SC-2026-001',
    code: 'SC-2026-001',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    assetName: 'Điều hòa Panasonic phòng 101',
    date: '12/08/2026',
    description: 'Chảy nước nhẹ ở máng ngưng dàn lạnh xuống sàn gỗ',
    evidenceImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    status: 'HOAN_TAT',
    actionStep: 'Đã gọi thợ điện lạnh thông ống thoát nước và vệ sinh lưới lọc',
    repairCost: 200000,
    paidBy: 'CHU_NHA',
    historyNotes: [
      { date: '12/08/2026', content: 'Khách báo chảy nước máng ngưng', by: 'Khách thuê' },
      { date: '13/08/2026', content: 'Thợ hoàn thành thông ống, chạy thử 2 giờ bình thường', by: 'Chủ nhà' }
    ]
  },
  {
    id: 'SC-2026-002',
    code: 'SC-2026-002',
    roomId: 'P202',
    rentalId: 'LT-P202-01',
    assetName: 'Vòi sen vệ sinh phòng 202',
    date: '02/10/2026',
    description: 'Bị rỉ nước ở đầu ren nối ống mềm inox',
    status: 'CHO_XU_LY',
    actionStep: 'Đang chờ thợ mang gioăng cao su mới tới thay',
    repairCost: 80000,
    paidBy: 'CHU_NHA',
    historyNotes: [
      { date: '02/10/2026', content: 'Ghi nhận rò rỉ nước, đã khóa van tạm thời', by: 'Chủ nhà' }
    ]
  }
];

export const INITIAL_CHECKOUT_PLANS: CheckoutPlan[] = [
  {
    id: 'PL-P201',
    roomId: 'P201',
    rentalId: 'LT-P201-01',
    plannedDate: '28/10/2026',
    confirmedChannel: 'ZALO',
    notes: 'Khách Phạm Minh Đức chuyển về quê lấy vợ, hẹn kiểm tra phòng lúc 14h ngày 28/10',
    status: 'DANG_CHO',
    history: [
      {
        date: '05/10/2026 09:30',
        channel: 'Zalo',
        content: 'Khách nhắn trước 23 ngày theo đúng thỏa thuận hợp đồng',
        recorder: 'Chủ nhà',
        newExpectedDate: '28/10/2026'
      }
    ]
  },
  {
    id: 'PL-P302-OLD',
    roomId: 'P302',
    rentalId: 'LT-P302-01',
    plannedDate: '30/09/2026',
    confirmedChannel: 'TRUC_TIEP',
    notes: 'Kế hoạch trả cũ đã bị HỦY TỰ ĐỘNG do khách ký hợp đồng nối tiếp HD-2026-008-NT',
    status: 'DA_HUY_DO_NOI_TIEP',
    history: [
      {
        date: '01/09/2026',
        channel: 'Trực tiếp',
        content: 'Dự kiến trả phòng hết hạn hợp đồng 1',
        recorder: 'Chủ nhà'
      },
      {
        date: '25/09/2026',
        channel: 'Hệ thống',
        content: 'Tự động hủy kế hoạch trả cũ theo sự kiện Hợp đồng nối tiếp có hiệu lực',
        recorder: 'Hệ thống'
      }
    ]
  }
];

export const INITIAL_CHECKOUT_PROTOCOLS: CheckoutProtocol[] = [
  {
    id: 'CK-P303',
    roomId: 'P303',
    rentalId: 'LT-P303-01',
    draftDate: '10/10/2026',
    actualReturnDate: '12/10/2026',
    actualReturnConfirmed: false,
    finalElectricNumber: 1540,
    finalWaterNumber: 88,
    isPendingResolution: true, // Vướng chưa bàn giao xong
    pendingReason: 'Khách chưa dọn sạch đồ cá nhân và thiếu 1 chìa khóa + 1 thẻ từ thang máy',
    paperProtocolSigned: false,
    status: 'CHUA_XONG',
    verifiedCheckoutConditions: false
  },
  {
    id: 'CK-P401',
    roomId: 'P401',
    rentalId: 'LT-P401-01',
    draftDate: '08/10/2026',
    actualReturnDate: '10/10/2026',
    actualReturnConfirmed: true,
    finalElectricNumber: 2190,
    finalWaterNumber: 114,
    isPendingResolution: false,
    paperProtocolSigned: true,
    paperProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    status: 'HOAN_TAT',
    verifiedCheckoutConditions: true
  }
];

export const INITIAL_TARIFFS: TariffConfig[] = [
  {
    id: 'TF-2026-V1',
    versionName: 'Phiên bản Đơn giá Q1-Q2/2026',
    effectiveFrom: '01/01/2026',
    electricityPricePerKwh: 3500,
    waterPricePerM3: 25000,
    fixedServiceFeePerTenancy: 120000,
    garbageFeePerRoom: 30000,
    wifiFeePerRoom: 50000,
    isActive: false,
    updatedBy: 'Chủ nhà Nguyễn Văn Minh',
    notes: 'Biểu phí cũ đầu năm 2026'
  },
  {
    id: 'TF-2026-V2',
    versionName: 'Phiên bản Đơn giá hiện hành (Áp dụng từ 01/07/2026)',
    effectiveFrom: '01/07/2026',
    electricityPricePerKwh: 3800,
    waterPricePerM3: 28000,
    fixedServiceFeePerTenancy: 150000, // Đóng đủ phí cố định cho mỗi lượt thuê
    garbageFeePerRoom: 30000,
    wifiFeePerRoom: 50000,
    isActive: true,
    updatedBy: 'Chủ nhà Nguyễn Văn Minh',
    notes: 'Áp dụng biểu giá điện EVN bậc cao và nước sạch thành phố điều chỉnh tháng 7'
  }
];

export const INITIAL_BANK_CONFIGS: BankConfig[] = [
  {
    id: 'BK-01-OLD',
    bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
    bankCode: 'VCB',
    accountNumber: '0011004567890',
    accountHolder: 'NGUYEN VAN MINH',
    branch: 'Sở giao dịch Hà Nội',
    effectiveFrom: '01/01/2025',
    isActive: false,
    updatedBy: 'Chủ nhà'
  },
  {
    id: 'BK-02-ACTIVE',
    bankName: 'Ngân hàng Quân Đội (MBBank)',
    bankCode: 'MB',
    accountNumber: '0912345678888',
    accountHolder: 'NGUYEN VAN MINH',
    branch: 'Chi nhánh Cầu Giấy',
    effectiveFrom: '01/06/2026',
    isActive: true,
    updatedBy: 'Chủ nhà'
  }
];

export const INITIAL_PERIODS: BillingPeriod[] = [
  {
    id: 'KY-2026-09',
    monthYear: '09/2026',
    rentForPeriodMonthYear: '10/2026',
    serviceForPeriodMonthYear: '09/2026',
    status: 'DA_DOI_CHIEU'
  },
  {
    id: 'KY-2026-10',
    monthYear: '10/2026',
    rentForPeriodMonthYear: '11/2026', // Tiền thuê tháng tới trả trước
    serviceForPeriodMonthYear: '10/2026', // Điện nước dùng tháng hiện tại
    status: 'DA_CHOT_SO'
  }
];

export const INITIAL_METER_READINGS: MeterReading[] = [
  // Kỳ 09/2026
  {
    id: 'MR-09-P101',
    periodId: 'KY-2026-09',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    recordedDate: '30/09/2026',
    electricOld: 1250,
    electricNew: 1390,
    waterOld: 45,
    waterNew: 53,
    electricProofUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f79a?auto=format&fit=crop&w=400&q=80',
    waterProofUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    editHistory: []
  },
  {
    id: 'MR-09-P301',
    periodId: 'KY-2026-09',
    roomId: 'P301',
    rentalId: 'LT-P301-01',
    recordedDate: '30/09/2026',
    electricOld: 2100,
    electricNew: 2280,
    waterOld: 80,
    waterNew: 92,
    electricProofUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f79a?auto=format&fit=crop&w=400&q=80',
    waterProofUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    editHistory: []
  },
  // Kỳ 10/2026
  {
    id: 'MR-10-P101',
    periodId: 'KY-2026-10',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    recordedDate: '15/10/2026',
    electricOld: 1390,
    electricNew: 1535, // Dùng 145 số
    waterOld: 53,
    waterNew: 61, // Dùng 8 m3
    electricProofUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f79a?auto=format&fit=crop&w=400&q=80',
    waterProofUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    editHistory: []
  },
  {
    id: 'MR-10-P102',
    periodId: 'KY-2026-10',
    roomId: 'P102',
    rentalId: 'LT-P102-01',
    recordedDate: '15/10/2026',
    electricOld: 980,
    electricNew: 1120, // 140 số
    waterOld: 32,
    waterNew: 41, // 9 m3
    electricProofUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f79a?auto=format&fit=crop&w=400&q=80',
    waterProofUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    editHistory: []
  }
];

export const INITIAL_CALCULATIONS: PeriodCalculation[] = [
  // Room 101 kỳ 10/2026
  {
    id: 'CALC-10-101',
    periodId: 'KY-2026-10',
    roomId: 'P101',
    rentalId: 'LT-P101-01',
    tenantId: 'KT001',
    nextMonthRent: 4500000,
    rentPeriodLabel: 'Tiền thuê tháng 11/2026 (trả trước)',
    electricUsage: 145,
    electricRate: 3800,
    electricAmount: 551000,
    electricPeriodLabel: 'Điện dùng tháng 10/2026 (145 kWh)',
    waterUsage: 8,
    waterRate: 28000,
    waterAmount: 224000,
    waterPeriodLabel: 'Nước dùng tháng 10/2026 (8 m³)',
    fixedServiceAmount: 150000,
    fixedServiceRate: 150000,
    wifiAmount: 50000,
    garbageAmount: 30000,
    totalServiceAmount: 1005000,
    totalDueCurrentPeriod: 5505000, // 4.5M + 1.005M
    previousUnpaidBalance: 0,
    tariffVersionUsed: 'TF-2026-V2',
    isReconciled: true,
    reconciliationNotes: 'Số liệu khớp công tơ và biểu giá V2'
  },
  // Room 301 kỳ 09/2026 (Có nợ quá hạn)
  {
    id: 'CALC-09-301',
    periodId: 'KY-2026-09',
    roomId: 'P301',
    rentalId: 'LT-P301-01',
    tenantId: 'KT007',
    nextMonthRent: 5200000,
    rentPeriodLabel: 'Tiền thuê tháng 10/2026 (trả trước)',
    electricUsage: 180,
    electricRate: 3800,
    electricAmount: 684000,
    electricPeriodLabel: 'Điện dùng tháng 09/2026 (180 kWh)',
    waterUsage: 12,
    waterRate: 28000,
    waterAmount: 336000,
    waterPeriodLabel: 'Nước dùng tháng 09/2026 (12 m³)',
    fixedServiceAmount: 150000,
    fixedServiceRate: 150000,
    wifiAmount: 50000,
    garbageAmount: 30000,
    totalServiceAmount: 1200000,
    totalDueCurrentPeriod: 6400000, // 5.2M + 1.2M
    previousUnpaidBalance: 0,
    tariffVersionUsed: 'TF-2026-V2',
    isReconciled: true,
    reconciliationNotes: 'Đã lập thông báo TB-2026-09-301'
  }
];

export const INITIAL_PAYMENT_NOTICES: PaymentNotice[] = [
  {
    id: 'TB-2026-09-301',
    code: 'TB-2026-09-301',
    periodId: 'KY-2026-09',
    roomId: 'P301',
    tenantId: 'KT007',
    calcId: 'CALC-09-301',
    issuedDate: '01/10/2026',
    dueDate: '05/10/2026', // Đã quá hạn!
    totalAmount: 6400000,
    rentAmount: 5200000,
    serviceAmount: 1200000,
    bankSnapshot: {
      bankName: 'MBBank',
      accountNumber: '0912345678888',
      accountHolder: 'NGUYEN VAN MINH',
      transferContent: 'P301 THANG 10'
    },
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|0912345678888|NGUYEN%20VAN%20MINH||0|0|6400000|P301%20THANG%2010|transfer_myqr',
    status: 'DANG_HIEU_LUC',
    shareLog: [
      { date: '01/10/2026 14:20', channel: 'Zalo' }
    ]
  },
  {
    id: 'TB-2026-10-101',
    code: 'TB-2026-10-101',
    periodId: 'KY-2026-10',
    roomId: 'P101',
    tenantId: 'KT001',
    calcId: 'CALC-10-101',
    issuedDate: '15/10/2026',
    dueDate: '20/10/2026',
    totalAmount: 5505000,
    rentAmount: 4500000,
    serviceAmount: 1005000,
    bankSnapshot: {
      bankName: 'MBBank',
      accountNumber: '0912345678888',
      accountHolder: 'NGUYEN VAN MINH',
      transferContent: 'P101 THANG 11'
    },
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|0912345678888|NGUYEN%20VAN%20MINH||0|0|5505000|P101%20THANG%2011|transfer_myqr',
    status: 'DANG_HIEU_LUC',
    shareLog: []
  }
];

export const INITIAL_PAYMENT_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'TX-2026-09-301',
    noticeId: 'TB-2026-09-301',
    periodId: 'KY-2026-09',
    roomId: 'P301',
    tenantId: 'KT007',
    totalDue: 6400000,
    status: 'QUA_HAN',
    correctionHistory: []
  },
  {
    id: 'TX-2026-10-101',
    noticeId: 'TB-2026-10-101',
    periodId: 'KY-2026-10',
    roomId: 'P101',
    tenantId: 'KT001',
    totalDue: 5505000,
    status: 'CHUA_THU',
    correctionHistory: []
  },
  {
    id: 'TX-2026-09-102',
    noticeId: 'TB-2026-09-102',
    periodId: 'KY-2026-09',
    roomId: 'P102',
    tenantId: 'KT002',
    totalDue: 5950000,
    status: 'DA_THU',
    receivedAmount: 5950000,
    receivedDate: '04/10/2026',
    bankTransactionRef: 'MB-FT26278891234',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    confirmedBy: 'Chủ nhà',
    confirmedAt: '04/10/2026 19:15',
    correctionHistory: []
  }
];

export const INITIAL_OVERDUE_DEBTS: OverdueDebt[] = [
  {
    id: 'DEBT-P301-09',
    noticeId: 'TB-2026-09-301',
    roomId: 'P301',
    tenantId: 'KT007',
    periodId: 'KY-2026-09',
    originalDueDate: '05/10/2026',
    unpaidAmount: 6400000,
    daysOverdue: 10,
    reminderHistory: [
      {
        id: 'REM-01',
        date: '07/10/2026 10:15',
        channel: 'DIEN_THOAI',
        content: 'Chủ nhà gọi điện nhắc đóng tiền nhà và điện nước kỳ tháng 10. Khách báo đang công tác.',
        conductedBy: 'Chủ nhà'
      },
      {
        id: 'REM-02',
        date: '11/10/2026 15:30',
        channel: 'ZALO',
        content: 'Gửi lại ảnh thông báo kèm QR qua Zalo nhắc hạn đã quá 6 ngày.',
        conductedBy: 'Chủ nhà'
      }
    ],
    tenantReplies: [
      {
        id: 'REP-01',
        date: '11/10/2026 16:00',
        channel: 'ZALO',
        replyContent: 'Anh thông cảm em đang chờ công ty thanh toán lương, em hứa ngày 18/10 sẽ chuyển khoản đủ 100%.',
        promisedPaymentDate: '18/10/2026',
        notes: 'Khách hẹn ngày 18/10. Theo nghiệp vụ, ngày hẹn này KHÔNG làm thay đổi hạn nộp gốc 05/10.'
      }
    ]
  }
];

export const INITIAL_DEPOSIT_SETTLEMENTS: DepositSettlement[] = [
  {
    id: 'QTC-P401',
    roomId: 'P401',
    rentalId: 'LT-P401-01',
    tenantId: 'KT010',
    contractId: 'HD-2025-010-OLD',
    originalDeposit: 5000000,
    remainingRentalObligation: 0,
    finalServiceObligation: 480000, // Tiền điện nước ngày cuối
    assetDamageDeduction: 0,
    assetDamageNotes: 'Tài sản bàn giao đầy đủ, sạch sẽ',
    otherDeductions: 0,
    otherDeductionNotes: '',
    netRefundAmount: 4520000, // Hoàn lại 4.520.000 VNĐ
    settlementDate: '10/10/2026',
    status: 'DA_CHOT_HOAN_TIEN',
    actualSettlementProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    actualSettledDate: '10/10/2026',
    paymentMethod: 'CHUYEN_KHOAN_HOAN_COC',
    amendmentHistory: []
  },
  {
    id: 'QTC-P303',
    roomId: 'P303',
    rentalId: 'LT-P303-01',
    tenantId: 'KT009',
    contractId: 'HD-2026-009',
    originalDeposit: 4600000,
    remainingRentalObligation: 0,
    finalServiceObligation: 520000,
    assetDamageDeduction: 400000, // Khấu trừ hỏng tay gạt + mất chìa/thẻ
    assetDamageNotes: 'Tay gạt cửa ban công hỏng (250k) + Mất 1 thẻ từ và chìa khóa phụ (150k)',
    otherDeductions: 0,
    otherDeductionNotes: '',
    netRefundAmount: 3680000,
    settlementDate: '14/10/2026',
    status: 'TRANH_CHAP', // Khách đang tranh chấp mức khấu trừ
    amendmentHistory: [
      {
        date: '14/10/2026',
        reason: 'Khách khiếu nại tay gạt cửa đã cũ sẵn từ trước, đề nghị chỉ chịu phí thẻ từ 150k',
        adjustedAmount: 400000,
        by: 'Khách phản hồi'
      }
    ]
  }
];
