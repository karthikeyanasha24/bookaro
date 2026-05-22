import React from 'react';
import { ActionId, CompletionState, OnboardingActionMeta } from './onboarding.types';
import OnboardingActionCard from './OnboardingActionCard';

interface Props {
  actions: OnboardingActionMeta[];
  completions: Partial<Record<ActionId, CompletionState>>;
}

const OnboardingActionGrid: React.FC<Props> = ({ actions, completions }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action) => (
        <OnboardingActionCard
          key={action.id}
          action={action}
          completion={completions[action.id]}
        />
      ))}
    </div>
  );
};

export default OnboardingActionGrid;
