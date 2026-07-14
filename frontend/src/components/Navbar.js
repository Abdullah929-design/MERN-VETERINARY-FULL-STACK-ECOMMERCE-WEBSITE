import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartModal from './Cart/CartModal';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { token, role, logout } = useAuth();
  const { items } = useCart();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCartClick = () => {
    if (!token) {
      alert('Please login to view your cart');
      return;
    }
    setIsCartOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-surface-container-lowest border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-container-max mx-auto">
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="material-symbols-outlined text-emerald-brand text-[28px] group-hover:scale-110 transition-transform">pets</span>
              <span className="font-display-xl text-[20px] font-bold text-primary tracking-tight">PetStore</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="font-label-sm text-label-sm text-primary font-bold hover:text-emerald-brand transition-colors">
                Shop
              </Link>
              <Link to="/about" className="font-label-sm text-label-sm text-on-surface-variant font-medium hover:text-primary transition-colors">
                About
              </Link>
              {token && (
                <Link to="/track-orders" className="font-label-sm text-label-sm text-on-surface-variant font-medium hover:text-primary transition-colors">
                  My Orders
                </Link>
              )}
              {role === 'admin' && (
                <Link to="/admin" className="font-label-sm text-label-sm text-on-surface-variant font-medium hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl px-6">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search veterinary products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F1F5F9] border-none rounded-lg px-10 py-2.5 font-body-md text-body-md focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">
                search
              </span>
            </form>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-6">
            <button
              onClick={handleCartClick}
              className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors relative"
              aria-label="Shopping Cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {token && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-brand text-white text-[10px] flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {!token ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 border border-outline text-primary rounded-lg font-bold hover:bg-surface-container transition-all text-sm">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-emerald-brand text-on-tertiary rounded-lg font-bold hover:brightness-110 transition-all text-sm">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden md:block">
                <button onClick={handleLogout} className="px-4 py-2 border border-outline text-primary rounded-lg font-bold hover:bg-surface-container transition-all text-sm">
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="md:hidden flex items-center text-on-surface-variant hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant bg-surface-container-lowest px-8 py-4 space-y-4">
            <Link to="/" className="block font-label-sm text-label-sm text-primary font-bold" onClick={toggleMobileMenu}>
              Shop
            </Link>
            <Link to="/about" className="block font-label-sm text-label-sm text-on-surface-variant font-medium" onClick={toggleMobileMenu}>
              About
            </Link>
            {token && (
              <Link to="/track-orders" className="block font-label-sm text-label-sm text-on-surface-variant font-medium" onClick={toggleMobileMenu}>
                My Orders
              </Link>
            )}
            {role === 'admin' && (
              <Link to="/admin" className="block font-label-sm text-label-sm text-on-surface-variant font-medium" onClick={toggleMobileMenu}>
                Admin
              </Link>
            )}
            <hr className="border-outline-variant" />
            {!token ? (
              <div className="flex gap-4">
                <Link to="/login" className="flex-1 text-center px-4 py-2 border border-outline text-primary rounded-lg font-bold hover:bg-surface-container text-sm" onClick={toggleMobileMenu}>
                  Login
                </Link>
                <Link to="/signup" className="flex-1 text-center px-4 py-2 bg-emerald-brand text-on-tertiary rounded-lg font-bold hover:brightness-110 text-sm" onClick={toggleMobileMenu}>
                  Sign Up
                </Link>
              </div>
            ) : (
              <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="w-full text-center px-4 py-2 border border-outline text-primary rounded-lg font-bold hover:bg-surface-container text-sm">
                Logout
              </button>
            )}
          </div>
        )}
      </header>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Navbar;
