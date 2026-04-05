import type {
    ApartmentStatus,
    BillStatus,
    FeeType,
    PaymentMethod,
    VehicleType,
    VehicleStatus,
    RequestType,
    RequestStatus,
    RequestPriority,
    RegistrationStatus,
    AnnouncementPriority,
    UserRole,
} from "../types/common";

export const PAGE_SIZE = 10;
export const APP_NAME = import.meta.env.VITE_APP_NAME ?? "Apartment Management";

export const APARTMENT_STATUS_LABELS: Record<ApartmentStatus, string> = {
    AVAILABLE: "Trống",
    OCCUPIED: "Đang ở",
    MAINTENANCE: "Bảo trì",
    RESERVED: "Đã đặt",
};

export const APARTMENT_STATUS_COLORS: Record<ApartmentStatus, string> = {
    AVAILABLE: "bg-green-100 text-green-700",
    OCCUPIED: "bg-blue-100 text-blue-700",
    MAINTENANCE: "bg-yellow-100 text-yellow-700",
    RESERVED: "bg-purple-100 text-purple-700",
};

export const BILL_STATUS_LABELS: Record<BillStatus, string> = {
    PENDING: "Chờ thanh toán",
    PARTIALLY_PAID: "Thanh toán một phần",
    PAID: "Đã thanh toán",
    OVERDUE: "Quá hạn",
    CANCELLED: "Đã huỷ",
};

export const BILL_STATUS_COLORS: Record<BillStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PARTIALLY_PAID: "bg-blue-100 text-blue-700",
    PAID: "bg-green-100 text-green-700",
    OVERDUE: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
};

export const FEE_TYPE_LABELS: Record<FeeType, string> = {
    ELECTRICITY: "Tiền điện",
    WATER: "Tiền nước",
    MANAGEMENT: "Phí quản lý",
    PARKING_MOTORBIKE: "Phí xe máy",
    PARKING_CAR: "Phí ô tô",
    GARBAGE: "Phí rác",
    INTERNET: "Phí Internet",
    ELEVATOR: "Phí thang máy",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    CASH: "Tiền mặt",
    VNPAY: "VNPay",
    MOMO: "MoMo",
    BANK_TRANSFER: "Chuyển khoản",
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
    MOTORBIKE: "Xe máy",
    CAR: "Ô tô",
    BICYCLE: "Xe đạp",
    TRUCK: "Xe tải",
};

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
    PENDING_APPROVAL: "Chờ duyệt",
    ACTIVE: "Đang sử dụng",
    INACTIVE: "Ngừng sử dụng",
    REJECTED: "Từ chối",
};

export const VEHICLE_STATUS_COLORS: Record<VehicleStatus, string> = {
    PENDING_APPROVAL: "bg-yellow-100 text-yellow-700",
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-500",
    REJECTED: "bg-red-100 text-red-700",
};

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
    MAINTENANCE: "Sửa chữa",
    COMPLAINT: "Phản ánh",
    INQUIRY: "Thắc mắc",
    AMENITY: "Tiện ích",
    OTHER: "Khác",
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
    PENDING: "Chờ tiếp nhận",
    ASSIGNED: "Đã phân công",
    IN_PROGRESS: "Đang xử lý",
    RESOLVED: "Đã giải quyết",
    CLOSED: "Đã đóng",
    REJECTED: "Từ chối",
};

export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-indigo-100 text-indigo-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-100 text-gray-500",
    REJECTED: "bg-red-100 text-red-700",
};

export const REQUEST_PRIORITY_LABELS: Record<RequestPriority, string> = {
    LOW: "Thấp",
    MEDIUM: "Trung bình",
    HIGH: "Cao",
    URGENT: "Khẩn cấp",
};

export const REQUEST_PRIORITY_COLORS: Record<RequestPriority, string> = {
    LOW: "bg-gray-100 text-gray-600",
    MEDIUM: "bg-blue-100 text-blue-600",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
};

export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
    PENDING: "Chờ duyệt",
    ACTIVE: "Đang sử dụng",
    EXPIRED: "Hết hạn",
    CANCELLED: "Đã huỷ",
};

export const ANNOUNCEMENT_PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
    NORMAL: "Thông thường",
    IMPORTANT: "Quan trọng",
    URGENT: "Khẩn cấp",
};

export const ANNOUNCEMENT_PRIORITY_COLORS: Record<AnnouncementPriority, string> = {
    NORMAL: "bg-gray-100 text-gray-600",
    IMPORTANT: "bg-blue-100 text-blue-700",
    URGENT: "bg-red-100 text-red-700",
};

export const ROLE_LABELS: Record<UserRole, string> = {
    ROLE_ADMIN: "Quản trị viên",
    ROLE_MANAGER: "Ban quản lý",
    ROLE_RESIDENT: "Cư dân",
};

// ── Navigation menus ──────────────────────────────────────────────────────

export const ADMIN_NAV = [
    { label: "Dashboard", path: "/admin", icon: "dashboard" },
    { label: "Tòa nhà", path: "/admin/buildings", icon: "domain" },
    { label: "Căn hộ", path: "/admin/apartments", icon: "apartment" },
    { label: "Người dùng", path: "/admin/users", icon: "groups" },
    { label: "Cấu hình phí", path: "/admin/fee-configs", icon: "payments" },
    { label: "Dịch vụ", path: "/admin/service-types", icon: "room_service" },
    { label: "Báo cáo", path: "/admin/reports/revenue", icon: "bar_chart" },
];

export const MANAGER_NAV = [
    { label: "Dashboard", path: "/manager", icon: "dashboard" },
    { label: "Căn hộ", path: "/manager/apartments", icon: "domain" },
    { label: "Cư dân", path: "/manager/residents", icon: "groups" },
    { label: "Hóa đơn", path: "/manager/bills", icon: "receipt_long" },
    { label: "Yêu cầu", path: "/manager/service-requests", icon: "assignment" },
    { label: "Đăng ký xe", path: "/manager/vehicles", icon: "directions_car" },
    { label: "Dịch vụ", path: "/manager/service-registrations", icon: "app_registration" },
    { label: "Thông báo", path: "/manager/announcements", icon: "campaign" },
];

export const RESIDENT_NAV = [
    { label: "Tổng quan", path: "/resident", icon: "🏠" },
    { label: "Hóa đơn", path: "/resident/bills", icon: "🧾" },
    { label: "Thanh toán", path: "/resident/payments", icon: "💳" },
    { label: "Yêu cầu", path: "/resident/service-requests", icon: "📝" },
    { label: "Dịch vụ", path: "/resident/service-registrations", icon: "🛎️" },
    { label: "Xe của tôi", path: "/resident/vehicles", icon: "🚗" },
    { label: "Thông báo", path: "/resident/notifications", icon: "🔔" },
];
