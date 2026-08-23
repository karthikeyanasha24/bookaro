import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import shared from "./shared";
import { toast } from "react-toastify";

/**
 * Page admin — Paramètres TVA des abonnements.
 * Définit le taux de TVA central appliqué à la facturation des abonnements.
 */
const Tva = () => {
  const [vatPercent, setVatPercent] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ApiClient.get(`${shared.url}/tva`)
      .then((res) => {
        if (res?.success && res?.data?.vatPercent != null) {
          setVatPercent(Number(res.data.vatPercent) || 20);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = () => {
    const vat = Number(vatPercent);
    if (Number.isNaN(vat) || vat < 0 || vat > 100) {
      toast.error("Taux de TVA invalide (0 à 100).");
      return;
    }
    loader(true);
    ApiClient.put(`${shared.url}/tva/update`, { vatPercent: vat })
      .then((res) => {
        if (res?.success) {
          toast.success("Taux de TVA enregistré.");
          if (res?.data?.vatPercent != null) setVatPercent(res.data.vatPercent);
        } else {
          toast.error(res?.message || "Erreur lors de l'enregistrement.");
        }
      })
      .finally(() => loader(false));
  };

  return (
    <Layout>
      <div className="wrapper_section max-w-3xl">
        <div className="flex items-center mb-8">
          <Tooltip placement="top" title="Back">
            <Link
              to={`/${shared.url}`}
              className="!px-4 py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all mr-3"
            >
              <i className="fa fa-angle-left text-lg"></i>
            </Link>
          </Tooltip>
          <div>
            <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
              TVA — Abonnements
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-box p-6">
          <p className="text-sm text-[#5A6978] mb-6">
            Définissez le taux de TVA appliqué aux abonnements des professionnels.
            Les prix des plans sont considérés <b>TTC</b> et le montant HT est
            dérivé du taux ci-dessous (comme pour la marketplace).
          </p>

          {loading ? (
            <div className="text-center py-6">
              <img src="/assets/img/loader.gif" alt="loading" className="mx-auto w-10" />
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-6 col-span-full">
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Taux de TVA (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={vatPercent}
                  onChange={(e) => setVatPercent(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full text-sm focus:ring-2 focus:ring-[#976DD0] focus:border-[#976DD0]"
                />
              </div>
              <div className="lg:col-span-6 col-span-full">
                <button
                  onClick={save}
                  className="bg-[#976DD0] text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Tva;