import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../methods/api/apiClient";
import Layout from "../../components/global/layout";

const WhiteLabelPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get("plan/listing")
      .then((res) => {
        if (res?.success) {
          setPlans(
            res.data.map((itm) => {
              itm.id = itm._id;
              return itm;
            })
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleWhiteLabel = async (planId, current) => {
    const res = await ApiClient.put("plan/update", {
      id: planId,
      whiteLabelEnabled: !current,
    });
    if (res?.success) {
      setPlans(
        plans.map((p) =>
          p._id === planId ? { ...p, whiteLabelEnabled: !current } : p
        )
      );
      toast.success("Plan mis à jour");
    }
  };

  const updateMaxLeads = async (planId, value) => {
    const res = await ApiClient.put("plan/update", {
      id: planId,
      whiteLabelMaxLeads: Number(value),
    });
    if (res?.success) toast.success("Seuil mis à jour");
  };

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">
            Plans — Option Marque Blanche
          </h3>
        </div>
      </div>
      <div className="shadow-box w-full bg-white rounded-lg mt-6">
        {loading ? (
          <div className="text-center py-4">
            <img
              src="/assets/img/loader.gif"
              className="pageLoader"
              alt="loader"
            />
          </div>
        ) : (
          <div className="relative table-responsive overflow-x-auto border border-[#eee] sm:rounded-lg">
            <table className="table w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 capitalize bg-[#996dca1f]">
                <tr>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">White-label</th>
                  <th className="px-6 py-3">Max leads</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#111827]">
                      {p.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        onClick={() => toggleWhiteLabel(p._id, p.whiteLabelEnabled)}
                        className={`cursor-pointer text-sm px-3 h-[30px] inline-flex items-center justify-center border border-[#EBEBEB] rounded capitalize ${
                          p.whiteLabelEnabled
                            ? "bg-[#976DD0] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {p.whiteLabelEnabled ? "Activé" : "Désactivé"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.whiteLabelEnabled ? (
                        <input
                          type="number"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-24 p-1.5"
                          defaultValue={p.whiteLabelMaxLeads || 50}
                          onBlur={(e) =>
                            updateMaxLeads(p._id, e.target.value)
                          }
                        />
                      ) : (
                        <span className="text-[#9CA3AF]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {plans.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-[#9CA3AF]">
                      Aucun plan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default WhiteLabelPlans;
