import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Select, Tag, Space, Spin, Avatar, Checkbox } from "antd";
import { FiSearch } from "react-icons/fi";
import Layout from "../../components/global/layout";
import Table from "../../components/Table";
import MarketplaceApi from "../../methods/api/marketplaceApi";

const ROLE_LABELS = {
  agency: "Agence",
  agent: "Agent",
  hunter: "Chasseur",
};

const STATUS_OPTIONS = [
  { value: "global", label: "Partenaire global" },
  { value: "local", label: "Partenaire local" },
  { value: "top", label: "Top" },
];

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

function roleLabel(role) {
  return ROLE_LABELS[role] || role || "—";
}

function formatPrice(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR");
}

function PartnerAvatar({ image, initials }) {
  if (image) return <Avatar src={image} size={36} />;
  return (
    <Avatar size={36} style={{ backgroundColor: "#7C3AED", color: "#fff", fontWeight: 600 }}>
      {initials || "?"}
    </Avatar>
  );
}

function StatusBadges({ row }) {
  return (
    <Space size={4} wrap>
      {row.isGlobalFavorite && <Tag color="purple">Partenaire global</Tag>}
      {row.isLocalFavorite && (
        <Tag color="geekblue">
          Partenaire local
          {row.localFavoritePostalCodes?.length
            ? ` (${row.localFavoritePostalCodes.join(", ")})`
            : ""}
        </Tag>
      )}
      {row.isTopAgent && <Tag color="gold">Top {roleLabel(row.role)}</Tag>}
      {!row.isGlobalFavorite && !row.isLocalFavorite && !row.isTopAgent && (
        <span className="text-gray-400">—</span>
      )}
    </Space>
  );
}

const MarketplacePartners = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    count: 10,
    search: "",
    role: [],
    partnerStatus: [],
    city: "",
    categoryId: undefined,
    hasService: false,
    sortBy: "createdAt",
    order: "desc",
  });
  const [partners, setPartners] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchPartners = async (override = {}) => {
    setLoading(true);
    const next = { ...filters, ...override };
    setFilters(next);
    const params = {
      page: next.page,
      count: next.count,
      sortBy: next.sortBy,
      order: next.order,
    };
    if (next.search) params.search = next.search;
    if (next.role?.length) params.role = next.role.join(",");
    if (next.partnerStatus?.length) params.partnerStatus = next.partnerStatus.join(",");
    if (next.city) params.city = next.city;
    if (next.categoryId) params.categoryId = next.categoryId;
    if (next.hasService) params.hasService = true;

    const response = await MarketplaceApi.listPartners(params);
    if (response.success) {
      setPartners(response.data || []);
      setTotal(response.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners({ page: 1 });
    (async () => {
      const response = await MarketplaceApi.listCategories();
      if (response.success) {
        const leaves = (response.data || []).filter((c) => c.parentCategory);
        setCategories(leaves);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableEvent = (payload) => {
    if (payload.event === "page") fetchPartners({ page: payload.value });
    else if (payload.event === "count") fetchPartners({ count: payload.value, page: 1 });
    else if (payload.event === "sort") {
      fetchPartners({ sortBy: payload.value, order: payload.dir || "asc", page: 1 });
    } else if (payload.event === "row" && payload.row) {
      navigate(`/marketplace/partners/${payload.row.id}`);
    }
  };

  const resetFilters = () => {
    const reset = {
      page: 1,
      count: 10,
      search: "",
      role: [],
      partnerStatus: [],
      city: "",
      categoryId: undefined,
      hasService: false,
      sortBy: "createdAt",
      order: "desc",
    };
    setFilters(reset);
    fetchPartners(reset);
  };

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        name: "Nom prénom",
        sort: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <PartnerAvatar image={row.image} initials={row.initials} />
            <div>
              <div className="font-medium text-[#111827]">{row.fullName || "—"}</div>
              {row.companyName && (
                <div className="text-xs text-gray-500">{row.companyName}</div>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "role",
        name: "Type",
        sort: true,
        render: (row) => <Tag>{roleLabel(row.role)}</Tag>,
      },
      {
        key: "city",
        name: "Ville",
        sort: true,
        render: (row) => <span>{row.city || "—"}</span>,
      },
      {
        key: "partnerStatus",
        name: "Statut",
        render: (row) => <StatusBadges row={row} />,
      },
      {
        key: "createdAt",
        name: "Depuis",
        sort: true,
        render: (row) => <span>{formatDate(row.createdAt)}</span>,
      },
      {
        key: "serviceCount",
        name: "Nb services",
        sort: true,
        render: (row) => <span>{row.serviceCount}</span>,
      },
      {
        key: "revenueTTC",
        name: "Chiffre d'affaires",
        sort: true,
        render: (row) => <span>{formatPrice(row.revenueTTC)}</span>,
      },
    ],
    []
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-[#111827]">Partenaires Marketplace</h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Liste des Pros disposant d'au moins un service à la carte (actif ou non).
            </p>
          </div>
        </div>

        <div className="shadow-box w-full bg-white rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              prefix={<FiSearch />}
              placeholder="Rechercher (nom, société, email)"
              allowClear
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onPressEnter={(e) => fetchPartners({ search: e.target.value, page: 1 })}
            />
            <Select
              mode="multiple"
              allowClear
              placeholder="Type (Agence / Agent / Chasseur)"
              value={filters.role}
              onChange={(v) => fetchPartners({ role: v, page: 1 })}
              options={ROLE_OPTIONS}
            />
            <Select
              mode="multiple"
              allowClear
              placeholder="Statut partenaire"
              value={filters.partnerStatus}
              onChange={(v) => fetchPartners({ partnerStatus: v, page: 1 })}
              options={STATUS_OPTIONS}
            />
            <Select
              allowClear
              showSearch
              placeholder="Type de service"
              value={filters.categoryId}
              onChange={(v) => fetchPartners({ categoryId: v, page: 1 })}
              optionFilterProp="label"
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
            />
            <Input
              placeholder="Ville"
              allowClear
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              onPressEnter={(e) => fetchPartners({ city: e.target.value, page: 1 })}
            />
            <div className="flex items-center">
              <Checkbox
                checked={filters.hasService}
                onChange={(e) => fetchPartners({ hasService: e.target.checked, page: 1 })}
              >
                Service créé
              </Checkbox>
            </div>
            <div className="flex gap-2">
              <Button type="primary" onClick={() => fetchPartners({ page: 1 })}>
                Appliquer
              </Button>
              <Button onClick={resetFilters}>Réinitialiser</Button>
            </div>
          </div>
        </div>

        <div className="shadow-box w-full bg-white rounded-lg p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spin />
            </div>
          ) : (
            <Table
              data={partners}
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

export default MarketplacePartners;
