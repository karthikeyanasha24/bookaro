import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { PiEyeLight } from "react-icons/pi";
import { LiaEdit } from "react-icons/lia";
import Table from "../../components/Table";
import Layout from "../../components/global/layout";
import shared from "./shared";

const Html = ({ pageChange, count, filters, loaging, data, total }) => {
  const navigate = useNavigate();

  const columns = [
    {
      key: "agencyName",
      name: "Agence",
      render: (row) => (
        <span
          className="text-[#976DD0] underline font-medium cursor-pointer"
          onClick={() => navigate(`/company/admin/${row._id}`)}
        >
          {row?.agencyName || row?.fullName || "—"}
        </span>
      ),
    },
    {
      key: "agencySlug",
      name: "Slug",
      render: (row) => (
        <span className="text-sm text-[#6B7280]">{row?.agencySlug || "—"}</span>
      ),
    },
    {
      key: "leadsCount",
      name: "Leads",
      render: (row) => (
        <span className="text-sm font-semibold">{row?.leadsCount ?? 0}</span>
      ),
    },
    {
      key: "propertiesCount",
      name: "Biens",
      render: (row) => (
        <span className="text-sm font-semibold">{row?.propertiesCount ?? 0}</span>
      ),
    },
    {
      key: "transactionsCount",
      name: "Transactions",
      render: (row) => (
        <span className="text-sm font-semibold">{row?.transactionsCount ?? 0}</span>
      ),
    },
    {
      key: "whiteLabelMaxLeads",
      name: "Max leads",
      render: (row) => (
        <span className="text-sm font-medium">{row?.whiteLabelMaxLeads || 50}</span>
      ),
    },
    {
      key: "createdAt",
      name: "Date",
      render: (row) => {
        const d = row?.createdAt;
        if (!d) return "—";
        return (
          <span className="text-sm text-[#6B7280]">
            {new Date(d).toLocaleDateString("fr-FR")}
          </span>
        );
      },
    },
    {
      key: "action",
      name: "Action",
      render: (itm) => (
        <div className="flex items-center justify-start gap-1.5">
          <Tooltip placement="top" title="Voir les leads">
            <a
              onClick={() => navigate(`/white-label/users?agencyId=${itm._id}`)}
              className="border cursor-pointer hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
            >
              <PiEyeLight />
            </a>
          </Tooltip>
          <Tooltip placement="top" title="Profil entreprise">
            <a
              onClick={() => navigate(`/company/admin/${itm._id}`)}
              className="border cursor-pointer hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
            >
              <LiaEdit />
            </a>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">{shared.title}</h3>
        </div>
      </div>
      <div className="shadow-box w-full bg-white rounded-lg mt-6">
        {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" alt="loader" />
          </div>
        ) : (
          <Table
            className="mb-3 pt-0 p-4"
            data={data}
            columns={columns}
            page={filters.page}
            count={filters.count}
            filters={filters}
            total={total}
            result={(e) => {
              if (e.event == "page") pageChange(e.value);
              if (e.event == "count") count(e.value);
            }}
          />
        )}
      </div>
    </Layout>
  );
};
export default Html;
