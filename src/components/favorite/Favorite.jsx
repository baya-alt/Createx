import "./favorite.css";
import { useEffect, useState } from "react";


function CartAddedNotification({ isOpen, onClose, product, size, color, quantity, onViewCart }) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [isHiding, setIsHiding] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItemsCount(cart.length);
        
        const total = cart.reduce((sum, item) => {
            const price = item.hasDiscount && item.discount 
                ? item.price * (1 - item.discount / 100)
                : item.price;
            return sum + (price * item.quantity);
        }, 0);
        setCartTotal(total.toFixed(2));

        if (isOpen) {
            setIsVisible(true);
            setIsHiding(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 300);
    };

    const handleViewCart = () => {
        if (onViewCart) onViewCart();
        handleClose();
    };

    const getColorHex = (colorName) => {
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
    };

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


function FavoriteRemovedNotification({ isOpen, onClose, onUndo, product }) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsHiding(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 400);
    };

    const handleUndo = () => {
        if (onUndo) onUndo();
        handleClose();
    };

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



const addToCartFromFavorites = (item, size = "M", quantity = 1) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartItemId = Date.now();
    
    const cartItem = {
        id: cartItemId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        basePrice: item.basePrice || item.price,
        discount: item.discount || 0,
        hasDiscount: item.hasDiscount || false,
        size: size,
        quantity: quantity,
        color: item.color || "Unknown",
        imageUrl: item.imageUrl || "",
        variant: item.variant || "",
        timestamp: Date.now()
    };
    
    const existingItemIndex = existingCart.findIndex(cartItem => 
        cartItem.productId === item.productId && 
        cartItem.size === cartItem.size && 
        cartItem.color === item.color
    );
    
    if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += quantity;
    } else {
        existingCart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    return cartItem;
};



export default function Favorite({ open, onClose }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    
   
    const [showCartAdded, setShowCartAdded] = useState(false);
    const [showFavoriteRemoved, setShowFavoriteRemoved] = useState(false);
    
   
    const [cartNotificationData, setCartNotificationData] = useState(null);
    const [favoriteNotificationData, setFavoriteNotificationData] = useState(null);
    const [lastRemovedItem, setLastRemovedItem] = useState(null);

    
    useEffect(() => {
        if (open) {
            loadFavorites();
        }
    }, [open]);

    
    useEffect(() => {
        const handleFavoritesUpdated = () => {
            loadFavorites();
        };

        window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
        return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    }, []);

    const loadFavorites = () => {
        try {
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            setFavorites(storedFavorites);
        } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = (item, e) => {
        e.stopPropagation();
        
        try {
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const updatedFavorites = storedFavorites.filter(fav => fav.id !== item.id);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setFavorites(updatedFavorites);
            
            
            setLastRemovedItem(item);
            
            
            setFavoriteNotificationData({
                product: {
                    ...item,
                    name: item.name,
                    price: item.price,
                    imageUrl: item.imageUrl
                }
            });
            setShowFavoriteRemoved(true);
            
            
            window.dispatchEvent(new Event('favoritesUpdated'));
            
            console.log("Removed favorite:", item.id);
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const handleAddToCart = (item) => {
        const cartItem = addToCartFromFavorites(item);
        
        
        setCartNotificationData({
            product: {
                ...item,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl
            },
            size: cartItem.size,
            color: item.color || "Unknown",
            quantity: cartItem.quantity
        });
        setShowCartAdded(true);
        
        
        setTimeout(() => {
            onClose();
        }, 500);
    };

    
    const handleUndoRemoveFavorite = () => {
        if (lastRemovedItem) {
            try {
                const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
                storedFavorites.push(lastRemovedItem);
                localStorage.setItem('favorites', JSON.stringify(storedFavorites));
                setFavorites(storedFavorites);
                
                
                window.dispatchEvent(new Event('favoritesUpdated'));
                
                setLastRemovedItem(null);
                console.log("Undo remove favorite:", lastRemovedItem.id);
            } catch (error) {
                console.error('Error undoing remove:', error);
            }
        }
    };

    
    const handleViewCart = () => {
        
        onClose();
        
        
        console.log("Opening cart...");
        
    };

    const calculateTotal = () => {
        return favorites.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);
    };

    return (
        <>
            {open && <div className="favorite-overlay" onClick={onClose} />}

            <div className={`favorite-drawer ${open ? "open" : ""}`}>
                <div className="favorite-header">
                    <h3>Favorites ({favorites.length})</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="favorite-items">
                    {loading ? (
                        <div className="favorite-loading">Loading...</div>
                    ) : favorites.length === 0 ? (
                        <div className="favorite-empty-state">
                            <div className="empty-heart">💔</div>
                            <p className="favorite-empty">No favorites yet</p>
                            <p className="empty-hint">Add items you love by clicking the heart icon</p>
                            <button className="continue-shopping" onClick={onClose}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            {favorites.map(item => (
                                <FavoriteItem 
                                    key={item.id} 
                                    item={item} 
                                    onRemove={(e) => handleRemoveFavorite(item, e)}
                                    onAddToCart={() => handleAddToCart(item)}
                                />
                            ))}
                        </>
                    )}
                </div>

                {favorites.length > 0 && (
                    <div className="favorite-footer">
                        <div className="favorite-total">
                            <span>Total value:</span>
                            <strong>${calculateTotal()}</strong>
                        </div>
                        <button 
                            className="view-all-btn"
                            onClick={() => {
                                console.log("Navigate to favorites page");
                                
                            }}
                        >
                            View All Favorites
                        </button>
                    </div>
                )}
            </div>

            
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

            
            {showFavoriteRemoved && favoriteNotificationData && (
                <FavoriteRemovedNotification
                    isOpen={showFavoriteRemoved}
                    onClose={() => setShowFavoriteRemoved(false)}
                    onUndo={handleUndoRemoveFavorite}
                    product={favoriteNotificationData.product}
                />
            )}
        </>
    );
}

function FavoriteItem({ item, onRemove, onAddToCart }) {
    return (
        <div className="favorite-item">
            <div className="favorite-thumb">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                ) : (
                    <div className="favorite-thumb-placeholder">
                        <span>No image</span>
                    </div>
                )}
            </div>

            <div className="favorite-info">
                <h4>{item.name}</h4>
                
                {item.color && (
                    <div className="favorite-color">
                        <span 
                            className="color-dot" 
                            style={{ 
                                backgroundColor: getColorHex(item.color),
                                border: item.color.toLowerCase() === 'white' ? '1px solid #ddd' : 'none'
                            }}
                        />
                        <span>{item.color}</span>
                    </div>
                )}
                
                <div className="favorite-price">${(item.price || 0).toFixed(2)}</div>
                
                <div className="favorite-actions">
                    <button 
                        className="add-to-cart-btn"
                        onClick={onAddToCart}
                    >
                        Add to Cart
                    </button>
                    <button 
                        className="favorite-remove"
                        onClick={onRemove}
                        title="Remove from favorites"
                    >
                        🗑 Remove
                    </button>
                </div>
            </div>
        </div>
    );
}


function getColorHex(colorName) {
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
}