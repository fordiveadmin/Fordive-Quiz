import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoImage from "../../assets/fordive-logo-white.png";

export default function Footer() {
  return (
    <footer className="bg-[#D4AE73] py-16 px-8 md:px-16 lg:px-24 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-start">
          {/* Logo and Tagline Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white">
                FORDIVE
              </h1>
            </div>
            <p className="text-white text-base font-medium">
              Love More Live More
            </p>
          </div>
          
          {/* Right Side - 3 Columns */}
          <div className="flex gap-16 lg:gap-20">
            {/* Company Section */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 font-sans">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://fordive.id/aboutus/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="https://fordive.id/fordive/mission/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Impact
                  </a>
                </li>
                <li>
                  <a href="https://fordive.id/fordive/shop/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Product
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Shop Section */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 font-sans">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://shopee.co.id/fordive" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Shopee
                  </a>
                </li>
                <li>
                  <a href="https://www.tokopedia.com/fordiveperfume" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Tokopedia
                  </a>
                </li>
                <li>
                  <a href="https://www.lazada.co.id/shop/fordive" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Lazada
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@fordive.id" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Tiktok Shop
                  </a>
                </li>
                <li>
                  <a href="https://fordive.id/distributor/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Distributor
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Let's Talk Section */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 font-sans">Let's Talk</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.instagram.com/fordive.id/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@fordive.id" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Tiktok
                  </a>
                </li>
                <li>
                  <a href="https://x.com/Fordiveperfume" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    X/Twitter
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/Fordive.idn/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Logo and Tagline Section */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="mb-6">
              <h1 className="text-3xl font-serif font-bold text-white">
                FORDIVE
              </h1>
            </div>
            <p className="text-white text-base font-medium">
              Love More Live More
            </p>
          </div>
          
          {/* Mobile Columns */}
          <div className="grid grid-cols-1 gap-8">
            {/* Company Section */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 font-sans">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://fordive.id/aboutus/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="https://fordive.id/fordive/mission/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Impact
                  </a>
                </li>
                <li>
                  <a href="https://fordive.id/fordive/shop/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Product
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Shop Section */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 font-sans">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://shopee.co.id/fordive" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Shopee
                  </a>
                </li>
                <li>
                  <a href="https://www.tokopedia.com/fordiveperfume" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Tokopedia
                  </a>
                </li>
                <li>
                  <a href="https://www.lazada.co.id/shop/fordive" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Lazada
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@fordive.id" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Tiktok Shop
                  </a>
                </li>
                <li>
                  <a href="https://fordive.id/distributor/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Distributor
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Let's Talk Section */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 font-sans">Let's Talk</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.instagram.com/fordive.id/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@fordive.id" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Tiktok
                  </a>
                </li>
                <li>
                  <a href="https://x.com/Fordiveperfume" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    X/Twitter
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/Fordive.idn/" className="text-white hover:text-white/80 transition-colors duration-300 text-base no-underline">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
