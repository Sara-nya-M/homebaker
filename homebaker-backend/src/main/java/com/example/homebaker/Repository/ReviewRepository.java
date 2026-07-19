package com.example.homebaker.Repository;

import com.example.homebaker.Modular.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBakerId(Long bakerId);
}
