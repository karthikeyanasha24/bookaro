import DashboardSection from "./DashboardSection";
import { FiClock, FiFileText, FiPlay } from "react-icons/fi";

const fallbackImages = [
  "/assets/img/dashboard/attractivity/attractivity-1.jpg",
  "/assets/img/dashboard/attractivity/attractivity-2.jpg",
  "/assets/img/dashboard/attractivity/attractivity-3.jpg",
];

const fallbackAvatars = [
  "/assets/img/dashboard/attractivity/attractivity-4.webp",
  "/assets/img/dashboard/attractivity/attractivity-5.jpg",
  "/assets/img/dashboard/attractivity/attractivity-2.jpg",
];

const TrainingCenterSection = ({ section, loading, error, t }) => {
  const items = section?.items || [];

  return (
    <DashboardSection
      title={t("dashboard.sections.training", "New content in the real estate training center")}
      subtitle={t("dashboard.sections.trainingSub", "Leverage these insights to manage your real estate project like a pro")}
      loading={loading}
      error={error}
    >
      <div className="training-grid">
        {items.map((item, index) => {
          const isVideo = `${item?.contentType || ""}`.toLowerCase() === "video";
          const duration = item?.consumptionTime || `${isVideo ? 5 : 3} minutes`;
          const mediaTypeLabel = isVideo
            ? t("dashboard.training.mediaType.video", "video")
            : t("dashboard.training.mediaType.written", "ecrit");

          return (
          <a key={item.id} href={item.route} className="training-card">
            <div className="training-card-head">
              <div className="training-author-wrap">
                <img
                  src={item.authorAvatarUrl || fallbackAvatars[index % fallbackAvatars.length]}
                  alt={item.authorName || "author"}
                  className="training-author-avatar"
                  onError={(event) => {
                    if (!event.currentTarget.dataset.fallbackApplied) {
                      event.currentTarget.dataset.fallbackApplied = "true";
                      event.currentTarget.src = fallbackAvatars[index % fallbackAvatars.length];
                    }
                  }}
                />
                <p className="training-author-name">{item.authorName}</p>
              </div>
              <span className="training-category-pill">{item.category}</span>
            </div>
            <div className="training-media-wrap">
              <img
                src={item.imageUrl || fallbackImages[index % fallbackImages.length]}
                alt="training"
                className="training-media-image"
                onError={(event) => {
                  if (!event.currentTarget.dataset.fallbackApplied) {
                    event.currentTarget.dataset.fallbackApplied = "true";
                    event.currentTarget.src = fallbackImages[index % fallbackImages.length];
                  }
                }}
              />
              <span className="training-content-type-badge" aria-label={mediaTypeLabel}>
                {isVideo ? <FiPlay /> : <FiFileText />}
              </span>
            </div>
            <p className="training-content-title">{item.title}</p>
            <p className="training-duration">
              <FiClock className="training-duration-icon" aria-hidden="true" />
              <span>{duration}</span>
            </p>
          </a>
          );
        })}
      </div>
      <div className="dashboard-button-center training-button-center">
        <a href="/training" className="dashboard-button">
          {t("dashboard.cta.browseTraining", "Parcourir les formations")}
        </a>
      </div>
    </DashboardSection>
  );
};

export default TrainingCenterSection;
