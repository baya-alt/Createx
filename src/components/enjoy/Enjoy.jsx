import React, { useEffect } from 'react'
import { FiTruck, FiHeadphones, FiRefreshCw, FiLock } from 'react-icons/fi'
import { FaApple, FaGooglePlay } from 'react-icons/fa'
import wommen from '../../assets/wommen.png'
import './Enjoy.css'

function Enjoy({ onRendered }) {
  
  useEffect(() => {
    if (onRendered) {
      onRendered();
    }
  }, [onRendered]);

  return (
    <div className="enjoy-wrapper">
      <section className="enjoy">
         
        <div className="enjoy-inner">
          <div className="enjoy-image">
            <img src={wommen} alt="Shopping illustration" />
          </div>

          <div className="enjoy-content">
            <h2>Enjoy mobile shopping with our Createx Store App!</h2>
            <p className="enjoy-subtitle">Download our app for better shopping experience</p>

            <div className="store-buttons">
              <a href="#" className="store-btn apple">
                <FaApple size={20} /> 
                <div>
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className="store-btn google">
                <FaGooglePlay size={18} /> 
                <div>
                  <span>Get it on</span>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon-wrapper">
              <FiTruck className="feature-icon" />
            </div>
            <h4>Fast Worldwide Shipping</h4>
            <p>Get free shipping over $250</p>
          </div>

          <div className="feature">
            <div className="feature-icon-wrapper">
              <FiHeadphones className="feature-icon" />
            </div>
            <h4>24/7 Customer Support</h4>
            <p>Friendly 24/7 customer support</p>
          </div>

          <div className="feature">
            <div className="feature-icon-wrapper">
              <FiRefreshCw className="feature-icon" />
            </div>
            <h4>Money Back Guarantee</h4>
            <p>We return money within 30 days</p>
          </div>

          <div className="feature">
            <div className="feature-icon-wrapper">
              <FiLock className="feature-icon" />
            </div>
            <h4>Secure Online Payment</h4>
            <p>Accept all major credit cards</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Enjoy