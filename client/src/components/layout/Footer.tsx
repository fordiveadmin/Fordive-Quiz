import { Link } from "wouter";
import { FaInstagram, FaFacebookF, FaTwitter, FaPinterestP } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-4">FORDIVE</h3>
            <p className="text-gray-400 mb-6">
              Discover your signature scent that matches your personality and zodiac sign.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-300"
                aria-label="Pinterest"
              >
                <FaPinterestP />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  All Fragrances
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  Gift Sets
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  Ingredients
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  Press
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Fordive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
