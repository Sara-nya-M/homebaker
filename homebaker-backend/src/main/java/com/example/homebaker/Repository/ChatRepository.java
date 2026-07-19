package com.example.homebaker.Repository;

import com.example.homebaker.Modular.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByOrderId(Long orderId);
}
