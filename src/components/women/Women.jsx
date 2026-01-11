import { useState } from "react";
import WomenProducts from "./WomenProducts";

export default function Women() {
  const [filters, setFilters] = useState({
    clothes: [],
    sizes: [],
    colors: null,   // ⬅️ ОДИН активный цвет
    price: 500
  });

  return (
    <div className="container">
      <h2>Women</h2>
      <WomenProducts filters={filters} setFilters={setFilters} />
    </div>
  );
}
