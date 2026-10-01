package com.example.guestbook.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateMessageRequest(
        @NotBlank(message = "Name is required") @Size(max = 100, message = "Name must be at most 100 characters")
                String name,
        @NotBlank(message = "Text is required") @Size(max = 200, message = "Text must be at most 200 characters")
                String text) {}
