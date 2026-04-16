# Dashboard API Alignment Checklist

Objectif: finaliser le passage du dashboard en mode API reel, avec un contrat stable section par section.

## Contexte actuel

- Front dashboard finalise cote UX/UI.
- Persistance ordre par profil active.
- Validation payload front renforcee (sections requises) dans `src/Pages/Dashboard/useDashboardOverview.js`.
- API locale de dev completee avec `followedPropertyNews` dans `server.js`.

## P0 - Bloquants (a traiter en premier)

## 1) Contrat global `GET /dashboard/overview`

- [ ] Le payload contient toujours:
  - [ ] `user`
  - [ ] `meta`
  - [ ] `sections`
- [ ] `sections` contient toujours les cles suivantes (meme si vides):
  - [ ] `todoList`
  - [ ] `propertyAttractivity`
  - [ ] `savedSearchResults`
  - [ ] `pastTransactions`
  - [ ] `p2pEstimation`
  - [ ] `p2pReport`
  - [ ] `trainingCenter`
  - [ ] `propertySearchPipeline`
  - [ ] `ownerPipeline`
  - [ ] `followedPropertyNews`
- [ ] Le backend renvoie `success: true` + `data` conforme schema.

Definition of done:
- [ ] Plus aucun fallback mock en condition nominale.
- [ ] Aucun warning "Invalid payload, fallback to mocks" dans console.

## 2) `followedPropertyNews` (nouvelle section)

Champs minimaux attendus par le front:
- [ ] `visible: boolean`
- [ ] `items: array`
- [ ] Chaque item:
  - [ ] `id: string`
  - [ ] `occurredAt: string (ISO)`
  - [ ] `newsTitle: string`
  - [ ] `property.id: string`
  - [ ] `property.title: string`
  - [ ] `property.status: string`
  - [ ] `property.rooms: number`
  - [ ] `property.surface: number`
  - [ ] `property.location: string`
  - [ ] `property.imageUrl: string`
  - [ ] optionnel: `property.timelineRoute: string`

Definition of done:
- [ ] Le clic carte ouvre la timeline du bien depuis la data API.
- [ ] Pas de data hardcodee de secours visible.

## P1 - Qualite de contrat (stabilisation)

## 3) `todoList`

Champs a stabiliser:
- [ ] `items[].type`
- [ ] `items[].role`
- [ ] `items[].priority`
- [ ] `items[].lead` (quand applicable)
- [ ] `items[].action.route`

Definition of done:
- [ ] Les cartes todo sont 100% drivees par API (pas de logique implicite front).

## 4) `trainingCenter`

Champs recommandes:
- [ ] `items[].authorAvatarUrl`
- [ ] `items[].consumptionTime`
- [ ] `items[].contentType` valeur stable: `written | video`

Definition of done:
- [ ] Plus de fallback implicite sur avatar/time.

## 5) `p2pReport`

Champs a unifier (noms stables):
- [ ] `pricing` (noms fixes)
- [ ] compteurs utilisateurs (un seul naming, pas variantes)
- [ ] `qualitativeAssessment` (noms fixes)

Definition of done:
- [ ] Retrait des variantes de champs cote front.

## 6) `ownerPipeline`

Champs recommandes:
- [ ] `property.pricePerSqm` fourni par API
- [ ] metriques completes pour vente/location

Definition of done:
- [ ] Plus de calcul metier prix/m2 cote front.

## P2 - Industrialisation

## 7) Observabilite et garde-fous

- [ ] Logger cote backend les sections vides/non alimentees.
- [ ] Ajouter un compteur de fallback cote front (dev only).
- [ ] Ajouter tests de non-regression payload.

## 8) Synchronisation multi-device des preferences dashboard

- [ ] Conserver localStorage (deja en place) en fallback.
- [ ] Option future: endpoint user preferences pour sync serveur.

## Plan d execution recommande (court)

Sprint court A:
- [ ] Valider schema global + toutes sections presentes (P0.1)
- [ ] Finaliser `followedPropertyNews` backend reel (P0.2)
- [ ] Recette complete 3 profils

Sprint court B:
- [ ] Stabiliser `todoList`, `trainingCenter`, `p2pReport`, `ownerPipeline` (P1)
- [ ] Reduire/retirer les variantes de mapping front

Sprint court C:
- [ ] Observabilite + tests payload (P2)
- [ ] Evaluer sync server des preferences utilisateur

## Recette fonctionnelle minimale (check rapide)

- [ ] Profil acheteur: ordre, drag, reset ordre, persistance
- [ ] Profil vendeur: ordre, drag, reset ordre, persistance
- [ ] Profil proprietaire: ordre, drag, reset ordre, persistance
- [ ] Section followed news: affichage API, clic carte => timeline
- [ ] Aucun warning fallback mock en nominal

## Fichiers front concernes (reference)

- `src/Pages/Dashboard/useDashboardOverview.js`
- `src/Pages/Dashboard/dashboard.api.js`
- `src/Pages/Dashboard/index.js`
- `src/Pages/Dashboard/components/FollowedPropertyNewsSection.js`
- `src/Pages/Dashboard/components/TodoListSection.js`
- `src/Pages/Dashboard/components/TrainingCenterSection.js`
- `src/Pages/Dashboard/components/P2PReportSection.js`
- `src/Pages/Dashboard/components/OwnerPipelineSection.js`
- `server.js`
