import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import shared from "./shared";

const Field = ({ label, value }) => (
  <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFB] px-4 py-3">
    <div className="text-[12px] uppercase tracking-[0.16em] text-[#6B7280]">{label}</div>
    <div className="mt-1 text-sm font-medium text-[#111827] break-words">{value ?? "--"}</div>
  </div>
);

const View = () => {
  const history = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    setError("");
    setLoading(true);
    loader(true);
    try {
      const res = await ApiClient.get(shared.detailApi + "/" + id);
      if (res.success) {
        setData(res.data);
      } else {
        setError("Impossible de charger le détail de l'import.");
      }
    } catch (err) {
      setError(err?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
      loader(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <img src="/assets/img/loader.gif" className="pageLoader mx-auto" alt="loader" />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="text-center py-12 text-[#6B7280]">{error || "Aucune donnée trouvée."}</div>
      </Layout>
    );
  }

  const prop = data.propertyId || {};
  const raw = data.raw || {};
  const rawKeys = raw ? Object.keys(raw).sort() : [];

  return (
    <Layout>
      <div className="wrapper_section space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => history("/" + shared.url)}
            className="border rounded-lg px-3 py-2 text-sm text-[#6B7280] hover:bg-gray-100"
          >
            <FaArrowLeft className="inline me-2" />
            Retour
          </button>
          <h3 className="text-2xl font-semibold text-[#111827]">
            Import MoteurImmo — {data.sourceId ? data.sourceId.substring(0, 16) + "..." : "N/A"}
          </h3>
        </div>

        {/* Informations générales */}
        <div className="shadow-box rounded-2xl bg-white overflow-hidden">
          <div className="p-4 border-b font-medium text-[#976DD0]">Informations générales</div>
          <div className="p-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 text-sm">
            <Field label="Source" value={data.source} />
            <Field label="Source ID" value={data.sourceId} />
            <Field label="Référence" value={data.reference} />
            <Field label="Statut" value={data.status} />
            <Field label="Dernier sync" value={data.lastSyncAt ? new Date(data.lastSyncAt).toLocaleString("fr-FR") : "--"} />
            <Field label="Créé le" value={data.createdAt ? new Date(data.createdAt).toLocaleString("fr-FR") : "--"} />
          </div>
        </div>

        {/* Bien AnyHomes lié */}
        <div className="shadow-box rounded-2xl bg-white overflow-hidden">
          <div className="p-4 border-b font-medium text-[#976DD0]">Bien AnyHomes lié</div>
          <div className="p-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 text-sm">
            {prop._id ? (
              <>
                <Field label="ID AnyHomes" value={prop._id} />
                <Field label="Titre" value={prop.propertyTitle} />
                <Field label="Prix" value={prop.price != null ? `${prop.price.toLocaleString("fr-FR")} €` : "--"} />
                <Field label="Surface" value={prop.surface ? `${prop.surface} m²` : "--"} />
                <Field label="Pièces" value={prop.rooms} />
                <Field label="Type" value={prop.type} />
                <Field label="Transaction" value={prop.propertyType} />
                <Field label="Adresse" value={prop.address || prop.city || "--"} />
                <Field label="CP" value={prop.zipcode} />
                <Field label="Ville" value={prop.city} />
                <Field label="Statut" value={prop.status} />
                <div className="sm:col-span-2 xl:col-span-3 flex items-center gap-2">
                  <button
                    onClick={() => history(`/property/detail/${prop._id}`)}
                    className="bg-[#976DD0] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                  >
                    Ouvrir la fiche AnyHomes
                  </button>
                </div>
              </>
            ) : (
              <div className="sm:col-span-2 xl:col-span-3">
                <Field label="Bien lié" value="Aucun bien AnyHomes associé" />
              </div>
            )}
          </div>
        </div>

        {/* Données brutes MoteurImmo */}
        <div className="shadow-box rounded-2xl bg-white overflow-hidden">
          <div className="p-4 border-b font-medium text-[#976DD0]">
            Données brutes reçues de MoteurImmo
            <span className="ml-2 text-sm font-normal text-[#6B7280]">({rawKeys.length} champs)</span>
          </div>
          <div className="p-5">
            <pre className="bg-[#1e1e2e] text-[#cdd6f4] p-4 rounded-xl overflow-auto max-h-[600px] text-xs leading-relaxed whitespace-pre-wrap break-words">
              {JSON.stringify(raw, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default View;
