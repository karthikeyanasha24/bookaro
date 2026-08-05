import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { PiEyeLight } from "react-icons/pi";
import Table from "../../components/Table";
import Layout from "../../components/global/layout";

const UsersHtml = ({ pageChange, count, filters, loaging, data, total, agencyName, shared }) => {
  const navigate = useNavigate();

  const columns = [
    {
      key: "fullName",
      name: "Nom",
      render: (row) => (
        <span
          className="text-[#976DD0] underline font-medium cursor-pointer"
          onClick={() => navigate(`/user/detail/${row._id}`)}
        >
          {row?.firstName} {row?.lastName}
        </span>
      ),
    },
    {
      key: "agency",
      name: "Agence",
      render: (row) => (
        <span className="text-sm text-[#6B7280]">
          {row?.agencyName || row?.whiteLabelAgencyId?.agencyName || row?.whiteLabelAgencyId || "—"}
        </span>
      ),
    },
    {
      key: "email",
      name: "Email",
      render: (row) => <span className="text-sm">{row?.email || "—"}</span>,
    },
    {
      key: "mobileNo",
      name: "Téléphone",
      render: (row) => <span className="text-sm">{row?.mobileNo || "—"}</span>,
    },
    {
      key: "createdAt",
      name: "Inscrit le",
      render: (row) => {
        if (!row?.createdAt) return "—";
        return (
          <span className="text-sm text-[#6B7280]">
            {new Date(row.createdAt).toLocaleDateString("fr-FR")}
          </span>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">
            {agencyName
              ? `Utilisateurs — ${agencyName}`
              : shared.title}
          </h3>
          <Link to="/white-label" className="text-sm text-[#976DD0] hover:underline mt-1 block">
            ← Retour aux agences
          </Link>
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
export default UsersHtml;
