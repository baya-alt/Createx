import { useState } from "react";
import "./profile.css";
import OrdersModal from "./Orders"; // Импортируем модалку заказов

export default function Profile({ user, onClose, onLogout }) {
  const [showOrders, setShowOrders] = useState(false);

  if (!user) return null;

  if (showOrders) {
    return <OrdersModal onClose={() => setShowOrders(false)} />;
  }

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>

        <button className="profile-close" onClick={onClose}>×</button>

        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        <div className="profile-actions">
          <button 
            className="profile-btn" 
            onClick={() => setShowOrders(true)}
          >
            My orders
          </button>
          <button className="profile-btn logout" onClick={onLogout}>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}