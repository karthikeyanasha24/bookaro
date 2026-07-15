import Table from "../../components/Table";
import Layout from "../../components/global/layout";
import { useNavigate } from "react-router-dom";
import shared from "./shared";

const Html = ({
  pageChange,
  count,
  filters,
  loaging,
  data,
  total,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      key: "createdAt",
      name: "Date",
      render: (row) => {
        const d = row?.createdAt;
        if (!d) return "--";
        return <span className="text-sm text-[#6B7280]">{new Date(d).toLocaleString("fr-FR")}</span>;
      },
    },
    {
      key: "propertyImage",
      name: "Bien",
      render: (row) => {
        const prop = row?.propertyId;
        const img = prop?.images?.[0];
        const id = prop?._id;
        return (
          <div
            className="w-10 h-10 rounded-lg bg-cover bg-center cursor-pointer border"
            style={{ backgroundImage: `url(${img ? "/img/" + (typeof img === 'string' ? img : (img.file || img.fileName || "")) : "/assets/img/placeholder.png"})` }}
            onClick={() => id && navigate(`/property/admin/${id}`)}
          />
        );
      },
    },
    {
      key: "propertyRef",
      name: "Référence",
      render: (row) => {
        const prop = row?.propertyId;
        if (!prop) return <span className="text-[#9CA3AF]">--</span>;
        return (
          <span
            className="text-[#976DD0] underline font-medium cursor-pointer"
            onClick={() => prop?._id && navigate(`/property/admin/${prop._id}`)}
          >
            {prop?.propertyRef || prop?._id?.substring(0, 12) + "..." || "--"}
          </span>
        );
      },
    },
    {
      key: "type",
      name: "Type",
      render: (row) => {
        const kind = row?.propertyId?.type;
        return <span className="capitalize">{kind ? kind.charAt(0).toUpperCase() + kind.slice(1) : "--"}</span>;
      },
    },
    {
      key: "surface",
      name: "Surface",
      render: (row) => {
        const s = row?.propertyId?.surface;
        return <span>{s ? `${s} m²` : "--"}</span>;
      },
    },
    {
      key: "price",
      name: "Prix / Loyer",
      render: (row) => {
        const p = row?.propertyId?.price;
        return <span>{p != null ? `${p.toLocaleString("fr-FR")} €` : "--"}</span>;
      },
    },
    {
      key: "city",
      name: "Ville",
      render: (row) => <span>{row?.propertyId?.city || "--"}</span>,
    },
    {
      key: "zipcode",
      name: "CP",
      render: (row) => <span>{row?.propertyId?.zipcode || "--"}</span>,
    },
    {
      key: "username",
      name: "Username",
      render: (row) => {
        const user = row?.userId;
        if (!user) return <span className="text-[#9CA3AF]">--</span>;
        return (
          <span
            className="text-[#976DD0] underline font-medium cursor-pointer"
            onClick={() => user?._id && navigate(`/user/detail/${user._id}`)}
          >
            {user?.fullName || user?.email || user?.firstName || user?._id?.substring(0, 12) || "--"}
          </span>
        );
      },
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
            firstColumnClass="width_row"
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
