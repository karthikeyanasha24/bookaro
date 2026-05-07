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
          {personas.map((p, idx) => (
            <div key={p.title} className="flex flex-col items-center h-full">
              {/* Première forme */}
              <div className="p-6 rounded-2xl border border-gray-100 hover:border-[#976DD0]/40 hover:shadow-sm transition w-full bg-white min-h-32 flex flex-col justify-center flex-1">
                <h3 className="font-semibold mb-2 text-[#976DD0]">{p.title}</h3>
                <p className="text-gray-600 text-[14px]">{p.text}</p>
              </div>
              {/* Trait vertical en points ronds */}
              <div className="flex justify-center w-full my-2">
                <svg width="8" height="40" viewBox="0 0 8 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {[0, 8, 16, 24, 32].map((y) => (
                    <circle key={y} cx="4" cy={y + 2} r="2" fill="#976DD0" />
                  ))}
                </svg>
              </div>
              {/* Deuxième forme */}
              <div className="flex items-center bg-[#F8F5FC] rounded-2xl border border-gray-100 shadow-sm p-4 w-full mt-0">
                {/* Image ronde à gauche */}
                <div className="flex-shrink-0">
                  <img src={`/assets/img/persona${idx+1}.jpg`} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-[#976DD0]/30" />
                </div>
                {/* Bloc texte à droite */}
                <div className="ml-4 flex-1">
                  <div className="font-semibold text-[#976DD0] text-[15px] mb-1">Titre secondaire {p.title}</div>
                  <div className="text-gray-600 text-[13px] mb-1">Texte secondaire pour {p.title}.</div>
                  <div className="font-bold text-black text-[13px] mb-1">Texte gras pour {p.title}</div>
                  {/* 5 étoiles */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="18" height="18" viewBox="0 0 20 20" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
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
