import Women1 from "./Women1";
import "./filters.css";

export default function WomenFilters({ filters, setFilters }) {
  const toggleClothes = value => {
    setFilters(prev => ({
      ...prev,
      clothes: prev.clothes.includes(value)
        ? prev.clothes.filter(v => v !== value)
        : [...prev.clothes, value]
    }));
  };

  const toggleColor = color => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors === color ? null : color
    }));
  };

  return (
    <div className="filters">

      {/* ===== CLOTHES ===== */}
      <Women1 title="Clothes">
        {["Coats", "Jackets", "Dresses", "Cardigans & sweaters"].map(item => (
          <label key={item}>
            <input
              type="checkbox"
              checked={filters.clothes.includes(item)}
              onChange={() => toggleClothes(item)}
            />
            {item}
          </label>
        ))}
      </Women1>

      {/* ===== COLOR (ONE ONLY) ===== */}
      <Women1 title="Color">
        <div className="color-row">
          {["black", "white", "blue", "red"].map(color => (
            <span
              key={color}
              className={`color ${color} ${
                filters.colors === color ? "active" : ""
              }`}
              onClick={() => toggleColor(color)}
            />
          ))}
        </div>
      </Women1>

      {/* ===== PRICE ===== */}
      <Women1 title="Price">
        <input
          type="range"
          min="0"
          max="500"
          value={filters.price}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              price: Number(e.target.value)
            }))
          }
        />
        <div>Up to ${filters.price}</div>
      </Women1>

    </div>
  );
}
