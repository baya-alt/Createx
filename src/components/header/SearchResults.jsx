import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SearchPage.css'; // Не забудьте создать стили

const SearchPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || "";

  // Загрузка всех товаров (логика как в HeaderSearch)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [womenRes, menRes, kidsRes] = await Promise.all([
          fetch("https://691bbd103aaeed735c8e1d0d.mockapi.io/my"),
          fetch("https://691bbd103aaeed735c8e1d0d.mockapi.io/man"),
          fetch("https://6947cef21ee66d04a44dfb36.mockapi.io/kids")
        ]);

        const [women, men, kids] = await Promise.all([
          womenRes.json(),
          menRes.json(),
          kidsRes.json()
        ]);

        // Унификация данных
        const normalized = [
          ...women.map(p => ({ ...p, gender: 'women', path: `/product/${p.id}` })),
          ...men.map(p => ({ ...p, gender: 'men', path: `/men/product/${p.id}` })),
          ...kids.map(p => ({ 
            ...p, 
            gender: p.gender || (p.name?.toLowerCase().includes('girl') ? 'girls' : 'boys'),
            path: `/kids/product/${p.id}` 
          }))
        ];

        setAllProducts(normalized);
      } catch (error) {
        console.error("Failed to fetch search products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Фильтрация при изменении запроса или списка товаров
  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts(allProducts);
      return;
    }

    const q = query.toLowerCase();
    const filtered = allProducts.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.kategory?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
    setFilteredProducts(filtered);
  }, [query, allProducts]);

  return (
    <div className="search-page-container">
      <div className="search-page-header">
        <h1>Search Results</h1>
        <p>Found {filteredProducts.length} items for "<strong>{query}</strong>"</p>
      </div>

      {loading ? (
        <div className="search-loading">Searching...</div>
      ) : (
        <div className="search-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link to={product.path} key={`${product.gender}-${product.id}`} className="search-card">
                <div className="search-card-image">
                  <img src={product.avatar || product.image} alt={product.name} />
                  {product.sale > 0 && <span className="sale-badge">-{product.sale}%</span>}
                </div>
                <div className="search-card-info">
                  <span className="search-card-gender">{product.gender.toUpperCase()}</span>
                  <h3>{product.name}</h3>
                  <p className="search-card-price">{product.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results-view">
              <h2>No items found</h2>
              <p>Try checking your spelling or use more general terms.</p>
              <Link to="/" className="back-home-btn">Continue Shopping</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;