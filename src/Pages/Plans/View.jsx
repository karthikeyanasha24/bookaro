import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import shared from "./shared";

const OTHER_DETAILS_LABELS = {
  msgToDirectory: "Send message to owners of properties listed in Directory",
  msgToSaleRent: "Send message to owner of property listed for sale or rent",
  accessToOffMarketProps: "Access to Off-Market properties",
  browsePastTrans: "Browse past transaction database",
  browseBuildingPermits: "Browse building permits",
  trainingOnBuying: "Training on buying a property",
  createPropProfileSaleRentDirectory:
    "Create property profiles under Sale, rental or Directory",
  listPropAsOffMarket: "List properties under Off-Market section",
  msgBox: "Message box",
  leadFilter: "Lead filtering",
  realEstateMinitoring: "Real-estate transaction monitoring tool",
  trainingOnSelling: "Training on selling your property",
  profileSection: "Profile section",
  leadsLevel: "Leads level of financiability check",
  marketplaceServices: "MarketPlace — nombre de services",
};

const otherDetailValue = (item) => {
  if (!item) return "--";
  if (item.key === "unlimited") return "Unlimited";
  if (item.key === "custom") return item.value || "--";
  return item.value || "--";
};

const dash = (v) => (v === undefined || v === null || v === "" ? "--" : v);

