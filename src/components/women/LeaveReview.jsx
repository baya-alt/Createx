import React, { useState } from "react";
import { 
  FaStar, 
  FaRegStar, 
  FaImage, 
  FaPaperPlane,
  FaTimes,
  FaUserCircle
} from "react-icons/fa";
import "./LeaveReview.css";

export default function LeaveReview({ onReviewSubmit, onCancel, currentUser }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Если передали currentUser, используем его данные
  const userName = currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : "");
  const userEmail = currentUser?.email || "";
  const userAvatar = currentUser?.avatar || null;

  const handleRatingClick = (value) => {
    setRating(value);
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка размера файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          image: "Image size should be less than 5MB" 
        }));
        return;
      }

      // Проверка типа файла
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ 
          ...prev, 
          image: "Please select an image file (JPG, PNG, GIF)" 
        }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: "" }));
      
      // Создаем preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) newErrors.rating = "Please select a rating";
    if (!reviewText.trim()) newErrors.reviewText = "Review text is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Прокручиваем к первой ошибке
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = "";
      
      // Если есть изображение, загружаем его на ImgBB
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        
        // Загрузка на ImgBB (замените ключ на ваш реальный)
        // Для тестирования можно оставить пустую строку
        // const imgbbResponse = await fetch("https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY", {
        //   method: "POST",
        //   body: formData
        // });
        
        // const imgbbData = await imgbbResponse.json();
        // if (imgbbData.success) {
        //   imageUrl = imgbbData.data.url;
        // }
        imageUrl = ""; // Временно
      }

      // Создаем объект отзыва
      const newReview = {
        id: Date.now(),
        name: userName,
        email: userEmail,
        rating,
        text: reviewText.trim(),
        date: "Just now",
        timestamp: Date.now(),
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
        imageUrl,
        avatar: userAvatar
      };

      console.log("Submitting review from LeaveReview:", newReview);
      
      // Вызываем колбэк с новым отзывом
      if (onReviewSubmit) {
        onReviewSubmit(newReview);
      } else {
        console.error("onReviewSubmit callback is not provided!");
      }

      // Сбрасываем форму
      resetForm();
      
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors(prev => ({ 
        ...prev, 
        submit: "Failed to submit review. Please try again." 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setReviewText("");
    setImagePreview(null);
    setImageFile(null);
    setErrors({});
  };

  const handleCancel = () => {
    console.log("Canceling review form");
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="leave-review-inline">
      <div className="review-form-header">
        <h3>Write Your Review</h3>
        <p className="review-form-subtitle">Share your experience with this product</p>
      </div>

      {/* Информация о пользователе */}
      {currentUser && (
        <div className="user-info-header">
          <div className="user-avatar">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} />
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div className="user-details">
            <h4 className="user-name">{userName}</h4>
            <p className="user-email">{userEmail}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="review-form-inline">
        <div className="form-group-inline" data-error={!!errors.rating}>
          <label className="form-label">Your Rating *</label>
          <div className="rating-stars-inline">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn-inline ${star <= (hoverRating || rating) ? 'active' : ''}`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                disabled={isSubmitting}
              >
                {star <= (hoverRating || rating) ? (
                  <FaStar className="star-filled" />
                ) : (
                  <FaRegStar className="star-empty" />
                )}
              </button>
            ))}
            <span className="rating-text-inline">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : "Select your rating"}
            </span>
          </div>
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>

        <div className="form-group-inline" data-error={!!errors.reviewText}>
          <label htmlFor="reviewText" className="form-label">
            Your Review *
          </label>
          <textarea
            id="reviewText"
            placeholder="Share your detailed experience with this product. What did you like or dislike? How does it fit? How's the quality?"
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
              if (errors.reviewText) setErrors(prev => ({ ...prev, reviewText: "" }));
            }}
            disabled={isSubmitting}
            rows="6"
            className={`form-textarea ${errors.reviewText ? 'error' : ''}`}
            maxLength="2000"
          />
          {errors.reviewText && <span className="error-message">{errors.reviewText}</span>}
          <div className="character-count">
            {reviewText.length}/2000 characters
          </div>
        </div>

        <div className="form-group-inline">
          <label className="form-label">Upload Photo (Optional)</label>
          {imagePreview ? (
            <div className="image-preview-inline">
              <div className="preview-image-wrapper">
                <img src={imagePreview} alt="Preview" />
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
            <div className="image-upload-inline">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="file-input-hidden"
              />
              <label htmlFor="imageUpload" className="upload-area">
                <FaImage className="upload-icon-large" />
                <div className="upload-text">
                  <p>Click to upload photo</p>
                  <p className="upload-hint-small">JPG, PNG or GIF • Max 5MB</p>
                </div>
              </label>
            </div>
          )}
          {errors.image && <span className="error-message">{errors.image}</span>}
        </div>

        {errors.submit && (
          <div className="submit-error">
            <span className="error-message">{errors.submit}</span>
          </div>
        )}

        <div className="form-actions-inline">
          <button 
            type="submit" 
            className="submit-btn-inline"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
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
            className="cancel-btn-inline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>

        <div className="form-note">
          <p className="note-text">
            * Required fields. Your email will not be published.
          </p>
        </div>
      </form>
    </div>
  );
}