import React from 'react';
import { Link } from 'react-router-dom';
import {
  MdSell, MdHome, MdBusiness, MdCalculate, MdTimeline, MdHeadset,
  MdBook, MdDescription, MdChat, MdSearch, MdPerson, MdFavorite, MdEmail,
  MdShoppingCart,
} from 'react-icons/md';
import { ActionId, CompletionState, OnboardingActionMeta } from './onboarding.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ACTION_ICONS: Record<ActionId, any> = {
  put_property_for_sale:       MdSell,
  put_property_for_rent:       MdHome,
  publish_property_directory:  MdBusiness,
  estimate_property_value:     MdCalculate,
  consult_transaction_history: MdTimeline,
  get_targeted_help:           MdHeadset,
  learn_real_estate:           MdBook,
  build_seller_dossier:        MdDescription,
  build_buyer_dossier:         MdDescription,
  build_tenant_dossier:        MdDescription,
  get_personalized_advice:     MdChat,
  peer_estimation:             MdShoppingCart,
  search_property_buy:         MdSearch,
  search_property_rent:        MdSearch,
  find_professional:           MdPerson,
  browse_property_directory:   MdBusiness,
  follow_property:             MdFavorite,
  contact_owner_agency:        MdEmail,
};

interface Props {
  action: OnboardingActionMeta;
  completion: CompletionState | undefined;
}

const OnboardingActionCard: React.FC<Props> = ({ action, completion }) => {
  const isDone = completion === 'done';
  const Icon = ACTION_ICONS[action.id];

  return (
    <div
      className={`relative bg-white border rounded-xl p-5 flex flex-col gap-3 transition-all ${
        isDone ? 'border-[#976DD0] bg-[#FAF7FE]' : 'border-gray-200 hover:border-[#976DD0] hover:shadow-sm'
      }`}
    >
      {/* Completion badge */}
      {isDone && (
        <span className="absolute top-3 right-3 bg-[#976DD0] text-white rounded-full w-6 h-6 flex items-center justify-center">
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}

      {/* Icon */}
      <span className="text-black flex justify-center">
        <Icon size={28} />
      </span>

      {/* Title */}
      <h3 className="text-[14px] font-semibold leading-snug text-center text-[#47525E]">
        {action.label}
      </h3>

      {/* Description */}
      <p className="text-[12px] text-gray-500 leading-relaxed flex-1">{action.description}</p>

      {/* CTA */}
      {action.isAvailable ? (
        <Link
          to={action.targetRoute}
          className="mt-auto self-center inline-flex items-center px-4 py-1.5 rounded-full bg-[#976DD0] text-white text-[12px] font-medium hover:bg-[#7f58b5] transition-colors whitespace-nowrap"
        >
          {action.ctaLabel}
        </Link>
      ) : (
        <span className="mt-auto self-center inline-flex items-center px-4 py-1.5 rounded-full bg-gray-100 text-gray-400 text-[12px] font-medium cursor-not-allowed whitespace-nowrap">
          Bientôt disponible
        </span>
      )}
    </div>
  );
};

export default OnboardingActionCard;
