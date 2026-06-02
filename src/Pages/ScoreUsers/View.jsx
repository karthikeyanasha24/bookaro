import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import { FaArrowLeft, FaUser } from "react-icons/fa";

const View = () => {
  const [data, setData] = useState();
  const [error, setError] = useState("");
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = () => {
    setError("");
    loader(true);
    ApiClient.get(`${shared.detailApi}/${id}`).then((res) => {
      loader(false);
      if (res.success) {
        if (res.data) {
          setData(res.data);
        } else {
          setError("No data returned for this score.");
        }
      } else {
        setError(res.message || "Failed to load score detail.");
      }
    }).catch(() => {
      loader(false);
      setError("Failed to load score detail.");
    });
  };

  return (
    <Layout>
      <div className="wrapper_section">
        <div className="flex items-center mb-8 gap-3">
          <Tooltip placement="top" title="Back">
            <span
              onClick={() => history(-1)}
              className="!px-4 py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#8352c2] border transition-all cursor-pointer"
            >
              <FaArrowLeft className="mr-2" /> Retour
            </span>
          </Tooltip>
          <div>
            <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
              User score detail
            </h3>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 mb-6">
            {error}
          </div>
        ) : null}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="shadow-box overflow-hidden rounded-lg bg-white">
              <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
                <div className="bg-[#996dca21] p-3 rounded-md">
                  <FaUser className="text-[18px]" />
                </div>
                Basic information
              </div>
              <div className="grid grid-cols-12 p-4 gap-4">
                <div className="lg:col-span-4 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Full Name</label>
                  <p className="text-sm font-normal">{data?.fullName || "-"}</p>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Email</label>
                  <p className="text-sm font-normal">{data?.email || "-"}</p>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Created At</label>
                  <p className="text-sm font-normal">{data?.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}</p>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">User score</label>
                  <p className="text-sm font-normal">{data?.financingReferenceScore ?? "-"}</p>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Score source</label>
                  <p className="text-sm font-normal">{data?.financingReferenceScoreSource || "-"}</p>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Score updated</label>
                  <p className="text-sm font-normal">{data?.financingReferenceScoreUpdatedAt ? new Date(data.financingReferenceScoreUpdatedAt).toLocaleString() : "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="shadow-box overflow-hidden rounded-lg bg-white">
              <div className="p-4 border-b font-medium text-[#976DD0]">Questionnaire answers</div>
              <div className="p-4 grid grid-cols-12 gap-4">
                {data?.declarativeBuyerFiles ? (
                  Object.entries(data.declarativeBuyerFiles).map(([key, value]) => (
                    <div key={key} className="lg:col-span-4 col-span-12">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block capitalize">{key}</label>
                      <p className="text-sm font-normal">{String(value)}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-12 text-sm text-gray-600">No questionnaire data available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default View;
