import PageLayout from "../../components/global/PageLayout";
import { useTranslation } from "react-i18next";

const RealEstatePropsDetail = () => {
  const { t } = useTranslation();
  return (
    <PageLayout>
      {t("realEstatePropsDetail.title")}
    </PageLayout>
  );
};

export default RealEstatePropsDetail;
