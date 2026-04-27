import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerImg from "./assets/logo1.png";
import './collections.css';

// ================= IMAGE IMPORTS =================
// Paths updated to './assets/' and extensions changed to .png as requested
import logoImg from './assets/logo1.png';

// Collection 1: Midnight Solitaire
import necklaceBlueImg from './assets/necklace-blue.png';
import necklaceBlueWornImg from './assets/necklace-blue-neck.png';

// Collection 2: Sunburst Series
import earringsImg from './assets/earrings.png';
import earringsWornImg from './assets/earrings-ears.png';

// Collection 3: Ethereal Core
import bangleImg from './assets/ethereal-bangle.png';
import bangleAltImg from './assets/ethereal-bangle-1.png';

// Collection 4: Celestial Edit
import braceletImg from './assets/bracelet.png';
import ringCollectionImg from './assets/main-ring-img.png';

// Collection 5: Rosetta Radiance (New)
import rosettaRingImg from './assets/rosetta-ring.png';
import rosettaRingHandImg from './assets/rosetta-ring-hand.png';

// Collection 6: Velvet Halo (New)
import velvetHaloImg from './assets/velvet-halo-studs.png';
import velvetHaloEarsImg from './assets/velvet-halo-studs-ears.png';

// Collection 7: Golden Aura (New)
import yellowJewelImg from './assets/yellow-jewel.png';
import yellowJewelHandImg from './assets/yellow-jewel-hand.png';

// Collection 8: Starfall Series (New)
import starPendantImg from './assets/start-pendant.png';
import starPendantNeckImg from './assets/start-pendant-neck.png';


