import React, { useState, useEffect } from 'react';
import { getProductsByBaker, createProduct, deleteProduct, getBakerOrders, updateOrderStatus, getChatForOrder, sendMessage } from '../services/api';

function BakerDashboard() {
  const bakerId = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'CAKE',
    price: '',
    description: '',
    imageUrl: '',
    isEggless: false,
    isGlutenFree: false,
    isVegan: false,
    isNutFree: false,
    occasion: '',
    dailySlots: 5,
  });

  // Chat State
  const [selectedOrderChat, setSelectedOrderChat] = useState(null); // stores order details for chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [bakerId]);

  const fetchProducts = async () => {
    try {
      const res = await getProductsByBaker(bakerId);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getBakerOrders(bakerId);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createProduct(newProduct, bakerId);
      fetchProducts();
      // Reset form
      setNewProduct({
        name: '',
        category: 'CAKE',
        price: '',
        description: '',
        imageUrl: '',
        isEggless: false,
        isGlutenFree: false,
        isVegan: false,
        isNutFree: false,
        occasion: '',
        dailySlots: 5,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // Chat logic
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
        senderId: bakerId,
        receiverId: selectedOrderChat.customer.id,
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
        <h2>Baker Dashboard</h2>
        <span className="nav-user">Shop Owner</span>
      </div>

      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '3rem' }}>
          <div>
            <form className="form-container" onSubmit={handleCreateProduct} style={{ margin: 0, padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Add Baked Product</h3>
              
              {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="form-input"
                  value={newProduct.name}
                  onChange={handleProductInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-input"
                  value={newProduct.category}
                  onChange={handleProductInputChange}
                >
                  <option value="CAKE">Cake</option>
                  <option value="COOKIE">Cookie</option>
                  <option value="BROWNIE">Brownie</option>
                  <option value="SNACK">Snack</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  required
                  className="form-input"
                  value={newProduct.price}
                  onChange={handleProductInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  className="form-input"
                  placeholder="https://example.com/cake.jpg"
                  value={newProduct.imageUrl}
                  onChange={handleProductInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-input"
                  value={newProduct.description}
                  onChange={handleProductInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Diet Tags</label>
                <div className="form-checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isEggless"
                      checked={newProduct.isEggless}
                      onChange={handleProductInputChange}
                    />
                    Eggless
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isGlutenFree"
                      checked={newProduct.isGlutenFree}
                      onChange={handleProductInputChange}
                    />
                    Gluten-Free
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isVegan"
                      checked={newProduct.isVegan}
                      onChange={handleProductInputChange}
                    />
                    Vegan
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isNutFree"
                      checked={newProduct.isNutFree}
                      onChange={handleProductInputChange}
                    />
                    Nut-Free
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Occasion</label>
                <input
                  type="text"
                  name="occasion"
                  className="form-input"
                  placeholder="Birthday, Anniversary..."
                  value={newProduct.occasion}
                  onChange={handleProductInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Daily Capacity Slots</label>
                <input
                  type="number"
                  name="dailySlots"
                  className="form-input"
                  value={newProduct.dailySlots}
                  onChange={handleProductInputChange}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>

          <div>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Your Baked Products</h3>
            {products.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No products listed yet.</p>
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
                      <p className="card-desc">{p.description}</p>
                      <div className="card-footer">
                        <span className="card-price">${p.price}</span>
                        <button onClick={() => handleDeleteProduct(p.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Manage Orders</h3>
          {orders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No orders placed yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: selectedOrderChat ? '2fr 1fr' : '1fr', gap: '2rem' }}>
              <div>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Delivery Info</th>
                      <th>Details</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>
                          <strong>{o.customer.name}</strong><br />
                          <small style={{ color: 'var(--text-secondary)' }}>{o.customer.phone}</small>
                        </td>
                        <td>{o.product.name}</td>
                        <td>
                          <small>
                            Date: {o.deliveryDate}<br />
                            Slot: {o.deliveryTimeSlot}<br />
                            Type: {o.deliveryType}
                          </small>
                        </td>
                        <td>
                          <small style={{ color: 'var(--text-secondary)' }}>
                            Shape: {o.cakeShape || 'N/A'}<br />
                            Size: {o.cakeSize || 'N/A'}<br />
                            Flavor: {o.cakeFlavor || 'N/A'}<br />
                            Message: {o.cakeMessage || 'N/A'}
                          </small>
                        </td>
                        <td><strong>${o.finalPrice}</strong></td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <div className="actions-row" style={{ flexDirection: 'column', gap: '0.3rem' }}>
                            {o.status === 'PENDING' && (
                              <button onClick={() => handleStatusChange(o.id, 'CONFIRMED')} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                                Confirm
                              </button>
                            )}
                            {o.status === 'CONFIRMED' && (
                              <button onClick={() => handleStatusChange(o.id, 'BAKING')} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#db2777' }}>
                                Bake
                              </button>
                            )}
                            {o.status === 'BAKING' && (
                              <button onClick={() => handleStatusChange(o.id, 'READY')} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#059669' }}>
                                Ready
                              </button>
                            )}
                            {o.status === 'READY' && (
                              <button onClick={() => handleStatusChange(o.id, 'DELIVERED')} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#4b5563' }}>
                                Deliver
                              </button>
                            )}
                            <button onClick={() => handleOpenChat(o)} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                              💬 Chat
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedOrderChat && (
                <div>
                  <div className="chat-container">
                    <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Chat for Order #{selectedOrderChat.id}</span>
                      <button onClick={() => setSelectedOrderChat(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                    </div>
                    <div className="chat-messages">
                      {chatMessages.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '2rem' }}>No messages. Send a message to coordinate bakes!</p>
                      ) : (
                        chatMessages.map((m) => (
                          <div key={m.id} className={`chat-bubble ${m.sender.id == bakerId ? 'sent' : 'received'}`}>
                            <p>{m.message}</p>
                            <div className="chat-timestamp">{m.sentAt}</div>
                          </div>
                        ))
                      )}
                    </div>
                    <form className="chat-input-area" onSubmit={handleSendChatMessage}>
                      <input
                        type="text"
                        placeholder="Type standard update..."
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
      )}
    </div>
  );
}

export default BakerDashboard;
