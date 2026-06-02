import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin, Tag, Space, Divider } from "antd";
import { FiArrowLeft } from "react-icons/fi";
import Swal from "sweetalert2";
import Layout from "../../../components/global/layout";
import MarketplaceApi from "../../../methods/api/marketplaceApi";

const LitigationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [litigation, setLitigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadLitigation = async () => {
    setLoading(true);
    const response = await MarketplaceApi.getLitigationDetail(id);
    if (response.success) {
      setLitigation(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) loadLitigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getParticipant = (row, type) => {
    if (!row) return "—";
    return [row.name, row.email, row.phone].filter(Boolean).join(" / ") || "—";
  };

  const handleResolve = async (decision) => {
    setSaving(true);
    try {
      const response = await MarketplaceApi.resolveLitigation(id, { decision });
      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Litige clôturé",
          text: response.message || "Le litige a été résolu.",
        });
        loadLitigation();
      } else {
        await Swal.fire({ icon: "error", title: "Erreur", text: response.message || "Impossible de clôturer le litige." });
      }
    } catch (err) {
      await Swal.fire({ icon: "error", title: "Erreur", text: err.message || "Erreur serveur." });
    }
    setSaving(false);
  };

  const confirmResolve = async () => {
    const result = await Swal.fire({
      title: "Clôturer le litige",
      text: "Choisissez comment résoudre ce litige :",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Libérer le paiement au pro",
      denyButtonText: "Rembourser l'acheteur",
    });

    if (result.isConfirmed) {
      await handleResolve("release");
    } else if (result.isDenied) {
      await handleResolve("refund");
    }
  };

  if (loading || !litigation) {
    return (
      <Layout>
        <div className="p-6 flex justify-center items-center min-h-[400px]"><Spin /></div>
      </Layout>
    );
  }

  const service = litigation.serviceSnapshot || litigation.service || {};
  const buyer = litigation.buyer || {};
  const pro = litigation.pro || {};
  const property = litigation.property || litigation.propertyId || litigation.property_id || {};
  const propertyId = property._id || property.id || property.propertyId || null;
  const propertyUrl = propertyId ? `/property/detail/${propertyId}` : null;
  const propertyImage = property.imageUrls?.[0]?.file || property.images?.[0]?.file || property.image || null;
  const propertyTitle = property.propertyTitle || property.title || property.name || "—";
  const originator = litigation.litigation?.originator || {};
  const counterparty = litigation.litigation?.counterparty || {};

  return (
    <Layout>
      <div className="p-6">
        <Button type="text" icon={<FiArrowLeft />} onClick={() => navigate("/marketplace/litigations")} className="mb-4">
          Retour aux litiges
        </Button>

        <div className="bg-white rounded-lg shadow-box p-6 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Litige {litigation.reference || litigation.id || litigation._id}</h2>
              <div className="text-sm text-gray-500 mt-2">Statut : <Tag>{statusLabel(litigation.status)}</Tag></div>
              <div className="text-sm text-gray-500 mt-1">Ouvert le : {litigation.litigation?.openedAt ? new Date(litigation.litigation.openedAt).toLocaleString("fr-FR") : "—"}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="default" onClick={() => navigate(`/marketplace/transactions/${id}`)}>
                Voir transaction liée
              </Button>
              {litigation.status === "litigation_opened" ? (
                <Button type="primary" loading={saving} onClick={confirmResolve}>
                  Clôturer le litige
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-lg shadow-box p-6">
            <h3 className="text-lg font-semibold mb-4">Informations du litige</h3>
            <DetailRow label="Origine" value={litigation.litigation?.initiatedBy === "pro" ? `Pro - ${originator.name || "—"}` : `Client - ${originator.name || "—"}`} />
            <DetailRow label="Contrepartie" value={counterparty.name || "—"} />
            <DetailRow label="Email origine" value={originator.email || "—"} />
            <DetailRow label="Téléphone origine" value={originator.phone || "—"} />
            <DetailRow label="Email contrepartie" value={counterparty.email || "—"} />
            <DetailRow label="Téléphone contrepartie" value={counterparty.phone || "—"} />
          </div>

          <div className="bg-white rounded-lg shadow-box p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Description du litige</h3>
            <p className="whitespace-pre-line text-sm text-gray-800">{litigation.litigation?.description || "Aucune description fournie."}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-box p-6 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold">Détails de la transaction</h3>
            <Space>
              <Tag color="blue">Référence : {litigation.reference || litigation.id || litigation._id}</Tag>
              <Tag color="default">Statut commande : {litigation.status}</Tag>
            </Space>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <DetailRow label="Prix total TTC" value={litigation.totalPriceTTC != null ? `${litigation.totalPriceTTC} €` : "—"} />
            <DetailRow label="Commission HT" value={litigation.commissionHT != null ? `${litigation.commissionHT} €` : "—"} />
            <DetailRow label="Quantité" value={litigation.quantity != null ? litigation.quantity : "—"} />
          </div>
          <Divider />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-start gap-4 mb-4">
                <a href={propertyUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 block">
                  {propertyImage ? (
                    <img src={propertyImage} alt={propertyTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                  )}
                </a>
                <div className="min-w-0">
                  <a href={propertyUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-base font-semibold hover:underline block">
                    {propertyTitle}
                  </a>
                  <p className="text-sm text-gray-500">{[property.city, property.zipcode].filter(Boolean).join(" - ") || "—"}</p>
                  <p className="text-sm text-gray-500">{property.address || "—"}</p>
                </div>
              </div>
            </div>
            {property.price != null ? <DetailRow label="Prix" value={`${property.price} €`} /> : null}
          </div>
          <Divider />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <DetailRow label="Payée le" value={litigation.paidAt ? new Date(litigation.paidAt).toLocaleString("fr-FR") : "—"} />
            <DetailRow label="Livrée le" value={litigation.deliveredAt ? new Date(litigation.deliveredAt).toLocaleString("fr-FR") : "—"} />
            <DetailRow label="Confirmée le" value={litigation.confirmedAt ? new Date(litigation.confirmedAt).toLocaleString("fr-FR") : "—"} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-lg shadow-box p-6">
            <h3 className="text-lg font-semibold mb-4">Acheteur</h3>
            <DetailRow label="Nom" value={buyer.name || "—"} />
            <DetailRow label="Email" value={buyer.email || "—"} />
            <DetailRow label="Téléphone" value={buyer.phone || "—"} />
          </div>
          <div className="bg-white rounded-lg shadow-box p-6">
            <h3 className="text-lg font-semibold mb-4">Prestataire</h3>
            <DetailRow label="Nom" value={pro.name || "—"} />
            <DetailRow label="Email" value={pro.email || "—"} />
            <DetailRow label="Téléphone" value={pro.phone || "—"} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-box p-6">
          <h3 className="text-lg font-semibold mb-4">Service au moment de l'achat</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <DetailRow label="Titre" value={service.title || "—"} />
            <DetailRow label="Prix TTC" value={service.priceTTC != null ? `${service.priceTTC} €` : "—"} />
            <DetailRow label="Modalité" value={service.modality || "—"} />
            <DetailRow label="Ville" value={service.city || "—"} />
            <DetailRow label="Quantité" value={service.quantity != null ? service.quantity : "—"} />
            <DetailRow label="Délai" value={service.delivery_time || service.deliveryTime || "—"} />
          </div>
          <Divider />
          <div>
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="whitespace-pre-line text-sm text-gray-800">{service.description || "—"}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const statusLabel = (status) => {
  if (status === "litigation_opened") return "Ouvert";
  if (status === "payout_released") return "Résolu - Paiement libéré";
  if (status === "refunded") return "Résolu - Remboursé";
  return status || "—";
};

const DetailRow = ({ label, value }) => (
  <div className="mb-3">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-sm text-gray-800">{value || "—"}</p>
  </div>
);

export default LitigationDetail;
