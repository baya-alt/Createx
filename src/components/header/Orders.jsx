import React, { useState, useEffect } from 'react';
import './Orders.css';
import { Link } from "react-router-dom";

function Orders({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [showReorderConfirm, setShowReorderConfirm] = useState(false);
  const [reorderingOrder, setReorderingOrder] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState(null);

  // Загрузка заказов при монтировании
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(savedOrders);
  }, []);

  // Форматирование даты
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Исправление ошибки "Objects are not valid as a React child"
   * Если в поле вместо числа пришел объект {method, cost}, берем только стоимость.
   */
  const renderPrice = (priceData, fallback = '0.00') => {
    if (priceData === null || priceData === undefined) return fallback;
    if (typeof priceData === 'object') {
      return priceData.cost || priceData.amount || fallback;
    }
    return priceData;
  };

  // Удаление заказа из истории
  const handleDeleteOrder = (orderId, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this order from your history?")) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    setShowTrackModal(true);
  };

  const handleReorder = (order) => {
    setReorderingOrder(order);
    setShowReorderConfirm(true);
  };

  const handleCancelOrder = (order, e) => {
    e.stopPropagation();
    setCancellingOrder(order);
    setShowCancelConfirm(true);
  };

  const handleAddReview = (order, e) => {
    e.stopPropagation();
    setReviewingOrder(order);
    setShowReviewModal(true);
  };

  const confirmReorder = () => {
    if (reorderingOrder) {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      reorderingOrder.items.forEach(item => {
        const cartItem = {
          id: Date.now() + Math.random(),
          productId: item.productId || item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          timestamp: Date.now()
        };
        existingCart.push(cartItem);
      });
      localStorage.setItem('cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Items from order #${reorderingOrder.id} added to cart!`);
      setShowReorderConfirm(false);
      onClose();
    }
  };

  const confirmCancelOrder = () => {
    if (cancellingOrder) {
      const updatedOrders = orders.map(order => 
        order.id === cancellingOrder.id ? { ...order, status: 'Cancelled' } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setShowCancelConfirm(false);
    }
  };

  const handleSubmitReview = (rating, comment) => {
    if (reviewingOrder) {
      const updatedOrders = orders.map(order => {
        if (order.id === reviewingOrder.id) {
          return { 
            ...order, 
            reviewed: true,
            review: { rating, comment, date: new Date().toISOString() }
          };
        }
        return order;
      });
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setShowReviewModal(false);
    }
  };

  const getTrackingStatus = (order) => [
    { status: 'Order Placed', date: new Date(order.date), completed: true },
    { status: 'Processing', date: new Date(Date.now() - 86400000), completed: true },
    { status: 'Shipped', date: new Date(Date.now() - 43200000), completed: true },
    { status: 'Out for Delivery', date: new Date(Date.now() + 21600000), completed: false },
    { status: 'Delivered', date: new Date(Date.now() + 43200000), completed: false }
  ];

  const canCancelOrder = (order) => {
    const hoursDifference = (new Date() - new Date(order.date)) / (1000 * 60 * 60);
    return hoursDifference < 24 && !['Shipped', 'Delivered', 'Cancelled'].includes(order.status);
  };

  const canAddReview = (order) => order.status === 'Delivered' && !order.reviewed;

  return (
    <>
      <div className="orders-modal-overlay" onClick={onClose}>
        <div className="orders-modal-content" onClick={e => e.stopPropagation()}>
          <Link to="/" className="orders-close-btn" onClick={onClose} style={{ textDecoration: 'none' }}>×</Link>
          
          <h2 className="orders-modal-title">My Orders ({orders.length})</h2>
          
          {orders.length === 0 ? (
            <div className="no-orders">
              <div className="empty-orders-icon">📦</div>
              <h3>No orders yet</h3>
              <button onClick={onClose} className="continue-shopping-btn">Continue Shopping</button>
            </div>
          ) : (
            <div className="orders-scroll-container">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3>Order #{order.id}</h3>
                        <button 
                          className="delete-order-btn" 
                          onClick={(e) => handleDeleteOrder(order.id, e)}
                          title="Delete history"
                        >🗑️</button>
                      </div>
                      <p className="order-date">Placed on {formatDate(order.date)}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <img src={item.imageUrl} alt={item.name} className="item-image" />
                          <div className="item-details">
                            <p className="item-name">{item.name}</p>
                            <p className="item-quantity">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="item-price">
                          ${(renderPrice(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${renderPrice(order.subtotal)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>${renderPrice(order.shipping, '9.99')}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <strong>${renderPrice(order.total)}</strong>
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <button className="track-order" onClick={() => handleTrackOrder(order)} disabled={order.status === 'Cancelled'}>
                      🚚 Track
                    </button>
                    <button className="reorder" onClick={() => handleReorder(order)}>
                      🔄 Reorder
                    </button>
                    {canCancelOrder(order) && (
                      <button className="cancel-order" onClick={(e) => handleCancelOrder(order, e)}>
                        ❌ Cancel
                      </button>
                    )}
                    {canAddReview(order) && (
                      <button className="add-review" onClick={(e) => handleAddReview(order, e)}>
                        ⭐ Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Модалки */}
      {showTrackModal && trackingOrder && (
        <div className="tracking-modal-overlay">
          <div className="tracking-modal-content">
             <button className="tracking-close-btn" onClick={() => setShowTrackModal(false)}>×</button>
             <h2>Tracking #{trackingOrder.id}</h2>
             <div className="tracking-timeline">
                {getTrackingStatus(trackingOrder).map((step, i) => (
                  <div key={i} className={`tracking-step ${step.completed ? 'completed' : ''}`}>
                    <div className="step-icon">{step.completed ? '✓' : '○'}</div>
                    <div className="step-info"><h4>{step.status}</h4></div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {showReorderConfirm && (
        <div className="reorder-modal-overlay">
          <div className="reorder-modal-content">
            <h2>Reorder Items?</h2>
            <div className="reorder-actions">
              <button onClick={() => setShowReorderConfirm(false)}>Cancel</button>
              <button className="confirm-reorder-btn" onClick={confirmReorder}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div className="cancel-order-modal-overlay">
          <div className="cancel-order-modal-content">
            <h2>Cancel Order?</h2>
            <p>This action cannot be undone.</p>
            <div className="cancel-actions">
              <button onClick={() => setShowCancelConfirm(false)}>No, Keep it</button>
              <button className="cancel-order-yes-btn" onClick={confirmCancelOrder}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && reviewingOrder && (
        <ReviewModal 
          order={reviewingOrder} 
          onSubmit={handleSubmitReview} 
          onClose={() => setShowReviewModal(false)} 
        />
      )}
    </>
  );
}

function ReviewModal({ order, onSubmit, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-content">
        <button className="review-close-btn" onClick={onClose}>×</button>
        <h2>Review Order #{order.id}</h2>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >★</button>
          ))}
        </div>
        <textarea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder="Share your experience..." 
        />
        <div className="review-actions">
          <button onClick={() => onSubmit(rating, comment)} className="submit-review-btn">Submit Review</button>
        </div>
      </div>
    </div>
  );
}

export default Orders;