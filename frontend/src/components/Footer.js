import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { token, role } = useAuth();

  return (
    <footer className="bg-white border-t border-outline-variant mt-auto font-body-md text-body-md text-on-surface-variant">
      <div className="max-w-container-max mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="material-symbols-outlined text-emerald-brand text-[28px] group-hover:scale-110 transition-transform">pets</span>
              <span className="font-display-xl text-[20px] font-bold text-primary tracking-tight">PetStore</span>
            </Link>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your trusted partner for certified veterinary pharmaceuticals, wellness diets, and premium pet care essentials. Dedicated to clinical excellence and compassionate service.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#137333]">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Board Certified Pharmacy</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Quick Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-brand transition-colors">Shop Products</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-brand transition-colors">About ProVet Elite</Link>
              </li>
              {token && (
                <li>
                  <Link to="/track-orders" className="hover:text-emerald-brand transition-colors">Track Orders</Link>
                </li>
              )}
              {role === 'admin' ? (
                <li>
                  <Link to="/admin" className="text-amber-700 hover:text-amber-800 font-bold">Admin Console</Link>
                </li>
              ) : (
                <li>
                  <Link to="/login" className="hover:text-emerald-brand transition-colors">Sign In</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-4">
            <h3 className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#179d53] text-[18px] shrink-0">pin_drop</span>
                <span>493 Talha Block, Bahria Town, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#179d53] text-[18px]">call</span>
                <span>03324838836</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#179d53] text-[18px]">mail</span>
                <span className="break-all">abdullahsallehaqeel123@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Care Upsell Column */}
          <div className="space-y-4 bg-surface-container-low p-5 rounded-xl border border-outline-variant">
            <h3 className="font-label-xs text-label-xs text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-brand text-[18px]">health_and_safety</span>
              <span>Clinical Integrity</span>
            </h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              All cold-chain logistics and prescription drug storage guidelines are double-checked for compliance before dispatch.
            </p>
            <div className="text-[10px] text-secondary font-bold uppercase tracking-widest pt-1">
              Support 24/7 Enabled
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-on-surface-variant opacity-70">
            © {currentYear} PetStore. All rights reserved. Sourced with clinical precision.
          </p>
          <div className="flex gap-6 opacity-70">
            <Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-primary transition-colors">Logistics Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 