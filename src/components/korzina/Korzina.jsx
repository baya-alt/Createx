import "./korzina.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Функция для получения правильных изображений товаров
const getProductImage = (productName, color) => {
  const name = productName.toLowerCase();
  const colorName = color ? color.toLowerCase() : '';
  
  // Unsplash изображения для разных товаров и цветов
  const imageMap = {
    'coat': {
      'black': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=300&fit=crop&crop=center',
      'blue': 'https://images.unsplash.com/photo-1539533119226-1c0f49c9d90c?w=200&h=300&fit=crop&crop=center',
      'red': 'https://images.unsplash.com/photo-1515372039744-b8fcd5ff72c1?w=200&h=300&fit=crop&crop=center',
      'brown': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=300&fit=crop&crop=center',
      'white': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=300&fit=crop&crop=center',
      'gray': 'https://images.unsplash.com/photo-1594736797933-d0d2f16bfa15?w=200&h=300&fit=crop&crop=center',
      'green': 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?w=200&h=300&fit=crop&crop=center',
      'default': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=300&fit=crop&crop=center'
    },
    'jacket': {
      'black': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=300&fit=crop&crop=center',
      'blue': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=300&fit=crop&crop=center',
      'brown': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=300&fit=crop&crop=center',
      'leather': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=300&fit=crop&crop=center',
      'default': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=300&fit=crop&crop=center'
    },
    'default': {
      'default': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=300&fit=crop&crop=center'
    }
  };

  // Определяем тип товара
  let productType = 'default';
  if (name.includes('coat') || name.includes('пальто') || name.includes('куртк')) {
    productType = 'coat';
  } else if (name.includes('jacket') || name.includes('жакет') || name.includes('пиджак')) {
    productType = 'jacket';
  }

  // Получаем изображение по цвету или используем дефолтное
  if (imageMap[productType] && colorName) {
    // Проверяем конкретный цвет
    for (const [colorKey, imageUrl] of Object.entries(imageMap[productType])) {
      if (colorName.includes(colorKey) && colorKey !== 'default') {
        return imageUrl;
      }
    }
  }

  // Возвращаем дефолтное изображение для типа товара
  return imageMap[productType]?.default || imageMap.default.default;
};

// Функция для получения стиля кружочка цвета
const getColorCircleStyle = (colorName) => {
  if (!colorName) return { backgroundColor: '#6b7280' };
  
  const colorLower = colorName.toLowerCase();
  
  const colorMap = {
    'black': '#000000',
    'white': '#ffffff',
    'blue': '#2563eb',
    'green': '#10b981',
    'red': '#ef4444',
    'pink': '#ec4899',
    'gray': '#6b7280',
    'grey': '#6b7280',
    'yellow': '#f59e0b',
    'navy': '#1e3a8a',
    'brown': '#92400e',
    'purple': '#8b5cf6',
    'orange': '#f97316'
  };
  
  for (const [key, value] of Object.entries(colorMap)) {
    if (colorLower.includes(key)) {
      return {
        backgroundColor: value,
        border: key === 'white' ? '1px solid #d1d5db' : 'none'
      };
    }
  }
  
  return { backgroundColor: '#6b7280' };
};

