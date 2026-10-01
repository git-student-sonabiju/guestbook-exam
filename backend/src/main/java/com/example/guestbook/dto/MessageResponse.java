package com.example.guestbook.dto;

import com.example.guestbook.entity.Message;
import java.time.Instant;

public record MessageResponse(Long id, String name, String text, Instant createdAt, Instant updatedAt) {

    public static MessageResponse from(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getName(),
                message.getText(),
                message.getCreatedAt(),
                message.getUpdatedAt());
    }
}
