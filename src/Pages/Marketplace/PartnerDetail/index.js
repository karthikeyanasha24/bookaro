import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar, Button, Tabs, Tag, Spin, Space, Input, InputNumber, Checkbox,
  Modal, message, Image, Empty, Select, Rate,
} from "antd";
import { FiArrowLeft, FiEdit2, FiExternalLink } from "react-icons/fi";
import Layout from "../../../components/global/layout";
import Table from "../../../components/Table";
import MarketplaceApi from "../../../methods/api/marketplaceApi";

const ROLE_LABELS = { agency: "Agence", agent: "Agent", hunter: "Chasseur" };
const roleLabel = (r) => ROLE_LABELS[r] || r || "—";

const formatPrice = (v) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(v || 0));
const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");
const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—";

function PartnerAvatar({ image, initials, size = 72 }) {
  if (image) return <Avatar src={image} size={size} />;
  return (
    <Avatar size={size} style={{ backgroundColor: "#7C3AED", color: "#fff", fontWeight: 600, fontSize: size / 2.5 }}>
      {initials || "?"}
    </Avatar>
  );
}

// ─── Onglet Bio ──────────────────────────────────────────────────────────
function BioTab({ partner, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    featuredSubheading: "", featuredTitle: "", featuredBio: "",
    featuredExperienceYears: 0, featuredClientsAccompanied: 0,
    featuredRatingNotes: "", featuredSatisfactionRate: "",
    featuredProfilePhoto: "",
  });

  useEffect(() => {
    if (!partner) return;
    setForm({
      featuredSubheading: partner.featured?.subheading || "",
      featuredTitle: partner.featured?.title || "",
      featuredBio: partner.featured?.bio || "",
      featuredExperienceYears: partner.featured?.experienceYears || 0,
      featuredClientsAccompanied: partner.featured?.clientsAccompanied || 0,
      featuredRatingNotes: partner.featured?.ratingNotes || "",
      featuredSatisfactionRate: partner.featured?.satisfactionRate || "",
      featuredProfilePhoto: partner.featured?.profilePhoto || "",
    });
  }, [partner]);

  const save = async () => {
    setSaving(true);
    const res = await MarketplaceApi.updatePartnerBio(partner.id, form);
    setSaving(false);
    if (res.success) {
      message.success("Bio mise à jour.");
      setEditing(false);
      onSaved?.();
    } else {
      message.error(res.error?.message || "Échec de la mise à jour.");
    }
  };

  if (!editing) {
    const f = partner.featured || {};
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button icon={<FiEdit2 />} onClick={() => setEditing(true)}>Modifier</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Sous-titre" value={f.subheading} />
          <Field label="Titre" value={f.title} />
          <Field label="Années d'expérience" value={f.experienceYears} />
          <Field label="Clients accompagnés" value={f.clientsAccompanied} />
          <Field label="Notes / évaluations" value={f.ratingNotes} />
          <Field label="Taux de satisfaction" value={f.satisfactionRate} />
          <Field label="Photo profil (URL)" value={f.profilePhoto} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Bio</p>
          <p className="whitespace-pre-line">{f.bio || "—"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <LabeledInput label="Sous-titre" value={form.featuredSubheading}
          onChange={(v) => setForm({ ...form, featuredSubheading: v })} />
        <LabeledInput label="Titre" value={form.featuredTitle}
          onChange={(v) => setForm({ ...form, featuredTitle: v })} />
        <LabeledNumber label="Années d'expérience" value={form.featuredExperienceYears}
          onChange={(v) => setForm({ ...form, featuredExperienceYears: v })} />
        <LabeledNumber label="Clients accompagnés" value={form.featuredClientsAccompanied}
          onChange={(v) => setForm({ ...form, featuredClientsAccompanied: v })} />
        <LabeledInput label="Notes / évaluations" value={form.featuredRatingNotes}
          onChange={(v) => setForm({ ...form, featuredRatingNotes: v })} />
        <LabeledInput label="Taux de satisfaction" value={form.featuredSatisfactionRate}
          onChange={(v) => setForm({ ...form, featuredSatisfactionRate: v })} />
        <LabeledInput label="Photo profil (URL)" value={form.featuredProfilePhoto}
          onChange={(v) => setForm({ ...form, featuredProfilePhoto: v })} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">Bio</p>
        <Input.TextArea rows={5} value={form.featuredBio}
          onChange={(e) => setForm({ ...form, featuredBio: e.target.value })} />
      </div>
      <Space>
        <Button type="primary" loading={saving} onClick={save}>Enregistrer</Button>
        <Button onClick={() => setEditing(false)}>Annuler</Button>
      </Space>
    </div>
  );
}

