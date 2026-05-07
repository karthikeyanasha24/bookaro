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
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-[15px]">
              Depuis la création de votre annonce jusqu'à la signature, AnyHomes
              vous guide étape par étape avec des fonctionnalités innovantes.
            </p>

            {/* 3 colonnes pictos + texte */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6">
              <div className="flex flex-col items-center w-56">
                <span className="bg-[#f3eaff] text-[#976DD0] rounded-full p-3 mb-2">
                  <MdDevices className="w-8 h-8" />
                </span>
                <span className="text-[15px] font-medium text-gray-800 text-center">Fonctionnalités digitales</span>
              </div>
              <div className="flex flex-col items-center w-56">
                <span className="bg-[#f3eaff] text-[#976DD0] rounded-full p-3 mb-2">
                  <PiBrain className="w-8 h-8" />
                </span>
                <span className="text-[15px] font-medium text-gray-800 text-center">Coach immobilier IA</span>
              </div>
              <div className="flex flex-col items-center w-56">
                <span className="bg-[#f3eaff] text-[#976DD0] rounded-full p-3 mb-2">
                  <MdSupportAgent className="w-8 h-8" />
                </span>
                <span className="text-[15px] font-medium text-gray-800 text-center">Agent immobilier à la carte</span>
              </div>
            </div>
          </div>

          {/* Timeline verticale alternée */}
          <div className="relative max-w-4xl mx-auto">
            {/* Ligne verticale centrale */}
            <div className="hidden sm:block absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-[#e5d6f7] z-0" style={{ minHeight: '100%' }} />
            <ol className="flex flex-col gap-12 relative z-10">
              {steps.map((s, i) => {
                // Alternance gauche/centre/droite
                const align = i % 2 === 0 ? 'left' : 'right';
                return (
                  <li key={s.n} className="relative flex sm:items-center">
                    {/* Bloc gauche */}
                    {align === 'left' && (
                      <div className="flex-1 flex justify-end pr-8">
                        <StepCard s={s} align="right" />
                      </div>
                    )}
                    {/* Timeline + numéro */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-12 h-12 rounded-full bg-[#f3eaff] border-2 border-[#976DD0] flex items-center justify-center text-[#976DD0] font-bold text-lg mb-2">
                        {s.icon}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#976DD0] text-white flex items-center justify-center font-bold text-base absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow">{s.n}</div>
                      {/* Connecteur vertical sauf dernier */}
                      {i < steps.length - 1 && (
                        <div className="hidden sm:block w-1 h-16 bg-[#e5d6f7] mt-2" />
                      )}
                    </div>
                    {/* Bloc droite */}
                    {align === 'right' && (
                      <div className="flex-1 flex justify-start pl-8">
                        <StepCard s={s} align="left" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

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
