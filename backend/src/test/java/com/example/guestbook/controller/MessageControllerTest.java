package com.example.guestbook.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.guestbook.dto.UpdateMessageRequest;
import com.example.guestbook.exception.MessageNotFoundException;
import com.example.guestbook.service.MessageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(MessageController.class)
class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MessageService messageService;

    @Test
    void createWithBlankNameReturns400WithMessage() throws Exception {
        mockMvc.perform(post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"  \",\"text\":\"Hello\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Name is required"));
    }

    @Test
    void createWithTextOver200CharactersReturns400() throws Exception {
        String longText = "a".repeat(201);

        mockMvc.perform(post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Alice\",\"text\":\"" + longText + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Text must be at most 200 characters"));
    }

    @Test
    void updateWithBlankTextReturns400() throws Exception {
        mockMvc.perform(put("/api/messages/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"text\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Text is required"));
    }

    @Test
    void updateUnknownIdReturns404WithMessage() throws Exception {
        when(messageService.update(eq(99L), any(UpdateMessageRequest.class)))
                .thenThrow(new MessageNotFoundException(99L));

        mockMvc.perform(put("/api/messages/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"text\":\"Hi\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Message 99 not found"));
    }

    @Test
    void unsupportedMethodReturns405InsteadOf500() throws Exception {
        mockMvc.perform(patch("/api/messages/1"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void deleteUnknownIdReturns404() throws Exception {
        doThrow(new MessageNotFoundException(99L)).when(messageService).delete(99L);

        mockMvc.perform(delete("/api/messages/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Message 99 not found"));
    }
}
