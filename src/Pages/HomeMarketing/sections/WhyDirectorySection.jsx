import { Link } from "react-router-dom";

/**
 * Section 6 — Why an immo annuaire (Directory)
 * Positionne l'annuaire comme un outil de visibilité, monitoring et future-sale.
 */
const benefits = [
  {
    title: "Anticipation et instantanéité",
    text: "Le marché immobilier traditionnel ne propose des biens que lorsqu'ils sont en vente. Avec AnyHomes, anticipez votre transaction.",
  },
  {
    title: "Choix démultiplié",
    text: "L'annuaire AnyHomes vous donne accès à 10 fois plus de biens immobiliers, où que vous soyez en France.",
  },
  {
    title: "Opportunités spontanées",
    text: "Et si demain votre bien idéal apparaissait ? Recevez des alertes spontanées avec AnyHomes.",
  },
];

const WhyDirectorySection = () => {
  return (
    <section className="py-16 bg-[#976DD0] text-white">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-block text-[12px] font-medium uppercase tracking-wide bg-white/15 rounded-full px-3 py-1 mb-3">
            Annuaire AnyHomes
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Pourquoi un annuaire des biens immobiliers ?
          </h2>
          <p className="text-white/80 mt-3 max-w-2xl mx-auto text-[15px]">
            Référencez l'ensemble des biens immobiliers d'un marché donné, qu'ils
            soient en vente ou non, recréez un nouveau marché et faite naître de
            nouvelles opportunités pour tous les acteurs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm"
            >
              <h3 className="font-semibold mb-2">{b.title}</h3>
              <p className="text-white/85 text-[14px]">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/signup"
            className="inline-flex items-center bg-white text-[#976DD0] hover:bg-gray-100 font-medium rounded-full px-6 py-3 transition"
          >
            Créer mon profil gratuitement
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyDirectorySection;
