import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
  const { 
    items, 
    total, 
    loading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    clearError 
  } = useCart();

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary">Shopping Cart</h2>
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors group" onClick={onClose} aria-label="Close cart">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">close</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-error-container text-error rounded-lg flex justify-between items-center text-sm">
            <span>{error}</span>
            <button onClick={clearError} className="font-bold hover:opacity-80">×</button>
          </div>
        )}

        {/* Loading Message */}
        {loading && (
          <div className="p-6 text-center text-on-surface-variant">Loading cart...</div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">shopping_cart</span>
            <p className="font-headline-md text-primary mb-6">Your cart is empty</p>
            <button onClick={onClose} className="px-6 py-3 bg-emerald-brand text-on-tertiary rounded-lg font-bold hover:brightness-110 transition-all">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-lg transition-all hover:shadow-md">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-surface-bright rounded-lg flex-shrink-0 overflow-hidden border border-outline-variant flex items-center justify-center">
                    <img className="max-w-full max-h-full object-contain" src={item.product.image} alt={item.product.name} />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-label-sm text-label-sm font-bold text-primary">{item.product.name}</h3>
                        <p className="font-label-xs text-label-xs text-on-surface-variant line-clamp-2 mt-1">{item.product.description}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-outline rounded bg-surface-container-lowest">
                        <button 
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center hover:bg-surface-container transition-colors rounded-l disabled:opacity-35"
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <span className="px-3 font-body-md text-body-md font-bold text-primary">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-surface-container transition-colors rounded-r"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right">
                        <span className="font-headline-md text-[18px] text-emerald-brand font-bold">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Shipping Notification */}
              <div className="flex items-center gap-2 p-3 bg-[#E6F4EA] border border-[#A3E2B6] rounded-lg">
                <span className="material-symbols-outlined text-emerald-brand">local_shipping</span>
                <span className="font-label-xs text-label-xs text-[#137333]">This order qualifies for complimentary medical-grade shipping.</span>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-surface-container-low px-6 py-6 border-t border-outline-variant">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-medium text-primary">Rs.{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="text-emerald-brand font-bold uppercase text-xs">FREE</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Tax</span>
                  <span className="font-medium text-primary">Rs.0.00</span>
                </div>
                <div className="h-px bg-outline-variant w-full my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="font-headline-md text-primary">Total</span>
                  <span className="font-headline-md text-primary font-bold">Rs.{total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA Actions */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleCheckout} 
                  className="w-full py-4 bg-emerald-brand text-on-tertiary font-bold text-body-md rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button 
                  onClick={handleClearCart} 
                  className="w-full py-2 bg-transparent text-secondary font-medium text-label-sm rounded-xl hover:bg-surface-container-high transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              
              <p className="text-center mt-4 font-label-xs text-label-xs text-on-surface-variant opacity-60">
                Secure 256-bit SSL Encrypted Payment
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal; 