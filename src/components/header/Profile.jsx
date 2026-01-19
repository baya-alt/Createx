import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function Profile({ user, onClose, onLogout }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profilePhoto, setProfilePhoto] = useState(() => {
    return user?.id ? localStorage.getItem(`profilePhoto_${user.id}`) : null;
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const savedPhoto = localStorage.getItem(`profilePhoto_${user.id}`);
      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      }
    }
  }, [user?.id]);

  if (!user) {
    return (
      <div className="profile-overlay" onClick={onClose}>
        <div className="profile-modal" onClick={e => e.stopPropagation()}>
          <button className="profile-close" onClick={onClose}>×</button>
          <div className="profile-error">
            <div className="error-icon">👤</div>
            <p>Please log in to view profile</p>
            <button className="profile-btn primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Функция для получения имени пользователя
  const getUserName = () => {
    if (user.name) return user.name;
    if (user.firstName) return user.firstName;
    if (user.email) return user.email.split('@')[0];
    return "User";
  };

  // Функция для получения первой буквы имени
  const getInitial = () => {
    const name = getUserName();
    if (name && typeof name === 'string' && name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // ✅ Функция для безопасного получения ID как строки
  const getUserId = () => {
    if (!user.id) return "N/A";
    
    // Если id это число, конвертируем в строку
    if (typeof user.id === 'number') {
      return user.id.toString().slice(-8);
    }
    
    // Если id это строка, используем slice
    if (typeof user.id === 'string') {
      return user.id.slice(-8);
    }
    
    return "N/A";
  };

  // Обработчик загрузки фото
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    setLoading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setProfilePhoto(base64String);
      
      // Сохраняем фото в localStorage
      if (user.id) {
        localStorage.setItem(`profilePhoto_${user.id}`, base64String);
      }
      
      setLoading(false);
    };
    
    reader.onerror = () => {
      alert('Error reading file');
      setLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Удаление фото профиля
  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    if (user.id) {
      localStorage.removeItem(`profilePhoto_${user.id}`);
    }
  };


  const handleSaveName = () => {
    if (editedName.trim() && editedName !== user.name) {
      
      const updatedUser = { ...user, name: editedName.trim() };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
    }
    setIsEditingName(false);
  };

 
  const handleViewOrders = () => {
    onClose();
    navigate('/orders');
  };

  const handleViewWishlist = () => {
    onClose();
    navigate('/wishlist');
  };

  const handleViewAddresses = () => {
    onClose();
    navigate('/addresses');
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        
        
        <div className="profile-header-row">
          <h2 className="profile-title">My Profile</h2>
          <button className="profile-close" onClick={onClose} aria-label="Close">
            <span>×</span>
          </button>
        </div>

       
        <div className="profile-photo-section">
          <div className="profile-avatar-container">
            <div className="profile-avatar-wrapper">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt={getUserName()} 
                  className="profile-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.querySelector('.profile-initial').style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="profile-initial" style={{ display: profilePhoto ? 'none' : 'flex' }}>
                {profilePhoto ? null : getInitial()}
              </div>
              
            
              <button 
                className="upload-photo-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Change photo"
                disabled={loading}
              >
                {loading ? '...' : '📷'}
              </button>
              
             
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            
           
            {profilePhoto && (
              <button 
                className="remove-photo-btn"
                onClick={handleRemovePhoto}
                title="Remove photo"
              >
                ✕
              </button>
            )}
          </div>

          
          <div className="profile-name-section">
            {isEditingName ? (
              <div className="edit-name-container">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="name-input"
                  autoFocus
                  maxLength={30}
                />
                <div className="edit-name-actions">
                  <button 
                    className="save-name-btn"
                    onClick={handleSaveName}
                    disabled={!editedName.trim()}
                  >
                    Save
                  </button>
                  <button 
                    className="cancel-name-btn"
                    onClick={() => {
                      setIsEditingName(false);
                      setEditedName(user.name || getUserName());
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="profile-display-name">{getUserName()}</h3>
                <button 
                  className="edit-name-btn"
                  onClick={() => {
                    setEditedName(user.name || getUserName());
                    setIsEditingName(true);
                  }}
                >
                  Edit
                </button>
              </>
            )}
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

      
        <div className="account-info">
          <div className="info-item">
            <span className="info-label">Account ID:</span>
            <span className="info-value">{getUserId()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Member since:</span>
            <span className="info-value">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="status-badge active">Active</span>
          </div>
        </div>

       
        <div className="profile-actions">
          <button className="action-btn" onClick={handleViewOrders}>
            <span className="action-icon">📦</span>
            <span className="action-text">My Orders</span>
            <span className="action-arrow">→</span>
          </button>
          
          
        </div>

        
        <div className="logout-section">
          <button className="logout-btn" onClick={onLogout}>
            <span className="logout-icon">🚪</span>
            Sign Out
          </button>
          <p className="logout-note">You can always sign back in anytime.</p>
        </div>

        
        <div className="app-version">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Terms & Privacy</span>
        </div>
      </div>
    </div>
  );
}