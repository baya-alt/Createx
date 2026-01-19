import React from "react";
import KidsProductDetailsTab from "./KidsProductDetailsTab";
import KidsProductPageContent from "./KidsProductPageContent";
import KidsReviews from "./KidsReviews";
import "./ProductTabs.css";
import { useLanguage } from "../../contexts/LanguageContext";

function KidsProductTabs({ activeTab, setActiveTab, product }) {
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
        {activeTab === "info" && product && (
          <KidsProductPageContent product={product} />
        )}
        {activeTab === "details" && (
          <KidsProductDetailsTab product={product} />
        )}
        {activeTab === "reviews" && (
          <KidsReviews product={product} />
        )}
      </div>
    </>
  );
}

export default KidsProductTabs;