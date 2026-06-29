/**
 * AiAvatarButton — Floating AI button (pulsing avatar)
 * Renders a fixed-position AI trigger button.
 * Shows unread badge when AI has new messages.
 *
 * Props:
 *  onClick       {function}
 *  unreadCount   {number}
 *  isOpen        {boolean}
 */
import { BsRobot } from "react-icons/bs";

const AiAvatarButton = ({ onClick, unreadCount = 0, isOpen = false }) => {
  return (
    <button
      onClick={onClick}
      title="Chat with Bookaroo AI"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-all"
      style={{
        width: 58,
        height: 58,
        background: isOpen
          ? "linear-gradient(135deg, #5b21b6, #7c3aed)"
          : "linear-gradient(135deg, #7c3aed, #9b59b6)",
        border: "none",
        outline: "none",
        cursor: "pointer",
        boxShadow: isOpen
          ? "0 4px 20px rgba(124,58,237,0.5)"
          : "0 4px 16px rgba(124,58,237,0.35)",
      }}
    >
      {/* Pulse ring when not open */}
      {!isOpen && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "rgba(124,58,237,0.25)",
            animation: "ai-pulse 2s ease-out infinite",
          }}
        />
      )}

      <BsRobot size={26} color="#fff" />

      {/* Unread badge */}
      {unreadCount > 0 && (
        <span
          className="absolute top-0 right-0 flex items-center justify-center rounded-full text-white font-bold"
          style={{
            width: 20,
            height: 20,
            background: "#ef4444",
            fontSize: 10,
            transform: "translate(20%, -20%)",
          }}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}

      <style>{`
        @keyframes ai-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.5); opacity: 0;   }
          100% { transform: scale(1.5); opacity: 0;   }
        }
      `}</style>
    </button>
  );
};

export default AiAvatarButton;
