import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './landing.css'; 

// IMAGE IMPORTS
import logoImg from './assets/logo1.png';
import heroArtImg from './assets/main-necklace-img.png';
import floatingNecklaceImg from './assets/main-necklace.png';
import ringCollectionImg from './assets/main-ring-img.png';
import necklaceBlueImg from './assets/necklace-blue.png';
import earringsImg from './assets/earrings.png';

const Landing = () => {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const handleMouseMove = (e) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // WHATSAPP CHECKOUT FUNCTION
  const buyOnWhatsApp = (productName, price) => {
    const phoneNumber = "919967575151"; // <-- YOUR NUMBER HERE
    const message = `Hello Alora Jewels! ✨\nI am interested in purchasing the *${productName}* priced at *${price}*.\nPlease let me know how to proceed!`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="overflow-x-hidden relative">
      <div className="cursor" id="cursor"></div>

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-16 py-2 relative z-50 bg-[#23151B]/80 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="logo-container">
          <img src={logoImg} alt="Alora Jewels Logo" className="logo-header" />
        </Link>
        <nav className="space-x-10 text-sm uppercase tracking-widest opacity-90">
          <Link to="/collections" className="hover:text-[#7C3B65] transition">Collections</Link>
          <Link to="/about" className="hover:text-[#7C3B65] transition">About</Link>
          <Link to="/shop" className="hover:text-[#7C3B65] transition">Shop</Link>
          <Link to="/contact" className="hover:text-[#7C3B65] transition">Contact</Link>
        </nav>
        <button className="btn-premium px-6 py-3 text-xs">Get in Touch</button>
      </header>

      {/* HERO SECTION */}
      <section className="flex justify-between items-center px-20 py-20 gap-16 relative min-h-[90vh]">
        <div className="circle c1"></div>
        <div className="circle c2"></div>

        <div className="max-w-2xl z-10">
          <div className="pill-label mb-6">✨ Pure 925 Sterling Silver Jewellery</div>
          <h1 className="playfair text-7xl leading-tight mb-6">
            Elegance <br /><span className="text-[#7C3B65] italic">Handcrafted</span> for You
          </h1>
          <p className="text-[#bfa5b7] max-w-lg mb-10 leading-relaxed text-lg">
            Discover timeless beauty with our curated collection of genuine sterling silver pieces, designed to celebrate your unique grace.
          </p>
          <div className="flex gap-5">
            <Link to="/shop" className="btn-premium px-8 py-4 inline-block">Explore Collection →</Link>
            <button className="btn-outline px-8 py-4 rounded-lg">Custom Designs</button>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="relative z-10 hero-img-wrap">
          <img src={heroArtImg} alt="Alora Hero Art" className="w-[480px] h-[580px] object-cover rounded-t-[150px] rounded-b-3xl shadow-2xl transition duration-700 hover:scale-[1.02]" />
          <div className="hero-card absolute -bottom-8 left-[-40px] bg-[#2A1823]/95 backdrop-blur-lg px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/10">
            <img src={floatingNecklaceImg} alt="Emerald Cut Pendant" className="w-16 h-16 rounded-full object-cover ring-2 ring-[#7C3B65]/50" />
            <div className="text-[#D5B2CD]">
              <span className="text-[10px] tracking-widest uppercase text-[#9b5a84] font-semibold">✨ Featured</span>
              <p className="font-medium text-lg playfair text-white">Emerald Cut Pendant</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS WITH WHATSAPP CART */}
      <section className="py-28 bg-[#F4F1F3] text-center">
        <h2 className="playfair text-5xl text-[#3A1C31] mb-3">Shop Our Best Sellers</h2>
        <p className="text-[#8a6f7f] mb-10 text-[15px] leading-relaxed max-w-lg mx-auto">
          Explore our most-loved, tarnish-free sterling silver pieces.
        </p>

        <div className="grid grid-cols-3 gap-10 px-20 max-lg:grid-cols-2 max-sm:grid-cols-1 max-w-[1500px] mx-auto">
          {/* PRODUCT 1 */}
          <div className="product-card bg-white rounded-2xl shadow hover:-translate-y-2 hover:shadow-2xl transition duration-500 overflow-hidden group">
            <div className="overflow-hidden">
              <img src={ringCollectionImg} alt="Celestial Stackable Rings" className="w-full h-[280px] object-cover transition duration-700 group-hover:scale-110" />
            </div>
            <div className="p-6 text-left">
              <span className="text-xs text-[#7C3B65]/70 uppercase tracking-widest font-medium mb-1">Rings</span>
              <h3 className="playfair text-lg text-[#3A1C31] mb-4">Celestial Stackable Band</h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#7C3B65]">₹2,299</span>
                <button onClick={() => buyOnWhatsApp('Celestial Stackable Band', '₹2,299')} className="bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#128C7E] transition flex items-center gap-2">
                  <i className="fab fa-whatsapp text-lg"></i> Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT 2 */}
          <div className="product-card bg-white rounded-2xl shadow hover:-translate-y-2 hover:shadow-2xl transition duration-500 overflow-hidden group">
            <div className="overflow-hidden">
              <img src={necklaceBlueImg} alt="Luna Pendant Necklace" className="w-full h-[280px] object-cover transition duration-700 group-hover:scale-110" />
            </div>
            <div className="p-6 text-left">
              <span className="text-xs text-[#7C3B65]/70 uppercase tracking-widest font-medium mb-1">Necklaces</span>
              <h3 className="playfair text-lg text-[#3A1C31] mb-4">Luna Solitaire Pendant</h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#7C3B65]">₹3,499</span>
                <button onClick={() => buyOnWhatsApp('Luna Solitaire Pendant', '₹3,499')} className="bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#128C7E] transition flex items-center gap-2">
                  <i className="fab fa-whatsapp text-lg"></i> Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT 3 */}
          <div className="product-card bg-white rounded-2xl shadow hover:-translate-y-2 hover:shadow-2xl transition duration-500 overflow-hidden group">
            <div className="overflow-hidden">
              <img src={earringsImg} alt="Stardust Hoop Earrings" className="w-full h-[280px] object-cover transition duration-700 group-hover:scale-110" />
            </div>
            <div className="p-6 text-left">
              <span className="text-xs text-[#7C3B65]/70 uppercase tracking-widest font-medium mb-1">Earrings</span>
              <h3 className="playfair text-lg text-[#3A1C31] mb-4">Stardust Dainty Hoops</h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#7C3B65]">₹1,899</span>
                <button onClick={() => buyOnWhatsApp('Stardust Dainty Hoops', '₹1,899')} className="bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#128C7E] transition flex items-center gap-2">
                  <i className="fab fa-whatsapp text-lg"></i> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESTORED: THE ALORA PROMISE */}
      <section className="py-24 bg-white text-center">
        <h2 className="playfair text-5xl text-[#3A1C31] mb-12">The Alora Promise</h2>
        <div className="grid grid-cols-4 gap-8 px-20 max-w-[1400px] mx-auto max-lg:grid-cols-2 max-sm:grid-cols-1">
          <div className="p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
            <i className="fas fa-gem text-3xl text-[#7C3B65] mb-4"></i>
            <h4 className="playfair text-xl mb-2 text-[#3A1C31]">Certified 925</h4>
            <p className="text-sm text-[#8a6f7f]">Hallmarked authenticity in every piece.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
            <i className="fas fa-tint text-3xl text-[#7C3B65] mb-4"></i>
            <h4 className="playfair text-xl mb-2 text-[#3A1C31]">Water Resistant</h4>
            <p className="text-sm text-[#8a6f7f]">Tarnish-free rhodium plating for daily wear.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
            <i className="fas fa-gift text-3xl text-[#7C3B65] mb-4"></i>
            <h4 className="playfair text-xl mb-2 text-[#3A1C31]">Luxurious Gifting</h4>
            <p className="text-sm text-[#8a6f7f]">Delivered in our signature premium boxes.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
            <i className="fas fa-truck-fast text-3xl text-[#7C3B65] mb-4"></i>
            <h4 className="playfair text-xl mb-2 text-[#3A1C31]">Express Delivery</h4>
            <p className="text-sm text-[#8a6f7f]">Safe, insured, and fast shipping nationwide.</p>
          </div>
        </div>
      </section>

      {/* RESTORED: TESTIMONIALS */}
      <section className="py-24 bg-[#F4F1F3] text-center">
        <h2 className="playfair text-5xl text-[#3A1C31] mb-12">Stories of Sparkle</h2>
        <div className="grid grid-cols-3 gap-8 px-20 max-w-[1400px] mx-auto max-lg:grid-cols-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
            <div className="text-[#d4af37] mb-4 text-lg">★★★★★</div>
            <p className="text-[#8a6f7f] italic mb-6">"The silver jewellery from Alora is absolutely stunning. I get compliments every time I wear my moonlit pendant."</p>
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/100?img=5" alt="Customer" className="w-12 h-12 rounded-full" />
              <div><h5 className="font-semibold text-[#3A1C31]">Priya Sharma</h5><span className="text-xs text-gray-500">Mumbai</span></div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
            <div className="text-[#d4af37] mb-4 text-lg">★★★★★</div>
            <p className="text-[#8a6f7f] italic mb-6">"Every piece is crafted with such care — the 92.5 sterling silver is pure luxury at an accessible price point."</p>
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/100?img=9" alt="Customer" className="w-12 h-12 rounded-full" />
              <div><h5 className="font-semibold text-[#3A1C31]">Ananya Patel</h5><span className="text-xs text-gray-500">Delhi</span></div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
            <div className="text-[#d4af37] mb-4 text-lg">★★★★★</div>
            <p className="text-[#8a6f7f] italic mb-6">"The packaging is beautiful and the rings haven't tarnished at all. Definitely my go-to for silver jewelry now."</p>
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/100?img=20" alt="Customer" className="w-12 h-12 rounded-full" />
              <div><h5 className="font-semibold text-[#3A1C31]">Kavya Reddy</h5><span className="text-xs text-gray-500">Bengaluru</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* RESTORED: NEWSLETTER & FOOTER */}
      <footer className="bg-gradient-to-br from-[#5c2d4a] to-[#7C3B65] text-white pt-16 pb-10">
        <div className="px-20 grid grid-cols-3 gap-12 max-w-[1400px] mx-auto max-lg:grid-cols-1">
          <div>
            <img src={logoImg} alt="Alora Jewels Logo" className="h-[90px] object-contain mb-6 rounded-full border-2 border-white/20" />
            <p className="text-sm text-white/80 leading-relaxed mb-8">Crafting tarnish-free elegance meant for daily luxury.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"><i className="fab fa-instagram"></i></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>
          <div>
            <h3 className="playfair text-xl mb-6">Quick Links</h3>
            <ul className="space-y-3.5 text-sm text-white/80">
              <li><Link to="/shop" className="hover:text-white transition">Shop All</Link></li>
              <li><Link to="/collections" className="hover:text-white transition">Collections</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="playfair text-xl mb-4">Join The Circle</h3>
            <p className="text-sm text-white/80 mb-6">Subscribe for exclusive previews and offers.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email Address" className="flex-1 bg-white px-4 py-2.5 rounded-lg text-sm text-black outline-none" />
              <button className="bg-white text-[#7C3B65] px-4 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-gray-100 transition">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;