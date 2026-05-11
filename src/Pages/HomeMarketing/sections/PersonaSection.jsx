import { Link } from "react-router-dom";

/**
 * Section 5 — Persona
 * Pour qui AnyHomes est-il pensé : owners, searchers, buyers, renters, etc.
 */
const personas = [
  {
    title: "Vendeur",
    text: "Vendre son bien en PAP tout en sécurisant la transaction grâce à un accompagnement complet sans commissions.",
    secondaryTitle: "Vente PAP sans risques",
    secondaryText: "Je voulais sécuriser ma vente en PAP. Avec AnyHomes, j'ai reçu des acheteurs dont le financement avait été vérifié et j'ai été guidée jusqu'au compromis par un agent immobilier indépendant sans commissions.",
    boldText: "Marie, propriétaire vendeuse à Lille"
  },
  {
    title: "Acheteur",
    text: "Disposer d'un large choix de biens immobiliers et bénéficier d'un accompagnement sans commissions.",
    secondaryTitle: "Achat anticipé de 15 mois",
    secondaryText: "Sur les plateformes classiques, aucun bien ne cochait tous nos critères. On a trouvé notre bien idéal sur l'annuaire des biens AnyHomes, négocié une vente dans 15 mois, et pris le temps de préparer notre financement avec la banque.",
    boldText: "Thomas et Léa, primo-accédents"
  },
  {
    title: "Propriétaire",
    text: "Accroitre la valeur de son bien grâce à une présence en ligne, tester sa désirabilité et générer des prospects acheteurs pour une vente future.",
    secondaryTitle: "Valoriser son bien en ligne",
    secondaryText: "Le profil AnyHomes de mon appartement à Paris génère tous les mois 200 vues et des dizaines de sollicitations pour une vente. Quand je déciderai de vendre, j'aurai déjà plus de 40 acheteurs qualifiés potentiels.",
    boldText: "Sophie, propriétaire occupante"
  },
  {
    title: "Locataire",
    text: "Anticipez et trouver votre prochain appartement sans concurrence et sans frais d'agence",
    secondaryTitle: "recherche anticipé d'un bien locatif.",
    secondaryText: "Grâce à l'annuaire des biens immobiliers, j'ai pu anticiper de plusieurs mois la recherche du logement étudiant de mon fils et faire un choix sans pression.",
    boldText: "Paul, père de famille"
  },
];

const PersonaSection = () => {
  return (
    <section className="py-28 bg-white">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-[#976DD0]/20 text-gray-900 rounded-full px-4 py-1.5 mb-3 mt-12 text-[13px] font-medium">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-black"><path d="M10 18s-6-4.35-6-9.09C4 5.5 6.5 3 10 3s6 2.5 6 5.91C16 13.65 10 18 10 18z" fill="currentColor"/></svg>
            Plateforme transverse
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


        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {personas.map((p, idx) => (
            <div key={p.title} className="flex flex-col items-center h-full">
              {/* Première forme */}
              <div className="p-6 rounded-2xl border border-gray-100 hover:border-[#976DD0]/40 hover:shadow-sm transition w-full bg-white min-h-[160px] sm:min-h-[180px] md:min-h-[200px] flex flex-col justify-center flex-1 h-full">
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
              <div className="flex items-center bg-[#F8F5FC] rounded-2xl border border-gray-100 shadow-sm p-4 w-full mt-0 flex-1 h-full">
                {/* Image ronde à gauche */}
                <div className="flex-shrink-0">
                  <img src={`/assets/img/persona${idx+1}.jpg`} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-[#976DD0]/30" />
                </div>
                {/* Bloc texte à droite */}
                <div className="ml-4 flex-1">
                  <div className="font-semibold text-[#976DD0] text-[15px] mb-1">{p.secondaryTitle || `Titre secondaire ${p.title}`}</div>
                  <div className="text-gray-600 text-[13px] mb-1">{p.secondaryText || `Texte secondaire pour ${p.title}.`}</div>
                  <div className="font-bold text-black text-[13px] mb-1">{p.boldText || `Texte gras pour ${p.title}`}</div>
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
            className="inline-flex items-center bg-[#976DD0] hover:bg-[#7e54bd] text-white font-medium rounded-full px-8 py-3 transition"
          >
            Démarrer
          </Link>
          <div className="text-gray-400 text-[15px] mt-2">100% gratuit pour les particuliers</div>
        </div>
      </div>
    </section>
  );
};

export default PersonaSection;
