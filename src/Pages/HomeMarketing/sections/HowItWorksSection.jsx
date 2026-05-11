import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { MdDevices, MdSupportAgent } from "react-icons/md";
import { PiBrain } from "react-icons/pi";
const steps = [
  {
    n: 1,
    title: "Créez votre annonce",
    icon: <MdDevices />,
    points: [
      "Remplissez les informations clés sur votre bien.",
      "Ajoutez des photos attractives.",
      "Publiez en un clic."
    ]
  },
  {
    n: 2,
    title: "Recevez des conseils IA",
    icon: <PiBrain />,
    points: [
      "Optimisez votre annonce grâce à l'IA.",
      "Recevez des recommandations personnalisées."
    ]
  },
  {
    n: 3,
    title: "Gérez vos visites",
    icon: <FaHeart />,
    points: [
      "Planifiez et suivez les visites facilement.",
      "Communiquez avec les acheteurs en toute simplicité."
    ]
  },
  {
    n: 4,
    title: "Négociez et signez",
    icon: <MdSupportAgent />,
    points: [
      "Recevez des offres.",
      "Négociez en toute sécurité.",
      "Signez électroniquement."
    ]
  },
  {
    n: 5,
    title: "Accompagnement jusqu'à la vente",
    icon: <FaHeart />,
    points: [
      "Profitez d'un suivi personnalisé.",
      "Finalisez la transaction sereinement."
    ]
  }
];

