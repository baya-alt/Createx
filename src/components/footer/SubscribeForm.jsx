import { useState, useEffect } from "react";
import "./SubscribeForm.css";
import man from "../../assets/maan.png";
import Footer from "./Footer";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Girls");
  const [agree, setAgree] = useState(true);
  const [success, setSuccess] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [history, setHistory] = useState([]);
  const [clickAnimation, setClickAnimation] = useState("");

  
  useEffect(() => {
    const savedHistory = localStorage.getItem('subscribeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleCategoryClick = (item) => {
    setCategory(item);
    
    
    setClickAnimation(`category-${item.toLowerCase()}`);
    setTimeout(() => setClickAnimation(""), 500);
    
  
    console.log(`Selected category: ${item}`);
    
   
    const quickMessage = document.createElement('div');
    quickMessage.className = 'quick-notification';
    quickMessage.textContent = `🎯 ${item} category selected`;
    document.body.appendChild(quickMessage);
    
    setTimeout(() => {
      quickMessage.classList.add('hide');
      setTimeout(() => document.body.removeChild(quickMessage), 300);
    }, 1500);
  };

  const handleEmailClick = (e) => {
    
    e.target.parentElement.classList.add('active-input');
    setTimeout(() => {
      e.target.parentElement.classList.remove('active-input');
    }, 1000);
    
    
    if (!email) {
      const placeholder = e.target.placeholder;
      e.target.placeholder = "example@email.com";
      setTimeout(() => {
        e.target.placeholder = placeholder;
      }, 1000);
    }
  };

  const handleCheckboxClick = () => {
    // Анимация изменения чекбокса
    setAgree(!agree);
    setClickAnimation(agree ? "checkbox-uncheck" : "checkbox-check");
    setTimeout(() => setClickAnimation(""), 300);
    
    // Визуальный эффект
    const checkbox = document.getElementById('agreeCheckbox');
    checkbox.style.transform = "scale(1.2)";
    setTimeout(() => {
      checkbox.style.transform = "scale(1)";
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email");
      
      // Анимация ошибки
      setClickAnimation("email-error");
      setTimeout(() => setClickAnimation(""), 500);
      return;
    }

    if (!agree) {
      alert("You must agree to receive communications");
      return;
    }

    // Сохраняем в историю
    const newEntry = {
      email: email,
      category: category,
      date: new Date().toLocaleString(),
      timestamp: Date.now()
    };
    
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem('subscribeHistory', JSON.stringify(updatedHistory));
    
    // Успешная подписка
    setSuccess(true);
    
    // Анимация успеха
    setClickAnimation("submit-success");
    setTimeout(() => setClickAnimation(""), 1000);
    
    // Сбрасываем email
    setEmail("");
    
    // Автоматическое скрытие успешного сообщения
    setTimeout(() => setSuccess(false), 4000);
    
    // Имитация отправки на сервер
    console.log("Subscription data:", { email, category, agree });
    
    // Показываем детали подписки
    setTimeout(() => {
      const subscriptionDetails = `
        📧 Email: ${email}
        🏷️ Category: ${category}
        📅 Date: ${new Date().toLocaleDateString()}
        🎯 You'll receive updates about ${category.toLowerCase()} fashion
      `;
      console.log(subscriptionDetails);
    }, 100);
  };

  const handleShowHistory = () => {
    if (history.length === 0) {
      alert("No subscription history yet!");
      return;
    }
    
    const lastSub = history[history.length - 1];
    alert(`Your last subscription:\n📧 ${lastSub.email}\n🏷️ ${lastSub.category}\n📅 ${lastSub.date}`);
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all subscription history?")) {
      localStorage.removeItem('subscribeHistory');
      setHistory([]);
      setClickAnimation("clear-history");
      setTimeout(() => setClickAnimation(""), 500);
      alert("History cleared!");
    }
  };

  const handleQuickFill = () => {
    const sampleEmails = [
      "user@example.com",
      "test@gmail.com",
      "fashion@email.com",
      "subscribe@mail.com"
    ];
    const randomEmail = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
    setEmail(randomEmail);
    
    setClickAnimation("quick-fill");
    setTimeout(() => setClickAnimation(""), 300);
    
    // Фокус на поле email
    document.querySelector('input[type="email"]').focus();
  };

  const handleImageClick = () => {
    // Интерактивность для изображения
    const img = document.querySelector('.subscribe-right img');
    img.style.transform = "scale(1.05) rotate(1deg)";
    img.style.transition = "transform 0.3s ease";
    
    setTimeout(() => {
      img.style.transform = "scale(1) rotate(0deg)";
    }, 300);
    
    // Показываем сообщение
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay-message';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(23, 105, 106, 0.9);
        color: white;
        padding: 20px;
        border-radius: 12px;
        z-index: 1000;
        animation: fadeIn 0.3s;
        max-width: 300px;
        text-align: center;
      ">
        <h3>👋 Welcome!</h3>
        <p>Subscribe to get exclusive fashion updates!</p>
      </div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => document.body.removeChild(overlay), 300);
    }, 2000);
  };

  return (
    <section className="subscribe">
      <div className="subscribe-container">
        {/* LEFT */}
        <div className="subscribe-left">
          <h2 onClick={() => {
            // Анимация заголовка при клике
            const h2 = document.querySelector('.subscribe-left h2');
            h2.style.transform = "scale(1.05)";
            setTimeout(() => h2.style.transform = "scale(1)", 200);
          }}>
            Subscribe for updates
          </h2>
          
          <p className="subtitle">
            Subscribe for exclusive early sale access and new arrivals.
            <span 
              style={{ 
                marginLeft: '8px', 
                color: '#17696a', 
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '13px'
              }}
              onClick={() => setShowCategories(!showCategories)}
            >
              {showCategories ? '▲ Hide' : '▼ Show'} categories
            </span>
          </p>

          {/* История */}
          {history.length > 0 && (
            <div style={{
              background: '#f0f8ff',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              border: '1px solid #d1e9ff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📋 {history.length} previous subscription{history.length !== 1 ? 's' : ''}</span>
                <div>
                  <button 
                    onClick={handleShowHistory}
                    style={{
                      background: 'none',
                      border: '1px solid #17696a',
                      color: '#17696a',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginRight: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    View
                  </button>
                  <button 
                    onClick={handleClearHistory}
                    style={{
                      background: '#ff6b6b',
                      border: 'none',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY */}
          {showCategories && (
            <div className="subscribe-tabs">
              {["Women", "Men", "Girls", "Boys"].map((item) => (
                <button
                  key={item}
                  className={`${category === item ? "active" : ""} ${clickAnimation}`}
                  onClick={() => handleCategoryClick(item)}
                  type="button"
                  style={{
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {item}
                  {category === item && (
                    <span style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: '#17696a',
                      color: 'white',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="subscribe-form">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Email</label>
              <button 
                type="button"
                onClick={handleQuickFill}
                style={{
                  background: 'none',
                  border: '1px solid #d7dadd',
                  color: '#17696a',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f0f8ff'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                ✨ Quick Fill
              </button>
            </div>

            <div className="input-row">
              <input
                type="email"
                placeholder="Your working email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onClick={handleEmailClick}
                style={{
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
              />
              <button 
                type="submit"
                onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                style={{
                  transition: 'transform 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                Subscribe
                <span style={{
                  position: 'absolute',
                  right: '10px',
                  fontSize: '12px',
                  opacity: '0.8'
                }}>
                  →
                </span>
              </button>
            </div>

            <div className="checkbox">
              <input
                id="agreeCheckbox"
                type="checkbox"
                checked={agree}
                onChange={handleCheckboxClick}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
              />
              <span>
                I agree to receive communications from Createx Store.
                <span 
                  style={{ 
                    color: '#17696a', 
                    marginLeft: '4px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '12px'
                  }}
                  onClick={() => alert("We'll send you updates about new arrivals, exclusive offers, and fashion tips. You can unsubscribe at any time.")}
                >
                  (view terms)
                </span>
              </span>
            </div>

            {success && (
              <div className="success" style={{ animation: 'slideDown 0.5s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>✅</span>
                  <div>
                    <strong>Thank you! You have successfully subscribed.</strong>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      You'll receive updates about {category.toLowerCase()} fashion
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* RIGHT */}
        <div className="subscribe-right">
          <img 
            src={man} 
            alt="Subscribe illustration" 
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
          {/* <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            maxWidth: '200px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <strong>Click the image!</strong>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Interactive surprise 👆
            </div>
          </div> */}
        </div>
      </div>

      {/* Скрытые элементы для анимаций */}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .active-input {
            border-color: #17696a !important;
            box-shadow: 0 0 0 3px rgba(23, 105, 106, 0.1) !important;
          }
          
          .quick-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #17696a;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s;
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .quick-notification.hide {
            animation: slideOut 0.3s forwards;
          }
          
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
          
          .subscribe-tabs button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .subscribe-tabs button:hover {
            transform: translateY(-2px);
          }
          
          .subscribe-tabs button.active {
            animation: pulse 0.5s;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </section>
  );
}