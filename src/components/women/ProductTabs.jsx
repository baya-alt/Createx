import React from "react";
import ProductDetailsTab from "./ProductDetailsTab";
import ProductPageContent from "./ProductPageContent";

import "./ProductTabs.css";
import Reviews from "./Rewiews";

function ProductTabs({ activeTab, setActiveTab, product }) {
  return (
    <>
      <div className="product-tabs">
        <button className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>
          General info
        </button>
        <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>
          Product details
        </button>
        <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
          Reviews <span>12</span>
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
