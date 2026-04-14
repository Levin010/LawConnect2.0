package com.lawconnect.server.service.impl;

import com.lawconnect.server.service.PasswordResetEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class SmtpPasswordResetEmailService implements PasswordResetEmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    public SmtpPasswordResetEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordResetEmail(String email, String firstName, String lastName, String resetUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("LawConnect password reset");
            helper.setText(buildEmailBody(firstName, lastName, resetUrl), false);
            mailSender.send(message);
        } catch (MailAuthenticationException ex) {
            throw new IllegalStateException("Email authentication failed. Set MAIL_PASSWORD to your Gmail app password.", ex);
        } catch (MessagingException ex) {
            throw new IllegalStateException("Unable to compose password reset email.", ex);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to send password reset email.", ex);
        }
    }

    private String buildEmailBody(String firstName, String lastName, String resetUrl) {
        String fullName = (firstName + " " + lastName).trim();

        return "Hello " + fullName + ",\n\n"
                + "We received a request to reset your LawConnect password.\n\n"
                + "Use the link below to set a new password:\n"
                + resetUrl + "\n\n"
                + "If you did not request this, you can ignore this email.\n\n"
                + "Team LawConnect";
    }
}
