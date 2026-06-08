import { useEffect, useMemo, useState, useCallback } from "react";
import { Input, Button, Select, Space, Spin, Tag, Popconfirm, message, Tabs, Checkbox, Switch, Tooltip } from "antd";
import Layout from "../../components/global/layout";
import Table from "../../components/Table";
import MarketplaceApi from "../../methods/api/marketplaceApi";
import CreateServiceModal from "../../components/Marketplace/CreateServiceModal";
import ServiceDetailModal from "../../components/Marketplace/ServiceDetailModal";

const SERVICE_STATUSES = [
  { value: "active", label: "Actif" },
  { value: "pending_validation", label: "Attente validation" },
  { value: "draft", label: "Brouillon" },
  { value: "inactive", label: "Inactif" },
  { value: "deleted", label: "Supprimé" },
];

const STATUS_COLOR = {
  active: "green",
  pending_validation: "gold",
  draft: "blue",
  inactive: "orange",
  deleted: "red",
};
const STATUS_LABEL = {
  active: "Actif",
  pending_validation: "Attente validation",
  draft: "Brouillon",
  inactive: "Inactif",
  deleted: "Supprimé",
};

const PRO_ROLES = [
  { value: "agency", label: "Agence" },
  { value: "agent", label: "Agent" },
  { value: "hunter", label: "Chasseur" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date de création" },
  { value: "title", label: "Titre du service" },
  { value: "priceTTC", label: "Prix TTC" },
  { value: "saleCount", label: "Nombre de vente" },
];

// ─── Onglet "Services validés" ────────────────────────────────────────────────
function ValidatedTab({ categories }) {
  const [filters, setFilters] = useState({
    page: 1, count: 20, q: "", status: undefined,
    categoryId: undefined, proRole: undefined, city: "",
    sortBy: "createdAt", order: "desc",
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [editService, setEditService] = useState(null);
  const [viewService, setViewService] = useState(null);

  const fetchServices = useCallback(async (override = {}) => {
    setLoading(true);
    const next = { ...filters, ...override };
    setFilters(next);
    const params = { page: next.page, limit: next.count, sortBy: next.sortBy, order: next.order };
    if (next.q) params.q = next.q;
    if (next.status) params.status = next.status;
    if (next.categoryId) params.categoryId = next.categoryId;
    if (next.proRole) params.proRole = next.proRole;
    if (next.city) params.city = next.city;
    const response = await MarketplaceApi.listServices(params);
    if (response.success) {
      setServices(response.data || []);
      setTotal(response.pagination?.total || 0);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchServices({ page: 1 }); }, [fetchServices]);

  const handleValidate = async (row) => {
    try { await MarketplaceApi.validateService(row._id); message.success("Service activé"); fetchServices({ page: filters.page }); }
    catch (e) { message.error("Impossible d'activer"); }
  };
  const handleDeactivate = async (row) => {
    try { await MarketplaceApi.rejectService(row._id); message.success("Service désactivé"); fetchServices({ page: filters.page }); }
    catch (e) { message.error("Impossible de désactiver"); }
  };
  const handleDelete = async (row) => {
    try { await MarketplaceApi.deleteService(row._id); message.success("Service supprimé"); fetchServices({ page: filters.page }); }
    catch (e) { message.error("Impossible de supprimer"); }
  };
  const handleEdit = async (row) => {
    try {
      const resp = await MarketplaceApi.getServiceDetail(row._id);
      const svc = Array.isArray(resp.data) ? resp.data[0] : resp.data;
      if (svc) setEditService(svc); else message.error("Service introuvable");
    } catch (e) { message.error("Impossible de charger le service"); }
  };

  const columns = useMemo(() => [
    {
      key: "status", name: "Statut",
      render: (row) => <Tag color={STATUS_COLOR[row.status] || "default"}>{STATUS_LABEL[row.status] || row.status}</Tag>,
    },
    {
      key: "actions", name: "Actions",
      render: (row) => (
        <Space>
          {row.status !== "active" && <Button size="small" type="primary" onClick={async (e) => { e.stopPropagation(); await handleValidate(row); }}>Activer</Button>}
          {row.status === "active" && <Button size="small" onClick={async (e) => { e.stopPropagation(); await handleDeactivate(row); }}>Désactiver</Button>}
          <Button size="small" onClick={async (e) => { e.stopPropagation(); const r = await MarketplaceApi.getServiceDetail(row._id); const s = Array.isArray(r.data) ? r.data[0] : r.data; if (s) setViewService(s); }}>Voir</Button>
          <Button size="small" onClick={async (e) => { e.stopPropagation(); await handleEdit(row); }}>Modifier</Button>
          <Popconfirm title="Supprimer définitivement ?" onConfirm={() => handleDelete(row)} okText="Supprimer" cancelText="Annuler">
            <Button size="small" danger onClick={(e) => e.stopPropagation()}>Supprimer</Button>
          </Popconfirm>
        </Space>
      ),
    },
    { key: "title", name: "Titre", sort: true, render: (row) => <span>{row.title || "—"}</span> },
    { key: "category", name: "Type", sort: true, render: (row) => <span>{row.category?.name || "—"}</span> },
    { key: "priceTTC", name: "Prix TTC", sort: true, render: (row) => <span>{row.priceTTC != null ? `${row.priceTTC} €` : "—"}</span> },
    { key: "createdAt", name: "Créé le", sort: true, render: (row) => <span>{row.createdAt ? new Date(row.createdAt).toLocaleDateString("fr-FR") : "—"}</span> },
    { key: "saleCount", name: "Ventes", sort: true, render: (row) => <span>{row.saleCount ?? 0}</span> },
    { key: "proName", name: "Pro", render: (row) => <span>{row.pro?.name || row.pro?.firstName || "—"}</span> },
    { key: "proRole", name: "Rôle", render: (row) => <Tag>{row.pro?.role || "—"}</Tag> },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const handleTableEvent = ({ event, value }) => {
    if (event === "page") fetchServices({ page: value });
    if (event === "count") fetchServices({ count: value, page: 1 });
    if (event === "sort") {
      const nextOrder = filters.sortBy === value && filters.order === "desc" ? "asc" : "desc";
      fetchServices({ sortBy: value, order: nextOrder, page: 1 });
    }
  };

  const resetFilters = () => {
    const reset = { page: 1, count: 20, q: "", status: undefined, categoryId: undefined, proRole: undefined, city: "", sortBy: "createdAt", order: "desc" };
    setFilters(reset);
    fetchServices(reset);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center mb-4 justify-end">
        <Select value={filters.sortBy} onChange={(v) => fetchServices({ sortBy: v, page: 1 })} options={SORT_OPTIONS} className="w-48" placeholder="Trier par" />
        <Select value={filters.order} onChange={(v) => fetchServices({ order: v, page: 1 })} options={[{ value: "desc", label: "Descendant" }, { value: "asc", label: "Ascendant" }]} className="w-36" />
      </div>
      <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <Input placeholder="Rechercher…" allowClear value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} onPressEnter={(e) => fetchServices({ q: e.target.value, page: 1 })} />
          <Select allowClear placeholder="Statut" value={filters.status} onChange={(v) => fetchServices({ status: v, page: 1 })} options={SERVICE_STATUSES} />
          <Select allowClear placeholder="Type de service" value={filters.categoryId} onChange={(v) => fetchServices({ categoryId: v, page: 1 })} options={categories.map((c) => ({ value: c._id, label: c.name }))} />
          <Select allowClear placeholder="Rôle du pro" value={filters.proRole} onChange={(v) => fetchServices({ proRole: v, page: 1 })} options={PRO_ROLES} />
          <Input placeholder="Ville" allowClear value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} onPressEnter={(e) => fetchServices({ city: e.target.value, page: 1 })} />
          <Space>
            <Button type="primary" onClick={() => fetchServices({ page: 1 })}>Appliquer</Button>
            <Button onClick={resetFilters}>Réinitialiser</Button>
          </Space>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-100 p-2">
        {loading ? <div className="flex justify-center py-20"><Spin /></div> : (
          <Table data={services} columns={columns} total={total} count={filters.count} page={filters.page} result={handleTableEvent} sortKey={filters.sortBy} sorderfilter={filters.order} />
        )}
      </div>
      {editService && <CreateServiceModal service={editService} onClose={() => { setEditService(null); fetchServices({ page: filters.page }); }} onCreated={() => fetchServices({ page: filters.page })} />}
      {viewService && <ServiceDetailModal svc={viewService} onClose={() => setViewService(null)} />}
    </>
  );
}

// ─── Onglet "Services en attente de validation" ───────────────────────────────
function PendingTab({ onCountChange }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewService, setViewService] = useState(null);
  const [autoValidate, setAutoValidate] = useState(false);
  const [autoValidateLoading, setAutoValidateLoading] = useState(false);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const r = await MarketplaceApi.listServices({ status: "pending_validation", limit: 100 });
      const data = r.data || [];
      setServices(data);
      if (onCountChange) onCountChange(data.length);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [onCountChange]);

  const fetchAutoValidateSetting = useCallback(async () => {
    try {
      const r = await MarketplaceApi.getMarketplaceSettings();
      if (r.success) setAutoValidate(r.data?.autoValidateServices ?? false);
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => { fetchPending(); fetchAutoValidateSetting(); }, [fetchPending, fetchAutoValidateSetting]);

  const handleValidate = async (row) => {
    try { await MarketplaceApi.validateService(row._id); message.success("Service validé et activé"); fetchPending(); }
    catch (e) { message.error("Erreur lors de la validation"); }
  };
  const handleReject = async (row) => {
    try { await MarketplaceApi.rejectService(row._id); message.success("Service refusé"); fetchPending(); }
    catch (e) { message.error("Erreur lors du refus"); }
  };

  const handleBulkValidate = async () => {
    if (!selectedIds.length) return;
    try { await MarketplaceApi.bulkValidateServices(selectedIds); message.success(`${selectedIds.length} service(s) validé(s)`); setSelectedIds([]); fetchPending(); }
    catch (e) { message.error("Erreur lors de la validation en masse"); }
  };
  const handleBulkReject = async () => {
    if (!selectedIds.length) return;
    try { await MarketplaceApi.bulkRejectServices(selectedIds); message.success(`${selectedIds.length} service(s) refusé(s)`); setSelectedIds([]); fetchPending(); }
    catch (e) { message.error("Erreur lors du refus en masse"); }
  };

  const handleAutoValidateChange = async (checked) => {
    setAutoValidateLoading(true);
    try {
      await MarketplaceApi.updateMarketplaceSettings({ autoValidateServices: checked });
      setAutoValidate(checked);
      message.success(checked ? "Validation automatique activée" : "Validation automatique désactivée");
    } catch (e) { message.error("Impossible de modifier le paramètre"); }
    setAutoValidateLoading(false);
  };

  const allChecked = services.length > 0 && selectedIds.length === services.length;
  const indeterminate = selectedIds.length > 0 && selectedIds.length < services.length;
  const toggleAll = () => { if (allChecked) setSelectedIds([]); else setSelectedIds(services.map((s) => s._id)); };
  const toggleOne = (id) => { setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]); };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 ? (
            <>
              <span className="text-sm text-gray-500">{selectedIds.length} sélectionné(s)</span>
              <Button type="primary" size="small" onClick={handleBulkValidate}>Valider la sélection</Button>
              <Popconfirm title={`Refuser ${selectedIds.length} service(s) ?`} onConfirm={handleBulkReject} okText="Refuser" cancelText="Annuler">
                <Button danger size="small">Refuser la sélection</Button>
              </Popconfirm>
            </>
          ) : <span className="text-sm text-gray-400">Cochez des lignes pour valider/refuser en masse</span>}
        </div>
        <Tooltip title="Si activé, tous les nouveaux services créés par les pros sont automatiquement validés sans intervention admin">
          <Space>
            <span className="text-sm text-gray-600 font-medium">Validation automatique</span>
            <Switch checked={autoValidate} loading={autoValidateLoading} onChange={handleAutoValidateChange} />
          </Space>
        </Tooltip>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20"><Spin /></div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Aucun service en attente de validation</div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-[12px] text-gray-400 font-medium bg-gray-50">
                <th className="py-3 px-4 w-10">
                  <Checkbox indeterminate={indeterminate} checked={allChecked} onChange={toggleAll} />
                </th>
                <th className="text-left py-3 px-4">Titre</th>
                <th className="text-left py-3 px-4">Pro</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Prix TTC</th>
                <th className="text-left py-3 px-4">Ville</th>
                <th className="text-left py-3 px-4">Soumis le</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr
                  key={svc._id}
                  className="border-b border-gray-50 hover:bg-yellow-50/40 cursor-pointer text-[13px] text-[#47525E]"
                  onClick={() => setViewService(svc)}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selectedIds.includes(svc._id)} onChange={() => toggleOne(svc._id)} />
                  </td>
                  <td className="py-3 px-4 font-medium">{svc.title || "—"}</td>
                  <td className="py-3 px-4">{svc.pro?.name || svc.pro?.firstName || "—"}</td>
                  <td className="py-3 px-4">{svc.category?.name || "—"}</td>
                  <td className="py-3 px-4">{svc.priceTTC != null ? `${svc.priceTTC} €` : "—"}</td>
                  <td className="py-3 px-4">{svc.city || "—"}</td>
                  <td className="py-3 px-4">{svc.createdAt ? new Date(svc.createdAt).toLocaleDateString("fr-FR") : "—"}</td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <Space>
                      <Button size="small" type="primary" onClick={() => handleValidate(svc)}>Valider</Button>
                      <Popconfirm title="Refuser ce service ?" onConfirm={() => handleReject(svc)} okText="Refuser" cancelText="Annuler">
                        <Button size="small" danger>Refuser</Button>
                      </Popconfirm>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewService && (
        <ServiceDetailModal
          svc={viewService}
          onClose={() => setViewService(null)}
          extraFooter={
            viewService.status === "pending_validation" ? (
              <Space>
                <Button type="primary" onClick={async () => { await handleValidate(viewService); setViewService(null); }}>Valider</Button>
                <Popconfirm title="Refuser ce service ?" onConfirm={async () => { await handleReject(viewService); setViewService(null); }} okText="Refuser" cancelText="Annuler">
                  <Button danger>Refuser</Button>
                </Popconfirm>
              </Space>
            ) : null
          }
        />
      )}
    </>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
const MarketplaceOfferedServices = () => {
  const [categories, setCategories] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    MarketplaceApi.listCategories().then((r) => {
      if (r.success) setCategories((r.data || []).filter((c) => c.parentCategory));
    }).catch(() => {});
  }, []);

  const tabItems = [
    {
      key: "validated",
      label: "Services validés",
      children: <ValidatedTab categories={categories} />,
    },
    {
      key: "pending",
      label: (
        <span>
          Services en attente de validation
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center bg-yellow-400 text-white text-[11px] font-bold rounded-full w-5 h-5">{pendingCount}</span>
          )}
        </span>
      ),
      children: <PendingTab onCountChange={setPendingCount} />,
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-[#111827]">Services proposés</h3>
          <p className="text-sm text-[#6B7280] mt-1">Gérez les services publiés par les professionnels.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <Tabs items={tabItems} />
        </div>
      </div>
    </Layout>
  );
};

export default MarketplaceOfferedServices;
