import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import Layout from "../../components/global/layout";

const WhiteLabelStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      ApiClient.get("user/listing", {
        accountType: "pro",
        whiteLabelActive: "true",
        count: 10000,
      }),
      ApiClient.get("user/listing", { whiteLabel: "true", count: 10000 }),
    ]).then(([agenciesRes, usersRes]) => {
      const agencies = agenciesRes?.data || [];
      const users = usersRes?.data || [];
      const totalProperties = agencies.reduce(
        (s, a) => s + (a._count?.properties || 0),
        0
      );
      setStats({
        totalAgencies: agencies.length,
        totalUsers: users.length,
        totalProperties,
        avgPropertiesPerUser:
          users.length > 0 ? (totalProperties / users.length).toFixed(1) : 0,
      });
    });
  }, []);

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">
            Indicateurs Marque Blanche
          </h3>
        </div>
      </div>

      {!stats ? (
        <div className="text-center py-4 mt-6">
          <img
            src="/assets/img/loader.gif"
            className="pageLoader"
            alt="loader"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="shadow-box bg-white rounded-lg p-6">
            <p className="text-sm text-[#6B7280] mb-1">Agences actives</p>
            <p className="text-3xl font-bold text-[#976DD0]">
              {stats.totalAgencies}
            </p>
          </div>
          <div className="shadow-box bg-white rounded-lg p-6">
            <p className="text-sm text-[#6B7280] mb-1">
              Utilisateurs white-label
            </p>
            <p className="text-3xl font-bold text-[#976DD0]">
              {stats.totalUsers}
            </p>
          </div>
          <div className="shadow-box bg-white rounded-lg p-6">
            <p className="text-sm text-[#6B7280] mb-1">Biens créés</p>
            <p className="text-3xl font-bold text-[#976DD0]">
              {stats.totalProperties}
            </p>
          </div>
          <div className="shadow-box bg-white rounded-lg p-6">
            <p className="text-sm text-[#6B7280] mb-1">
              Moy. biens / utilisateur
            </p>
            <p className="text-3xl font-bold text-[#976DD0]">
              {stats.avgPropertiesPerUser}
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};
export default WhiteLabelStats;
