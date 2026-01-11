import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaStar, FaRegStar, FaTimes, FaImage, FaChild } from "react-icons/fa";
// import "./KidsLeaveReviews.css";

export default function KidsLeaveReviews({ onClose }) {
  const formRef = useRef();
  const fileInputRef = useRef();
  const parentNameRef = useRef();
  const emailRef = useRef();
  const childNameRef = useRef();
  const reviewRef = useRef();
  
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [childAge, setChildAge] = useState("");
  const [childGender, setChildGender] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!parentNameRef.current?.value.trim()) {
      errors.parentName = "Parent name is required";
    }
    
    if (!emailRef.current?.value.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(emailRef.current.value)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!childAge) {
      errors.childAge = "Child's age is required";
    }
    
    if (rating === 0) {
      errors.rating = "Please select a rating";
    }
    
    if (!reviewRef.current?.value.trim()) {
      errors.review = "Review is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRatingClick = (value) => {
    setRating(value);
    if (formErrors.rating) {
      setFormErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка размера файла
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Проверка типа файла
    if (!file.type.match('image.*')) {
      alert("Please select an image file (JPG, PNG, GIF)");
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      alert("Error reading image file");
    };
    reader.readAsDataURL(file);
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
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      let imageUrl = "";
      
      // Загрузка изображения если есть
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("image", imageFile);
          
          const imgbbResponse = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY'}`,
            {
              method: "POST",
              body: formData
            }
          );
          
          if (!imgbbResponse.ok) {
            throw new Error("Image upload failed");
          }
          
          const imgbbData = await imgbbResponse.json();
          if (imgbbData.success) {
            imageUrl = imgbbData.data.url;
          }
        } catch (imageError) {
          console.warn("Image upload failed, continuing without image:", imageError);
          // Продолжаем без изображения
        }
      }

      const templateParams = {
        parent_name: parentNameRef.current.value,
        email: emailRef.current.value,
        child_name: childNameRef.current?.value || "Not specified",
        child_age: childAge,
        child_gender: childGender || "Not specified",
        rating: rating,
        review: reviewRef.current.value,
        image_url: imageUrl || "No image uploaded",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        timestamp: new Date().toISOString(),
        product_type: "Kids Product"
      };

      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY"
      );

      alert("Thank you! Your review has been submitted successfully! 👶✨");
      
      // Сброс формы
      formRef.current.reset();
      setImagePreview(null);
      setImageFile(null);
      setRating(0);
      setChildAge("");
      setChildGender("");
      setFormErrors({});
      
      onClose?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(`Failed to submit review. ${error.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAgeChange = (e) => {
    setChildAge(e.target.value);
    if (formErrors.childAge) {
      setFormErrors(prev => ({ ...prev, childAge: "" }));
    }
  };

  return (
    <div className="kids-review-modal-overlay">
      <div className="kids-review-modal">
        <div className="review-modal-header kids-header">
          <FaChild className="kids-icon" />
          <h2>Kids Product Review</h2>
          <button 
            type="button" 
            className="close-btn" 
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="kids-review-form" noValidate>
          <div className="form-section">
            <h3 className="section-title">👨‍👩‍👧‍👦 Parent Information</h3>
            
            <div className="form-group">
              <label htmlFor="parent_name">Your Name *</label>
              <input
                ref={parentNameRef}
                id="parent_name"
                name="parent_name"
                type="text"
                placeholder="Enter your full name"
                required
                disabled={loading}
                aria-invalid={!!formErrors.parentName}
                aria-describedby={formErrors.parentName ? "parentName-error" : undefined}
              />
              {formErrors.parentName && (
                <span id="parentName-error" className="error-message">{formErrors.parentName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email *</label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                disabled={loading}
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {formErrors.email && (
                <span id="email-error" className="error-message">{formErrors.email}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">👶 Child Information</h3>
            
            <div className="form-group">
              <label htmlFor="child_name">Child's Name (Optional)</label>
              <input
                ref={childNameRef}
                id="child_name"
                name="child_name"
                type="text"
                placeholder="Enter child's first name"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="child_age">Child's Age *</label>
                <select
                  id="child_age"
                  value={childAge}
                  onChange={handleAgeChange}
                  required
                  disabled={loading}
                  aria-invalid={!!formErrors.childAge}
                  aria-describedby={formErrors.childAge ? "childAge-error" : undefined}
                >
                  <option value="">Select age range</option>
                  <option value="0-1">0-1 year</option>
                  <option value="1-2">1-2 years</option>
                  <option value="2-3">2-3 years</option>
                  <option value="3-4">3-4 years</option>
                  <option value="4-6">4-6 years</option>
                  <option value="6-8">6-8 years</option>
                  <option value="8-10">8-10 years</option>
                  <option value="10-12">10-12 years</option>
                  <option value="12+">12+ years</option>
                </select>
                {formErrors.childAge && (
                  <span id="childAge-error" className="error-message">{formErrors.childAge}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="child_gender">Child's Gender (Optional)</label>
                <select
                  id="child_gender"
                  value={childGender}
                  onChange={(e) => setChildGender(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select if you'd like to share</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">⭐ Product Review</h3>
            
            <div className="form-group">
              <label>Your Rating *</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={loading}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    {star <= (hoverRating || rating) ? (
                      <FaStar className="star-filled" />
                    ) : (
                      <FaRegStar className="star-empty" />
                    )}
                  </button>
                ))}
                <span className="rating-value">
                  {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : "Click stars to rate"}
                </span>
              </div>
              {formErrors.rating && (
                <span className="error-message">{formErrors.rating}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="review">Your Review *</label>
              <textarea
                ref={reviewRef}
                id="review"
                name="review"
                placeholder="Share your experience with this kids product...
• How does it fit?
• Is it comfortable for your child?
• How is the quality and durability?
• Would you recommend it to other parents?"
                required
                rows="6"
                disabled={loading}
                aria-invalid={!!formErrors.review}
                aria-describedby={formErrors.review ? "review-error" : undefined}
              />
              {formErrors.review && (
                <span id="review-error" className="error-message">{formErrors.review}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="image">📸 Upload Photo (Optional)</label>
              <div className="image-upload-area">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={removeImage}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <FaImage className="upload-icon" />
                    <p>Upload a photo of your child using the product</p>
                    <p className="upload-note">Max 5MB • JPG, PNG, GIF</p>
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
                    <label htmlFor="image" className="upload-button">
                      Choose Photo
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className="submit-button primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <FaChild /> Submit Kids Review
                </>
              )}
            </button>
            <button 
              type="button" 
              className="submit-button secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          
          <div className="form-disclaimer">
            <p>Your review will be published after moderation. We respect your privacy and will never share your child's personal information.</p>
          </div>
        </form>
      </div>
    </div>
  );
}