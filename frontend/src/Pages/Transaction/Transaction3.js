import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { useTranslation } from "react-i18next";

const Transaction3 = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();


  return (
    <PageLayout>
      {t("transaction.page3Title")}
    </PageLayout>
  );
};

export default Transaction3;
