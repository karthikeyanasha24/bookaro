import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const renderSection = (label, value) => {
  if (!value || (typeof value === "object" && Object.keys(value).length === 0)) {
    return (
      <div className="col-span-12 text-sm text-gray-600">No {label.toLowerCase()} available.</div>
    );
  }

  if (typeof value !== "object") {
    return (
      <div className="col-span-12 text-sm text-gray-700">{String(value)}</div>
    );
  }

  return Object.entries(value).map(([key, item]) => (
    <div key={key} className="lg:col-span-4 col-span-12">
      <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block capitalize">{key}</label>
      <p className="text-sm font-normal">{String(item)}</p>
    </div>
  ));
};

const ConfidenceLeadsView = () => {
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
    ApiClient.get(`${shared.detailApi}/${id}`)
      .then((res) => {
        loader(false);
        if (res.success) {
          if (res.data) {
            setData(res.data);
          } else {
            setError("No data returned for this confidence lead.");
          }
        } else {
          setError(res.message || "Failed to load confidence lead detail.");
        }
      })
      .catch(() => {
        loader(false);
        setError("Failed to load confidence lead detail.");
      });
  };

  const buyer = data?.buyerId || data?.buyer || {};
  const property = data?.propertyId || data?.property || {};
  const questionnaire =
    data?.applicationFile || buyer?.declarativeRenterFiles || buyer?.declarativeBuyerFiles ||
    data?.declarativeBuyerFiles || data?.declarativeRenterFiles || {};
  const breakdown = data?.scoreBreakdown || data?.confidenceDetails || data?.calculation || {};

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
              Lead confidence detail
            </h3>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 mb-6">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <div className="shadow-box overflow-hidden rounded-lg bg-white">
              <div className="p-4 border-b font-medium text-[#976DD0] flex items-center gap-3">
                <div className="bg-[#996dca21] p-3 rounded-md">
                  <FaHome className="text-[18px]" />
                </div>
                Buyer information
              </div>
              <div className="grid grid-cols-12 p-4 gap-4">
                <div className="lg:col-span-12 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Full Name</label>
                  <p className="text-sm font-normal">{buyer.fullName || buyer.name || "-"}</p>
                </div>
                <div className="lg:col-span-12 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Email</label>
                  <p className="text-sm font-normal">{buyer.email || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="shadow-box overflow-hidden rounded-lg bg-white">
              <div className="p-4 border-b font-medium text-[#976DD0]">Lead metadata</div>
              <div className="grid grid-cols-12 p-4 gap-4">
                <div className="lg:col-span-6 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Score</label>
                  <p className="text-sm font-normal">
                    {data?.renterScore ?? data?.renterReferenceScore ?? data?.financingReferenceScore ?? data?.financialScore ?? data?.score ?? "-"}
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Score source</label>
                  <p className="text-sm font-normal">
                    {data?.renterScoreSource || data?.renterReferenceScoreSource || data?.financingReferenceScoreSource || data?.scoreSource || "-"}
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Status</label>
                  <p className="text-sm font-normal">
                    {data?.renterScoreStatus || data?.scoreStatus || data?.status || "-"}
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Score label</label>
                  <p className="text-sm font-normal">
                    {data?.renterScoreLabel || data?.scoreLabel || data?.confidenceLabel || "-"}
                  </p>
                </div>
                <div className="lg:col-span-12 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Updated At</label>
                  <p className="text-sm font-normal">
                    {data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : data?.financingReferenceScoreUpdatedAt ? new Date(data.financingReferenceScoreUpdatedAt).toLocaleString() : data?.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="shadow-box overflow-hidden rounded-lg bg-white">
              <div className="p-4 border-b font-medium text-[#976DD0]">Property / lead details</div>
              <div className="grid grid-cols-12 p-4 gap-4">
                <div className="lg:col-span-4 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Property title</label>
                  <p className="text-sm font-normal">{property.propertyTitle || property.title || "-"}</p>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Price</label>
                  <p className="text-sm font-normal">{property.price != null ? `${property.price} €` : "-"}</p>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 block">Location</label>
                  <p className="text-sm font-normal">
                    {[property.city, property.zipcode].filter(Boolean).join(" - ") || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="shadow-box overflow-hidden rounded-lg bg-white">
              <div className="p-4 border-b font-medium text-[#976DD0]">Questionnaire data</div>
              <div className="p-4 grid grid-cols-12 gap-4">
                {renderSection("Questionnaire", questionnaire)}
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="shadow-box overflow-hidden rounded-lg bg-white">
              <div className="p-4 border-b font-medium text-[#976DD0]">Score breakdown</div>
              <div className="p-4 grid grid-cols-12 gap-4">
                {renderSection("Breakdown", breakdown)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfidenceLeadsView;
