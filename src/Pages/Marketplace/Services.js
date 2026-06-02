import { useEffect, useState } from "react";
import { Button, Input, Modal, Select, Tag, Space, Spin, message, Switch, Tabs } from "antd";
import { FiPlus } from "react-icons/fi";
import Layout from "../../components/global/layout";
import Table from "../../components/Table";
import MarketplaceApi from "../../methods/api/marketplaceApi";

const { Option } = Select;

const MarketplaceServices = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("categories");
  const [form, setForm] = useState({
    name: "",
    description: "",
    iconUrl: "",
    order: 0,
    group: "Transaction",
    parentCategory: "",
    isActive: true,
  });

  const activeGroup = activeTab === "serviceTypes" ? "Service" : "Transaction";
  const filteredCategories = categories.filter((item) => item.group === activeGroup);
  const transactionCategories = categories.filter((item) => item.group === "Transaction");

  const loadCategories = async () => {
    setLoading(true);
    const res = await MarketplaceApi.listCategories();
    if (res.success) {
      const data = (res.data || []).map((item) => ({ ...item, id: item.id || item._id }));
      setCategories(data);
    } else {
      message.error(res.error?.message || "Impossible de charger les catégories.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openNewCategory = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      description: "",
      iconUrl: "",
      order: 0,
      group: activeGroup,
      parentCategory: "",
      isActive: true,
    });
    setModalVisible(true);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      description: category.description || "",
      iconUrl: category.iconUrl || "",
      order: category.order || 0,
      group: category.group || activeGroup,
      parentCategory: category.parentCategory?.id || category.parentCategory || "",
      isActive: category.isActive !== false,
    });
    setModalVisible(true);
  };

  const handleSaveCategory = async () => {
    if (!form.name.trim()) {
      return message.error("Le nom est requis.");
    }

    const payload = {
      name: form.name,
      description: form.description,
      iconUrl: form.iconUrl,
      order: Number(form.order) || 0,
      group: form.group,
      parentCategory: form.group === "Service" ? form.parentCategory : undefined,
      isActive: form.isActive,
    };

    if (form.group === "Service" && !form.parentCategory) {
      setLoading(false);
      return message.error("La catégorie de service est requise pour un type de service.");
    }

    setLoading(true);
    const res = editingCategory
      ? await MarketplaceApi.updateCategory(editingCategory.id || editingCategory._id, payload)
      : await MarketplaceApi.createCategory(payload);
    if (res.success) {
      message.success(editingCategory ? "Élément mis à jour." : "Élément créé.");
      setModalVisible(false);
      loadCategories();
    } else {
      message.error(res.error?.message || "Erreur lors de l'enregistrement.");
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (category) => {
    Modal.confirm({
      title: "Désactiver l'élément",
      content: `Voulez-vous désactiver "${category.name}" ?`,
      okText: "Désactiver",
      cancelText: "Annuler",
      onOk: async () => {
        setLoading(true);
        const res = await MarketplaceApi.deleteCategory(category.id || category._id);
        if (res.success) {
          message.success("Élément désactivé.");
          loadCategories();
        } else {
          message.error(res.error?.message || "Erreur lors de la désactivation.");
        }
        setLoading(false);
      },
    });
  };

  const handleTableResult = (payload) => {
    if (payload.event === "row" && payload.row) {
      openEditCategory(payload.row);
    }
    if (payload.event === "page") setPage(payload.value);
  };

  const categoryColumns = [
    {
      key: "name",
      name: "Nom",
      render: (row) => <span>{row.name}</span>,
    },
    {
      key: "description",
      name: "Description",
      render: (row) => <span>{row.description || "—"}</span>,
    },
    {
      key: "order",
      name: "Ordre",
      render: (row) => <span>{row.order ?? 0}</span>,
    },
    {
      key: "isActive",
      name: "Actif",
      render: (row) => <Tag color={row.isActive ? "green" : "volcano"}>{row.isActive ? "Oui" : "Non"}</Tag>,
    },
    {
      key: "actions",
      name: "Actions",
      render: (row) => (
        <Space>
          <Button type="default" size="small" onClick={(e) => { e.stopPropagation(); openEditCategory(row); }}>
            Modifier
          </Button>
          <Button type="primary" danger size="small" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(row); }}>
            Désactiver
          </Button>
        </Space>
      ),
    },
  ];

  const serviceTypeColumns = [
    {
      key: "name",
      name: "Nom",
      render: (row) => <span>{row.name}</span>,
    },
    {
      key: "parentCategory",
      name: "Catégorie de transaction",
      render: (row) => <span>{row.parentCategory?.name || "—"}</span>,
    },
    {
      key: "description",
      name: "Description",
      render: (row) => <span>{row.description || "—"}</span>,
    },
    {
      key: "order",
      name: "Ordre",
      render: (row) => <span>{row.order ?? 0}</span>,
    },
    {
      key: "isActive",
      name: "Actif",
      render: (row) => <Tag color={row.isActive ? "green" : "volcano"}>{row.isActive ? "Oui" : "Non"}</Tag>,
    },
    {
      key: "actions",
      name: "Actions",
      render: (row) => (
        <Space>
          <Button type="default" size="small" onClick={(e) => { e.stopPropagation(); openEditCategory(row); }}>
            Modifier
          </Button>
          <Button type="primary" danger size="small" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(row); }}>
            Désactiver
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-[#111827]">Gestion des services</h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Gérez les catégories de transaction et les types de service séparément.
            </p>
          </div>
        </div>

        <div className="shadow-box w-full bg-white rounded-lg p-4">
          <Tabs activeKey={activeTab} onChange={(key) => { setActiveTab(key); setPage(1); }}>
            <Tabs.TabPane tab="Catégories" key="categories">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-lg font-semibold">Catégories de transaction</h4>
                  <p className="text-sm text-[#6B7280] mt-1">Liste des catégories que les coachs peuvent associer à un service.</p>
                </div>
                <Button type="primary" icon={<FiPlus />} onClick={openNewCategory}>
                  Nouvelle catégorie
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Spin />
                </div>
              ) : (
                <Table
                  data={filteredCategories}
                  columns={categoryColumns}
                  total={filteredCategories.length}
                  count={filteredCategories.length || 1}
                  page={page}
                  result={handleTableResult}
                  sortKey="name"
                  sorderfilter="asc"
                />
              )}
            </Tabs.TabPane>

            <Tabs.TabPane tab="Types de service" key="serviceTypes">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-lg font-semibold">Types de service</h4>
                  <p className="text-sm text-[#6B7280] mt-1">Liste des types de service, avec leur catégorie de transaction parente.</p>
                </div>
                <Button type="primary" icon={<FiPlus />} onClick={openNewCategory}>
                  Nouveau type de service
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Spin />
                </div>
              ) : (
                <Table
                  data={filteredCategories}
                  columns={serviceTypeColumns}
                  total={filteredCategories.length}
                  count={filteredCategories.length || 1}
                  page={page}
                  result={handleTableResult}
                  sortKey="name"
                  sorderfilter="asc"
                />
              )}
            </Tabs.TabPane>
          </Tabs>
        </div>

        <Modal
          title={editingCategory ? `Modifier ${activeGroup === "Service" ? "type de service" : "catégorie de transaction"}` : `Nouvelle ${activeGroup === "Service" ? "type de service" : "catégorie de transaction"}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSaveCategory}
          okText="Enregistrer"
          cancelText="Annuler"
          width={640}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={activeGroup === "Service" ? "Ex: Coaching, Relecture de CV..." : "Ex: Achat, Vente..."}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type d'élément</label>
              <div className="px-3 py-2 border rounded-md bg-slate-50 text-sm text-slate-700">
                {activeGroup === "Service" ? "Type de service" : "Catégorie de transaction"}
              </div>
            </div>
            {activeGroup === "Service" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Catégorie de transaction</label>
                <Select
                  value={form.parentCategory}
                  onChange={(value) => setForm((f) => ({ ...f, parentCategory: value }))}
                  className="w-full"
                  placeholder="Sélectionnez une catégorie de transaction"
                >
                  {transactionCategories.map((category) => (
                    <Option key={category.id || category._id} value={category.id || category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <Input.TextArea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Renseignements complémentaires"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ordre</label>
                <Input
                  value={form.order}
                  type="number"
                  onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Actif</label>
                <div className="mt-2">
                  <Switch
                    checked={form.isActive}
                    onChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Icône (URL)</label>
              <Input
                value={form.iconUrl}
                onChange={(e) => setForm((f) => ({ ...f, iconUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default MarketplaceServices;
