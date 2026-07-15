import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import moment from "moment";
import ReactECharts from 'echarts-for-react';
import { MdOutlineRealEstateAgent, MdFeaturedPlayList, MdErrorOutline } from "react-icons/md";
import { FiActivity, FiCheckCircle, FiClock } from "react-icons/fi";
import { PiHouse } from "react-icons/pi";
import { FaRegEye } from "react-icons/fa";

const MoteurImmoDashboard = () => {
  const history = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loader(true);
    ApiClient.get("admin/moteurimmo/stats").then((res) => {
      if (res.success) setStats(res.data);
      loader(false);
    }).catch(() => loader(false));
  }, []);

  const runChartOption = stats?.runsTimeline ? {
    title: { text: 'Annonces importées (30 derniers jours)' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: stats.runsTimeline.map(r => r._id) },
    yAxis: { type: 'value' },
    series: [{
      name: 'Annonces',
      type: 'bar',
      data: stats.runsTimeline.map(r => r.totalItems),
      itemStyle: { color: '#976DD0' },
    }],
  } : null;

  const statusLabel = (s) => {
    if (s === 'completed') return { text: 'Terminé', cls: 'text-green-600 bg-green-100' };
    if (s === 'running') return { text: 'En cours', cls: 'text-blue-600 bg-blue-100' };
    if (s === 'failed') return { text: 'Échec', cls: 'text-red-600 bg-red-100' };
    return { text: s, cls: 'text-gray-600 bg-gray-100' };
  };

  const changeTypeLabel = (type) => {
    const map = {
      priceChanged: 'Prix changé',
      statusChanged: 'Statut changé',
      photosAdded: 'Photos ajoutées',
      moteurimmoLeavingMarket: 'Retiré du marché',
      propertyCreated: 'Nouveau bien',
    };
    return map[type] || type;
  };

  const viewListing = (id) => history(`/moteur-immo/detail/${id}`);

  return (
    <Layout>
      <main className="space-y-5">
        <div className="flex justify-between gap-2 items-center">
          <h2 className="xl:text-[24px] lg:text-[22px] md:text-[20px] sm:text-[18px] text-[16px] text-[#47525E] font-medium">
            Dashboard MoteurImmo
          </h2>
        </div>

        {stats && (
          <>
            <div className="bg-[#FFF] py-5 sm:px-12 px-7 rounded-[20px]">
              <div className="flex gap-2 items-center justify-center mb-5">
                <MdOutlineRealEstateAgent className="text-[#47525E] sm:text-[24px] text-[22px]" />
                <span className="xl:text-[20px] sm:text-[18px] text-[#47525E]">Vue d'ensemble</span>
              </div>
              <div className="grid xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2">
                  <PiHouse className="text-[#976DD0] sm:text-[20px] text-[18px]" />
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B]">Annonces importées</p>
                  <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold">{stats.totalExternalListings}</h2>
                  <p className="sm:text-[12px] text-[10px] text-[#343F4B]">Profils AnyHomes liés : {stats.totalPropertiesImported}</p>
                </div>
                <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2">
                  <FiActivity className="text-[#976DD0] sm:text-[20px] text-[18px]" />
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B]">Runs de sync</p>
                  <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold">{stats.totalRuns}</h2>
                  <p className="sm:text-[12px] text-[10px] text-[#343F4B]">{stats.totalItemsImported} annonces traitées</p>
                </div>
                <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2">
                  <FiCheckCircle className="text-[#976DD0] sm:text-[20px] text-[18px]" />
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B]">Taux de succès</p>
                  <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold">{stats.successRate}%</h2>
                </div>
                <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2">
                  <MdErrorOutline className="text-[#976DD0] sm:text-[20px] text-[18px]" />
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B]">Runs en échec</p>
                  <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold">{stats.failedRuns}</h2>
                </div>
                <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2">
                  <MdFeaturedPlayList className="text-[#976DD0] sm:text-[20px] text-[18px]" />
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B]">Dernières 24h</p>
                  <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold">
                    {stats.runsTimeline?.filter(r => r._id === moment().format('YYYY-MM-DD')).reduce((s, r) => s + r.totalItems, 0) || 0}
                  </h2>
                </div>
              </div>

              {runChartOption && (
                <div className="mt-8 border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3">
                  <ReactECharts option={runChartOption} style={{ height: 350 }} opts={{ renderer: 'svg' }} />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              <div className="bg-[#FFF] py-5 sm:px-8 px-5 rounded-[20px]">
                <h2 className="lg:text-[20px] md:text-[18px] sm:text-[16px] text-[15px] text-[#343F4B] font-semibold mb-4">Derniers runs</h2>
                <div className="overflow-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead className="text-[#343F4B] sm:text-[13px] text-[11px] font-semibold">
                      <tr>
                        <th className="text-left py-2 px-2">Run</th>
                        <th className="text-left py-2 px-2">Date</th>
                        <th className="text-left py-2 px-2">Durée</th>
                        <th className="text-left py-2 px-2">Total</th>
                        <th className="text-left py-2 px-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-[#343F4B] sm:text-[12px] text-[10px]">
                      {stats.lastRuns?.map((run) => {
                        const dur = run.duration ? `${Math.floor(run.duration / 60)}min ${run.duration % 60}s` : '--';
                        const st = statusLabel(run.status);
                        return (
                          <tr key={run._id} className="cursor-pointer hover:bg-gray-50" onClick={() => history('/moteur-immo-runs')}>
                            <td className="text-left py-2 px-2">{run.runRef || '--'}</td>
                            <td className="text-left py-2 px-2">{moment(run.startDate).format('DD/MM HH:mm')}</td>
                            <td className="text-left py-2 px-2">{dur}</td>
                            <td className="text-left py-2 px-2">{run.totalCount || 0}</td>
                            <td className="text-left py-2 px-2"><span className={`px-2 py-0.5 rounded-full text-[11px] ${st.cls}`}>{st.text}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#FFF] py-5 sm:px-8 px-5 rounded-[20px]">
                <h2 className="lg:text-[20px] md:text-[18px] sm:text-[16px] text-[15px] text-[#343F4B] font-semibold mb-4">Derniers changements</h2>
                <div className="overflow-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead className="text-[#343F4B] sm:text-[13px] text-[11px] font-semibold">
                      <tr>
                        <th className="text-left py-2 px-2">Type</th>
                        <th className="text-left py-2 px-2">Bien</th>
                        <th className="text-left py-2 px-2">Date</th>
                        <th className="text-left py-2 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-[#343F4B] sm:text-[12px] text-[10px]">
                      {stats.recentChanges?.map((evt) => {
                        const prop = evt.propertyId || {};
                        const meta = evt.meta || {};
                        const detail = changeTypeLabel(evt.type);
                        let extra = '';
                        if (evt.type === 'priceChanged') extra = `${meta.old || '?'}€ → ${meta.new || '?'}€`;
                        else if (evt.type === 'photosAdded') extra = `+${meta.count || 0} photo(s)`;
                        else if (evt.type === 'statusChanged') extra = `${meta.from || '?'} → ${meta.to || '?'}`;
                        else if (evt.type === 'moteurimmoLeavingMarket') extra = meta.reason || '';
                        return (
                          <tr key={evt._id}>
                            <td className="text-left py-2 px-2">
                              <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded">{detail}</span>
                              {extra && <span className="block text-[10px] text-gray-500 mt-0.5">{extra}</span>}
                            </td>
                            <td className="text-left py-2 px-2">
                              {prop?.propertyTitle?.substring(0, 35) || prop?._id || '--'}
                              <span className="block text-[10px] text-gray-400">{prop?.city || ''}</span>
                            </td>
                            <td className="text-left py-2 px-2">{moment(evt.createdAt).format('DD/MM HH:mm')}</td>
                            <td className="text-left py-2 px-2">
                              {prop?._id && (
                                <button
                                  className="text-[#976DD0] hover:text-purple-800"
                                  onClick={() => window.open(`/property/admin/${prop._id}`, '_blank')}
                                >
                                  <FaRegEye />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
};

export default MoteurImmoDashboard;
