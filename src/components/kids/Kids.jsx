import { useState } from "react";
import KidsProducts from "./KidsProducts"; // 👈 ВАЖНО

export default function Kids() {
  const [filters, setFilters] = useState({
    clothes: [],
    colors: null,
    price: 500
  });

  return (
    <div className="container">
      <h2>Kids</h2>
      <KidsProducts filters={filters} setFilters={setFilters} />
    </div>
  );
}
