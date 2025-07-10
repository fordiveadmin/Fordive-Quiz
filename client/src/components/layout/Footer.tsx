import logoImage from "../../assets/fordive-logo-white.png";

export default function Footer() {
  return (
    <footer className="bg-[#D1AB66] text-white px-6 py-10 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-y-12 gap-x-24">
        {/* Kiri - Logo dan Tagline */}
        <div className="md:w-1/3 flex flex-col items-start">
          <img
            src={logoImage}
            alt="Fordive Logo"
            className="h-28 md:h-32 mb-4"
          />
          <p className="text-white/90 text-base">Love More Live More</p>
        </div>

        {/* Kanan - 3 Kolom Link */}
        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-12">
          {/* Kolom 1 - Company */}
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/aboutus" className="text-white/80 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/mission" className="text-white/80 hover:text-white">
                  Impact
                </a>
              </li>
              <li>
                <a href="/shop" className="text-white/80 hover:text-white">
                  Product
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 2 - Shop */}
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2">
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
                  href="https://tokopedia.com/fordiveid"
                  className="text-white/80 hover:text-white"
                >
                  Tokopedia
                </a>
              </li>
              <li>
                <a
                  href="https://lazada.co.id/shop/fordive"
                  className="text-white/80 hover:text-white"
                >
                  Lazada
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@fordive.id"
                  className="text-white/80 hover:text-white"
                >
                  TikTok Shop
                </a>
              </li>
              <li>
                <a
                  href="/distributor"
                  className="text-white/80 hover:text-white"
                >
                  Distributor
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3 - Let's Talk */}
          <div>
            <h4 className="text-white font-semibold mb-3">Let’s Talk</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://instagram.com/fordive.id"
                  className="text-white/80 hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@fordive.id"
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
                  href="https://facebook.com/fordive.id"
                  className="text-white/80 hover:text-white"
                >
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
