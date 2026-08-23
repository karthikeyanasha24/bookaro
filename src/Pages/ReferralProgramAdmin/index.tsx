import React, { useState, useEffect } from "react";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import "./referral-program.css";

/**
 * Admin — Programme de parrainage AnyHomes
 * Rattachements, commissions, codes, payouts et paramètres du programme.
 */

const fmtEur = (cents: number | undefined) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(Number(cents || 0) / 100);

const COMMISSION_STATUS: Record<string, { fr: string; color: string }> = {
  pending: { fr: "En attente", color: "#f59e0b" },
  approved: { fr: "Validée", color: "#16a34a" },
  paid: { fr: "Versée", color: "#2563eb" },
  rejected: { fr: "Rejetée", color: "#dc2626" },
  cancelled: { fr: "Annulée", color: "#6b7280" },
};

const REFERRAL_STATUS: Record<string, { fr: string; color: string }> = {
  active: { fr: "Actif", color: "#16a34a" },
  blocked: { fr: "Bloqué", color: "#dc2626" },
  cancelled: { fr: "Annulé", color: "#6b7280" },
  expired: { fr: "Expiré", color: "#f59e0b" },
};

const REVENUE_TYPES: Record<string, string> = {
  particulier_service: "Service particulier",
  pro_service: "Service pro",
  pro_subscription: "Abonnement pro",
};

const Badge = ({ status, map }: { status: string; map: Record<string, { fr: string; color: string }> }) => {
  const s = map[status] || { fr: status, color: "#6b7280" };
  return (
    <span className="rp-badge" style={{ background: s.color + "18", color: s.color }}>
      {s.fr}
    </span>
  );
};

const Tab = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button className={`rp-tab ${active ? "rp-tab-active" : ""}`} onClick={onClick}>{label}</button>
);