// Section principale
const HowItWorksSection = () => {
  return (
    <>
      <section className="py-16 bg-gradient-to-b from-white to-[#976DD0]/5">
        <div className="container mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#976DD0]/20 text-gray-900 rounded-full px-4 py-1.5 mb-3 mt-12 text-[13px] font-medium">
              <FaHeart className="w-3.5 h-3.5 text-black" />
              Transaction simplifiée
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Comment ça fonctionne ? Passez en mode pilote automatique
            </h2>
            <p className="text-gray-600 mt-3 mb-12 max-w-2xl mx-auto text-[15px]">
              Depuis la création de votre annonce jusqu'à la signature, AnyHomes
              vous guide étape par étape avec des fonctionnalités innovantes.
            </p>
            {/* Ligne de 3 colonnes pictos */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
              {/* Colonne 1 */}
              <div className="flex flex-col items-center w-56">
                <MdDevices className="w-8 h-8 text-[#976DD0] mb-2" />
                <span className="text-black text-base font-medium whitespace-nowrap">Fonctionnalités digitales</span>
              </div>
              {/* Colonne 2 */}
              <div className="flex flex-col items-center w-56">
                <PiBrain className="w-8 h-8 text-[#976DD0] mb-2" />
                <span className="text-black text-base font-medium whitespace-nowrap">Coach immobilier IA</span>
              </div>
              {/* Colonne 3 */}
              <div className="flex flex-col items-center w-56">
                <MdSupportAgent className="w-8 h-8 text-[#976DD0] mb-2" />
                <span className="text-black text-base font-medium whitespace-nowrap">Agent immobilier à la demande</span>
              </div>
            </div>

            {/* Bouton Démarrer + phrase grise */}
            <div className="flex flex-col items-center justify-center mb-12">
              <Link
                to="/signup"
                className="inline-flex items-center bg-[#976DD0] hover:bg-[#7e54bd] text-white font-medium rounded-full px-8 py-3 transition"
              >
                Démarrer
              </Link>
              <div className="text-gray-400 text-[15px] mt-2">100% gratuit pour les particuliers</div>
            </div>

            {/* Double espace avant la première étape de l'explainer */}
            <div className="mb-[120px]"></div>
          </div>

          {/* Première ligne de l'explainer */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start gap-8 relative mb-20">
            {/* Bloc arrondi à gauche */}
            <div className="bg-[#F3ECFA] rounded-3xl shadow-lg border border-gray-100 p-6 w-full max-w-xs flex flex-col items-center relative sm:ml-0 ml-auto">
              {/* Image appartement paysage, grande, centrée */}
              <img src="/assets/img/Apartment.jpg" alt="Appartement" className="mx-auto w-full h-44 object-cover rounded-2xl mb-4" />
              {/* Texte sous l'image, aligné à gauche */}
              <div className="w-full text-left">
                <div className="text-black text-[15px] leading-snug mb-1">
                  Appartement, 4 pièces, 75018 Paris<br/>
                  95m2, 3 chambres
                </div>
                <div className="font-bold text-black text-[15px]">Annuaire des biens immobiliers</div>
              </div>
              {/* Rond violet centré bas + flèche */}
              <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#976DD0] flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white z-10 translate-y-12">
                  1
                </div>
                {/* Flèche SVG */}
                <svg width="2" height="40" viewBox="0 0 2 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="1" y1="0" x2="1" y2="36" stroke="#976DD0" strokeWidth="2" />
                  <polygon points="0,36 2,36 1,40" fill="#976DD0" />
                </svg>
              </div>
            </div>

            {/* Contenu à droite */}
            <div className="flex-1 flex flex-col items-start max-w-lg pr-0 sm:pr-5">
              <div className="text-2xl font-semibold mb-2 text-left w-full">Publiez le profil de votre bien</div>
              <div className="text-gray-600 mb-2 max-w-[320px] text-left w-full pl-0 ml-0">Publiez anonymement le profil de votre bien sur l'annuaire AnyHomes avec toutes les informations nécessaires pour le mettre en valeur (revenus, travaux réalisés, notes AirBnB...)</div>
              <Link to="/fonctionnalites/property-profile" className="font-bold text-[#976DD0] hover:underline mb-4 text-left w-full block">En savoir plus</Link>
              <div className="flex flex-col gap-3 w-full">
                {/* Rectangle 1 */}
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <MdSupportAgent className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">Rédaction annonce</span>
                </div>
                {/* Rectangle 2 */}
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <PiBrain className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">Aide rédaction</span>
                </div>
                {/* Rectangle 3 */}
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <PiBrain className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">Aide mise en valeur</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-[120px]"></div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-end gap-8 relative mb-40">
            {/* Bloc arrondi à gauche */}
            <div className="bg-[#F3ECFA] rounded-3xl shadow-lg border border-gray-100 p-6 w-full max-w-xs flex flex-col items-center relative sm:ml-0 ml-auto">
              {/* Image P2P HIW, centrée, sans texte */}
              <img src="/assets/img/P2PHIW.png" alt="P2P Estimation" className="mx-auto w-full h-60 object-contain rounded-2xl mb-4 bg-white" />
              {/* Rond violet centré bas + flèche */}
              <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#976DD0] flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white z-10 translate-y-12">
                  2
                </div>
                {/* Flèche SVG */}
                <svg width="2" height="40" viewBox="0 0 2 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="1" y1="0" x2="1" y2="36" stroke="#976DD0" strokeWidth="2" />
                  <polygon points="0,36 2,36 1,40" fill="#976DD0" />
                </svg>
              </div>
            </div>

            {/* Contenu à droite */}
            <div className="flex-1 flex flex-col items-start max-w-lg text-left">
              <div className="text-2xl font-semibold mb-2 max-w-xs">Vous voulez connaitre la valeur perçue de votre bien&nbsp;?</div>
              <div className="text-gray-600 mb-2 max-w-[320px]">Lancez anonymement une campagne de Peer-To-Peer estimation et les membres de la communauté estimeront votre bien et vous donneront des conseil pour mieux le valoriser.</div>
              <a href="/fonctionnalites/p2p-estimation" className="font-bold text-black hover:underline mb-4">En savoir plus</a>
              <div className="flex flex-col gap-3 w-full">
                {/* Rectangle 1 */}
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <MdDevices className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">P2P Estimation</span>
                </div>
                {/* Rectangle 2 */}
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <MdDevices className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">Transactions historiques</span>
                </div>
                {/* Rectangle 3 */}
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <MdSupportAgent className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">Estimation offerte</span>
                </div>
              </div>
            </div>
          </div>

          {/* Étape 3 (duplication de l'étape 1, placeholders) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start gap-8 relative mb-40">
            <div className="bg-[#F3ECFA] rounded-3xl shadow-lg border border-gray-100 p-6 w-full max-w-xs flex flex-col items-center relative sm:ml-0 ml-auto">
              <img src="/assets/img/Apartment.jpg" alt="Appartement" className="mx-auto w-full h-44 object-cover rounded-2xl mb-4" />
              <div className="w-full text-left">
                <div className="text-black text-[15px] leading-snug mb-1">
                  Appartement, 4 pièces, 75018 Paris<br/>
                  95m2, 3 chambres
                </div>
                <div className="font-bold text-black text-[15px]">Annuaire des biens immobiliers</div>
              </div>
              <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#976DD0] flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white z-10 translate-y-12">3</div>
                <svg width="2" height="40" viewBox="0 0 2 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="1" y1="0" x2="1" y2="36" stroke="#976DD0" strokeWidth="2" />
                  <polygon points="0,36 2,36 1,40" fill="#976DD0" />
                </svg>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start max-w-lg pr-0 sm:pr-5">
              <div className="text-2xl font-semibold mb-2 text-left w-full">Vous êtes décidé à mettre votre bien en vente ou en location ?</div>
              <div className="text-gray-600 mb-2 max-w-[320px] text-left w-full pl-0 ml-0">En un seul clic, vous pouvez le mettre en vente ou en location de manière classique ou opter pour le mode off-market pour le rendre invisible du grand public et de choisir qui peut le voir en fonction la qualité du profil de financement.</div>
              <a className="font-bold text-[#976DD0] hover:underline mb-4 text-left w-full block">En savoir plus</a>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <MdDevices className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">Vente off-market</span>
                </div>
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <MdDevices className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">#OpenToDiscussion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Étape 4 (duplication de l'étape 2, placeholders) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-end gap-8 relative mb-40">
            <div className="bg-[#F3ECFA] rounded-3xl shadow-lg border border-gray-100 p-6 w-full max-w-xs flex flex-col items-center relative sm:ml-0 ml-auto">
              <img src="/assets/img/LeadsHIW.png" alt="Leads" className="mx-auto w-full h-72 object-contain rounded-2xl mb-4 bg-white" />
              <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#976DD0] flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white z-10 translate-y-12">4</div>
                <svg width="2" height="40" viewBox="0 0 2 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="1" y1="0" x2="1" y2="36" stroke="#976DD0" strokeWidth="2" />
                  <polygon points="0,36 2,36 1,40" fill="#976DD0" />
                </svg>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start max-w-lg text-left">
              <div className="text-2xl font-semibold mb-2 max-w-xs">Ne recevez que des leads qualifiés</div>
              <div className="text-gray-600 mb-2 max-w-[320px]">Que votre bien soit en vente ou non, vous recevrez régulièrement des sollicitations de leads qualifiés pour une transaction immédiate ou future.</div>
              <a className="font-bold text-black hover:underline mb-4">En savoir plus</a>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <MdDevices className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">Analyse financières des leads</span>
                </div>
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <MdDevices className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">Données activité des leads</span>
                </div>
                <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2 w-1/2">
                  <MdSupportAgent className="w-5 h-5 text-[#976DD0]" />
                  <span className="text-black text-[14px]">Forfait analyse des prospects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Étape 5 (placeholder, manuel) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start gap-8 relative mb-40">
            <div className="bg-[#F3ECFA] rounded-3xl shadow-lg border border-gray-100 p-6 w-full max-w-xs flex flex-col items-center relative sm:ml-0 ml-auto">
              <img src="/assets/img/TodolistHIW.png" alt="Todolist" className="mx-auto w-full h-72 object-contain rounded-2xl mb-4 bg-white" />
              <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#976DD0] flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white z-10 translate-y-12">5</div>
                <svg width="2" height="40" viewBox="0 0 2 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="1" y1="0" x2="1" y2="36" stroke="#976DD0" strokeWidth="2" />
                  <polygon points="0,36 2,36 1,40" fill="#976DD0" />
                </svg>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start max-w-lg pr-0 sm:pr-5 w-full">
              <div className="text-2xl font-semibold mb-2 text-left w-full">Pilotez chaque étape de la transaction en toute simplicité</div>
              <div className="text-gray-600 mb-2 max-w-[420px] text-left w-full pl-0 ml-0">Dès que vos premiers prospects vous contactent, l'outil transactionnel prend le relai et orchestre chaque étape jusqu'à la signature.</div>
              {/* Deux colonnes de rectangles */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Colonne 1 */}
                <div className="flex flex-col gap-3 w-full sm:w-1/2">
                  <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2">
                    <MdDevices className="w-5 h-5 text-[#976DD0]" />
                    <span className="text-black text-[14px]">Agenda des visites</span>
                  </div>
                  <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2">
                    <MdDevices className="w-5 h-5 text-[#976DD0]" />
                    <span className="text-black text-[14px]">Partage documents</span>
                  </div>
                  <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2">
                    <MdDevices className="w-5 h-5 text-[#976DD0]" />
                    <span className="text-black text-[14px]">Dossier locataire</span>
                  </div>
                  <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2">
                    <MdSupportAgent className="w-5 h-5 text-[#976DD0]" />
                    <span className="text-black text-[14px]">Forfait visites</span>
                  </div>
                  <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2">
                    <MdDevices className="w-5 h-5 text-[#976DD0]" />
                    <span className="text-black text-[14px]">Dossier vendeur</span>
                  </div>
                </div>
                {/* Colonne 2 */}
                <div className="flex flex-col gap-3 w-full sm:w-1/2">
                  <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2">
                    <MdDevices className="w-5 h-5 text-[#976DD0]" />
                    <span className="text-black text-[14px]">Envoyer offre d'achat</span>
                  </div>
                  <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2">
                    <MdDevices className="w-5 h-5 text-[#976DD0]" />
                    <span className="text-black text-[14px]">Partage documents</span>
                  </div>
                  <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2">
                    <MdDevices className="w-5 h-5 text-[#976DD0]" />
                    <span className="text-black text-[14px]">Suivi des acquéreurs potentiels</span>
                  </div>
                  <div className="flex items-center bg-[#F6F6F6] rounded-lg shadow border border-gray-100 px-2 py-2 gap-2">
                    <PiBrain className="w-5 h-5 text-[#976DD0]" />
                    <span className="text-black text-[14px]">Coach IA personnalisé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bouton Démarrer + phrase grise à la fin de la section */}
        <div className="flex flex-col items-center justify-center mt-12">
          <Link
            to="/signup"
            className="inline-flex items-center bg-[#976DD0] hover:bg-[#7e54bd] text-white font-medium rounded-full px-8 py-3 transition"
          >
            Démarrer
          </Link>
          <div className="text-gray-400 text-[15px] mt-2">100% gratuit pour les particuliers</div>
        </div>
      </section>
    </>
  );
};


// Carte étape (StepCard)
function StepCard({ s, align }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md w-full ${align === 'right' ? 'text-right ml-auto' : 'text-left mr-auto'}`}>
      <h3 className="font-semibold mb-2 text-[#976DD0]">{s.title}</h3>
      <ul className="space-y-1">
        {s.points.map((pt, idx) => (
          <li key={idx} className="text-gray-700 text-[15px] flex items-start gap-2">
            <span className="mt-1 w-2 h-2 rounded-full bg-[#976DD0] inline-block" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}



export default HowItWorksSection;
