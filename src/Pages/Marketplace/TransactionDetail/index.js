import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin, Space, Tag } from "antd";
import { FiArrowLeft } from "react-icons/fi";
import Layout from "../../../components/global/layout";
import MarketplaceApi from "../../../methods/api/marketplaceApi";

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    setLoading(true);
    const res = await MarketplaceApi.getTransactionDetail(id);
    if (res.success) {
      setOrder(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading || !order) {
    return (
      <Layout>
        <div className="p-6 flex justify-center items-center min-h-[400px]"><Spin /></div>
      </Layout>
    );
  }

  const service = order.serviceSnapshot || order.service || {};
  const buyer = order.buyer || {};
  const pro = order.pro || {};
  const property = order.property || order.propertyId || order.property_id || {};
  const propertyId = property._id || property.id || property.propertyId || null;
  const propertyUrl = propertyId ? `/property/detail/${propertyId}` : null;
  const propertyImage = property.imageUrls?.[0]?.file || property.images?.[0]?.file || property.image || null;
  const propertyTitle = property.propertyTitle || property.title || property.name || "—";

  const serviceCategory = (() => {
    if (!service.category) return "—";
    if (typeof service.category === "string") return service.category;
    return service.category.name || service.category.name_fr || service.category.name_en || service.category._id || "—";
  })();

  const serviceDescription = service.description || service.description_fr || service.description_en || service.summary || "—";
  const serviceSummary = service.summary || service.summary_fr || service.summary_en || service.description || "—";

  return (
    <Layout>
      <div className="p-6">
        <Button type="text" icon={<FiArrowLeft />} onClick={() => navigate("/marketplace/transactions")} className="mb-4">
          Retour aux transactions
        </Button>

        <div className="bg-white rounded-lg shadow-box p-6 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Transaction {order.reference || order.id}</h2>
              <div className="text-sm text-gray-500 mt-2">Statut : <Tag>{order.status}</Tag></div>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-gray-500">Date</p>
              <p>{order.createdAt ? new Date(order.createdAt).toLocaleString("fr-FR") : "—"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-lg shadow-box p-6">
            <h3 className="text-lg font-semibold mb-4">Détails du service au moment de l'achat</h3>
            <DetailRow label="Titre du service" value={service.title} />
            <DetailRow label="Type de service" value={serviceCategory} />
            <DetailRow label="Prix TTC" value={service.priceTTC != null ? `${service.priceTTC} €` : "—"} />
            <DetailRow label="Modalité" value={service.modality} />
            <DetailRow label="Ville" value={service.city} />
            <DetailRow label="Quantité disponible" value={service.quantity != null ? service.quantity : "—"} />
            <DetailRow label="Délai de livraison" value={service.delivery_time || service.deliveryTime || "—"} />
            <DetailRow label="Statut du service" value={service.status || "—"} />
            <DetailRow label="Distance (km)" value={service.radiusKm != null ? `${service.radiusKm} km` : "—"} />
            <DetailRow label="Visibilité" value={service.status || "—"} />
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="whitespace-pre-line text-sm text-gray-800">{serviceDescription}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Valeur ajoutée</p>
              <p className="whitespace-pre-line text-sm text-gray-800">{serviceSummary}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-box p-6">
            <h3 className="text-lg font-semibold mb-4">Bien sélectionné</h3>
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
            {property.price != null ? <DetailRow label="Prix" value={`${property.price} €`} /> : null}
            {property.surface ? <DetailRow label="Surface" value={property.surface} /> : null}
          </div>

          <div className="bg-white rounded-lg shadow-box p-6">
            <h3 className="text-lg font-semibold mb-4">Informations transaction</h3>
            <DetailRow label="Référence" value={order.reference} />
            <DetailRow label="Prix total TTC" value={order.totalPriceTTC != null ? `${order.totalPriceTTC} €` : "—"} />
            <DetailRow label="Commission HT" value={order.commissionHT != null ? `${order.commissionHT} €` : "—"} />
            <DetailRow label="Quantité achetée" value={order.quantity != null ? order.quantity : "—"} />
            <DetailRow label="Client" value={`${buyer.name || "—"} ${buyer.email ? `(${buyer.email})` : ""}`} />
            <DetailRow label="Pro" value={`${pro.name || "—"} ${pro.role ? `(${pro.role})` : ""}`} />
            <DetailRow label="Ville du pro" value={pro.city} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-box p-6">
          <h3 className="text-lg font-semibold mb-4">Historique de la transaction</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <DetailRow label="Payée le" value={order.paidAt ? new Date(order.paidAt).toLocaleString("fr-FR") : "—"} />
            <DetailRow label="Livrée le" value={order.deliveredAt ? new Date(order.deliveredAt).toLocaleString("fr-FR") : "—"} />
            <DetailRow label="Confirmée le" value={order.confirmedAt ? new Date(order.confirmedAt).toLocaleString("fr-FR") : "—"} />
            <DetailRow label="Message de livraison" value={order.deliveryMessage || "—"} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="mb-3">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-sm text-gray-800">{value || "—"}</p>
  </div>
);

export default TransactionDetail;
