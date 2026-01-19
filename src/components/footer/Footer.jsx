import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterestP
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCategoryClick = (category) => {
    navigate(`/${category.toLowerCase()}`);
  };

  const handleDeliveryClick = () => {
    navigate('/delivery');
  };

  const handleTrackOrderClick = () => {
    navigate('/orders');
  };

  const handleContactsClick = () => {
    navigate('/contacts');
  };

  const handleBlogClick = () => {
    navigate('/blog');
  };

  const handleFAQClick = () => {
    navigate('/faq');
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        
        <div className="footer-col">
          <h4>{t("footer.help")}</h4>
          <button 
            className="footer-link"
            onClick={handleDeliveryClick}
          >
            {t("footer.deliveryReturns")}
          </button>
          <button 
            className="footer-link"
            onClick={handleFAQClick}
          >
            {t("footer.faq")}
          </button>
          <button 
            className="footer-link"
            onClick={handleTrackOrderClick}
          >
            {t("footer.trackOrder")}
          </button>
          <button 
            className="footer-link"
            onClick={handleContactsClick}
          >
            {t("footer.contacts")}
          </button>
          <button 
            className="footer-link"
            onClick={handleBlogClick}
          >
            {t("footer.blog")}
          </button>
        </div>

        <div className="footer-col">
          <h4>{t("footer.shop")}</h4>
          <button 
            className="footer-link"
            onClick={() => handleCategoryClick('women')}
          >
            {t("footer.women")}
          </button>
          <button 
            className="footer-link"
            onClick={() => handleCategoryClick('men')}
          >
            {t("footer.men")}
          </button>
          <button 
            className="footer-link"
            onClick={() => handleCategoryClick('sale')}
          >
            {t("footer.sales")}
          </button>
          <button 
            className="footer-link"
            onClick={() => handleCategoryClick('kids')}
          >
            {t("footer.kids")}
          </button>
        </div>

        <div className="footer-col">
          <h4>{t("footer.getInTouch")}</h4>
          <p>{t("footer.call")}: <strong>(225) 325 666</strong></p>
          <p>{t("footer.email")}: <strong>hello@createx.com</strong></p>

          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <FaPinterestP />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t("footer.downloadApp")}</h4>
          <div className="footer-apps">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" 
              alt="Download on App Store" 
              onClick={() => alert("App Store link would open")}
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" 
              alt="Get it on Google Play" 
              onClick={() => alert("Google Play link would open")}
            />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <span>{t("footer.rights")}</span>
        <button 
          className="go-top"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Scroll to top"
        >
          {t("footer.goTop")} ↑
        </button>
      </div>
    </footer>
  );
}