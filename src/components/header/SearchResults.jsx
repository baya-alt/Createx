// src/components/search/SearchResults.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchResults.css";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (!searchQuery) {
      navigate("/");
      return;
    }

    setQuery(searchQuery);
    fetchSearchResults(searchQuery);
  }, [searchParams, navigate]);

  const fetchSearchResults = async (searchQuery) => {
    setLoading(true);
    setError(null);

    try {
      // Проверяем, есть ли сохраненные результаты
      const savedResults = JSON.parse(localStorage.getItem('searchResults') || '[]');
      const savedQuery = localStorage.getItem('searchQuery');
      
      if (savedResults.length > 0 && savedQuery === searchQuery) {
        setResults(savedResults);
      } else {
        // Загружаем товары из всех категорий
        const [womenRes, menRes, kidsRes] = await Promise.all([
          fetch("https://691bbd103aaeed735c8e1d0d.mockapi.io/my"),
          fetch("https://691bbd103aaeed735c8e1d0d.mockapi.io/man"),
          fetch("https://691bbd103aaeed735c8e1d0d.mockapi.io/kids")
        ]);

        const [womenData, menData, kidsData] = await Promise.all([
          womenRes.json(),
          menRes.json(),
          kidsRes.json()
        ]);

        // Добавляем информацию о категории и маршруте
        const allProducts = [
          ...womenData.map(item => ({ 
            ...item, 
            category: 'women', 
            route: '/product',
            source: 'women'
          })),
          ...menData.map(item => ({ 
            ...item, 
            category: 'men', 
            route: '/men/product',
            source: 'men'
          })),
          ...kidsData.map(item => ({ 
            ...item, 
            category: 'kids', 
            route: '/kids/product',
            source: 'kids'
          }))
        ];

        // Ищем товары по поисковому запросу
        const filteredResults = allProducts.filter(product => {
          const searchLower = searchQuery.toLowerCase();
          const productName = (product.name || "").toLowerCase();
          const productCategory = (product.kategory || "").toLowerCase();
          const productDescription = (product.description || "").toLowerCase();
          
          return (
            productName.includes(searchLower) ||
            productCategory.includes(searchLower) ||
            productDescription.includes(searchLower)
          );
        });

        setResults(filteredResults);
        localStorage.setItem('searchResults', JSON.stringify(filteredResults));
        localStorage.setItem('searchQuery', searchQuery);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError("Failed to load search results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    // Определяем правильный маршрут в зависимости от категории
    const productRoute = product.route || 
      (product.source === 'men' ? '/men/product' : 
       product.source === 'kids' ? '/kids/product' : '/product');
    
    navigate(`${productRoute}/${product.id}`);
  };

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Searching for products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h2>Search Results</h2>
        <p className="search-query">
          {results.length} results for "{query}"
        </p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => fetchSearchResults(query)}>Try Again</button>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="no-results">
          <h3>No products found for "{query}"</h3>
          <p>Try different keywords or check for typos</p>
        </div>
      )}

      <div className="search-results-grid">
        {results.map((product) => {
          const basePrice = Number(String(product.price).replace("$", "")) || 0;
          const discount = product.sale ? Number(product.sale) : null;
          const price = discount
            ? +(basePrice * (1 - discount / 100)).toFixed(2)
            : basePrice.toFixed(2);

          return (
            <div 
              key={`${product.source}-${product.id}`} 
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              <div className="product-image">
                <img 
                  src={product.avatar || product.avatarred || product.avataryellow || product.avatarwhite || product.avatarblue || "https://via.placeholder.com/300"} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                    e.target.onerror = null;
                  }}
                />
                {discount && (
                  <span className="sale-badge">-{discount}%</span>
                )}
                <span className="category-badge" 
                      style={{
                        backgroundColor: 
                          product.source === 'women' ? '#17696A' : 
                          product.source === 'men' ? '#1e40af' : '#7c3aed'
                      }}>
                  {product.source?.toUpperCase()}
                </span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.kategory || "Clothing"}</p>
                <div className="product-price">
                  <span className="current-price">${price}</span>
                  {discount && (
                    <span className="original-price">
                      ${basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}