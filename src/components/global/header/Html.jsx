import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { MdNotifications, MdPerson, MdEmail } from "react-icons/md";
import { useLocation } from "react-router-dom";
import Sidebar from "../sidebar";

const Html = ({
  isOpen,
  toggle,
  isOpen1,
  messageCount,
  notificationCount,
  showAccountMenu,
  setShowAccountMenu,
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
        {Number(messageCount) > 0 && (
          <button
            className="mx-2 animate-blink message-header-btn"
            title="Messages"
            onClick={() => window.location.href = '/chat'}
          >
            <MdEmail className="menu-icon violet-message" size={22} />
          </button>
        )}
        <button className="mx-2 notification-btn" title="Notifications" onClick={() => window.location.href = '/notifications'}>
          <MdNotifications className={`menu-icon${Number(notificationCount) > 0 ? ' violet-message' : ''}`} size={20} />
        </button>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <button className="mx-2" title="Account" onClick={() => setShowAccountMenu((v) => !v)}>
            <MdPerson className="menu-icon" size={20} />
          </button>
          {showAccountMenu &&
            <div style={{position: 'absolute', right: 0, top: '100%', zIndex: 100}}>
              {/* Le menu utilisateur sera injecté ici par PageLayout */}
              {window.renderAccountMenu && window.renderAccountMenu()}
            </div>
          }
        </div>
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
