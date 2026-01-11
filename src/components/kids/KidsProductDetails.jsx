import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    FaHandPaper,
    FaBan,
    FaSoap,
    FaWind,
    FaStar,
    FaRegStar,
    FaShoppingCart
} from "react-icons/fa";
// import "./ProductDetails.css";

/* ================= КОМПОНЕНТЫ УВЕДОМЛЕНИЙ ================= */

// 1. Уведомление "Added to Cart"
function CartAddedNotification({ isOpen, onClose, product, size, color, quantity, onViewCart }) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [isHiding, setIsHiding] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        if (!isOpen) return;
        
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItemsCount(cart.reduce((total, item) => total + item.quantity, 0));
        
        const total = cart.reduce((sum, item) => {
            const price = item.hasDiscount && item.discount 
                ? item.price * (1 - item.discount / 100)
                : item.price;
            return sum + (price * item.quantity);
        }, 0);
        setCartTotal(total.toFixed(2));

        setIsVisible(true);
        setIsHiding(false);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 300);
    }, [onClose]);

    const handleViewCart = useCallback(() => {
        if (onViewCart) onViewCart();
        handleClose();
    }, [onViewCart, handleClose]);

    const getColorHex = useCallback((colorName) => {
        const colors = {
            black: '#000000',
            white: '#ffffff',
            red: '#ef4444',
            blue: '#3b82f6',
            green: '#10b981',
            yellow: '#f59e0b',
            purple: '#8b5cf6',
            pink: '#ec4899',
            gray: '#6b7280',
            brown: '#92400e',
            navy: '#1e3a8a',
        };
        return colors[colorName?.toLowerCase()] || '#6b7280';
    }, []);

    if (!isVisible) return null;

    return (
        <div className="notification-container">
            <div className={`notification cart-added ${isHiding ? 'hiding' : ''}`}>
                <div className="notification-progress">
                    <div className="notification-progress-bar"></div>
                </div>
                
                <div className="notification-header">
                    <div className="notification-icon-circle">
                        <span className="notification-icon">✓</span>
                    </div>
                    <div className="notification-titles">
                        <h3 className="notification-title">Added to Cart</h3>
                        <p className="notification-subtitle">Item successfully added to your shopping cart</p>
                    </div>
                    <button className="notification-close-btn" onClick={handleClose}>
                        ×
                    </button>
                </div>
                
                <div className="notification-body">
                    <div className="cart-product-preview">
                        <div className="cart-product-image">
                            <img 
                                src={product.imageUrl || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop"} 
                                alt={product.name}
                            />
                        </div>
                        <div className="cart-product-info">
                            <h4 className="cart-product-name">{product.name}</h4>
                            <div className="cart-product-details">
                                {color && (
                                    <span className="cart-product-color">
                                        <span 
                                            className="cart-color-dot" 
                                            style={{ backgroundColor: getColorHex(color) }}
                                        />
                                        {color}
                                    </span>
                                )}
                                {size && (
                                    <span className="cart-product-size">
                                        <span>Size:</span> {size}
                                    </span>
                                )}
                                {quantity > 1 && (
                                    <span className="cart-product-qty">
                                        <span>Qty:</span> {quantity}
                                    </span>
                                )}
                            </div>
                            <div className="cart-product-price">
                                ${(product.price * quantity).toFixed(2)}
                            </div>
                        </div>
                    </div>
                    
                    {cartItemsCount > 1 && (
                        <div className="cart-summary">
                            <div className="cart-count">
                                <span className="cart-count-number">{cartItemsCount}</span>
                                <span>items in cart</span>
                            </div>
                            <div className="cart-total-price">${cartTotal}</div>
                        </div>
                    )}
                    
                    <div className="notification-actions">
                        <button className="notification-btn continue" onClick={handleClose}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Continue Shopping
                        </button>
                        <button className="notification-btn view-cart" onClick={handleViewCart}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 2H3.33333L5.2 9.592C5.30213 10.0251 5.59046 10.396 5.996 10.618C6.40153 10.84 6.8896 10.8927 7.33333 10.764H12.6667C13.1104 10.8927 13.5985 10.84 14.004 10.618C14.4095 10.396 14.6979 10.0251 14.8 9.592L16 4.66667H4.66667M6.66667 14C6.66667 14.3682 6.36819 14.6667 6 14.6667C5.63181 14.6667 5.33333 14.3682 5.33333 14C5.33333 13.6318 5.63181 13.3333 6 13.3333C6.36819 13.3333 6.66667 13.6318 6.66667 14ZM13.3333 14C13.3333 14.3682 13.0349 14.6667 12.6667 14.6667C12.2985 14.6667 12 14.3682 12 14C12 13.6318 12.2985 13.3333 12.6667 13.3333C13.0349 13.3333 13.3333 13.6318 13.3333 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            View Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 2. Уведомление о выборе размера
function SizeWarningNotification({ isOpen, onClose, onSizeSelect }) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [isHiding, setIsHiding] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

    useEffect(() => {
        if (!isOpen) return;
        setIsVisible(true);
        setIsHiding(false);
        setSelectedSize(null);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 400);
    }, [onClose]);

    const handleSizeSelect = useCallback((size) => {
        setSelectedSize(size);
    }, []);

    const handleConfirm = useCallback(() => {
        if (selectedSize && onSizeSelect) {
            onSizeSelect(selectedSize);
        }
        handleClose();
    }, [selectedSize, onSizeSelect, handleClose]);

    if (!isVisible) return null;

    return (
        <div className="notification-container">
            <div className={`notification size-warning ${isHiding ? 'hiding' : ''}`}>
                <div className="notification-progress">
                    <div className="notification-progress-bar"></div>
                </div>
                
                <div className="notification-header">
                    <button className="notification-close-btn" onClick={handleClose}>
                        ×
                    </button>
                    
                    <div className="notification-icon-circle">
                        <span className="notification-icon">⚠️</span>
                    </div>
                    
                    <h3 className="notification-title">Select a Size</h3>
                    <p className="notification-subtitle">
                        Please choose your size before adding to cart
                    </p>
                </div>
                
                <div className="notification-body size-selector-body">
                    <p style={{ marginBottom: '20px', color: '#64748b' }}>
                        Available sizes for this product:
                    </p>
                    
                    <div className="size-options">
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => handleSizeSelect(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    
                    <div className="notification-actions">
                        <button className="notification-btn cancel" onClick={handleClose}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 12L12 4M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Cancel
                        </button>
                        <button 
                            className="notification-btn primary" 
                            onClick={handleConfirm}
                            disabled={!selectedSize}
                            style={{ opacity: selectedSize ? 1 : 0.6 }}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 4L5.99996 11.3333L2.66663 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Confirm Size
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 3. Уведомление об удалении из избранного
function FavoriteRemovedNotification({ isOpen, onClose, onUndo, product }) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setIsVisible(true);
        setIsHiding(false);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 400);
    }, [onClose]);

    const handleUndo = useCallback(() => {
        if (onUndo) onUndo();
        handleClose();
    }, [onUndo, handleClose]);

    if (!isVisible) return null;

    return (
        <div className="notification-container">
            <div className={`notification favorite-removed ${isHiding ? 'hiding' : ''}`}>
                <div className="notification-progress">
                    <div className="notification-progress-bar"></div>
                </div>
                
                <div className="notification-header">
                    <button className="notification-close-btn" onClick={handleClose}>
                        ×
                    </button>
                    
                    <div className="notification-icon-circle">
                        <span className="notification-icon">💔</span>
                    </div>
                    
                    <h3 className="notification-title">Removed from Favorites</h3>
                    <p className="notification-subtitle">
                        Item has been removed from your wishlist
                    </p>
                </div>
                
                <div className="notification-body favorite-removed-body">
                    {product && (
                        <div className="favorite-product-info">
                            <div className="favorite-product-image">
                                <img 
                                    src={product.imageUrl || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop"} 
                                    alt={product.name}
                                />
                            </div>
                            <div className="favorite-product-details">
                                <h4 className="favorite-product-name">{product.name}</h4>
                                <p className="favorite-product-price">${product.price?.toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="undo-action">
                        <button className="undo-btn" onClick={handleUndo}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M1.33337 8.00008C1.33337 11.6761 4.32404 14.6667 8.00004 14.6667C11.676 14.6667 14.6667 11.6761 14.6667 8.00008C14.6667 4.32408 11.676 1.33341 8.00004 1.33341C5.06404 1.33341 2.57871 3.08941 1.69204 5.66675M1.33337 3.33341V5.66675H3.66671" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Undo
                        </button>
                    </div>
                    
                    <div className="notification-actions" style={{ marginTop: '24px' }}>
                        <button className="notification-btn cancel" onClick={handleClose}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 6L6 10M6 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Close
                        </button>
                        <button className="notification-btn primary" onClick={handleClose}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 2H3.33333L5.2 9.592C5.30213 10.0251 5.59046 10.396 5.996 10.618C6.40153 10.84 6.8896 10.8927 7.33333 10.764H12.6667C13.1104 10.8927 13.5985 10.84 14.004 10.618C14.4095 10.396 14.6979 10.0251 14.8 9.592L16 4.66667H4.66667M6.66667 14C6.66667 14.3682 6.36819 14.6667 6 14.6667C5.63181 14.6667 5.33333 14.3682 5.33333 14C5.33333 13.6318 5.63181 13.3333 6 13.3333C6.36819 13.3333 6.66667 13.6318 6.66667 14ZM13.3333 14C13.3333 14.3682 13.0349 14.6667 12.6667 14.6667C12.2985 14.6667 12 14.3682 12 14C12 13.6318 12.2985 13.3333 12.6667 13.3333C13.0349 13.3333 13.3333 13.6318 13.3333 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            View Similar Items
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 4. Уведомление о добавлении в избранное
function FavoriteAddedNotification({ isOpen, onClose, product }) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setIsVisible(true);
        setIsHiding(false);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 400);
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div className="notification-container">
            <div className={`notification favorite-added ${isHiding ? 'hiding' : ''}`}>
                <div className="notification-progress">
                    <div className="notification-progress-bar"></div>
                </div>
                
                <div className="notification-header">
                    <button className="notification-close-btn" onClick={handleClose}>
                        ×
                    </button>
                    
                    <div className="notification-icon-circle">
                        <span className="notification-icon">❤️</span>
                    </div>
                    
                    <h3 className="notification-title">Added to Favorites</h3>
                    <p className="notification-subtitle">
                        Item successfully added to your wishlist
                    </p>
                </div>
                
                <div className="notification-body">
                    {product && (
                        <div className="favorite-product-info">
                            <div className="favorite-product-image">
                                <img 
                                    src={product.imageUrl || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop"} 
                                    alt={product.name}
                                />
                            </div>
                            <div className="favorite-product-details">
                                <h4 className="favorite-product-name">{product.name}</h4>
                                <p className="favorite-product-price">${product.price?.toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="notification-actions">
                        <button className="notification-btn cancel" onClick={handleClose}>
                            Continue Shopping
                        </button>
                        <button className="notification-btn primary" onClick={handleClose}>
                            View Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================= ФУНКЦИИ ДЛЯ РАБОТЫ С ХРАНИЛИЩЕМ ================= */

const addToCart = (product, size, color, quantity = 1, imageUrl) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartItemId = Date.now();
    
    const item = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        basePrice: product.basePrice || product.price,
        discount: product.discount || 0,
        hasDiscount: product.hasDiscount || false,
        size: size,
        quantity: quantity,
        color: color,
        imageUrl: imageUrl || product.avatar || product.avatargreen || "",
        variant: product.variant || product.kategory || "",
        timestamp: Date.now()
    };
    
    const existingItemIndex = existingCart.findIndex(cartItem => 
        cartItem.productId === item.productId && 
        cartItem.size === item.size && 
        cartItem.color === item.color
    );
    
    if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += quantity;
    } else {
        existingCart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    return item;
};

const addToFavorites = (product, color, imageUrl) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    const favoriteItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: imageUrl,
        color: color,
        timestamp: Date.now()
    };

    const isAlreadyFavorite = favorites.some(fav => 
        fav.productId === favoriteItem.productId && 
        fav.color === favoriteItem.color
    );
    
    if (!isAlreadyFavorite) {
        favorites.push(favoriteItem);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        window.dispatchEvent(new Event('favoritesUpdated'));
        return { success: true, item: favoriteItem };
    } else {
        const updatedFavorites = favorites.filter(fav => 
            !(fav.productId === favoriteItem.productId && fav.color === favoriteItem.color)
        );
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        window.dispatchEvent(new Event('favoritesUpdated'));
        return { success: false, item: favoriteItem };
    }
};

/* ================= КОМПОНЕНТ KIDS PRODUCT DETAILS ================= */

export function KidsProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`https://6947cef21ee66d04a44dfb36.mockapi.io/kids/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                const basePrice = Number(data.price.replace("$", ""));
                const discount = data.sale ? Number(data.sale) : null;
                const price = discount
                    ? +(basePrice * (1 - discount / 100)).toFixed(2)
                    : basePrice;

                setProduct({
                    ...data,
                    basePrice,
                    price,
                    discount,
                    hasDiscount: !!data.sale,
                });
                setError(null);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Failed to load product");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading-state">Loading...</div>;
    if (error) return <div className="error-state">{error}</div>;
    if (!product) return <div className="error-state">Product not found</div>;

    return (
        <div className="product-page-wrapper">
            <div className="container">
                <h2 className="main-details-title">Details</h2>
                <Content product={product} />
            </div>
        </div>
    );
}

function Content({ product }) {
    // Состояния для уведомлений
    const [showCartAdded, setShowCartAdded] = useState(false);
    const [showSizeWarning, setShowSizeWarning] = useState(false);
    const [showFavoriteAdded, setShowFavoriteAdded] = useState(false);
    const [showFavoriteRemoved, setShowFavoriteRemoved] = useState(false);
    
    // Данные для уведомлений
    const [cartNotificationData, setCartNotificationData] = useState(null);
    const [favoriteNotificationData, setFavoriteNotificationData] = useState(null);
    const [lastFavoriteItem, setLastFavoriteItem] = useState(null);
    
    // Количество товара
    const [quantity, setQuantity] = useState(1);

    // Формируем список доступных цветов для kids
    const colorMap = useMemo(() => {
        const colors = [
            { name: "black", label: "Black", src: product.avatar },
            { name: "white", label: "White", src: product.avatarwhite },
            { name: "blue", label: "Blue", src: product.avatarblue },
            { name: "green", label: "Green", src: product.avatargreen },
        ].filter(c => c.src && c.src.trim() !== "");
        
        return colors.length > 0 ? colors : [
            { name: "default", label: "Default", src: product.avatar || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop" }
        ];
    }, [product]);

    // Массив для слайдера: [Клон последнего, Оригиналы..., Клон первого]
    const slides = useMemo(() => {
        if (!colorMap.length) return [];
        const images = colorMap.map((c) => c.src);
        if (images.length === 1) return images;
        return [images[images.length - 1], ...images, images[0]];
    }, [colorMap]);

    const [index, setIndex] = useState(colorMap.length > 1 ? 1 : 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeSize, setActiveSize] = useState("S");
    const [rating, setRating] = useState(4);
    const [isFavorite, setIsFavorite] = useState(false);

    // Определяем активный цвет для подсветки точек
    const activeColorName = useMemo(() => {
        if (colorMap.length <= 1) return colorMap[0]?.name;
        if (index === 0) return colorMap[colorMap.length - 1]?.name;
        if (index === slides.length - 1) return colorMap[0]?.name;
        return colorMap[index - 1]?.name;
    }, [index, colorMap, slides.length]);

    // Получаем активный цвет и изображение
    const activeColor = useMemo(() => {
        if (colorMap.length <= 1) return colorMap[0];
        if (index === 0) return colorMap[colorMap.length - 1];
        if (index === slides.length - 1) return colorMap[0];
        return colorMap[index - 1];
    }, [index, colorMap, slides.length]);

    // ГЛАВНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ
    const handleSlideChange = useCallback((newIndex) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setIndex(newIndex);
    }, [isAnimating]);

    const onTransitionEnd = useCallback(() => {
        setIsAnimating(false);

        if (colorMap.length <= 1) return;

        // Если дошли до левого края (клон последнего фото)
        if (index === 0) {
            setIndex(slides.length - 2);
        }
        // Если дошли до правого края (клон первого фото)
        if (index === slides.length - 1) {
            setIndex(1);
        }
    }, [index, slides.length, colorMap.length]);

    const handleQuantityChange = useCallback((change) => {
        setQuantity(prev => {
            const newQuantity = prev + change;
            return Math.max(1, Math.min(10, newQuantity));
        });
    }, []);

    const handleAddToCart = useCallback(() => {
        if (!activeSize) {
            setShowSizeWarning(true);
            return;
        }

        const addedItem = addToCart(product, activeSize, activeColorName, quantity, activeColor?.src);
        
        // Показываем уведомление о добавлении в корзину
        setCartNotificationData({
            product: {
                ...product,
                imageUrl: activeColor?.src
            },
            size: activeSize,
            color: activeColorName,
            quantity: quantity
        });
        setShowCartAdded(true);
    }, [product, activeSize, activeColorName, quantity, activeColor]);

    const handleToggleFavorite = useCallback(() => {
        const result = addToFavorites(product, activeColorName, activeColor?.src);
        
        setLastFavoriteItem(result.item);
        setIsFavorite(result.success);
        
        if (result.success) {
            // Показываем уведомление о добавлении в избранное
            setFavoriteNotificationData({
                product: {
                    ...product,
                    imageUrl: activeColor?.src
                }
            });
            setShowFavoriteAdded(true);
        } else {
            // Показываем уведомление об удалении из избранного
            setFavoriteNotificationData({
                product: {
                    ...product,
                    imageUrl: activeColor?.src
                }
            });
            setShowFavoriteRemoved(true);
        }
    }, [product, activeColorName, activeColor]);

    // Обработчик выбора размера из уведомления
    const handleSizeSelectFromNotification = useCallback((selectedSize) => {
        setActiveSize(selectedSize);
        
        // Автоматически добавляем в корзину после выбора размера
        setTimeout(() => {
            const addedItem = addToCart(product, selectedSize, activeColorName, quantity, activeColor?.src);
            
            // Показываем уведомление о добавлении в корзину
            setCartNotificationData({
                product: {
                    ...product,
                    imageUrl: activeColor?.src
                },
                size: selectedSize,
                color: activeColorName,
                quantity: quantity
            });
            setShowCartAdded(true);
        }, 300);
    }, [product, activeColorName, quantity, activeColor]);

    // Обработчик отмены удаления из избранного
    const handleUndoRemoveFavorite = useCallback(() => {
        if (lastFavoriteItem) {
            // Добавляем обратно в избранное
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites.push(lastFavoriteItem);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            window.dispatchEvent(new Event('favoritesUpdated'));
            
            setIsFavorite(true);
            
            // Показываем уведомление о добавлении в избранное
            setFavoriteNotificationData({
                product: {
                    ...product,
                    imageUrl: lastFavoriteItem.imageUrl
                }
            });
            setShowFavoriteAdded(true);
        }
    }, [lastFavoriteItem]);

    // Обработчик открытия корзины
    const handleViewCart = useCallback(() => {
        // Здесь можно добавить логику открытия корзины
        console.log("Opening cart...");
        // Например: navigate('/cart') или window.dispatchEvent(new Event('openCart'));
    }, []);

    // Проверяем, есть ли товар в избранном
    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isProductFavorite = favorites.some(fav => 
            fav.productId === product.id && 
            fav.color === activeColorName
        );
        setIsFavorite(isProductFavorite);
    }, [product.id, activeColorName]);

    return (
        <div className="product-layout">
            {/* ЛЕВАЯ КОЛОНКА: ИНФОРМАЦИЯ */}
            <div className="text-info-column">
                <p className="intro-text">
                    Premium comfort and style for kids.
                    Designed for durability, play, and everyday wear.
                </p>

                <section className="info-block">
                    <h4 className="info-subtitle">Details</h4>
                    <ul className="info-list">
                        <li><strong>Brand:</strong> Kids Collection</li>
                        <li>Child-friendly design</li>
                        <li>Easy fastening system</li>
                        <li>Non-slip soles</li>
                        <li>Safe materials</li>
                    </ul>
                </section>

                <hr className="divider" />

                <section className="info-block">
                    <h4 className="info-subtitle">Fabric</h4>
                    <ul className="info-list">
                        <li><strong>Upper:</strong> Premium kid-friendly materials</li>
                        <li><strong>Lining:</strong> Soft breathable fabric</li>
                        <li><strong>Sole:</strong> Flexible non-slip rubber</li>
                    </ul>
                </section>

                <hr className="divider" />

                <section className="info-block">
                    <h4 className="info-subtitle">Care Instructions</h4>
                    <ul className="info-list care-list">
                        <li><FaHandPaper /> Hand wash recommended</li>
                        <li><FaBan /> Avoid high-temperature drying</li>
                        <li><FaSoap /> Use mild detergent</li>
                        <li><FaWind /> Air dry naturally</li>
                    </ul>
                </section>

                <hr className="divider" />

                <section className="info-block">
                    <h4 className="info-subtitle">Safety Features</h4>
                    <ul className="info-list">
                        <li>Non-toxic materials</li>
                        <li>Reinforced seams</li>
                        <li>Hypoallergenic</li>
                        <li>Age-appropriate sizing</li>
                    </ul>
                </section>
            </div>

            {/* ПРАВАЯ КОЛОНКА: СЛАЙДЕР И КАРТОЧКА */}
            <div className="sticky-card-column">
                <div className="card-exact">
                    <div className="image-wrapper-exact">
                        {product.hasDiscount && (
                            <div className="badge-exact">-{product.discount}%</div>
                        )}

                        <div className="rating-exact">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`star-icon ${i < rating ? "filled" : "empty"}`}
                                    onClick={() => setRating(i + 1)}
                                >
                                    {i < rating ? <FaStar /> : <FaRegStar />}
                                </span>
                            ))}
                        </div>

                        <div className="img-container viewport">
                            {colorMap.length > 1 && (
                                <button
                                    className="slider-btn left"
                                    onClick={() => handleSlideChange(index - 1)}
                                >
                                    ‹
                                </button>
                            )}

                            <div
                                className="slider-track-details"
                                style={{
                                    transform: `translateX(-${index * 100}%)`,
                                    transition: isAnimating ? "transform 0.45s ease-out" : "none",
                                }}
                                onTransitionEnd={onTransitionEnd}
                            >
                                {slides.map((img, i) => (
                                    <img 
                                        key={i} 
                                        src={img} 
                                        className="image-exact slide-img" 
                                        alt={`${product.name} - view ${i + 1}`} 
                                    />
                                ))}
                            </div>

                            {colorMap.length > 1 && (
                                <button
                                    className="slider-btn right"
                                    onClick={() => handleSlideChange(index + 1)}
                                >
                                    ›
                                </button>
                            )}
                        </div>

                        <button 
                            className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
                            onClick={handleToggleFavorite}
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorite ? '❤' : '🤍'}
                        </button>
                    </div>

                    <div className="card-body-exact">
                        <p className="category-text">{product.kategory}</p>
                        <h4 className="title-text">{product.name}</h4>

                        <div className="price-row">
                            <span className="price-current">${product.price.toFixed(2)}</span>
                            {product.hasDiscount && (
                                <span className="price-old">${product.basePrice.toFixed(2)}</span>
                            )}
                        </div>

                        <div className="selection-area">
                            <div className="selector-group">
                                <label className="selector-label">Size:</label>
                                <div className="sizes-block">
                                    {["XS", "S", "M", "L", "XL"].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            className={`size-option ${activeSize === s ? "active" : ""}`}
                                            onClick={() => setActiveSize(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="selector-group">
                                <label className="selector-label">Color:</label>
                                <div className="colors-block">
                                    {colorMap.map((color, i) => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            className={`dot d-${color.name} ${activeColorName === color.name ? "active" : ""}`}
                                            onClick={() => handleSlideChange(colorMap.length > 1 ? i + 1 : i)}
                                            title={color.label}
                                            aria-label={`Select ${color.label} color`}
                                        />
                                    ))}
                                </div>
                                {activeColor && (
                                    <p className="selected-color-text">Selected: {activeColor.label}</p>
                                )}
                            </div>

                            <div className="selector-group">
                                <label className="selector-label">Quantity:</label>
                                <div className="quantity-selector">
                                    <button 
                                        className="qty-btn minus" 
                                        onClick={() => handleQuantityChange(-1)} 
                                        disabled={quantity <= 1}
                                        type="button"
                                    >
                                        −
                                    </button>
                                    <span className="qty-display">{quantity}</span>
                                    <button 
                                        className="qty-btn plus" 
                                        onClick={() => handleQuantityChange(1)} 
                                        disabled={quantity >= 10}
                                        type="button"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button 
                                className="add-cart-btn" 
                                onClick={handleAddToCart}
                                type="button"
                            >
                                <FaShoppingCart /> Add to cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* УВЕДОМЛЕНИЯ */}
            {/* ADDED TO CART NOTIFICATION */}
            {showCartAdded && cartNotificationData && (
                <CartAddedNotification
                    isOpen={showCartAdded}
                    onClose={() => setShowCartAdded(false)}
                    product={cartNotificationData.product}
                    size={cartNotificationData.size}
                    color={cartNotificationData.color}
                    quantity={cartNotificationData.quantity}
                    onViewCart={handleViewCart}
                />
            )}

            {/* SIZE WARNING NOTIFICATION */}
            <SizeWarningNotification
                isOpen={showSizeWarning}
                onClose={() => setShowSizeWarning(false)}
                onSizeSelect={handleSizeSelectFromNotification}
            />

            {/* FAVORITE ADDED NOTIFICATION */}
            {showFavoriteAdded && favoriteNotificationData && (
                <FavoriteAddedNotification
                    isOpen={showFavoriteAdded}
                    onClose={() => setShowFavoriteAdded(false)}
                    product={favoriteNotificationData.product}
                />
            )}

            {/* FAVORITE REMOVED NOTIFICATION */}
            {showFavoriteRemoved && favoriteNotificationData && (
                <FavoriteRemovedNotification
                    isOpen={showFavoriteRemoved}
                    onClose={() => setShowFavoriteRemoved(false)}
                    onUndo={handleUndoRemoveFavorite}
                    product={favoriteNotificationData.product}
                />
            )}
        </div>
    );
}