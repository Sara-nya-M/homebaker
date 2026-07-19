import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';

function OrderTracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const stages = ['PENDING', 'CONFIRMED', 'BAKING', 'READY', 'DELIVERED'];

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await API.get(`/api/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order status.");
    }
  };

  if (error) {
    return <div className="main-content"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  if (!order) {
    return <div className="main-content"><p>Loading tracking info...</p></div>;
  }

  const currentStageIndex = stages.indexOf(order.status);

  return (
    <div className="main-content">
      <div className="tracking-wrapper">
        <h2 className="tracker-title">Track Order #{order.id}</h2>

        {/* Visual Progress Nodes */}
        <div className="steps-container">
          <div
            className="progress-line"
            style={{ width: `${(currentStageIndex / (stages.length - 1)) * 80}%` }}
          ></div>
          
          {stages.map((stage, idx) => {
            let stateClass = '';
            if (idx === currentStageIndex) {
              stateClass = 'active';
            } else if (idx < currentStageIndex) {
              stateClass = 'completed';
            }

            return (
              <div key={stage} className={`step-node ${stateClass}`}>
                <div className="step-circle">
                  {idx < currentStageIndex ? '✓' : idx + 1}
                </div>
                <div className="step-label">{stage}</div>
              </div>
            );
          })}
        </div>

        {/* Status Explanation */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <h3>Current Stage: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{order.status}</span></h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {order.status === 'PENDING' && 'Waiting for baker to accept the order...'}
            {order.status === 'CONFIRMED' && 'Order accepted! Preparing baking ingredients...'}
            {order.status === 'BAKING' && 'Your delicious order is in the oven right now!'}
            {order.status === 'READY' && 'Bake completed! Ready for delivery/pickup.'}
            {order.status === 'DELIVERED' && 'Order delivered! We hope you love the taste.'}
          </p>
        </div>

        {/* Order Details */}
        <div className="info-box">
          <h4 className="info-title">Order Information</h4>
          <div className="info-row">
            <span>Baker Name:</span>
            <span>{order.baker.name}</span>
          </div>
          <div className="info-row">
            <span>Product Item:</span>
            <span>{order.product.name}</span>
          </div>
          <div className="info-row">
            <span>Customizations:</span>
            <span>{order.cakeShape} ({order.cakeSize}, {order.cakeFlavor})</span>
          </div>
          {order.cakeMessage && (
            <div className="info-row">
              <span>Text on cake:</span>
              <span>"{order.cakeMessage}"</span>
            </div>
          )}
          <div className="info-row">
            <span>Delivery Type:</span>
            <span>{order.deliveryType}</span>
          </div>
          <div className="info-row">
            <span>Scheduled for:</span>
            <span>{order.deliveryDate} ({order.deliveryTimeSlot})</span>
          </div>
          <div className="info-row" style={{ borderTop: '1px solid #eee', paddingTop: '0.8rem', marginTop: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            <span>Final Paid Price:</span>
            <span>₹{order.finalPrice}</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/customer-dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
