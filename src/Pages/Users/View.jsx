import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "antd";
import { FaArrowLeft, FaArrowTrendUp, FaBuilding, FaChartLine, FaFolderOpen, FaHeart, FaMapLocationDot, FaQrcode, FaRegCircleCheck, FaUserLarge } from "react-icons/fa6";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import shared from "./shared";

const tabs = [
  { key: "general", label: "Général" },
  { key: "objective", label: "Objectif" },
  { key: "search", label: "Recherche" },
  { key: "properties", label: "Ses biens immobiliers" },
  { key: "follows", label: "Biens suivis" },
  { key: "leads", label: "Transaction lead en cours" },
  { key: "p2p", label: "P2P Estimation" },
  { key: "campaigns", label: "Campagne P2P" },
  { key: "marketplace", label: "Marketplace" },
  { key: "qr", label: "QR Code" },
  { key: "activite", label: "Activité" },
  { key: "confiance", label: "Indice de confiance" },
];

const PROFILE_LABELS = {
  owner: "Propriétaire",
  buyer: "Acheteur",
  searcher: "En recherche",
  professional: "Professionnel",
};

const OBJECTIVE_LABELS = {
  sell: "Vendre",
  rent: "Louer",
  increase_value: "Accroître la valeur",
  active_buy: "Recherche active - achat",
  active_rent: "Recherche active - location",
  passive: "Recherche passive / anticipée",
};

const PROPERTY_TYPE_LABELS = {
  sale: "Vente",
  rent: "Location",
  directory: "Annuaire",
  "off-market": "Hors marché",
  offmarket: "Hors marché",
  plan: "Plan",
};

const ACTION_LABELS = {
  put_property_for_sale: "Mettre le bien en vente",
  put_property_for_rent: "Mettre le bien en location",
  publish_property_directory: "Publier dans l'annuaire",
  estimate_property_value: "Estimer la valeur",
  consult_transaction_history: "Consulter l'historique de transaction",
  get_targeted_help: "Obtenir de l'aide ciblée",
  learn_real_estate: "Apprendre l'immobilier",
  build_seller_dossier: "Construire le dossier vendeur",
  build_buyer_dossier: "Construire le dossier acheteur",
  build_tenant_dossier: "Construire le dossier locataire",
  get_personalized_advice: "Recevoir un conseil personnalisé",
  peer_estimation: "Estimation P2P",
  search_property_buy: "Recherche achat",
  search_property_rent: "Recherche location",
  find_professional: "Trouver un professionnel",
  browse_property_directory: "Parcourir l'annuaire",
  follow_property: "Suivre un bien",
  contact_owner_agency: "Contacter le propriétaire / l'agence",
  compute_financial_score_buy: "Calculer le score achat",
  compute_financial_score_rent: "Calculer le score location",
  compute_financial_score_passive: "Calculer le score passif",
};

const formatDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleString("fr-FR");
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "--";
  const number = Number(value);
  return Number.isNaN(number)
    ? String(value)
    : new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(number);
};

const formatLabel = (value, fallback = "--") => {
  if (!value) return fallback;
  return String(value).replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const toArray = (value) => (Array.isArray(value) ? value : []);

const Field = ({ label, value }) => (
  <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFB] px-4 py-3">
    <div className="text-[12px] uppercase tracking-[0.16em] text-[#6B7280]">{label}</div>
    <div className="mt-1 text-sm font-medium text-[#111827]">{value || "--"}</div>
  </div>
);