const View = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [])

  const getDetail = () => {
    loader(true)
    ApiClient.get(shared.detailApi, { id: id }).then((res) => {
      loader(false)
      if (res.success) {
        setData(res.data)
      }
    })
  }

  return (
    <>
      <Layout>
        <div className="wrapper_section">
          <div className="flex items-center mb-8">
            <Tooltip placement="top" title="Back">
              <span
                onClick={() => navigate(-1)}
                className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3"
              >
                <i className="fa fa-angle-left text-lg"></i>
              </span>
            </Tooltip>
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {shared.addTitle} Details
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                <div>
                  <h4 className="p-4 bg-[#976DD01a] font-medium">Basic Information</h4>
                </div>
                <div className="grid grid-cols-12 gap-5 p-4">
                  {data?.name && <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Name:</label>
                    <p className="text-sm font-normal">
                      {data && data?.name}
                    </p>
                  </div>}

                  {data?.role && <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Role:</label>
                    <p className="text-sm font-normal">
                      {data?.role}
                    </p>
                  </div>}

                  <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Plan Type:</label>
                    <p className="text-sm font-normal">
                      {dash(data?.planType)}
                    </p>
                  </div>

                  <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">User type:</label>
                    <p className="text-sm font-normal capitalize">
                      {dash(data?.userType)}
                    </p>
                  </div>

                  <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Status:</label>
                    <p className="text-sm font-normal">
                      {dash(data?.status)}
                    </p>
                  </div>

                  {/* ── Pricing ───────────────────────────────────────────*/}
                  <div className="col-span-full">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-2 block border-b pb-2">
                      Pricing
                    </label>
                    <div className="grid grid-cols-12 gap-4 mt-2">
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">Prix mensuel :</label>
                        <p className="text-sm font-normal">
                          {dash(data?.pricing?.[0]?.unit_amount)} €{" "}
                          <span className="text-[12px] text-gray-500">
                            {data?.pricing?.[0]?.interval || "month"}
                          </span>
                        </p>
                      </div>
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">Prix annuel :</label>
                        <p className="text-sm font-normal">
                          {dash(data?.pricing?.[1]?.unit_amount)} €{" "}
                          <span className="text-[12px] text-gray-500">
                            {data?.pricing?.[1]?.interval || "year"}
                          </span>
                        </p>
                      </div>
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">
                          Réduction annuelle :
                        </label>
                        <p className="text-sm font-normal">
                          {dash(data?.annualDiscount) === "--" ? "--" : `${data?.annualDiscount} %`}
                        </p>
                        {Number(data?.pricing?.[0]?.unit_amount) > 0 &&
                          Number(data?.pricing?.[1]?.unit_amount) > 0 && (
                            <p className="text-[12px] text-[#329A90] mt-0.5">
                              Économisez{" "}
                              {Math.max(
                                0,
                                Number(data?.pricing?.[0]?.unit_amount) * 12 -
                                  Number(data?.pricing?.[1]?.unit_amount)
                              )}{" "}
                              €/an
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* ── Quotas ───────────────────────────────────────────*/}
                  <div className="col-span-full">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-2 block border-b pb-2">
                      Quotas
                    </label>
                    <div className="grid grid-cols-12 gap-4 mt-2">
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">
                          Max number of lead per property :
                        </label>
                        <p className="text-sm font-normal">{dash(data?.numberOfInterest)}</p>
                      </div>
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">No. of Property :</label>
                        <p className="text-sm font-normal">{dash(data?.numberOfProperty)}</p>
                      </div>
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">Off-Market :</label>
                        <p className="text-sm font-normal">
                          {data?.offMarket === true ? "Yes" : data?.offMarket === false ? "No" : "--"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Options du plan ───────────────────────────────────*/}
                  <div className="col-span-full">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-2 block border-b pb-2">
                      Options du plan
                    </label>
                    <div className="grid grid-cols-12 gap-4 mt-2">
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">White-label (Marque Blanche) :</label>
                        <p className="text-sm font-normal">
                          {data?.whiteLabelEnabled === true ? "Activé" : data?.whiteLabelEnabled === false ? "Désactivé" : "--"}
                        </p>
                      </div>
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">White-label max leads :</label>
                        <p className="text-sm font-normal">{dash(data?.whiteLabelMaxLeads)}</p>
                      </div>
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">Learning Center :</label>
                        <p className="text-sm font-normal">
                          {data?.learningCenterEnabled === true ? "Activé" : data?.learningCenterEnabled === false ? "Désactivé" : "--"}
                        </p>
                      </div>
                      <div className="lg:col-span-4 col-span-full flex flex-col">
                        <label className="text-[13px] text-[#0000009c] mb-1">Marketplace :</label>
                        <p className="text-sm font-normal">
                          {data?.marketplaceEnabled === true ? "Activé" : data?.marketplaceEnabled === false ? "Désactivé" : "--"}
                        </p>
                      </div>
                      {data?.trialPeriod !== undefined && data?.trialPeriod !== null && (
                        <div className="lg:col-span-4 col-span-full flex flex-col">
                          <label className="text-[13px] text-[#0000009c] mb-1">Essai (jours) :</label>
                          <p className="text-sm font-normal">{data?.trialPeriod}</p>
                        </div>
                      )}
                      {data?.hasTrial !== undefined && data?.hasTrial !== null && (
                        <div className="lg:col-span-4 col-span-full flex flex-col">
                          <label className="text-[13px] text-[#0000009c] mb-1">Essai actif :</label>
                          <p className="text-sm font-normal">{data?.hasTrial ? "Oui" : "Non"}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Campagnes P2P ───────────────────────────────────*/}
                  {(data?.dailyCampaignLimit !== undefined || data?.weeklyCampaignLimit !== undefined || data?.monthlyCampaignLimit !== undefined) && (
                    <div className="col-span-full">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-2 block border-b pb-2">Campagnes P2P Estimation :</label>
                      <div className="grid grid-cols-12 gap-4 mt-2">
                        <div className="lg:col-span-4 col-span-full flex flex-col">
                          <label className="text-[13px] text-[#0000009c] mb-1">24h :</label>
                          <p className="text-sm font-normal">{data?.dailyCampaignLimit ?? "--"}</p>
                        </div>
                        <div className="lg:col-span-4 col-span-full flex flex-col">
                          <label className="text-[13px] text-[#0000009c] mb-1">7 jours :</label>
                          <p className="text-sm font-normal">{data?.weeklyCampaignLimit ?? "--"}</p>
                        </div>
                        <div className="lg:col-span-4 col-span-full flex flex-col">
                          <label className="text-[13px] text-[#0000009c] mb-1">30 jours :</label>
                          <p className="text-sm font-normal">{data?.monthlyCampaignLimit ?? "--"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Autres fonctionnalités (otherDetails) ─────────────*/}
                  {data?.otherDetails &&
                    Object.keys(OTHER_DETAILS_LABELS).some(
                      (k) => !!data?.otherDetails?.[k]
                    ) && (
                    <div className="col-span-full">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-2 block border-b pb-2">
                        Autres fonctionnalités (Property seller innovative features)
                      </label>
                      <div className="grid grid-cols-12 gap-4 mt-2">
                        {Object.keys(OTHER_DETAILS_LABELS).map((key) => {
                          const item = data?.otherDetails?.[key];
                          if (!item) return null;
                          return (
                            <div key={key} className="lg:col-span-6 col-span-full flex flex-col">
                              <label className="text-[13px] text-[#0000009c] mb-1">
                                {OTHER_DETAILS_LABELS[key]} :
                              </label>
                              <p className="text-sm font-normal">
                                {otherDetailValue(item)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {data?.feature?.length > 0 && <div className="col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Features:</label>
                    <p className="text-[13px] flex flex-wrap gap-2 text-black capitalize min-h-[35px] rounded-md items-center capitalize py-2 leading-[18px]">
                      {data?.feature?.map((item, index) => {
                        return <span key={index} className="bg-[#976DD0] p-2 rounded-lg text-white">{item?.name}</span>
                      })}
                    </p>
                  </div>}

                  {data?.description && <div className="col-span-12 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Description:</label>
                    <p className="text-sm font-normal"
                      dangerouslySetInnerHTML={{ __html: data?.description }}></p>
                  </div>}

                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default View;
