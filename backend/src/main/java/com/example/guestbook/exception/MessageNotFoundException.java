package com.example.guestbook.exception;

public class MessageNotFoundException extends RuntimeException {

    public MessageNotFoundException(Long id) {
        super("Message " + id + " not found");
    }
}
