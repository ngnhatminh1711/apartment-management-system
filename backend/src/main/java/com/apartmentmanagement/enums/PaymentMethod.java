package com.apartmentmanagement.enums;

public enum PaymentMethod {
    CASH("Tiền mặt"),
    VNPAY("VNPay"),
    MOMO("MoMo"),
    BANK_TRANSFER("Chuyển khoản ngân hàng");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }
}
