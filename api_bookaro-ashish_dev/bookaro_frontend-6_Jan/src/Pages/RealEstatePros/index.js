import PageLayout from "../../components/global/PageLayout";
import { useSelector } from "react-redux";
import { LuMessageSquareText } from "react-icons/lu";
import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

const RealEstatePros = () => {
  const user = useSelector((state) => state.user);
  const firstName = user?.firstName || user?.email?.split("@")?.[0] || "User";
  const [selectedPro, setSelectedPro] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const favoritePros = [
    {
      id: "fav-pro-1",
      name: "Pauline Dupont",
      role: "Agent immobilier independant IAD",
      years: 20,
      completed: 250,
      reviews: 150,
      rating: "5/5",
      sectors: ["Lille-Centre", "Lille-Sud", "Saint-Maurice"],
      services: [
        { name: "Estimation", price: "Offert" },
        { name: "Redaction", price: "Offert" },
        { name: "Pack 12 photos", price: "100 EUR" },
        { name: "Forfait 10 visites", price: "300 EUR" },
        { name: "Constitution dossier", price: "300 EUR" },
        { name: "Accompagnement", price: "300 EUR" },
      ],
    },
    {
      id: "fav-pro-2",
      name: "Jean Martin",
      role: "Agent immobilier independant",
      years: 16,
      completed: 180,
      reviews: 96,
      rating: "4.8/5",
      sectors: ["Paris 10", "Paris 11", "Paris 12"],
      services: [
        { name: "Estimation", price: "Offert" },
        { name: "Redaction", price: "80 EUR" },
        { name: "Pack 12 photos", price: "100 EUR" },
        { name: "Forfait 10 visites", price: "250 EUR" },
        { name: "Constitution dossier", price: "220 EUR" },
        { name: "Accompagnement", price: "280 EUR" },
      ],
    },
    {
      id: "fav-pro-3",
      name: "Claire Bernard",
      role: "Agent immobilier independant IAD",
      years: 14,
      completed: 165,
      reviews: 88,
      rating: "4.7/5",
      sectors: ["Lyon 2", "Lyon 3", "Lyon 6"],
      services: [
        { name: "Estimation", price: "Offert" },
        { name: "Redaction", price: "90 EUR" },
        { name: "Pack 12 photos", price: "120 EUR" },
        { name: "Forfait 10 visites", price: "270 EUR" },
        { name: "Constitution dossier", price: "250 EUR" },
        { name: "Accompagnement", price: "300 EUR" },
      ],
    },
  ];

  const openProModal = (pro) => {
    setSelectedPro(pro);
    setOpenModal(true);
  };

  return (
    <PageLayout>
      <div className="bg-[#F7F4FB] min-h-[calc(100vh-140px)] py-8">
        <div className="container px-6 lg:px-10 mx-auto">
          <div className="mb-5">
            <h1 className="text-[28px] font-[700] text-[#2D1B4E]">My favorite professionals</h1>
            <p className="text-[14px] text-[#6B7280]">
              {firstName}, these experts are available to support your project.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {favoritePros.map((pro) => (
              <div
                key={pro.id}
                className="bg-white border border-[#E7E1F1] rounded-[12px] p-4 shadow-sm cursor-pointer hover:shadow-md transition"
                onClick={() => openProModal(pro)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-black text-white text-[10px] px-2 py-1 rounded-[4px]">
                    Top agent
                  </span>
                  <button className="text-[#B0A6C4]" onClick={(e) => e.stopPropagation()}>☆</button>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="assets/img/pro-logo.png"
                    alt={pro.name}
                    className="w-[42px] h-[42px] rounded-full border border-[#E5E7EB]"
                  />
                  <div>
                    <h3 className="text-[20px] font-[700] text-[#2D1B4E] leading-[22px]">{pro.name}</h3>
                    <p className="text-[12px] text-[#6B7280]">{pro.years} years experience</p>
                    <p className="text-[12px] text-[#6B7280]">
                      {pro.completed} services completed
                    </p>
                    <p className="text-[12px] text-[#6B7280]">
                      {pro.reviews} reviews • <span className="text-[#7A56BE]">{pro.rating}</span>
                    </p>
                  </div>
                </div>
                <p className="text-[13px] text-[#4B5563] mt-3">{pro.role}</p>
                <div className="mt-3">
                  <p className="text-[12px] text-[#111827] font-[600]">Sectors:</p>
                  <p className="text-[12px] text-[#6B7280]">{pro.sectors.join(" • ")}</p>
                </div>
                <div className="mt-3 border-t border-[#EEE7F7] pt-3">
                  <p className="text-[12px] text-[#111827] font-[600] mb-2">Services offered:</p>
                  <div className="space-y-1">
                    {pro.services.map((srv) => (
                      <div key={`${pro.id}-${srv.name}`} className="flex items-center justify-between text-[12px]">
                        <span className="text-[#374151]">{srv.name}</span>
                        <span className="text-[#4B5563] font-[600]">{srv.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 border-t border-[#EEE7F7] pt-3">
                  <button
                    className="w-full flex items-center justify-center gap-2 text-[13px] text-[#7C6A9E] hover:text-[#976DD0]"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProModal(pro);
                    }}
                  >
                    <LuMessageSquareText />
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} className="relative z-[9999]">
        <DialogBackdrop className="fixed inset-0 bg-black/55" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-[780px] rounded-[14px] bg-white overflow-hidden">
            <div className="border-b border-[#ECE7F4] p-4 text-center relative">
              <button
                onClick={() => setOpenModal(false)}
                className="absolute right-4 top-3 text-[#9CA3AF] text-[22px] leading-none"
                aria-label="Close"
              >
                ×
              </button>
              <p className="text-[11px] text-[#6B7280]">Manage your sale</p>
              <h3 className="text-[30px] font-[700] text-[#2D1B4E] leading-[34px]">Visite de biens</h3>
            </div>

            <div className="p-5 max-h-[65vh] overflow-auto">
              <h4 className="text-[20px] font-[700] text-[#2D1B4E] mb-3">Presentation du professionnel</h4>
              <div className="flex items-start gap-3">
                <img
                  src="assets/img/pro-logo.png"
                  alt={selectedPro?.name}
                  className="w-[52px] h-[52px] rounded-full border border-[#E5E7EB]"
                />
                <div className="flex-1">
                  <p className="text-[17px] font-[700] text-[#111827]">{selectedPro?.name}</p>
                  <p className="text-[13px] text-[#6B7280]">{selectedPro?.role}</p>
                  <p className="text-[13px] text-[#6B7280]">{selectedPro?.sectors?.[0] || "Lille"}</p>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-[12px] text-[#6B7280]">
                    <p>{selectedPro?.years || 20} ans d'experience</p>
                    <p>{selectedPro?.completed || 250} services realises</p>
                    <p>{selectedPro?.reviews || 150} avis</p>
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-[#4B5563] mt-3">
                Je suis agent immobilier depuis plus de 20 ans. Je connais parfaitement le marche local
                et ses alentours. Contactez-moi pour reussir votre projet immobilier.
              </p>

              <h4 className="text-[20px] font-[700] text-[#2D1B4E] mt-6 mb-3">Presentation du service</h4>
              <div className="flex flex-wrap gap-3 text-[12px] text-[#6B7280] mb-3">
                <span>Forfait</span>
                <span>Lille +5 km</span>
                <span>Pack 10 visites</span>
                <span>Coaching video</span>
              </div>

              <div className="space-y-3">
                {[
                  "A travers chaque visite je vais realiser pour vous, votre bien sera mis en valeur de la meilleure maniere possible.",
                  "Je vous propose de vous accompagner dans la gestion des visites de votre bien.",
                  "Apres chaque visite, je vous ferez parvenir un avis detaille de 48 heures.",
                  "Vous payez la prestation maintenant et la plateforme conserve cette somme en securite.",
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-[28px] h-[28px] rounded-[4px] bg-[#976DD0] text-white text-[14px] flex items-center justify-center mt-1">
                      {idx + 1}
                    </div>
                    <p className="text-[13px] text-[#4B5563]">{txt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#ECE7F4] p-4 flex items-center justify-between">
              <button className="border border-[#C9CBD1] rounded-full px-4 py-1.5 text-[13px] text-[#374151] flex items-center gap-2">
                <LuMessageSquareText />
                Contacter {selectedPro?.name?.split(" ")[0] || "Agent"}
              </button>
              <div className="flex items-center gap-3">
                <span className="text-[32px] font-[700] text-[#976DD0] leading-none">300 EUR TTC</span>
                <button className="bg-[#976DD0] text-white rounded-full px-5 py-2 text-[14px] font-[600]">Acheter</button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </PageLayout>
  );
};

export default RealEstatePros;
