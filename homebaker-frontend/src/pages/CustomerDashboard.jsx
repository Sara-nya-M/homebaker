import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, getFilteredProducts, getCustomerOrders, getChatForOrder, sendMessage } from '../services/api';

function CustomerDashboard() {
  const customerId = localStorage.getItem('userId');
  const [userCity, setUserCity] = useState(localStorage.getItem('city') || '');
  const [activeTab, setActiveTab] = useState('browse');
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [locationLoading, setLocationLoading] = useState(false);
  
  // Chat States
  const [selectedOrderChat, setSelectedOrderChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getLocation();
    fetchOrders();
  }, [customerId]);

  // API 1 — OpenStreetMap (Nominatim) Auto-Location Detection
  const getLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              data.address?.state_district ||
              '';

            if (city) {
              setUserCity(city);
              localStorage.setItem('city', city);
              fetchProductsWithCityFilter(city);
            } else {
              fetchProducts();
            }
          } catch (error) {
            console.error('Error fetching location from Nominatim:', error);
            fetchProducts();
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.warn('Geolocation denied or failed:', error.message);
          fetchProducts();
          setLocationLoading(false);
        }
      );
    } else {
      fetchProducts();
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setAllProducts(res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const fetchProductsWithCityFilter = async (city) => {
    try {
      const res = await getAllProducts();
      setAllProducts(res.data);
      if (city) {
        const matched = res.data.filter(
          (p) => p.baker && p.baker.city && p.baker.city.toLowerCase().includes(city.toLowerCase())
        );
        setProducts(matched.length > 0 ? matched : res.data);
      } else {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getCustomerOrders(customerId);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handleFilterClick = async (filter) => {
    setActiveFilter(filter);
    try {
      let baseList = allProducts;
      if (baseList.length === 0) {
        const res = await getAllProducts();
        baseList = res.data;
        setAllProducts(baseList);
      }

      let filtered = baseList;
      if (filter === 'eggless') {
        filtered = baseList.filter((p) => p.isEggless);
      } else if (filter === 'glutenfree') {
        filtered = baseList.filter((p) => p.isGlutenFree);
      } else if (filter === 'vegan') {
        filtered = baseList.filter((p) => p.isVegan);
      }

      if (userCity) {
        const cityMatched = filtered.filter(
          (p) => p.baker && p.baker.city && p.baker.city.toLowerCase().includes(userCity.toLowerCase())
        );
        setProducts(cityMatched.length > 0 ? cityMatched : filtered);
      } else {
        setProducts(filtered);
      }
    } catch (err) {
      console.error("Error filtering products", err);
    }
  };

  const handleOrderRedirect = (productId) => {
    navigate(`/cake-builder?productId=${productId}`);
  };

  const handleTrackRedirect = (orderId) => {
    navigate(`/track-order?orderId=${orderId}`);
  };

  const handleRateRedirect = (bakerId, orderId) => {
    navigate(`/rate-baker?bakerId=${bakerId}&orderId=${orderId}`);
  };

  // Chat logics
  const handleOpenChat = async (order) => {
    setSelectedOrderChat(order);
    try {
      const res = await getChatForOrder(order.id);
      setChatMessages(res.data);
    } catch (err) {
      console.error("Error fetching chat", err);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const chatPayload = {
        senderId: customerId,
        receiverId: selectedOrderChat.baker.id,
        orderId: selectedOrderChat.id,
        message: chatInput,
      };
      const res = await sendMessage(chatPayload);
      setChatMessages((prev) => [...prev, res.data]);
      setChatInput('');
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-pending';
      case 'CONFIRMED': return 'badge-confirmed';
      case 'BAKING': return 'badge-baking';
      case 'READY': return 'badge-ready';
      case 'DELIVERED': return 'badge-delivered';
      default: return '';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Customer Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {locationLoading
              ? 'Detecting your location via OpenStreetMap...'
              : `Showing bakers near ${userCity || 'Your City'}`}
          </p>
        </div>
        <span className="nav-user">Active Buyer</span>
      </div>

      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Baked Goods
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
      </div>

      {activeTab === 'browse' && (
        <div>
          <div className="filter-container">
            <button className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => handleFilterClick('all')}>All Bakes</button>
            <button className={`filter-button ${activeFilter === 'eggless' ? 'active' : ''}`} onClick={() => handleFilterClick('eggless')}>Eggless 🥚</button>
            <button className={`filter-button ${activeFilter === 'glutenfree' ? 'active' : ''}`} onClick={() => handleFilterClick('glutenfree')}>Gluten-Free 🌾</button>
            <button className={`filter-button ${activeFilter === 'vegan' ? 'active' : ''}`} onClick={() => handleFilterClick('vegan')}>Vegan 🌱</button>
          </div>

          {products.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No bakes available matching filter.</p>
          ) : (
            <div className="grid-layout">
              {products.map((p) => (
                <div key={p.id} className="card">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} className="card-img" alt={p.name} />
                  ) : (
                    <div className="card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' }}>🎂 No Image</div>
                  )}
                  <div className="card-content">
                    <div className="tag-container">
                      <span className="tag">{p.category}</span>
                      {p.isEggless && <span className="tag">Eggless</span>}
                      {p.isGlutenFree && <span className="tag">Gluten-Free</span>}
                      {p.isVegan && <span className="tag">Vegan</span>}
                    </div>
                    <h4 className="card-title">{p.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Baker: {p.baker.name} ({p.baker.city})</p>
                    <p className="card-desc">{p.description}</p>
                    <div className="card-footer">
                      <span className="card-price">₹{p.price}</span>
                      <button onClick={() => handleOrderRedirect(p.id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        Customize & Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedOrderChat ? '2fr 1fr' : '1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Order History</h3>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No orders placed yet.</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Baker</th>
                    <th>Product</th>
                    <th>Delivery Date</th>
                    <th>Final Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>
                        <strong>{o.baker.name}</strong><br />
                        <small style={{ color: 'var(--text-secondary)' }}>{o.baker.city}</small>
                      </td>
                      <td>{o.product.name}</td>
                      <td>{o.deliveryDate}</td>
                      <td><strong>₹{o.finalPrice}</strong></td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-row">
                          <button onClick={() => handleTrackRedirect(o.id)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                            Track
                          </button>
                          <button onClick={() => handleOpenChat(o)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                            💬 Chat
                          </button>
                          {o.status === 'DELIVERED' && (
                            <button onClick={() => handleRateRedirect(o.baker.id, o.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                              Rate Baker
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selectedOrderChat && (
            <div>
              <div className="chat-container">
                <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Chat with Baker: {selectedOrderChat.baker.name}</span>
                  <button onClick={() => setSelectedOrderChat(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                </div>
                <div className="chat-messages">
                  {chatMessages.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '2rem' }}>No messages. Send a message to coordinate bakes!</p>
                  ) : (
                    chatMessages.map((m) => (
                      <div key={m.id} className={`chat-bubble ${m.sender.id == customerId ? 'sent' : 'received'}`}>
                        <p>{m.message}</p>
                        <div className="chat-timestamp">{m.sentAt}</div>
                      </div>
                    ))
                  )}
                </div>
                <form className="chat-input-area" onSubmit={handleSendChatMessage}>
                  <input
                    type="text"
                    placeholder="Ask standard questions..."
                    className="chat-input"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Send</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
