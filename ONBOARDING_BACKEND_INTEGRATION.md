# Onboarding — Guide d'intégration backend

> Ce document décrit le contrat entre le frontend et le backend pour la feature onboarding.
> Il sert de référence lors du développement des endpoints côté serveur.

---

## Principe d'architecture

**Le backend est la seule autorité sur l'état de complétion.**

- Le frontend ne calcule jamais si une action est `done` ou `not_done`.
- Il se contente de **fire des événements** (`POST /onboarding/event`) et d'**afficher ce que le serveur retourne**.
- Le mapping `eventType → action(s) complétée(s)` vit côté serveur.

Le seul fichier à modifier lors du branchement du vrai backend est :
**`src/components/onboarding/onboarding.api.ts`**

Aucun composant, hook, ni page existante ne doit changer.

---

## Endpoints à implémenter

### `GET /onboarding/state`

Retourne l'état d'onboarding de l'utilisateur connecté.

**Response :**
```json
{
  "profile": "owner",
  "objective": "sell",
  "completions": {
    "put_property_for_sale": "done",
    "estimate_property_value": "not_done"
  }
}
```

- `profile` : `"owner"` | `"searcher"`
- `objective` : `"sell"` | `"rent"` | `"increase_value"` | `"active_buy"` | `"active_rent"` | `"passive"`
- `completions` : objet partiel — seules les actions connues du serveur sont retournées. Les clés absentes sont considérées `not_done` côté frontend.

---

### `PUT /onboarding/profile`

Appelé quand l'utilisateur change de profil dans la phrase de configuration.

**Body :**
```json
{
  "profile": "searcher",
  "objective": "active_buy"
}
```

> Note : quand le profil change, l'objectif est réinitialisé à sa valeur par défaut (`"sell"` pour owner, `"active_buy"` pour searcher). Les deux sont envoyés ensemble.

---

### `PUT /onboarding/objective`

Appelé quand l'utilisateur change d'objectif sans changer de profil.

**Body :**
```json
{
  "objective": "rent"
}
```

---

### `POST /onboarding/event`

**L'endpoint principal.** Reçoit un événement métier et met à jour la complétion des actions correspondantes.

**Body :**
```json
{
  "eventType": "property_published_sale"
}
```

**Response :** `200 OK` (vide ou état mis à jour — voir section ci-dessous)

> Le frontend fait un fire-and-forget (`fireOnboardingEvent(eventType)`). Les erreurs sont swallowed silencieusement pour ne pas perturber le flux utilisateur.

---

## Table des événements

Chaque ligne du tableau ci-dessous correspond à un appel `POST /onboarding/event` que le frontend peut envoyer, l'action d'onboarding qui doit passer en `done`, et la page source qui déclenche l'événement.

| `eventType`                     | Action complétée (`ActionId`)    | Déclencheur (page / action utilisateur)                              |
|---------------------------------|----------------------------------|----------------------------------------------------------------------|
| `property_published_sale`       | `put_property_for_sale`          | `propertySteps/Steps/step14.js` — `res.success` + `propertyType === 'sale'` |
| `property_published_rent`       | `put_property_for_rent`          | `propertySteps/Steps/step14.js` — `res.success` + `propertyType === 'rent'` |
| `property_published_directory`  | `publish_property_directory`     | `propertySteps/Steps/step14.js` — `res.success` + `propertyType === 'directory'` |
| `p2p_campaign_started`          | `estimate_property_value`        | `PeertopeerEstimation/socialEstimation.jsx` — `ApiClient.post("peerCampaign/start/campagin")` → `res.success` |
| `transaction_history_searched`  | `consult_transaction_history`    | `PastTransactions/index.js` — `navigateToList()` juste avant `navigate('/past-transation-list...')` |
| `training_content_viewed`       | `learn_real_estate`              | `training/index.jsx` — `getData()` → `res.success` (vidéos chargées) |
| `seller_dossier_document_added` | `build_seller_dossier`           | `SellerFile/index.js` — `ApiClient.multiImageUpload` → `res.success` |
| `buyer_dossier_document_added`  | `build_buyer_dossier`            | `BuyerFile/index.js` — `ApiClient.multiImageUpload` → `res.success` |
| `tenant_dossier_document_added` | `build_tenant_dossier`           | `RenterFile/index.js` — `ApiClient.multiImageUpload` → `res.success` |
| `peer_estimation_submitted`     | `peer_estimation`                | `PeertopeerEstimation/estimation.jsx` — `ApiClient.post("peerCampaign/submit/estimation")` → `res.success` |
| `property_searched_sale`        | `search_property_buy`            | `Property/index.js` — `getData()` + `dto.propertyType === 'sale'` (ou absent) |
| `property_searched_rent`        | `search_property_rent`           | `Property/index.js` — `getData()` + `dto.propertyType === 'rent'` |
| `directory_browsed`             | `browse_property_directory`      | `Property/index.js` — `getData()` + `dto.propertyType === 'directory'` |
| `professional_searched`         | `find_professional`              | `Prolist/index.js` — `getData()` appelée (recherche de pros) |
| `property_followed`             | `follow_property`                | À implémenter — action "Suivre un bien" sur la fiche bien |
| `owner_contacted`               | `contact_owner_agency`           | À implémenter — bouton contact sur la fiche bien |

---

## Intégration dans les pages (côté frontend)

Une fois le backend prêt, les pages déclencheurs devront **remplacer** le mock localStorage par de vrais appels HTTP. Aucun changement de code dans les pages n'est nécessaire — elles appellent déjà `fireOnboardingEvent(...)`.

> **Statut actuel des injections de triggers dans les pages :** ⏳ À faire (étape suivante du développement frontend).

Le pattern d'injection dans chaque page sera :
```js
import { fireOnboardingEvent } from '../../components/onboarding/onboarding.api';

// Dans le callback de succès de l'action métier :
if (res.success) {
  fireOnboardingEvent('property_published_sale'); // fire-and-forget
  // ... reste du code existant inchangé
}
```

---

## Swapper le mock par de vrais appels

Dans `src/components/onboarding/onboarding.api.ts`, chaque méthode contient un commentaire `TODO`. Exemple pour `sendEvent` :

```ts
sendEvent: (eventType: OnboardingEventType): Promise<void> => {
  // TODO: return ApiClient.post('onboarding/event', { eventType });

  // ↓ Supprimer ce bloc mock et décommenter la ligne ci-dessus
  const state = readMockState();
  const toComplete = EVENT_TO_ACTIONS[eventType] ?? [];
  const completions = { ...state.completions };
  toComplete.forEach((id) => { completions[id] = 'done'; });
  writeMockState({ ...state, completions });
  return Promise.resolve();
},
```

Les fonctions `readMockState`, `writeMockState` et le dictionnaire `EVENT_TO_ACTIONS` peuvent être **supprimés** une fois le backend branché.

---

## Considérations backend

- L'état d'onboarding est **lié à l'utilisateur authentifié** — stocker par `userId`.
- La table de completions est **append-only** : une action passée en `done` ne revient jamais en `not_done`.
- Les événements peuvent arriver en double (réseau, retry) — le traitement doit être **idempotent**.
- Le profil et l'objectif peuvent changer au fil du temps — prévoir un historique si l'analyse des parcours utilisateurs est envisagée.
- Certaines actions n'ont pas encore de déclencheur (`property_followed`, `owner_contacted`) — les compléter ne nécessitera qu'un `fireOnboardingEvent(...)` dans la page concernée, sans toucher à la couche API.
