import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './TrackOrders.css';

const TrackOrders = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const url = `${API_BASE_URL}/api/orders/user-orders`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(`Failed to fetch orders: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Network error:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-[#FFF7E6]',
          border: 'border-[#FFD666]',
          text: 'text-[#D48806]',
          icon: 'hourglass_empty',
          label: 'Pending Review'
        };
      case 'confirmed':
        return {
          bg: 'bg-[#E6F4EA]',
          border: 'border-[#A3E2B6]',
          text: 'text-[#137333]',
          icon: 'verified',
          label: 'Approved'
        };
      case 'cancelled':
        return {
          bg: 'bg-[#FCE8E6]',
          border: 'border-[#F1B3B0]',
          text: 'text-[#C5221F]',
          icon: 'cancel',
          label: 'Cancelled'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-600',
          icon: 'info',
          label: status
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-bold">Loading your orders...</p>
      </div>
    );
  }

  const selectedOrder = orders[selectedOrderIndex];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen py-12 px-8">
      <main className="max-w-container-max mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 mb-2 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Shop</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-emerald-brand">Track My Orders</span>
            </nav>
            <h1 className="font-display-xl text-display-xl text-primary leading-tight">Track Your Orders</h1>
            <p className="text-body-lg text-on-surface-variant mt-2">Real-time status of your pet's medical supplies.</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-brand text-on-tertiary rounded-lg font-bold hover:brightness-110 transition-all shadow-sm text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_basket</span>
            <span>Continue Shopping</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-error rounded-lg border border-error/20 text-sm">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-surface-container-lowest rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">local_shipping</span>
            <h2 className="font-headline-md text-primary mb-2 font-bold">No Orders Yet</h2>
            <p className="text-on-surface-variant mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-emerald-brand text-on-tertiary rounded-lg font-bold hover:brightness-110 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Orders List */}
            <div className="lg:col-span-2 space-y-6">
              {orders.map((order, idx) => {
                const style = getStatusBadgeStyle(order.status);
                const isSelected = idx === selectedOrderIndex;
                return (
                  <div 
                    key={order._id} 
                    onClick={() => setSelectedOrderIndex(idx)}
                    className={`bg-surface-container-lowest border rounded-xl p-6 relative overflow-hidden transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'border-emerald-brand shadow-md ring-2 ring-emerald-brand/10' 
                        : 'border-outline-variant shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-brand"></div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider block mb-1">Order Identifier</span>
                        <h2 className="font-headline-md text-headline-md text-primary font-bold">#PS-{order._id.slice(-8).toUpperCase()}</h2>
                        <p className="text-xs text-on-surface-variant mt-1">Placed on {formatDate(order.createdAt)}</p>
                      </div>
                      
                      <div className={`${style.bg} ${style.border} ${style.text} border px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm`}>
                        <span className="material-symbols-outlined text-[18px]">{style.icon}</span>
                        <span>{style.label}</span>
                      </div>
                    </div>

                    {/* Short Items Summary */}
                    <div className="mt-6 pt-4 border-t border-outline-variant/30">
                      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-3">Items list ({order.cartItems.length})</p>
                      <div className="space-y-3">
                        {order.cartItems.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-surface rounded border border-outline-variant overflow-hidden shrink-0 flex items-center justify-center">
                              {item.productId && item.productId.image ? (
                                <img src={item.productId.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <span className="text-lg">📦</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-primary truncate">{item.name}</p>
                              <p className="text-xs text-on-surface-variant">Qty: {item.qty} • Rs.{item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Selected Order Details */}
            {selectedOrder && (
              <div className="space-y-6">
                
                {/* Details Card */}
                <div className="bg-surface-container-lowest shadow-sm border border-outline-variant rounded-xl p-6">
                  <h3 className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold border-b border-outline-variant pb-3 mb-6">Order Details</h3>
                  
                  <div className="space-y-6 text-left">
                    {/* Customer Profile */}
                    <section>
                      <label className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mb-2 block font-bold">Customer Profile</label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-brand text-white flex items-center justify-center font-bold text-sm">
                          {getInitials(selectedOrder.customerName)}
                        </div>
                        <div>
                          <p className="font-body-md text-primary font-bold">{selectedOrder.customerName}</p>
                          <p className="text-xs text-on-surface-variant">Verified Pet Owner</p>
                        </div>
                      </div>
                    </section>
                    
                    <hr className="border-outline-variant" />
                    
                    {/* Logistics */}
                    <section>
                      <label className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mb-2 block font-bold">Shipping Logistics</label>
                      <div className="flex gap-3 items-start">
                        <span className="material-symbols-outlined text-outline mt-0.5">pin_drop</span>
                        <div>
                          <p className="text-sm text-primary font-medium">{selectedOrder.address}</p>
                        </div>
                      </div>
                    </section>
                    
                    <hr className="border-outline-variant" />
                    
                    {/* Payment Protocol */}
                    <section>
                      <label className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mb-2 block font-bold">Payment Protocol</label>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline">payments</span>
                        <div>
                          <p className="text-sm text-primary font-bold">{selectedOrder.paymentMethod}</p>
                          {selectedOrder.transactionId && (
                            <p className="text-xs text-on-surface-variant mt-0.5">TxID: {selectedOrder.transactionId}</p>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Totals */}
                  <div className="mt-8 pt-6 border-t border-outline-variant text-left">
                    <div className="flex justify-between items-center mb-2 text-sm text-on-surface-variant">
                      <span>Subtotal</span>
                      <span className="font-medium text-primary">Rs.{selectedOrder.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-sm text-on-surface-variant">
                      <span>Medical Shipping</span>
                      <span className="text-emerald-brand font-bold uppercase text-xs">FREE</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-primary">
                      <span className="font-bold text-primary">Order Total</span>
                      <span className="font-headline-md text-emerald-brand font-bold text-[20px]">Rs.{selectedOrder.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Support Card */}
                <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant text-left">
                  <h4 className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-emerald-brand">support_agent</span>
                    <span>Need Professional Help?</span>
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Contact our veterinary support team for questions regarding your pharmaceutical orders or delivery guidelines.</p>
                  <a 
                    href="mailto:support@petstore.com"
                    className="w-full mt-4 py-3 bg-white hover:bg-surface-container border border-outline-variant text-primary font-bold rounded-lg transition-all flex items-center justify-center text-sm shadow-sm"
                  >
                    Contact Expert Support
                  </a>
                </div>

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackOrders; 