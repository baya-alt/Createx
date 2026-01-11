import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  FaStar, 
  FaRegStar, 
  FaShoppingCart, 
  FaThumbsUp, 
  FaThumbsDown,
  FaReply,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheck
} from "react-icons/fa";
import MenLeaveReview from "./MenLeawReviews";
// import "./menrewiew.css";

// БОЛЬШЕ ОТЗЫВОВ - ТЕПЕРЬ 12 ШТУК (обновлены для мужских товаров)
const allReviewsData = [
  // Страница 1
  {
    id: 1,
    name: "Michael Johnson",
    date: "July 15, 2020",
    rating: 5,
    text: "Excellent quality! The material is durable and comfortable. Perfect for everyday wear. Fits true to size.",
    likes: 3,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-07-15").getTime()
  },
  {
    id: 2,
    name: "David Wilson",
    date: "1 day ago",
    rating: 0,
    text: "@Michael Johnson Totally agree! The stitching is top-notch and it holds up well after multiple washes.",
    likes: 2,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
    isReply: true,
    timestamp: new Date().getTime() - 86400000 // 1 день назад
  },
  {
    id: 3,
    name: "Robert Smith",
    date: "July 7, 2020",
    rating: 4,
    text: "Great fit and comfortable. Color is exactly as shown. Would recommend for casual office wear.",
    likes: 0,
    dislikes: 3,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-07-07").getTime()
  },
  {
    id: 4,
    name: "James Brown",
    date: "June 28, 2020",
    rating: 5,
    text: "Best men's clothing purchase this year. The fabric is breathable and perfect for all seasons.",
    likes: 5,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-28").getTime()
  },
  // Страница 2
  {
    id: 5,
    name: "William Taylor",
    date: "June 20, 2020",
    rating: 4,
    text: "Solid construction and good value. The sleeves are just the right length for my build.",
    likes: 7,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-20").getTime()
  },
  {
    id: 6,
    name: "Thomas Anderson",
    date: "June 18, 2020",
    rating: 3,
    text: "Decent shirt but the collar is a bit tight. Consider sizing up if you have a broader neck.",
    likes: 1,
    dislikes: 2,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-18").getTime()
  },
  {
    id: 7,
    name: "Christopher Lee",
    date: "June 15, 2020",
    rating: 5,
    text: "Exceptional quality! The attention to detail in the stitching is impressive. Very satisfied.",
    likes: 9,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-15").getTime()
  },
  {
    id: 8,
    name: "Daniel Miller",
    date: "June 10, 2020",
    rating: 5,
    text: "Perfect for both casual and semi-formal occasions. The fabric maintains its shape well.",
    likes: 11,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-10").getTime()
  },
  // Страница 3
  {
    id: 9,
    name: "Matthew Davis",
    date: "June 5, 2020",
    rating: 4,
    text: "Good quality fabric and proper fit. The buttons are sturdy and well-secured.",
    likes: 4,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-05").getTime()
  },
  {
    id: 10,
    name: "Anthony Martinez",
    date: "June 1, 2020",
    rating: 2,
    text: "Material seems thinner than advertised. Might not be suitable for colder weather.",
    likes: 0,
    dislikes: 5,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-01").getTime()
  },
  {
    id: 11,
    name: "Mark Thompson",
    date: "May 25, 2020",
    rating: 5,
    text: "Premium feel and excellent fit. The color options for men are really well chosen.",
    likes: 8,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-05-25").getTime()
  },
  {
    id: 12,
    name: "Kevin Garcia",
    date: "May 20, 2020",
    rating: 3,
    text: "Average quality. Fabric could be more substantial for the price. Color is nice though.",
    likes: 2,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-05-20").getTime()
  }
];

const REVIEWS_PER_PAGE = 4;

// Варианты сортировки
const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  HIGHEST_RATING: "highest rating",
  LOWEST_RATING: "lowest rating",
  MOST_LIKES: "most likes",
  MOST_DISLIKES: "most dislikes"
};

/* ================= КОМПОНЕНТЫ УВЕДОМЛЕНИЙ ================= */

