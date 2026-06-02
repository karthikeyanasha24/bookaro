import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import shared from "./shared";
import Layout from "../../components/global/layout";

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ApiClient.get(shared.detailApi, { id }).then((res) => {
      if (res.success) {
        setItem(res.data || null);
      }
      setLoading(false);
    });
  }, [id]);

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">Onboarding detail</h3>
          <p className="text-sm text-[#6B7280] mt-1">Review the selected user's onboarding progress.</p>
        </div>
        <button
          onClick={() => navigate(`/${shared.url}`)}
          className="bg-primary leading-10 h-10 inline-flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg"
        >
          Back to list
        </button>
      </div>

      <div className="shadow-box w-full bg-white rounded-lg mt-6 p-6">
        {loading ? (
          <div className="text-center py-6">
            <img src="/assets/img/loader.gif" className="pageLoader" alt="Loading" />
          </div>
        ) : item ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold mb-4">User information</h4>
              <div className="space-y-3 text-sm text-[#374151]">
                <div>
                  <strong>Full name:</strong> {item.fullName || "--"}
                </div>
                <div>
                  <strong>Email:</strong> {item.email || "--"}
                </div>
                <div>
                  <strong>Location:</strong> {item.city || ""} {item.state || ""} {item.country || ""}
                </div>
                <div>
                  <strong>Profile:</strong> {item.profile || "--"}
                </div>
                <div>
                  <strong>Objective:</strong> {item.objective || "--"}
                </div>
                <div>
                  <strong>Completion:</strong> {item.completionPercent ?? 0}%
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Action status</h4>
              <div className="space-y-2 text-sm">
                {item.completions && Object.keys(item.completions).length ? (
                  Object.entries(item.completions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-4 py-3 bg-[#F9FAFB]">
                      <span className="capitalize">{key.replace(/_/g, " ")}</span>
                      <span className={`rounded-full px-3 py-1 text-xs ${value === "done" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                        {value}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[#6B7280]">No onboarding actions recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-[#6B7280]">User onboarding detail could not be loaded.</div>
        )}
      </div>
    </Layout>
  );
};

export default View;
