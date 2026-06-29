import { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import LineChart from '../../components/common/LineChart';

const PERIODS = [
  { key: 'day', label: 'Journalier (30j)' },
  { key: 'week', label: 'Hebdomadaire (12s)' },
  { key: 'month', label: 'Mensuel (12m)' },
];

const fmt = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const pct = (arr, key) => {
  if (!arr || arr.length < 2) return null;
  const last = arr[arr.length - 1]?.[key] || 0;
  const prev = arr[arr.length - 2]?.[key] || 0;
  if (prev === 0) return last > 0 ? '+100%' : null;
  const diff = ((last - prev) / prev) * 100;
  return (diff >= 0 ? '+' : '') + diff.toFixed(0) + '%';
};

const KpiCard = ({ label, value, badge, badgeColor }) => (
  <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-5 flex flex-col gap-1 min-w-[160px]">
    <span className="text-[13px] text-gray-400 font-medium">{label}</span>
    <div className="flex items-end gap-2">
      <span className="text-[28px] font-bold text-gray-800">{value ?? '—'}</span>
      {badge && <span className={`text-[13px] font-semibold mb-1 ${badgeColor || 'text-green-500'}`}>{badge}</span>}
    </div>
  </div>
);

export default function QRCodeStats() {
  const [period, setPeriod] = useState('day');
  const [stats, setStats] = useState(null);
  const [flyers, setFlyers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingFlyers, setLoadingFlyers] = useState(true);
  const LIMIT = 20;

  const loadStats = useCallback(async (p) => {
    setLoading(true);
    const res = await ApiClient.get('property/qr-code/admin/stats', { period: p });
    if (res?.success) setStats(res.data);
    setLoading(false);
  }, []);

  const loadFlyers = useCallback(async (pg) => {
    setLoadingFlyers(true);
    const res = await ApiClient.get('property/qr-code/admin/flyers', { page: pg, limit: LIMIT });
    if (res?.success) { setFlyers(res.data); setTotal(res.total); }
    setLoadingFlyers(false);
  }, []);

  useEffect(() => { loadStats(period); }, [period, loadStats]);
  useEffect(() => { loadFlyers(page); }, [page, loadFlyers]);

  const chartData = (stats?.evolution || []).map(d => ({
    date: d.date,
    created: d.created,
    scans: d.scans,
  }));

  const createdPct = pct(stats?.evolution, 'created');
  const scansPct = pct(stats?.evolution, 'scans');

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-[22px] font-bold text-gray-800 mb-1">QR Code — Statistiques globales</h1>
        <p className="text-[14px] text-gray-400 mb-6">Suivi de la création et des scans de tous les QR codes de la plateforme.</p>

        {/* KPI Cards */}
        <div className="flex flex-wrap gap-4 mb-8">
          <KpiCard label="QR codes générés" value={stats?.totalFlyers ?? '…'} badge={createdPct} badgeColor={createdPct?.startsWith('+') ? 'text-green-500' : 'text-red-400'} />
          <KpiCard label="Total scans" value={stats?.totalScans ?? '…'} badge={scansPct} badgeColor={scansPct?.startsWith('+') ? 'text-green-500' : 'text-red-400'} />
          <KpiCard label="QR avec au moins 1 scan" value={stats?.flyersWithScans ?? '…'} />
          <KpiCard label="Moy. scans / QR" value={stats?.avgScans ?? '…'} />
          <KpiCard label="Dernier scan" value={fmt(stats?.lastScanAt)} />
        </div>

        {/* Period toggle + Chart */}
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-gray-700">Évolution — Créations &amp; Scans</h2>
            <div className="flex gap-2">
              {PERIODS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium border transition-colors ${
                    period === p.key
                      ? 'bg-[#976DD0] text-white border-[#976DD0]'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-[#976DD0] hover:text-[#976DD0]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center text-gray-300 text-[14px]">Chargement…</div>
          ) : chartData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-gray-300 text-[14px]">Aucune donnée sur cette période.</div>
          ) : (
            <LineChart
              data={chartData}
              legends={[
                { key: 'created', label: 'QR créés' },
                { key: 'scans', label: 'Scans' },
              ]}
            />
          )}
        </div>

        {/* Flyers table */}
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-gray-700">Liste des QR codes ({total})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-medium">
                  <th className="pb-2 pr-4">Bien</th>
                  <th className="pb-2 pr-4">Réf.</th>
                  <th className="pb-2 pr-4">Propriétaire</th>
                  <th className="pb-2 pr-4 text-center">Scans</th>
                  <th className="pb-2 pr-4">Dernier scan</th>
                  <th className="pb-2 pr-4">Créé le</th>
                  <th className="pb-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {loadingFlyers ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-300">Chargement…</td></tr>
                ) : flyers.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-300">Aucun QR code.</td></tr>
                ) : flyers.map(f => (
                  <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2 pr-4 max-w-[180px] truncate font-medium text-gray-700">
                      {f.propertyId?.title || <span className="text-gray-300 italic">Inconnu</span>}
                    </td>
                    <td className="py-2 pr-4 text-gray-400 font-mono text-[12px]">
                      {f.propertyId?.propertyRef || '—'}
                    </td>
                    <td className="py-2 pr-4 text-gray-500">
                      {f.ownerId ? `${f.ownerId.firstName || ''} ${f.ownerId.lastName || ''}`.trim() || f.ownerId.email : '—'}
                    </td>
                    <td className="py-2 pr-4 text-center">
                      <span className={`inline-block min-w-[36px] text-center px-2 py-0.5 rounded-full text-[12px] font-semibold ${
                        (f.scansCount || 0) > 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'
                      }`}>{f.scansCount || 0}</span>
                    </td>
                    <td className="py-2 pr-4 text-gray-400">{fmtDate(f.lastScanAt)}</td>
                    <td className="py-2 pr-4 text-gray-400">{fmtDate(f.createdAt)}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        f.status === 'ready' ? 'bg-green-100 text-green-600' :
                        f.status === 'generating' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-500'
                      }`}>{f.status || 'ready'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-[13px] text-gray-400">
                Page {page} / {Math.ceil(total / LIMIT)} — {total} QR codes
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 rounded border border-gray-200 text-[13px] disabled:opacity-40 hover:border-[#976DD0] hover:text-[#976DD0]"
                >
                  ← Précédent
                </button>
                <button
                  disabled={page >= Math.ceil(total / LIMIT)}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 rounded border border-gray-200 text-[13px] disabled:opacity-40 hover:border-[#976DD0] hover:text-[#976DD0]"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
