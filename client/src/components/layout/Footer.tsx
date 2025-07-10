import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoImage from "../../assets/fordive-logo-white.png";

export default function Footer() {
  return (
    <footer className="bg-[#D1AB66] py-16 px-6 md:px-12 lg:px-16 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
          {/* Logo and Tagline Section */}
          <div className="flex flex-col items-start">
            <div className="mb-6">
              <img src={logoImage} alt="Fordive Logo" className="h-20 md:h-24" />
            </div>
            <p className="text-white text-base font-medium mb-0">
              Love More Live More
            </p>
          </div>
          
          {/* Company Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-inter">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://fordive.id/aboutus/" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://fordive.id/fordive/mission/" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Impact
                </a>
              </li>
              <li>
                <a href="https://fordive.id/fordive/shop/" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Product
                </a>
              </li>
            </ul>
          </div>
          
          {/* Shop Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-inter">Shop</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://shopee.co.id/fordive" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Shopee
                </a>
              </li>
              <li>
                <a href="https://www.tokopedia.com/fordiveperfume" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Tokopedia
                </a>
              </li>
              <li>
                <a href="https://www.lazada.co.id/shop/fordive" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Lazada
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@fordive.id" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Tiktok Shop
                </a>
              </li>
              <li>
                <a href="https://fordive.id/distributor/" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Distributor
                </a>
              </li>
            </ul>
          </div>
          
          {/* Let's Talk Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-inter">Let's Talk</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://www.instagram.com/fordive.id/" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@fordive.id" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Tiktok
                </a>
              </li>
              <li>
                <a href="https://x.com/Fordiveperfume" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  X/Twitter
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/Fordive.idn/" className="text-white hover:text-white/80 transition-colors duration-300 text-base">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
