import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createReview } from '../services/api';

function ReviewPage() {
  const [searchParams] = useSearchParams();
  const bakerId = searchParams.get('bakerId');
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const customerId = localStorage.getItem('userId');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const reviewPayload = {
        customerId: parseInt(customerId),
        bakerId: parseInt(bakerId),
        rating: rating,
        comment: comment,
      };

      await createReview(reviewPayload);
      alert("Review submitted successfully! Thank you.");
      navigate('/customer-dashboard');
    } catch (err) {
      setError("Failed to submit review. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Rate Your Baker</h2>
      <p className="form-subtitle">Help others discover standard home cooks by sharing your experience</p>

      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ alignItems: 'center' }}>
          <label className="form-label">How was the quality of bakes?</label>
          <div className="star-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star-icon ${rating >= star ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {rating} Stars ({rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Disappointing' : 'Terrible'})
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Add Comments / Review</label>
          <textarea
            className="form-input"
            required
            rows="4"
            placeholder="Tell us about the texture, flavors, custom lettering, and delivery..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewPage;
