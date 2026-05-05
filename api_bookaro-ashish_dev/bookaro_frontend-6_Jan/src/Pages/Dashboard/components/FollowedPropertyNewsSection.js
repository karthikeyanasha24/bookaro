import { useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FiHeart, FiShare2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import DashboardSection from "./DashboardSection";

const DEFAULT_NEWS_ITEMS = [
  {
    id: "news-1",
    occurredAt: "2026-04-14T09:30:00.000Z",
    newsTitle: "Changement de prix",
    property: {
      id: "prop-news-1",
      title: "Maison familiale",
      status: "À vendre",
      rooms: 5,
      surface: 110,
      location: "75018 Paris",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-1.jpg",
    },
  },
  {
    id: "news-2",
    occurredAt: "2026-04-14T08:10:00.000Z",
    newsTitle: "Travaux renseignés",
    property: {
      id: "prop-news-2",
      title: "Appartement lumineux",
      status: "Off-market",
      rooms: 3,
      surface: 64,
      location: "69003 Lyon",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-2.jpg",
    },
  },
  {
    id: "news-3",
    occurredAt: "2026-04-13T16:45:00.000Z",
    newsTitle: "Changement de statut : à vendre",
    property: {
      id: "prop-news-3",
      title: "Loft urbain",
      status: "À vendre",
      rooms: 4,
      surface: 92,
      location: "33000 Bordeaux",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-3.jpg",
    },
  },
  {
    id: "news-4",
    occurredAt: "2026-04-12T10:20:00.000Z",
    newsTitle: "Changement de propriétaire",
    property: {
      id: "prop-news-4",
      title: "Villa contemporaine",
      status: "Vendu",
      rooms: 6,
      surface: 160,
      location: "06130 Grasse",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-4.webp",
    },
  },
  {
    id: "news-5",
    occurredAt: "2026-04-11T14:00:00.000Z",
    newsTitle: "Revenus locatifs ajoutés",
    property: {
      id: "prop-news-5",
      title: "T2 centre-ville",
      status: "Loué",
      rooms: 2,
      surface: 46,
      location: "44000 Nantes",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-5.jpg",
    },
  },
  {
    id: "news-6",
    occurredAt: "2026-04-10T11:30:00.000Z",
    newsTitle: "Dépenses ajoutées",
    property: {
      id: "prop-news-6",
      title: "Maison de ville",
      status: "À vendre",
      rooms: 4,
      surface: 97,
      location: "31000 Toulouse",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-1.jpg",
    },
  },
  {
    id: "news-7",
    occurredAt: "2026-04-09T13:05:00.000Z",
    newsTitle: "Changement de prix",
    property: {
      id: "prop-news-7",
      title: "Duplex terrasse",
      status: "À vendre",
      rooms: 4,
      surface: 88,
      location: "13008 Marseille",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-2.jpg",
    },
  },
  {
    id: "news-8",
    occurredAt: "2026-04-09T09:00:00.000Z",
    newsTitle: "Travaux renseignés",
    property: {
      id: "prop-news-8",
      title: "Studio meublé",
      status: "Loué",
      rooms: 1,
      surface: 27,
      location: "67000 Strasbourg",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-3.jpg",
    },
  },
  {
    id: "news-9",
    occurredAt: "2026-04-08T17:30:00.000Z",
    newsTitle: "Changement de statut : à vendre",
    property: {
      id: "prop-news-9",
      title: "Pavillon jardin",
      status: "À vendre",
      rooms: 5,
      surface: 124,
      location: "59000 Lille",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-4.webp",
    },
  },
  {
    id: "news-10",
    occurredAt: "2026-04-08T08:10:00.000Z",
    newsTitle: "Revenus locatifs ajoutés",
    property: {
      id: "prop-news-10",
      title: "Appartement standing",
      status: "Loué",
      rooms: 3,
      surface: 73,
      location: "34000 Montpellier",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-5.jpg",
    },
  },
  {
    id: "news-11",
    occurredAt: "2026-04-07T14:30:00.000Z",
    newsTitle: "Dépenses ajoutées",
    property: {
      id: "prop-news-11",
      title: "Maison plain-pied",
      status: "À vendre",
      rooms: 4,
      surface: 105,
      location: "35000 Rennes",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-1.jpg",
    },
  },
  {
    id: "news-12",
    occurredAt: "2026-04-06T10:15:00.000Z",
    newsTitle: "Changement de propriétaire",
    property: {
      id: "prop-news-12",
      title: "Penthouse panorama",
      status: "Vendu",
      rooms: 5,
      surface: 140,
      location: "06000 Nice",
      imageUrl: "/assets/img/dashboard/attractivity/attractivity-2.jpg",
    },
  },
];

const getPropertyUrl = (item) => {
  const route = item?.property?.route;
  if (route) return route;

  const propertyId = item?.property?.id || item?.property?._id || item?.propertyId;
  if (!propertyId) return "/property-details";
  return `/property-details?id=${encodeURIComponent(propertyId)}`;
};

const getPropertyTimelineUrl = (item) => {
  const timelineRoute = item?.property?.timelineRoute;
  if (timelineRoute) return timelineRoute;

  const propertyId = item?.property?.id || item?.property?._id || item?.propertyId;
  if (!propertyId) return getPropertyUrl(item);
  return `/property-timeline?id=${encodeURIComponent(propertyId)}`;
};

const getDateKey = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const getNewsType = (title = "") => {
  const value = `${title}`.toLowerCase();
  if (value.includes("prix")) return "price";
  if (value.includes("travaux")) return "works";
  if (value.includes("statut")) return "status";
  if (value.includes("propriétaire") || value.includes("proprietaire")) return "owner";
  if (value.includes("revenus")) return "revenue";
  if (value.includes("dépenses") || value.includes("depenses")) return "expense";
  return "default";
};

const FollowedPropertyNewsSection = ({ section, loading, error, t }) => {
  const { i18n } = useTranslation();
  const [likedIds, setLikedIds] = useState({});
  const [openShareId, setOpenShareId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const newsGroups = useMemo(() => {
    const source = Array.isArray(section?.items) && section.items.length > 0
      ? section.items
      : DEFAULT_NEWS_ITEMS;

    const sortedItems = [...source]
      .sort((a, b) => {
        const dateA = new Date(a?.occurredAt || 0).getTime();
        const dateB = new Date(b?.occurredAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, isCollapsed ? 3 : 10)
      .map((item) => ({
        ...item,
        newsType: getNewsType(item?.newsTitle),
      }));

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const todayKey = getDateKey(today);
    const yesterdayKey = getDateKey(yesterday);
    const locale = i18n?.language === "fr" ? "fr-FR" : "en-GB";

    const groupsByDate = new Map();
    sortedItems.forEach((item) => {
      const key = getDateKey(item?.occurredAt);
      if (!key) return;
      if (!groupsByDate.has(key)) groupsByDate.set(key, []);
      groupsByDate.get(key).push(item);
    });

    return [...groupsByDate.entries()].map(([key, items]) => {
      let label = key;
      if (key === todayKey) {
        label = t("dashboard.followedNews.today", "Aujourd'hui");
      } else if (key === yesterdayKey) {
        label = t("dashboard.followedNews.yesterday", "Hier");
      } else {
        const [year, month, day] = key.split("-").map(Number);
        const date = new Date(year, month, day);
        label = date.toLocaleDateString(locale, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      return { key, label, items };
    });
  }, [i18n?.language, isCollapsed, section, t]);

  const toggleLike = (newsId) => {
    setLikedIds((prev) => ({
      ...prev,
      [newsId]: !prev[newsId],
    }));
  };

  const shareTextFor = (item) => {
    return `${item?.property?.title || "Bien"} - ${item?.newsTitle || "Actualité"}`;
  };

  const getAbsoluteUrl = (path) => {
    if (!path) return window.location.href;
    return `${window.location.origin}${path}`;
  };

  const handleShareClick = async (event, item) => {
    event.preventDefault();
    event.stopPropagation();

    const newsId = item?.id;
    const shareUrl = getAbsoluteUrl(getPropertyUrl(item));
    const text = shareTextFor(item);

    if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: text,
          text,
          url: shareUrl,
        });
      } catch (_error) {
        // User cancelled sharing.
      }
      return;
    }

    setOpenShareId((prev) => (prev === newsId ? null : newsId));
  };

  const shareByEmail = (item) => {
    const text = shareTextFor(item);
    const shareUrl = getAbsoluteUrl(getPropertyUrl(item));
    const subject = encodeURIComponent(text);
    const body = encodeURIComponent(`${text}\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
    setOpenShareId(null);
  };

  const shareByWhatsApp = (item) => {
    const text = shareTextFor(item);
    const shareUrl = getAbsoluteUrl(getPropertyUrl(item));
    const message = encodeURIComponent(`${text} ${shareUrl}`);
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer");
    setOpenShareId(null);
  };

  const copyShareLink = async (item) => {
    const shareUrl = getAbsoluteUrl(getPropertyUrl(item));
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (_error) {
      // Ignore clipboard errors.
    }
    setOpenShareId(null);
  };

  const openPropertyTimeline = (item) => {
    const timelineUrl = getPropertyTimelineUrl(item);
    window.open(timelineUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <DashboardSection
      title={t("dashboard.sections.followedPropertyNews", "Découvrez l'actualité des biens que vous suivez")}
      subtitle={t(
        "dashboard.sections.followedPropertyNewsSub",
        "Suivre un bien immobilier vous permet de vous positionner avant même qu'il ne soit en vente."
      )}
      headerRight={
        <button
          type="button"
          className="followed-news-toggle-btn"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={
            isCollapsed
              ? t("dashboard.followedNews.expand", "Déplier la section")
              : t("dashboard.followedNews.collapse", "Plier la section")
          }
          aria-expanded={!isCollapsed}
        >
          <span>
            {isCollapsed
              ? t("dashboard.followedNews.showAll", "Voir tout")
              : t("dashboard.followedNews.showLatest", "Réduire")}
          </span>
          {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
        </button>
      }
      loading={loading}
      error={error}
    >
      {newsGroups.length === 0 ? (
        <p className="dashboard-subtitle" style={{ fontSize: "14px", color: "#6b7280" }}>
          {t("dashboard.followedNews.empty", "Aucune actualité disponible pour le moment.")}
        </p>
      ) : (
        <div className="followed-news-list">
          {newsGroups.map((group) => (
            <div key={group.key} className="followed-news-group">
              <p className="followed-news-date-separator">{group.label}</p>
              <div className="followed-news-group-rows">
                {group.items.map((item) => {
                  const isLiked = Boolean(likedIds[item.id]);
                  const isShareOpen = openShareId === item.id;
                  const badgeLabel = t(
                    `dashboard.followedNews.badges.${item.newsType}`,
                    t("dashboard.followedNews.badges.default", "Mise à jour")
                  );

                  return (
                    <article
                      key={item.id}
                      className="followed-news-row"
                      role="link"
                      tabIndex={0}
                      onClick={() => openPropertyTimeline(item)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openPropertyTimeline(item);
                        }
                      }}
                    >
                      <div className="followed-news-property-wrap">
                        <div className="followed-news-property-image-link" aria-hidden="true">
                          <img
                            src={item?.property?.imageUrl || "/assets/img/placeholder.png"}
                            alt={item?.property?.title || "property"}
                            className="followed-news-property-image"
                          />
                        </div>
                        <div className="followed-news-property-meta">
                          <p className="followed-news-property-title">{item?.property?.title || "-"}</p>
                          <p className="followed-news-property-features">
                            {`${item?.property?.status || "-"} • ${item?.property?.rooms || 0} ${t(
                              "dashboard.units.roomPlural",
                              "pièces"
                            )} • ${item?.property?.surface || 0} ${t("dashboard.units.sqm", "m2")} • ${
                              item?.property?.location || "-"
                            }`}
                          </p>
                        </div>
                      </div>

                      <div className="followed-news-title-wrap">
                        <p className="followed-news-title">{item?.newsTitle || "-"}</p>
                        <span className={`followed-news-badge followed-news-badge-${item.newsType}`.trim()}>{badgeLabel}</span>
                      </div>

                      <div className="followed-news-actions">
                        <button
                          type="button"
                          className={`followed-news-action-btn ${isLiked ? "liked" : ""}`.trim()}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleLike(item.id);
                          }}
                          aria-label={
                            isLiked
                              ? t("dashboard.followedNews.unlike", "Retirer le like")
                              : t("dashboard.followedNews.like", "Liker la news")
                          }
                        >
                          {isLiked ? <FaHeart /> : <FiHeart />}
                        </button>

                        <div className="followed-news-share-wrap">
                          <button
                            type="button"
                            className="followed-news-action-btn"
                            onClick={(event) => handleShareClick(event, item)}
                            aria-label={t("dashboard.followedNews.share", "Partager")}
                          >
                            <FiShare2 />
                          </button>

                          {isShareOpen && (
                            <div className="followed-news-share-menu">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  shareByEmail(item);
                                }}
                              >
                                {t("dashboard.followedNews.shareEmail", "Email")}
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  shareByWhatsApp(item);
                                }}
                              >
                                {t("dashboard.followedNews.shareWhatsapp", "WhatsApp")}
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  copyShareLink(item);
                                }}
                              >
                                {t("dashboard.followedNews.copyLink", "Copier le lien")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
};

export default FollowedPropertyNewsSection;