const EmptyState = ({ title, description }) => (
  <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-6 text-center text-sm text-[#6B7280]">
    <div className="font-semibold text-[#47525E]">{title}</div>
    <div className="mt-1">{description}</div>
  </div>
);

const View = () => {
  const history = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("general");
  const [data, setData] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [interests, setInterests] = useState([]);
  const [followedProperties, setFollowedProperties] = useState([]);
  const [marketplaceOrders, setMarketplaceOrders] = useState([]);
  const [marketplaceFavorites, setMarketplaceFavorites] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignDetails, setCampaignDetails] = useState([]);
  const [qrProperties, setQrProperties] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [scoreDetail, setScoreDetail] = useState(null);
  const [interestScores, setInterestScores] = useState([]);
  const [confianceSubTab, setConfianceSubTab] = useState("buyer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openImage = (image) => {
    if (image) window.open(methodModel.noImg(image), "_blank");
  };

  const loadCampaignDetails = async (items) => {
    const result = await Promise.allSettled(
      items.slice(0, 8).map((campaign) => ApiClient.get("peerCampaign/detail/campaign", { id: campaign._id }))
    );

    const mapped = result
      .filter((entry) => entry.status === "fulfilled" && entry.value?.success && entry.value?.data)
      .map((entry) => entry.value.data)
      .filter(Boolean)
      .map((item) => ({
        id: item._id,
        data: item,
        estimationCount: item.estimationCount || toArray(item.peerEstimations).length,
      }));

    setCampaignDetails(mapped);
  };

  const loadDetail = async () => {
    setError("");
    setLoading(true);
    loader(true);

    try {
      const responses = await Promise.allSettled([
        ApiClient.get(shared.detailApi, { id }),
        ApiClient.get("onboarding/admin/detail", { id }),
        ApiClient.get("interests/detail", { buyerId: id, page: 1, limit: 50 }),
        ApiClient.get("followUnfollow/listing", { userId: id, page: 1, limit: 50 }),
        ApiClient.get(`admin/marketplace/users/${id}/orders`, { page: 1, limit: 50 }),
        ApiClient.get(`admin/marketplace/users/${id}/favorites`, { page: 1, limit: 50 }),
        ApiClient.get("peerCampaign/userCampaigns", { userId: id, page: 1, count: 20 }),
        ApiClient.get("property/qr-code/properties", { userId: id, page: 1, limit: 50 }),
        ApiClient.get("user/admin/activity", { userId: id, limit: 100 }),
        ApiClient.get(`score/admin/users/${id}`),
        ApiClient.get("score/admin/interests", { buyerId: id, limit: 50 }),
      ]);

      const [userRes, onboardingRes, interestsRes, followsRes, ordersRes, favoritesRes, campaignsRes, qrRes, activityRes, scoreDetailRes, interestScoresRes] = responses;

      if (userRes.status === "fulfilled" && userRes.value?.success) {
        const userData = userRes.value.data || null;
        if (userData) {
          userData.permissions = userData.permissions?.[0];
          setData(userData);
        }
      } else {
        setError("Impossible de charger le détail utilisateur.");
      }

      if (onboardingRes.status === "fulfilled" && onboardingRes.value?.success) {
        setOnboarding(onboardingRes.value.data || null);
      }

      if (interestsRes.status === "fulfilled" && interestsRes.value?.success) {
        setInterests(toArray(interestsRes.value.data));
      }

      if (followsRes.status === "fulfilled" && followsRes.value?.success) {
        setFollowedProperties(toArray(followsRes.value.data));
      }

      if (ordersRes.status === "fulfilled" && ordersRes.value?.success) {
        setMarketplaceOrders(toArray(ordersRes.value.data));
      }

      if (favoritesRes.status === "fulfilled" && favoritesRes.value?.success) {
        setMarketplaceFavorites(toArray(favoritesRes.value.data));
      }

      if (campaignsRes.status === "fulfilled" && campaignsRes.value?.success) {
        const campaignItems = toArray(campaignsRes.value.data);
        setCampaigns(campaignItems);
        if (campaignItems.length > 0) {
          await loadCampaignDetails(campaignItems);
        } else {
          setCampaignDetails([]);
        }
      }

      if (qrRes.status === "fulfilled" && qrRes.value?.success) {
        setQrProperties(toArray(qrRes.value.data));
      }

      if (activityRes.status === "fulfilled" && activityRes.value?.success) {
        setActivityLog(toArray(activityRes.value.data));
      }

      if (scoreDetailRes.status === "fulfilled" && scoreDetailRes.value?.success) {
        setScoreDetail(scoreDetailRes.value.data || null);
      }

      if (interestScoresRes.status === "fulfilled" && interestScoresRes.value?.success) {
        setInterestScores(toArray(interestScoresRes.value.data));
      }
    } catch (err) {
      setError(err?.message || "Une erreur est survenue lors du chargement.");
    } finally {
      setLoading(false);
      loader(false);
    }
  };

  const propertyLeadStats = interests.reduce(
    (acc, item) => {
      const type = item?.propertyId?.propertyType || item?.propertyType || "other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    { sale: 0, rent: 0, other: 0 }
  );

  const cards = [
    { label: "Biens", value: data?.total_property ?? toArray(data?.propertiesList).length, icon: <FaMapLocationDot className="text-[18px]" /> },
    { label: "Suivis", value: data?.total_followers ?? followedProperties.length, icon: <FaHeart className="text-[18px]" /> },
    { label: "Dossiers", value: data?.folderCount ?? 0, icon: <FaFolderOpen className="text-[18px]" /> },
    { label: "Onboarding", value: `${onboarding?.completionPercent ?? 0}%`, icon: <FaChartLine className="text-[18px]" /> },
  ];

  const renderPropertyCard = (item, key) => (
    <div key={key} className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
      <img src={methodModel.noImg(item?.images?.[0]?.file)} alt={item?.propertyTitle || "Property"} className="h-44 w-full object-cover" />
      <div className="p-4 space-y-2">
        <div className="font-semibold text-[#111827]">{item?.propertyTitle || item?.title || "Sans titre"}</div>
        <div className="text-sm text-[#6B7280]">{item?.address || item?.city || "Adresse non renseignée"}</div>
        <span className="inline-flex rounded-full bg-[#F5F0FD] px-3 py-1 text-[12px] font-medium text-[#7B4DA4] capitalize">
          {PROPERTY_TYPE_LABELS[item?.propertyType] || item?.propertyType || "--"}
        </span>
      </div>
    </div>
  );

  const renderGeneralTab = () => (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
          <div className="bg-[#996dca21] p-3 rounded-md"><FaUserLarge className="text-[18px]" /></div>
          Informations générales
        </div>
        <div className="p-5 grid gap-4 sm:grid-cols-2 text-sm">
          <Field label="Prénom" value={data?.firstName} />
          <Field label="Nom" value={data?.lastName} />
          <Field label="Email" value={data?.email} />
          <Field label="Mobile" value={data?.mobileNo ? `+${data.mobileNo}` : "--"} />
          <Field label="Ville" value={data?.city} />
          <Field label="Pays" value={data?.country} />
          {data?.image ? (
            <div className="sm:col-span-2">
              <div className="text-[#6B7280] mb-2">Image</div>
              <Tooltip placement="top" title="Clique pour ouvrir">
                <img src={methodModel.noImg(data.image)} alt="User" className="h-28 w-28 rounded-2xl object-cover border border-[#E5E7EB] cursor-pointer" onClick={() => openImage(data.image)} />
              </Tooltip>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-[#E9E1F7] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-[#976DD0]">{card.icon}</div>
                <span className="text-[11px] uppercase tracking-[.18em] text-[#9CA3AF]">{card.label}</span>
              </div>
              <div className="mt-3 text-2xl font-semibold text-[#111827]">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="shadow-box rounded-2xl bg-white overflow-hidden">
          <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
            <div className="bg-[#996dca21] p-3 rounded-md"><FaArrowTrendUp className="text-[18px]" /></div>
            Profil et objectif
          </div>
          <div className="p-5 grid gap-3 text-sm">
            <Field label="Profil" value={PROFILE_LABELS[onboarding?.profile] || formatLabel(onboarding?.profile)} />
            <Field label="Objectif" value={OBJECTIVE_LABELS[onboarding?.objective] || formatLabel(onboarding?.objective)} />
            <Field label="Complétion" value={`${onboarding?.completionPercent ?? 0}%`} />
            <Field label="Créé le" value={formatDate(data?.createdAt)} />
          </div>
        </div>
      </div>

      <div className="xl:col-span-2 shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
          <div className="bg-[#996dca21] p-3 rounded-md"><FaMapLocationDot className="text-[18px]" /></div>
          Ses biens immobiliers
        </div>
        <div className="p-5">
          {toArray(data?.propertiesList).length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {toArray(data?.propertiesList).map((item, index) => renderPropertyCard(item, item?._id || index))}
            </div>
          ) : (
            <EmptyState title="Aucun bien rattaché" description="Le compte ne possède pas encore de propriété visible." />
          )}
        </div>
      </div>
    </div>
  );

  const renderObjectiveTab = () => (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
          <div className="bg-[#996dca21] p-3 rounded-md"><FaRegCircleCheck className="text-[18px]" /></div>
          Objectif actuel
        </div>
        <div className="p-5 space-y-3 text-sm">
          <Field label="Profil" value={PROFILE_LABELS[onboarding?.profile] || formatLabel(onboarding?.profile)} />
          <Field label="Objectif" value={OBJECTIVE_LABELS[onboarding?.objective] || formatLabel(onboarding?.objective)} />
          <Field label="Complétion" value={`${onboarding?.completionPercent ?? 0}%`} />
        </div>
      </div>

      <div className="shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0]">Actions onboarding</div>
        <div className="p-5 grid gap-3 md:grid-cols-2">
          {Object.keys(onboarding?.completions || {}).length ? (
            Object.entries(onboarding?.completions || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#FAFAFB] px-4 py-3">
                <div>
                  <div className="font-medium text-[#111827]">{ACTION_LABELS[key] || formatLabel(key)}</div>
                  <div className="text-[12px] text-[#9CA3AF]">{key}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${value === "done" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                  {value === "done" ? "Done" : "Pending"}
                </span>
              </div>
            ))
          ) : (
            <div className="md:col-span-2"><EmptyState title="Aucune complétion visible" description="L'API admin n'a pas encore renvoyé de données onboarding détaillées." /></div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSearchTab = () => (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
          <div className="bg-[#996dca21] p-3 rounded-md"><FaChartLine className="text-[18px]" /></div>
          Activité de recherche
        </div>
        <div className="p-5 space-y-3 text-sm">
          <Field label="Leads vente" value={propertyLeadStats.sale || 0} />
          <Field label="Leads location" value={propertyLeadStats.rent || 0} />
          <Field label="Autres signaux" value={propertyLeadStats.other || 0} />
        </div>
      </div>

      <div className="shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0]">Contexte de recherche</div>
        <div className="p-5 text-sm text-[#374151] space-y-4">
          <p>Cette vue s'appuie sur les signaux d'intérêt et d'onboarding visibles côté admin.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Profil actuel" value={PROFILE_LABELS[onboarding?.profile] || formatLabel(onboarding?.profile)} />
            <Field label="Objectif actuel" value={OBJECTIVE_LABELS[onboarding?.objective] || formatLabel(onboarding?.objective)} />
          </div>
          <div className="rounded-xl border border-dashed border-[#D9D2E8] bg-[#FBF9FE] p-4 text-[#6B7280]">
            Aucun historique de recherche distinct n'est exposé ici. Les leads visibles dans l'onglet suivant restent la source la plus fiable pour comprendre l'activité réelle du compte.
          </div>
        </div>
      </div>
    </div>
  );

  const renderPropertiesTab = () => (
    <div className="shadow-box overflow-hidden rounded-2xl bg-white">
      <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
        <div className="bg-[#996dca21] p-3 rounded-md"><FaBuilding className="text-[18px]" /></div>
        Ses biens immobiliers
      </div>
      <div className="p-5">
        {toArray(data?.propertiesList).length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {toArray(data?.propertiesList).map((item, index) => renderPropertyCard(item, item?._id || index))}
          </div>
        ) : (
          <EmptyState title="Aucun bien rattaché" description="Le compte ne possède pas encore de propriété visible." />
        )}
      </div>
    </div>
  );

  const renderLeadsTab = () => (
    <div className="shadow-box rounded-2xl bg-white overflow-hidden">
      <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
        <div className="bg-[#996dca21] p-3 rounded-md"><FaChartLine className="text-[18px]" /></div>
        Transaction lead en cours
      </div>
      <div className="p-5">
        {interests.length ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {interests.map((item, index) => (
              <div key={item?._id || index} className="rounded-2xl border border-[#E5E7EB] bg-[#FCFAFF] p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#111827]">{item?.propertyId?.propertyTitle || "Sans titre"}</div>
                    <div className="text-sm text-[#6B7280]">{item?.propertyId?.city || item?.propertyId?.zipcode || "--"}</div>
                  </div>
                  <span className="rounded-full bg-[#F4EDF9] px-3 py-1 text-xs font-medium text-[#7B4DA4] capitalize">
                    {PROPERTY_TYPE_LABELS[item?.propertyId?.propertyType] || item?.propertyId?.propertyType || "--"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Funnel" value={item?.funnelStatus || "--"} />
                  <Field label="Leads" value={item?.totalLeads ?? 0} />
                  <Field label="Score" value={item?.financingProbability ?? item?.financialScore ?? "--"} />
                  <Field label="Mis à jour" value={formatDate(item?.updatedAt)} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Aucun lead" description="Aucun bien n'a encore été remonté par l'écran de transaction searcher." />
        )}
      </div>
    </div>
  );

  const renderCampaignsTab = () => (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
          <div className="bg-[#996dca21] p-3 rounded-md"><FaArrowTrendUp className="text-[18px]" /></div>
          Campagnes P2P
        </div>
        <div className="p-5 space-y-3 text-sm">
          <Field label="Nombre de campagnes" value={campaigns.length} />
          <Field label="Estimations chargées" value={campaignDetails.length} />
        </div>
      </div>

      <div className="shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0]">Campagnes enregistrées</div>
        <div className="p-5 space-y-4">
          {campaigns.length ? (
            campaigns.map((campaign, index) => (
              <div key={campaign?._id || index} className="rounded-2xl border border-[#E5E7EB] bg-[#FCFAFF] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#111827]">{campaign?.campaignName || "Campagne sans nom"}</div>
                    <div className="text-sm text-[#6B7280]">{campaign?.propertyId?.propertyTitle || "Bien associé non renseigné"}</div>
                  </div>
                  <span className="rounded-full bg-[#F4EDF9] px-3 py-1 text-xs font-medium text-[#7B4DA4] capitalize">{campaign?.status || "--"}</span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4 text-sm">
                  <Field label="Début" value={formatDate(campaign?.startDate)} />
                  <Field label="Fin" value={formatDate(campaign?.endDate)} />
                  <Field label="Durée" value={campaign?.duration || "--"} />
                  <Field label="Partages" value={campaign?.shareCount ?? 0} />
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="Aucune campagne" description="Aucune campagne P2P n'est rattachée à ce compte." />
          )}
        </div>
      </div>
    </div>
  );

  const renderP2PTab = () => (
    <div className="shadow-box rounded-2xl bg-white overflow-hidden">
      <div className="p-4 border-b font-medium text-[#976DD0]">Estimations P2P</div>
      <div className="p-5 space-y-5">
        {campaignDetails.length ? (
          campaignDetails.map((campaignDetail) => {
            const estimations = toArray(campaignDetail?.data?.peerEstimations);
            return (
              <div key={campaignDetail.id} className="rounded-2xl border border-[#E5E7EB] bg-[#FCFAFF] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#111827]">{campaignDetail?.data?.campaignName || "Campagne P2P"}</div>
                    <div className="text-sm text-[#6B7280]">{campaignDetail?.data?.propertyId?.propertyTitle || "Bien non renseigné"}</div>
                  </div>
                  <span className="rounded-full bg-[#F4EDF9] px-3 py-1 text-xs font-medium text-[#7B4DA4]">{campaignDetail.estimationCount || 0} estimation(s)</span>
                </div>
                {estimations.length ? (
                  <div className="mt-4 grid gap-3">
                    {estimations.map((estimation, index) => (
                      <div key={estimation?._id || index} className="grid gap-3 rounded-xl bg-white p-3 border border-[#EEE6FA] md:grid-cols-4 text-sm">
                        <Field label="User" value={estimation?.userId?.fullName || "--"} />
                        <Field label="Prix estimé" value={formatCurrency(estimation?.userReasonablePrice)} />
                        <Field label="Référence" value={formatCurrency(estimation?.currentPropReferencePrice)} />
                        <Field label="Statut" value={formatLabel(estimation?.referencePrice)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4"><EmptyState title="Aucune estimation détaillée" description="La campagne existe mais aucune estimation n'est remontée dans l'API." /></div>
                )}
              </div>
            );
          })
        ) : (
          <EmptyState title="Aucune estimation" description="Aucune donnée P2P n'est disponible pour ce compte." />
        )}
      </div>
    </div>
  );

  const renderMarketplaceTab = () => (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
          <div className="bg-[#996dca21] p-3 rounded-md"><FaBuilding className="text-[18px]" /></div>
          Achats Marketplace
        </div>
        <div className="p-5 space-y-4">
          {marketplaceOrders.length ? (
            marketplaceOrders.map((order, index) => (
              <div key={order?._id || index} className="rounded-2xl border border-[#E5E7EB] bg-[#FCFAFF] p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#111827]">{order?.service?.title || order?.serviceSnapshot?.title || "Service"}</div>
                    <div className="text-sm text-[#6B7280]">{formatDate(order?.createdAt)}</div>
                  </div>
                  <span className="rounded-full bg-[#F4EDF9] px-3 py-1 text-xs font-medium text-[#7B4DA4] capitalize">{order?.status || "--"}</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <Field label="Prix TTC" value={formatCurrency(order?.totalPriceTTC)} />
                  <Field label="Quantité" value={order?.quantity ?? 1} />
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="Aucun achat" description="Aucune commande Marketplace n'est rattachée à ce compte." />
          )}
        </div>
      </div>

      <div className="shadow-box rounded-2xl bg-white overflow-hidden">
        <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
          <div className="bg-[#996dca21] p-3 rounded-md"><FaHeart className="text-[18px]" /></div>
          Services sauvegardés
        </div>
        <div className="p-5 space-y-4">
          {marketplaceFavorites.length ? (
            marketplaceFavorites.map((favorite, index) => (
              <div key={favorite?._id || index} className="rounded-2xl border border-[#E5E7EB] bg-[#FCFAFF] p-4 flex items-start gap-4">
                <img src={methodModel.noImg(favorite?.service?.imageUrls?.[0] || favorite?.service?.imageUrl || "/assets/img/logo.png")} alt={favorite?.service?.title || "Service"} className="w-[72px] h-[72px] rounded-xl object-cover border border-[#EEE6FA]" />
                <div className="flex-1">
                  <div className="font-semibold text-[#111827]">{favorite?.service?.title || "Service sauvegardé"}</div>
                  <div className="text-sm text-[#6B7280] mt-1">{favorite?.service?.category?.name || favorite?.service?.category?.name_fr || "Catégorie non renseignée"}</div>
                  <div className="text-sm text-[#6B7280] mt-1">{formatCurrency(favorite?.service?.priceTTC)}</div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="Aucun favori" description="Aucun service sauvegardé n'est rattaché à ce compte." />
          )}
        </div>
      </div>
    </div>
  );

  const renderFollowsTab = () => (
    <div className="shadow-box rounded-2xl bg-white overflow-hidden">
      <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
        <div className="bg-[#996dca21] p-3 rounded-md"><FaHeart className="text-[18px]" /></div>
        Biens suivis
      </div>
      <div className="p-5">
        {followedProperties.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {followedProperties.map((item, index) => (
              <div key={item?.id || index} className="rounded-2xl border border-[#E5E7EB] bg-[#FCFAFF] p-4 space-y-3">
                <img src={methodModel.noImg(item?.property?.images?.[0]?.file)} alt={item?.property?.propertyTitle || "Property"} className="w-full h-[170px] object-cover rounded-xl" />
                <div className="font-semibold text-[#111827]">{item?.property?.propertyTitle || "Bien suivi"}</div>
                <div className="text-sm text-[#6B7280]">{item?.property?.city || "--"}{item?.property?.zipcode ? `, ${item.property.zipcode}` : ""}</div>
                <div className="inline-flex rounded-full bg-[#F5F0FD] px-3 py-1 text-[12px] font-medium text-[#7B4DA4] capitalize">
                  {PROPERTY_TYPE_LABELS[item?.property?.propertyType] || item?.property?.propertyType || "--"}
                </div>
                <div className="text-sm text-[#6B7280]">{item?.p2pFollow ? "Suivi P2P actif" : "Suivi standard"}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Aucun bien suivi" description="Aucun follow n'est rattaché à ce compte." />
        )}
      </div>
    </div>
  );

  const renderQrTab = () => (
    <div className="shadow-box rounded-2xl bg-white overflow-hidden">
      <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
        <div className="bg-[#996dca21] p-3 rounded-md"><FaQrcode className="text-[18px]" /></div>
        QR Code et flyers
      </div>
      <div className="p-5">
        {qrProperties.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {qrProperties.map((item, index) => (
              <div key={item?.propertyId || index} className="rounded-2xl border border-[#E5E7EB] bg-[#FCFAFF] p-4 space-y-3">
                <img src={methodModel.noImg(item?.coverUrl || item?.latestFlyer?.previewImageUrl || "/assets/img/logo.png")} alt={item?.title || "QR property"} className="w-full h-[180px] object-cover rounded-xl" />
                <div className="font-semibold text-[#111827]">{item?.title || "Bien QR"}</div>
                <div className="text-sm text-[#6B7280]">{item?.summary || ""}</div>
                <div className="text-sm text-[#6B7280]">Flyers : {item?.latestFlyer ? item.latestFlyer.scansCount || 0 : 0} scan(s)</div>
                {item?.publicUrl ? (
                  <a href={item.publicUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-[#976DD0] px-4 py-2 text-white text-sm font-medium hover:opacity-90">
                    Ouvrir le lien public
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Aucun QR / flyer" description="Aucun QR flyer n'est encore disponible pour ce compte." />
        )}
      </div>
    </div>
  );

  const ACTIVITY_COLORS = {
    login: "bg-blue-100 text-blue-700",
    logout: "bg-gray-100 text-gray-600",
    password_change: "bg-orange-100 text-orange-700",
    profile_update: "bg-purple-100 text-purple-700",
    property_view: "bg-indigo-100 text-indigo-700",
    property_like: "bg-pink-100 text-pink-700",
    property_follow: "bg-teal-100 text-teal-700",
    property_create: "bg-green-100 text-green-700",
    property_update: "bg-lime-100 text-lime-700",
    offer_sent: "bg-yellow-100 text-yellow-700",
    campaign_launch: "bg-violet-100 text-violet-700",
    folder_create: "bg-cyan-100 text-cyan-700",
    document_add: "bg-sky-100 text-sky-700",
    questionnaire_buyer: "bg-emerald-100 text-emerald-700",
    questionnaire_renter: "bg-emerald-100 text-emerald-700",
    search_saved: "bg-rose-100 text-rose-700",
    other: "bg-gray-100 text-gray-600",
  };

  const ACTIVITY_LABELS_MAP = {
    login: "Connexion",
    logout: "Déconnexion",
    password_change: "Changement de mot de passe",
    profile_update: "Mise à jour du profil",
    property_view: "Consultation d'un bien",
    property_like: "Bien ajouté aux favoris",
    property_follow: "Bien suivi",
    property_create: "Bien publié",
    property_update: "Bien modifié",
    offer_sent: "Intérêt / offre envoyé(e)",
    campaign_launch: "Campagne P2P lancée",
    folder_create: "Dossier créé",
    document_add: "Document ajouté",
    questionnaire_buyer: "Questionnaire acheteur",
    questionnaire_renter: "Questionnaire locataire",
    search_saved: "Recherche sauvegardée",
    other: "Autre",
  };

  const renderActiviteTab = () => (
    <div className="shadow-box rounded-2xl bg-white overflow-hidden">
      <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
        <div className="bg-[#996dca21] p-3 rounded-md"><FaChartLine className="text-[18px]" /></div>
        Journal d'activité
      </div>
      <div className="p-5">
        {activityLog.length === 0 ? (
          <EmptyState title="Aucune activité enregistrée" description="Les actions futures de cet utilisateur apparaîtront ici." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F0FD] text-[#6B7280]">
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Action</th>
                  <th className="text-left px-4 py-2 font-medium">Objet</th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {activityLog.map((item, idx) => (
                  <tr key={item._id || idx} className="border-b last:border-0 hover:bg-[#FAF7FF]">
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${ACTIVITY_COLORS[item.type] || "bg-gray-100 text-gray-600"}`}>
                        {ACTIVITY_LABELS_MAP[item.type] || item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#374151]">{item.label || "--"}</td>
                    <td className="px-4 py-3 text-[#374151]">
                      {item.objectTitle ? (
                        <span className="font-medium text-[#976DD0]">{item.objectTitle}</span>
                      ) : "--"}
                    </td>
                    <td className="px-4 py-3 text-[#9CA3AF] whitespace-nowrap">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderConfianceTab = () => {
    const buyerScore = scoreDetail?.financingReferenceScore ?? "--";
    const renterScore = scoreDetail?.renterFinancingReferenceScore ?? "--";
    const buyerScores = interestScores.filter((s) => (s.propertyType || s.property?.propertyType) === "sale");
    const renterScores = interestScores.filter((s) => (s.propertyType || s.property?.propertyType) === "rent");
    const visibleScores = confianceSubTab === "buyer" ? buyerScores : renterScores;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#EEE6FA] bg-[#FBFAFF] p-5 space-y-1">
            <div className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Indice de crédibilité acquéreur</div>
            <div className="text-3xl font-bold text-[#976DD0]">{typeof buyerScore === "number" ? buyerScore : "--"}</div>
            <div className="text-xs text-[#9CA3AF]">Score calculé automatiquement à partir du questionnaire acheteur</div>
          </div>
          <div className="rounded-2xl border border-[#EEE6FA] bg-[#FBFAFF] p-5 space-y-1">
            <div className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Indice de fiabilité locative</div>
            <div className="text-3xl font-bold text-[#976DD0]">{typeof renterScore === "number" ? renterScore : "--"}</div>
            <div className="text-xs text-[#9CA3AF]">Score calculé automatiquement à partir du questionnaire locataire</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-box border border-[#EEE6FA] overflow-hidden">
          <div className="flex border-b border-[#EEE6FA] bg-[#FBF9FE]">
            <button type="button" onClick={() => setConfianceSubTab("buyer")} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${confianceSubTab === "buyer" ? "border-[#976DD0] text-[#976DD0] bg-white" : "border-transparent text-[#6B7280] hover:text-[#976DD0]"}`}>
              Crédibilité acquéreur
            </button>
            <button type="button" onClick={() => setConfianceSubTab("renter")} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${confianceSubTab === "renter" ? "border-[#976DD0] text-[#976DD0] bg-white" : "border-transparent text-[#6B7280] hover:text-[#976DD0]"}`}>
              Fiabilité locative
            </button>
          </div>
          <div className="p-4">
            {visibleScores.length === 0 ? (
              <EmptyState title="Aucun score disponible" description="Les indices calculés à la volée apparaîtront ici lorsque l'utilisateur se positionne sur des biens." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5F0FD] text-[#6B7280]">
                      <th className="text-left px-4 py-2 font-medium">Bien</th>
                      <th className="text-left px-4 py-2 font-medium">Classe</th>
                      <th className="text-left px-4 py-2 font-medium">Label</th>
                      <th className="text-left px-4 py-2 font-medium">Statut</th>
                      <th className="text-left px-4 py-2 font-medium">Prob. financement</th>
                      <th className="text-left px-4 py-2 font-medium">Mis à jour</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleScores.map((item, idx) => (
                      <tr key={item._id || idx} className="border-b last:border-0 hover:bg-[#FAF7FF]">
                        <td className="px-4 py-3 font-medium text-[#111827]">{item.property?.propertyTitle || item.propertyId || "--"}</td>
                        <td className="px-4 py-3">{item.scoreClass || item.renterScoreClass || "--"}</td>
                        <td className="px-4 py-3">{item.scoreLabel || item.renterScoreLabel || "--"}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{item.scoreStatus || item.renterScoreStatus || "--"}</td>
                        <td className="px-4 py-3">{item.financingProbability != null ? `${item.financingProbability}%` : "--"}</td>
                        <td className="px-4 py-3 text-[#9CA3AF] whitespace-nowrap">{formatDate(item.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="wrapper_section space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Tooltip placement="top" title="Back">
              <span onClick={() => history(-1)} className="!px-4 py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:opacity-90 border transition-all cursor-pointer">
                <FaArrowLeft className="text-lg" />
              </span>
            </Tooltip>
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">{shared.addTitle} Details</h3>
              <p className="text-sm text-[#6B7280] mt-1">Vue détaillée du profil utilisateur et de ses flux métiers.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-box px-4 py-3 border border-[#EEE6FA] flex items-center gap-3">
            {data?.image ? (
              <img src={methodModel.noImg(data.image)} alt={data?.fullName || "User"} className="w-12 h-12 rounded-full object-cover border border-[#EEE6FA]" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#F5F0FD] text-[#976DD0] flex items-center justify-center font-semibold">{(data?.fullName || data?.firstName || "U").slice(0, 1).toUpperCase()}</div>
            )}
            <div>
              <div className="font-semibold text-[#111827]">{data?.fullName || `${data?.firstName || ""} ${data?.lastName || ""}`.trim() || "User"}</div>
              <div className="text-sm text-[#6B7280]">{data?.email || "--"}</div>
            </div>
          </div>
        </div>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">{error}</div> : null}

        <div className="rounded-2xl bg-white shadow-box border border-[#EEE6FA] overflow-hidden">
          <div className="flex overflow-x-auto border-b border-[#EEE6FA] bg-[#FBF9FE]">
            {tabs.map((tab) => (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? "border-[#976DD0] text-[#976DD0] bg-white" : "border-transparent text-[#6B7280] hover:text-[#976DD0]"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {loading ? (
              <div className="text-center py-8">
                <img src="/assets/img/loader.gif" className="pageLoader mx-auto" alt="Loading" />
              </div>
            ) : (
              <>
                {activeTab === "general" ? renderGeneralTab() : null}
                {activeTab === "objective" ? renderObjectiveTab() : null}
                {activeTab === "search" ? renderSearchTab() : null}
                {activeTab === "properties" ? renderPropertiesTab() : null}
                {activeTab === "follows" ? renderFollowsTab() : null}
                {activeTab === "leads" ? renderLeadsTab() : null}
                {activeTab === "p2p" ? renderP2PTab() : null}
                {activeTab === "campaigns" ? renderCampaignsTab() : null}
                {activeTab === "marketplace" ? renderMarketplaceTab() : null}
                {activeTab === "qr" ? renderQrTab() : null}
                {activeTab === "activite" ? renderActiviteTab() : null}
                {activeTab === "confiance" ? renderConfianceTab() : null}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default View;