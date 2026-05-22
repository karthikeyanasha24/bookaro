import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const { t } = useTranslation();
    return <>{t("pages.notFound.title")}</>;
};

export default NotFoundPage