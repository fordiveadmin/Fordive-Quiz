import { Link } from "wouter";
import logoImage from "../../assets/fordive-logo-white.png";

export default function Footer() {
  return (
    <footer className="bg-[#C89F65] py-12 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start">
            <div className="mb-4">
              <img src={logoImage} alt="Fordive Logo" className="h-24" />
            </div>
            <p className="text-white/90 mb-6">
              Love More Live More
            </p>
          </div>
          
          <div className="md:col-start-2 md:col-end-3">
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://fordive.id/aboutus/" className="text-white/80 hover:text-white transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://fordive.id/mission/" className="text-white/80 hover:text-white transition-colors duration-300">
                  Impact
                </a>
              </li>
              <li>
                <a href="https://fordive.id/shop/" className="text-white/80 hover:text-white transition-colors duration-300">
                  Product
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://shopee.co.id/fordive.id" className="text-white/80 hover:text-white transition-colors duration-300">
                  Shopee
                </a>
              </li>
              <li>
                <a href="https://www.tokopedia.com/fordiveid" className="text-white/80 hover:text-white transition-colors duration-300">
                  Tokopedia
                </a>
              </li>
              <li>
                <a href="https://www.lazada.co.id/shop/fordive" className="text-white/80 hover:text-white transition-colors duration-300">
                  Lazada
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@fordive.id" className="text-white/80 hover:text-white transition-colors duration-300">
                  TikTok Shop
                </a>
              </li>
              <li>
                <a href="https://fordive.id/distributor/" className="text-white/80 hover:text-white transition-colors duration-300">
                  Distributor
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Let's Talk</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.instagram.com/fordive.id/" className="text-white/80 hover:text-white transition-colors duration-300">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@fordive.id" className="text-white/80 hover:text-white transition-colors duration-300">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://twitter.com/fordive_id" className="text-white/80 hover:text-white transition-colors duration-300">
                  X/Twitter
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/fordive.id" className="text-white/80 hover:text-white transition-colors duration-300">
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