// 1. Уведомление об успешном добавлении отзыва
function ReviewAddedNotification({ isOpen, onClose, review }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsHiding(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="notification-container">
      <div className={`notification review-added ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <div className="notification-icon-circle success">
            <span className="notification-icon">✓</span>
          </div>
          <div className="notification-titles">
            <h3 className="notification-title">Review Submitted</h3>
            <p className="notification-subtitle">Thank you for sharing your experience!</p>
          </div>
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="notification-body">
          <div className="review-preview">
            <div className="reviewer-avatar">
              <span className="avatar-initials">Y</span>
            </div>
            <div className="review-content">
              <div className="review-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="review-star">
                    {i < review.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <p className="review-text-preview">{review.text.substring(0, 100)}...</p>
              <div className="review-meta">
                <span className="review-author">Your review</span>
                <span className="review-date">Just now</span>
              </div>
            </div>
          </div>
          
          <div className="notification-actions">
            <button className="notification-btn continue" onClick={handleClose}>
              Continue Browsing
            </button>
            <button className="notification-btn view-all" onClick={handleClose}>
              View All Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Уведомление о лайке/дизлайке
function FeedbackNotification({ isOpen, onClose, type, reviewAuthor }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsHiding(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const isLike = type === 'like';
  const icon = isLike ? '👍' : '👎';
  const title = isLike ? 'Review Liked' : 'Review Disliked';
  const message = isLike 
    ? `You liked ${reviewAuthor}'s review` 
    : `You disliked ${reviewAuthor}'s review`;

  return (
    <div className="notification-container">
      <div className={`notification feedback ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <div className="notification-icon-circle">
            <span className="notification-icon">{icon}</span>
          </div>
          <div className="notification-titles">
            <h3 className="notification-title">{title}</h3>
            <p className="notification-subtitle">{message}</p>
          </div>
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="notification-actions">
          <button className="notification-btn" onClick={handleClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Уведомление о добавлении в корзину из карточки отзывов
function CartNotification({ isOpen, onClose, product, size, color }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isHiding, setIsHiding] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Получаем данные корзины
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItemsCount(cart.length);
    
    const total = cart.reduce((sum, item) => {
      const price = item.hasDiscount && item.discount 
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
    setCartTotal(total.toFixed(2));

    if (isOpen) {
      setIsVisible(true);
      setIsHiding(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleViewCart = () => {
    // Здесь можно добавить логику открытия корзины
    console.log("Opening cart...");
    handleClose();
  };

  const getColorHex = (colorName) => {
    const colors = {
      black: '#000000',
      white: '#ffffff',
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      pink: '#ec4899',
      gray: '#6b7280',
      brown: '#92400e',
      navy: '#1e3a8a',
    };
    return colors[colorName?.toLowerCase()] || '#6b7280';
  };

  if (!isVisible) return null;

  return (
    <div className="notification-container">
      <div className={`notification cart-added ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <div className="notification-icon-circle success">
            <span className="notification-icon">✓</span>
          </div>
          <div className="notification-titles">
            <h3 className="notification-title">Added to Cart</h3>
            <p className="notification-subtitle">Item successfully added to your shopping cart</p>
          </div>
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="notification-body">
          <div className="cart-product-preview">
            <div className="cart-product-image">
              <img 
                src={product.avatar || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop"} 
                alt={product.name}
              />
            </div>
            <div className="cart-product-info">
              <h4 className="cart-product-name">{product.name}</h4>
              <div className="cart-product-details">
                {color && (
                  <span className="cart-product-color">
                    <span 
                      className="cart-color-dot" 
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </span>
                )}
                {size && (
                  <span className="cart-product-size">
                    <span>Size:</span> {size}
                  </span>
                )}
              </div>
              <div className="cart-product-price">
                ${product.price.toFixed(2)}
              </div>
            </div>
          </div>
          
          {cartItemsCount > 1 && (
            <div className="cart-summary">
              <div className="cart-count">
                <span className="cart-count-number">{cartItemsCount}</span>
                <span>items in cart</span>
              </div>
              <div className="cart-total-price">${cartTotal}</div>
            </div>
          )}
          
          <div className="notification-actions">
            <button className="notification-btn continue" onClick={handleClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Continue Shopping
            </button>
            <button className="notification-btn view-cart" onClick={handleViewCart}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2H3.33333L5.2 9.592C5.30213 10.0251 5.59046 10.396 5.996 10.618C6.40153 10.84 6.8896 10.8927 7.33333 10.764H12.6667C13.1104 10.8927 13.5985 10.84 14.004 10.618C14.4095 10.396 14.6979 10.0251 14.8 9.592L16 4.66667H4.66667M6.66667 14C6.66667 14.3682 6.36819 14.6667 6 14.6667C5.63181 14.6667 5.33333 14.3682 5.33333 14C5.33333 13.6318 5.63181 13.3333 6 13.3333C6.36819 13.3333 6.66667 13.6318 6.66667 14ZM13.3333 14C13.3333 14.3682 13.0349 14.6667 12.6667 14.6667C12.2985 14.6667 12 14.3682 12 14C12 13.6318 12.2985 13.3333 12.6667 13.3333C13.0349 13.3333 13.3333 13.6318 13.3333 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Уведомление о добавлении в избранное
function FavoriteAddedNotification({ isOpen, onClose, product, color }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsHiding(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getColorHex = (colorName) => {
    const colors = {
      black: '#000000',
      white: '#ffffff',
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
    };
    return colors[colorName?.toLowerCase()] || '#6b7280';
  };

  return (
    <div className="notification-container">
      <div className={`notification favorite-added ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
          
          <div className="notification-icon-circle">
            <span className="notification-icon">❤️</span>
          </div>
          
          <h3 className="notification-title">Added to Favorites</h3>
          <p className="notification-subtitle">
            Item successfully added to your wishlist
          </p>
        </div>
        
        <div className="notification-body">
          {product && (
            <div className="favorite-product-info">
              <div className="favorite-product-image">
                <img 
                  src={product.avatar || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop"} 
                  alt={product.name}
                />
              </div>
              <div className="favorite-product-details">
                <h4 className="favorite-product-name">{product.name}</h4>
                <div className="favorite-product-meta">
                  {color && (
                    <span className="favorite-product-color">
                      <span 
                        className="favorite-color-dot" 
                        style={{ backgroundColor: getColorHex(color) }}
                      />
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </span>
                  )}
                  <p className="favorite-product-price">${product.price?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="notification-actions">
            <button className="notification-btn cancel" onClick={handleClose}>
              Continue Shopping
            </button>
            <button className="notification-btn primary" onClick={handleClose}>
              View Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= ФУНКЦИИ ДЛЯ РАБОТЫ С ХРАНИЛИЩЕМ ================= */

const addToCartFromMenReviews = (product, size, color) => {
  const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const cartItemId = Date.now();
  
  const item = {
    id: cartItemId,
    productId: product.id,
    name: product.name,
    price: product.price,
    basePrice: product.basePrice || product.price,
    discount: product.discount || 0,
    hasDiscount: product.hasDiscount || false,
    size: size,
    quantity: 1,
    color: color,
    imageUrl: product.avatar || "",
    variant: product.kategory || "Men's Clothing",
    timestamp: Date.now()
  };
  
  const existingItemIndex = existingCart.findIndex(cartItem => 
    cartItem.productId === item.productId && 
    cartItem.size === item.size && 
    cartItem.color === item.color
  );
  
  if (existingItemIndex !== -1) {
    existingCart[existingItemIndex].quantity += 1;
  } else {
    existingCart.push(item);
  }
  
  localStorage.setItem('cart', JSON.stringify(existingCart));
  window.dispatchEvent(new Event('cartUpdated'));
  
  return item;
};

const addToFavoritesFromMenReviews = (product, color, imageUrl) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  const favoriteItem = {
    id: Date.now(),
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: imageUrl,
    color: color,
    timestamp: Date.now()
  };

  const isAlreadyFavorite = favorites.some(fav => 
    fav.productId === favoriteItem.productId && 
    fav.color === favoriteItem.color
  );
  
  if (!isAlreadyFavorite) {
    favorites.push(favoriteItem);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
    return { success: true, item: favoriteItem };
  } else {
    const updatedFavorites = favorites.filter(fav => 
      !(fav.productId === favoriteItem.productId && fav.color === favoriteItem.color)
    );
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
    return { success: false, item: favoriteItem };
  }
};

export default function MenReviews() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://691bbd103aaeed735c8e1d0d.mockapi.io/man/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const basePrice = Number(data.price.replace("$", ""));
        const discount = data.sale ? Number(data.sale) : null;
        const price = discount
          ? +(basePrice * (1 - discount / 100)).toFixed(2)
          : basePrice;

        setProduct({
          ...data,
          basePrice,
          price,
          discount,
          hasDiscount: !!data.sale,
        });
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (!product) return <div className="error-state">Product not found</div>;

  return <MenReviewsContent product={product} />;
}

function MenReviewsContent({ product }) {
  // Состояние для отзывов
  const [reviews, setReviews] = useState(allReviewsData);
  
  // Состояние для сортировки
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  
  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  
  // Состояние для модального окна
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Состояния для уведомлений
  const [showReviewAdded, setShowReviewAdded] = useState(false);
  const [showFeedbackNotification, setShowFeedbackNotification] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [showFavoriteNotification, setShowFavoriteNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);

  // Сортируем отзывы в зависимости от выбранного варианта
  const sortedReviews = useMemo(() => {
    const reviewsCopy = [...reviews];
    
    switch (sortBy) {
      case SORT_OPTIONS.NEWEST:
        return reviewsCopy.sort((a, b) => b.timestamp - a.timestamp);
        
      case SORT_OPTIONS.OLDEST:
        return reviewsCopy.sort((a, b) => a.timestamp - b.timestamp);
        
      case SORT_OPTIONS.HIGHEST_RATING:
        return reviewsCopy.sort((a, b) => b.rating - a.rating);
        
      case SORT_OPTIONS.LOWEST_RATING:
        return reviewsCopy.sort((a, b) => a.rating - b.rating);
        
      case SORT_OPTIONS.MOST_LIKES:
        return reviewsCopy.sort((a, b) => b.likes - a.likes);
        
      case SORT_OPTIONS.MOST_DISLIKES:
        return reviewsCopy.sort((a, b) => b.dislikes - a.dislikes);
        
      default:
        return reviewsCopy;
    }
  }, [reviews, sortBy]);

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);

  // Получаем отзывы для текущей страницы
  const currentReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    return sortedReviews.slice(startIndex, endIndex);
  }, [sortedReviews, currentPage]);

  // Функция для обработки лайков
  const handleLike = (reviewId, reviewAuthor) => {
    setReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id === reviewId) {
          if (review.userLiked) {
            // Убираем лайк
            return {
              ...review,
              likes: review.likes - 1,
              userLiked: false
            };
          } else {
            // Добавляем лайк, убираем дизлайк если был
            const newDislikes = review.userDisliked ? review.dislikes - 1 : review.dislikes;
            return {
              ...review,
              likes: review.likes + 1,
              dislikes: newDislikes,
              userLiked: true,
              userDisliked: false
            };
          }
        }
        return review;
      })
    );
    
    // Показываем уведомление
    setNotificationData({
      type: 'like',
      author: reviewAuthor
    });
    setShowFeedbackNotification(true);
  };

  // Функция для обработки дизлайков
  const handleDislike = (reviewId, reviewAuthor) => {
    setReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id === reviewId) {
          if (review.userDisliked) {
            // Убираем дизлайк
            return {
              ...review,
              dislikes: review.dislikes - 1,
              userDisliked: false
            };
          } else {
            // Добавляем дизлайк, убираем лайк если был
            const newLikes = review.userLiked ? review.likes - 1 : review.likes;
            return {
              ...review,
              likes: newLikes,
              dislikes: review.dislikes + 1,
              userLiked: false,
              userDisliked: true
            };
          }
        }
        return review;
      })
    );
    
    // Показываем уведомление
    setNotificationData({
      type: 'dislike',
      author: reviewAuthor
    });
    setShowFeedbackNotification(true);
  };

  // Функции для пагинации
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Прокрутка вверх при смене страницы
      window.scrollTo({
        top: document.querySelector('.reviews-list').offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Обработчик изменения сортировки
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене сортировки
  };

  // Функция для открытия модального окна
  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
    // Блокируем скролл страницы
    document.body.style.overflow = 'hidden';
  };

  // Функция для закрытия модального окна
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    // Восстанавливаем скролл страницы
    document.body.style.overflow = 'auto';
  };

  // Функция для добавления нового отзыва
  const handleReviewSubmit = (newReview) => {
    const reviewToAdd = {
      ...newReview,
      id: Date.now(),
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      userLiked: false,
      userDisliked: false
    };
    
    setReviews(prevReviews => [reviewToAdd, ...prevReviews]);
    setCurrentPage(1); // Переходим на первую страницу
    
    // Показываем уведомление об успешном добавлении
    setNotificationData(reviewToAdd);
    setShowReviewAdded(true);
    
    handleCloseReviewModal();
  };

  // Формируем список доступных цветов ДЛЯ МУЖСКИХ ТОВАРОВ
  const colorMap = useMemo(() => {
    return [
      { name: "black", label: "Black", src: product.avatar },
      { name: "white", label: "White", src: product.avatarwhite },
      { name: "blue", label: "Blue", src: product.avatarblue },
      { name: "red", label: "Red", src: product.avatarred },
      { name: "yellow", label: "Yellow", src: product.avataryellow },
      { name: "green", label: "Green", src: product.avatargreen }
    ].filter((c) => c.src);
  }, [product]);

  // Массив для слайдера: [Клон последнего, Оригиналы..., Клон первого]
  const slides = useMemo(() => {
    if (!colorMap.length) return [];
    const images = colorMap.map((c) => c.src);
    return [images[images.length - 1], ...images, images[0]];
  }, [colorMap]);

  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSize, setActiveSize] = useState("M");
  const [rating, setRating] = useState(4);

  // Определяем активный цвет для подсветки точек
  const activeColorName = useMemo(() => {
    if (index === 0) return colorMap[colorMap.length - 1]?.name;
    if (index === slides.length - 1) return colorMap[0]?.name;
    return colorMap[index - 1]?.name;
  }, [index, colorMap, slides.length]);

  // Функция переключения слайдов
  const handleSlideChange = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex(newIndex);
  };

  const onTransitionEnd = () => {
    setIsAnimating(false);
    
    // Если дошли до левого края (клон последнего фото)
    if (index === 0) {
      setIndex(slides.length - 2);
    }
    // Если дошли до правого края (клон первого фото)
    if (index === slides.length - 1) {
      setIndex(1);
    }
  };

  // Обработчик добавления в корзину
  const handleAddToCart = () => {
    const addedItem = addToCartFromMenReviews(product, activeSize, activeColorName);
    
    // Показываем уведомление
    setNotificationData({
      product: product,
      size: activeSize,
      color: activeColorName
    });
    setShowCartNotification(true);
  };

  // Обработчик добавления в избранное
  const handleAddToWishlist = () => {
    const result = addToFavoritesFromMenReviews(product, activeColorName, product.avatar);
    
    if (result.success) {
      // Показываем уведомление о добавлении в избранное
      setNotificationData({
        product: product,
        color: activeColorName
      });
      setShowFavoriteNotification(true);
    }
    // Если уже в избранном - уведомление не показываем, так как функция его удаляет
  };

  // Данные статистики как на скриншоте (обновлены для мужских отзывов)
  const statsData = [
    { stars: 5, count: 8, percentage: 67, color: "#20c997" },
    { stars: 4, count: 2, percentage: 17, color: "#5eead4" },
    { stars: 3, count: 2, percentage: 17, color: "#ffc107" },
    { stars: 2, count: 1, percentage: 8, color: "#fd7e14" },
    { stars: 1, count: 1, percentage: 8, color: "#dc3545" },
  ];

  // Подсчёт общего рейтинга и статистики
  const totalRating = useMemo(() => {
    const ratings = reviews.filter(r => r.rating > 0).map(r => r.rating);
    const average = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : "0.0";
    
    const recommendedCount = reviews.filter(r => r.rating >= 4).length;
    const recommendationPercentage = Math.round((recommendedCount / reviews.length) * 100);
    
    return { average, recommendedCount, recommendationPercentage };
  }, [reviews]);

  return (
    <>
      <div className="product-page-wrapper">
        <div className="container">
          <div className="product-layout">
            {/* ЛЕВАЯ КОЛОНКА: ОТЗЫВЫ */}
            <div className="text-info-column">
              {/* Статистика отзывов */}
              <h2 className="reviews-main-title">{reviews.length} reviews</h2>

              <div className="reviews-summary-box">
                <div className="rating-overview">
                  <span className="rating-number">{totalRating.average}</span>
                  <div className="rating-stars">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <p className="recommend-text">
                    {totalRating.recommendedCount} out of {reviews.length} ({totalRating.recommendationPercentage}%) <br />
                    <span className="recommend-sub">Customers recommend this product</span>
                  </p>
                </div>

                <div className="rating-bars">
                  {statsData.map((stat) => (
                    <div key={stat.stars} className="rating-bar-row">
                      <span className="bar-star">{stat.stars} ★</span>
                      <div className="bar-background">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${stat.percentage}%`,
                            backgroundColor: stat.color
                          }}
                        />
                      </div>
                      <span className="bar-count">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="reviews-actions-row">
                <button 
                  className="leave-review-btn"
                  onClick={handleOpenReviewModal}
                >
                  Leave a review
                </button>
                <div className="sort-by">
                  <span>Sort by</span>
                  <select 
                    className="sort-select"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value={SORT_OPTIONS.NEWEST}>newest</option>
                    <option value={SORT_OPTIONS.OLDEST}>oldest</option>
                    <option value={SORT_OPTIONS.HIGHEST_RATING}>highest rating</option>
                    <option value={SORT_OPTIONS.LOWEST_RATING}>lowest rating</option>
                    <option value={SORT_OPTIONS.MOST_LIKES}>most likes</option>
                    <option value={SORT_OPTIONS.MOST_DISLIKES}>most dislikes</option>
                  </select>
                </div>
              </div>

              {/* Список отзывов */}
              <div className="reviews-list">
                {currentReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="review-item"
                  >
                    <div className="review-header">
                      <div className="reviewer-info">
                        <h4 className="reviewer-name">{review.name}</h4>
                        <span className="review-date">{review.date}</span>
                      </div>
                      
                      {/* Показываем звезды только если rating > 0 */}
                      {review.rating > 0 && (
                        <div className="review-stars-small">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="star-small">
                              {i < review.rating ? <FaStar /> : <FaRegStar />}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <p className="review-text">{review.text}</p>
                    
                    <div className="review-actions-bottom">
                      <button className="reply-btn-small">
                        <FaReply /> Reply
                      </button>
                      <div className="feedback-btns">
                        <button 
                          className={`like-btn-small ${review.userLiked ? "active" : ""}`}
                          onClick={() => handleLike(review.id, review.name)}
                        >
                          <FaThumbsUp /> {review.likes}
                        </button>
                        <button 
                          className={`dislike-btn-small ${review.userDisliked ? "active" : ""}`}
                          onClick={() => handleDislike(review.id, review.name)}
                        >
                          <FaThumbsDown /> {review.dislikes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ПАГИНАЦИЯ - ЦИФРЫ 1 2 3 */}
              <div className="reviews-pagination">
                <button 
                  className="pagination-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft />
                </button>
                
                {/* Цифры страниц */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    className={`pagination-btn ${currentPage === pageNumber ? "active" : ""}`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                <button 
                  className="pagination-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <FaChevronRight />
                </button>
                
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА: КАРТОЧКА ТОВАРА СО СЛАЙДЕРОМ */}
            <div className="sticky-card-column">
              <div className="card-exact">
                <div className="image-wrapper-exact">
                  {product.hasDiscount && (
                    <div className="badge-exact">-{product.discount}%</div>
                  )}

                  <div className="rating-exact">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star-icon ${i < rating ? "filled" : "empty"}`}
                        onClick={() => setRating(i + 1)}
                      >
                        {i < rating ? <FaStar /> : <FaRegStar />}
                      </span>
                    ))}
                  </div>

                  <div className="img-container viewport">
                    {/* ЛЕВАЯ КНОПКА */}
                    <button 
                      className="slider-btn left" 
                      onClick={() => handleSlideChange(index - 1)}
                    >
                      ‹
                    </button>

                    <div
                      className="slider-track-details"
                      style={{
                        transform: `translateX(-${index * 100}%)`,
                        transition: isAnimating ? "transform 0.45s ease-out" : "none",
                      }}
                      onTransitionEnd={onTransitionEnd}
                    >
                      {slides.map((img, i) => (
                        <img key={i} src={img} className="image-exact slide-img" alt="" />
                      ))}
                    </div>

                    {/* ПРАВАЯ КНОПКА */}
                    <button 
                      className="slider-btn right" 
                      onClick={() => handleSlideChange(index + 1)}
                    >
                      ›
                    </button>
                  </div>

                  <button className="wishlist-btn" onClick={handleAddToWishlist}>
                    ❤
                  </button>
                </div>

                <div className="card-body-exact">
                  <p className="category-text">{product.kategory || "Men's Clothing"}</p>
                  <h4 className="title-text">{product.name}</h4>

                  <div className="price-row">
                    <span className="price-current">${product.price.toFixed(2)}</span>
                    {product.hasDiscount && (
                      <span className="price-old">${product.basePrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="selection-area">
                    <div className="selector-group">
                      <label className="selector-label">Size:</label>
                      <div className="sizes-block">
                        {["XS", "S", "M", "L", "XL"].map((s) => (
                          <span
                            key={s}
                            className={`size-option ${activeSize === s ? "active" : ""}`}
                            onClick={() => setActiveSize(s)}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="selector-group">
                      <label className="selector-label">Color:</label>
                      <div className="colors-block">
                        {colorMap.map((color, i) => (
                          <span
                            key={color.name}
                            className={`dot d-${color.name} ${
                              activeColorName === color.name ? "active" : ""
                            }`}
                            onClick={() => handleSlideChange(i + 1)}
                          />
                        ))}
                      </div>
                    </div>

                    <button className="add-cart-btn" onClick={handleAddToCart}>
                      <FaShoppingCart /> Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ДЛЯ ОТЗЫВОВ */}
      {showReviewModal && (
        <MenLeaveReview
          onClose={handleCloseReviewModal}
          onReviewSubmit={handleReviewSubmit}
        />
      )}

      {/* УВЕДОМЛЕНИЕ О ДОБАВЛЕНИИ ОТЗЫВА */}
      {showReviewAdded && notificationData && (
        <ReviewAddedNotification
          isOpen={showReviewAdded}
          onClose={() => setShowReviewAdded(false)}
          review={notificationData}
        />
      )}

      {/* УВЕДОМЛЕНИЕ О ЛАЙКЕ/ДИЗЛАЙКЕ */}
      {showFeedbackNotification && notificationData && (
        <FeedbackNotification
          isOpen={showFeedbackNotification}
          onClose={() => setShowFeedbackNotification(false)}
          type={notificationData.type}
          reviewAuthor={notificationData.author}
        />
      )}

      {/* УВЕДОМЛЕНИЕ О ДОБАВЛЕНИИ В КОРЗИНУ */}
      {showCartNotification && notificationData && (
        <CartNotification
          isOpen={showCartNotification}
          onClose={() => setShowCartNotification(false)}
          product={notificationData.product}
          size={notificationData.size}
          color={notificationData.color}
        />
      )}

      {/* УВЕДОМЛЕНИЕ О ДОБАВЛЕНИИ В ИЗБРАННОЕ */}
      {showFavoriteNotification && notificationData && (
        <FavoriteAddedNotification
          isOpen={showFavoriteNotification}
          onClose={() => setShowFavoriteNotification(false)}
          product={notificationData.product}
          color={notificationData.color}
        />
      )}
    </>
  );
}