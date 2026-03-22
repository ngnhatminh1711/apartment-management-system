package com.apartmentmanagement.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // --Auth--
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Chưa xác thực - Vui lòng đăng nhập trước"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không hợp lệ"),
    ACCOUNT_DISABLED(HttpStatus.FORBIDDEN, "Tài khoản của bạn đã bị vô hiệu hóa"),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "Token đã hết hạn"),
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "Token không hợp lệ"),
    WRONG_CURRENT_PASSWORD(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không đúng"),
    PASSWORD_DO_NOT_MATCH(HttpStatus.BAD_REQUEST, "Mật khẩu mới không khớp"),
    NEW_PASSWORD_SAME_AS_OLD(HttpStatus.BAD_REQUEST, "Mập khẩu mới không được trùng với mật khẩu cũ"),

    // --User--
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy user"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "Email đã tồn tại"),
    PHONE_ALREADY_EXISTS(HttpStatus.CONFLICT, "Số điện thoại đã tồn tại"),
    ID_CARD_ALREADY_EXISTS(HttpStatus.CONFLICT, "Số CMND/CCCD đã tồn tại"),
    CANNOT_DEACTIVATE_SELF(HttpStatus.BAD_REQUEST, "Bạn không thể tự vô hiệu hóa tài khoản của chính mình"),
    CANNOT_REMOVE_LAST_ROLE(HttpStatus.BAD_REQUEST, "Người dùng phải có ít nhất một vai trò"),
    ROLE_ALREADY_ASSIGNED(HttpStatus.CONFLICT, "Vai trò đã được gán cho người dùng"),
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy vai trò"),

    // --Building / Apartment
    BUIDING_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy tòa nhà"),
    BUILDING_NAME_EXISTED(HttpStatus.CONFLICT, "Tên tòa nhà đã tồn tại"),
    BUILDING_HAS_ACTIVE_RESIDENTS(HttpStatus.CONFLICT, "Tòa nhà vẫn còn cư dân đang sinh sống"),
    APARTMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy căn hộ"),
    APARTMENT_NUMBER_EXISTED(HttpStatus.CONFLICT, "Số căn hộ đã tồn tại trong tòa nhà này"),
    APARTMENT_HAS_RESIDENTS(HttpStatus.CONFLICT, "Căn hộ vẫn còn cư dân"),
    APARTMENT_NOT_OCCUPIED(HttpStatus.CONFLICT, "Căn hộ hiện chưa có người ở"),
    APARTMENT_NOT_AVAILABLE(HttpStatus.CONFLICT, "Căn hộ hiện không khả dụng"),
    USER_ALREADY_HAS_APARTMENT(HttpStatus.CONFLICT, "Người dùng đã có căn hộ đang sử dụng"),
    NO_ACTIVE_APARTMENT(HttpStatus.NOT_FOUND, "Bạn không có căn hộ đang sử dụng"),
    RESIDENT_NOT_IN_APARTMENT(HttpStatus.NOT_FOUND, "Cư dân không thuộc căn hộ này"),
    MOVE_OUT_DATE_BEFORE_MOVE_IN(HttpStatus.BAD_REQUEST, "Ngày chuyển đi không được trước ngày chuyển vào"),
    HAS_UNPAID_BILLS(HttpStatus.CONFLICT, "Cư dân vẫn còn hóa đơn chưa thanh toán"),
    MANAGER_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy quản lý"),

    // --Bill/Payment--
    BILL_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"),
    BILL_ALREADY_EXISTED(HttpStatus.CONFLICT, "Hóa đơn của tháng này đã tồn tại"),
    BILL_ALREADY_PAID(HttpStatus.CONFLICT, "Hóa đơn đã được thanh toán"),
    BILL_ALREADY_CANCELLED(HttpStatus.CONFLICT, "Hóa đơn đã bị hủy"),
    BILL_NOT_YOURS(HttpStatus.FORBIDDEN, "Hóa đơn này không thuộc căn hộ của bạn"),
    AMOUNT_EXCEEDS_REMAINING(HttpStatus.BAD_REQUEST, "Số tiền thanh toán vượt quá số dư còn lại"),
    FEE_CONFIG_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy cấu hình phí cho loại này"),
    FEE_CONFIG_IN_USE(HttpStatus.CONFLICT, "Cấu hình phí đang được sử dụng bởi các hóa đơn hiện có"),
    EFFECTIVE_DATE_IN_PAST(HttpStatus.BAD_REQUEST, "Ngày hiệu lực không được nằm trong quá khứ"),

    // --Vehicle--
    VEHICLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy phương tiện"),
    LICENSE_PLATE_EXISTED(HttpStatus.CONFLICT, "Biển số xe đã được đăng ký"),
    VEHICLE_NOT_PENDING(HttpStatus.CONFLICT, "Phương tiện không ở trạng thái chờ phê duyệt"),
    VEHICLE_NOT_ACTIVE(HttpStatus.CONFLICT, "Phương tiện hiện không hoạt động"),

    // --Service Request--
    SERVICE_TYPE_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy loại dịch vụ"),
    SERVICE_TYPE_INACTIVE(HttpStatus.BAD_REQUEST, "Loại dịch vụ hiện đang ngừng hoạt động"),
    SERVICE_ALREADY_REGISTERED(HttpStatus.CONFLICT, "Bạn dã đăng ký dịch vụ này rồi"),
    REGISTRATION_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy đăng ký dịch vụ"),
    REGISTRATION_NOT_ACTIVE(HttpStatus.CONFLICT, "Đăng ký hiện không còn hiệu lực"),

    // --General--
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "Dữ liệu không hợp lệ"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi hệ thống nội bộ");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}