const Field = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p>{value || value === 0 ? value : "—"}</p>
  </div>
);
const LabeledInput = ({ label, value, onChange }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);
const LabeledNumber = ({ label, value, onChange }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <InputNumber value={value} onChange={onChange} min={0} className="w-full" />
  </div>
);

// ─── Onglet Transactions ─────────────────────────────────────────────────
const ORDER_STATUSES = [
  "pending_payment", "paid", "payment_failed", "accepted_by_pro", "in_progress",
  "delivered_by_pro", "cancellation_requested", "confirmed_by_buyer",
  "litigation_opened", "payout_released", "cancelled", "refunded",
];

function TransactionsTab({ partnerId, revenueTTC }) {
  const [filters, setFilters] = useState({
    page: 1, count: 10, status: [], sortBy: "paidAt", order: "desc",
  });
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (override = {}) => {
    setLoading(true);
    const next = { ...filters, ...override };
    setFilters(next);
    const params = { page: next.page, count: next.count, sortBy: next.sortBy, order: next.order };
    if (next.status?.length) params.status = next.status.join(",");
    const res = await MarketplaceApi.getPartnerTransactions(partnerId, params);
    if (res.success) {
      setRows(res.data || []);
      setTotal(res.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  const columns = [
    { key: "serviceTitle", name: "Service", render: (r) => r.serviceTitle },
    { key: "buyerName", name: "Acheteur", render: (r) => r.buyerName },
    { key: "status", name: "Statut", render: (r) => <Tag>{r.status}</Tag> },
    { key: "quantity", name: "Qté", render: (r) => r.quantity },
    { key: "totalPriceTTC", name: "Montant TTC", sort: true, render: (r) => formatPrice(r.totalPriceTTC) },
    { key: "commissionHT", name: "Commission HT", render: (r) => formatPrice(r.commissionHT) },
    { key: "paidAt", name: "Payée le", sort: true, render: (r) => formatDateTime(r.paidAt) },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Chiffre d'affaires cumulé (TTC)</p>
          <p className="text-2xl font-semibold text-[#7C3AED]">{formatPrice(revenueTTC)}</p>
        </div>
        <p className="text-sm text-gray-500">{total} transaction(s)</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Select
          mode="multiple" allowClear placeholder="Statut" style={{ minWidth: 240 }}
          value={filters.status}
          onChange={(v) => load({ status: v, page: 1 })}
          options={ORDER_STATUSES.map((s) => ({ value: s, label: s }))}
        />
      </div>

      {loading ? <div className="flex justify-center py-10"><Spin /></div> : (
        <Table
          data={rows} columns={columns} total={total}
          count={filters.count} page={filters.page}
          result={(p) => {
            if (p.event === "page") load({ page: p.value });
            else if (p.event === "count") load({ count: p.value, page: 1 });
            else if (p.event === "sort") load({ sortBy: p.value, order: p.dir || "asc", page: 1 });
          }}
          sortKey={filters.sortBy}
          sorderfilter={filters.order}
        />
      )}
    </div>
  );
}

// ─── Onglet Biens immo ───────────────────────────────────────────────────
const PROPERTY_TYPES = [
  { value: "sale", label: "Vente" },
  { value: "rent", label: "Location" },
  { value: "offmarket", label: "Off market" },
  { value: "directory", label: "Annuaire" },
];

function PropertiesTab({ partnerId }) {
  const [filters, setFilters] = useState({ page: 1, count: 12, propertyType: [], q: "" });
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (override = {}) => {
    setLoading(true);
    const next = { ...filters, ...override };
    setFilters(next);
    const params = { page: next.page, count: next.count };
    if (next.propertyType?.length) params.propertyType = next.propertyType.join(",");
    if (next.q) params.q = next.q;
    const res = await MarketplaceApi.getPartnerProperties(partnerId, params);
    if (res.success) {
      setItems(res.data || []);
      setTotal(res.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Select
          mode="multiple" allowClear placeholder="Type de bien" style={{ minWidth: 240 }}
          value={filters.propertyType}
          onChange={(v) => load({ propertyType: v, page: 1 })}
          options={PROPERTY_TYPES}
        />
        <Input
          placeholder="Recherche (titre / ville / adresse)" allowClear style={{ maxWidth: 320 }}
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          onPressEnter={(e) => load({ q: e.target.value, page: 1 })}
        />
        <span className="text-sm text-gray-500">{total} bien(s)</span>
      </div>

      {loading ? <div className="flex justify-center py-10"><Spin /></div>
        : items.length === 0 ? <Empty description="Aucun bien" />
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => window.open(p.publicUrl, "_blank", "noopener,noreferrer")}
                className="text-left bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">Sans visuel</span>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <FiExternalLink className="text-gray-400 shrink-0 mt-1" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Tag color="blue">{p.propertyType}</Tag>
                    {p.offMarket && <Tag color="volcano">Off-market</Tag>}
                  </div>
                  <p className="text-xs text-gray-500">
                    {p.city || "—"}{p.surface ? ` · ${p.surface} m²` : ""}{p.rooms ? ` · ${p.rooms} pièces` : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

      {total > filters.count && (
        <div className="flex justify-center gap-2">
          <Button disabled={filters.page === 1} onClick={() => load({ page: filters.page - 1 })}>Préc.</Button>
          <span className="self-center text-sm">Page {filters.page} / {Math.ceil(total / filters.count)}</span>
          <Button disabled={filters.page * filters.count >= total} onClick={() => load({ page: filters.page + 1 })}>Suiv.</Button>
        </div>
      )}
    </div>
  );
}

// ─── Onglet Services ─────────────────────────────────────────────────────
function ServicesTab({ partnerId }) {
  const [filters, setFilters] = useState({ page: 1, count: 10, status: [] });
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (override = {}) => {
    setLoading(true);
    const next = { ...filters, ...override };
    setFilters(next);
    const params = { page: next.page, count: next.count };
    if (next.status?.length) params.status = next.status.join(",");
    const res = await MarketplaceApi.getPartnerServices(partnerId, params);
    if (res.success) { setRows(res.data || []); setTotal(res.total || 0); }
    setLoading(false);
  };

  useEffect(() => {
    load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  const columns = [
    { key: "title", name: "Service", render: (r) => r.title },
    { key: "category", name: "Catégorie", render: (r) => r.category?.name || "—" },
    { key: "city", name: "Ville", render: (r) => r.city || "—" },
    { key: "modality", name: "Modalité", render: (r) => r.modality || "—" },
    { key: "priceTTC", name: "Prix TTC", render: (r) => formatPrice(r.priceTTC) },
    { key: "status", name: "Statut", render: (r) => <Tag color={r.status === "active" ? "green" : "default"}>{r.status}</Tag> },
    { key: "isFeatured", name: "Mis en avant", render: (r) => r.isFeatured ? <Tag color="gold">Oui</Tag> : "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Select
          mode="multiple" allowClear placeholder="Statut" style={{ minWidth: 220 }}
          value={filters.status}
          onChange={(v) => load({ status: v, page: 1 })}
          options={["draft", "active", "inactive"].map((s) => ({ value: s, label: s }))}
        />
        <span className="text-sm text-gray-500">{total} service(s)</span>
      </div>
      {loading ? <div className="flex justify-center py-10"><Spin /></div> : (
        <Table
          data={rows} columns={columns} total={total}
          count={filters.count} page={filters.page}
          result={(p) => {
            if (p.event === "page") load({ page: p.value });
            else if (p.event === "count") load({ count: p.value, page: 1 });
          }}
        />
      )}
    </div>
  );
}

// ─── Onglet Partenaire (drapeaux) ────────────────────────────────────────
function PartnerFlagsTab({ partner, onSaved }) {
  const [flags, setFlags] = useState({
    isGlobalFavorite: false,
    isLocalFavorite: false,
    isTopAgent: false,
    localFavoritePostalCodes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!partner) return;
    setFlags({
      isGlobalFavorite: !!partner.isGlobalFavorite,
      isLocalFavorite: !!partner.isLocalFavorite,
      isTopAgent: !!partner.isTopAgent,
      localFavoritePostalCodes: (partner.localFavoritePostalCodes || []).join(", "),
    });
  }, [partner]);

  const save = async () => {
    const codes = flags.localFavoritePostalCodes.split(",").map((c) => c.trim()).filter(Boolean);
    if (flags.isLocalFavorite && codes.length === 0) {
      return message.error("Le favori local nécessite au moins un code postal.");
    }
    setSaving(true);
    const res = await MarketplaceApi.updatePartnerFlagsV2(partner.id, {
      isGlobalFavorite: flags.isGlobalFavorite,
      isLocalFavorite: flags.isLocalFavorite,
      isTopAgent: flags.isTopAgent,
      localFavoritePostalCodes: codes,
    });
    setSaving(false);
    if (res.success) {
      message.success("Drapeaux mis à jour.");
      onSaved?.();
    } else {
      message.error(res.message || res.error?.message || "Échec de la mise à jour.");
    }
  };

  return (
    <div className="space-y-4 max-w-xl">
      <div className="space-y-3">
        <Checkbox
          checked={flags.isGlobalFavorite}
          onChange={(e) => setFlags({ ...flags, isGlobalFavorite: e.target.checked })}
        >
          Partenaire global (max 2 sur la plateforme)
        </Checkbox>
        <Checkbox
          checked={flags.isLocalFavorite}
          onChange={(e) => setFlags({ ...flags, isLocalFavorite: e.target.checked })}
        >
          Partenaire local (max 2 par code postal)
        </Checkbox>
        <Checkbox
          checked={flags.isTopAgent}
          onChange={(e) => setFlags({ ...flags, isTopAgent: e.target.checked })}
        >
          Top {roleLabel(partner?.role)}
        </Checkbox>
      </div>
      {flags.isLocalFavorite && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Codes postaux (séparés par virgule)</p>
          <Input
            value={flags.localFavoritePostalCodes}
            onChange={(e) => setFlags({ ...flags, localFavoritePostalCodes: e.target.value })}
            placeholder="Ex: 75001, 75002"
          />
        </div>
      )}
      {partner?.partnerAssignedAt && (
        <p className="text-xs text-gray-500">Assigné le {formatDateTime(partner.partnerAssignedAt)}</p>
      )}
      <Button type="primary" loading={saving} onClick={save}>Enregistrer</Button>
    </div>
  );
}

// ─── Onglet Évaluations ──────────────────────────────────────────────────
function ReviewsTab({ partnerId }) {
  const [filters, setFilters] = useState({ page: 1, count: 10 });
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (override = {}) => {
    setLoading(true);
    const next = { ...filters, ...override };
    setFilters(next);
    const res = await MarketplaceApi.getPartnerReviews(partnerId, { page: next.page, count: next.count });
    if (res.success) {
      setRows(res.data || []);
      setTotal(res.total || 0);
      setAvg(res.averageRating || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-center gap-4">
        <Rate disabled allowHalf value={avg} />
        <div>
          <p className="text-xl font-semibold">{avg ? avg.toFixed(1) : "—"}</p>
          <p className="text-sm text-gray-500">{total} avis</p>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-10"><Spin /></div>
        : rows.length === 0 ? <Empty description="Aucun avis" />
        : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Rate disabled value={r.rating} />
                    <span className="font-medium">{r.buyerName}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{r.comment || <em className="text-gray-400">Pas de commentaire</em>}</p>
                <p className="mt-1 text-xs text-gray-500">Service : {r.serviceTitle}</p>
              </div>
            ))}
          </div>
        )}

      {total > filters.count && (
        <div className="flex justify-center gap-2">
          <Button disabled={filters.page === 1} onClick={() => load({ page: filters.page - 1 })}>Préc.</Button>
          <span className="self-center text-sm">Page {filters.page} / {Math.ceil(total / filters.count)}</span>
          <Button disabled={filters.page * filters.count >= total} onClick={() => load({ page: filters.page + 1 })}>Suiv.</Button>
        </div>
      )}
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────
const PartnerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transactions");

  const loadPartner = async () => {
    setLoading(true);
    const res = await MarketplaceApi.getPartnerDetail(id);
    if (res.success) {
      setPartner(res.data);
      // Bio par défaut si global ou local
      if (res.data?.isGlobalFavorite || res.data?.isLocalFavorite) {
        setActiveTab((cur) => cur === "transactions" ? "bio" : cur);
      }
    } else {
      message.error(res.message || "Partenaire introuvable");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPartner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const tabs = useMemo(() => {
    if (!partner) return [];
    const list = [];
    const showBio = partner.isGlobalFavorite || partner.isLocalFavorite;
    if (showBio) {
      list.push({ key: "bio", label: "Bio", children: <BioTab partner={partner} onSaved={loadPartner} /> });
    }
    list.push({
      key: "transactions",
      label: "Chiffre d'affaires & Transactions",
      children: <TransactionsTab partnerId={partner.id} revenueTTC={partner.kpis?.revenueTTC || 0} />,
    });
    list.push({ key: "properties", label: "Biens immo", children: <PropertiesTab partnerId={partner.id} /> });
    list.push({ key: "services", label: "Services à la carte", children: <ServicesTab partnerId={partner.id} /> });
    list.push({ key: "partner", label: "Partenaire", children: <PartnerFlagsTab partner={partner} onSaved={loadPartner} /> });
    list.push({ key: "reviews", label: "Notation / Évaluations", children: <ReviewsTab partnerId={partner.id} /> });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner]);

  return (
    <Layout>
      <div className="p-6">
        <Button type="text" icon={<FiArrowLeft />} onClick={() => navigate("/marketplace/partners")} className="mb-4">
          Retour à la liste
        </Button>

        {loading || !partner ? (
          <div className="flex justify-center py-20"><Spin /></div>
        ) : (
          <>
            {/* En-tête */}
            <div className="bg-white shadow-box rounded-lg p-6 mb-4">
              <div className="flex items-start gap-4 flex-wrap">
                <PartnerAvatar image={partner.image} initials={partner.initials} size={80} />
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-semibold m-0">{partner.fullName}</h2>
                    <Tag>{roleLabel(partner.role)}</Tag>
                    {partner.isGlobalFavorite && <Tag color="purple">Partenaire global</Tag>}
                    {partner.isLocalFavorite && <Tag color="geekblue">Partenaire local</Tag>}
                    {partner.isTopAgent && <Tag color="gold">Top {roleLabel(partner.role)}</Tag>}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {partner.companyName && <span>{partner.companyName} · </span>}
                    {partner.city || "—"} · Depuis {formatDate(partner.createdAt)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {partner.email}{partner.mobileNo ? ` · +${partner.mobileNo}` : ""}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <Kpi label="Services" value={partner.kpis?.serviceCount ?? 0} />
                  <Kpi label="Transactions" value={partner.kpis?.transactionCount ?? 0} />
                  <Kpi label="CA TTC" value={formatPrice(partner.kpis?.revenueTTC)} />
                  <Kpi label="Note moyenne" value={partner.kpis?.averageRating ? `${partner.kpis.averageRating} ★` : "—"} />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-box rounded-lg p-6">
              <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const Kpi = ({ label, value }) => (
  <div className="px-3 py-2 rounded-lg bg-gray-50 min-w-[100px]">
    <p className="text-xs text-gray-500 m-0">{label}</p>
    <p className="text-lg font-semibold m-0">{value}</p>
  </div>
);

export default PartnerDetail;
