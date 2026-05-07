import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";
import { FiSearch, FiMapPin, FiChevronDown, FiMenu, FiX, FiUser } from "react-icons/fi";
import LanguageSwitcher from "../../../LanguageSwitcher";
import { getPostLoginRoute } from "../../onboarding/onboarding.hook";

/**
 * MarketingHeader — header de la vitrine AnyHomes.
 *
 * Specs :
 * - Bandeau branding "AnyHomes / Vendre seul mais bien accompagné"
 * - Menu : Propriétaire (dropdown), Acheter (search inline), Vendre (dropdown),
 *   Louer (search inline), Fonctionnalités (dropdown), CTA dynamique.
 * - Visiteur : "S'inscrire" + "Connexion".
 * - Connecté : "Dashboard" → getPostLoginRoute() (≥50% complétion → /dashboard, sinon /onboarding).
 */
const MarketingHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?.loggedIn;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [buyForm, setBuyForm] = useState({ type: "", city: "" });
  const [rentForm, setRentForm] = useState({ type: "", city: "" });

  const goToDashboard = () => navigate(getPostLoginRoute());

  const submitBuy = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ search: "true", proposal: "Buy" });
    if (buyForm.type) params.set("propertyType", buyForm.type);
    if (buyForm.city) params.set("search", buyForm.city);
    navigate(`/properties?${params.toString()}`);
  };

  const submitRent = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ search: "true", proposal: "Rent" });
    if (rentForm.type) params.set("propertyType", rentForm.type);
    if (rentForm.city) params.set("search", rentForm.city);
    navigate(`/properties?${params.toString()}`);
  };

  /* --- Menus --- */
  const ownerLinks = [
    { label: "Référencer mon bien", to: "/property-profile" },
    { label: "Pourquoi référencer mon bien", to: "/property-profile#why" },
  ];
  const sellLinks = [
    { label: "Vendre", to: "/off-market" },
    { label: "Estimation", to: "/peer-to-peer-estimation" },
    { label: "Historique des transactions", to: "/transaction-history" },
    { label: "Services à la carte", to: "/on-demand-agent" },
  ];
  const featureLinks = [
    { label: "Profil d'un bien", to: "/property-profile" },
    { label: "Vente Off-Market", to: "/off-market" },
    { label: "Outil transactionnel", to: "/transaction-tool" },
    { label: "Peer-to-peer estimation", to: "/peer-to-peer-estimation" },
    { label: "Agent à la demande", to: "/on-demand-agent" },
    { label: "Historique des transactions", to: "/transaction-history" },
    { label: "Centre de formation", to: "/training-center" },
  ];

  const propertyTypes = [
    { value: "", label: "Type de bien" },
    { value: "Apartment", label: "Appartement" },
    { value: "House", label: "Maison" },
    { value: "Building", label: "Immeuble" },
    { value: "Castle", label: "Château" },
    { value: "Farm", label: "Ferme" },
  ];

  return (
    <header className="marketing-header sticky top-0 z-30 pt-6 pb-4 pointer-events-none">
      <div className="container mx-auto px-5">
        <div className="mx-auto flex items-center gap-6 bg-white rounded-full shadow-lg ring-1 ring-black/5 px-5 py-2.5 max-w-6xl pointer-events-auto">
          {/* Logo */}
          <Link to="/" className="shrink-0" aria-label="AnyHomes home">
            <img
              src="/assets/img/anyhomes-logo-purple.png"
              alt="AnyHomes"
              className="h-10 w-auto"
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-6 text-[14px] text-gray-700 flex-1">
            <DropdownMenu label="Propriétaire" items={ownerLinks} />

            <InlineSearchMenu
              label="Acheter"
              form={buyForm}
              setForm={setBuyForm}
              onSubmit={submitBuy}
              propertyTypes={propertyTypes}
              ctaLabel="Voir les biens à vendre"
            />

            <DropdownMenu label="Vendre" items={sellLinks} />

            <InlineSearchMenu
              label="Louer"
              form={rentForm}
              setForm={setRentForm}
              onSubmit={submitRent}
              propertyTypes={propertyTypes}
              ctaLabel="Voir les biens à louer"
            />

            <DropdownMenu label="Fonctionnalités" items={featureLinks} />
          </nav>

          {/* Right cluster */}
          <div className="ml-auto lg:ml-0 flex items-center gap-3 shrink-0">
            <LanguageSwitcher />

            {isLoggedIn ? (
              <button
                onClick={goToDashboard}
                className="hidden sm:inline-flex items-center gap-2 bg-[#976DD0] hover:bg-[#7e54bd] text-white text-[13px] font-medium rounded-full px-4 py-2 transition"
              >
                <FiUser className="w-4 h-4" /> Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex text-[13px] text-gray-700 hover:text-[#976DD0]"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center bg-[#976DD0] hover:bg-[#7e54bd] text-white text-[13px] font-medium rounded-full px-4 py-2 transition"
                >
                  S'inscrire
                </Link>
              </>
            )}

            {/* Burger mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 text-gray-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mx-5 mt-3 bg-white rounded-2xl shadow-lg ring-1 ring-black/5 px-5 py-4 space-y-4 pointer-events-auto">
          <MobileGroup title="Propriétaire" items={ownerLinks} onNavigate={() => setMobileOpen(false)} />
          <MobileSearch
            title="Acheter"
            form={buyForm}
            setForm={setBuyForm}
            onSubmit={(e) => { submitBuy(e); setMobileOpen(false); }}
            propertyTypes={propertyTypes}
          />
          <MobileGroup title="Vendre" items={sellLinks} onNavigate={() => setMobileOpen(false)} />
          <MobileSearch
            title="Louer"
            form={rentForm}
            setForm={setRentForm}
            onSubmit={(e) => { submitRent(e); setMobileOpen(false); }}
            propertyTypes={propertyTypes}
          />
          <MobileGroup title="Fonctionnalités" items={featureLinks} onNavigate={() => setMobileOpen(false)} />
        </div>
      )}
    </header>
  );
};

/* --- Desktop dropdown --- */
const DropdownMenu = ({ label, items }) => (
  <Menu as="div" className="relative">
    <Menu.Button className="flex items-center gap-1 hover:text-[#976DD0]">
      {label} <FiChevronDown className="w-3.5 h-3.5" />
    </Menu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-150"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-white border border-gray-100 shadow-lg focus:outline-none py-2 z-40">
        {items.map((it) => (
          <Menu.Item key={it.to + it.label}>
            {({ active }) => (
              <Link
                to={it.to}
                className={`block px-4 py-2 text-[13px] ${active ? "bg-[#976DD0]/10 text-[#976DD0]" : "text-gray-700"}`}
              >
                {it.label}
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Transition>
  </Menu>
);

/* --- Desktop inline search dropdown (Acheter / Louer) --- */
const InlineSearchMenu = ({ label, form, setForm, onSubmit, propertyTypes, ctaLabel }) => (
  <Menu as="div" className="relative">
    <Menu.Button className="flex items-center gap-1 hover:text-[#976DD0]">
      {label} <FiChevronDown className="w-3.5 h-3.5" />
    </Menu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-150"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <Menu.Items className="absolute right-0 mt-2 w-[360px] origin-top-right rounded-lg bg-white border border-gray-100 shadow-lg focus:outline-none p-4 z-40">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2">
            <FiSearch className="w-4 h-4 text-gray-400" />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="flex-1 bg-transparent text-[13px] outline-none"
            >
              {propertyTypes.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2">
            <FiMapPin className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ville, code postal…"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="flex-1 bg-transparent text-[13px] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#976DD0] hover:bg-[#7e54bd] text-white text-[13px] font-medium rounded-full px-4 py-2 transition"
          >
            {ctaLabel}
          </button>
        </form>
      </Menu.Items>
    </Transition>
  </Menu>
);

/* --- Mobile helpers --- */
const MobileGroup = ({ title, items, onNavigate }) => (
  <div>
    <p className="text-[12px] font-semibold uppercase text-gray-500 mb-2">{title}</p>
    <ul className="space-y-1">
      {items.map((it) => (
        <li key={it.to + it.label}>
          <Link
            to={it.to}
            onClick={onNavigate}
            className="block py-1.5 text-[14px] text-gray-700 hover:text-[#976DD0]"
          >
            {it.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const MobileSearch = ({ title, form, setForm, onSubmit, propertyTypes }) => (
  <div>
    <p className="text-[12px] font-semibold uppercase text-gray-500 mb-2">{title}</p>
    <form onSubmit={onSubmit} className="space-y-2">
      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="w-full border border-gray-200 rounded-full px-3 py-2 text-[13px] bg-white"
      >
        {propertyTypes.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Ville, code postal…"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
        className="w-full border border-gray-200 rounded-full px-3 py-2 text-[13px]"
      />
      <button
        type="submit"
        className="w-full bg-[#976DD0] hover:bg-[#7e54bd] text-white text-[13px] font-medium rounded-full px-4 py-2"
      >
        Rechercher
      </button>
    </form>
  </div>
);

export default MarketingHeader;
