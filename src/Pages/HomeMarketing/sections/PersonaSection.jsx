import { Link } from "react-router-dom";

/**
 * Section 5 — Persona
 * Pour qui AnyHomes est-il pensé : owners, searchers, buyers, renters, etc.
 */
const personas = [
  {
    title: "Vendeur",
    text: "Vendre seul mais bien accompagné. Maîtrisez vos transactions sans commissions agence.",
  },
  {
    title: "Acheteur",
    text: "Repérez et négociez vos futurs biens, on-market et off-market, en toute autonomie.",
  },
  {
    title: "Propriétaire",
    text: "Accroître la visibilité de votre bien et préparer une vente future sans le mettre en vente immédiatement.",
  },
];

const PersonaSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-block text-[12px] font-medium uppercase tracking-wide text-[#976DD0] bg-[#976DD0]/10 rounded-full px-3 py-1 mb-3">
            Pour qui
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            À qui est destinée la plateforme AnyHomes ?
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-[15px]">
            AnyHomes est pensé par des particuliers, pour des particuliers.
            Qu'ils soient vendeurs, acheteurs ou tout simplement propriétaires
            d'un bien immobilier, AnyHomes les accompagne dans leur projet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {personas.map((p) => (
            <div
              key={p.title}
              className="p-6 rounded-2xl border border-gray-100 hover:border-[#976DD0]/40 hover:shadow-sm transition"
            >
              <h3 className="font-semibold mb-2 text-[#976DD0]">{p.title}</h3>
              <p className="text-gray-600 text-[14px]">{p.text}</p>
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

export default PersonaSection;
