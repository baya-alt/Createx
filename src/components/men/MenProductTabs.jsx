import React from "react";
import MenProductDetailsTab from "./MenProductDetailsTab";
import MenProductPageContent from "./MenProductPageContent";
import MenReviews from "./MenReviews";

import "./MenProductTabs.css";

function MenProductTabs({ activeTab, setActiveTab, product }) {
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
        {activeTab === "info" && product && <MenProductPageContent product={product} />}
        {activeTab === "details" && product && <MenProductDetailsTab product={product} />}
        {activeTab === "reviews" && product && <MenReviews />}
      </div>
    </>
  );
}

export default MenProductTabs;