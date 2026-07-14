import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, customerName, amount } = location.state || {};

  // Redirect if no order data
  if (!orderId) {
    navigate('/');
    return null;
  }

  const formattedOrderId = orderId.slice(-8).toUpperCase();

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pb-16 px-4">
      {/* Top minimal progress bar header */}
      <nav className="bg-surface-container-lowest border-b border-outline-variant w-full py-4 px-8 mb-12">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-primary">PetStore</div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Secure Checkout Success</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[720px] mx-auto flex flex-col items-center">
        
        {/* Success Status Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-emerald-brand/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <span className="material-symbols-outlined text-emerald-brand text-[48px]" style={{ fontVariationSettings: "'wght' 600" }}>check_circle</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Thank You for Your Order</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[500px]">
            Your order is currently being reviewed by our veterinary pharmacy team to ensure the highest standard of care for your pet.
          </p>
        </div>

        {/* Order Summary Card */}
        <section className="w-full bg-surface-container-lowest rounded-xl p-6 shadow-md border border-outline-variant mb-8 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline-variant pb-4 mb-6 gap-4">
            <div>
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant block mb-1">Order Number</span>
              <span className="font-headline-md text-headline-md text-primary font-bold">#PS-{formattedOrderId}</span>
            </div>
            <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full flex items-center gap-1.5 font-label-sm text-label-sm border border-amber-200 font-bold uppercase tracking-wide">
              <span className="material-symbols-outlined text-[18px]">pending</span>
              <span>Pending Review</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant block mb-1">Customer Name</span>
                <span className="font-body-md text-body-md text-primary font-bold">{customerName}</span>
              </div>
              <div>
                <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant block mb-1">Total Amount</span>
                <span className="font-headline-md text-headline-md text-[#179d53] font-bold">Rs.{amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4 flex flex-col justify-center">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant block mb-2 font-bold">Estimated Delivery</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/5 rounded flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <p className="font-body-md text-primary font-bold">Within 2-3 Business Days</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Priority Veterinary Cold-Chain</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Next Section */}
        <section className="w-full mb-10 text-left">
          <h2 className="font-headline-md text-[20px] text-primary mb-4 font-bold">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-[#179d53] mt-0.5">verified</span>
              <div>
                <h3 className="font-body-md text-body-md text-primary font-bold">Reviewing pharmacy details</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">Our licensed pharmacists are validating your payment proof and item listings.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-[#179d53] mt-0.5">verified</span>
              <div>
                <h3 className="font-body-md text-body-md text-primary font-bold">Email confirmation</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">A receipt and order summary will be sent to your email address shortly.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-[#179d53] mt-0.5">verified</span>
              <div>
                <h3 className="font-body-md text-body-md text-primary font-bold">Processing time</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">Most orders are approved and packaged within 24 hours of verification.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 w-full mb-12">
          <button 
            onClick={() => navigate('/')}
            className="flex-1 bg-emerald-brand text-on-tertiary px-6 py-4 rounded-xl font-bold font-body-md hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Continue Shopping</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button 
            onClick={() => navigate('/track-orders')}
            className="flex-1 border-2 border-primary text-primary px-6 py-4 rounded-xl font-bold font-body-md hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">map</span>
            <span>Track My Order</span>
          </button>
        </div>

        {/* Loyalty Upsell */}
        <div className="w-full p-6 bg-primary-container rounded-xl flex items-center gap-4 text-left">
          <div className="hidden sm:block shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[36px]">loyalty</span>
            </div>
          </div>
          <div>
            <p className="text-white font-body-md font-bold">Earn points for this purchase!</p>
            <p className="text-[#aec7f6] font-label-sm text-label-sm mt-0.5">Join our Premium Wellness Club to unlock free shipping on all orders.</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default OrderConfirmation; 