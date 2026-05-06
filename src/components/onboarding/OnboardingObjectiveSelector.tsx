import React from 'react';
import { OBJECTIVE_LABELS, Objective } from './onboarding.types';

interface Props {
  objectives: string[];
  activeObjective: Objective;
  onChange: (objective: Objective) => void;
}

const OnboardingObjectiveSelector: React.FC<Props> = ({ objectives, activeObjective, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {objectives.map((obj) => {
        const isActive = activeObjective === obj;
        return (
          <button
            key={obj}
            onClick={() => onChange(obj as Objective)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${
              isActive
                ? 'bg-[#976DD0] text-white border-[#976DD0]'
                : 'bg-white text-[#976DD0] border-[#976DD0] hover:bg-[#F3EEF9]'
            }`}
          >
            {OBJECTIVE_LABELS[obj as Objective]}
          </button>
        );
      })}
    </div>
  );
};

export default OnboardingObjectiveSelector;
