import { useState } from "react";
import MenProducts from "./MenProducts"; // 👈 ВАЖНО

export default function Men() {
  const [filters, setFilters] = useState({
    clothes: [],
    colors: null,
    price: 500
  });

  return (
    <div className="container">
      <h2>Men</h2>
      <MenProducts filters={filters} setFilters={setFilters} />
    </div>
  );
}
