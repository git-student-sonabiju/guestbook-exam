package com.example.guestbook.service;

import com.example.guestbook.dto.CreateMessageRequest;
import com.example.guestbook.dto.MessageResponse;
import com.example.guestbook.dto.UpdateMessageRequest;
import com.example.guestbook.entity.Message;
import com.example.guestbook.exception.MessageNotFoundException;
import com.example.guestbook.repository.MessageRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final Clock clock;

    @Transactional(readOnly = true)
    public List<MessageResponse> findAll() {
        return messageRepository.findAllByOrderByCreatedAtDescIdDesc().stream()
                .map(MessageResponse::from)
                .toList();
    }

    @Transactional
    public MessageResponse create(CreateMessageRequest request) {
        Message message = new Message();
        message.setName(request.name());
        message.setText(request.text());
        message.setCreatedAt(Instant.now(clock));
        return MessageResponse.from(messageRepository.save(message));
    }

    @Transactional
    public MessageResponse update(Long id, UpdateMessageRequest request) {
        Message message = messageRepository.findById(id).orElseThrow(() -> new MessageNotFoundException(id));
        message.setText(request.text());
        message.setUpdatedAt(Instant.now(clock));
        return MessageResponse.from(messageRepository.save(message));
    }

    @Transactional
    public void delete(Long id) {
        if (!messageRepository.existsById(id)) {
            throw new MessageNotFoundException(id);
        }
        messageRepository.deleteById(id);
    }
}
