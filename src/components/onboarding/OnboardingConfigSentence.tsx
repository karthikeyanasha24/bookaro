import React from 'react';
import { Objective, Profile } from './onboarding.types';

interface Props {
  profile: Profile;
  objective: Objective;
  onProfileChange: (profile: Profile) => void;
  onObjectiveChange: (objective: Objective) => void;
}

const Pill: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium border transition-all mx-0.5 ${
      active
        ? 'bg-[#976DD0] text-white border-[#976DD0]'
        : 'bg-white text-[#976DD0] border-[#976DD0] hover:bg-[#F3EEF9]'
    }`}
  >
    {label}
  </button>
);

const OnboardingConfigSentence: React.FC<Props> = ({
  profile,
  objective,
  onProfileChange,
  onObjectiveChange,
}) => {
  const isOwner = profile === 'owner';

  return (
    <div className="flex flex-wrap items-center gap-y-2 text-[14px] text-[#47525E] mb-6 leading-relaxed">
      <span className="mr-1">Vous êtes :</span>

      <Pill
        label="Propriétaire"
        active={isOwner}
        onClick={() => onProfileChange('owner')}
      />
      <Pill
        label="En recherche"
        active={!isOwner}
        onClick={() => onProfileChange('searcher')}
      />

      {isOwner ? (
        <>
          <span className="mx-1">et vous souhaitez</span>
          <Pill
            label="Vendre"
            active={objective === 'sell'}
            onClick={() => onObjectiveChange('sell')}
          />
          <Pill
            label="Louer"
            active={objective === 'rent'}
            onClick={() => onObjectiveChange('rent')}
          />
          <span className="mx-1">ou</span>
          <Pill
            label="Accroître"
            active={objective === 'increase_value'}
            onClick={() => onObjectiveChange('increase_value')}
          />
          <span className="ml-1">la valeur de votre bien.</span>
        </>
      ) : (
        <>
          <span className="mx-1">immédiate d'un bien à</span>
          <Pill
            label="Acheter"
            active={objective === 'active_buy'}
            onClick={() => onObjectiveChange('active_buy')}
          />
          <Pill
            label="Louer"
            active={objective === 'active_rent'}
            onClick={() => onObjectiveChange('active_rent')}
          />
          <span className="mx-1">ou</span>
          <Pill
            label="En recherche anticipée"
            active={objective === 'passive'}
            onClick={() => onObjectiveChange('passive')}
          />
        </>
      )}
    </div>
  );
};

export default OnboardingConfigSentence;
