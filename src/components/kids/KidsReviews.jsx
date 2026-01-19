import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { loadReviews, saveReviews } from "../../utils/reviewsStorage";
import { fetchReviews, createReview, updateReview } from "../../utils/reviewsApi";
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
  FaCheck,
  FaUser,
  FaPaperPlane,
  FaImage,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";
// import "./rewiew.css";

/* ================= КОМПОНЕНТ МОДАЛЬНОГО ОКНА ДЛЯ ОТЗЫВОВ ================= */

function KidsLeaveReview({ onClose, onReviewSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    reviewText: "",
    childAge: "",
    imagePreview: null,
    imageFile: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRatingClick = (value) => {
    setFormData(prev => ({ ...prev, rating: value }));
    if (formErrors.rating) {
      setFormErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }

      if (!file.type.match('image.*')) {
        setFormErrors(prev => ({ ...prev, image: "Please select an image file" }));
        return;
      }

      setFormData(prev => ({ ...prev, imageFile: file }));
      setFormErrors(prev => ({ ...prev, image: "" }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imagePreview: null, imageFile: null }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Please enter a valid email";
    if (formData.rating === 0) errors.rating = "Please select a rating";
    if (!formData.reviewText.trim()) errors.reviewText = "Review text is required";
    if (formData.reviewText.length > 2000) errors.reviewText = "Review text is too long (max 2000 characters)";
    if (!formData.childAge.trim()) errors.childAge = "Child's age is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.imagePreview;

      const newReview = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        rating: formData.rating,
        text: formData.reviewText.trim(),
        childAge: formData.childAge.trim(),
        date: "Just now",
        imageUrl,
        isParentReview: true
      };

      onReviewSubmit(newReview);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      setFormErrors(prev => ({ 
        ...prev, 
        submit: "Failed to submit review. Please try again." 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rating: 0,
      reviewText: "",
      childAge: "",
      imagePreview: null,
      imageFile: null
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Leave a Parent Review</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-row">
            <div className="form-group" data-error={!!formErrors.name}>
              <label htmlFor="name" className="form-label">
                Your Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`form-input ${formErrors.name ? 'error' : ''}`}
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>

            <div className="form-group" data-error={!!formErrors.email}>
              <label htmlFor="email" className="form-label">
                Your Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`form-input ${formErrors.email ? 'error' : ''}`}
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>
          </div>

          <div className="form-group" data-error={!!formErrors.childAge}>
            <label htmlFor="childAge" className="form-label">
              Child's Age *
            </label>
            <input
              id="childAge"
              name="childAge"
              type="text"
              placeholder="e.g., 5 years old"
              value={formData.childAge}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`form-input ${formErrors.childAge ? 'error' : ''}`}
            />
            {formErrors.childAge && <span className="error-message">{formErrors.childAge}</span>}
          </div>

          <div className="form-group" data-error={!!formErrors.rating}>
            <label className="form-label">Your Rating *</label>
            <div className="rating-stars-modal">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                  disabled={isSubmitting}
                >
                  {star <= formData.rating ? (
                    <FaStar className="star-filled" />
                  ) : (
                    <FaRegStar className="star-empty" />
                  )}
                </button>
              ))}
              <span className={`rating-text-modal ${formData.rating === 0 ? "is-empty" : ""}`}>
                {formData.rating > 0 ? `${formData.rating} star${formData.rating > 1 ? 's' : ''}` : "Select your rating"}
              </span>
            </div>
            {formErrors.rating && <span className="error-message">{formErrors.rating}</span>}
          </div>

          <div className="form-group" data-error={!!formErrors.reviewText}>
            <label htmlFor="reviewText" className="form-label">
              Your Review *
            </label>
            <textarea
              id="reviewText"
              name="reviewText"
              placeholder="Share your experience with this kids product. How does your child like it? Is it comfortable and durable?"
              value={formData.reviewText}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows="6"
              className={`form-textarea ${formErrors.reviewText ? 'error' : ''}`}
              maxLength="2000"
            />
            {formErrors.reviewText && <span className="error-message">{formErrors.reviewText}</span>}
            <div className="character-count">
              {formData.reviewText.length}/2000 characters
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Photo (Optional)</label>
            {formData.imagePreview ? (
              <div className="image-preview">
                <div className="preview-image-wrapper">
                  <img src={formData.imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-preview-btn"
                    onClick={removeImage}
                    disabled={isSubmitting}
                  >
                    <FaTimes />
                  </button>
                </div>
                <span className="image-hint">Click the X to remove</span>
              </div>
            ) : (
              <div className="image-upload">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="file-input-hidden"
                />
                <label htmlFor="imageUpload" className="upload-area">
                  <FaImage className="upload-icon" />
                  <div className="upload-text">
                    <p>Click to upload photo</p>
                    <p className="upload-hint">JPG, PNG or GIF • Max 5MB</p>
                  </div>
                </label>
              </div>
            )}
            {formErrors.image && <span className="error-message">{formErrors.image}</span>}
          </div>

          {formErrors.submit && (
            <div className="submit-error">
              <span className="error-message">{formErrors.submit}</span>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane className="submit-icon" />
                  Submit Review
                </>
              )}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>

          <div className="form-note">
            <p className="note-text">
              * Required fields. Your email will not be published. Parent reviews help other parents make informed decisions.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= КОМПОНЕНТЫ УВЕДОМЛЕНИЙ ДЛЯ KIDS ================= */

// 1. Уведомление об успешном добавлении отзыва
function KidsReviewAddedNotification({ isOpen, onClose, review }) {
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
            <p className="notification-subtitle">Thank you for sharing your parent experience!</p>
          </div>
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="notification-body">
          <div className="review-preview">
            <div className="reviewer-avatar">
              <span className="avatar-initials">
                {review.name.charAt(0).toUpperCase()}
              </span>
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
                <span className="review-author">{review.name}</span>
                <span className="review-child-age">Child: {review.childAge}</span>
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

// 2. Уведомление о добавлении в корзину (kids version)
function KidsCartAddedNotification({ isOpen, onClose, product, size, color, quantity = 1 }) {
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
            <p className="notification-subtitle">Perfect choice for your child!</p>
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
                      style={{ 
                        backgroundColor: color === 'black' ? '#000' : 
                                     color === 'white' ? '#fff' : 
                                     color === 'blue' ? '#3b82f6' : 
                                     color === 'green' ? '#10b981' :
                                     color === 'red' ? '#ef4444' : '#000' 
                      }}
                    />
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </span>
                )}
                {size && (
                  <span className="cart-product-size">
                    <span>Size:</span> {size}
                  </span>
                )}
                {quantity > 1 && (
                  <span className="cart-product-qty">
                    <span>Qty:</span> {quantity}
                  </span>
                )}
              </div>
              <div className="cart-product-price">
                ${product.price.toFixed(2)} × {quantity} = ${(product.price * quantity).toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="notification-actions">
            <button className="notification-btn continue" onClick={handleClose}>
              Continue Shopping
            </button>
            <button className="notification-btn view-cart" onClick={handleClose}>
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Уведомление о добавлении в избранное (kids version)
function KidsFavoriteAddedNotification({ isOpen, onClose, product }) {
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
      <div className={`notification favorite-added ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <div className="notification-icon-circle">
            <span className="notification-icon">❤️</span>
          </div>
          <div className="notification-titles">
            <h3 className="notification-title">Added to Kids' Wishlist</h3>
            <p className="notification-subtitle">Great choice for your little one!</p>
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
              <p className="cart-product-price">${product.price.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="notification-actions">
            <button className="notification-btn continue" onClick={handleClose}>
              Continue Shopping
            </button>
            <button className="notification-btn view-wishlist" onClick={handleClose}>
              View Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Уведомление о выборе размера для kids
function KidsSizeWarningNotification({ isOpen, onClose, onSizeSelect }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isHiding, setIsHiding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsHiding(false);
      setSelectedSize(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleConfirm = () => {
    if (selectedSize && onSizeSelect) {
      onSizeSelect(selectedSize);
    }
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="notification-container">
      <div className={`notification size-warning ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <div className="notification-icon-circle warning">
            <span className="notification-icon">👕</span>
          </div>
          <div className="notification-titles">
            <h3 className="notification-title">Select Size for Kids</h3>
            <p className="notification-subtitle">Please choose the right size for your child</p>
          </div>
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="notification-body">
          <div className="size-options-grid">
            {["XS (2-4Y)", "S (4-6Y)", "M (6-8Y)", "L (8-10Y)", "XL (10-12Y)"].map(size => (
              <button
                key={size}
                className={`size-option-btn ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          
          <div className="size-guide-note">
            <p>💡 <strong>Size Tip:</strong> Consider choosing one size larger for growing kids.</p>
          </div>
          
          <div className="notification-actions">
            <button className="notification-btn cancel" onClick={handleClose}>
              Cancel
            </button>
            <button 
              className="notification-btn confirm" 
              onClick={handleConfirm}
              disabled={!selectedSize}
            >
              Confirm Size
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= ФУНКЦИИ ДЛЯ РАБОТЫ С ХРАНИЛИЩЕМ ================= */

const addToCartFromReviews = (product, size, color, quantity = 1) => {
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
    quantity: quantity,
    color: color,
    imageUrl: product.avatar || "",
    variant: product.kategory || "Kids",
    timestamp: Date.now(),
    category: "kids"
  };
  
  const existingItemIndex = existingCart.findIndex(cartItem => 
    cartItem.productId === item.productId && 
    cartItem.size === item.size && 
    cartItem.color === item.color &&
    cartItem.category === "kids"
  );
  
  if (existingItemIndex !== -1) {
    existingCart[existingItemIndex].quantity += quantity;
  } else {
    existingCart.push(item);
  }
  
  localStorage.setItem('cart', JSON.stringify(existingCart));
  window.dispatchEvent(new Event('cartUpdated'));
  
  return item;
};

const toggleFavorite = (product, color) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  const favoriteItem = {
    id: Date.now(),
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.avatar,
    color: color,
    timestamp: Date.now(),
    category: "kids"
  };

  const existingIndex = favorites.findIndex(fav => 
    fav.productId === favoriteItem.productId && 
    fav.color === favoriteItem.color &&
    fav.category === "kids"
  );
  
  let isAdded = false;
  
  if (existingIndex === -1) {
    favorites.push(favoriteItem);
    isAdded = true;
  } else {
    favorites.splice(existingIndex, 1);
    isAdded = false;
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  window.dispatchEvent(new Event('favoritesUpdated'));
  
  return { isAdded, item: favoriteItem };
};

/* ================= КОМПОНЕНТ ОТЗЫВОВ ДЛЯ KIDS ================= */

const allReviewsData = [
  // Страница 1
  {
    id: 1,
    name: "Emma Johnson",
    date: "July 15, 2020",
    rating: 5,
    text: "My 5-year-old loves this jacket! The quality is excellent and it's very comfortable. Perfect for playground adventures.",
    likes: 8,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-07-15").getTime(),
    childAge: "5 years",
    isParentReview: true
  },
  {
    id: 2,
    name: "Sophia Williams",
    date: "1 day ago",
    rating: 0,
    text: "@Emma Johnson My daughter has the same one! It washes really well and keeps its color.",
    likes: 3,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
    isReply: true,
    timestamp: new Date().getTime() - 86400000,
    childAge: "4 years",
    isParentReview: true
  },
  {
    id: 3,
    name: "Michael Brown",
    date: "July 7, 2020",
    rating: 4,
    text: "Great kids jacket! The material is soft and durable. My son wears it every day to school.",
    likes: 5,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-07-07").getTime(),
    childAge: "7 years",
    isParentReview: true
  },
  {
    id: 4,
    name: "Olivia Davis",
    date: "June 28, 2020",
    rating: 5,
    text: "Perfect fit and amazing quality! The colors are vibrant and it's very easy to clean. Highly recommend for active kids.",
    likes: 12,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-28").getTime(),
    childAge: "6 years",
    isParentReview: true
  },
  // Страница 2
  {
    id: 5,
    name: "James Wilson",
    date: "June 20, 2020",
    rating: 4,
    text: "Good quality hoodie for kids! The material is breathable and perfect for all seasons.",
    likes: 7,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-20").getTime(),
    childAge: "8 years",
    isParentReview: true
  },
  {
    id: 6,
    name: "Ava Miller",
    date: "June 18, 2020",
    rating: 3,
    text: "The jacket is nice but runs a bit small. I would recommend ordering one size up for growing kids.",
    likes: 4,
    dislikes: 2,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-18").getTime(),
    childAge: "5 years",
    isParentReview: true
  },
  {
    id: 7,
    name: "William Taylor",
    date: "June 15, 2020",
    rating: 5,
    text: "Absolutely love it! The green color is beautiful and it's very warm. My daughter won't take it off!",
    likes: 15,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-15").getTime(),
    childAge: "4 years",
    isParentReview: true
  },
  {
    id: 8,
    name: "Isabella Anderson",
    date: "June 10, 2020",
    rating: 5,
    text: "Best kids clothing purchase! The jacket is super comfortable and stylish. Perfect for school and playdates.",
    likes: 9,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-10").getTime(),
    childAge: "6 years",
    isParentReview: true
  },
  // Страница 3
  {
    id: 9,
    name: "Benjamin Thomas",
    date: "June 5, 2020",
    rating: 4,
    text: "Very nice kids jacket. Good value for the price. My son loves the different color options.",
    likes: 6,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-05").getTime(),
    childAge: "7 years",
    isParentReview: true
  },
  {
    id: 10,
    name: "Mia Jackson",
    date: "June 1, 2020",
    rating: 2,
    text: "The material is thinner than expected for winter wear. Good for spring/fall but not for cold weather.",
    likes: 2,
    dislikes: 5,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-01").getTime(),
    childAge: "5 years",
    isParentReview: true
  },
  {
    id: 11,
    name: "Daniel White",
    date: "May 25, 2020",
    rating: 5,
    text: "Excellent kids product! Fits perfectly and the quality is outstanding. Would definitely buy again!",
    likes: 11,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-05-25").getTime(),
    childAge: "8 years",
    isParentReview: true
  },
  {
    id: 12,
    name: "Charlotte Harris",
    date: "May 20, 2020",
    rating: 3,
    text: "Decent jacket for the price. Colors are nice but the zipper could be better quality.",
    likes: 3,
    dislikes: 2,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-05-20").getTime(),
    childAge: "6 years",
    isParentReview: true
  }
];

const REVIEWS_PER_PAGE = 4;

const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  HIGHEST_RATING: "highest rating",
  LOWEST_RATING: "lowest rating",
  MOST_LIKES: "most likes",
  MOST_DISLIKES: "most dislikes"
};

export default function KidsReviews() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://6947cef21ee66d04a44dfb36.mockapi.io/kids/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const basePrice = Number(data.price?.replace("$", "") || data.price) || 0;
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

  return <KidsReviewsContent product={product} />;
}

function KidsReviewsContent({ product }) {
  const [reviews, setReviews] = useState(() =>
    loadReviews({ category: "kids", productId: product.id, fallback: allReviewsData })
  );

  useEffect(() => {
    setReviews(loadReviews({ category: "kids", productId: product.id, fallback: allReviewsData }));
  }, [product.id]);

  useEffect(() => {
    saveReviews({ category: "kids", productId: product.id, reviews });
  }, [product.id, reviews]);

  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [currentPage, setCurrentPage] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const [showReviewAdded, setShowReviewAdded] = useState(false);
  const [showCartAdded, setShowCartAdded] = useState(false);
  const [showFavoriteAdded, setShowFavoriteAdded] = useState(false);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  
  const [notificationData, setNotificationData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const colorMap = useMemo(() => {
    return [
      { name: "black", label: "Black", src: product.avatar },
      { name: "white", label: "White", src: product.avatarwhite },
      { name: "blue", label: "Blue", src: product.avatarblue },
      { name: "green", label: "Green", src: product.avatargreen },
    ].filter((c) => c.src);
  }, [product]);

  const slides = useMemo(() => {
    if (!colorMap.length) return [];
    const images = colorMap.map((c) => c.src);
    return [images[images.length - 1], ...images, images[0]];
  }, [colorMap]);

  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSize, setActiveSize] = useState("S");

  const activeColorName = useMemo(() => {
    if (index === 0) return colorMap[colorMap.length - 1]?.name;
    if (index === slides.length - 1) return colorMap[0]?.name;
    return colorMap[index - 1]?.name;
  }, [index, colorMap, slides.length]);

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

  const currentReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    return sortedReviews.slice(startIndex, endIndex);
  }, [sortedReviews, currentPage]);

  const handleLike = (reviewId) => {
    setReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id === reviewId) {
          if (review.userLiked) {
            return {
              ...review,
              likes: review.likes - 1,
              userLiked: false
            };
          } else {
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

    const target = reviews.find(r => String(r.id) === String(reviewId));
    if (target) {
      const next = target.userLiked
        ? { likes: Math.max(0, (target.likes || 0) - 1), userLiked: false, userDisliked: target.userDisliked }
        : {
            likes: (target.likes || 0) + 1,
            dislikes: target.userDisliked ? Math.max(0, (target.dislikes || 0) - 1) : (target.dislikes || 0),
            userLiked: true,
            userDisliked: false,
          };
      updateReview({ category: "kids", reviewId, patch: { ...target, ...next } }).catch(() => {});
    }
  };

  const handleDislike = (reviewId) => {
    setReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id === reviewId) {
          if (review.userDisliked) {
            return {
              ...review,
              dislikes: review.dislikes - 1,
              userDisliked: false
            };
          } else {
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

    const target = reviews.find(r => String(r.id) === String(reviewId));
    if (target) {
      const next = target.userDisliked
        ? { dislikes: Math.max(0, (target.dislikes || 0) - 1), userDisliked: false, userLiked: target.userLiked }
        : {
            dislikes: (target.dislikes || 0) + 1,
            likes: target.userLiked ? Math.max(0, (target.likes || 0) - 1) : (target.likes || 0),
            userLiked: false,
            userDisliked: true,
          };
      updateReview({ category: "kids", reviewId, patch: { ...target, ...next } }).catch(() => {});
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      const reviewsElement = document.querySelector('.reviews-list');
      if (reviewsElement) {
        reviewsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    document.body.style.overflow = 'auto';
  };

  const handleReviewSubmit = (newReview) => {
    const reviewToAdd = {
      ...newReview,
      id: Date.now(),
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      userLiked: false,
      userDisliked: false,
      isParentReview: true
    };
    
    setReviews(prevReviews => [reviewToAdd, ...prevReviews]);
    setCurrentPage(1);
    
    setNotificationData(reviewToAdd);
    setShowReviewAdded(true);
    
    handleCloseReviewModal();

    createReview({ category: "kids", productId: product.id, review: reviewToAdd })
      .then((created) => {
        if (!created?.id) return;
        setReviews(prev => prev.map(r => (r.id === reviewToAdd.id ? created : r)));
      })
      .catch(() => {});
  };

  const handleSlideChange = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex(newIndex);
  };

  const onTransitionEnd = () => {
    setIsAnimating(false);
    
    if (index === 0) {
      setIndex(slides.length - 2);
    }
    if (index === slides.length - 1) {
      setIndex(1);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      if (newQuantity >= 1 && newQuantity <= 10) {
        return newQuantity;
      }
      return prev;
    });
  };

  const handleAddToCart = () => {
    if (!activeSize) {
      setShowSizeWarning(true);
      return;
    }

    const addedItem = addToCartFromReviews(product, activeSize, activeColorName, quantity);
    
    setNotificationData({
      product: product,
      size: activeSize,
      color: activeColorName,
      quantity: quantity
    });
    setShowCartAdded(true);
  };

  const handleToggleFavorite = () => {
    const { isAdded } = toggleFavorite(product, activeColorName);
    setIsFavorite(isAdded);
    
    if (isAdded) {
      setNotificationData({
        product: product
      });
      setShowFavoriteAdded(true);
    }
  };

  const handleSizeSelectFromNotification = (selectedSize) => {
    setActiveSize(selectedSize);
    
    setTimeout(() => {
      const addedItem = addToCartFromReviews(product, selectedSize, activeColorName, quantity);
      
      setNotificationData({
        product: product,
        size: selectedSize,
        color: activeColorName,
        quantity: quantity
      });
      setShowCartAdded(true);
    }, 300);
  };

  const { statsData, totalRating } = useMemo(() => {
    const ratings = reviews.filter(r => r.rating > 0).map(r => r.rating);
    const totalRatings = ratings.length;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(rating => {
      ratingDistribution[rating]++;
    });
    
    const stats = [5, 4, 3, 2, 1].map(stars => {
      const count = ratingDistribution[stars];
      const percentage = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
      
      const colors = ["#20c997", "#5eead4", "#ffc107", "#fd7e14", "#dc3545"];
      
      return {
        stars,
        count,
        percentage,
        color: colors[5 - stars]
      };
    });
    
    const average = totalRatings > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / totalRatings).toFixed(1)
      : "0.0";
    
    const recommendedCount = reviews.filter(r => r.rating >= 4).length;
    const recommendationPercentage = Math.round((recommendedCount / reviews.length) * 100);
    
    return {
      statsData: stats,
      totalRating: {
        average,
        recommendedCount,
        recommendationPercentage,
        total: reviews.length
      }
    };
  }, [reviews]);

  return (
    <>
      <div className="product-page-wrapper">
        <div className="container">
          <div className="product-layout">
            {/* ЛЕВАЯ КОЛОНКА: ОТЗЫВЫ */}
            <div className="text-info-column">
              <h2 className="reviews-main-title">{totalRating.total} Parent Reviews</h2>

              <div className="reviews-summary-box">
                <div className="rating-overview">
                  <span className="rating-number">{totalRating.average}</span>
                  <div className="rating-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="star-icon">
                        {i < Math.floor(parseFloat(totalRating.average)) ? 
                          <FaStar /> : <FaRegStar />}
                      </span>
                    ))}
                  </div>
                  <p className="recommend-text">
                    {totalRating.recommendedCount} out of {totalRating.total} ({totalRating.recommendationPercentage}%) <br />
                    <span className="recommend-sub">Parents recommend this product</span>
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

              <div className="reviews-actions-row">
                <button 
                  className="leave-review-btn"
                  onClick={handleOpenReviewModal}
                >
                  Leave a Parent Review
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

              <div className="reviews-list">
                {currentReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className={`review-item ${review.isReply ? 'is-reply' : ''}`}
                  >
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar-small">
                          <span className="avatar-initials-small">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="reviewer-name">{review.name}</h4>
                          {review.childAge && (
                            <span className="review-child-badge">Child: {review.childAge}</span>
                          )}
                          <span className="review-date">{review.date}</span>
                        </div>
                      </div>
                      
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
                          onClick={() => handleLike(review.id)}
                        >
                          <FaThumbsUp /> {review.likes}
                        </button>
                        <button 
                          className={`dislike-btn-small ${review.userDisliked ? "active" : ""}`}
                          onClick={() => handleDislike(review.id)}
                        >
                          <FaThumbsDown /> {review.dislikes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="reviews-pagination">
                  <button 
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>
                  
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
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                  
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </div>

            {/* ПРАВАЯ КОЛОНКА: КАРТОЧКА ТОВАРА */}
            <div className="sticky-card-column">
              <div className="card-exact">
                <div className="image-wrapper-exact">
                  {product.hasDiscount && (
                    <div className="badge-exact">-{product.discount}%</div>
                  )}

                  <div className="img-container viewport">
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

                    <button 
                      className="slider-btn right" 
                      onClick={() => handleSlideChange(index + 1)}
                    >
                      ›
                    </button>
                  </div>

                  <button 
                    className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
                    onClick={handleToggleFavorite}
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>

                <div className="card-body-exact">
                  <p className="category-text">Kids Collection</p>
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
                        {["XS (2-4Y)", "S (4-6Y)", "M (6-8Y)", "L (8-10Y)", "XL (10-12Y)"].map((s) => (
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

                    <div className="selector-group">
                      <label className="selector-label">Quantity:</label>
                      <div className="quantity-selector">
                        <button 
                          className="qty-btn minus" 
                          onClick={() => handleQuantityChange(-1)} 
                          disabled={quantity <= 1}
                        >
                          −
                        </button>
                        <span className="qty-display">{quantity}</span>
                        <button 
                          className="qty-btn plus" 
                          onClick={() => handleQuantityChange(1)} 
                          disabled={quantity >= 10}
                        >
                          +
                        </button>
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

      {showReviewModal && (
        <KidsLeaveReview
          onClose={handleCloseReviewModal}
          onReviewSubmit={handleReviewSubmit}
        />
      )}

      {showReviewAdded && notificationData && (
        <KidsReviewAddedNotification
          isOpen={showReviewAdded}
          onClose={() => setShowReviewAdded(false)}
          review={notificationData}
        />
      )}

      {showCartAdded && notificationData && (
        <KidsCartAddedNotification
          isOpen={showCartAdded}
          onClose={() => setShowCartAdded(false)}
          product={notificationData.product}
          size={notificationData.size}
          color={notificationData.color}
          quantity={notificationData.quantity}
        />
      )}

      {showFavoriteAdded && notificationData && (
        <KidsFavoriteAddedNotification
          isOpen={showFavoriteAdded}
          onClose={() => setShowFavoriteAdded(false)}
          product={notificationData.product}
        />
      )}

      {showSizeWarning && (
        <KidsSizeWarningNotification
          isOpen={showSizeWarning}
          onClose={() => setShowSizeWarning(false)}
          onSizeSelect={handleSizeSelectFromNotification}
        />
      )}
    </>
  );
}