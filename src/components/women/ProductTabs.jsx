import React from "react";
import ProductDetailsTab from "./ProductDetailsTab";
import ProductPageContent from "./ProductPageContent";

import "./ProductTabs.css";
import Reviews from "./Rewiews";
import { useLanguage } from "../../contexts/LanguageContext";

function ProductTabs({ activeTab, setActiveTab, product }) {
  const { t } = useLanguage();
  return (
    <>
      <div className="product-tabs">
        <button className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>
          {t("productTabs.generalInfo")}
        </button>
        <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>
          {t("productTabs.productDetails")}
        </button>
        <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
          {t("productTabs.reviews")} <span>12</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "info" && product && <ProductPageContent product={product} />}
        {activeTab === "details" && <ProductDetailsTab />}
        {activeTab === "reviews" && <Reviews />}
      </div>
    </>
  );
}

export default ProductTabs;
