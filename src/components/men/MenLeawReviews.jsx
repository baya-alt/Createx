import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaStar, FaRegStar, FaTimes, FaImage } from "react-icons/fa";
// import "./MenLeaveReview.css";

export default function MenLeaveReview({ onClose, onReviewSubmit }) {
  const formRef = useRef();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    review: ""
  });

  // Vite-safe env access (avoid "process is not defined" in browser)
  const ENV = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : {};

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка размера файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Проверка типа файла
      if (!file.type.match('image.*')) {
        alert("Please select an image file");
        return;
      }

      setImageFile(file);
      
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateReviewId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!formData.name || !formData.email || !formData.review) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";
      
      // Если есть изображение, загружаем его (в реальном приложении)
      if (imageFile) {
        // Здесь должна быть реальная загрузка на сервер
        // Для демо используем локальный URL
        imageUrl = imagePreview;
      }

      // Создаем новый отзыв
      const newReview = {
        id: generateReviewId(),
        name: formData.name,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        rating: rating,
        text: formData.review,
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
        timestamp: Date.now()
      };

      // Отправка через EmailJS (опционально, не блокируем UI если env не настроены)
      // Для Vite используйте переменные: VITE_EMAILJS_SERVICE_ID / VITE_EMAILJS_TEMPLATE_ID / VITE_EMAILJS_PUBLIC_KEY
      const serviceId = ENV.VITE_EMAILJS_SERVICE_ID;
      const templateId = ENV.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = ENV.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        const templateParams = {
          name: formData.name,
          email: formData.email,
          rating: rating,
          review: formData.review,
          image_url: imageUrl,
          date: newReview.date
        };

        await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
        );
      }

      // Передаем новый отзыв родительскому компоненту
      if (onReviewSubmit) {
        onReviewSubmit(newReview);
      }

      alert("Thank you! Your review has been submitted successfully! 😊");
      
      // Сброс формы
      setRating(0);
      setFormData({
        name: "",
        email: "",
        review: ""
      });
      setImagePreview(null);
      setImageFile(null);
      
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <div className="review-modal-header">
          <h2>Leave a Review</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
              disabled={loading}
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              disabled={loading}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Your Rating *</label>
            <div className="rating-stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-btn"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={loading}
                >
                  {star <= (hoverRating || rating) ? (
                    <FaStar className="star-filled" />
                  ) : (
                    <FaRegStar className="star-empty" />
                  )}
                </button>
              ))}
              <span className="rating-text-men">
                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : "Select your rating"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review">Your Review *</label>
            <textarea
              id="review"
              name="review"
              placeholder="Share your experience with this product..."
              required
              rows="5"
              disabled={loading}
              value={formData.review}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Photo (Optional)</label>
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={removeImage}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="image-upload-placeholder">
                  <FaImage className="upload-icon" />
                  <p>Drag & drop or click to upload</p>
                  <p className="upload-hint">Max 5MB • JPG, PNG, GIF</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="file-input"
                  />
                  <label htmlFor="image" className="upload-btn">
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || rating === 0}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
        {/* Local style to avoid global .rating-text from Orders.css affecting this modal */}
        <style>{`
          .rating-text-men {
            display: inline-block;
            margin-left: 12px;
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid #e5e8ed;
            background: #f8f9fa;
            color: #787a80;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.2;
          }
        `}</style>
      </div>
    </div>
  );
}