package com.example.homebaker.Service;

import com.example.homebaker.Modular.Chat;
import com.example.homebaker.Modular.User;
import com.example.homebaker.Repository.ChatRepository;
import com.example.homebaker.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    public Chat createMessage(Long senderId, Long receiverId, Long orderId, String message) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found!"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found!"));

        Chat chat = new Chat();
        chat.setSender(sender);
        chat.setReceiver(receiver);
        chat.setOrderId(orderId);
        chat.setMessage(message);

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        chat.setSentAt(LocalDateTime.now().format(dtf));

        return chatRepository.save(chat);
    }

    public List<Chat> getChatByOrderId(Long orderId) {
        return chatRepository.findByOrderId(orderId);
    }
}
