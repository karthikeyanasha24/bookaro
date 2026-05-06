import { useCallback, useEffect, useState } from 'react';
import { getActionsForConfig } from './onboarding.catalog';
import { Objective, OWNER_OBJECTIVES, Profile } from './onboarding.types';
import { getOnboardingStateSync, OnboardingStateDTO, onboardingApi } from './onboarding.api';

// Re-export so callers of the hook don't need to know about the API layer
export { fireOnboardingEvent } from './onboarding.api';

// ---------------------------------------------------------------------------
// Helpers (pure — no side effects)
// ---------------------------------------------------------------------------

export function computeProgress(state: OnboardingStateDTO): number {
  const actions = getActionsForConfig(state.profile, state.objective);
  if (actions.length === 0) return 0;
  const done = actions.filter((a) => state.completions[a.id] === 'done').length;
  return Math.round((done / actions.length) * 100);
}

/**
 * Called right after login to decide where to redirect the user.
 * Reads synchronously from the local cache (last known backend state).
 * When the real backend is wired, replace getOnboardingStateSync() with
 * the cached response from the last authenticated API call.
 */
export function getPostLoginRoute(): string {
  const state = getOnboardingStateSync();
  return computeProgress(state) >= 50 ? '/dashboard' : '/onboarding';
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useOnboarding() {
  // Initialise from the synchronous cache so there is no loading flash in mock mode.
  // When the real backend is wired, initialise with null and show a loader until
  // onboardingApi.getState() resolves.
  const [state, setState] = useState<OnboardingStateDTO>(getOnboardingStateSync);

  // On mount, (re-)fetch from backend to get the authoritative state.
  useEffect(() => {
    onboardingApi.getState().then(setState);
  }, []);

  const setProfile = useCallback((profile: Profile) => {
    const defaultObjective: Objective = profile === 'owner' ? 'sell' : 'active_buy';
    onboardingApi.updateProfile(profile, defaultObjective).then(() => {
      setState((prev) => ({ ...prev, profile, objective: defaultObjective }));
    });
  }, []);

  const setObjective = useCallback((objective: Objective) => {
    onboardingApi.updateObjective(objective).then(() => {
      setState((prev) => ({ ...prev, objective }));
    });
  }, []);

  const actions = getActionsForConfig(state.profile, state.objective);
  const progress = computeProgress(state);
  const remainingActions = actions.filter((a) => state.completions[a.id] !== 'done');
  const completedActions = actions.filter((a) => state.completions[a.id] === 'done');
  const isOwner = state.profile === 'owner';
  const availableObjectives = isOwner ? OWNER_OBJECTIVES : ['active_buy', 'active_rent', 'passive'];

  return {
    state,
    actions,
    progress,
    remainingActions,
    completedActions,
    availableObjectives,
    setProfile,
    setObjective,
  };
}
