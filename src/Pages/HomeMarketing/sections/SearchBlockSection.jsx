import { useState } from "react";
import CityAutocomplete from "../../../components/common/CityAutocomplete";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

/**
 * Section 2 — Search block
 * Gauche : titre/subtitle. Droite : formulaire (location, purchase, mode).
 * Soumet vers /properties?search=true avec les filtres pré-remplis.
 */
const SearchBlockSection = () => {
  const navigate = useNavigate();

  // Onglets : Achat, Location, Annuaire
  // Achat: proposal=Buy, mode=search
  // Location: proposal=Rent, mode=search
  // Annuaire: proposal=Buy, mode=directory
  const [tab, setTab] = useState("Buy"); // "Buy" | "Rent" | "Directory"
  const [form, setForm] = useState({
    city: "",
    propertyType: "",
  });


  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ search: "true" });
    if (form.city) params.set("search", form.city);
    if (form.propertyType) params.set("propertyType", form.propertyType);
    if (tab === "Buy") {
      params.set("proposal", "Buy");
      params.set("mode", "search");
    } else if (tab === "Rent") {
      params.set("proposal", "Rent");
      params.set("mode", "search");
    } else if (tab === "Directory") {
      params.set("proposal", "Buy");
      params.set("mode", "directory");
      params.set("directory", "true");
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="bg-[#976DD0]/10 py-36">
      <div className="container mx-auto px-5 grid lg:grid-cols-2 gap-10 items-center">
        <div className="lg:pl-0 flex flex-col items-start max-w-3xl w-full mx-auto">
          <span className="inline-flex items-center gap-2 bg-[#976DD0]/20 text-gray-900 rounded-full px-4 py-1.5 mb-4 text-[13px] font-medium">
            <FaHeart className="w-3.5 h-3.5 text-black" />
            Annuaire des biens immobiliers résidentiels
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
            Trouver le bien idéal
          </h2>
          <p className="text-gray-700 text-[15px] max-w-xl">
            +20 000 biens disponibles. Le seul annuaire immobilier de marché
            français. Consulter les biens en vente/location pour vos
            transactions immédiates ou anticipez des biens immobiliers pour
            préparer une transaction future.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4 mx-auto w-full max-w-md"
        >
          {/* Onglets */}
          <div className="flex justify-center gap-2 mb-2">
            {[
              { label: "Achat", value: "Buy" },
              { label: "Location", value: "Rent" },
              { label: "Annuaire", value: "Directory" },
            ].map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-5 py-2 rounded-full font-medium text-[14px] transition border border-[#976DD0]/30 ${
                  tab === t.value
                    ? "bg-[#976DD0] text-white shadow"
                    : "bg-white text-[#976DD0] hover:bg-[#f3eaff]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Type de bien — radio group */}
          <div className="flex justify-center gap-6 mb-2" id="property-type-radios">
            {[
              { label: "Appartement", value: "Apartment" },
              { label: "Maison", value: "House" },
              { label: "Immeuble", value: "Building" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center cursor-pointer gap-2 text-[15px] font-medium">
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition ${
                    form.propertyType === opt.value
                      ? "border-[#976DD0]"
                      : "border-gray-300"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full transition ${
                      form.propertyType === opt.value
                        ? "bg-[#976DD0]"
                        : "bg-transparent"
                    }`}
                  />
                </span>
                <input
                  type="radio"
                  name="propertyType"
                  value={opt.value}
                  checked={form.propertyType === opt.value}
                  onChange={() => setForm({ ...form, propertyType: opt.value })}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>

          {/* Ville (Google Autocomplete) */}
          <div className="flex justify-center mb-1">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5 bg-white"
                 style={{ minWidth: 0, width: '320px', maxWidth: '90%' }}>
              <FiMapPin className="w-4 h-4 text-gray-400" />
              <div style={{ flex: 1 }}>
                <CityAutocomplete
                  value={form.city}
                  onChange={city => setForm({ ...form, city })}
                  onSelect={({ city, postalCode }) => setForm(f => ({ ...f, city }))}
                  placeholder="Ville, code postal…"
                  className="w-full bg-transparent text-[14px] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Plus de critères */}
          <div className="flex justify-center mb-2">
            <div style={{ width: '320px', maxWidth: '90%', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="text-[#976DD0] hover:underline text-[14px] font-medium"
                onClick={() => navigate('/properties?advanced=1')}
              >
                Plus de critères
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-[#976DD0] hover:bg-[#7e54bd] text-white font-medium rounded-full px-4 py-2 transition min-w-[120px]"
              style={{ width: "auto", maxWidth: "180px" }}
            >
              <FiSearch /> Rechercher
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchBlockSection;
