import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { useNavigate } from 'react-router-dom';

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
    state: '',
    zipCode: '',
    shippingMethod: 'standard',
    paymentMethod: 'creditCard',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
    saveInfo: false,
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Загружаем товары из корзины
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // Рассчитываем итоговые суммы
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.hasDiscount && item.discount 
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const calculateShipping = () => {
    switch (formData.shippingMethod) {
      case 'express': return 15.99;
      case 'priority': return 9.99;
      default: return 4.99;
    }
  };

  const calculateTax = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return (subtotal * 0.08).toFixed(2); // 8% налог
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const shipping = parseFloat(calculateShipping());
    const tax = parseFloat(calculateTax());
    return (subtotal + shipping + tax).toFixed(2);
  };

  // Обработчики изменений формы
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    const cardRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvcRegex = /^\d{3,4}$/;

    // Проверка обязательных полей
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Проверка платежной информации
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!cardRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number (16 digits required)';
      }
      if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!expiryRegex.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Invalid expiry date (MM/YY)';
      }
      if (!formData.cardCVC.trim()) {
        newErrors.cardCVC = 'CVC is required';
      } else if (!cvcRegex.test(formData.cardCVC)) {
        newErrors.cardCVC = 'Invalid CVC (3-4 digits)';
      }
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  // Обработка оформления заказа
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Прокрутка к первой ошибке
      const firstErrorField = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Генерируем ID заказа
      const newOrderId = 'ORD' + Date.now().toString().slice(-8);
      setOrderId(newOrderId);

      // Создаем объект заказа
      const order = {
        id: newOrderId,
        date: new Date().toISOString(),
        items: cartItems,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          state: formData.state,
          zipCode: formData.zipCode
        },
        shipping: {
          method: formData.shippingMethod,
          cost: calculateShipping()
        },
        payment: {
          method: formData.paymentMethod,
          lastFour: formData.paymentMethod === 'creditCard' 
            ? formData.cardNumber.slice(-4) 
            : null
        },
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shippingCost: calculateShipping(),
        total: calculateTotal(),
        status: 'Processing'
      };

      // Сохраняем заказ
      const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
      localStorage.setItem('orders', JSON.stringify([order, ...existingOrders]));
      
      // Очищаем корзину
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));

      // Сохраняем информацию пользователя, если нужно
      if (formData.saveInfo) {
        localStorage.setItem('userInfo', JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        }));
      }

      // Имитируем задержку API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Показываем успешное сообщение
      setOrderSuccess(true);

    } catch (error) {
      console.error('Order submission error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Форматирование карты
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Форматирование даты
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Обработка форматирования полей
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({ ...prev, cardExpiry: formatted }));
  };

  // Вернуться к покупкам
  const handleContinueShopping = () => {
    navigate('/');
  };

  // Просмотр заказов
  const handleViewOrders = () => {
    navigate('/orders');
  };

  // Загрузка сохраненной информации пользователя
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        setFormData(prev => ({
          ...prev,
          firstName: userInfo.firstName || '',
          lastName: userInfo.lastName || '',
          email: userInfo.email || '',
          phone: userInfo.phone || '',
          saveInfo: true
        }));
      } catch (error) {
        console.error('Error loading saved user info:', error);
      }
    }
  }, []);

  return (
    <div className="checkout-container">
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
            Thank you for your purchase! A confirmation email has been sent to {formData.email}.<br />
            Your order will be shipped within 2-3 business days.
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
              
              {/* Контактная информация */}
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

              {/* Адрес доставки */}
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
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="state">State / Province</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                    />
                  </div>
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

              {/* Способ доставки */}
              <section className="form-section">
                <h3>Shipping Method</h3>
                <div className="shipping-options">
                  <label className="shipping-option">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <span className="option-title">Standard Shipping</span>
                      <span className="option-duration">5-7 business days</span>
                      <span className="option-price">$4.99</span>
                    </div>
                  </label>
                  
                  <label className="shipping-option">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="priority"
                      checked={formData.shippingMethod === 'priority'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <span className="option-title">Priority Shipping</span>
                      <span className="option-duration">3-5 business days</span>
                      <span className="option-price">$9.99</span>
                    </div>
                  </label>
                  
                  <label className="shipping-option">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <span className="option-title">Express Shipping</span>
                      <span className="option-duration">1-2 business days</span>
                      <span className="option-price">$15.99</span>
                    </div>
                  </label>
                </div>
              </section>

              {/* Способ оплаты */}
              <section className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="creditCard"
                      checked={formData.paymentMethod === 'creditCard'}
                      onChange={handleInputChange}
                    />
                    <span>Credit Card</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                    />
                    <span>PayPal</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="applePay"
                      checked={formData.paymentMethod === 'applePay'}
                      onChange={handleInputChange}
                    />
                    <span>Apple Pay</span>
                  </label>
                </div>

                {formData.paymentMethod === 'creditCard' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        Card Number *
                        {errors.cardNumber && <span className="error-text"> - {errors.cardNumber}</span>}
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        className={errors.cardNumber ? 'error' : ''}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardName">
                        Name on Card *
                        {errors.cardName && <span className="error-text"> - {errors.cardName}</span>}
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={errors.cardName ? 'error' : ''}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="cardExpiry">
                          Expiry Date (MM/YY) *
                          {errors.cardExpiry && <span className="error-text"> - {errors.cardExpiry}</span>}
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleExpiryChange}
                          className={errors.cardExpiry ? 'error' : ''}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardCVC">
                          CVC *
                          {errors.cardCVC && <span className="error-text"> - {errors.cardCVC}</span>}
                        </label>
                        <input
                          type="text"
                          id="cardCVC"
                          name="cardCVC"
                          value={formData.cardCVC}
                          onChange={handleInputChange}
                          className={errors.cardCVC ? 'error' : ''}
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {formData.paymentMethod === 'paypal' && (
                  <div className="paypal-note">
                    <p>You will be redirected to PayPal to complete your payment.</p>
                  </div>
                )}
                
                {formData.paymentMethod === 'applePay' && (
                  <div className="apple-pay-note">
                    <p>You will be redirected to Apple Pay to complete your payment.</p>
                  </div>
                )}
              </section>

              {/* Сохранение информации и соглашение */}
              <section className="form-section">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                  />
                  <span>Save this information for next time</span>
                </label>
                
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

              {/* Кнопка отправки */}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : `Pay $${calculateTotal()}`}
                </button>
              </div>
            </form>
          </div>

          {/* Боковая панель с итогами */}
          <div className="order-summary-sidebar">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="cart-items-preview">
                {cartItems.map((item, index) => {
                  const price = item.hasDiscount && item.discount 
                    ? item.price * (1 - item.discount / 100)
                    : item.price;
                  return (
                    <div key={index} className="preview-item">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60x80/cccccc/ffffff?text=Product';
                        }}
                      />
                      <div className="preview-info">
                        <span className="preview-name">{item.name}</span>
                        <span className="preview-details">
                          {item.color && `${item.color}, `}
                          {item.size && `Size: ${item.size}, `}
                          Qty: {item.quantity}
                        </span>
                        <span className="preview-price">${(price * item.quantity).toFixed(2)}</span>
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
              
              <div className="security-info">
                <div className="security-item">
                  <span className="lock-icon">🔒</span>
                  <span>Secure checkout</span>
                </div>
                <div className="security-item">
                  <span className="shield-icon">🛡️</span>
                  <span>SSL encrypted</span>
                </div>
              </div>
            </div>
            
            <div className="need-help">
              <h4>Need Help?</h4>
              <p>Contact us at support@example.com or call (555) 123-4567</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;