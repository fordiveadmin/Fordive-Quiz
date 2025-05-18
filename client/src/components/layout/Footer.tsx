import { Link } from "wouter";
import { FaInstagram, FaFacebookF, FaTwitter, FaPinterestP } from "react-icons/fa";
import logoImage from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#F9F7F2] border-t border-[#E9E5D9] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img src={logoImage} alt="Fordive Logo" className="h-16" />
            </div>
            <p className="text-gray-600 mb-6">
              Discover your signature scent that matches your personality and zodiac sign.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-[#C89F65] hover:text-[#A68343] transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="text-[#C89F65] hover:text-[#A68343] transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="text-[#C89F65] hover:text-[#A68343] transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="text-[#C89F65] hover:text-[#A68343] transition-colors duration-300"
                aria-label="Pinterest"
              >
                <FaPinterestP />
              </a>
            </div>
          </div>
          
          <div className="slide-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://fordive.id/aboutus/" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://fordive.id/mission/" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  Impact
                </a>
              </li>
              <li>
                <a href="https://fordive.id/shop/" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  Product
                </a>
              </li>
            </ul>
          </div>
          
          <div className="slide-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://shopee.co.id/fordive.id" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  Shopee
                </a>
              </li>
              <li>
                <a href="https://www.tokopedia.com/fordiveid" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  Tokopedia
                </a>
              </li>
              <li>
                <a href="https://www.lazada.co.id/shop/fordive" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  Lazada
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@fordive.id" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  TikTok Shop
                </a>
              </li>
              <li>
                <a href="https://fordive.id/distributor/" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  Distributor
                </a>
              </li>
            </ul>
          </div>
          
          <div className="slide-up" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Let's Talk</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.instagram.com/fordive.id/" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@fordive.id" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://twitter.com/fordive_id" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/fordive.id" className="text-gray-600 hover:text-[#C89F65] transition-colors duration-300">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#E9E5D9] mt-12 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Fordive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
