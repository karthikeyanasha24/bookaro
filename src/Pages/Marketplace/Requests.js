import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Tag, Button, Space, Popconfirm, Input, Select, message, Typography, Card } from "antd";
import Layout from "../../components/global/layout";
import MarketplaceApi from "../../methods/api/marketplaceApi";

const { Text, Title } = Typography;
const statusOptions = [
  { label: "En attente", value: "pending" },
  { label: "Traité", value: "processed" },
];

const MarketplaceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({ q: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const loadRequests = async (options = {}) => {
    setLoading(true);
    try {
      const res = await MarketplaceApi.listRequests({
        page: options.page || pagination.current,
        limit: options.limit || pagination.pageSize,
        q: filters.q || undefined,
        status: filters.status || undefined,
      });
      if (res?.success) {
        setRequests(res.data || []);
        setPagination((prev) => ({
          ...prev,
          current: res.pagination?.page || prev.current,
          pageSize: res.pagination?.limit || prev.pageSize,
          total: res.pagination?.total || 0,
        }));
      } else {
        const msg = res?.error?.message || res?.message || "Erreur lors du chargement des demandes.";
        message.error(msg);
      }
    } catch (err) {
      message.error("Erreur lors du chargement des demandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests({ page: 1 });
  }, []);

  const handleTableChange = ({ current }) => {
    loadRequests({ page: current });
  };

  const handleSearch = () => {
    loadRequests({ page: 1 });
  };

  const handleFilterStatus = (value) => {
    const status = value || "";
    setFilters((prev) => ({ ...prev, status }));
    loadRequests({ page: 1, limit: pagination.pageSize, q: filters.q, status });
  };

  const updateStatus = async (id, status) => {
    setActionLoading(true);
    try {
      const res = await MarketplaceApi.updateRequestStatus(id, { status });
      if (res?.success) {
        message.success("Statut mis à jour.");
        loadRequests({ page: pagination.current });
      }
    } catch (err) {
      message.error("Impossible de mettre à jour le statut.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteRequest = async (id) => {
    setActionLoading(true);
    try {
      const res = await MarketplaceApi.deleteRequest(id);
      if (res?.success) {
        message.success("Demande supprimée.");
        loadRequests({ page: pagination.current });
        setSelectedRowKeys((keys) => keys.filter((key) => key !== id));
      }
    } catch (err) {
      message.error("Impossible de supprimer la demande.");
    } finally {
      setActionLoading(false);
    }
  };

  const bulkDelete = async () => {
    if (!selectedRowKeys.length) {
      return message.warning("Aucune demande sélectionnée.");
    }
    setActionLoading(true);
    try {
      await Promise.all(selectedRowKeys.map((id) => MarketplaceApi.deleteRequest(id)));
      message.success("Demandes supprimées.");
      setSelectedRowKeys([]);
      loadRequests({ page: pagination.current });
    } catch (err) {
      message.error("Erreur lors de la suppression des demandes.");
    } finally {
      setActionLoading(false);
    }
  };

  const bulkMarkProcessed = async () => {
    if (!selectedRowKeys.length) {
      return message.warning("Aucune demande sélectionnée.");
    }
    setActionLoading(true);
    try {
      await Promise.all(
        selectedRowKeys.map((id) => MarketplaceApi.updateRequestStatus(id, { status: "processed" }))
      );
      message.success("Demandes marquées comme traitées.");
      setSelectedRowKeys([]);
      loadRequests({ page: pagination.current });
    } catch (err) {
      message.error("Erreur lors de la mise à jour des statuts.");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => new Date(value).toLocaleString("fr-FR"),
      width: 180,
    },
    {
      title: "Utilisateur",
      dataIndex: "userName",
      key: "userName",
      render: (_, record) => {
        const userLabel = record.user?.firstName || record.userName || "Utilisateur inconnu";
        return record.user?._id ? (
          <Link to={`/user/detail/${record.user._id}`}>{userLabel}</Link>
        ) : (
          <Text>{userLabel}</Text>
        );
      },
      ellipsis: true,
    },
    {
      title: "Email contact",
      dataIndex: "requestEmail",
      key: "requestEmail",
      render: (value, record) => (
        <div>
          <Text strong>{value}</Text>
          <br />
          <Text type="secondary">Compte: {record.userEmail || "-"}</Text>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: "Catégorie",
      dataIndex: "categoryName",
      key: "categoryName",
      ellipsis: true,
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "processed" ? "green" : "orange"}>{status === "processed" ? "Traité" : "En attente"}</Tag>
      ),
      width: 130,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" type="link" onClick={() => navigate(`/marketplace/requests/${record._id}`)}>
            Détail
          </Button>
          <Popconfirm
            title="Supprimer cette demande ?"
            onConfirm={() => deleteRequest(record._id)}
            okText="Supprimer"
            cancelText="Annuler"
          >
            <Button size="small" type="link" danger>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 160,
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <Title level={3}>Demandes de service</Title>
          <Text type="secondary">Liste et gestion des demandes de service reçues sur la marketplace.</Text>
        </div>

        <Card className="mb-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_minmax(220px,260px)]">
            <Input.Search
              placeholder="Rechercher par email, nom ou catégorie"
              enterButton="Rechercher"
              value={filters.q}
              onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
              onSearch={handleSearch}
            />
            <Select
              placeholder="Filtrer par statut"
              value={filters.status || undefined}
              allowClear
              options={statusOptions}
              onChange={handleFilterStatus}
            />
          </div>
        </Card>

        <div>
          <div>
            <Card title="Demandes" className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button type="primary" disabled={!selectedRowKeys.length} loading={actionLoading} onClick={bulkMarkProcessed}>
                  Marquer traité
                </Button>
                <Popconfirm
                  title="Supprimer les demandes sélectionnées ?"
                  onConfirm={bulkDelete}
                  okText="Supprimer"
                  cancelText="Annuler"
                >
                  <Button type="default" danger disabled={!selectedRowKeys.length} loading={actionLoading}>
                    Supprimer sélection
                  </Button>
                </Popconfirm>
                <Text className="ml-auto">{selectedRowKeys.length} sélectionnée(s)</Text>
              </div>
              <Table
                rowKey="_id"
                loading={loading}
                columns={columns}
                dataSource={requests}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: false,
                }}
                onChange={handleTableChange}
                rowSelection={{
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                }}
                onRow={(record) => ({
                  onClick: () => navigate(`/marketplace/requests/${record._id}`),
                  style: { cursor: 'pointer' },
                })}
              />
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketplaceRequests;
