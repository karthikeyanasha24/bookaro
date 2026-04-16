import PageLayout from "../../components/global/PageLayout";
import { useTranslation } from "react-i18next";


const Transaction1 = () => {
  const { t } = useTranslation();
  return (
    <PageLayout>
      <div className="bg-[#976dd021]">
        {t("transaction.page1Title")}
      </div>
    </PageLayout>
  );
};

export default Transaction1;
