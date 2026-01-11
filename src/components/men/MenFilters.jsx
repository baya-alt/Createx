import FilterBlock from "./Men1";
// import "./filters.css";

export default function MenFilters({ filters, setFilters }) {

  const toggleArray = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  return (
    <div className="filters">

      <FilterBlock title="Clothes">
        {[
          "T-shirts",
          "Jackets",
          "Shirts",
          "Coats",
          "Pants",
          "Casual Shoes",
          "Sneakers",
          "Sandals",
          "Watches",
          "Hats",
          "Wallets"
        ].map(item => (
          <label key={item}>
            <input
              type="checkbox"
              checked={filters.clothes.includes(item)}
              onChange={() => toggleArray("clothes", item)}
            />
            {item}
          </label>
        ))}
      </FilterBlock>

      <FilterBlock title="Color">
        <div className="color-row">
          {["black", "white", "blue", "yellow"].map(color => (
            <span
              key={color}
              className={`color ${color} ${
                filters.colors === color ? "active" : ""
              }`}
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  colors: prev.colors === color ? null : color
                }))
              }
            />
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Price">
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
      </FilterBlock>

    </div>
  );
}
