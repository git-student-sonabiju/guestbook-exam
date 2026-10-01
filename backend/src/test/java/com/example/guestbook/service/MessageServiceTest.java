package com.example.guestbook.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.guestbook.dto.CreateMessageRequest;
import com.example.guestbook.dto.MessageResponse;
import com.example.guestbook.dto.UpdateMessageRequest;
import com.example.guestbook.entity.Message;
import com.example.guestbook.exception.MessageNotFoundException;
import com.example.guestbook.repository.MessageRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    private static final Instant NOW = Instant.parse("2026-10-01T10:00:00Z");

    @Mock
    private MessageRepository messageRepository;

    private MessageService messageService;

    @BeforeEach
    void setUp() {
        messageService = new MessageService(messageRepository, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void createSetsCreatedAtAndLeavesUpdatedAtEmpty() {
        when(messageRepository.save(any(Message.class))).thenAnswer(invocation -> {
            Message saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        MessageResponse response = messageService.create(new CreateMessageRequest("Alice", "Hello"));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Alice");
        assertThat(response.text()).isEqualTo("Hello");
        assertThat(response.createdAt()).isEqualTo(NOW);
        assertThat(response.updatedAt()).isNull();
    }

    @Test
    void updateChangesTextAndSetsUpdatedAt() {
        Message existing = message(1L, "Alice", "Hello", Instant.parse("2026-09-30T08:00:00Z"));
        when(messageRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(messageRepository.save(existing)).thenReturn(existing);

        MessageResponse response = messageService.update(1L, new UpdateMessageRequest("Hello again"));

        assertThat(response.text()).isEqualTo("Hello again");
        assertThat(response.name()).isEqualTo("Alice");
        assertThat(response.createdAt()).isEqualTo(Instant.parse("2026-09-30T08:00:00Z"));
        assertThat(response.updatedAt()).isEqualTo(NOW);
    }

    @Test
    void updateUnknownIdThrowsNotFound() {
        when(messageRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(
                MessageNotFoundException.class, () -> messageService.update(99L, new UpdateMessageRequest("Hi")));

        verify(messageRepository, never()).save(any(Message.class));
    }

    @Test
    void deleteUnknownIdThrowsNotFound() {
        when(messageRepository.existsById(99L)).thenReturn(false);

        assertThrows(MessageNotFoundException.class, () -> messageService.delete(99L));

        verify(messageRepository, never()).deleteById(99L);
    }

    @Test
    void deleteExistingIdRemovesMessage() {
        when(messageRepository.existsById(1L)).thenReturn(true);

        messageService.delete(1L);

        verify(messageRepository).deleteById(1L);
    }

    @Test
    void findAllReturnsMessagesInRepositoryOrder() {
        Message newer = message(2L, "Bob", "Second", Instant.parse("2026-10-01T09:00:00Z"));
        Message older = message(1L, "Alice", "First", Instant.parse("2026-10-01T08:00:00Z"));
        when(messageRepository.findAllByOrderByCreatedAtDescIdDesc()).thenReturn(List.of(newer, older));

        List<MessageResponse> responses = messageService.findAll();

        assertThat(responses).extracting(MessageResponse::id).containsExactly(2L, 1L);
    }

    private static Message message(Long id, String name, String text, Instant createdAt) {
        Message message = new Message();
        message.setId(id);
        message.setName(name);
        message.setText(text);
        message.setCreatedAt(createdAt);
        return message;
    }
}
