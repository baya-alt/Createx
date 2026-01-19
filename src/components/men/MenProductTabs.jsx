import React from "react";
import MenProductDetailsTab from "./MenProductDetailsTab";
import MenProductPageContent from "./MenProductPageContent";
import MenReviews from "./MenReviews";
import { useLanguage } from "../../contexts/LanguageContext";

import "./MenProductTabs.css";

function MenProductTabs({ activeTab, setActiveTab, product }) {
  const { t } = useLanguage();
  return (
    <>
      <div className="product-tabs">
        <button 
          className={activeTab === "info" ? "active" : ""} 
          onClick={() => setActiveTab("info")}
        >
          {t("productTabs.generalInfo")}
        </button>
        <button 
          className={activeTab === "details" ? "active" : ""} 
          onClick={() => setActiveTab("details")}
        >
          {t("productTabs.productDetails")}
        </button>
        <button 
          className={activeTab === "reviews" ? "active" : ""} 
          onClick={() => setActiveTab("reviews")}
        >
          {t("productTabs.reviews")} <span>12</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "info" && product && <MenProductPageContent product={product} />}
        {activeTab === "details" && product && <MenProductDetailsTab product={product} />}
        {activeTab === "reviews" && product && <MenReviews />}
      </div>
    </>
  );
}

export default MenProductTabs;