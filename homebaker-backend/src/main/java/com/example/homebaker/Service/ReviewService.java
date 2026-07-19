package com.example.homebaker.Service;

import com.example.homebaker.Modular.Review;
import com.example.homebaker.Modular.User;
import com.example.homebaker.Repository.ReviewRepository;
import com.example.homebaker.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public Review createReview(Long customerId, Long bakerId, Integer rating, String comment) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found!"));
        User baker = userRepository.findById(bakerId)
                .orElseThrow(() -> new RuntimeException("Baker not found!"));

        Review review = new Review();
        review.setCustomer(customer);
        review.setBaker(baker);
        review.setRating(rating);
        review.setComment(comment);

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        review.setCreatedAt(LocalDateTime.now().format(dtf));

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsForBaker(Long bakerId) {
        return reviewRepository.findByBakerId(bakerId);
    }
}
