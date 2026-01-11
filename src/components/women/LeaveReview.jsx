import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaStar, FaRegStar, FaTimes, FaImage } from "react-icons/fa";
import "./LeaveReview.css";

export default function LeaveReview({ onClose }) {
  const formRef = useRef();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleRatingClick = (value) => {
    setRating(value);
    // Устанавливаем скрытое поле для рейтинга
    const ratingInput = document.querySelector('input[name="rating"]');
    if (ratingInput) {
      ratingInput.value = value;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      
      // Если есть изображение, загружаем его на ImgBB
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        
        // Загрузка на ImgBB (бесплатный сервис)
        const imgbbResponse = await fetch("https://api.imgbb.com/1/upload?key=3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d", {
          method: "POST",
          body: formData
        });
        
        const imgbbData = await imgbbResponse.json();
        if (imgbbData.success) {
          imageUrl = imgbbData.data.url;
        }
      }

      // Подготавливаем данные для EmailJS
      const formData = new FormData(formRef.current);
      const templateParams = {
        name: formData.get("name"),
        email: formData.get("email"),
        rating: formData.get("rating") || rating,
        review: formData.get("review"),
        image_url: imageUrl,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      };

      // Отправка через EmailJS
      await emailjs.send(
        "service_3xr5mic",
        "template_c9iwede",
        templateParams,
        "wsSENBngvAWsgS0zB"
      );

      alert("Thank you! Your review has been submitted successfully! 😊");
      formRef.current.reset();
      setImagePreview(null);
      setImageFile(null);
      setRating(0);
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
          <input type="hidden" name="rating" value={rating} />

          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
              disabled={loading}
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
              <span className="rating-text">
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
      </div>
    </div>
  );
}