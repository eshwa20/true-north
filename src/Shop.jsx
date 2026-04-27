import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './shop.css';

// ================= IMAGE IMPORTS =================
import logoImg from './assets/logo1.png';
import ringCollectionImg from './assets/main-ring-img.png';
import necklaceBlueImg from './assets/necklace-blue.png';
import earringsImg from './assets/earrings.png';
import braceletImg from './assets/bracelet.png';
import craftedSetImg from './assets/ethereal-bangle-1.png';
import rosettaRingImg from './assets/rosetta-ring.png';
import velvetHaloImg from './assets/velvet-halo-studs.png';
import yellowJewelImg from './assets/yellow-jewel.png';
import starPendantImg from './assets/start-pendant.png';

const Shop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const buyOnWhatsApp = (productName, price) => {
    const phoneNumber = "919967575151"; 
    const message = `Hello Alora Jewels! ✨\nI am interested in purchasing the *${productName}* priced at *${price}*.\nPlease let me know how to proceed!`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const products = [
    { name: "Celestial Stackable Band", price: "₹2,299", img: ringCollectionImg, category: "Rings" },
    { name: "Midnight Solitaire Pendant", price: "₹3,499", img: necklaceBlueImg, category: "Necklaces" },
    { name: "Sunburst Hoops", price: "₹1,899", img: earringsImg, category: "Earrings" },
    { name: "Diamond Cut Tennis Bracelet", price: "₹4,299", img: braceletImg, category: "Bracelets" },
    { name: "Ethereal Brushed Bangle", price: "₹2,499", img: craftedSetImg, category: "Sets" },
    { name: "Rosetta Radiance Ring", price: "₹5,499", img: rosettaRingImg, category: "Rings" },
    { name: "Velvet Halo Studs", price: "₹2,199", img: velvetHaloImg, category: "Earrings" },
    { name: "Golden Aura Solitaire", price: "₹4,899", img: yellowJewelImg, category: "Rings" },
    { name: "Starfall Cosmos Pendant", price: "₹2,699", img: starPendantImg, category: "Necklaces" }
  ];

  return (
    <div className="shop-page bg-[#F4F1F3] min-h-screen font-['Montserrat']">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-16 py-2 bg-white shadow-sm sticky top-0 z-50">
        <Link to="/" className="logo-container">
          <img src={logoImg} alt="Alora Jewels" className="h-[90px] w-auto object-contain" />
        </Link>
        <nav className="space-x-10 text-sm uppercase tracking-widest text-[#3A1C31] font-medium">
          <Link to="/collections" className="hover:text-[#7C3B65] transition">Collections</Link>
          <Link to="/about" className="hover:text-[#7C3B65] transition">About</Link>
          <Link to="/shop" className="text-[#7C3B65] border-b-2 border-[#7C3B65] pb-1">Shop</Link>
          <Link to="/contact" className="hover:text-[#7C3B65] transition">Contact</Link>
        </nav>
      </header>

      <div className="py-20 text-center">
        <span className="text-xs uppercase tracking-[4px] text-[#7C3B65] font-semibold">The Silver Edit</span>
        <h1 className="playfair text-5xl text-[#3A1C31] mt-4 mb-4">Shop The Catalog</h1>
        <p className="text-[#8a6f7f] mb-16">Authentic 925 Sterling Silver Pieces</p>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-3 gap-10 px-20 max-lg:grid-cols-2 max-sm:grid-cols-1 max-w-[1400px] mx-auto pb-24">
          {products.map((product, index) => (
            <div key={index} className="shop-card group bg-white rounded-2xl shadow hover:-translate-y-2 hover:shadow-2xl transition duration-500 overflow-hidden">
              <div className="overflow-hidden rounded-t-2xl relative">
                <img src={product.img} alt={product.name} className="w-full h-[300px] object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-[10px] uppercase tracking-widest font-bold text-[#7C3B65]">
                  {product.category}
                </div>
              </div>
              <div className="p-6 text-left">
                <h3 className="playfair text-xl text-[#3A1C31] mb-4">{product.name}</h3>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <span className="font-bold text-[#7C3B65] text-xl">{product.price}</span>
                  <button onClick={() => buyOnWhatsApp(product.name, product.price)} className="bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#128C7E] transition flex items-center gap-2">
                    <i className="fab fa-whatsapp text-lg"></i> Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;