const ReferralProgramAdmin = () => {
  const [tab, setTab] = useState("overview");
  const [overview, setOverview] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    particulierServiceRate: 0.1, proServiceRate: 0.1, proSubscriptionRate: 0.15,
    particulierServiceMonths: 6, proServiceMonths: 6, proSubscriptionMonths: 12,
    validationDelayDays: 14, minimumPayoutAmountCents: 5000,
    maxCommissionPerReferredUserCents: 50000, maxCommissionPerSponsorPerMonthCents: 200000,
    notes: "",
  });

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(""), 3000); };

  const load = async () => {
    try {
      const [ov, re, co, cd, po, st] = await Promise.all([
        ApiClient.get("api/admin/referral-program/overview"),
        ApiClient.get("api/admin/referral-program/referrals", { limit: 100 }),
        ApiClient.get("api/admin/referral-program/commissions", { limit: 100 }),
        ApiClient.get("api/admin/referral-program/codes", { limit: 100 }),
        ApiClient.get("api/admin/referral-program/payouts", { limit: 100 }),
        ApiClient.get("api/admin/referral-program/settings"),
      ]);
      if (ov?.success) setOverview(ov.data);
      if (re?.success) setReferrals(re.data || []);
      if (co?.success) setCommissions(co.data || []);
      if (cd?.success) setCodes(cd.data || []);
      if (po?.success) setPayouts(po.data || []);
      if (st?.success && st.data?.length) {
        setSettings(st.data);
        const latest = st.data[0];
        setForm({
          particulierServiceRate: latest.commissionRates?.particulierService ?? 0.1,
          proServiceRate: latest.commissionRates?.proService ?? 0.1,
          proSubscriptionRate: latest.commissionRates?.proSubscription ?? 0.15,
          particulierServiceMonths: latest.rewardDurationsMonths?.particulierService ?? 6,
          proServiceMonths: latest.rewardDurationsMonths?.proService ?? 6,
          proSubscriptionMonths: latest.rewardDurationsMonths?.proSubscription ?? 12,
          validationDelayDays: latest.validationDelayDays ?? 14,
          minimumPayoutAmountCents: latest.minimumPayoutAmountCents ?? 5000,
          maxCommissionPerReferredUserCents: latest.maxCommissionPerReferredUserCents ?? 50000,
          maxCommissionPerSponsorPerMonthCents: latest.maxCommissionPerSponsorPerMonthCents ?? 200000,
          notes: "",
        });
      }
    } catch (e) {
      flash("Erreur de chargement des données");
    }
  };

  useEffect(() => { load(); }, []);

  const action = async (url: string, body: any = {}) => {
    const res = await ApiClient.post(url, body);
    if (res?.success) { flash("Action effectuée"); load(); } else { flash(res?.message || "Erreur"); }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await ApiClient.post("api/admin/referral-program/settings", {
      commissionRates: {
        particulierService: Number(form.particulierServiceRate),
        proService: Number(form.proServiceRate),
        proSubscription: Number(form.proSubscriptionRate),
      },
      rewardDurationsMonths: {
        particulierService: Number(form.particulierServiceMonths),
        proService: Number(form.proServiceMonths),
        proSubscription: Number(form.proSubscriptionMonths),
      },
      validationDelayDays: Number(form.validationDelayDays),
      minimumPayoutAmountCents: Number(form.minimumPayoutAmountCents),
      maxCommissionPerReferredUserCents: Number(form.maxCommissionPerReferredUserCents) || null,
      maxCommissionPerSponsorPerMonthCents: Number(form.maxCommissionPerSponsorPerMonthCents) || null,
      notes: form.notes || "Mise à jour admin",
    });
    if (res?.success) { flash("Paramètres enregistrés"); load(); } else { flash(res?.message || "Erreur"); }
  };

  return (
    <Layout>
      <div className="rp-container">
        <h2 className="rp-title">Programme de parrainage</h2>
        <p className="rp-subtitle">Gestion des rattachements, commissions, codes et paramètres du programme.</p>
        {notice && <div className="rp-notice">{notice}</div>}

        <div className="rp-tabs">
          <Tab active={tab === "overview"} onClick={() => setTab("overview")} label="Vue d'ensemble" />
          <Tab active={tab === "referrals"} onClick={() => setTab("referrals")} label="Rattachements" />
          <Tab active={tab === "commissions"} onClick={() => setTab("commissions")} label="Commissions" />
          <Tab active={tab === "codes"} onClick={() => setTab("codes")} label="Codes" />
          <Tab active={tab === "payouts"} onClick={() => setTab("payouts")} label="Versements" />
          <Tab active={tab === "settings"} onClick={() => setTab("settings")} label="Paramètres" />
        </div>

        {tab === "overview" && (
          <div className="rp-kpi-grid">
            {[
              ["Rattachements", overview?.totalReferrals || 0],
              ["Commissions", overview?.totalCommissions || 0],
              ["En attente", fmtEur(overview?.pendingCommissionsCents)],
              ["Validées", fmtEur(overview?.approvedCommissionsCents)],
              ["Versées", fmtEur(overview?.paidCommissionsCents)],
              ["Total versé", fmtEur(overview?.totalPayoutsCents)],
              ["Codes générés", overview?.totalCodes || 0],
            ].map(([l, v]) => (
              <div key={l as string} className="rp-kpi">
                <p className="rp-kpi-label">{l}</p>
                <p className="rp-kpi-value">{v}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "referrals" && (
          <div className="rp-card">
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>Parrain</th><th>Filleul</th><th>Type</th><th>Code</th><th>Date</th><th>Statut</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.length === 0 && <tr><td colSpan={7} className="rp-empty">Aucun rattachement.</td></tr>}
                  {referrals.map((r: any) => (
                    <tr key={r._id}>
                      <td>{r.sponsorUserId?.fullName || r.sponsorUserId?.email || "-"}</td>
                      <td>{r.referredUserId?.fullName || r.referredUserId?.email || "-"}</td>
                      <td>{r.referredUserType === "pro" ? "Pro" : "Particulier"}</td>
                      <td className="rp-mono">{r.referralCode}</td>
                      <td>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td><Badge status={r.status} map={REFERRAL_STATUS} /></td>
                      <td>
                        {r.status === "active"
                          ? <button className="rp-link rp-link-red" onClick={() => action(`api/admin/referral-program/referrals/${r._id}/block`, { reason: "Bloqué par admin" })}>Bloquer</button>
                          : <button className="rp-link rp-link-green" onClick={() => action(`api/admin/referral-program/referrals/${r._id}/unblock`)}>Débloquer</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "commissions" && (
          <div className="rp-card">
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>Parrain</th><th>Filleul</th><th>Type</th><th>Base HT</th><th>Taux</th><th>Commission</th><th>Statut</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.length === 0 && <tr><td colSpan={8} className="rp-empty">Aucune commission.</td></tr>}
                  {commissions.map((c: any) => (
                    <tr key={c._id}>
                      <td>{c.sponsorUserId?.fullName || c.sponsorUserId?.email || "-"}</td>
                      <td>{c.referredUserId?.fullName || c.referredUserId?.email || "-"}</td>
                      <td>{REVENUE_TYPES[c.revenueType] || c.revenueType}</td>
                      <td>{fmtEur(c.baseAmountHtCents)}</td>
                      <td>{Math.round((c.commissionRate || 0) * 100)}%</td>
                      <td className="rp-strong">{fmtEur(c.commissionAmountCents)}</td>
                      <td><Badge status={c.status} map={COMMISSION_STATUS} /></td>
                      <td>
                        {c.status === "pending" && <button className="rp-link rp-link-green" onClick={() => action(`api/admin/referral-program/commissions/${c._id}/approve`)}>Valider</button>}
                        {(c.status === "pending" || c.status === "approved") && <button className="rp-link rp-link-red" onClick={() => action(`api/admin/referral-program/commissions/${c._id}/reject`, { reason: "Rejeté par admin" })}>Rejeter</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "codes" && (
          <div className="rp-card">
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead><tr><th>Utilisateur</th><th>Code</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {codes.length === 0 && <tr><td colSpan={4} className="rp-empty">Aucun code.</td></tr>}
                  {codes.map((c: any) => (
                    <tr key={c._id}>
                      <td>{c.userId?.fullName || c.userId?.email || "-"}</td>
                      <td className="rp-mono">{c.code}</td>
                      <td>{c.isActive ? "Actif" : "Désactivé"}</td>
                      <td>{c.isActive && <button className="rp-link rp-link-red" onClick={() => action(`api/admin/referral-program/codes/${c._id}/disable`, { reason: "Désactivé par admin" })}>Désactiver</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "payouts" && (
          <div className="rp-card">
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead><tr><th>Parrain</th><th>Période</th><th>Montant</th><th>Statut</th><th>Transfert</th><th>Actions</th></tr></thead>
                <tbody>
                  {payouts.length === 0 && <tr><td colSpan={6} className="rp-empty">Aucun versement.</td></tr>}
                  {payouts.map((p: any) => (
                    <tr key={p._id}>
                      <td>{p.sponsorUserId?.fullName || p.sponsorUserId?.email || "-"}</td>
                      <td>{new Date(p.periodStart).toLocaleDateString("fr-FR")} → {new Date(p.periodEnd).toLocaleDateString("fr-FR")}</td>
                      <td className="rp-strong">{fmtEur(p.totalAmountCents)}</td>
                      <td>{p.status}</td>
                      <td className="rp-mono">{p.provider?.transferId || "-"}</td>
                      <td>{p.status === "failed" && <button className="rp-link rp-link-blue" onClick={() => action(`api/admin/referral-program/payouts/${p._id}/retry`)}>Réessayer</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="rp-settings-grid">
            <form className="rp-card rp-form" onSubmit={saveSettings}>
              <h3 className="rp-form-title">Nouvelle version des paramètres</h3>
              <div className="rp-form-grid">
                <label>Taux particulier (%)<input type="number" step="0.01" value={form.particulierServiceRate * 100} onChange={(e) => setForm({ ...form, particulierServiceRate: Number(e.target.value) / 100 })} /></label>
                <label>Taux pro services (%)<input type="number" step="0.01" value={form.proServiceRate * 100} onChange={(e) => setForm({ ...form, proServiceRate: Number(e.target.value) / 100 })} /></label>
                <label>Taux pro abonnement (%)<input type="number" step="0.01" value={form.proSubscriptionRate * 100} onChange={(e) => setForm({ ...form, proSubscriptionRate: Number(e.target.value) / 100 })} /></label>
                <label>Durée particulier (mois)<input type="number" value={form.particulierServiceMonths} onChange={(e) => setForm({ ...form, particulierServiceMonths: Number(e.target.value) })} /></label>
                <label>Durée pro services (mois)<input type="number" value={form.proServiceMonths} onChange={(e) => setForm({ ...form, proServiceMonths: Number(e.target.value) })} /></label>
                <label>Durée pro abonnement (mois)<input type="number" value={form.proSubscriptionMonths} onChange={(e) => setForm({ ...form, proSubscriptionMonths: Number(e.target.value) })} /></label>
                <label>Délai validation (jours)<input type="number" value={form.validationDelayDays} onChange={(e) => setForm({ ...form, validationDelayDays: Number(e.target.value) })} /></label>
                <label>Minimum payout (€)<input type="number" value={form.minimumPayoutAmountCents / 100} onChange={(e) => setForm({ ...form, minimumPayoutAmountCents: Number(e.target.value) * 100 })} /></label>
                <label>Plafond / filleul (€)<input type="number" value={(form.maxCommissionPerReferredUserCents || 0) / 100} onChange={(e) => setForm({ ...form, maxCommissionPerReferredUserCents: Number(e.target.value) * 100 })} /></label>
                <label>Plafond / mois / parrain (€)<input type="number" value={(form.maxCommissionPerSponsorPerMonthCents || 0) / 100} onChange={(e) => setForm({ ...form, maxCommissionPerSponsorPerMonthCents: Number(e.target.value) * 100 })} /></label>
              </div>
              <label>Notes<input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
              <button type="submit" className="rp-btn">Créer une nouvelle version</button>
            </form>
            <div className="rp-card">
              <h3 className="rp-form-title">Historique des versions</h3>
              {(settings || []).map((s: any) => (
                <div key={s._id} className="rp-version">
                  <p className="rp-version-title">Version {s.version} {s.isActive && <span className="rp-active">active</span>}</p>
                  <p className="rp-version-desc">
                    Particulier {Math.round((s.commissionRates?.particulierService || 0) * 100)}% / {s.rewardDurationsMonths?.particulierService} mois · Pro {Math.round((s.commissionRates?.proService || 0) * 100)}% / {s.rewardDurationsMonths?.proService} mois · Abo {Math.round((s.commissionRates?.proSubscription || 0) * 100)}% / {s.rewardDurationsMonths?.proSubscription} mois
                  </p>
                  <p className="rp-version-notes">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReferralProgramAdmin;
