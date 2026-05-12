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
    <section
      className="relative overflow-hidden text-gray-900 -mt-[100px] pt-[100px]"
      style={{
        backgroundImage: `url('/assets/img/Background%20Landing%20Page.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
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
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold leading-tight max-w-3xl mx-auto mb-5 text-white">
          Vendre ou acheter seul mais bien accompagné, grâce à un mix
          <br className="hidden sm:block" /> Humain, IA et Digital
        </h1>

        {/* Subtitle */}
        <p className="text-white text-[15px] sm:text-[16px] max-w-2xl mx-auto mb-8">
          Notre outil de pilotage de transaction immobilière vous guide à
          chaque étape. Besoin d'un coup de pouce ? Des pros de l'immobilier
          disponibles à la demande sans commissions.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center bg-white text-black font-medium rounded-full px-7 py-3 transition shadow hover:bg-gray-100"
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
  <div className="rounded-2xl bg-white/90 backdrop-blur-sm ring-1 ring-white/60 p-5 text-gray-900 shadow-sm">
    <p className="text-[12px] uppercase tracking-wide font-semibold text-[#976DD0] mb-2">
      {card.title1}
    </p>
    {card.image && (
        <img
          src={card.image}
          alt=""
          className={`w-full ${(card.image.includes('P2PEstim.png') || card.image.includes('leadcheck.png') || card.image.includes('Offmarketsale.png')) ? 'h-44' : (card.image.includes('Agendapartagé.png') || card.image.includes('Offrescentralized.png') || card.image.includes('Opportunistsales.png')) ? 'h-44' : 'h-28'} rounded-lg mb-3 ${card.image.includes('P2PEstim.png') || card.image.includes('leadcheck.png') || card.image.includes('Offmarketsale.png') ? 'object-contain' : card.image.includes('Agendapartagé.png') || card.image.includes('Offrescentralized.png') || card.image.includes('Opportunistsales.png') ? 'object-contain' : 'object-cover'}`}
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
    </div>

    {data.blocks.map((b, i) => (
      <div key={i} className="space-y-2">
        <p className="text-[14px] font-semibold text-[#976DD0]">{b.title}</p>
        {b.image && (
          <img
            src={b.image}
            alt=""
            className={`w-full ${b.image.includes('Learningcenter.png') ? 'h-32 object-contain' : 'h-24 object-cover'} rounded-lg`}
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
    title1: "Définir votre prix de vente",
    image: "/assets/img/P2PEstim.png",
    title2: "Peer-To-Peer Estimation",
    text: "Lancez une campagne d'estimation auprès des membres de la communauté en quelques clics.",
  },
  {
    title1: "Trier les prospects",
    image: "/assets/img/leadcheck.png",
    title2: "Analyse financière",
    text: "AnyHomes calcul pour chaque lead un score d'obtention du financement pour vous aider dans votre choix.",
  },
  {
    title1: "Vente sélective et discrète",
    image: "/assets/img/Offmarketsale.png",
    title2: "Ventte Off-Market",
    text: "Décidez qui peut voir votre bien fonction de leur profil de financement.",
  },
];

const RIGHT_CARDS = [
  {
    title1: "Gestion des visites",
    image: "/assets/img/Agendapartagé.png",
    title2: "Planning partagé",
    text: "Un calendrier partagé avec les candidats pour gérer toutes vos visites au même endroit.",
  },
  {
    title1: "Processus de vente et négociation",
    image: "/assets/img/Offrescentralized.png",
    title2: "Gestion des offres d'achat",
    text: "Consulter, comparer et répondre ayx offres reçus sur une interface unique avec un historique des interactions.",
  },
  {
    title1: "Vente opportuniste ou passive",
    image: "/assets/img/Opportunistsales.png",
    title2: "#OpenToDiscussion",
    text: "Avec le statut #OpenToDiscussion signifiez au marché que vous n'êtes pas officiellement vendeur mais que vous restez ouvert.",
  },
];

const CENTER_CARD = {
  bigTitle: "Accompagnement sur mesure",
  blocks: [
    {
      title: "Coach immobilier IA disponible 24/7",
      image: "/assets/img/AI Coaching.png",
      text: "De la publication de votre annonce jusqu'à la signature de l'acte de vente, votre coach IA vous guide et répond à vos questions.",
    },
    {
      title: "Agents immobiliers à la demande",
      image: "/assets/img/Agentondemand.png",
      text: "Pour une aide ponctuelle, les agents locaux vous proposent des services à la carte pour augmenter les chances de succès de votre vente PAP.",
    },
    {
      title: "Learning center",
      image: "/assets/img/Learningcenter.png",
      text: "Du contenu pour vous former et être en mesure de gérer seul votre transaction immobilière.",
    },
  ],
};

export default HeroSection;
