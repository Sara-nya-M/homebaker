package com.example.homebaker.Controller;

import com.example.homebaker.Modular.Chat;
import com.example.homebaker.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody ChatRequest request) {
        try {
            Chat chat = chatService.createMessage(
                    request.getSenderId(),
                    request.getReceiverId(),
                    request.getOrderId(),
                    request.getMessage()
            );
            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<List<Chat>> getChatByOrder(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getChatByOrderId(id));
    }

    // DTO class for chat
    public static class ChatRequest {
        private Long senderId;
        private Long receiverId;
        private Long orderId;
        private String message;

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }

        public Long getReceiverId() { return receiverId; }
        public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

        public Long getOrderId() { return orderId; }
        public void setOrderId(Long orderId) { this.orderId = orderId; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
