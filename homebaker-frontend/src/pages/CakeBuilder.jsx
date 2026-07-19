import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import API, { createOrder } from '../services/api';

function CakeBuilder() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const navigate = useNavigate();

  const customerId = localStorage.getItem('userId');

  const [product, setProduct] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Configuration Choices
  const [selections, setSelections] = useState({
    shape: 'Round',
    size: '0.5kg',
    flavor: 'Vanilla',
    topping: 'None',
    message: '',
    deliveryDate: '',
    deliveryTimeSlot: '10AM-12PM',
    deliveryType: 'PICKUP',
    quantity: 1,
  });

  // Pricing Modifiers
  const prices = {
    shape: { Round: 0, Square: 5, Heart: 8, Custom: 12 },
    size: { '0.5kg': 0, '1kg': 10, '1.5kg': 18, '2kg': 25 },
    flavor: { Vanilla: 0, Chocolate: 0, Butterscotch: 3, 'Red Velvet': 5, Mango: 4 },
    topping: { None: 0, Sprinkles: 1, 'Fresh Fruits': 4, Nuts: 3, 'Chocolate Chips': 2 },
    deliveryType: { PICKUP: 0, DELIVERY: 5 }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const res = await API.get(`/api/products/${productId}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed to load product details", err);
      setError("Failed to load product details.");
    }
  };

  const handleSelect = (category, value) => {
    setSelections((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const calculateLivePrice = () => {
    if (!product) return 0;
    const basePrice = product.price || 0;
    const shapeAdd = prices.shape[selections.shape] || 0;
    const sizeAdd = prices.size[selections.size] || 0;
    const flavorAdd = prices.flavor[selections.flavor] || 0;
    const toppingAdd = prices.topping[selections.topping] || 0;
    const deliveryAdd = prices.deliveryType[selections.deliveryType] || 0;

    return (basePrice + shapeAdd + sizeAdd + flavorAdd + toppingAdd + deliveryAdd) * selections.quantity;
  };

  const handleNextStep = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // API 2 — EmailJS Email Notification to Baker
  const sendEmailToBaker = async (orderSelections) => {
    try {
      const SERVICE_ID = 'YOUR_SERVICE_ID';
      const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
      const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

      const templateParams = {
        baker_name: product?.baker?.name || 'Baker',
        customer_name: localStorage.getItem('name') || 'Customer',
        product_name: product?.name || 'Baked Item',
        cake_details: `Shape: ${orderSelections.shape}, Weight: ${orderSelections.size}, Flavor: ${orderSelections.flavor}, Topping: ${orderSelections.topping}, Message: "${orderSelections.message || 'None'}"`,
        delivery_date: orderSelections.deliveryDate,
        time_slot: orderSelections.deliveryTimeSlot,
        total_price: `₹${calculateLivePrice()}`,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      console.log('Baker notified by email via EmailJS!');
    } catch (err) {
      console.error('EmailJS Notification Error:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selections.deliveryDate) {
      setError("Please select a delivery date!");
      setCurrentStep(6);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const orderPayload = {
        customerId: parseInt(customerId),
        bakerId: product.baker.id,
        productId: product.id,
        cakeShape: selections.shape,
        cakeSize: selections.size,
        cakeFlavor: selections.flavor,
        cakeTopping: selections.topping,
        cakeMessage: selections.message,
        finalPrice: calculateLivePrice(),
        quantity: selections.quantity,
        deliveryTimeSlot: selections.deliveryTimeSlot,
        deliveryDate: selections.deliveryDate,
        deliveryType: selections.deliveryType,
      };

      const res = await createOrder(orderPayload);
      
      // Notify baker via EmailJS
      await sendEmailToBaker(selections);

      alert("Order placed! Baker notified by email");
      navigate(`/track-order?orderId=${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Try another delivery date.");
    } finally {
      setLoading(false);
    }
  };

  if (error && !product) {
    return <div className="main-content"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  if (!product) {
    return <div className="main-content"><p>Loading custom configurator...</p></div>;
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Interactive Cake Builder</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Customizing base bake: <strong>{product.name}</strong> by {product.baker.name}</p>
      </div>

      <div className="builder-layout">
        <div>
          {/* Step 1: Shape */}
          {currentStep === 1 && (
            <div className="builder-step-card">
              <span className="step-indicator">Step 1 of 8</span>
              <h3 className="builder-title">Select Shape</h3>
              <div className="option-grid">
                {Object.keys(prices.shape).map((s) => (
                  <div
                    key={s}
                    className={`option-card ${selections.shape === s ? 'active' : ''}`}
                    onClick={() => handleSelect('shape', s)}
                  >
                    <div>{s}</div>
                    <small style={{ fontWeight: 'normal' }}>{prices.shape[s] > 0 ? `+₹${prices.shape[s]}` : 'Included'}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Size */}
          {currentStep === 2 && (
            <div className="builder-step-card">
              <span className="step-indicator">Step 2 of 8</span>
              <h3 className="builder-title">Select Weight / Size</h3>
              <div className="option-grid">
                {Object.keys(prices.size).map((s) => (
                  <div
                    key={s}
                    className={`option-card ${selections.size === s ? 'active' : ''}`}
                    onClick={() => handleSelect('size', s)}
                  >
                    <div>{s}</div>
                    <small style={{ fontWeight: 'normal' }}>{prices.size[s] > 0 ? `+₹${prices.size[s]}` : 'Included'}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Flavor */}
          {currentStep === 3 && (
            <div className="builder-step-card">
              <span className="step-indicator">Step 3 of 8</span>
              <h3 className="builder-title">Select Flavor</h3>
              <div className="option-grid">
                {Object.keys(prices.flavor).map((f) => (
                  <div
                    key={f}
                    className={`option-card ${selections.flavor === f ? 'active' : ''}`}
                    onClick={() => handleSelect('flavor', f)}
                  >
                    <div>{f}</div>
                    <small style={{ fontWeight: 'normal' }}>{prices.flavor[f] > 0 ? `+₹${prices.flavor[f]}` : 'Included'}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Topping */}
          {currentStep === 4 && (
            <div className="builder-step-card">
              <span className="step-indicator">Step 4 of 8</span>
              <h3 className="builder-title">Select Toppings</h3>
              <div className="option-grid">
                {Object.keys(prices.topping).map((t) => (
                  <div
                    key={t}
                    className={`option-card ${selections.topping === t ? 'active' : ''}`}
                    onClick={() => handleSelect('topping', t)}
                  >
                    <div>{t}</div>
                    <small style={{ fontWeight: 'normal' }}>{prices.topping[t] > 0 ? `+₹${prices.topping[t]}` : 'Included'}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Message */}
          {currentStep === 5 && (
            <div className="builder-step-card">
              <span className="step-indicator">Step 5 of 8</span>
              <h3 className="builder-title">Add Message on Cake</h3>
              <div className="form-group">
                <label className="form-label">Write message precisely as it should appear:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Happy Birthday Sarah! 🎂"
                  value={selections.message}
                  onChange={(e) => handleSelect('message', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 6: Delivery Date */}
          {currentStep === 6 && (
            <div className="builder-step-card">
              <span className="step-indicator">Step 6 of 8</span>
              <h3 className="builder-title">Select Delivery Date</h3>
              <div className="form-group">
                <label className="form-label">We coordinate slot checks automatically:</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={selections.deliveryDate}
                  onChange={(e) => handleSelect('deliveryDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 7: Time Slot */}
          {currentStep === 7 && (
            <div className="builder-step-card">
              <span className="step-indicator">Step 7 of 8</span>
              <h3 className="builder-title">Select Delivery Time Slot</h3>
              <div className="form-group">
                <label className="form-label">Choose preferred timings:</label>
                <select
                  className="form-input"
                  value={selections.deliveryTimeSlot}
                  onChange={(e) => handleSelect('deliveryTimeSlot', e.target.value)}
                >
                  <option value="10AM-12PM">10:00 AM - 12:00 PM</option>
                  <option value="12PM-2PM">12:00 PM - 02:00 PM</option>
                  <option value="2PM-4PM">02:00 PM - 04:00 PM</option>
                  <option value="4PM-6PM">04:00 PM - 06:00 PM</option>
                  <option value="6PM-8PM">06:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 8: Delivery Type */}
          {currentStep === 8 && (
            <div className="builder-step-card">
              <span className="step-indicator">Step 8 of 8</span>
              <h3 className="builder-title">Choose Delivery Type</h3>
              <div className="option-grid">
                {Object.keys(prices.deliveryType).map((d) => (
                  <div
                    key={d}
                    className={`option-card ${selections.deliveryType === d ? 'active' : ''}`}
                    onClick={() => handleSelect('deliveryType', d)}
                  >
                    <div>{d}</div>
                    <small style={{ fontWeight: 'normal' }}>{prices.deliveryType[d] > 0 ? `+₹${prices.deliveryType[d]} Fee` : 'Free'}</small>
                  </div>
                ))}
              </div>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={selections.quantity}
                  onChange={(e) => handleSelect('quantity', Math.max(1, parseInt(e.target.value)))}
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button
              onClick={handlePrevStep}
              className="btn btn-outline"
              disabled={currentStep === 1}
            >
              Back
            </button>
            
            {currentStep < 8 ? (
              <button onClick={handleNextStep} className="btn btn-primary">
                Next Step
              </button>
            ) : (
              <button onClick={handlePlaceOrder} className="btn btn-primary" style={{ backgroundColor: '#059669' }} disabled={loading}>
                {loading ? 'Validating Slots...' : 'Place Custom Order 🚀'}
              </button>
            )}
          </div>
          {error && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
        </div>

        <div>
          {/* Live Preview Panel */}
          <div className="builder-preview-card">
            <h3 className="preview-title">Live Bill Preview</h3>
            
            <div className="preview-item">
              <span>Base Product:</span>
              <span>₹{product.price}</span>
            </div>
            
            <div className="preview-item">
              <span>Shape ({selections.shape}):</span>
              <span>+₹{prices.shape[selections.shape]}</span>
            </div>

            <div className="preview-item">
              <span>Weight ({selections.size}):</span>
              <span>+₹{prices.size[selections.size]}</span>
            </div>

            <div className="preview-item">
              <span>Flavor ({selections.flavor}):</span>
              <span>+₹{prices.flavor[selections.flavor]}</span>
            </div>

            <div className="preview-item">
              <span>Toppings ({selections.topping}):</span>
              <span>+₹{prices.topping[selections.topping]}</span>
            </div>

            <div className="preview-item">
              <span>Delivery ({selections.deliveryType}):</span>
              <span>+₹{prices.deliveryType[selections.deliveryType]}</span>
            </div>

            <div className="preview-item">
              <span>Quantity:</span>
              <span>x{selections.quantity}</span>
            </div>

            {selections.message && (
              <div className="preview-item" style={{ fontSize: '0.85rem', fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                <span>Message:</span>
                <span>"{selections.message}"</span>
              </div>
            )}

            {selections.deliveryDate && (
              <div className="preview-item" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                <span>Delivery Date:</span>
                <span>{selections.deliveryDate} ({selections.deliveryTimeSlot})</span>
              </div>
            )}

            <div className="price-display">
              <span>Estimated Cost:</span>
              <h3>₹{calculateLivePrice()}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CakeBuilder;
