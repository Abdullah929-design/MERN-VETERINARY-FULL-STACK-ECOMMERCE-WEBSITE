import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/about')
      .then(res => res.json())
      .then(data => setContent(data.content || ''));
  }, []);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden bg-surface-container-lowest text-on-surface">
      <main>
        {/* Hero Section */}
        <section className="relative w-full bg-white overflow-hidden py-16 lg:py-0">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 items-center min-h-[600px] gap-12 px-8">
            <div className="space-y-6 text-left">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#137333] font-bold">ProVet Elite Standards</span>
              <h1 className="font-display-xl text-display-xl text-primary leading-tight">Elevating Veterinary Care</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Professional-grade medical supplies delivered with clinical precision and heartfelt care. We bridge the gap between world-class veterinary medicine and your doorstep.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => {
                    const el = document.getElementById('promise-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-emerald-brand text-on-tertiary px-8 py-4 font-bold rounded-lg shadow-sm hover:brightness-110 transition-all hover:-translate-y-0.5"
                >
                  Explore Our Standards
                </button>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[450px] w-full rounded-xl overflow-hidden shadow-md">
              <img 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Veterinarian with Golden Retriever" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkQJiCZA2WbeeTTD6E8T9ajQNCV7-kMMW40n0Nuhp_TJepd7UdANmtfRXmAZOrP3Gaqzmi2KC0cg6ILLmCIzbptb5aczF4kDwn3ZXrxS2lJt8t7EHs-kZ-Pos0MQMFvSxSIzvTgqJCD2NQuH-NyI7zIOQIhHC0uGy3ZkpjzabRWw8eKfj6GpfCIJGZ460lEK7_UmEFnoLgsdhA3037juNloGzZFBPkYF1p1-j_BhRW5_jg_oKY2M2vwg"
              />
            </div>
          </div>
        </section>

        {/* Trust Signals (Badges) */}
        <section className="bg-surface-container-low border-y border-outline-variant py-10">
          <div className="max-w-container-max mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[48px] text-emerald-brand" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">Certified Pharmacy</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Accredited by the Board of Veterinary Medicine</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[48px] text-emerald-brand" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">Secure Payments</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Military-grade 256-bit SSL encryption</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[48px] text-emerald-brand" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">Fast Medical Shipping</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Temperature-controlled priority logistics</p>
            </div>
          </div>
        </section>

        {/* Mission Statement: The ProVet Promise */}
        <section id="promise-section" className="bg-white py-16">
          <div className="max-w-[800px] mx-auto px-8 text-center">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6 italic">The ProVet Promise</h2>
            
            {/* Dynamic Admin-modifiable Content */}
            <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-12 text-left bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              {content ? (
                content.split('\n').map((line, i) => (
                  <p key={i} className={line.trim() === '' ? 'h-4' : 'mb-3'}>
                    {line}
                  </p>
                ))
              ) : (
                <p>No custom description available yet. Sourced from the admin configurations.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-2">
                <div className="w-12 h-1 bg-[#179d53] mb-4"></div>
                <h4 class="font-headline-md text-headline-md text-primary font-bold">Quality</h4>
                <p className="text-sm text-on-surface-variant">Uncompromising standards for sourcing and storage of clinical supplies.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-1 bg-[#179d53] mb-4"></div>
                <h4 class="font-headline-md text-headline-md text-primary font-bold">Compassion</h4>
                <p className="text-sm text-on-surface-variant">Every order is treated with the care we'd give our own beloved companions.</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-1 bg-[#179d53] mb-4"></div>
                <h4 class="font-headline-md text-headline-md text-primary font-bold">Integrity</h4>
                <p className="text-sm text-on-surface-variant">Transparent pricing and ethical pharmaceutical practices since 2004.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise & Quality */}
        <section className="bg-surface py-16">
          <div className="max-w-container-max mx-auto px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2 rounded-xl overflow-hidden shadow-sm h-[350px] lg:h-[450px]">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Pharmacist inspects medication" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWggDmj5LmEeHwXigmsqJ-mKLryCOexUZhrKjOShiLss12jsLPzMG3YRx9IS4Qi3P2qS0afs6h3KgXwqoQKGBPf5aK-cA2Q32_uWOxGDmZXadh_AHqm85TXPsCRzTI8hiv4SudCMtXqF57a9up_cP1gU18dbE-AeANCJ3IT6P5vrABNJTX2dKC4iNYJMRjMRQ0YVRuYb-MoBHScyO9SJHfgDkC9QGx29W4fz6CvVY00S64ZNp-tIoJ0A"
                />
              </div>
              <div className="lg:w-1/2 space-y-6 text-left">
                <div className="bg-[#E6F4EA] inline-block px-3 py-1 rounded-full">
                  <span className="text-[#137333] font-label-xs uppercase tracking-widest font-bold">The Clinical Process</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Our 'Veterinary Approved' Assurance</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  At ProVet Elite, precision isn't a goal—it's our baseline. Unlike generic retailers, every prescription processed through our platform undergoes a rigorous double-verification protocol.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#137333]">check_circle</span>
                    <span className="font-body-md text-body-md"><strong>Pharmacist Review:</strong> Every single prescription is manually reviewed by a licensed veterinary pharmacist.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#137333]">check_circle</span>
                    <span className="font-body-md text-body-md"><strong>Direct Sourcing:</strong> 100% of our inventory comes directly from authorized manufacturers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#137333]">check_circle</span>
                    <span className="font-body-md text-body-md"><strong>Clinical Integrity:</strong> We strictly adhere to storage temperature protocols for all sensitive vaccines and therapeutics.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story / Story section */}
        <section className="bg-white py-16">
          <div className="max-w-container-max mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 text-left">
                <h2 className="font-display-xl text-display-xl text-primary font-bold">Established 2004.</h2>
              </div>
              <div className="lg:col-span-8 space-y-6 border-l border-outline-variant pl-8 text-left">
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Two decades ago, we recognized a critical failure in the pet care market: accessibility to specialist-level supplies was limited and often unreliable. PetStore - ProVet Elite was born from a small clinical collective determined to change that.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  What started as a boutique supply service for local clinics has evolved into a global leader in high-end veterinary e-commerce. Despite our growth, our DNA remains clinical. We don't just sell products; we facilitate care pathways that improve the quality of life for animals.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 text-center">
                  <div>
                    <div className="font-headline-lg text-emerald-brand font-bold">20+</div>
                    <div className="font-label-xs text-on-surface-variant uppercase tracking-wider font-bold">Years Experience</div>
                  </div>
                  <div>
                    <div className="font-headline-lg text-emerald-brand font-bold">500k+</div>
                    <div className="font-label-xs text-on-surface-variant uppercase tracking-wider font-bold">Pets Served</div>
                  </div>
                  <div>
                    <div className="font-headline-lg text-emerald-brand font-bold">12k+</div>
                    <div className="font-label-xs text-on-surface-variant uppercase tracking-wider font-bold">Vet Clinics</div>
                  </div>
                  <div>
                    <div className="font-headline-lg text-emerald-brand font-bold">100%</div>
                    <div className="font-label-xs text-on-surface-variant uppercase tracking-wider font-bold">Certified Items</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-container-max mx-auto px-8 py-12">
          <div className="bg-primary-container text-white rounded-xl p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="relative z-10 text-left">
              <h2 className="font-headline-lg text-headline-lg text-white mb-2 font-bold">Ready to provide the best?</h2>
              <p className="text-[#aec7f6] font-body-md">Join over 50,000 professional pet owners and veterinarians.</p>
            </div>
            <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => navigate('/')}
                className="bg-emerald-brand text-on-tertiary px-6 py-3 font-bold rounded-lg hover:brightness-110 transition-all text-sm shadow-sm"
              >
                Shop Elite Collection
              </button>
              <a 
                href="mailto:info@petstore.com"
                className="border border-white/20 text-white px-6 py-3 font-bold rounded-lg hover:bg-white/10 transition-all text-sm flex items-center justify-center"
              >
                Contact Expert Team
              </a>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-brand opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border border-white opacity-5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About; 