const Collections = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // WHATSAPP INQUIRY FUNCTION
  const enquireOnWhatsApp = (collectionName) => {
    const phoneNumber = "919967575151"; 
    const message = `Hello Alora Jewels! ✨\nI am interested in exploring pieces from the *${collectionName}*.\nPlease let me know what is available!`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="collections-page bg-[#F4F1F3] min-h-screen font-['Montserrat']">
      
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-16 py-2 bg-white shadow-sm sticky top-0 z-50">
        <Link to="/" className="logo-container">
          <img src={logoImg} alt="Alora Jewels" className="h-[90px] w-auto object-contain" />
        </Link>
        <nav className="space-x-10 text-sm uppercase tracking-widest text-[#3A1C31] font-medium">
          <Link to="/collections" className="text-[#7C3B65] border-b-2 border-[#7C3B65] pb-1">Collections</Link>
          <Link to="/about" className="hover:text-[#7C3B65] transition">About</Link>
          <Link to="/shop" className="hover:text-[#7C3B65] transition">Shop</Link>
          <Link to="/contact" className="hover:text-[#7C3B65] transition">Contact</Link>
        </nav>
      </header>

      {/* PAGE HEADER */}
      <div className="pt-24 pb-16 text-center px-5">
        <span className="text-xs uppercase tracking-[4px] text-[#7C3B65] font-semibold">Curated Elegance</span>
        <h1 className="playfair text-6xl text-[#3A1C31] mt-4 mb-6">Signature Collections</h1>
        <p className="text-[#8a6f7f] max-w-2xl mx-auto leading-relaxed">
          Discover our meticulously crafted ranges. Each collection is unified by a singular vision, bringing together authentic 925 sterling silver, brilliant cuts, and artisan passion.
        </p>
      </div>

      {/* ================= COLLECTION 1: The Midnight Solitaire ================= */}
      <section className="py-16 px-10 max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 relative h-[550px] w-full">
            <img src={necklaceBlueWornImg} alt="Midnight Solitaire Worn" className="w-[80%] h-[450px] object-cover rounded-3xl shadow-lg absolute top-0 left-0" />
            <img src={necklaceBlueImg} alt="Midnight Solitaire Detail" className="w-[60%] h-[350px] object-cover rounded-3xl shadow-2xl absolute bottom-0 right-0 border-8 border-[#F4F1F3]" />
          </div>
          <div className="lg:w-1/2 text-left">
            <h2 className="playfair text-4xl text-[#3A1C31] mb-4">The Midnight Solitaire</h2>
            <p className="text-[#8a6f7f] leading-relaxed mb-8">
              Deep, mysterious, and undeniably elegant. This collection highlights dramatic square cuts surrounded by intricate baguette detailing. Perfect for evening wear, these pendants add a touch of vintage royalty to modern necklines.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => enquireOnWhatsApp('Midnight Solitaire Collection')} className="bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition flex items-center gap-2 shadow-md">
                <i className="fab fa-whatsapp text-lg"></i> Enquire Now
              </button>
              <Link to="/shop" className="btn-outline px-6 py-3 text-xs border-[#7C3B65] text-[#7C3B65] rounded-lg">View in Shop</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COLLECTION 2: The Sunburst Series ================= */}
      <section className="py-24 px-10 max-w-[1300px] mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 text-left">
            <h2 className="playfair text-4xl text-[#3A1C31] mb-4">The Sunburst Series</h2>
            <p className="text-[#8a6f7f] leading-relaxed mb-8">
              Radiate warmth and energy. The Sunburst Series features intricate baguette stones arranged in a striking halo. These pieces are crafted for the modern woman who isn't afraid to let her confidence shine through bold, architectural silhouettes.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => enquireOnWhatsApp('Sunburst Series Earrings')} className="bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition flex items-center gap-2 shadow-md">
                <i className="fab fa-whatsapp text-lg"></i> Enquire Now
              </button>
              <Link to="/shop" className="btn-outline px-6 py-3 text-xs border-[#7C3B65] text-[#7C3B65] rounded-lg">View in Shop</Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative h-[550px] w-full">
             <img src={earringsWornImg} alt="Sunburst Worn" className="w-[80%] h-[450px] object-cover rounded-3xl shadow-lg absolute top-0 right-0" />
             <img src={earringsImg} alt="Sunburst Detail" className="w-[60%] h-[350px] object-cover rounded-3xl shadow-2xl absolute bottom-0 left-0 border-8 border-[#F4F1F3]" />
          </div>
        </div>
      </section>

      {/* ================= COLLECTION 3: The Rosetta Radiance ================= */}
      <section className="py-16 px-10 max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 relative h-[550px] w-full">
            <img src={rosettaRingHandImg} alt="Rosetta Ring on Hand" className="w-[80%] h-[450px] object-cover rounded-3xl shadow-lg absolute top-0 left-0" />
            <img src={rosettaRingImg} alt="Rosetta Ring Detail" className="w-[60%] h-[350px] object-cover rounded-3xl shadow-2xl absolute bottom-0 right-0 border-8 border-[#F4F1F3]" />
          </div>
          <div className="lg:w-1/2 text-left">
            <h2 className="playfair text-4xl text-[#3A1C31] mb-4">The Rosetta Radiance</h2>
            <p className="text-[#8a6f7f] leading-relaxed mb-8">
              Command the room with romantic elegance. Featuring a breathtaking pink oval-cut center stone flanked by brilliant side diamonds, the Rosetta ring is a true masterpiece designed for those who wear their heart on their sleeve.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => enquireOnWhatsApp('Rosetta Radiance Collection')} className="bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition flex items-center gap-2 shadow-md">
                <i className="fab fa-whatsapp text-lg"></i> Enquire Now
              </button>
              <Link to="/shop" className="btn-outline px-6 py-3 text-xs border-[#7C3B65] text-[#7C3B65] rounded-lg">View in Shop</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COLLECTION 4: The Velvet Halo ================= */}
      <section className="py-24 px-10 max-w-[1300px] mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 text-left">
            <h2 className="playfair text-4xl text-[#3A1C31] mb-4">The Velvet Halo</h2>
            <p className="text-[#8a6f7f] leading-relaxed mb-8">
              Modern, architectural, and effortlessly chic. The Velvet Halo collection features distinctive U-shaped hoops lined with channel-set baguette stones, offering a contemporary twist on classic elegance that frames the face perfectly.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => enquireOnWhatsApp('Velvet Halo Earrings')} className="bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition flex items-center gap-2 shadow-md">
                <i className="fab fa-whatsapp text-lg"></i> Enquire Now
              </button>
              <Link to="/shop" className="btn-outline px-6 py-3 text-xs border-[#7C3B65] text-[#7C3B65] rounded-lg">View in Shop</Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative h-[550px] w-full">
             <img src={velvetHaloEarsImg} alt="Velvet Halo Worn" className="w-[80%] h-[450px] object-cover rounded-3xl shadow-lg absolute top-0 right-0" />
             <img src={velvetHaloImg} alt="Velvet Halo Detail" className="w-[60%] h-[350px] object-cover rounded-3xl shadow-2xl absolute bottom-0 left-0 border-8 border-[#F4F1F3]" />
          </div>
        </div>
      </section>

      {/* ================= COLLECTION 5: The Golden Aura ================= */}
      <section className="py-16 px-10 max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 relative h-[550px] w-full">
            <img src={yellowJewelHandImg} alt="Golden Aura on Hand" className="w-[80%] h-[450px] object-cover rounded-3xl shadow-lg absolute top-0 left-0" />
            <img src={yellowJewelImg} alt="Golden Aura Detail" className="w-[60%] h-[350px] object-cover rounded-3xl shadow-2xl absolute bottom-0 right-0 border-8 border-[#F4F1F3]" />
          </div>
          <div className="lg:w-1/2 text-left">
            <h2 className="playfair text-4xl text-[#3A1C31] mb-4">The Golden Aura</h2>
            <p className="text-[#8a6f7f] leading-relaxed mb-8">
              Capture the warmth of the sun. The Golden Aura collection highlights a vibrant, golden-yellow center stone set against brilliant silver accents. Perfect for adding a pop of luxurious, rich color to your everyday style.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => enquireOnWhatsApp('Golden Aura Collection')} className="bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition flex items-center gap-2 shadow-md">
                <i className="fab fa-whatsapp text-lg"></i> Enquire Now
              </button>
              <Link to="/shop" className="btn-outline px-6 py-3 text-xs border-[#7C3B65] text-[#7C3B65] rounded-lg">View in Shop</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COLLECTION 6: The Starfall Series ================= */}
      <section className="py-24 px-10 max-w-[1300px] mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 text-left">
            <h2 className="playfair text-4xl text-[#3A1C31] mb-4">The Starfall Series</h2>
            <p className="text-[#8a6f7f] leading-relaxed mb-8">
              Illuminate your neckline with the Starfall Series. These stunning starburst pendants catch the light from every dimension, bringing the brilliance of the cosmos directly to your jewelry box. 
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => enquireOnWhatsApp('Starfall Pendants')} className="bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition flex items-center gap-2 shadow-md">
                <i className="fab fa-whatsapp text-lg"></i> Enquire Now
              </button>
              <Link to="/shop" className="btn-outline px-6 py-3 text-xs border-[#7C3B65] text-[#7C3B65] rounded-lg">View in Shop</Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative h-[550px] w-full">
             <img src={starPendantNeckImg} alt="Starfall Worn" className="w-[80%] h-[450px] object-cover rounded-3xl shadow-lg absolute top-0 right-0" />
             <img src={starPendantImg} alt="Starfall Detail" className="w-[60%] h-[350px] object-cover rounded-3xl shadow-2xl absolute bottom-0 left-0 border-8 border-[#F4F1F3]" />
          </div>
        </div>
      </section>

      {/* ================= COLLECTION 7: The Ethereal Core ================= */}
      <section className="py-16 px-10 max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 relative h-[550px] w-full">
            <img src={bangleImg} alt="Ethereal Bangle Flatlay" className="w-[80%] h-[450px] object-cover rounded-3xl shadow-lg absolute top-0 left-0" />
            <img src={bangleAltImg} alt="Ethereal Bangle Detail" className="w-[60%] h-[350px] object-cover rounded-3xl shadow-2xl absolute bottom-0 right-0 border-8 border-[#F4F1F3]" />
          </div>
          <div className="lg:w-1/2 text-left">
            <h2 className="playfair text-4xl text-[#3A1C31] mb-4">The Ethereal Core</h2>
            <p className="text-[#8a6f7f] leading-relaxed mb-8">
              Stripped back to the absolute essentials. The Ethereal Core collection celebrates the pure, unadulterated beauty of 925 sterling silver. Featuring brushed finishes and sleek, minimalist lines, these bangles and cuffs are made for daily stacking.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => enquireOnWhatsApp('Ethereal Core Bangles')} className="bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition flex items-center gap-2 shadow-md">
                <i className="fab fa-whatsapp text-lg"></i> Enquire Now
              </button>
              <Link to="/shop" className="btn-outline px-6 py-3 text-xs border-[#7C3B65] text-[#7C3B65] rounded-lg">View in Shop</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COLLECTION 8: The Celestial Edit ================= */}
      <section className="py-24 px-10 max-w-[1300px] mx-auto mb-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 text-left">
            <h2 className="playfair text-4xl text-[#3A1C31] mb-4">The Celestial Edit</h2>
            <p className="text-[#8a6f7f] leading-relaxed mb-8">
              Inspired by the brilliance of the night sky, the Celestial Edit features dazzling halo settings and striking center stones. Designed to make a statement, these rings and tennis bracelets capture light from every angle, offering the illusion of starlight wrapped around you.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => enquireOnWhatsApp('Celestial Edit Rings & Bracelets')} className="bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#128C7E] transition flex items-center gap-2 shadow-md">
                <i className="fab fa-whatsapp text-lg"></i> Enquire Now
              </button>
              <Link to="/shop" className="btn-outline px-6 py-3 text-xs border-[#7C3B65] text-[#7C3B65] rounded-lg">View in Shop</Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative h-[550px] w-full">
             <img src={braceletImg} alt="Tennis Bracelet" className="w-[80%] h-[450px] object-cover rounded-3xl shadow-lg absolute top-0 right-0" />
            <img src={ringCollectionImg} alt="Halo Ring" className="w-[60%] h-[350px] object-cover rounded-3xl shadow-2xl absolute bottom-0 left-0 border-8 border-[#F4F1F3]" />
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <div 
        className="py-32 text-center relative flex flex-col items-center justify-center border-t border-gray-200 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-[#3A1C31]/70 backdrop-blur-sm z-0"></div>
        <div className="relative z-10">
          <h2 className="playfair text-4xl text-white mb-6">Find Your Signature Piece</h2>
          <p className="text-white/80 mb-10 max-w-md mx-auto leading-relaxed">Browse our complete catalog to find the exact piece of sterling silver that speaks to your style.</p>
          <Link to="/shop" className="btn-premium px-12 py-4 text-sm shadow-xl hover:shadow-2xl">
            Shop All Jewelry
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Collections;