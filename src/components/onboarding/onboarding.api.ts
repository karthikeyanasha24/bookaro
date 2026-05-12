/**
 * Onboarding API — seam between frontend and backend.
 *
 * This module calls the backend onboarding endpoints via `ApiClient` and
 * keeps a small localStorage fallback for offline/mock usage. The backend
 * is the source of truth for onboarding state.
 *
 * Backend contract (draft):
 *   GET  /onboarding/state           → OnboardingStateDTO
 *   PUT  /onboarding/profile         → { profile, objective }
 *   PUT  /onboarding/objective       → { objective }
 *   POST /onboarding/event           → { eventType }
 *
 * The backend is the SOLE authority on completion state.
 * The frontend only fires events and displays what the backend returns.
 */

import {
  ActionId,
  CompletionState,
  Objective,
  OnboardingEventType,
  Profile,
} from './onboarding.types';
import ApiClient from '../../methods/api/apiClient';

// ---------------------------------------------------------------------------
// DTO — mirrors the backend response shape
// ---------------------------------------------------------------------------

export interface OnboardingStateDTO {
  profile: Profile;
  objective: Objective;
  completions: Partial<Record<ActionId, CompletionState>>;
}

// ---------------------------------------------------------------------------
// Event → action(s) mapping used only by the mock fallback
// ---------------------------------------------------------------------------

const EVENT_TO_ACTIONS: Record<OnboardingEventType, ActionId[]> = {
  property_published_sale:       ['put_property_for_sale'],
  property_published_rent:       ['put_property_for_rent'],
  property_published_directory:  ['publish_property_directory'],
  p2p_campaign_started:          ['estimate_property_value'],
  transaction_history_searched:  ['consult_transaction_history'],
  training_content_viewed:       ['learn_real_estate'],
  seller_dossier_document_added: ['build_seller_dossier'],
  buyer_dossier_document_added:  ['build_buyer_dossier'],
  tenant_dossier_document_added: ['build_tenant_dossier'],
  peer_estimation_submitted:     ['peer_estimation'],
  property_searched_sale:        ['search_property_buy'],
  property_searched_rent:        ['search_property_rent'],
  directory_browsed:             ['browse_property_directory'],
  professional_searched:         ['find_professional'],
  property_followed:             ['follow_property'],
  owner_contacted:               ['contact_owner_agency'],
};

// ---------------------------------------------------------------------------
// Mock persistence (localStorage) — used as an offline fallback only
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'anyhomes_onboarding';

const DEFAULT_STATE: OnboardingStateDTO = {
  profile: 'owner',
  objective: 'sell',
  completions: {},
};

// TODO (PROD): Remove the localStorage fallback below before shipping to
// production. It exists to support demos and offline development; the backend
// is the single source of truth for onboarding state and should be relied on
// in production builds.

function readMockState(): OnboardingStateDTO {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_STATE };
}

function writeMockState(state: OnboardingStateDTO): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Public API object — swap method bodies for real ApiClient calls when ready
// ---------------------------------------------------------------------------

export const onboardingApi = {
  /** GET /onboarding/state */
  getState: (): Promise<OnboardingStateDTO> => {
    return ApiClient.get('/onboarding/state').then((res) => {
      if (res && res.success && res.data) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data)); } catch {}
        return res.data as OnboardingStateDTO;
      }
      return readMockState();
    }).catch(() => readMockState());
  },

  /** PUT /onboarding/profile */
  updateProfile: (profile: Profile, objective: Objective): Promise<void> => {
    return ApiClient.put('/onboarding/profile', { profile, objective }).then((res) => {
      if (res && res.success) {
        try {
          const state = readMockState();
          const next = { ...state, profile, objective };
          writeMockState(next);
        } catch {}
      }
    }).catch(() => {
      const state = readMockState();
      writeMockState({ ...state, profile, objective });
    });
  },

  /** PUT /onboarding/objective */
  updateObjective: (objective: Objective): Promise<void> => {
    return ApiClient.put('/onboarding/objective', { objective }).then((res) => {
      if (res && res.success) {
        try {
          const state = readMockState();
          writeMockState({ ...state, objective });
        } catch {}
      }
    }).catch(() => {
      const state = readMockState();
      writeMockState({ ...state, objective });
    });
  },

  /**
   * POST /onboarding/event
   * The backend receives the event and decides which action(s) become done.
   * The frontend never computes completion.
   */
  sendEvent: (eventType: OnboardingEventType): Promise<void> => {
    return ApiClient.post('/onboarding/event', { eventType }).then((res) => {
      if (res && res.success) {
        return onboardingApi.getState().then(() => {});
      }
      const state = readMockState();
      const toComplete = EVENT_TO_ACTIONS[eventType] ?? [];
      const completions = { ...state.completions };
      toComplete.forEach((id) => { completions[id] = 'done'; });
      writeMockState({ ...state, completions });
      return Promise.resolve();
    }).catch(() => {
      const state = readMockState();
      const toComplete = EVENT_TO_ACTIONS[eventType] ?? [];
      const completions = { ...state.completions };
      toComplete.forEach((id) => { completions[id] = 'done'; });
      writeMockState({ ...state, completions });
      return Promise.resolve();
    });
  },
};

// ---------------------------------------------------------------------------
// Standalone helpers — usable from any JS/JSX page without a React context
// ---------------------------------------------------------------------------

/**
 * Fire an onboarding event from any page or handler.
 * Fire-and-forget: no return value, errors are silently swallowed.
 *
 * Usage:
 *   import { fireOnboardingEvent } from '../../components/onboarding/onboarding.api';
 *   fireOnboardingEvent('property_published_sale');
 */
export function fireOnboardingEvent(eventType: OnboardingEventType): void {
  onboardingApi.sendEvent(eventType).catch(() => { /* non-blocking */ });
}

/**
 * Synchronous read of the current state — used only where async is not possible
 * (e.g. post-login redirect decision).
 * When real backend is wired, replace with a cached value from the last API response.
 */
export function getOnboardingStateSync(): OnboardingStateDTO {
  return readMockState();
}
