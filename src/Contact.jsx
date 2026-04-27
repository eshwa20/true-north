import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from './assets/logo1.png';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openWhatsApp = () => {
    const phoneNumber = "919967575151"; 
    const message = `Hello Alora Jewels Support! ✨\nI have a question regarding...`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-[#F4F1F3] min-h-screen font-['Montserrat'] flex flex-col">
      <header className="flex justify-between items-center px-16 py-2 bg-white shadow-sm sticky top-0 z-50">
        <Link to="/" className="logo-container">
          <img src={logoImg} alt="Alora Jewels" className="h-[90px] w-auto object-contain" />
        </Link>
        <nav className="space-x-10 text-sm uppercase tracking-widest text-[#3A1C31] font-medium">
          <Link to="/collections" className="hover:text-[#7C3B65] transition">Collections</Link>
          <Link to="/about" className="hover:text-[#7C3B65] transition">About</Link>
          <Link to="/shop" className="hover:text-[#7C3B65] transition">Shop</Link>
          <Link to="/contact" className="text-[#7C3B65] border-b-2 border-[#7C3B65] pb-1">Contact</Link>
        </nav>
      </header>

      <div className="flex-1 max-w-[1200px] w-full mx-auto py-20 px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div className="text-left">
          <span className="text-xs uppercase tracking-[4px] text-[#7C3B65] font-semibold">Get In Touch</span>
          <h1 className="playfair text-5xl text-[#3A1C31] mt-4 mb-6">We'd Love To Hear From You</h1>
          <p className="text-[#8a6f7f] mb-12 leading-relaxed">
            Whether you have a question about our collections, need help with an order, or want to inquire about custom designs, our team is here for you.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-[#F4F1F3] rounded-full flex items-center justify-center text-[#7C3B65] text-xl">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <p className="font-semibold text-[#3A1C31]">Phone & WhatsApp</p>
                <p className="text-[#8a6f7f] text-sm">+91 99675 75151</p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-[#F4F1F3] rounded-full flex items-center justify-center text-[#7C3B65] text-xl">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <p className="font-semibold text-[#3A1C31]">Email</p>
                <p className="text-[#8a6f7f] text-sm">hello@alorajewels.com</p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-[#F4F1F3] rounded-full flex items-center justify-center text-[#7C3B65] text-xl">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <p className="font-semibold text-[#3A1C31]">Location</p>
                <p className="text-[#8a6f7f] text-sm">Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
          <h3 className="playfair text-2xl text-[#3A1C31] mb-6">Send a Message</h3>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-[#8a6f7f] uppercase tracking-wider mb-2">Name</label>
              <input type="text" className="w-full bg-[#F4F1F3] border-none rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C3B65]" placeholder="Your Full Name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8a6f7f] uppercase tracking-wider mb-2">Email</label>
              <input type="email" className="w-full bg-[#F4F1F3] border-none rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C3B65]" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8a6f7f] uppercase tracking-wider mb-2">Message</label>
              <textarea className="w-full bg-[#F4F1F3] border-none rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C3B65] h-32 resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button className="w-full bg-[#7C3B65] text-white py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#5c2d4a] transition shadow-lg mt-4">
              Submit Message
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-4">OR</p>
            <button onClick={openWhatsApp} className="w-full bg-[#25D366] text-white py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#128C7E] transition shadow-lg flex justify-center items-center gap-2">
              <i className="fab fa-whatsapp text-lg"></i> Chat on WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;