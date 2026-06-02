import { useEffect, useMemo, useState } from "react";
import { Input, Button, Select, Space, Spin, Tag } from "antd";
import Layout from "../../components/global/layout";
import Table from "../../components/Table";
import MarketplaceApi from "../../methods/api/marketplaceApi";

const SERVICE_STATUSES = [
  { value: "active", label: "Actif" },
  { value: "draft", label: "Brouillon" },
  { value: "inactive", label: "Inactif" },
  { value: "deleted", label: "Supprimé" },
];

const PRO_ROLES = [
  { value: "agency", label: "Agence" },
  { value: "agent", label: "Agent" },
  { value: "hunter", label: "Chasseur" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date de création" },
  { value: "title", label: "Titre du service" },
  { value: "category", label: "Type de service" },
  { value: "priceTTC", label: "Prix TTC" },
  { value: "saleCount", label: "Nombre de vente" },
];

const MarketplaceOfferedServices = () => {
  const [filters, setFilters] = useState({
    page: 1,
    count: 20,
    q: "",
    status: undefined,
    categoryId: undefined,
    proRole: undefined,
    city: "",
    sortBy: "createdAt",
    order: "desc",
  });
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const loadCategories = async () => {
    try {
      const response = await MarketplaceApi.listCategories();
      if (response.success) {
        const leaves = (response.data || []).filter((category) => category.parentCategory);
        setCategories(leaves);
      }
    } catch (e) {
      console.warn("Impossible de charger les catégories", e);
    }
  };

  const fetchServices = async (override = {}) => {
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
    if (next.categoryId) params.categoryId = next.categoryId;
    if (next.proRole) params.proRole = next.proRole;
    if (next.city) params.city = next.city;

    const response = await MarketplaceApi.listServices(params);
    if (response.success) {
      const data = response.data || [];
      setServices(data);
      setTotal(response.pagination?.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices({ page: 1 });
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "title",
        name: "Titre du service",
        sort: true,
        render: (row) => <span>{row.title || "—"}</span>,
      },
      {
        key: "category",
        name: "Type de service",
        sort: true,
        render: (row) => <span>{row.category?.name || "—"}</span>,
      },
      {
        key: "priceTTC",
        name: "Prix TTC",
        sort: true,
        render: (row) => <span>{row.priceTTC != null ? `${row.priceTTC} €` : "—"}</span>,
      },
      {
        key: "createdAt",
        name: "Date de création",
        sort: true,
        render: (row) => <span>{row.createdAt ? new Date(row.createdAt).toLocaleDateString("fr-FR") : "—"}</span>,
      },
      {
        key: "saleCount",
        name: "Nombre de vente",
        sort: true,
        render: (row) => <span>{row.saleCount ?? 0}</span>,
      },
      {
        key: "proName",
        name: "Nom du pro",
        render: (row) => <span>{row.pro?.name || row.pro?.firstName || "—"}</span>,
      },
      {
        key: "proCity",
        name: "Ville du pro",
        render: (row) => <span>{row.pro?.city || row.city || "—"}</span>,
      },
      {
        key: "proRole",
        name: "Role du pro",
        render: (row) => <Tag>{row.pro?.role || "—"}</Tag>,
      },
    ],
    []
  );

  const handleTableEvent = (payload) => {
    const { event, value } = payload;
    if (event === "page") fetchServices({ page: value });
    if (event === "count") fetchServices({ count: value, page: 1 });
    if (event === "sort") {
      const nextOrder = filters.sortBy === value && filters.order === "desc" ? "asc" : "desc";
      fetchServices({ sortBy: value, order: nextOrder, page: 1 });
    }
  };

  const resetFilters = () => {
    const reset = {
      page: 1,
      count: 20,
      q: "",
      status: undefined,
      categoryId: undefined,
      proRole: undefined,
      city: "",
      sortBy: "createdAt",
      order: "desc",
    };
    setFilters(reset);
    fetchServices(reset);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-[#111827]">Services proposés</h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Liste des services publiés par les professionnels avec recherche, filtres et tri.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Select
              value={filters.sortBy}
              onChange={(value) => fetchServices({ sortBy: value, page: 1 })}
              options={SORT_OPTIONS}
              className="w-52"
              placeholder="Trier par"
            />
            <Select
              value={filters.order}
              onChange={(value) => fetchServices({ order: value, page: 1 })}
              options={[{ value: 'desc', label: 'Descendant' }, { value: 'asc', label: 'Ascendant' }]}
              className="w-40"
              placeholder="Ordre"
            />
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-4 mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Rechercher par titre, pro ou contenu"
              allowClear
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              onPressEnter={(e) => fetchServices({ q: e.target.value, page: 1 })}
            />
            <Select
              allowClear
              placeholder="Status"
              value={filters.status}
              onChange={(value) => fetchServices({ status: value, page: 1 })}
              options={SERVICE_STATUSES}
            />
            <Select
              allowClear
              placeholder="Type de service"
              value={filters.categoryId}
              onChange={(value) => fetchServices({ categoryId: value, page: 1 })}
              options={categories.map((category) => ({ value: category._id, label: category.name }))}
            />
            <Select
              allowClear
              placeholder="Role du pro"
              value={filters.proRole}
              onChange={(value) => fetchServices({ proRole: value, page: 1 })}
              options={PRO_ROLES}
            />
            <Input
              placeholder="Ville"
              allowClear
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              onPressEnter={(e) => fetchServices({ city: e.target.value, page: 1 })}
            />
            <Space>
              <Button type="primary" onClick={() => fetchServices({ page: 1 })}>Appliquer</Button>
              <Button onClick={resetFilters}>Réinitialiser</Button>
            </Space>
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Spin /></div>
          ) : (
            <Table
              data={services}
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

export default MarketplaceOfferedServices;
