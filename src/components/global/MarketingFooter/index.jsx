import { Link } from "react-router-dom";

/**
 * MarketingFooter — footer commun à la vitrine et aux pages Fonctionnalités.
 * Reprend la structure des maquettes : Find us on / Company / Our apps /
 * Pro services / More services + bandeau légal.
 */
const MarketingFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white xl:py-12 xl:px-20 px-8 py-8 mt-12">
      <div className="container mx-auto">
        <div className="text-center">
          <Link to="/" aria-label="AnyHomes home" className="inline-block mb-6">
            <img
              src="/assets/img/anyhomes-logo-white.png"
              alt="AnyHomes"
              className="h-8 w-auto mx-auto"
            />
          </Link>
          <h4 className="font-semibold mb-5 text-[18px]">Find us on:</h4>
          <ul className="flex items-center justify-center mb-5">
            {[
              { src: "/assets/img/footer/ins.png", alt: "Instagram", href: "#" },
              { src: "/assets/img/footer/fb.png", alt: "Facebook", href: "#" },
              { src: "/assets/img/footer/twitter.png", alt: "X", href: "#" },
              { src: "/assets/img/footer/linkedin.png", alt: "LinkedIn", href: "#" },
              { src: "/assets/img/footer/youtube.png", alt: "YouTube", href: "#" },
            ].map((s) => (
              <li key={s.alt} className="text-center px-7">
                <a href={s.href} aria-label={s.alt}>
                  <img src={s.src} alt={s.alt} className="w-[25px]" />
                </a>
              </li>
            ))}
          </ul>
          <p className="h-px bg-white w-full block mt-5" />
        </div>

        <div className="grid grid-cols-12 gap-4 mt-8">
          <div className="col-span-12 lg:col-span-3">
            <h2 className="font-bold text-lg mb-3">COMPANY</h2>
            <ul className="space-y-2 text-[14px] xl:text-[16px] text-gray-300">
              <li><a href="#" className="hover:text-white">Who are we?</a></li>
              <li><Link to="/contact-us" className="hover:text-white">Contact us</Link></li>
              <li><a href="#" className="hover:text-white">We are hiring</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <h2 className="font-bold text-lg mb-3">OUR APPS</h2>
            <ul className="space-y-2 text-[14px] xl:text-[16px] text-gray-300">
              <li><a href="#" className="hover:text-white">Discover our apps</a></li>
              <li className="flex items-center pt-1">
                <a href="#" aria-label="iOS app">
                  <img src="/assets/img/footer/apple.png" alt="iOS" className="w-[25px]" />
                </a>
                <a href="#" aria-label="Android app" className="ms-5">
                  <img src="/assets/img/footer/android.png" alt="Android" className="w-[24px]" />
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <h2 className="font-bold text-lg mb-3">PRO SERVICES</h2>
            <ul className="space-y-2 text-[14px] xl:text-[16px] text-gray-300">
              <li><a href="#" className="hover:text-white">Services for pros</a></li>
              <li><a href="#" className="hover:text-white">Client access</a></li>
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <h2 className="font-bold text-lg mb-3">MORE SERVICES</h2>
            <ul className="space-y-2 text-[14px] xl:text-[16px] text-gray-300">
              <li><Link to="/real-estate-pros" className="hover:text-white">Real estate pro repository</Link></li>
              <li><Link to="/past-transactions" className="hover:text-white">Past transaction repository</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <p className="h-px bg-white w-full block mb-6" />
          <h5 className="font-bold text-center mt-6">Bookaroo SAS - {year}</h5>
          <div className="text-center text-gray-300 text-[14px] xl:text-[16px] space-y-2 mt-4">
            <p className="cursor-pointer hover:text-white">Cookies setting</p>
            <p className="cursor-pointer hover:text-white">Terms and conditions of use</p>
            <Link to="/privacy-policy" className="block hover:text-white">General Data Protection Policy</Link>
            <p className="cursor-pointer hover:text-white">How our site works</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
