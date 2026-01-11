import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaApple,
  FaGooglePlay
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4>HELP</h4>
          <a href="#">Delivery & returns</a>
          <a href="#">FAQ</a>
          <a href="#">Track order</a>
          <a href="#">Contacts</a>
          <a href="#">Blog</a>
        </div>

        <div className="footer-col">
          <h4>SHOP</h4>
          <a href="#">New arrivals</a>
          <a href="#">Trending now</a>
          <a href="#">Sales</a>
          <a href="#">Brands</a>
        </div>

        <div className="footer-col">
          <h4>GET IN TOUCH</h4>
          <p>Call: (405) 555-0128</p>
          <p>Email: hello@createx.com</p>

          <div className="footer-social">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaPinterestP /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>DOWNLOAD OUR APP</h4>

          <div className="footer-app-icons">
            <a href="#" className="app-btn apple">
              <FaApple />
              <span>App Store</span>
            </a>

            <a href="#" className="app-btn google">
              <FaGooglePlay />
              <span>Google Play</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© All rights reserved. Made with ❤️ by Createx Studio</span>
        <a href="#top" className="go-top">Go to top ↑</a>
      </div>
    </footer>
  );
}
