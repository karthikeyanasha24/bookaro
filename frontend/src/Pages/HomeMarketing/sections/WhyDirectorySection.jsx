import { Link } from "react-router-dom";

/**
 * Section 6 — Why an immo annuaire (Directory)
 * Positionne l'annuaire comme un outil de visibilité, monitoring et future-sale.
 */
const benefits = [
  {
    title: "Anticipation vs instantanéité",
    text: "Le marché immobilier, fondé sur l'instantaneité, met les particuliers sous pression : course aux biens et au finanement.\nL'annuaire offre une vue complète du marché pour anticiper son projet et son financement sans stress inutile.",
  },
  {
    title: "Choix démultiplié",
    text: "Chaque année, seuls 3 à 5% des biens résidentiels sont mis sur le parché, d'où un choix très limité pour les particuliers. L'annuaire leur premettra à termes de voir 100% des biens du marché et ainsi démultiplier le choix.",
  },
  {
    title: "Opportunités spontanées",
    text: "L'annuaire des biens immobiliers ouvre un nouveau marché !\nEn réunissant propriétaires et acheteurs sur une même plateforme, il fait naître des opportunités inédites : ventes spontanées ou projets planifiés dans le futur, tout devient possible.",
  },
];

const WhyDirectorySection = () => {
  return (
    <section className="py-28 bg-[#976DD0] text-white">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-white text-gray-900 rounded-full px-4 py-1.5 mb-3 mt-12 text-[13px] font-medium">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-black"><path d="M10 18s-6-4.35-6-9.09C4 5.5 6.5 3 10 3s6 2.5 6 5.91C16 13.65 10 18 10 18z" fill="currentColor"/></svg>
            Annuaire immobilier
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Pourquoi un annuaire des biens immobiliers ?
          </h2>
          <p className="text-white mt-3 max-w-2xl mx-auto text-[15px]">
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
              <h3 className="font-bold text-[22px] mb-2">{b.title}</h3>
              <p className="text-white/85 text-[16px]">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/signup"
            className="inline-flex items-center bg-white text-black hover:bg-gray-100 font-medium rounded-full px-8 py-3 transition"
          >
            Démarrer
          </Link>
          <div className="text-white text-[15px] mt-2">100% gratuit pour les particuliers</div>
        </div>
      </div>
    </section>
  );
};

export default WhyDirectorySection;
