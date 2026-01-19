import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./header-sale.css";
import { useLanguage } from "../../contexts/LanguageContext";

export default function HeaderSale() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const prev = () =>
    setIndex(i => (i === 0 ? SLIDES.length - 1 : i - 1));

  const next = () =>
    setIndex(i => (i === SLIDES.length - 1 ? 0 : i + 1));

  const handleSaleClick = (slide) => {
    navigate('/sale', { 
      state: { 
        saleType: slide.category,
        title: slide.title,
        description: slide.linkText
      } 
    });
  };

  const SLIDES = [
    {
      title: t("headerSale.upTo30"),
      linkText: t("headerSale.seasonal"),
      category: "seasonal",
    },
    {
      title: t("headerSale.upTo50"),
      linkText: t("headerSale.midseason"),
      category: "midseason",
    },
    {
      title: t("headerSale.upTo70"),
      linkText: t("headerSale.latest"),
      category: "latest",
    },
  ];

  return (
    <div className="sale-strip">
      <div className="container sale-strip-content">
        <button className="strip-arrow" onClick={prev}>
          ‹
        </button>

        <div className="sale-text-wrapper">
          <p className="sale-text">
            <strong>{SLIDES[index].title}</strong>{" "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleSaleClick(SLIDES[index]);
              }}
              className="sale-link"
            >
              {SLIDES[index].linkText}
            </a>
          </p>
        </div>

        <button className="strip-arrow" onClick={next}>
          ›
        </button>
      </div>
    </div>
  );
}