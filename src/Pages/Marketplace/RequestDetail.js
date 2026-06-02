import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Space, Popconfirm, Tag, Typography, message, Spin } from "antd";
import Layout from "../../components/global/layout";
import MarketplaceApi from "../../methods/api/marketplaceApi";

const { Text, Title } = Typography;

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadRequest = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await MarketplaceApi.getRequestDetail(id);
      if (res?.success) {
        setRequest(res.data || null);
      } else {
        message.error(res?.error?.message || res?.message || "Impossible de charger le détail de la demande.");
      }
    } catch (err) {
      message.error("Impossible de charger le détail de la demande.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequest();
  }, [id]);

  const updateStatus = async (status) => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await MarketplaceApi.updateRequestStatus(id, { status });
      if (res?.success) {
        message.success("Statut mis à jour.");
        loadRequest();
      } else {
        message.error(res?.error?.message || res?.message || "Impossible de mettre à jour le statut.");
      }
    } catch (err) {
      message.error("Impossible de mettre à jour le statut.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteRequest = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await MarketplaceApi.deleteRequest(id);
      if (res?.success) {
        message.success("Demande supprimée.");
        navigate("/marketplace/requests");
      } else {
        message.error(res?.error?.message || res?.message || "Impossible de supprimer la demande.");
      }
    } catch (err) {
      message.error("Impossible de supprimer la demande.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Title level={3}>Détail de la demande</Title>
            <Text type="secondary">Informations complètes de la demande sélectionnée.</Text>
          </div>
          <Space>
            <Button onClick={() => navigate("/marketplace/requests")}>Retour</Button>
            <Popconfirm
              title="Supprimer cette demande ?"
              onConfirm={deleteRequest}
              okText="Supprimer"
              cancelText="Annuler"
            >
              <Button danger loading={actionLoading}>
                Supprimer
              </Button>
            </Popconfirm>
          </Space>
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-16">
              <Spin />
            </div>
          ) : !request ? (
            <div className="text-center py-16">
              <Text type="secondary">Aucun détail disponible pour cette demande.</Text>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Text type="secondary">ID</Text>
                <div>{request._id}</div>
              </div>

              <div>
                <Text type="secondary">Demandeur</Text>
                <div>{request.userName || request.user?.firstName || "Utilisateur inconnu"}</div>
                <div>
                  <Text type="secondary">Email contact</Text> {request.requestEmail}
                </div>
                <div>
                  <Text type="secondary">Email du compte</Text> {request.userEmail || "N/A"}
                </div>
              </div>

              <div>
                <Text type="secondary">Téléphone</Text>
                <div>{request.phone || "N/A"}</div>
              </div>

              <div>
                <Text type="secondary">Catégorie</Text>
                <div>{request.categoryName || "N/A"}</div>
              </div>

              <div>
                <Text type="secondary">Statut</Text>
                <div>
                  <Tag color={request.status === "processed" ? "green" : "orange"}>
                    {request.status === "processed" ? "Traité" : "En attente"}
                  </Tag>
                </div>
              </div>

              <div>
                <Text type="secondary">Description</Text>
                <div>{request.description || "Aucune description."}</div>
              </div>

              <Space wrap>
                <Button
                  type="primary"
                  disabled={request.status === "processed"}
                  loading={actionLoading}
                  onClick={() => updateStatus("processed")}
                >
                  Marquer traité
                </Button>
                <Button
                  type="default"
                  disabled={request.status === "pending"}
                  loading={actionLoading}
                  onClick={() => updateStatus("pending")}
                >
                  Remettre en attente
                </Button>
              </Space>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default RequestDetail;
