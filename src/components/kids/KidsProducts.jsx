import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KidsFilters from "./KidsFilters";
import heart from "../../assets/serdechko.png";
// import "./products.css";

export default function KidsProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const navigate = useNavigate();

  /* ===== FILTER STATE ===== */
  const [filters, setFilters] = useState({
    clothes: [],
    colors: null,
    price: 500
  });

  /* ===== LOAD PRODUCTS ===== */
  useEffect(() => {
    setLoading(true);
    
    // Задержка для демонстрации анимации
    const timer = setTimeout(() => {
      fetch("https://6947cef21ee66d04a44dfb36.mockapi.io/kids")
        .then(res => res.json())
        .then(data => {
          const mapped = data.map(item => {
            const basePrice = Number(String(item.price).replace("$", "")) || 0;
            
            // Используем скидку из API, если она есть
            const discount = item.sale ? Number(item.sale) : null;
            
            const price = discount
              ? +(basePrice * (1 - discount / 100)).toFixed(2)
              : basePrice;

            return { 
              ...item, 
              basePrice, 
              price, 
              discount,
              hasDiscount: !!item.sale,
              // Добавляем все доступные цвета для фильтрации
              availableColors: []
            };
          });

          // Определяем доступные цвета для каждого товара
          const productsWithColors = mapped.map(item => {
            const colors = [];
            if (item.avatar) colors.push("black");
            if (item.avatarwhite) colors.push("white");
            if (item.avatarblue) colors.push("blue");
            if (item.avatargreen) colors.push("green");
            // Детские товары могут иметь другие названия цветов
            if (item.avataryellow) colors.push("yellow");
            if (item.avatarred) colors.push("red");
            
            return {
              ...item,
              availableColors: colors
            };
          });

          setProducts(productsWithColors);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Kids API ERROR:", err);
          setLoading(false);
        });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Анимация появления страницы
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  /* ===== FILTER LOGIC ===== */
  const filteredProducts = products.filter(item => {
    // PRICE
    if (item.price > filters.price) return false;

    // CLOTHES
    if (
      filters.clothes.length &&
      !filters.clothes.includes(item.kategory)
    ) return false;

    // COLOR (ONE)
    if (filters.colors && !item.availableColors.includes(filters.colors)) {
      return false;
    }

    return true;
  });

  /* ===== IMAGE BY COLOR ===== */
  const getImageByColor = item => {
    switch (filters.colors) {
      case "white":
        return item.avatarwhite || item.avatar;
      case "blue":
        return item.avatarblue || item.avatar;
      case "green":
        return item.avatargreen || item.avatar;
      case "yellow":
        return item.avataryellow || item.avatar;
      case "red":
        return item.avatarred || item.avatar;
      default:
        return item.avatar;
    }
  };

  /* ===== LOADING SKELETON ===== */
  const LoadingSkeleton = () => (
    <div className="catalog-grid">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="catalog-card skeleton">
          <div className="catalog-image skeleton-image">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="catalog-info">
            <div className="skeleton-title"></div>
            <div className="skeleton-price"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`catalog-wrapper ${pageLoaded ? 'loaded' : ''}`}>
      {/* Анимация фона при загрузке */}
      <div className="page-load-overlay"></div>
      
      <KidsFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <LoadingSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">👶</div>
          <h3>No kids products found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button 
            className="reset-filters-btn"
            onClick={() => setFilters({
              clothes: [],
              colors: null,
              price: 500
            })}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="catalog-grid">
          {filteredProducts.map((item, index) => (
            <div
              key={item.id}
              className="catalog-card"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                opacity: pageLoaded ? 1 : 0,
                transform: pageLoaded ? 'translateY(0)' : 'translateY(20px)'
              }}
              onClick={(e) => {
                // Анимация перехода
                const card = e.currentTarget;
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                  navigate(`/kids/product/${item.id}`);
                }, 200);
              }}
            >
              <div className="catalog-image">
                <img 
                  src={getImageByColor(item)} 
                  alt={item.name}
                  loading="lazy"
                  onLoad={(e) => {
                    e.target.classList.add('loaded');
                  }}
                />

                {item.hasDiscount && (
                  <span className="sale-badg">-{item.discount}%</span>
                )}

                <button
                  className="fav-btn"
                  onClick={e => {
                    e.stopPropagation();
                    // Анимация добавления в избранное
                    e.currentTarget.classList.toggle('active');
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.transform = 'scale(1.2)';
                      setTimeout(() => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }, 300);
                    }
                  }}
                >
                  <img src={heart} alt="fav" />
                </button>
              </div>

              <div className="catalog-info">
                <p className="catalog-title">{item.name}</p>

                <div className="catalog-price">
                  {item.hasDiscount && (
                    <span className="old-price">${item.basePrice.toFixed(2)}</span>
                  )}
                  <span>${item.price.toFixed(2)}</span>
                </div>

                {/* Показываем доступные цвета */}
                {item.availableColors.length > 0 && (
                  <div className="available-colors">
                    {item.availableColors.map(color => (
                      <span 
                        key={color} 
                        className={`color-dot ${color}`}
                        title={color}
                      />
                    ))}
                  </div>
                )}

                {/* Детский бейдж */}
                <div className="kids-badge">👶 Kids</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}