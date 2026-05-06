/**
 * Onboarding API — single seam between frontend and backend.
 *
 * TODAY  : all methods are mocked with localStorage (simulates server-side persistence).
 * FUTURE : replace each method body with the corresponding ApiClient call.
 *          No other file needs to change — the hook, components and trigger helpers
 *          all depend only on this module.
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

// ---------------------------------------------------------------------------
// DTO — mirrors the backend response shape
// ---------------------------------------------------------------------------

export interface OnboardingStateDTO {
  profile: Profile;
  objective: Objective;
  completions: Partial<Record<ActionId, CompletionState>>;
}

// ---------------------------------------------------------------------------
// Event → action(s) mapping (mock backend logic — will live server-side)
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
// Mock persistence (localStorage — simulates server-side storage)
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'anyhomes_onboarding';

const DEFAULT_STATE: OnboardingStateDTO = {
  profile: 'owner',
  objective: 'sell',
  completions: {},
};

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
    // TODO: return ApiClient.get('onboarding/state');
    return Promise.resolve(readMockState());
  },

  /** PUT /onboarding/profile */
  updateProfile: (profile: Profile, objective: Objective): Promise<void> => {
    // TODO: return ApiClient.put('onboarding/profile', { profile, objective });
    const state = readMockState();
    writeMockState({ ...state, profile, objective });
    return Promise.resolve();
  },

  /** PUT /onboarding/objective */
  updateObjective: (objective: Objective): Promise<void> => {
    // TODO: return ApiClient.put('onboarding/objective', { objective });
    const state = readMockState();
    writeMockState({ ...state, objective });
    return Promise.resolve();
  },

  /**
   * POST /onboarding/event
   * The backend receives the event and decides which action(s) become done.
   * The frontend never computes completion.
   */
  sendEvent: (eventType: OnboardingEventType): Promise<void> => {
    // TODO: return ApiClient.post('onboarding/event', { eventType });
    const state = readMockState();
    const toComplete = EVENT_TO_ACTIONS[eventType] ?? [];
    const completions = { ...state.completions };
    toComplete.forEach((id) => { completions[id] = 'done'; });
    writeMockState({ ...state, completions });
    return Promise.resolve();
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
