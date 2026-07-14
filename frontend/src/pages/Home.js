import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AddToCartButton from '../components/Cart/AddToCartButton';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceLimit, setPriceLimit] = useState(10000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('http://localhost:5000/api/category'),
          fetch('http://localhost:5000/api/products')
        ]);

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Filter products based on search, category, and price
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category === selectedCategory || 
        product.category?._id === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price limit
    filtered = filtered.filter(product => product.price <= priceLimit);

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, priceLimit]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceLimit(10000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-bold">Loading veterinary supplies...</p>
      </div>
    );
  }

  return (
    <div className="home-page bg-surface-container-lowest">
      {/* High-Impact Hero Section */}
      <section className="relative overflow-hidden bg-surface-container-low hero-gradient">
        {/* Decorative Elements */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-brand/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 opacity-[0.03] pointer-events-none">
          <span className="material-symbols-outlined text-[320px]">pets</span>
        </div>
        <div className="max-w-container-max mx-auto px-8 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content Column */}
            <div className="flex-1 text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4EA] text-[#137333] mb-6">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span className="text-label-xs uppercase tracking-widest font-bold">Vet-Approved Solutions</span>
              </div>
              <h1 className="font-display-xl text-display-xl text-primary mb-6 leading-[1.1]">
                Advanced Care for <br className="hidden xl:block" /><span className="text-emerald-brand">Their Best Days</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
                Discover our curated collection of premium veterinary essentials, from prescription diets to expert-approved supplements, ensuring your companion thrives at every stage.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    const el = document.getElementById('shop-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-emerald-brand text-on-tertiary rounded-xl font-bold hover:brightness-110 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Shop the Collection</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button 
                  onClick={() => navigate('/track-orders')}
                  className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-on-primary transition-all"
                >
                  Track Your Orders
                </button>
              </div>
              <div className="mt-12 flex items-center gap-8 opacity-60">
                <div className="flex flex-col">
                  <span className="font-display-xl text-[24px] font-bold text-primary">15k+</span>
                  <span className="text-label-xs uppercase">Happy Pets</span>
                </div>
                <div className="w-px h-8 bg-outline-variant"></div>
                <div className="flex flex-col">
                  <span className="font-display-xl text-[24px] font-bold text-primary">200+</span>
                  <span className="text-label-xs uppercase">Vet Clinics</span>
                </div>
              </div>
            </div>
            {/* Image Column */}
            <div className="flex-1 relative order-1 lg:order-2">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform lg:translate-x-12 lg:scale-110 lg:-rotate-1 transition-transform hover:rotate-0 duration-500">
                <img alt="Happy Golden Retriever with premium veterinary supplements" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEsoMckCeuC4i8mfrDRjQSQ23QTX1Gc5jCivzEwgq1PDjZyM_T6L3uiSUgAeiyGApFIgPCwG4adA1yVAbM6l3ypiF4TavloDhJj7UffwV7Llo5giJ1qEIlW6BrP65sY7GL7eltjf4ujdWiio_-Giv90F1lCZZp3dpqFj1kKEt2bGOD8x1jAY4TlizfGR3lKceMGOHOx_NDCtdF0NF-b1AqYs2BabQniR-6IAgH9bQgWQwzP5RdQgpu6g" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Floating Card */}
              <div className="hidden xl:block absolute -bottom-6 -left-12 bg-white p-4 rounded-2xl shadow-xl border border-outline-variant max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#E6F4EA] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#137333] text-sm">medical_services</span>
                  </div>
                  <span className="text-label-xs font-bold text-primary">Daily Wellness</span>
                </div>
                <p className="text-[10px] text-on-surface-variant">Recommended by 9/10 Veterinary Professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="shop-section" className="max-w-container-max mx-auto px-8 py-12 flex flex-col lg:flex-row gap-8">
        {/* Side Filter Column */}
        <aside className="w-full lg:w-64 shrink-0 bg-surface h-fit rounded-xl p-6 border border-outline-variant lg:sticky lg:top-24">
          <div className="flex flex-col gap-1 mb-6">
            <h3 className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-bold">Filters</h3>
            <p className="text-[10px] text-secondary opacity-70">Refine your product search</p>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-4">
            <h4 className="font-label-sm text-label-sm font-bold text-primary">Categories</h4>
            <div className="flex flex-col gap-1">
              <button
                className={`flex items-center gap-xs px-3 py-2 text-left w-full rounded-lg transition-all ${
                  selectedCategory === 'all'
                    ? 'text-[#179d53] font-bold bg-[#E6F4EA]'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                <span className="material-symbols-outlined text-[20px]">category</span>
                <span className="font-body-md text-body-md">All Products</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`flex items-center gap-xs px-3 py-2 text-left w-full rounded-lg transition-all ${
                    selectedCategory === category._id
                      ? 'text-[#179d53] font-bold bg-[#E6F4EA]'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                  onClick={() => handleCategoryChange(category._id)}
                >
                  <span className="material-symbols-outlined text-[20px]">pets</span>
                  <span className="font-body-md text-body-md">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="border-t border-outline-variant/30 pt-6 mt-6">
            <h4 className="font-label-sm text-label-sm font-bold text-primary mb-4">Price Range</h4>
            <div className="space-y-4">
              <input 
                className="w-full accent-emerald-brand cursor-pointer" 
                max="10000" 
                min="0" 
                step="100"
                type="range"
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
              />
              <div className="flex justify-between text-label-xs font-label-xs text-secondary font-bold">
                <span>Rs.0</span>
                <span className="text-emerald-brand">Under Rs.{priceLimit}</span>
              </div>
            </div>
          </div>

          {(selectedCategory !== 'all' || searchQuery || priceLimit < 10000) && (
            <button 
              onClick={clearFilters}
              className="mt-6 w-full py-3 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:opacity-90 transition-opacity font-bold"
            >
              Clear Filters
            </button>
          )}
        </aside>

        {/* Product Grid Column */}
        <section className="flex-1">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary">Featured Essentials</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Expert-approved care for your best friend</p>
            </div>
            <div className="text-label-sm text-secondary font-bold">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-surface rounded-xl border border-outline-variant border-dashed">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">search</span>
              <h3 className="font-headline-md text-primary mb-2">No products found</h3>
              <p className="text-on-surface-variant mb-6">Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="px-6 py-3 bg-emerald-brand text-on-tertiary rounded-lg font-bold hover:brightness-110 transition-all">
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// Redesigned Product Card
function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full hover:-translate-y-1">
      {/* Image Area */}
      <div className="aspect-square bg-surface-container-low relative p-6 flex items-center justify-center border-b border-outline-variant">
        <div className="absolute top-3 left-3 z-10 bg-emerald-brand text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          Vet Exclusive
        </div>
        
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-surface-container-high animate-pulse"></div>
        )}
        
        <img
          src={product.image}
          alt={product.name}
          className={`max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        {imageError && (
          <div className="flex flex-col items-center text-on-surface-variant gap-1">
            <span className="material-symbols-outlined text-[36px]">image_not_supported</span>
            <span className="text-[10px]">Image Unavailable</span>
          </div>
        )}
      </div>

      {/* Info Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Star Rating */}
        <div className="flex items-center gap-0.5 mb-2">
          <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
          <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
          <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
          <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
          <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
          <span className="text-label-xs font-label-xs text-secondary ml-1 font-bold">(5.0)</span>
        </div>

        <h3 className="font-label-sm text-label-sm font-bold text-primary line-clamp-1 mb-1 group-hover:text-emerald-brand transition-colors" title={product.name}>
          {product.name}
        </h3>
        
        <p className="font-label-xs text-label-xs text-on-surface-variant line-clamp-2 mb-4" title={product.description}>
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-baseline mb-3">
            <span className="font-headline-md text-[18px] text-emerald-brand font-bold">Rs.{product.price.toFixed(2)}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${product.quantity > 0 ? 'bg-emerald-brand/10 text-emerald-brand' : 'bg-red-100 text-red-800'}`}>
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}

export default Home;
