import React from 'react';
import { ActionId, CompletionState, OnboardingActionMeta } from './onboarding.types';

interface Props {
  progress: number;
  actions: OnboardingActionMeta[];
  completions: Partial<Record<ActionId, CompletionState>>;
}

const OnboardingProgressSidebar: React.FC<Props> = ({ progress, actions, completions }) => {
  const completedCount = actions.filter((a) => completions[a.id] === 'done').length;
  const total = actions.length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-6">
      <h2 className="text-[14px] font-semibold text-[#47525E] mb-4 leading-snug">
        Checklist de votre onboarding
      </h2>

      {/* Progress bar */}
      <div className="mb-1">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-[#976DD0] h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-[12px] text-gray-500 mb-5">
        <span>{progress}% réalisé</span>
        <span>
          Étapes réalisées {completedCount}/{total}
        </span>
      </div>

      {/* Checklist */}
      <ul className="flex flex-col gap-2">
        {actions.map((action) => {
          const isDone = completions[action.id] === 'done';
          return (
            <li key={action.id} className="flex items-start gap-2">
              <span
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isDone ? 'bg-[#976DD0] border-[#976DD0]' : 'border-gray-300 bg-white'
                }`}
              >
                {isDone && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={`text-[12px] leading-tight ${isDone ? 'text-[#976DD0] line-through' : 'text-[#47525E]'}`}>
                {action.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OnboardingProgressSidebar;
