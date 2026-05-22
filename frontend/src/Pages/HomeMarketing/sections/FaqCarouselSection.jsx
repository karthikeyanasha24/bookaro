import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Section 7 — FAQ carousel
 * Mock data pour le moment. Le wiring backend sera fait en Phase 4.
 * Cards horizontales scrollables : la card active est colorée (texte complet),
 * les autres sont grisées (titre uniquement).
 */
const FAQ_MOCK = [
  {
    id: "1",
    title: "Quel est l'intérêt de référencer mon bien si je ne suis pas encore vendeur ?",
    body: "Grâce au profil de votre bien, mesurez l'intérêt du marché, identifiez des acheteurs ou des locataires potentiels et préparez sereinement votre futur projet immobilier (vente, achat, déménagement) sans engagement immédiat de vente.",
  },
  {
    id: "2",
    title: "AnyHomes, c'est un site d'annonces de plus ?",
    body: "Non, AnyHomes est un outil de pilotage de transaction immobilière qui couvre toutes les étapes, de la création du profil jusqu'à la signature.",
  },
  {
    id: "3",
    title: "Comment AnyHomes sécurise la vente entre particuliers ?",
    body: "Grâce à notre Agent IA 24h/24, des acheteurs qualifiés au profil financier vérifié, et un suivi de chaque étape de la transaction.",
  },
  {
    id: "4",
    title: "Puis-je vendre en off-market avec AnyHomes ?",
    body: "Oui, la vente Off-Market vous permet de tester le prix de votre bien auprès d'acheteurs qualifiés sans le rendre visible publiquement.",
  },
  {
    id: "5",
    title: "Combien coûte AnyHomes ?",
    body: "L'inscription est gratuite. Vous payez uniquement les services à la carte dont vous avez besoin, sans mandat ni commission.",
  },
];

const FaqCarouselSection = () => {
  const [active, setActive] = useState(0);
  const items = FAQ_MOCK; // TODO Phase 4 : brancher backend FAQ

  const prev = () => setActive((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setActive((i) => (i + 1) % items.length);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-5">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <span className="inline-block text-[12px] font-medium uppercase tracking-wide text-[#976DD0] bg-[#976DD0]/10 rounded-full px-3 py-1 mb-3">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              AnyHomes en quelques questions fréquemment posées
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Question précédente"
              className="w-9 h-9 rounded-full border border-gray-200 hover:border-[#976DD0] flex items-center justify-center"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Question suivante"
              className="w-9 h-9 rounded-full border border-gray-200 hover:border-[#976DD0] flex items-center justify-center"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {items.map((q, idx) => {
            const isActive = idx === active;
            return (
              <button
                type="button"
                key={q.id}
                onClick={() => setActive(idx)}
                className={`snap-start shrink-0 text-left p-5 rounded-2xl border transition h-[350px] md:h-[415px] ${
                  isActive
                    ? "w-[320px] bg-[#976DD0] text-white border-[#976DD0]"
                    : "w-[192px] bg-gray-50 text-gray-500 border-gray-100 hover:border-[#976DD0]/40"
                }`}
              >
                <p className="font-bold text-[25px] mb-2">{q.title}</p>
                {isActive && (
                  <p className="text-[16px] leading-relaxed">{q.body}</p>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-8">
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

export default FaqCarouselSection;
