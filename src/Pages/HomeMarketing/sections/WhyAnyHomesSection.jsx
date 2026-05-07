import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

/**
 * Section 3 — Why AnyHomes matters
 * Friction de marché, commissions, échecs… et comment AnyHomes change la donne.
 */
const stats = [
  {
    value: "1/4",
    label: "Seul 1 particulier sur 4 réussit à vendre son bien immobilier seul.",
  },
  {
    value: "12 000 €",
    label: "Commission moyenne en cas de bascule vers une agence immobilière.",
  },
  {
    value: "100 %",
    label: "Ce sont vos chances de réussir votre vente seul, avec AnyHomes.",
  },
];

const WhyAnyHomesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          {/* Picto coeur + texte Solution tout-en-un */}
          <span className="inline-flex items-center gap-2 bg-[#976DD0]/20 text-gray-900 rounded-full px-4 py-1.5 mb-3 mt-14 text-[13px] font-medium">
            <FaHeart className="w-3.5 h-3.5 text-black" />
            Solution tout-en-un
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Pourquoi AnyHomes <br className="sm:hidden" />
            est indispensable ?
          </h2>
          <p className="text-gray-700 text-[15px] max-w-xl mx-auto mt-4">
            Vendre un bien immobilier est un processus long et compliqué qui demande de nombreuses compétences : juridique, gestion, relationnelle, financière...
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div
              key={s.value}
              className="text-center px-5 py-8 rounded-2xl border border-gray-100 hover:border-[#976DD0]/40 transition"
            >
              <p className="text-3xl font-bold text-[#976DD0] mb-3">
                {s.value}
              </p>
              <p className="text-gray-600 text-[14px]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/signup"
            className="inline-flex items-center bg-[#976DD0] hover:bg-[#7e54bd] text-white font-medium rounded-full px-6 py-3 transition"
          >
            Démarrer gratuitement
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyAnyHomesSection;
