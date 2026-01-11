import { useState, useEffect } from "react";
import "./register.css";
import nice from "../../assets/nice.mp4";

export default function Register({ onClose, onLogin }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  const VIDEO_START_OFFSET = 1;
  const VIDEO_END_DELAY = 300;
  const CHECK_DELAY = 1500;

  // Проверяем, есть ли уже пользователи при загрузке
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.length > 0) {
      setMode("signin");
    }
  }, []);

  // Функция для получения всех пользователей
  const getUsers = () => {
    return JSON.parse(localStorage.getItem("users") || "[]");
  };

  // Функция для сохранения пользователей
  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const validate = () => {
    const e = {};
    setAuthError("");

    if (mode === "signup") {
      if (!name.trim()) e.name = "Name is required";
      else if (name.length < 2) e.name = "Min 2 characters";
    }

    if (!email.trim()) {
      e.email = "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Invalid email";
    }

    if (!password) {
      e.password = "Password required";
    } else if (password.length < 6) {
      e.password = "Min 6 characters";
    } else if (mode === "signup" && !/[A-Z]/.test(password)) {
      e.password = "Password must contain at least one uppercase letter";
    } else if (mode === "signup" && !/[0-9]/.test(password)) {
      e.password = "Password must contain at least one number";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = () => {
    if (!validate()) return;

    const users = getUsers();
    
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = users.find(user => user.email === email.toLowerCase());
    if (existingUser) {
      setAuthError("User with this email already exists");
      return;
    }

    // Создаем нового пользователя
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // В реальном приложении нужно хешировать пароль!
      role: "user", // Можно добавлять разные роли: "admin", "user", "moderator"
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Сохраняем пользователя
    users.push(newUser);
    saveUsers(users);

    // Устанавливаем текущего пользователя
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    
    setSuccess(true);
  };

  const handleSignIn = () => {
    if (!validate()) return;

    const users = getUsers();
    
    // Ищем пользователя по email и паролю
    const user = users.find(
      user => user.email === email.toLowerCase().trim() && 
              user.password === password
    );

    if (!user) {
      setAuthError("Invalid email or password");
      return;
    }

    // Обновляем время последнего входа
    user.lastLogin = new Date().toISOString();
    saveUsers(users);

    // Устанавливаем текущего пользователя (без пароля)
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    
    setSuccess(true);
  };

  const handleSubmit = () => {
    if (mode === "signup") {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  const handleVideoEnd = () => {
    setTimeout(() => {
      setSuccess(false);
      setShowCheck(true);

      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (currentUser) {
          onLogin(currentUser);
        }
        onClose();
      }, CHECK_DELAY);
    }, VIDEO_END_DELAY);
  };

  // Функция для сброса пароля (дополнительная функция)
  const handleForgotPassword = () => {
    const users = getUsers();
    const user = users.find(user => user.email === email.toLowerCase().trim());
    
    if (!user) {
      setAuthError("No account found with this email");
      return;
    }
    
    // В реальном приложении здесь должна быть отправка email
    alert(`Password reset link would be sent to ${email}`);
    setAuthError("Password reset link sent to your email (demo mode)");
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>

        {!success && !showCheck && (
          <button className="auth-close" onClick={onClose}>×</button>
        )}

        {success && (
          <div className="auth-success">
            <video
              src={nice}
              autoPlay
              playsInline
              onLoadedMetadata={e => (e.currentTarget.currentTime = VIDEO_START_OFFSET)}
              onEnded={handleVideoEnd}
              className="success-video"
            />
            <p>Welcome 🎉</p>
          </div>
        )}

        {showCheck && (
          <div className="auth-check">
            <div className="checkmark">
              <svg viewBox="-4 -4 60 60">
                <circle cx="26" cy="26" r="25" fill="none" />
                <path d="M14 27l7 7 17-17" />
              </svg>
            </div>
            <p>Success!</p>
          </div>
        )}

        {!success && !showCheck && (
          <>
            <h2>{mode === "signin" ? "Sign in" : "Sign up"}</h2>

            {authError && <div className="auth-error">{authError}</div>}

            {mode === "signup" && (
              <>
                <input
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </>
            )}

            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <div className="error-text">{errors.password}</div>}

            {mode === "signin" && (
              <p className="forgot-password" onClick={handleForgotPassword}>
                Forgot password?
              </p>
            )}

            <button className="auth-submit" onClick={handleSubmit}>
              {mode === "signin" ? "Sign in" : "Sign up"}
            </button>

            <p className="auth-switch">
              {mode === "signin" ? (
                <>
                  No account? <span onClick={() => setMode("signup")}>Sign up</span>
                </>
              ) : (
                <>
                  Have account? <span onClick={() => setMode("signin")}>Sign in</span>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}