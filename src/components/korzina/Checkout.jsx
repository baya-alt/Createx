import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United States',
    zipCode: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });

  // ✅ ВАШИ РЕАЛЬНЫЕ ДАННЫЕ EMAILJS
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_3xr5mic',
    TEMPLATE_ID: 'template_c9iwede',
    PUBLIC_KEY: 'wsSENBngvAWsgS0zB'
  };

  // Инициализация EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  // Загружаем товары из корзины
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const cartData = savedCart ? JSON.parse(savedCart) : [];
      setCartItems(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }

    try {
      const userData = localStorage.getItem('currentUser') || localStorage.getItem('user');
      let currentUser = null;
      
      if (userData) {
        if (typeof userData === 'object') {
          currentUser = userData;
        } else if (typeof userData === 'string') {
          try {
            currentUser = JSON.parse(userData);
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            currentUser = null;
          }
        }
      }
      
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          firstName: currentUser.name?.split(' ')[0] || '',
          lastName: currentUser.name?.split(' ').slice(1).join(' ') || '',
          email: currentUser.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Рассчитываем суммы
  const calculateSubtotal = () => {
    try {
      return cartItems.reduce((total, item) => {
        const price = item.hasDiscount && item.discount 
          ? item.price * (1 - item.discount / 100)
          : item.price;
        return total + (price * item.quantity);
      }, 0).toFixed(2);
    } catch (error) {
      console.error('Error calculating subtotal:', error);
      return '0.00';
    }
  };

  const calculateShipping = () => '9.99';
  
  const calculateTax = () => {
    try {
      return (parseFloat(calculateSubtotal()) * 0.08).toFixed(2);
    } catch (error) {
      console.error('Error calculating tax:', error);
      return '0.00';
    }
  };
  
  const calculateTotal = () => {
    try {
      const subtotal = parseFloat(calculateSubtotal());
      const shipping = parseFloat(calculateShipping());
      const tax = parseFloat(calculateTax());
      return (subtotal + shipping + tax).toFixed(2);
    } catch (error) {
      console.error('Error calculating total:', error);
      return '0.00';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';

    return newErrors;
  };

  // Показать модальное окно
  const showModalMessage = (title, message, type = 'info') => {
    setModalContent({ title, message, type });
    setShowModal(true);
  };

  // Закрыть модальное окно
  const closeModal = () => {
    setShowModal(false);
    setModalContent({ title: '', message: '', type: 'info' });
  };

  // Функция отправки email через EmailJS
  const sendOrderEmail = async (orderData) => {
    try {
      // Форматируем дату
      const orderDate = new Date(orderData.date);
      const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Базовые параметры для шаблона EmailJS
      const templateParams = {
        to_email: 'stargoe8@gmail.com',
        from_name: 'Online Store',
        reply_to: orderData.customer.email,
        
        order_id: orderData.id,
        order_date: formattedDate,
        
        customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone,
        
        shipping_address: orderData.customer.address,
        city: orderData.customer.city,
        country: orderData.customer.country,
        zip_code: orderData.customer.zipCode,
        
        items_count: orderData.items.length,
        
        subtotal: orderData.subtotal,
        shipping_cost: orderData.shippingCost,
        tax_amount: orderData.tax,
        order_total: orderData.total,
        
        payment_method: orderData.payment.method,
        shipping_method: orderData.shipping.method,
        order_status: orderData.status
      };

      // Добавляем информацию о каждом товаре отдельно
      orderData.items.forEach((item, index) => {
        const itemIndex = index + 1;
        const itemPrice = item.hasDiscount && item.discount 
          ? item.price * (1 - item.discount / 100)
          : item.price;
        const itemTotal = itemPrice * item.quantity;
        
        const itemName = item.name || 'Product ' + itemIndex;
        const itemColor = item.color || 'Standard';
        const itemSize = item.size || 'One Size';
        const itemQuantity = item.quantity || 1;
        
        templateParams[`item${itemIndex}_name`] = itemName;
        templateParams[`item${itemIndex}_color`] = itemColor;
        templateParams[`item${itemIndex}_size`] = itemSize;
        templateParams[`item${itemIndex}_quantity`] = itemQuantity;
        templateParams[`item${itemIndex}_unit_price`] = itemPrice.toFixed(2);
        templateParams[`item${itemIndex}_total_price`] = itemTotal.toFixed(2);
      });

      // Заполняем пустые поля для несуществующих товаров
      for (let i = orderData.items.length + 1; i <= 5; i++) {
        templateParams[`item${i}_name`] = '';
        templateParams[`item${i}_color`] = '';
        templateParams[`item${i}_size`] = '';
        templateParams[`item${i}_quantity`] = '';
        templateParams[`item${i}_unit_price`] = '';
        templateParams[`item${i}_total_price`] = '';
      }

      // Отправляем email
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      // Сохраняем информацию о отправке
      localStorage.setItem('last_email_sent', JSON.stringify({
        orderId: orderData.id,
        customer: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        items: orderData.items.map(item => ({
          name: item.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        total: orderData.total,
        timestamp: new Date().toISOString(),
        email: 'stargoe8@gmail.com',
        status: 'sent'
      }));
      
      return true;
    } catch (error) {
      console.error('Ошибка отправки email:', error);
      
      localStorage.setItem('last_email_error', JSON.stringify({
        orderId: orderData?.id,
        error: error.text || error.message || String(error),
        timestamp: new Date().toISOString()
      }));
      
      return false;
    }
  };

  // Функция для тестирования EmailJS
  const testEmailJS = async () => {
    try {
      const testTemplateParams = {
        to_email: 'stargoe8@gmail.com',
        from_name: 'Test Store',
        reply_to: 'test@test.com',
        
        order_id: 'TEST123',
        order_date: new Date().toLocaleDateString(),
        
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '+1 (555) 123-4567',
        
        shipping_address: '123 Test St',
        city: 'New York',
        country: 'USA',
        zip_code: '10001',
        
        items_count: 2,
        
        item1_name: 'Test T-Shirt',
        item1_color: 'Blue',
        item1_size: 'M',
        item1_quantity: 2,
        item1_unit_price: '19.99',
        item1_total_price: '39.98',
        
        item2_name: 'Test Jeans',
        item2_color: 'Black',
        item2_size: '32',
        item2_quantity: 1,
        item2_unit_price: '49.99',
        item2_total_price: '49.99',
        
        subtotal: '89.97',
        shipping_cost: '9.99',
        tax_amount: '7.20',
        order_total: '107.16',
        
        payment_method: 'Credit Card',
        shipping_method: 'Express',
        order_status: 'Processing'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        testTemplateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
      showModalMessage(
        '✅ Test Successful',
        'Test email has been sent to stargoe8@gmail.com. Please check your inbox.',
        'success'
      );
      
    } catch (error) {
      showModalMessage(
        '❌ Test Failed',
        `Error sending test email:\n${error.text || error.message}`,
        'error'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (cartItems.length === 0) {
      showModalMessage('Empty Cart', 'Your cart is empty! Please add items before checking out.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrderId = 'ORD' + Date.now().toString().slice(-8);
      setOrderId(newOrderId);

      const order = {
        id: newOrderId,
        date: new Date().toISOString(),
        items: cartItems.map(item => {
          const itemName = item.name || 'Product ' + (cartItems.indexOf(item) + 1);
          const itemColor = item.color || 'Standard';
          const itemSize = item.size || 'One Size';
          const itemQuantity = item.quantity || 1;
          const itemPrice = item.price || 0;
          const hasDiscount = item.hasDiscount || false;
          const discount = item.discount || 0;
          
          return {
            ...item,
            name: itemName,
            color: itemColor,
            size: itemSize,
            quantity: itemQuantity,
            price: itemPrice,
            hasDiscount: hasDiscount,
            discount: discount
          };
        }),
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          country: formData.country,
          zipCode: formData.zipCode.trim()
        },
        shipping: {
          method: 'Standard',
          cost: calculateShipping()
        },
        payment: {
          method: 'Card',
          status: 'Paid'
        },
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shippingCost: calculateShipping(),
        total: calculateTotal(),
        status: 'Processing'
      };

      const emailSent = await sendOrderEmail(order);
      
      if (!emailSent) {
        showModalMessage(
          '⚠️ Email Not Sent',
          'Order placed successfully, but there was an issue sending the confirmation email. Your order has been saved.',
          'warning'
        );
      }

      try {
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([order, ...existingOrders]));
      } catch (error) {
        console.error('Error saving order to localStorage:', error);
        localStorage.setItem('orders', JSON.stringify([order]));
      }

      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));

      setOrderSuccess(true);

    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      showModalMessage(
        'Order Processing Error',
        'There was an error processing your order. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  // Проверка отправки email
  const checkEmailStatus = () => {
    try {
      const lastEmail = localStorage.getItem('last_email_sent');
      const lastError = localStorage.getItem('last_email_error');
      
      let message = '';
      
      if (lastEmail) {
        const emailData = JSON.parse(lastEmail);
        message = `✅ Last order sent successfully\n\n`;
        message += `Order ID: ${emailData.orderId}\n`;
        message += `Customer: ${emailData.customer}\n`;
        message += `Total: $${emailData.total}\n`;
        message += `Sent: ${new Date(emailData.timestamp).toLocaleString()}\n\n`;
        message += `Items:\n`;
        emailData.items.forEach((item, index) => {
          message += `${index + 1}. ${item.name} - ${item.color} - Size: ${item.size} - Qty: ${item.quantity}\n`;
        });
        
        showModalMessage('📧 Email Status', message, 'success');
      } else {
        showModalMessage('📧 Email Status', 'No email sending data found.', 'info');
      }
      
      if (lastError) {
        const errorData = JSON.parse(lastError);
        showModalMessage('❌ Last Email Error', errorData.error, 'error');
      }
    } catch (error) {
      showModalMessage('Error', 'Error checking email status', 'error');
    }
  };

  return (
    <div className="checkout-container">
      {/* Модальное окно */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className={`modal-header ${modalContent.type}`}>
              <h3>{modalContent.title}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <pre>{modalContent.message}</pre>
            </div>
            <div className="modal-footer">
              <button className="modal-ok-btn" onClick={closeModal}>OK</button>
            </div>
          </div>
        </div>
      )}

      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className="step active">
            <span className="step-number">1</span>
            <span className="step-label">Cart</span>
          </div>
          <div className="step-divider"></div>
          <div className="step active">
            <span className="step-number">2</span>
            <span className="step-label">Information</span>
          </div>
          <div className="step-divider"></div>
          <div className="step active">
            <span className="step-number">3</span>
            <span className="step-label">Payment</span>
          </div>
        </div>
      </div>

      {orderSuccess ? (
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p className="order-id">Order ID: <strong>{orderId}</strong></p>
          <p className="success-message">
            ✅ Thank you for your order! <br/>
            ✅ Order details sent to <strong>stargoe8@gmail.com</strong> <br/>
            ✅ Your order will be processed within 1-2 business days.
          </p>
          
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${calculateSubtotal()}</span>
            </div>
            <div className="summary-item">
              <span>Shipping:</span>
              <span>${calculateShipping()}</span>
            </div>
            <div className="summary-item">
              <span>Tax:</span>
              <span>${calculateTax()}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <strong>${calculateTotal()}</strong>
            </div>
          </div>

          <div className="success-actions">
            <button 
              className="continue-shopping-btn"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
            <button 
              className="view-orders-btn"
              onClick={handleViewOrders}
            >
              View My Orders
            </button>
          </div>
        </div>
      ) : (
        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              
              <section className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      First Name *
                      {errors.firstName && <span className="error-text"> - {errors.firstName}</span>}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="John"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">
                      Last Name *
                      {errors.lastName && <span className="error-text"> - {errors.lastName}</span>}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address *
                      {errors.email && <span className="error-text"> - {errors.email}</span>}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number *
                      {errors.phone && <span className="error-text"> - {errors.phone}</span>}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </section>

              <section className="form-section">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label htmlFor="address">
                    Street Address *
                    {errors.address && <span className="error-text"> - {errors.address}</span>}
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="123 Main St"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">
                      City *
                      {errors.city && <span className="error-text"> - {errors.city}</span>}
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="New York"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="United States">Kyrgyzstan</option>
                      <option value="Canada">Russia</option>
                      <option value="United Kingdom">Kazakstan</option>
                      <option value="Australia">Uzbekstan</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">
                      ZIP / Postal Code *
                      {errors.zipCode && <span className="error-text"> - {errors.zipCode}</span>}
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={errors.zipCode ? 'error' : ''}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </section>

              <section className="form-section">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                  />
                  <span>
                    I agree to the Terms of Service and Privacy Policy *
                    {errors.agreeTerms && <span className="error-text"> - {errors.agreeTerms}</span>}
                  </span>
                </label>
              </section>

              <div className="email-notice-box">
                <h4>📧 Email Notifications</h4>
                <p>Order confirmation will be sent to:</p>
                <ul>
                  <li><strong>You:</strong> {formData.email || '[your email]'}</li>
                  <li><strong>Store Owner:</strong> stargoe8@gmail.com</li>
                </ul>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="back-to-cart"
                  onClick={() => navigate(-1)}
                >
                  ← Back to Cart
                </button>
                <button 
                  type="submit" 
                  className="submit-order"
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? 'Processing...' : `Complete Order - $${calculateTotal()}`}
                </button>
              </div>
            </form>
          </div>

          <div className="order-summary-sidebar">
            <div className="summary-card">
              <h3>Order Summary ({cartItems.length} items)</h3>
              
              <div className="cart-items-preview">
                {cartItems.map((item, index) => {
                  const price = item.hasDiscount && item.discount 
                    ? item.price * (1 - item.discount / 100)
                    : item.price;
                  return (
                    <div key={index} className="preview-item">
                      <img 
                        src={item.imageUrl || 'https://via.placeholder.com/60x80/cccccc/ffffff?text=Product'}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60x80/cccccc/ffffff?text=Product';
                        }}
                      />
                      <div className="preview-info">
                        <span className="preview-name">{item.name || 'Product'}</span>
                        <span className="preview-details">
                          {item.color && `${item.color}, `}
                          {item.size && `Size: ${item.size}`}
                          <br/>
                          Qty: {item.quantity || 1}
                        </span>
                        <span className="preview-price">${((price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>${calculateShipping()}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${calculateTax()}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <strong>${calculateTotal()}</strong>
                </div>
              </div>
              
              <div className="email-notice">
                <p><strong>stargoe8@gmail.com</strong> will receive complete order details including:</p>
                <ul className="email-details-list">
                  <li>✅ Customer name and contact info</li>
                  <li>✅ Shipping address</li>
                  <li>✅ Item details (color, size, quantity)</li>
                  <li>✅ Order total and breakdown</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Стили для модального окна */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .modal-header.success {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
        }
        
        .modal-header.error {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
        }
        
        .modal-header.warning {
          background: linear-gradient(135deg, #FF9800, #F57C00);
          color: white;
        }
        
        .modal-header.info {
          background: linear-gradient(135deg, #2196F3, #1976D2);
          color: white;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 20px;
        }
        
        .modal-close {
          background: none;
          border: none;
          font-size: 28px;
          color: inherit;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
        }
        
        .modal-close:hover {
          opacity: 1;
        }
        
        .modal-body {
          padding: 25px;
          max-height: 50vh;
          overflow-y: auto;
        }
        
        .modal-body pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
        }
        
        .modal-footer {
          padding: 20px;
          border-top: 1px solid #eee;
          text-align: right;
        }
        
        .modal-ok-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 10px 30px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .modal-ok-btn:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
}

export default Checkout;