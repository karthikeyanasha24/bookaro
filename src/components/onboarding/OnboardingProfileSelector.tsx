import React from 'react';
import { PROFILE_LABELS, Profile } from './onboarding.types';

interface Props {
  activeProfile: Profile;
  onChange: (profile: Profile) => void;
}

const OnboardingProfileSelector: React.FC<Props> = ({ activeProfile, onChange }) => {
  const isOwner = activeProfile === 'owner';

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[14px] font-medium text-[#47525E]">Vous êtes :</span>
      <div className="flex items-center bg-[#F3EEF9] rounded-full p-1 gap-1">
        <button
          onClick={() => onChange('owner')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
            isOwner
              ? 'bg-[#976DD0] text-white shadow-sm'
              : 'text-[#976DD0] hover:bg-[#E8DCF5]'
          }`}
        >
          {PROFILE_LABELS.owner}
        </button>
        <button
          onClick={() => onChange('searcher')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
            !isOwner
              ? 'bg-[#976DD0] text-white shadow-sm'
              : 'text-[#976DD0] hover:bg-[#E8DCF5]'
          }`}
        >
          {PROFILE_LABELS.searcher}
        </button>
      </div>
    </div>
  );
};

export default OnboardingProfileSelector;
