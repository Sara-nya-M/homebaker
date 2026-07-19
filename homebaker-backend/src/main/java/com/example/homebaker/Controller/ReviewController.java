package com.example.homebaker.Controller;

import com.example.homebaker.Modular.Review;
import com.example.homebaker.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {
        try {
            Review review = reviewService.createReview(
                    request.getCustomerId(),
                    request.getBakerId(),
                    request.getRating(),
                    request.getComment()
            );
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/baker/{id}")
    public ResponseEntity<List<Review>> getReviewsForBaker(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsForBaker(id));
    }

    // DTO class for reviews
    public static class ReviewRequest {
        private Long customerId;
        private Long bakerId;
        private Integer rating;
        private String comment;

        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }

        public Long getBakerId() { return bakerId; }
        public void setBakerId(Long bakerId) { this.bakerId = bakerId; }

        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}
