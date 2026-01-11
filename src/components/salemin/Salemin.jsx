import React, { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import './Salemin.css'

function Salemin() {
  const [saleProducts, setSaleProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSizes, setSelectedSizes] = useState({})
  const [selectedColors, setSelectedColors] = useState({})
  const [favorites, setFavorites] = useState([])
  const swiperRef = useRef(null)

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const [womenRes, menRes, kidsRes] = await Promise.all([
          fetch('https://691bbd103aaeed735c8e1d0d.mockapi.io/my'),
          fetch('https://691bbd103aaeed735c8e1d0d.mockapi.io/man'),
          fetch('https://6947cef21ee66d04a44dfb36.mockapi.io/kids')
        ])
        const womenData = await womenRes.json()
        const menData = await menRes.json()
        const kidsData = await kidsRes.json()

        const allSaleProducts = [
          ...womenData.filter(item => item.sale),
          ...menData.filter(item => item.sale),
          ...kidsData.filter(item => item.sale)
        ]

        allSaleProducts.sort((a, b) => parseInt(b.sale) - parseInt(a.sale))
        setSaleProducts(allSaleProducts)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching:', error)
        setLoading(false)
      }
    }
    fetchSaleProducts()

    // Загружаем избранное из localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    setFavorites(savedFavorites)
  }, [])

  const calculatePrice = (price, sale) => {
    const num = parseFloat(price.replace('$', ''))
    return (num - (num * (parseInt(sale) / 100))).toFixed(2)
  }

  const getColors = (p) => {
    const c = []
    if (p.avatar) c.push({ name: 'black', hex: '#1e212c', img: p.avatar })
    if (p.avatarwhite) c.push({ name: 'white', hex: '#ffffff', img: p.avatarwhite })
    if (p.avatarblue) c.push({ name: 'blue', hex: '#17696a', img: p.avatarblue })
    if (p.avatarred) c.push({ name: 'red', hex: '#ff4242', img: p.avatarred })
    if (p.avataryellow) c.push({ name: 'yellow', hex: '#ffb400', img: p.avataryellow })
    if (p.avatargreen) c.push({ name: 'green', hex: '#4CAF50', img: p.avatargreen })
    return c
  }

  const handleAddToWishlist = (product) => {
    const currentFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    
    // Проверяем, есть ли уже товар в избранном
    const isAlreadyFavorite = currentFavorites.some(fav => 
      fav.id === product.id && fav.source === 'sale-section'
    )
    
    if (isAlreadyFavorite) {
      // Удаляем из избранного
      const updatedFavorites = currentFavorites.filter(fav => 
        !(fav.id === product.id && fav.source === 'sale-section')
      )
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      setFavorites(updatedFavorites)
      
      // Показываем уведомление об удалении
      showNotification('Removed from favorites', '💔')
    } else {
      // Добавляем в избранное
      const productToSave = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.replace('$', '')),
        basePrice: parseFloat(product.price.replace('$', '')),
        discount: product.sale,
        hasDiscount: true,
        imageUrl: product.avatar || '',
        color: 'black',
        source: 'sale-section',
        addedAt: new Date().toISOString()
      }
      
      const updatedFavorites = [...currentFavorites, productToSave]
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      setFavorites(updatedFavorites)
      
      // Показываем уведомление о добавлении
      showNotification('Added to favorites', '❤️')
    }
    
    // Триггерим событие обновления избранного
    window.dispatchEvent(new Event('favoritesUpdated'))
  }

  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || []
    const productId = product.id
    const selectedSize = selectedSizes[productId] || '38'
    const selectedColor = selectedColors[productId] || 'black'
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItemIndex = currentCart.findIndex(item => 
      item.id === productId && 
      item.size === selectedSize && 
      item.color === selectedColor
    )
    
    const cartItem = {
      id: `${productId}-${Date.now()}`,
      productId: productId,
      name: product.name,
      price: parseFloat(product.price.replace('$', '')),
      basePrice: parseFloat(product.price.replace('$', '')),
      discount: product.sale,
      hasDiscount: true,
      size: selectedSize,
      quantity: 1,
      color: selectedColor,
      imageUrl: product.avatar || '',
      source: 'sale-section',
      addedAt: new Date().toISOString()
    }
    
    if (existingItemIndex !== -1) {
      // Увеличиваем количество, если товар уже в корзине
      currentCart[existingItemIndex].quantity += 1
    } else {
      // Добавляем новый товар
      currentCart.push(cartItem)
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart))
    
    // Показываем уведомление
    showNotification('Added to cart', '🛒')
    
    // Триггерим событие обновления корзины
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const showNotification = (message, icon) => {
    // Создаем временное уведомление
    const notification = document.createElement('div')
    notification.className = 'salemin-notification'
    notification.innerHTML = `
      <div class="salemin-notification-content">
        <span class="salemin-notification-icon">${icon}</span>
        <span class="salemin-notification-text">${message}</span>
      </div>
    `
    document.body.appendChild(notification)
    
    // Удаляем через 2 секунды
    setTimeout(() => {
      notification.classList.add('fade-out')
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 2000)
  }

  const isProductInFavorites = (product) => {
    return favorites.some(fav => 
      fav.id === product.id && fav.source === 'sale-section'
    )
  }

  if (loading) return <div className="salemin-loading">Loading sale products...</div>

  return (
    <div className="salemin-container">
      {/* Заголовок и навигация как в оригинальном Salemin */}
      <div className="salemin-header">
        <h1 className="salemin-title">Sale up to 70%</h1>
        <div className="slider-navigation">
          <button 
            className="nav-btn prev-btn" 
            aria-label="Previous slide"
            onClick={() => swiperRef.current?.swiper?.slidePrev()}
          >
            ←  
          </button>
          <button 
            className="nav-btn next-btn" 
            aria-label="Next slide"
            onClick={() => swiperRef.current?.swiper?.slideNext()}
          >
            →
          </button>
        </div>
      </div>

      <div className="salemin-swiper-container">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 20 }
          }}
          className="salemin-swiper"
        >
          {saleProducts.map((product, index) => {
            const colors = getColors(product)
            const activeColor = selectedColors[product.id] || colors[0]?.name || 'black'
            const currentImg = colors.find(c => c.name === activeColor)?.img || product.avatar
            const activeSize = selectedSizes[product.id] || '38'
            const isFavorite = isProductInFavorites(product)
            
            return (
              <SwiperSlide key={`${product.id}-${index}`}>
                <div className="product-card">
                  <div className="badge">-{product.sale}%</div>
                  <button 
                    className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
                    title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToWishlist(product)
                    }}
                  >
                    {isFavorite ? '❤️' : '♡'}
                  </button>
                  
                  <div className="image-wrap">
                    <img 
                      src={currentImg} 
                      alt={`${product.name} in ${activeColor}`} 
                    />
                  </div>

                  <div className="content">
                    <h3 className="name">{product.name}</h3>
                    <div className="prices">
                      <span className="current">${calculatePrice(product.price, product.sale)}</span>
                      <span className="old">{product.price}</span>
                    </div>

                    <div className="hover-reveal">
                      <div className="size-selector">
                        {['36', '37', '38', '39', '40'].map(size => (
                          <button 
                            key={`${product.id}-size-${size}`}
                            className={`size-tag ${activeSize === size ? 'active' : ''}`}
                            onClick={() => setSelectedSizes({...selectedSizes, [product.id]: size})}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      <div className="color-selector">
                        {colors.map((c, colorIndex) => (
                          <button 
                            key={`${product.id}-color-${c.name}-${colorIndex}`}
                            className={`color-circle ${activeColor === c.name ? 'active' : ''}`}
                            style={{ backgroundColor: c.hex }}
                            onClick={() => setSelectedColors({...selectedColors, [product.id]: c.name})}
                            title={c.name}
                            aria-label={`Select ${c.name} color`}
                          />
                        ))}
                      </div>

                      <button 
                        className="add-to-cart"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                      >
                        <span>🛒</span> Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      {/* Кнопка View All */}
      <div className="footer-action">
        <button className="view-all-btn">
          View all sale products
        </button>
      </div>
    </div>
  )
}

export default Salemin