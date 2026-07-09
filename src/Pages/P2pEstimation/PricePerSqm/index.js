import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../../../components/global/layout";
import ApiClient from "../../../methods/api/apiClient";
import environment from "../../../environment";

/* ─────────────────────────────── helpers ─────────────────────────────────── */
const fmt = (v) =>
  v != null ? new Intl.NumberFormat("fr-FR").format(v) + " €/m²" : "—";

/* ─────────────────────────────── component ──────────────────────────────── */
export default function PricePerSqm() {
  const [tab, setTab] = useState("db"); // "db" | "import"

  /* ── DB tab state ─────────────────────────────────────────────── */
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 50;

  // inline-edit
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // add new row
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ postalCode: "", refPrice: "", municipality_name: "", code_insee: "" });
  const [addError, setAddError] = useState("");

  /* ── Import tab state ─────────────────────────────────────────── */
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // { total, toInsert, toUpdate, records }
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef(null);

  /* ── Fetch rows ────────────────────────────────────────────────── */
  const fetchRows = useCallback(
    (overrides = {}) => {
      setLoading(true);
      const params = { search, page, limit: LIMIT, ...overrides };
      ApiClient.get("admin/price-per-sqm", params).then((res) => {
        if (res.success) {
          setRows(res.data || []);
          setTotal(res.total || 0);
        }
        setLoading(false);
      });
    },
    [search, page]
  );

  useEffect(() => {
    if (tab === "db") fetchRows();
    // eslint-disable-next-line
  }, [tab, page]);

  /* ── Search ────────────────────────────────────────────────────── */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRows({ page: 1 });
  };

  /* ── Export CSV ────────────────────────────────────────────────── */
  const handleExport = () => {
    const token = localStorage.getItem("token");
    fetch(`${environment.api}admin/price-per-sqm/export/csv`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "price_per_sqm.csv";
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  /* ── Inline edit ───────────────────────────────────────────────── */
  const startEdit = (row) => {
    setEditId(row._id);
    setEditForm({ refPrice: row.refPrice, municipality_name: row.municipality_name || "", code_insee: row.code_insee || "" });
  };
  const cancelEdit = () => setEditId(null);
  const saveEdit = (id) => {
    ApiClient.put(`admin/price-per-sqm/${id}`, editForm).then((res) => {
      if (res.success) {
        setEditId(null);
        fetchRows();
      }
    });
  };
  const deleteRow = (id) => {
    if (!window.confirm("Supprimer cet enregistrement ?")) return;
    ApiClient.delete(`admin/price-per-sqm/${id}`).then((res) => {
      if (res.success) fetchRows();
    });
  };

  /* ── Add row ───────────────────────────────────────────────────── */
  const handleAdd = () => {
    setAddError("");
    if (!addForm.postalCode || !addForm.refPrice) {
      setAddError("Code postal et prix/m² sont requis.");
      return;
    }
    ApiClient.post("admin/price-per-sqm", addForm).then((res) => {
      if (res.success) {
        setShowAdd(false);
        setAddForm({ postalCode: "", refPrice: "", municipality_name: "", code_insee: "" });
        fetchRows({ page: 1 });
      } else {
        setAddError(res.message || "Erreur lors de l'ajout.");
      }
    });
  };

  /* ── File select → preview ─────────────────────────────────────── */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(null);
    setImportDone(null);
    const fd = new FormData();
    fd.append("file", f);
    const token = localStorage.getItem("token");
    fetch(`${environment.api}admin/price-per-sqm/preview`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
      .then((r) => r.json())
      .then((res) => { if (res.success) setPreview(res); });
  };

  /* ── Confirm import ────────────────────────────────────────────── */
  const handleImport = () => {
    if (!file) return;
    setImporting(true);
    setShowConfirm(false);
    const fd = new FormData();
    fd.append("file", file);
    const token = localStorage.getItem("token");
    fetch(`${environment.api}admin/price-per-sqm/import`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
      .then((r) => r.json())
      .then((res) => {
        setImporting(false);
        if (res.success) {
          setImportDone(res);
          setFile(null);
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      });
  };

  /* ── total pages ───────────────────────────────────────────────── */
  const totalPages = Math.ceil(total / LIMIT);

  /* ─────────────────────────────── render ──────────────────────── */
  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">Prix au m² par code postal</h3>
          <p className="text-sm text-gray-500 mt-1">
            Base de référence utilisée pour les estimations P2P sans campagne active.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          {[{ id: "db", label: "Base de données" }, { id: "import", label: "Import" }].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════ TAB: DB ════════════════════════════ */}
        {tab === "db" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* toolbar */}
            <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-100">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Rechercher code postal ou commune…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                  Rechercher
                </button>
              </form>
              <button
                onClick={() => { setShowAdd(true); setAddError(""); }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
              >
                + Ajouter
              </button>
              <button
                onClick={handleExport}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1"
              >
                ↓ Exporter CSV
              </button>
            </div>

            {/* Add row form */}
            {showAdd && (
              <div className="px-5 py-4 bg-green-50 border-b border-green-200">
                <p className="text-sm font-semibold text-green-800 mb-3">Nouvelle entrée</p>
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Code postal *</label>
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-28"
                      placeholder="75018"
                      value={addForm.postalCode}
                      onChange={(e) => setAddForm({ ...addForm, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Prix/m² (€) *</label>
                    <input
                      type="number"
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-28"
                      placeholder="8500"
                      value={addForm.refPrice}
                      onChange={(e) => setAddForm({ ...addForm, refPrice: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Commune</label>
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-40"
                      placeholder="Paris 18e"
                      value={addForm.municipality_name}
                      onChange={(e) => setAddForm({ ...addForm, municipality_name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Code INSEE</label>
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-28"
                      placeholder="75118"
                      value={addForm.code_insee}
                      onChange={(e) => setAddForm({ ...addForm, code_insee: e.target.value })}
                    />
                  </div>
                  <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700">
                    Enregistrer
                  </button>
                  <button onClick={() => setShowAdd(false)} className="text-gray-500 text-sm hover:underline">
                    Annuler
                  </button>
                </div>
                {addError && <p className="mt-2 text-sm text-red-600">{addError}</p>}
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Code postal</th>
                    <th className="px-4 py-3 text-left">Code INSEE</th>
                    <th className="px-4 py-3 text-left">Commune</th>
                    <th className="px-4 py-3 text-right">Prix/m²</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400">Chargement…</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400">Aucune donnée. Utilisez l'onglet Import pour charger le fichier.</td>
                    </tr>
                  ) : (
                    rows.map((row) =>
                      editId === row._id ? (
                        <tr key={row._id} className="bg-purple-50">
                          <td className="px-4 py-2 font-mono text-purple-700">{row.postalCode}</td>
                          <td className="px-4 py-2">
                            <input
                              className="border border-purple-300 rounded px-2 py-1 text-sm w-24"
                              value={editForm.code_insee}
                              onChange={(e) => setEditForm({ ...editForm, code_insee: e.target.value })}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              className="border border-purple-300 rounded px-2 py-1 text-sm w-40"
                              value={editForm.municipality_name}
                              onChange={(e) => setEditForm({ ...editForm, municipality_name: e.target.value })}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="border border-purple-300 rounded px-2 py-1 text-sm w-24 text-right"
                              value={editForm.refPrice}
                              onChange={(e) => setEditForm({ ...editForm, refPrice: e.target.value })}
                            />
                          </td>
                          <td className="px-4 py-2 text-center flex gap-2 justify-center">
                            <button onClick={() => saveEdit(row._id)} className="text-green-600 hover:underline text-xs font-medium">
                              Sauver
                            </button>
                            <button onClick={cancelEdit} className="text-gray-400 hover:underline text-xs">
                              Annuler
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={row._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-mono text-gray-800">{row.postalCode}</td>
                          <td className="px-4 py-2 text-gray-500">{row.code_insee || "—"}</td>
                          <td className="px-4 py-2 text-gray-700">{row.municipality_name || "—"}</td>
                          <td className="px-4 py-2 text-right font-semibold text-purple-700">
                            {new Intl.NumberFormat("fr-FR").format(row.refPrice)} €/m²
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex gap-3 justify-center">
                              <button onClick={() => startEdit(row)} className="text-purple-600 hover:underline text-xs font-medium">
                                Modifier
                              </button>
                              <button onClick={() => deleteRow(row._id)} className="text-red-500 hover:underline text-xs">
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
                <span>{total} entrées au total</span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    ‹ Préc.
                  </button>
                  <span className="px-2 py-1">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    Suiv. ›
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════ TAB: IMPORT ════════════════════════ */}
        {tab === "import" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Importer un fichier XLSX</h4>
            <p className="text-sm text-gray-500 mb-1">Colonnes attendues :</p>
            <code className="block text-xs bg-gray-100 rounded-lg px-3 py-2 mb-5 text-gray-700">
              code_postal · code_insee · nom_commune · price per sqm
            </code>
            <p className="text-sm text-gray-500 mb-5">
              Les codes postaux <strong>déjà présents</strong> dans la base seront <strong>écrasés</strong> par les valeurs du fichier. Les nouveaux seront ajoutés.
            </p>

            {/* File picker */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors mb-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-gray-400 text-sm">
                {file ? (
                  <span className="text-purple-700 font-medium">{file.name}</span>
                ) : (
                  "Cliquez ou glissez un fichier XLSX / CSV ici"
                )}
              </p>
            </div>

            {/* Preview */}
            {preview && (
              <div className="rounded-xl border border-gray-200 p-4 mb-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700 mb-2">Analyse du fichier</p>
                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  <div className="bg-white rounded-lg border p-3">
                    <p className="text-2xl font-bold text-gray-800">{preview.total}</p>
                    <p className="text-xs text-gray-500 mt-1">Lignes valides</p>
                  </div>
                  <div className="bg-white rounded-lg border p-3">
                    <p className="text-2xl font-bold text-green-600">{preview.toInsert}</p>
                    <p className="text-xs text-gray-500 mt-1">Nouvelles entrées</p>
                  </div>
                  <div className="bg-white rounded-lg border p-3">
                    <p className="text-2xl font-bold text-orange-500">{preview.toUpdate}</p>
                    <p className="text-xs text-gray-500 mt-1">Écrasements</p>
                  </div>
                </div>
                {preview.toUpdate > 0 && (
                  <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
                    ⚠ {preview.toUpdate} code{preview.toUpdate > 1 ? "s" : ""} postal{preview.toUpdate > 1 ? "aux" : ""} déjà présent{preview.toUpdate > 1 ? "s" : ""} sera{preview.toUpdate > 1 ? "ont" : ""} écrasé{preview.toUpdate > 1 ? "s" : ""}.
                  </p>
                )}
                {preview.total === 0 && preview.detectedColumns && (
                  <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                    <p className="font-semibold mb-1">Aucune ligne valide détectée.</p>
                    <p className="mb-1">Colonnes trouvées dans le fichier :</p>
                    <code className="block text-red-600 break-all">{preview.detectedColumns.join(" · ")}</code>
                    <p className="mt-2 text-red-500">Colonnes acceptées : <em>code_postal</em> (ou cp/zip) + <em>price per sqm</em> (ou PrixMoyen/prix_m2…)</p>
                  </div>
                )}
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={importing}
                  className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                  {importing ? "Import en cours…" : "Lancer l'import"}
                </button>
              </div>
            )}

            {/* Success */}
            {importDone && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                ✓ {importDone.message}
                <button
                  onClick={() => { setImportDone(null); setTab("db"); fetchRows({ page: 1 }); }}
                  className="ml-3 underline text-green-700 text-xs"
                >
                  Voir la base de données
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════ CONFIRM MODAL ═════════════════════════════════ */}
      {showConfirm && preview && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h5 className="text-lg font-semibold text-gray-800 mb-2">Confirmer l'import</h5>
            <p className="text-sm text-gray-600 mb-4">
              Vous êtes sur le point d'importer <strong>{preview.total}</strong> enregistrement{preview.total > 1 ? "s" : ""}.
            </p>
            {preview.toUpdate > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 text-sm text-orange-700">
                ⚠ <strong>{preview.toUpdate}</strong> code{preview.toUpdate > 1 ? "s" : ""} postal{preview.toUpdate > 1 ? "aux" : ""} déjà présent{preview.toUpdate > 1 ? "s" : ""} dans la base de données sera{preview.toUpdate > 1 ? "ont" : ""} <strong>écrasé{preview.toUpdate > 1 ? "s" : ""}</strong> par les nouvelles valeurs.
              </div>
            )}
            <p className="text-sm text-gray-500 mb-5">Cette action est irréversible. Confirmez-vous ?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
              >
                Confirmer l'import
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
