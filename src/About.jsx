import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from './assets/logo1.png';
import bannerImg from "./assets/logo1.png";
const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F4F1F3] min-h-screen font-['Montserrat']">
      <header className="flex justify-between items-center px-16 py-2 bg-white shadow-sm sticky top-0 z-50">
        <Link to="/" className="logo-container">
          <img src={logoImg} alt="Alora Jewels" className="h-[90px] w-auto object-contain" />
        </Link>
        <nav className="space-x-10 text-sm uppercase tracking-widest text-[#3A1C31] font-medium">
          <Link to="/collections" className="hover:text-[#7C3B65] transition">Collections</Link>
          <Link to="/about" className="text-[#7C3B65] border-b-2 border-[#7C3B65] pb-1">About</Link>
          <Link to="/shop" className="hover:text-[#7C3B65] transition">Shop</Link>
          <Link to="/contact" className="hover:text-[#7C3B65] transition">Contact</Link>
        </nav>
      </header>

      {/* HERO IMAGE */}
      <div className="relative w-full h-[500px]">
        <img src={bannerImg} alt="Alora Jewelry Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#3A1C31]/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
          <h1 className="playfair text-6xl mb-4">Our Story</h1>
          <p className="tracking-[5px] uppercase text-sm">Authentic 925 Sterling Silver</p>
        </div>
      </div>

      <section className="py-24 px-10 max-w-[1000px] mx-auto text-center">
        <h2 className="playfair text-4xl text-[#3A1C31] mb-8">Born From A Love Of Silver</h2>
        <p className="text-[#8a6f7f] leading-loose mb-6 text-lg">
          Alora Jewels was founded with a singular, passionate vision: to create breathtaking, high-quality jewelry that women can wear every single day without the fear of tarnishing.
        </p>
        <p className="text-[#8a6f7f] leading-loose mb-16 text-lg">
          We believe that genuine 925 sterling silver is the perfect canvas for elegance. That’s why every piece in our collection is painstakingly crafted by master artisans and finished with premium rhodium plating to ensure a brilliant, lasting shine.
        </p>

        <div className="grid grid-cols-3 gap-8 border-t border-gray-200 pt-16">
          <div>
            <h3 className="text-5xl font-bold text-[#7C3B65] mb-2">15+</h3>
            <p className="text-sm uppercase tracking-widest text-[#8a6f7f]">Years of Craftsmanship</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-[#7C3B65] mb-2">100%</h3>
            <p className="text-sm uppercase tracking-widest text-[#8a6f7f]">Certified 925 Silver</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-[#7C3B65] mb-2">10k+</h3>
            <p className="text-sm uppercase tracking-widest text-[#8a6f7f]">Happy Customers</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;