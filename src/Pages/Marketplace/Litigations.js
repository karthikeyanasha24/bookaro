import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Button, Space, Spin, Tag } from "antd";
import Layout from "../../components/global/layout";
import Table from "../../components/Table";
import MarketplaceApi from "../../methods/api/marketplaceApi";

const STATUS_OPTIONS = [
  { value: "litigation_opened", label: "Ouvert" },
  { value: "payout_released", label: "Résolu (paiement libéré)" },
  { value: "refunded", label: "Résolu (remboursé)" },
];

const SORT_OPTIONS = [
  { value: "litigationOpenedAt", label: "Date litige" },
  { value: "createdAt", label: "Date de commande" },
  { value: "status", label: "Statut" },
  { value: "serviceSnapshot.title", label: "Titre du service" },
  { value: "proSnapshot.name", label: "Nom du pro" },
];

const statusLabel = (status) => {
  if (status === "litigation_opened") return "Ouvert";
  if (status === "payout_released") return "Résolu - Paiement libéré";
  if (status === "refunded") return "Résolu - Remboursé";
  return status || "—";
};

export default function MarketplaceLitigations() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    count: 20,
    q: "",
    status: undefined,
    sortBy: "litigationOpenedAt",
    order: "desc",
  });
  const [litigations, setLitigations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchLitigations = async (override = {}) => {
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

    const response = await MarketplaceApi.listLitigations(params);
    if (response.success) {
      setLitigations(response.data || []);
      setTotal(response.pagination?.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLitigations({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "reference",
        name: "Référence",
        sort: true,
        render: (row) => <span className="font-medium">{row._id || "—"}</span>,
      },
      {
        key: "litigationOpenedAt",
        name: "Date litige",
        sort: true,
        render: (row) => <span>{row.litigationOpenedAt ? new Date(row.litigationOpenedAt).toLocaleDateString("fr-FR") : "—"}</span>,
      },
      {
        key: "origin",
        name: "Origine",
        render: (row) => <span>{row.litigationInitiatedBy === "pro" ? "Pro" : "Client"}</span>,
      },
      {
        key: "transaction",
        name: "Transaction",
        render: (row) => (
          <Button type="link" onClick={(e) => { e.stopPropagation(); navigate(`/marketplace/transactions/${row._id}`); }}>
            {row._id || "Voir"}
          </Button>
        ),
      },
      {
        key: "counterparty",
        name: "Contrepartie",
        render: (row) => {
          if (row.litigationInitiatedBy === "pro") {
            return <span>{row.buyer?.name || "—"}</span>;
          }
          return <span>{row.proSnapshot?.name || "—"}</span>;
        },
      },
      {
        key: "status",
        name: "Statut du litige",
        sort: true,
        render: (row) => (
          <Tag color={row.status === "litigation_opened" ? "warning" : "success"}>
            {statusLabel(row.status)}
          </Tag>
        ),
      },
      {
        key: "serviceTitle",
        name: "Service",
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
        key: "proName",
        name: "Prestataire",
        sort: true,
        render: (row) => <span>{row.proSnapshot?.name || "—"}</span>,
      },
    ],
    [navigate]
  );

  const handleTableEvent = (payload) => {
    if (payload.event === "page") fetchLitigations({ page: payload.value });
    if (payload.event === "count") fetchLitigations({ count: payload.value, page: 1 });
    if (payload.event === "sort") {
      const nextOrder = filters.sortBy === payload.value && filters.order === "desc" ? "asc" : "desc";
      fetchLitigations({ sortBy: payload.value, order: nextOrder, page: 1 });
    }
    if (payload.event === "row" && payload.row) {
      navigate(`/marketplace/litigations/${payload.row._id}`);
    }
  };

  const resetFilters = () => {
    const reset = {
      page: 1,
      count: 20,
      q: "",
      status: undefined,
      sortBy: "litigationOpenedAt",
      order: "desc",
    };
    setFilters(reset);
    fetchLitigations(reset);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-[#111827]">Litiges Marketplace</h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Liste des litiges ouverts et résolus sur la marketplace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.sortBy}
              onChange={(value) => fetchLitigations({ sortBy: value, page: 1 })}
              options={SORT_OPTIONS}
              className="w-56"
              placeholder="Trier par"
            />
            <Select
              value={filters.order}
              onChange={(value) => fetchLitigations({ order: value, page: 1 })}
              options={[{ value: "desc", label: "Descendant" }, { value: "asc", label: "Ascendant" }]}
              className="w-40"
              placeholder="Ordre"
            />
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-4 mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Rechercher référence, service, prestataire ou bien"
              allowClear
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              onPressEnter={(e) => fetchLitigations({ q: e.target.value, page: 1 })}
            />
            <Select
              allowClear
              placeholder="Statut du litige"
              value={filters.status}
              onChange={(value) => fetchLitigations({ status: value, page: 1 })}
              options={STATUS_OPTIONS}
            />
            <Space>
              <Button type="primary" onClick={() => fetchLitigations({ page: 1 })}>Rechercher</Button>
              <Button onClick={resetFilters}>Réinitialiser</Button>
            </Space>
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Spin /></div>
          ) : (
            <Table
              data={litigations}
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
}
