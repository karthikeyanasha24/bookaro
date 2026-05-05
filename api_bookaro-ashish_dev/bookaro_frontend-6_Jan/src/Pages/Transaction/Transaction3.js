import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";

const Transaction3 = () => {
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();


  return (
    <PageLayout>
      Transaction3
    </PageLayout>
  );
};

export default Transaction3;
