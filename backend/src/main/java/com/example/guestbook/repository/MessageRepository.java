package com.example.guestbook.repository;

import com.example.guestbook.entity.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findAllByOrderByCreatedAtDescIdDesc();
}
