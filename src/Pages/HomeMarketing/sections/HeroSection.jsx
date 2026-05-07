import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

/**
 * Section 1 — Hero (centré, fond violet gradient)
 * - Bandeau social proof
 * - Titre + sous-titre + CTA centrés
 * - Bloc 3 colonnes en dessous (cards translucides + card centrale)
 */
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#c9b3e8] via-[#b89adf] to-[#a87fd9] text-gray-900 -mt-[100px] pt-[100px]">
      <div className="container mx-auto px-5 pt-10 lg:pt-14 pb-10 text-center">
        {/* Social proof */}
        <div className="inline-flex items-center gap-2 bg-white text-gray-700 rounded-full px-3 py-1 mb-6 shadow-sm">
          <span className="flex items-center gap-0.5 text-[#976DD0]">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="w-3 h-3" />
            ))}
          </span>
          <span className="text-[12px] font-medium">250 avis</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold leading-tight max-w-3xl mx-auto mb-5 text-gray-900">
          Vendre ou acheter seul mais bien accompagné, grâce à un mix
          <br className="hidden sm:block" /> Humain, IA et Digital
        </h1>

        {/* Subtitle */}
        <p className="text-gray-800 text-[15px] sm:text-[16px] max-w-2xl mx-auto mb-8">
          Notre outil de pilotage de transaction immobilière vous guide à
          chaque étape. Besoin d'un coup de pouce ? Des pros de l'immobilier
          disponibles à la demande sans commissions.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center bg-[#976DD0] hover:bg-[#7e54bd] text-white font-medium rounded-full px-7 py-3 transition shadow-sm"
          >
            Démarrer gratuitement
          </Link>
          <Link
            to="/properties?search=true"
            className="inline-flex items-center justify-center border border-[#976DD0] text-[#976DD0] hover:bg-[#976DD0]/10 font-medium rounded-full px-7 py-3 transition bg-white/40"
          >
            Explorer la plateforme
          </Link>
        </div>
      </div>

      {/* 3-columns feature block */}
      <div className="container mx-auto px-5 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto items-stretch">
          {/* Col 1 — 3 cards stacked */}
          <div className="flex flex-col gap-5">
            {LEFT_CARDS.map((c) => (
              <SmallCard key={c.title1} card={c} />
            ))}
          </div>

          {/* Col 2 — single tall card */}
          <CenterCard data={CENTER_CARD} />

          {/* Col 3 — same as col 1 */}
          <div className="flex flex-col gap-5">
            {RIGHT_CARDS.map((c) => (
              <SmallCard key={c.title1} card={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Sub-components ---------- */

const SmallCard = ({ card }) => (
  <div className="rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-white/60 p-5 text-gray-900 shadow-sm">
    <p className="text-[12px] uppercase tracking-wide font-semibold text-[#976DD0] mb-2">
      {card.title1}
    </p>
    {card.image && (
      <img
        src={card.image}
        alt=""
        className="w-full h-28 object-cover rounded-lg mb-3"
        loading="lazy"
      />
    )}
    <p className="font-semibold text-[15px] mb-1.5">{card.title2}</p>
    <p className="text-[13px] text-gray-700 leading-relaxed">{card.text}</p>
  </div>
);

const CenterCard = ({ data }) => (
  <div className="rounded-2xl bg-white/95 ring-1 ring-white/40 p-6 text-gray-900 flex flex-col gap-4 shadow-lg">
    <div>
      <h3 className="text-2xl font-semibold leading-tight">{data.bigTitle}</h3>
      <p className="text-[13px] font-semibold text-[#976DD0] mt-1 uppercase tracking-wide">
        {data.smallTitle}
      </p>
    </div>

    {data.blocks.map((b, i) => (
      <div key={i} className="space-y-2">
        <p className="text-[14px] font-semibold text-[#976DD0]">{b.title}</p>
        {b.image && (
          <img
            src={b.image}
            alt=""
            className="w-full h-24 object-cover rounded-lg"
            loading="lazy"
          />
        )}
        <p className="text-[13px] text-gray-700 leading-relaxed">{b.text}</p>
      </div>
    ))}
  </div>
);

/* ---------- Placeholder content ---------- */

const LEFT_CARDS = [
  {
    title1: "Définir votre projet",
    image: "/assets/img/dashboard.png",
    title2: "Peer-To-Peer",
    text: "Lancez une campagne d'estimation auprès de la communauté en quelques clics.",
  },
  {
    title1: "Accompagnement",
    image: "/assets/img/banner-one.png",
    title2: "Agent immobilier IA",
    text: "Un copilote disponible 24h/24 pour répondre à toutes vos questions.",
  },
  {
    title1: "Suivi de visite",
    image: "/assets/img/banner-two.png",
    title2: "Visites + analyses",
    text: "Centralisez les avis post-visite et adaptez votre stratégie.",
  },
];

const RIGHT_CARDS = [
  {
    title1: "Vente Off-Market",
    image: "/assets/img/offmarket.png",
    title2: "Acheteurs qualifiés",
    text: "Tester le prix de votre bien sans le rendre visible publiquement.",
  },
  {
    title1: "Outil transactionnel",
    image: "/assets/img/transaction-tool.png",
    title2: "Coordination signature",
    text: "Toutes les étapes de la transaction dans une plateforme unique.",
  },
  {
    title1: "Annuaire AnyHomes",
    image: "/assets/img/directory.png",
    title2: "+20 000 biens",
    text: "Référencez et explorez l'ensemble du marché immobilier français.",
  },
];

const CENTER_CARD = {
  bigTitle: "Trouver le bien idéal",
  smallTitle: "+20 000 biens disponibles",
  blocks: [
    {
      title: "Localisation",
      image: "/assets/img/banner-ones.png",
      text: "Recherchez par ville, code postal ou département dans toute la France.",
    },
    {
      title: "Type de bien",
      image: "/assets/img/apartment.png",
      text: "Maison, appartement, immeuble, château ou ferme : à vous de choisir.",
    },
    {
      title: "Mode de transaction",
      image: "/assets/img/sale.svg",
      text: "Achat ou location, sur le marché ou en off-market.",
    },
  ],
};

export default HeroSection;