export default function Korzina({ open, onClose }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Обеспечиваем, что у каждого товара есть правильное изображение
      const cartWithImages = savedCart.map(item => ({
        ...item,
        // Если нет imageUrl или он некорректный, генерируем правильный
        imageUrl: item.imageUrl && item.imageUrl.startsWith('http') 
          ? item.imageUrl 
          : getProductImage(item.name, item.color)
      }));
      
      setItems(cartWithImages);
    };

    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    
    return () => {
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  const calculateSubtotal = () => {
    const subtotal = items.reduce((sum, item) => {
      const discountedPrice = item.hasDiscount && item.discount 
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return sum + (discountedPrice * item.quantity);
    }, 0);
    return subtotal.toFixed(2);
  };

  const calculateTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleRemoveItem = (id) => {
    const updatedCart = items.filter(item => item.id !== id);
    setItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleUpdateQuantity = (id, change) => {
    const updatedCart = items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    
    setItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleMoveToWishlist = (item) => {
    handleRemoveItem(item.id);
    
    const wishlist = JSON.parse(localStorage.getItem('favorites')) || [];
    wishlist.push({
      id: Date.now(),
      productId: item.productId || item.id,
      name: item.name,
      price: item.price,
      color: item.color,
      size: item.size,
      imageUrl: item.imageUrl || getProductImage(item.name, item.color),
      timestamp: Date.now()
    });
    localStorage.setItem('favorites', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const calculateDiscountedPrice = (item) => {
    if (item.hasDiscount && item.discount > 0) {
      return item.price * (1 - item.discount / 100);
    }
    return item.price;
  };

  // Функция для обработки checkout - переход на страницу оформления заказа
  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Закрываем корзину
    onClose();
    
    // Переходим на страницу оформления заказа
    navigate("/checkout");
  };

  // Функция для продолжения покупок
  const handleContinueShopping = () => {
    onClose();
    // Можно также перенаправить на главную страницу или оставить на текущей
    // navigate("/");
  };

  return (
    <>
      {open && <div className="cart-overlay" onClick={onClose} />}

      <div className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Your cart ({calculateTotalItems()})</h3>
          <button className="close-cart" onClick={onClose}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem 
                key={item.id} 
                item={item}
                onRemove={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
                onMoveToWishlist={handleMoveToWishlist}
                getColorCircleStyle={getColorCircleStyle}
                calculateDiscountedPrice={calculateDiscountedPrice}
                getProductImage={getProductImage}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="subtotal">
              <span>Subtotal:</span>
              <strong>${calculateSubtotal()}</strong>
            </div>
            <p className="tax-note">Taxes and shipping calculated at checkout</p>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <button className="continue-shopping" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function CartItem({ item, onRemove, onUpdateQuantity, onMoveToWishlist, getColorCircleStyle, calculateDiscountedPrice, getProductImage }) {
  const { 
    id,
    name: title, 
    price, 
    color, 
    size, 
    quantity: qty = 1, 
    imageUrl,
    variant,
    discount,
    hasDiscount
  } = item;
  
  const discountedPrice = calculateDiscountedPrice(item);
  const itemTotal = (discountedPrice * qty).toFixed(2);
  const originalTotal = (price * qty).toFixed(2);
  
  // Используем imageUrl из товара или генерируем правильное изображение
  const productImage = imageUrl || getProductImage(title, color);
  
  // Обработчик ошибок загрузки изображения
  const handleImageError = (e) => {
    e.target.onerror = null;
    // Если изображение не загрузилось, используем placeholder
    e.target.src = `https://via.placeholder.com/200x300/cccccc/ffffff?text=${encodeURIComponent(title.substring(0, 15))}`;
  };

  return (
    <div className="cart-item">
      <div className="thumb">
        <img 
          src={productImage} 
          alt={`${title} - ${color} - ${size}`}
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className="info">
        <h4>{title}</h4>
        
        <div className="details">
          {color && (
            <div className="color-info">
              <span 
                className="color-circle" 
                style={getColorCircleStyle(color)}
              />
              <span>Color: {color}</span>
            </div>
          )}
          {size && <p className="size-info">Size: {size}</p>}
          {variant && <p className="variant-info">{variant}</p>}
        </div>

        <div className="quantity-control">
          <button 
            className="qty-btn minus" 
            onClick={() => onUpdateQuantity(id, -1)}
            disabled={qty <= 1}
          >
            −
          </button>
          <span className="qty-display">{qty}</span>
          <button 
            className="qty-btn plus" 
            onClick={() => onUpdateQuantity(id, 1)}
            disabled={qty >= 10}
          >
            +
          </button>
        </div>

        <div className="price-row">
          <div className="price-details">
            {hasDiscount && discount > 0 ? (
              <>
                <div className="original-price">
                  <span className="item-qty">{qty} ×</span>
                  <span className="original-price-value">${price.toFixed(2)}</span>
                </div>
                <div className="discounted-price">
                  <span className="item-qty">{qty} ×</span>
                  <span className="final-price">${discountedPrice.toFixed(2)}</span>
                  <span className="discount-badge">-{discount}%</span>
                </div>
                <div className="total-price">
                  <span className="equals">=</span>
                  <span className="item-total">${itemTotal}</span>
                </div>
              </>
            ) : (
              <div className="regular-price">
                <span className="item-qty">{qty} × ${price.toFixed(2)}</span>
                <span className="equals">=</span>
                <span className="item-total">${itemTotal}</span>
              </div>
            )}
          </div>
        </div>

        <div className="actions">
          <button 
            className="move-btn"
            onClick={() => onMoveToWishlist(item)}
            title="Move to Wishlist"
          >
            <span className="heart-icon">♥</span> Move to Wishlist
          </button>
        </div>
      </div>

      <button 
        className="remove" 
        onClick={() => onRemove(id)}
        title="Remove item"
      >
        ✕
      </button>
    </div>
  );
}