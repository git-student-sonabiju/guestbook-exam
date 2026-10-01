package com.example.guestbook.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateMessageRequest(
        @NotBlank(message = "Text is required") @Size(max = 200, message = "Text must be at most 200 characters")
                String text) {}
