import React, { useState, useEffect } from "react";
import { FiFilter, FiX, FiAlertTriangle, FiUsers, FiUserCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import Layout from "../../components/global/layout";
import "./referral.css";

/**
 * Admin Dashboard pour le programme de parrainage
 * Affiche: Overview, Analytics, Funnel, Cas suspects
 */

interface OverviewData {
  totals: {
    invitations: number;
    sent: number;
    opened: number;
    signedUp: number;
    activated: number;
    suspicious: number;
  };
  rates: {
    conversion: string;
    activation: string;
  };
}

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface ChannelStat {
  channel: string;
  total: number;
  sent: number;
  opened: number;
  signedUp: number;
  activated: number;
  conversionRate: number;
  activationRate: number;
}

const ReferralAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [channelStats, setChannelStats] = useState<ChannelStat[]>([]);
  const [invitations, setInvitations] = useState<any>({ invitations: [], pagination: {} });
  const [suspicious, setSuspicious] = useState<any>({ suspicious: [] });
  const [inviters, setInviters] = useState<any>({ inviters: [], pagination: {} });
  const [invitees, setInvitees] = useState<any>({ invitees: [], pagination: {} });
  const [invitersLoading, setInvitersLoading] = useState(false);
  const [inviteesLoading, setInviteesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState({
    status: "",
    channel: "",
    source: "",
    page: 1,
  });

  // Mapping des sources à des labels lisibles
  const sourceLabels: { [key: string]: string } = {
    "sidebar": "Sidebar",
    "dashboard": "Dashboard",
    "profile": "Page Profil",
    "toast-after_signup": "Toast - Après inscription",
    "toast-after_property_created": "Toast - Bien créé",
    "toast-after_saved_search_created": "Toast - Recherche créée",
    "toast-after_qr_flyer_generated": "Toast - QR généré",
    "toast-after_learning_center_content_viewed": "Toast - Contenu vu",
    "toast-after_property_enriched": "Toast - Bien enrichi",
    "unknown": "Inconnu",
  };

  const getSourceLabel = (source: string) => {
    return sourceLabels[source] || source;
  };

  // Charger les données
  useEffect(() => {
    loadData();
  }, [filters]);

  useEffect(() => {
    if (activeTab === "inviters" && inviters.inviters.length === 0) {
      loadInviters();
    }
    if (activeTab === "invitees" && invitees.invitees.length === 0) {
      loadInvitees();
    }
  }, [activeTab]);

  const loadInviters = async () => {
    try {
      setInvitersLoading(true);
      const res = await fetch("http://localhost:6089/admin/referrals/inviters?limit=100").then(r => r.json());
      if (res?.success) setInviters(res.data);
    } catch (error) {
      console.error("Error loading inviters:", error);
    } finally {
      setInvitersLoading(false);
    }
  };

  const loadInvitees = async () => {
    try {
      setInviteesLoading(true);
      const res = await fetch("http://localhost:6089/admin/referrals/invitees?limit=100").then(r => r.json());
      if (res?.success) setInvitees(res.data);
    } catch (error) {
      console.error("Error loading invitees:", error);
    } finally {
      setInviteesLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Récupérer les données depuis le backend de la plateforme principale
      // NOTE: Routes are mounted at /admin/referrals (no /api prefix)
      const baseURL = "http://localhost:6089";

      const [overviewRes, funnelRes, channelRes, invitationsRes, suspiciousRes] = await Promise.all([
        fetch(`${baseURL}/admin/referrals/overview`).then(r => r.json()),
        fetch(`${baseURL}/admin/referrals/analytics/funnel`).then(r => r.json()),
        fetch(`${baseURL}/admin/referrals/analytics/by-channel`).then(r => r.json()),
        fetch(`${baseURL}/admin/referrals/invitations?${new URLSearchParams({
          status: filters.status || "",
          channel: filters.channel || "",
          source: filters.source || "",
          page: filters.page.toString(),
          limit: "50",
        })}`).then(r => r.json()),
        fetch(`${baseURL}/admin/referrals/suspicious`).then(r => r.json()),
      ]).catch((error) => {
        console.error("Error loading referral admin data:", error);
        return [null, null, null, null, null];
      });

      if (overviewRes?.success) setOverview(overviewRes.data);
      if (funnelRes?.success) setFunnel(funnelRes.data.funnel);
      if (channelRes?.success) setChannelStats(channelRes.data);
      if (invitationsRes?.success) setInvitations(invitationsRes.data);
      if (suspiciousRes?.success) setSuspicious(suspiciousRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkInvalid = async (id: string, reason: string) => {
    try {
      const response = await fetch(`http://localhost:6089/admin/referrals/${id}/mark-invalid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (response.ok) loadData();
    } catch (error) {
      console.error("Error marking invalid:", error);
    }
  };

  const content = (
    <div className="referral-admin-wrapper">
      <div className="referral-admin-header">
        <h1>Tableau de bord Parrainage</h1>
        <p className="subtitle">Suivi des invitations et analytics du programme de parrainage</p>
      </div>

      {/* Tabs */}
      <div className="referral-admin-tabs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
        >
          Aperçu
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab("invitations")}
          className={`tab-btn ${activeTab === "invitations" ? "active" : ""}`}
        >
          Invitations
        </button>
        <button
          onClick={() => setActiveTab("inviters")}
          className={`tab-btn ${activeTab === "inviters" ? "active" : ""}`}
        >
          <FiUsers size={15} /> Inviters
        </button>
        <button
          onClick={() => setActiveTab("invitees")}
          className={`tab-btn ${activeTab === "invitees" ? "active" : ""}`}
        >
          <FiUserCheck size={15} /> Invités
        </button>
        <button
          onClick={() => setActiveTab("suspicious")}
          className={`tab-btn ${activeTab === "suspicious" ? "active" : ""}`}
        >
          <FiAlertTriangle size={18} /> Suspects
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Chargement des données...</p>
        </div>
      ) : (
        <div className="referral-admin-content">
          {/* OVERVIEW */}
          {activeTab === "overview" && overview && (
            <div className="overview-section">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Total Invitations</div>
                  <div className="metric-value">{overview.totals.invitations}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Envoyées</div>
                  <div className="metric-value" style={{ color: "#2563eb" }}>
                    {overview.totals.sent}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Inscriptions</div>
                  <div className="metric-value" style={{ color: "#16a34a" }}>
                    {overview.totals.signedUp}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Taux de Conversion</div>
                  <div className="metric-value" style={{ color: "#7c3aed" }}>
                    {overview.rates.conversion}%
                  </div>
                </div>
              </div>

              {/* Funnel Chart */}
              {funnel.length > 0 && (
                <div className="funnel-container">
                  <h2>Funnel d'Activation</h2>
                  <div className="funnel-stages">
                    {funnel.map((stage, idx) => (
                      <div key={idx} className="funnel-stage">
                        <div className="funnel-header">
                          <span className="funnel-name">{stage.stage}</span>
                          <span className="funnel-stats">
                            {stage.count} ({stage.percentage}%)
                          </span>
                        </div>
                        <div className="funnel-bar">
                          <div
                            className="funnel-bar-fill"
                            style={{ width: `${stage.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="analytics-section">
              <div className="channels-grid">
                {channelStats.map((stat) => (
                  <div key={stat.channel} className="channel-card">
                    <h3 style={{ textTransform: "capitalize" }}>{stat.channel}</h3>
                    <div className="channel-stat">
                      <span>Total:</span>
                      <span className="value">{stat.total}</span>
                    </div>
                    <div className="channel-stat">
                      <span>Envoyées:</span>
                      <span className="value">{stat.sent}</span>
                    </div>
                    <div className="channel-stat">
                      <span>Ouvertes:</span>
                      <span className="value">{stat.opened}</span>
                    </div>
                    <div className="channel-stat">
                      <span>Inscriptions:</span>
                      <span className="value" style={{ color: "#16a34a" }}>
                        {stat.signedUp}
                      </span>
                    </div>
                    <div className="channel-stat">
                      <span>Activées:</span>
                      <span className="value" style={{ color: "#16a34a" }}>
                        {stat.activated}
                      </span>
                    </div>
                    <hr />
                    <div className="channel-stat">
                      <span>Taux de Conversion:</span>
                      <span className="value" style={{ color: "#7c3aed" }}>
                        {stat.conversionRate?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVITATIONS */}
          {activeTab === "invitations" && (
            <div className="invitations-section">
              <div className="invitations-filters">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value, page: 1 })
                  }
                >
                  <option value="">Tous les statuts</option>
                  <option value="sent">Envoyée</option>
                  <option value="opened">Ouverte</option>
                  <option value="signed_up">Inscrit</option>
                  <option value="activated">Activé</option>
                </select>
                <select
                  value={filters.channel}
                  onChange={(e) =>
                    setFilters({ ...filters, channel: e.target.value, page: 1 })
                  }
                >
                  <option value="">Tous les canaux</option>
                  <option value="copy">Copier</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                </select>
                <select
                  value={filters.source}
                  onChange={(e) =>
                    setFilters({ ...filters, source: e.target.value, page: 1 })
                  }
                >
                  <option value="">Toutes les sources</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="profile">Page Profil</option>
                  <option value="toast">Tous les Toasts</option>
                  <option value="toast-after_signup">Toast - Après inscription</option>
                  <option value="toast-after_property_created">Toast - Bien créé</option>
                  <option value="toast-after_saved_search_created">Toast - Recherche créée</option>
                  <option value="toast-after_qr_flyer_generated">Toast - QR généré</option>
                  <option value="toast-after_learning_center_content_viewed">Toast - Contenu vu</option>
                  <option value="toast-after_property_enriched">Toast - Bien enrichi</option>
                  <option value="unknown">Inconnu</option>
                </select>
              </div>

              <table className="invitations-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Partage Code</th>
                    <th>Canal</th>
                    <th>Message</th>
                    <th>Heure</th>
                    <th>Source</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations?.invitations?.map((inv: any, idx: number) => (
                    <tr key={idx}>
                      <td className="user-cell">
                        <div className="user-info">
                          <div className="user-name">
                            {inv.inviter?.firstName} {inv.inviter?.lastName}
                          </div>
                          <div className="user-email" style={{ fontSize: "0.85em", color: "#666" }}>
                            {inv.inviter?.email}
                          </div>
                        </div>
                      </td>
                      <td className="code-cell">{inv.shareCode}</td>
                      <td style={{ textTransform: "capitalize" }}>{inv.channel}</td>
                      <td>
                        {inv.personalMessage ? (
                          <span
                            title={inv.personalMessage}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              background: "#f3f0ff",
                              color: "#6B21A8",
                              borderRadius: "999px",
                              padding: "2px 10px",
                              fontSize: "0.78em",
                              fontWeight: 500,
                              cursor: "help",
                            }}
                          >
                            💬 Message perso
                          </span>
                        ) : (
                          <span style={{ color: "#ccc", fontSize: "0.8em" }}>—</span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: "0.9em", whiteSpace: "nowrap" }}>
                          {new Date(inv.createdAt).toLocaleString("fr-FR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.9em" }}>
                        {getSourceLabel(inv.source || "unknown")}
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${inv.status}`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* INVITERS */}
          {activeTab === "inviters" && (
            <div className="invitations-section">
              <h2 style={{ marginBottom: "1rem" }}>
                Inviters — {inviters.pagination?.total ?? "…"} user(s) ayant invité
              </h2>
              {invitersLoading ? (
                <p>Chargement…</p>
              ) : (
                <table className="invitations-table">
                  <thead>
                    <tr>
                      <th>Nom / Prénom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>CP / Ville</th>
                      <th>Invitations envoyées</th>
                      <th>Dernière invitation</th>
                      <th>Converties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inviters.inviters?.map((row: any, idx: number) => (
                      <tr key={idx}>
                        <td className="user-cell">
                          <div className="user-info">
                            <Link
                              to={`/user/detail/${row.user?._id}`}
                              className="user-name"
                              style={{ color: "#7c3aed", textDecoration: "underline" }}
                            >
                              {row.user?.firstName} {row.user?.lastName}
                            </Link>
                          </div>
                        </td>
                        <td style={{ fontSize: "0.9em", color: "#555" }}>{row.user?.email || "—"}</td>
                        <td style={{ fontSize: "0.9em" }}>{row.user?.mobileNo || "—"}</td>
                        <td style={{ fontSize: "0.9em" }}>
                          {[row.user?.pinCode, row.user?.city].filter(Boolean).join(" ") || "—"}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 600 }}>{row.totalInvitations}</td>
                        <td style={{ fontSize: "0.9em", whiteSpace: "nowrap" }}>
                          {row.lastInvitationDate
                            ? new Date(row.lastInvitationDate).toLocaleDateString("fr-FR", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span
                            className="status-badge"
                            style={{
                              background: row.convertedInvitations > 0 ? "#d1fae5" : "#f3f4f6",
                              color: row.convertedInvitations > 0 ? "#065f46" : "#6b7280",
                            }}
                          >
                            {row.convertedInvitations}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {inviters.inviters?.length === 0 && (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>Aucun inviter pour le moment</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* INVITEES */}
          {activeTab === "invitees" && (
            <div className="invitations-section">
              <h2 style={{ marginBottom: "1rem" }}>
                Invités — {invitees.pagination?.total ?? "…"} inscrit(s) via invitation
              </h2>
              {inviteesLoading ? (
                <p>Chargement…</p>
              ) : (
                <table className="invitations-table">
                  <thead>
                    <tr>
                      <th>Nom / Prénom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Objectif</th>
                      <th>Ville</th>
                      <th>Invité par</th>
                      <th>Date inscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitees.invitees?.map((row: any, idx: number) => (
                      <tr key={idx}>
                        <td className="user-cell">
                          <div className="user-name">
                            <Link
                              to={`/user/detail/${row._id}`}
                              style={{ color: "#7c3aed", textDecoration: "underline" }}
                            >
                              {row.firstName} {row.lastName}
                            </Link>
                          </div>
                          <div className="user-email" style={{ fontSize: "0.82em", color: "#888" }}>
                            {row.email}
                          </div>
                        </td>
                        <td style={{ fontSize: "0.9em", color: "#555" }}>{row.email || "—"}</td>
                        <td style={{ fontSize: "0.9em" }}>{row.mobileNo || "—"}</td>
                        <td>
                          {row.signupObjective ? (
                            <span className="status-badge" style={{ background: "#ede9fe", color: "#5b21b6" }}>
                              {row.signupObjective}
                            </span>
                          ) : "—"}
                        </td>
                        <td style={{ fontSize: "0.9em" }}>{row.city || "—"}</td>
                        <td>
                          {row.inviter?._id ? (
                            <Link
                              to={`/user/detail/${row.inviter._id}`}
                              style={{ color: "#7c3aed", textDecoration: "underline", fontWeight: 500 }}
                            >
                              {row.inviter.firstName} {row.inviter.lastName}
                            </Link>
                          ) : "—"}
                        </td>
                        <td style={{ fontSize: "0.9em", whiteSpace: "nowrap" }}>
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleDateString("fr-FR", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))}
                    {invitees.invitees?.length === 0 && (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>Aucun inscrit via invitation pour le moment</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* SUSPICIOUS */}
          {activeTab === "suspicious" && (
            <div className="suspicious-section">
              {suspicious?.suspicious?.length > 0 ? (
                suspicious.suspicious.map((inv: any, idx: number) => (
                  <div key={idx} className="suspicious-card">
                    <div className="suspicious-header">
                      <h3>Share Code: {inv.shareCode}</h3>
                      <button
                        className="validate-btn"
                        onClick={() =>
                          handleMarkInvalid(inv._id, "Reviewed and cleared")
                        }
                      >
                        Valider
                      </button>
                    </div>
                    <p className="suspicious-reason">
                      Raison: {inv.rejectionReason}
                    </p>
                    <p className="suspicious-date">
                      Créé: {new Date(inv.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>Aucun cas suspect pour le moment</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return <Layout>{content}</Layout>;
};

export default ReferralAdmin;
