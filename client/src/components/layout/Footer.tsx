import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoImage from "../../assets/fordive-logo-white.png";

export default function Footer() {
  return (
    <footer className="bg-[#D1AB66] py-7 px-7 md:px-16 lg:px-20 text-white">
      <div className="max-w-none mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 min-h-[400px]">
          {/* KIRI */}
          <div className="bg-[#d1ab66]/30 rounded-2xl px-10 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20 md:w-1/3 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full h-full gap-6 text-center">
              <img
                src={logoImage}
                alt="Fordive Logo"
                className="h-32 md:h-36 lg:h-40"
              />
              <p className="text-white/90 text-base md:text-lg">
                Love More Live More
              </p>
              <Link href="/quiz">
                <Button className="bg-[#D1AB66] hover:bg-[#C4A05B] text-white py-2 px-6 rounded-md text-sm font-medium transition-all duration-300">
                  Find Your Scent Here
                </Button>
              </Link>
            </div>
          </div>

          {/* KANAN */}
          <div className="bg-[#d1ab66]/30 rounded-2xl px-10 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20 w-full md:w-2/3 flex flex-col sm:flex-row gap-8 sm:gap-16 md:justify-end">
            {/* COMPANY */}
            <div className="pt-6 border-t border-white/20 sm:border-t-0 sm:pt-0">
              <h4 className="text-lg font-semibold text-white mb-4 font-inter">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-left">
                <li>
                  <a
                    href="https://fordive.id/about-us/"
                    className="text-white/80 hover:text-white"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://fordive.id/mission/"
                    className="text-white/80 hover:text-white"
                  >
                    Impact
                  </a>
                </li>
                <li>
                  <a
                    href="https://fordive.id/shop/"
                    className="text-white/80 hover:text-white"
                  >
                    Product
                  </a>
                </li>
              </ul>
            </div>

            {/* SHOP */}
            <div className="pt-6 border-t border-white/20 sm:border-t-0 sm:pt-0">
              <h4 className="text-lg font-semibold text-white mb-4 font-inter">
                Shop
              </h4>
              <ul className="space-y-2 text-sm text-left">
                <li>
                  <a
                    href="https://shopee.co.id/fordive.id"
                    className="text-white/80 hover:text-white"
                  >
                    Shopee
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tokopedia.com/fordiveid"
                    className="text-white/80 hover:text-white"
                  >
                    Tokopedia
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lazada.co.id/shop/fordive"
                    className="text-white/80 hover:text-white"
                  >
                    Lazada
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@fordive.id"
                    className="text-white/80 hover:text-white"
                  >
                    TikTok Shop
                  </a>
                </li>
                <li>
                  <a
                    href="https://fordive.id/distributor/"
                    className="text-white/80 hover:text-white"
                  >
                    Distributor
                  </a>
                </li>
              </ul>
            </div>

            {/* LET'S TALK */}
            <div className="pt-6 border-t border-white/20 sm:border-t-0 sm:pt-0">
              <h4 className="text-lg font-semibold text-white mb-4 font-inter">
                Let's Talk
              </h4>
              <ul className="space-y-2 text-sm text-left">
                <li>
                  <a
                    href="https://www.instagram.com/fordive.id/"
                    className="text-white/80 hover:text-white"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@fordive.id"
                    className="text-white/80 hover:text-white"
                  >
                    TikTok
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/fordive_id"
                    className="text-white/80 hover:text-white"
                  >
                    X/Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/fordive.id"
                    className="text-white/80 hover:text-white"
                  >
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
