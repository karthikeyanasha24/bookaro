export type Profile = 'owner' | 'searcher';

export type OwnerObjective = 'sell' | 'rent' | 'increase_value';
export type SearcherObjective = 'active_buy' | 'active_rent' | 'passive';
export type Objective = OwnerObjective | SearcherObjective;

export type CompletionState = 'done' | 'not_done';

export type ActionId =
  | 'put_property_for_sale'
  | 'put_property_for_rent'
  | 'publish_property_directory'
  | 'estimate_property_value'
  | 'consult_transaction_history'
  | 'get_targeted_help'
  | 'learn_real_estate'
  | 'build_seller_dossier'
  | 'build_buyer_dossier'
  | 'build_tenant_dossier'
  | 'get_personalized_advice'
  | 'peer_estimation'
  | 'search_property_buy'
  | 'search_property_rent'
  | 'find_professional'
  | 'browse_property_directory'
  | 'follow_property'
  | 'contact_owner_agency';

/**
 * Backend event types — fired by the frontend, processed server-side.
 * The backend decides which action(s) become 'done' for each event.
 * To add a new trigger: extend this union, then add the mapping in onboarding.api.ts.
 */
export type OnboardingEventType =
  | 'property_published_sale'
  | 'property_published_rent'
  | 'property_published_directory'
  | 'p2p_campaign_started'
  | 'transaction_history_searched'
  | 'training_content_viewed'
  | 'seller_dossier_document_added'
  | 'buyer_dossier_document_added'
  | 'tenant_dossier_document_added'
  | 'peer_estimation_submitted'
  | 'property_searched_sale'
  | 'property_searched_rent'
  | 'directory_browsed'
  | 'professional_searched'
  | 'property_followed'
  | 'owner_contacted';

export interface OnboardingActionMeta {
  id: ActionId;
  label: string;
  description: string;
  ctaLabel: string;
  targetRoute: string;
  isAvailable: boolean;
  isActivationGoal?: boolean;
  /** Backend event fired when the user completes the underlying action in the target page. */
  eventType?: OnboardingEventType;
}

export interface HistoryEntry {
  profile: Profile;
  objective: Objective;
  timestamp: string;
}

export interface OnboardingState {
  profile: Profile;
  objective: Objective;
  completions: Partial<Record<ActionId, CompletionState>>;
  history: HistoryEntry[];
}

export const PROFILE_LABELS: Record<Profile, string> = {
  owner: 'Propriétaire',
  searcher: 'En recherche',
};

export const OBJECTIVE_LABELS: Record<Objective, string> = {
  sell: 'Vendre',
  rent: 'Louer',
  increase_value: 'Accroître la valeur',
  active_buy: 'Recherche active — achat',
  active_rent: 'Recherche active — location',
  passive: 'Recherche passive ou anticipée',
};

export const OWNER_OBJECTIVES: OwnerObjective[] = ['sell', 'rent', 'increase_value'];
export const SEARCHER_OBJECTIVES: SearcherObjective[] = ['active_buy', 'active_rent', 'passive'];
