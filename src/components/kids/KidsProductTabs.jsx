import React from "react";
import KidsProductDetailsTab from "./KidsProductDetailsTab";
import KidsProductPageContent from "./KidsProductPageContent";
import KidsReviews from "./KidsReviews";
import "./ProductTabs.css";

function KidsProductTabs({ activeTab, setActiveTab, product }) {
  return (
    <>
      <div className="product-tabs">
        <button 
          className={activeTab === "info" ? "active" : ""} 
          onClick={() => setActiveTab("info")}
        >
          General info
        </button>
        <button 
          className={activeTab === "details" ? "active" : ""} 
          onClick={() => setActiveTab("details")}
        >
          Product details
        </button>
        <button 
          className={activeTab === "reviews" ? "active" : ""} 
          onClick={() => setActiveTab("reviews")}
        >
          Reviews <span>12</span>
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