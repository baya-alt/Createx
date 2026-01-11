import React, { useState, useEffect } from 'react';
import './Orders.css';

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

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(savedOrders);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Функция для отслеживания заказа
  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    setShowTrackModal(true);
    console.log(`Tracking order #${order.id}`);
  };

  // Функция для повторного заказа
  const handleReorder = (order) => {
    setReorderingOrder(order);
    setShowReorderConfirm(true);
  };

  // Функция для отмены заказа
  const handleCancelOrder = (order, e) => {
    e.stopPropagation();
    setCancellingOrder(order);
    setShowCancelConfirm(true);
  };

  // Функция для добавления отзыва
  const handleAddReview = (order, e) => {
    e.stopPropagation();
    setReviewingOrder(order);
    setShowReviewModal(true);
  };

  // Подтверждение повторного заказа
  const confirmReorder = () => {
    if (reorderingOrder) {
      // Добавляем товары из заказа обратно в корзину
      reorderingOrder.items.forEach(item => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        
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
        localStorage.setItem('cart', JSON.stringify(existingCart));
      });
      
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Items from order #${reorderingOrder.id} have been added to your cart!`);
      setShowReorderConfirm(false);
      onClose();
    }
  };

  // Подтверждение отмены заказа
  const confirmCancelOrder = () => {
    if (cancellingOrder) {
      const updatedOrders = orders.map(order => {
        if (order.id === cancellingOrder.id) {
          return { ...order, status: 'Cancelled' };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      alert(`Order #${cancellingOrder.id} has been cancelled successfully!`);
      setShowCancelConfirm(false);
    }
  };

  // Отправка отзыва
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
      
      alert(`Thank you for your review! ${rating} stars ⭐`);
      setShowReviewModal(false);
    }
  };

  // Получить статус отслеживания
  const getTrackingStatus = (order) => {
    const statuses = [
      { status: 'Order Placed', date: new Date(order.date), completed: true },
      { status: 'Processing', date: new Date(Date.now() - 86400000), completed: true },
      { status: 'Shipped', date: new Date(Date.now() - 43200000), completed: true },
      { status: 'Out for Delivery', date: new Date(Date.now() + 21600000), completed: false },
      { status: 'Delivered', date: new Date(Date.now() + 43200000), completed: false }
    ];
    
    return statuses;
  };

  // Проверка можно ли отменить заказ
  const canCancelOrder = (order) => {
    const orderDate = new Date(order.date);
    const now = new Date();
    const hoursDifference = (now - orderDate) / (1000 * 60 * 60);
    
    // Можно отменить в течение 24 часов и если еще не отправлен
    return hoursDifference < 24 && 
           order.status !== 'Shipped' && 
           order.status !== 'Delivered' &&
           order.status !== 'Cancelled';
  };

  // Проверка можно ли добавить отзыв
  const canAddReview = (order) => {
    return order.status === 'Delivered' && !order.reviewed;
  };

  // Экспорт заказа в PDF
  const handleExportOrder = (order, e) => {
    e.stopPropagation();
    alert(`Exporting order #${order.id} as PDF...\nThis would generate a downloadable receipt.`);
  };

  // Копировать номер заказа
  const handleCopyOrderId = (orderId, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(orderId);
    alert(`Order ID ${orderId} copied to clipboard!`);
  };

  // Обратная связь по нажатию на заказ
  const handleOrderClick = (order) => {
    console.log(`Order #${order.id} clicked`);
  };

  return (
    <>
      <div className="orders-modal-overlay" onClick={onClose}>
        <div className="orders-modal-content" onClick={e => e.stopPropagation()}>
          <button className="orders-close-btn" onClick={onClose}>×</button>
          
          <h2 className="orders-modal-title">My Orders ({orders.length})</h2>
          
          {orders.length === 0 ? (
            <div className="no-orders">
              <div className="empty-orders-icon">📦</div>
              <h3>No orders yet</h3>
              <p>When you place an order, it will appear here.</p>
              <button onClick={onClose} className="continue-shopping-btn">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="orders-scroll-container">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="order-card"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="order-header">
                    <div>
                      <div className="order-id-container">
                        <h3>Order #{order.id}</h3>
                        <button 
                          className="copy-order-id-btn"
                          onClick={(e) => handleCopyOrderId(order.id, e)}
                          title="Copy Order ID"
                        >
                          📋
                        </button>
                      </div>
                      <p className="order-date">Placed on {formatDate(order.date)}</p>
                    </div>
                    <div className="order-header-actions">
                      <button 
                        className="export-order-btn"
                        onClick={(e) => handleExportOrder(order, e)}
                        title="Export as PDF"
                      >
                        📄
                      </button>
                      <div className="order-status">
                        <span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    <h4>Items ({order.items?.length || 0})</h4>
                    {order.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="item-image"
                          />
                          <div className="item-details">
                            <p className="item-name">{item.name}</p>
                            <p className="item-variant">
                              {item.color && <span>Color: {item.color}</span>}
                              {item.size && <span>Size: {item.size}</span>}
                            </p>
                            <p className="item-quantity">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${order.subtotal}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>${order.shipping || '9.99'}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>${order.tax || (order.subtotal * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <strong>${order.total}</strong>
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <button 
                      className="track-order" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackOrder(order);
                      }}
                      disabled={order.status === 'Cancelled'}
                    >
                      <span>🚚</span> Track Order
                    </button>
                    
                    <button 
                      className="reorder" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(order);
                      }}
                    >
                      <span>🔄</span> Reorder
                    </button>
                    
                    {canCancelOrder(order) && (
                      <button 
                        className="cancel-order" 
                        onClick={(e) => handleCancelOrder(order, e)}
                      >
                        <span>❌</span> Cancel Order
                      </button>
                    )}
                    
                    {canAddReview(order) && (
                      <button 
                        className="add-review" 
                        onClick={(e) => handleAddReview(order, e)}
                      >
                        <span>⭐</span> Add Review
                      </button>
                    )}
                    
                    {order.reviewed && order.review && (
                      <div className="order-review">
                        <strong>Your Review:</strong> 
                        <span className="review-stars">
                          {'⭐'.repeat(order.review.rating)}
                        </span>
                        <p className="review-comment">{order.review.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно отслеживания заказа */}
      {showTrackModal && trackingOrder && (
        <div className="tracking-modal-overlay">
          <div className="tracking-modal-content">
            <button 
              className="tracking-close-btn"
              onClick={() => setShowTrackModal(false)}
            >
              ×
            </button>
            <h2>Track Order #{trackingOrder.id}</h2>
            
            <div className="tracking-timeline">
              {getTrackingStatus(trackingOrder).map((step, index) => (
                <div key={index} className="tracking-step">
                  <div className={`step-icon ${step.completed ? 'completed' : ''}`}>
                    {step.completed ? '✓' : '○'}
                  </div>
                  <div className="step-info">
                    <h4>{step.status}</h4>
                    <p>{step.date.toLocaleDateString()}</p>
                  </div>
                  {index < getTrackingStatus(trackingOrder).length - 1 && (
                    <div className="step-connector"></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="tracking-actions">
              <button 
                className="close-tracking-btn"
                onClick={() => setShowTrackModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения повторного заказа */}
      {showReorderConfirm && reorderingOrder && (
        <div className="reorder-modal-overlay">
          <div className="reorder-modal-content">
            <h2>Reorder Items?</h2>
            <p>
              Add {reorderingOrder.items.length} item(s) from order #{reorderingOrder.id} 
              to your cart?
            </p>
            
            <div className="reorder-items-preview">
              {reorderingOrder.items.slice(0, 3).map((item, index) => (
                <div key={index} className="reorder-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <span>{item.name}</span>
                </div>
              ))}
              {reorderingOrder.items.length > 3 && (
                <div className="more-items">
                  +{reorderingOrder.items.length - 3} more
                </div>
              )}
            </div>
            
            <div className="reorder-actions">
              <button 
                className="cancel-reorder-btn"
                onClick={() => setShowReorderConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-reorder-btn"
                onClick={confirmReorder}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно отмены заказа */}
      {showCancelConfirm && cancellingOrder && (
        <div className="cancel-order-modal-overlay">
          <div className="cancel-order-modal-content">
            <h2>Cancel Order #{cancellingOrder.id}?</h2>
            <p className="warning-text">
              ⚠️ Are you sure you want to cancel this order? 
              This action cannot be undone.
            </p>
            
            <div className="cancel-details">
              <p><strong>Order Total:</strong> ${cancellingOrder.total}</p>
              <p><strong>Items:</strong> {cancellingOrder.items?.length || 0}</p>
              <p><strong>Placed On:</strong> {formatDate(cancellingOrder.date)}</p>
            </div>
            
            <div className="cancel-actions">
              <button 
                className="cancel-order-no-btn"
                onClick={() => setShowCancelConfirm(false)}
              >
                No, Keep Order
              </button>
              <button 
                className="cancel-order-yes-btn"
                onClick={confirmCancelOrder}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления отзыва */}
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

// Компонент модального окна для отзыва
function ReviewModal({ order, onSubmit, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, comment);
    } else {
      alert('Please select a rating');
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-content">
        <button className="review-close-btn" onClick={onClose}>×</button>
        
        <h2>Review Order #{order.id}</h2>
        
        <div className="order-review-preview">
          <p>Please share your experience with this order:</p>
          <div className="review-items">
            {order.items?.slice(0, 2).map((item, index) => (
              <div key={index} className="review-item">
                <img src={item.imageUrl} alt={item.name} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-section">
            <label>Your Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="rating-text">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </span>
          </div>
          
          <div className="comment-section">
            <label>Your Comment (Optional):</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with these products..."
              rows="4"
              maxLength="500"
            />
            <div className="char-count">{comment.length}/500</div>
          </div>
          
          <div className="review-actions">
            <button type="button" className="skip-review-btn" onClick={onClose}>
              Skip Review
            </button>
            <button type="submit" className="submit-review-btn">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Orders;