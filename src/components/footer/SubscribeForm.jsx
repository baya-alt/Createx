import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./SubscribeForm.css";
import man from "../../assets/maan.png";
import Footer from "./Footer";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(null); 
  const [agree, setAgree] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(""); // Состояние для ошибки валидации
  const [history, setHistory] = useState([]);
  const [clickAnimation, setClickAnimation] = useState("");

  useEffect(() => {
    const savedHistory = localStorage.getItem("subscribeHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleCategoryClick = (item) => {
    setCategory(item);
    setError(""); // Убираем ошибку, когда пользователь выбрал категорию
    setClickAnimation(`category-${item.toLowerCase()}`);
    setTimeout(() => setClickAnimation(""), 500);
  };

  const handleEmailClick = (e) => {
    e.target.parentElement.classList.add("active-input");
    setTimeout(() => {
      e.target.parentElement.classList.remove("active-input");
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Визуальная проверка категории
    if (!category) {
      setError("Please select a category above!");
      return;
    }

    if (!agree) {
      alert("You must agree to receive communications");
      return;
    }

    const newEntry = {
      email,
      category,
      date: new Date().toLocaleString(),
    };

    emailjs
      .send(
        "service_idw1atl",      
        "template_w2p3omw",     
        {
          user_email: email,
          category: category,
          date: new Date().toLocaleString(),
        },
        "OHqmmhxwjMl0yd__q"     
      )
      .then(() => {
        const updatedHistory = [...history, newEntry];
        setHistory(updatedHistory);
        localStorage.setItem("subscribeHistory", JSON.stringify(updatedHistory));

        setSuccess(true);
        setEmail("");
        setCategory(null);
        setTimeout(() => setSuccess(false), 4000);
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
      });
  };

  return (
    <section className="subscribe">
      <div className="subscribe-container">
        <div className="subscribe-left">
          <h2>Subscribe for updates</h2>
          <p className="subtitle">
            Subscribe for exclusive early sale access and new arrivals.
          </p>

          <div className="subscribe-tabs">
            {["Women", "Men", "Girls", "Boys"].map((item) => (
              <button
                key={item}
                className={`${category === item ? "active" : ""} ${category === item ? clickAnimation : ""}`}
                onClick={() => handleCategoryClick(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Отображение ошибки прямо в интерфейсе */}
          {error && <p className="category-error">{error}</p>}

          <form onSubmit={handleSubmit} className="subscribe-form">
            <label>Email</label>
            <div className="input-row">
              <input
                type="email"
                placeholder="Your working email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onClick={handleEmailClick}
                required
              />
              <button type="submit">Subscribe</button>
            </div>

            <div className="checkbox" onClick={() => setAgree(!agree)}>
              <input type="checkbox" checked={agree} readOnly />
              <span>I agree to receive communications</span>
            </div>

            {success && (
              <div className="success">
                ✅ Thank you! Subscription successful.
              </div>
            )}
          </form>
        </div>

        <div className="subscribe-right">
          <img src={man} alt="Subscribe" />
        </div>
      </div>
     
    </section>
  );
}