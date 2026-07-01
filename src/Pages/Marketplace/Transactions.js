import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Select, Button, Space, Spin, Tag } from "antd";
import Layout from "../../components/global/layout";
import Table from "../../components/Table";
import MarketplaceApi from "../../methods/api/marketplaceApi";
import methodModel from "../../methods/methods";

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

const STATUS_FR = {
  pending_payment:      { label: "Paiement en attente",   color: "bg-yellow-100 text-yellow-800" },
  paid:                 { label: "Payé",                  color: "bg-blue-100 text-blue-800" },
  payment_failed:       { label: "Échec paiement",        color: "bg-red-100 text-red-800" },
  accepted_by_pro:      { label: "Accepté par le pro",    color: "bg-indigo-100 text-indigo-800" },
  in_progress:          { label: "En cours",              color: "bg-blue-100 text-blue-700" },
  delivered_by_pro:     { label: "Livré",                 color: "bg-teal-100 text-teal-800" },
  cancellation_requested:{ label: "Annulation demandée", color: "bg-orange-100 text-orange-800" },
  confirmed_by_buyer:   { label: "Confirmé",             color: "bg-green-100 text-green-800" },
  litigation_opened:    { label: "Litige en cours",       color: "bg-red-100 text-red-700" },
  payout_released:      { label: "Pro payé",              color: "bg-green-100 text-green-700" },
  cancelled:            { label: "Annulé",                color: "bg-gray-100 text-gray-600" },
  refunded:             { label: "Remboursé",             color: "bg-gray-100 text-gray-500" },
};

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
        render: (row) => {
          const proId = row.proSnapshot?._id;
          const proName = row.proSnapshot?.fullName || row.proSnapshot?.companyName || row.proSnapshot?.name || "—";
          return proId
            ? <Link to={`/user/detail/${proId}`} className="text-purple-700 font-medium hover:underline">{proName}</Link>
            : <span>{proName}</span>;
        },
      },
      {
        key: "buyerName",
        name: "Nom du client",
        render: (row) => {
          const buyerId = row.buyer?._id;
          const buyerName = row.buyer?.name || row.buyer?.fullName || "—";
          return buyerId
            ? <Link to={`/user/detail/${buyerId}`} className="text-purple-700 font-medium hover:underline">{buyerName}</Link>
            : <span>{buyerName}</span>;
        },
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
          const property = row.property_id || row.propertyId || {};
          const propertyId = property._id || property.id || null;
          const propertyPath = propertyId ? `/property/detail/${propertyId}` : null;
          const imgFile = property.images?.[0]?.file || null;
          const propertyTitle = property.propertyTitle || property.title || "—";
          const subtitle = property.city || property.zipcode || property.address || null;
          return (
            <div className="flex items-center gap-2">
              {propertyPath ? (
                <Link to={propertyPath} className="w-10 h-10 rounded overflow-hidden bg-gray-100 shrink-0 block hover:opacity-80">
                  {imgFile ? (
                    <img src={methodModel.noImg(imgFile)} alt={propertyTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
                  )}
                </Link>
              ) : (
                <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center text-gray-400 text-xs">—</div>
              )}
              <div className="min-w-0">
                {propertyPath ? (
                  <Link to={propertyPath} className="text-sm font-medium hover:underline block text-[#111827]">{propertyTitle}</Link>
                ) : (
                  <span className="text-sm text-gray-400">{propertyTitle}</span>
                )}
                {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
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
      {
        key: "frontStatus",
        name: "Statut front",
        render: (row) => {
          const s = STATUS_FR[row.status];
          if (!s) return <span className="text-gray-400 text-xs">{row.status || "—"}</span>;
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
              {s.label}
            </span>
          );
        },
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
