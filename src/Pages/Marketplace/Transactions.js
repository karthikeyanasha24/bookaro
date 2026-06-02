import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Button, Space, Spin, Tag } from "antd";
import Layout from "../../components/global/layout";
import Table from "../../components/Table";
import MarketplaceApi from "../../methods/api/marketplaceApi";

const STATUSES = [
  { value: "pending_payment", label: "Paiement en attente" },
  { value: "paid", label: "Payé" },
  { value: "payment_failed", label: "Échec paiement" },
  { value: "accepted_by_pro", label: "Accepté par le pro" },
  { value: "in_progress", label: "En cours" },
  { value: "delivered_by_pro", label: "Livré" },
  { value: "cancellation_requested", label: "Annulation demandée" },
  { value: "confirmed_by_buyer", label: "Confirmé par l'acheteur" },
  { value: "litigation_opened", label: "Litige" },
  { value: "payout_released", label: "Paiement libéré" },
  { value: "cancelled", label: "Annulé" },
  { value: "refunded", label: "Remboursé" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date de transaction" },
  { value: "totalPriceTTC", label: "Prix du service" },
  { value: "serviceSnapshot.title", label: "Titre du service" },
  { value: "proSnapshot.name", label: "Nom du pro" },
];

const MarketplaceTransactions = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    count: 20,
    q: "",
    status: undefined,
    sortBy: "createdAt",
    order: "desc",
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchOrders = async (override = {}) => {
    setLoading(true);
    const next = { ...filters, ...override };
    setFilters(next);

    const params = {
      page: next.page,
      limit: next.count,
      sortBy: next.sortBy,
      order: next.order,
    };
    if (next.q) params.q = next.q;
    if (next.status) params.status = next.status;

    const response = await MarketplaceApi.listTransactions(params);
    if (response.success) {
      setOrders(response.data || []);
      setTotal(response.pagination?.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "reference",
        name: "Référence",
        sort: true,
        render: (row) => <span>{row._id || "—"}</span>,
      },
      {
        key: "proName",
        name: "Nom du pro",
        sort: true,
        render: (row) => <span>{row.proSnapshot?.name || "—"}</span>,
      },
      {
        key: "buyerName",
        name: "Nom du client",
        render: (row) => <span>{row.buyer?.name || "—"}</span>,
      },
      {
        key: "serviceTitle",
        name: "Titre du service",
        sort: true,
        render: (row) => <span>{row.serviceSnapshot?.title || row.service?.title || "—"}</span>,
      },
      {
        key: "property",
        name: "Bien sélectionné",
        render: (row) => {
          const property = row.propertyId || row.property_id || row.property || {};
          const propertyId = property._id || property.id || property.propertyId || null;
          const propertyUrl = propertyId ? `/property/detail/${propertyId}` : null;
          const propertyImage = property.imageUrls?.[0]?.file || property.images?.[0]?.file || property.image || null;
          const propertyTitle = property.propertyTitle || property.title || property.name || "—";
          return (
            <div className="flex items-center gap-2">
              <a href={propertyUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded overflow-hidden bg-gray-100 shrink-0 block">
                {propertyImage ? (
                  <img src={propertyImage} alt={propertyTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
              </a>
              <div className="min-w-0">
                <a href={propertyUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline block text-[#111827]">
                  {propertyTitle}
                </a>
                <div className="text-xs text-gray-500">{property.city || property.zipcode || property.address || '—'}</div>
              </div>
            </div>
          );
        },
      },
      {
        key: "price",
        name: "Prix du service",
        sort: true,
        render: (row) => <span>{row.totalPriceTTC != null ? `${row.totalPriceTTC} €` : "—"}</span>,
      },
      {
        key: "createdAt",
        name: "Date de transaction",
        sort: true,
        render: (row) => <span>{row.createdAt ? new Date(row.createdAt).toLocaleDateString("fr-FR") : "—"}</span>,
      },
      {
        key: "status",
        name: "Statut",
        render: (row) => <Tag>{row.status}</Tag>,
      },
    ],
    []
  );

  const handleTableEvent = (payload) => {
    if (payload.event === "page") fetchOrders({ page: payload.value });
    if (payload.event === "count") fetchOrders({ count: payload.value, page: 1 });
    if (payload.event === "sort") {
      const nextOrder = filters.sortBy === payload.value && filters.order === "desc" ? "asc" : "desc";
      fetchOrders({ sortBy: payload.value, order: nextOrder, page: 1 });
    }
    if (payload.event === "row" && payload.row) {
      navigate(`/marketplace/transactions/${payload.row._id}`);
    }
  };

  const resetFilters = () => {
    const reset = {
      page: 1,
      count: 20,
      q: "",
      status: undefined,
      sortBy: "createdAt",
      order: "desc",
    };
    setFilters(reset);
    fetchOrders(reset);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-[#111827]">Transactions Marketplace</h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Liste de toutes les transactions réalisées sur la marketplace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.sortBy}
              onChange={(value) => fetchOrders({ sortBy: value, page: 1 })}
              options={SORT_OPTIONS}
              className="w-56"
              placeholder="Trier par"
            />
            <Select
              value={filters.order}
              onChange={(value) => fetchOrders({ order: value, page: 1 })}
              options={[{ value: "desc", label: "Descendant" }, { value: "asc", label: "Ascendant" }]}
              className="w-40"
              placeholder="Ordre"
            />
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-4 mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Rechercher référence, pro, client, service ou bien"
              allowClear
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              onPressEnter={(e) => fetchOrders({ q: e.target.value, page: 1 })}
            />
            <Select
              allowClear
              placeholder="Statut"
              value={filters.status}
              onChange={(value) => fetchOrders({ status: value, page: 1 })}
              options={STATUSES}
            />
            <Space>
              <Button type="primary" onClick={() => fetchOrders({ page: 1 })}>Rechercher</Button>
              <Button onClick={resetFilters}>Réinitialiser</Button>
            </Space>
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Spin /></div>
          ) : (
            <Table
              data={orders}
              columns={columns}
              total={total}
              count={filters.count}
              page={filters.page}
              result={handleTableEvent}
              sortKey={filters.sortBy}
              sorderfilter={filters.order}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MarketplaceTransactions;
