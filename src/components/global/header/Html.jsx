import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Sidebar from "../sidebar";

const Html = ({
  isOpen,
  toggle,
  isOpen1,
}) => {
  const location = useLocation();

  const getLogo = () => {
    return "/assets/img/logo.png";
  };

  // Correction : largeur du header alignée sur la sidebar
  let headerWidthClass = "";
  if (isOpen) {
    headerWidthClass = "w-[calc(100%-280px)]";
  } else {
    headerWidthClass = "w-[calc(100%-70px)]";
  }

  return (
    <nav
      className={`min-sidebar ${headerWidthClass} shadow-btn py-1.5 bg-[#f8f9fa] border-b fixed transition-[width] duration-300 ml-auto right-0 z-10 flex items-center h-[71px] !px-5`}
    >

      {/* Bouton toggle sidebar supprimé du header, seul celui du sidebar reste */}

      <div className="flex items-center gap-4 ml-auto">
        <button className="mx-2" title="Messages">
          <span role="img" aria-label="messages">
            💬
          </span>
        </button>
        <button className="mx-2" title="Notifications">
          <span role="img" aria-label="notifications">
            🔔
          </span>
        </button>
        <button className="mx-2" title="Account">
          <span role="img" aria-label="account">
            👤
          </span>
        </button>
      </div>

      {isOpen1 && (
        <div className="w-100 mobi-dropdown">
          <Sidebar />
        </div>
      )}
    </nav>
  );
};

export default Html;
