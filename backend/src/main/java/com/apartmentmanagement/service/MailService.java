package com.apartmentmanagement.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendWelcomeEmail(String toEmail, String fullName, String rawPassword) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("[Apartment Management] Thông tin tài khoản của bạn");
            msg.setText(String.format("""
                    Xin chào %s,

                    Tài khoản của bạn đã được tạo trên hệ thông Apartment Management.

                    Thông tin đăng nhập:
                        Email: %s
                        Mật khẩu: %s

                    Vui lòng đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.

                    Trân trọng,
                    Ban Quản Trị Hệ Thống
                    """, fullName, toEmail, rawPassword));
            mailSender.send(msg);
            log.info("Đã gửi email chào mừng đến {}", toEmail);
        } catch (Exception e) {
            log.error("Gửi email thất bại đến {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String fullName, String newPassword) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("[Apartment Management] Mật khẩu đã được reset");
            msg.setText(String.format("""
                    Xin chào %s,

                    Mật khẩu tài khoản của bạn đã được reset bởi quản trị viên.

                    Mật khẩu mới: %s

                    Vui lòng đăng nhập và đổi mật khẩu ngay.

                    Trân trọng,
                    Ban Quản Trị Hệ Thống
                    """, fullName, newPassword));
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Gửi email reset password thất bại đến {}: {}", toEmail, e.getMessage());
        }
    }
}
