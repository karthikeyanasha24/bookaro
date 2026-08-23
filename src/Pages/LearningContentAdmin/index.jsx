import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import "./learning-content.css";

/**
 * Admin — Validation du contenu publié par les pros (Learning Center).
 * Liste les contenus en attente (vidéos + articles) et permet de valider/rejeter,
 * de prévisualiser, avant leur publication dans le Learning Center.
 */
const LearningContentAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // { contentType, id, title, ... }
  const [previewData, setPreviewData] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterType, setFilterType] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.get("api/admin/pro-learning/pending", {
        page,
        count: limit,
        ...(filterType ? { contentType: filterType } : {}),
      });
      if (res?.success) {
        setItems(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (e) {
      toast.error("Impossible de charger les contenus en attente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, limit, filterType]); // eslint-disable-line react-hooks/exhaustive-deps

  const openPreview = async (item) => {
    setPreview(item);
    setPreviewData(null);
    try {
      loader(true);
      const res = await ApiClient.get(`api/admin/pro-learning/content/${item.contentType}/${item.id}`);
      if (res?.success) setPreviewData(res.data);
    } catch (e) {
      setPreviewData(null);
    } finally {
      loader(false);
    }
  };

  const doAction = async (item, action) => {
    try {
      loader(true);
      const res = await ApiClient.post(`api/admin/pro-learning/${item.contentType}/${item.id}/${action}`, {});
      if (res?.success) {
        toast.success(action === "validate" ? "Contenu validé et publié" : "Contenu rejeté");
        setPreview(null);
        setPreviewData(null);
        load();
      } else {
        toast.error(res?.message || "Erreur");
      }
    } catch (e) {
      toast.error("Erreur");
    } finally {
      loader(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Layout>
      <div className="lc-container">
        <h2 className="lc-title">Pro content — Validation</h2>
        <p className="lc-subtitle">Contenus (vidéos et articles) publiés par les pros, en attente de validation avant publication sur le Learning Center.</p>

        <div className="lc-toolbar">
          <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }} className="lc-select">
            <option value="">Tous les types</option>
            <option value="video">Vidéos</option>
            <option value="article">Articles</option>
          </select>
          <span className="lc-count">{total} en attente</span>
        </div>

        <div className="lc-card">
          {loading ? (
            <p className="lc-empty">Chargement…</p>
          ) : items.length === 0 ? (
            <p className="lc-empty">Aucun contenu en attente de validation.</p>
          ) : (
            <div className="lc-table-wrap">
              <table className="lc-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Type</th>
                    <th>Auteur</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td className="lc-title-cell">
                        {it.image && <img src={it.image} alt="" className="lc-thumb" />}
                        {it.title || "-"}
                      </td>
                      <td><span className={`lc-type lc-type-${it.contentType}`}>{it.contentType === "video" ? "Vidéo" : "Article"}</span></td>
                      <td>{it.authorName} <span className="lc-email">{it.authorEmail}</span></td>
                      <td>{new Date(it.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td>
                        <div className="lc-actions">
                          <button className="lc-btn lc-btn-neutral" onClick={() => openPreview(it)}>Preview</button>
                          <button className="lc-btn lc-btn-green" onClick={() => doAction(it, "validate")}>Valider</button>
                          <button className="lc-btn lc-btn-red" onClick={() => doAction(it, "reject")}>Rejeter</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="lc-pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Précédent</button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Suivant ›</button>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="lc-select lc-limit">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Preview modal */}
        {preview && (
          <div className="lc-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setPreview(null)}>
            <div className="lc-modal">
              <div className="lc-modal-head">
                <h3>Preview — {preview.title}</h3>
                <button className="lc-btn lc-btn-neutral" onClick={() => setPreview(null)}>Fermer</button>
              </div>
              <div className="lc-modal-body">
                {preview.contentType === "video" ? (
                  <>
                    {previewData?.youtubeUrl ? (
                      <video key={previewData.youtubeUrl} controls className="lc-video" src={previewData.youtubeUrl} />
                    ) : previewData?.youtubeUrl ? (
                      <video controls className="lc-video" src={previewData.youtubeUrl} />
                    ) : (
                      <p className="lc-empty">Lien vidéo : {previewData?.youtubeUrl || previewData?.title || ""}</p>
                    )}
                    <p className="lc-desc">{previewData?.description || previewData?.description_fr || ""}</p>
                    {previewData?.youtubeUrl && (/:you|youtube|youtu\.be/i.test(previewData.youtubeUrl) ? null : <a href={previewData.youtubeUrl} target="_blank" rel="noreferrer" className="lc-link">Ouvrir la vidéo</a>)}
                  </>
                ) : (
                  <>
                    {previewData?.banner && <img src={previewData.banner} alt="" className="lc-banner" />}
                    <p className="lc-desc">{previewData?.description || previewData?.description_fr || ""}</p>
                  </>
                )}
              </div>
              <div className="lc-modal-foot">
                <button className="lc-btn lc-btn-green" onClick={() => doAction(preview, "validate")}>Valider</button>
                <button className="lc-btn lc-btn-red" onClick={() => doAction(preview, "reject")}>Rejeter</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LearningContentAdmin;
