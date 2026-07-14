import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, total, clearCart } = useContext(CartContext);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    email: '',
    streetAddress: '',
    city: '',
    province: 'Sindh',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!items || items.length === 0) {
      navigate('/');
      return;
    }
  }, [token, items, navigate]);

  // Fetch payment method details when selected
  useEffect(() => {
    const fetchPaymentMethodDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/payment-methods/${paymentMethod}`);
        if (response.ok) {
          const data = await response.json();
          setPaymentDetails(data);
        } else {
          setError('Payment method details not found');
        }
      } catch (error) {
        setError('Failed to fetch payment method details');
      }
    };

    if (paymentMethod && paymentMethod !== 'COD') {
      fetchPaymentMethodDetails();
    } else {
      setPaymentDetails(null);
    }
  }, [paymentMethod]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Account number copied to clipboard!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!formData.customerName || !formData.contactNumber || !formData.email || !formData.streetAddress || !formData.city || !formData.province || !formData.postalCode) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      setLoading(false);
      return;
    }

    if (paymentMethod !== 'COD' && !transactionId) {
      setError('Please enter transaction ID');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('customerName', formData.customerName);
      formDataToSend.append('contactNumber', formData.contactNumber);
      formDataToSend.append('email', formData.email);
      
      const fullAddress = `${formData.streetAddress}, ${formData.city}, ${formData.province} - ${formData.postalCode}`;
      formDataToSend.append('address', fullAddress);

      // Format cart items for the order
      const formattedCartItems = items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.price,
        qty: item.quantity
      }));
      formDataToSend.append('cartItems', JSON.stringify(formattedCartItems));
      formDataToSend.append('amount', total);
      formDataToSend.append('paymentMethod', paymentMethod);
      
      if (transactionId) {
        formDataToSend.append('transactionId', transactionId);
      }
      
      if (paymentProof) {
        formDataToSend.append('paymentProof', paymentProof);
      }

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        clearCart();
        navigate('/order-confirmation', { 
          state: { 
            orderId: result.order.id,
            customerName: result.order.customerName,
            amount: result.order.amount
          }
        });
      } else {
        const errorData = await response.json();
        if (errorData.message && errorData.message.includes('Insufficient stock')) {
          setError(errorData.message);
        } else {
          setError(errorData.message || 'Failed to place order');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen py-12 px-8">
      <main className="w-full max-w-container-max mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-error-container text-error rounded-lg border border-error/20 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-8">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-8 tracking-tight">Checkout</h1>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Customer Information */}
              <section className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-emerald-brand">person</span>
                  <h2 className="font-headline-md text-[20px] text-primary font-bold">Customer Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Full Name *</label>
                    <input 
                      type="text" 
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="John Doe" 
                      required
                      className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com" 
                      required
                      className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="+92 300 0000000" 
                      required
                      className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-emerald-brand">local_shipping</span>
                  <h2 className="font-headline-md text-[20px] text-primary font-bold">Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Street Address *</label>
                    <input 
                      type="text" 
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="123 Veterinary Lane, Block 4" 
                      required
                      className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">City *</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Karachi" 
                        required
                        className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Province *</label>
                      <select 
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        required
                        className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none"
                      >
                        <option value="Sindh">Sindh</option>
                        <option value="Punjab">Punjab</option>
                        <option value="KPK">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label class="font-label-sm text-label-sm text-on-surface-variant">Postal Code *</label>
                      <input 
                        type="text" 
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="75500" 
                        required
                        className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-emerald-brand">payments</span>
                  <h2 className="font-headline-md text-[20px] text-primary font-bold">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {/* JazzCash option */}
                  <label className="flex items-center p-4 rounded-lg border border-outline-variant hover:border-emerald-brand transition-all cursor-pointer group">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="JazzCash" 
                      checked={paymentMethod === 'JazzCash'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-emerald-brand focus:ring-emerald-brand border-outline-variant"
                    />
                    <div className="ml-4 flex flex-col">
                      <span className="font-body-lg text-body-lg font-bold text-primary">JazzCash</span>
                      <span className="font-label-xs text-label-xs text-on-surface-variant">Secure mobile wallet payment</span>
                    </div>
                  </label>

                  {/* EasyPaisa option */}
                  <label className="flex items-center p-4 rounded-lg border border-outline-variant hover:border-emerald-brand transition-all cursor-pointer group">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="EasyPaisa" 
                      checked={paymentMethod === 'EasyPaisa'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-emerald-brand focus:ring-emerald-brand border-outline-variant"
                    />
                    <div className="ml-4 flex flex-col">
                      <span className="font-body-lg text-body-lg font-bold text-primary">EasyPaisa</span>
                      <span className="font-label-xs text-label-xs text-on-surface-variant">Quick transfer via EasyPaisa mobile app</span>
                    </div>
                  </label>

                  {/* COD option */}
                  <label className="flex items-center p-4 rounded-lg border border-outline-variant hover:border-emerald-brand transition-all cursor-pointer group">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD" 
                      checked={paymentMethod === 'COD'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-emerald-brand focus:ring-emerald-brand border-outline-variant"
                    />
                    <div className="ml-4 flex flex-col">
                      <span className="font-body-lg text-body-lg font-bold text-primary">Cash on Delivery</span>
                      <span className="font-label-xs text-label-xs text-on-surface-variant">Pay when you receive your medical grade products</span>
                    </div>
                  </label>
                </div>

                {/* Payment Details Section */}
                {paymentMethod && paymentMethod !== 'COD' && paymentDetails && (
                  <div className="mt-6 p-6 bg-surface-container-low rounded-lg border border-outline-variant border-dashed space-y-4">
                    <h3 className="font-body-md text-primary font-bold">{paymentMethod} Payment Instructions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentDetails.qrCodeUrl && (
                        <div className="flex flex-col items-center bg-white p-3 rounded-lg border border-outline-variant shadow-sm w-fit mx-auto md:mx-0">
                          <img 
                            src={paymentDetails.qrCodeUrl} 
                            alt="Payment QR Code" 
                            className="w-32 h-32 object-contain"
                          />
                          <span className="text-[10px] text-on-surface-variant font-bold mt-1">Scan to Pay</span>
                        </div>
                      )}
                      
                      <div className="flex flex-col justify-center space-y-2">
                        <div className="text-sm">
                          <span className="text-on-surface-variant block text-xs">Account Title:</span>
                          <span className="font-bold text-primary">{paymentDetails.accountTitle}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-on-surface-variant block text-xs">Account Number:</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono bg-white px-2 py-0.5 rounded border border-outline-variant text-primary font-bold">{paymentDetails.accountNumber}</span>
                            <button 
                              type="button" 
                              onClick={() => copyToClipboard(paymentDetails.accountNumber)}
                              className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold hover:opacity-90"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded border border-outline-variant text-xs text-on-surface-variant">
                      <span className="font-bold block mb-1">Instructions:</span>
                      <p>{paymentDetails.instructions}</p>
                    </div>

                    <div className="bg-emerald-brand/10 p-3 rounded text-emerald-brand font-bold text-sm">
                      Amount to Pay: Rs.{total.toFixed(2)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-on-surface-variant">Transaction ID *</label>
                        <input 
                          type="text" 
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Enter 12-digit transaction ID"
                          required
                          className="p-3 rounded-lg border border-outline-variant bg-white text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-on-surface-variant">Payment Proof (Screenshot) *</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="p-2.5 rounded-lg border border-outline-variant bg-white text-xs text-on-surface-variant file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary file:cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              
              {/* Summary Card */}
              <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant">
                <h2 className="font-headline-md text-[20px] text-primary mb-4 font-bold border-b border-outline-variant pb-2">Order Summary</h2>
                
                {/* Items List */}
                <div className="divide-y divide-outline-variant max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-4 py-3 items-center">
                      <div className="w-16 h-16 bg-surface rounded-lg border border-outline-variant overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-label-sm text-label-sm font-bold text-primary truncate">{item.product.name}</h3>
                        <p className="font-label-xs text-label-xs text-on-surface-variant mt-0.5">Quantity: {item.quantity}</p>
                        <p className="font-label-xs text-label-xs text-emerald-brand font-bold mt-0.5">Rs.{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="space-y-2 mb-4 pt-2 border-t border-outline-variant">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>Rs.{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="text-emerald-brand font-bold uppercase text-xs">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Tax</span>
                    <span>Rs.0.00</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="pt-4 border-t-2 border-primary mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-headline-md text-primary">Total</span>
                    <span className="font-headline-md text-primary font-extrabold text-[22px]">Rs.{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-brand text-on-tertiary rounded-xl font-bold text-body-lg uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-1.5 opacity-60 text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>Secured with 256-bit SSL encryption</span>
                </div>
              </div>

              {/* Vet Approved Trust Badge */}
              <div className="bg-[#E6F4EA] p-4 rounded-lg border border-[#A3E2B6] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-brand flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm font-bold text-[#137333]">Veterinary Approved</p>
                  <p className="text-[11px] text-[#137333]/90 leading-snug">All pharmaceuticals double-checked by registered pharmacists.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage; 