# Marketplace — Demandes de service (admin panel)

> **Statut :** Spécifications. Backend implémenté, UI admin à construire.
> **Auteur :** Yves
> **Date :** 2026-05-07

## Contexte

Sur la page Marketplace côté acheteur, un bouton « Faire une demande » permet à un utilisateur connecté qui ne trouve pas le service recherché de soumettre une demande libre. La demande est stockée et l'admin doit pouvoir la consulter et la traiter depuis le back-office.

## Backend (déjà implémenté)

### Modèle `ServiceRequest`
Fichier : `app/modules/services-marketplace/models/ServiceRequest.model.js`

| Champ          | Type                | Notes                                 |
| -------------- | ------------------- | ------------------------------------- |
| `user`         | ObjectId → User     | Auteur de la demande                  |
| `userEmail`    | String              | Snapshot pour affichage rapide        |
| `userName`     | String              | Snapshot pour affichage rapide        |
| `phone`        | String **requis**   | Téléphone fourni dans le formulaire   |
| `category`     | ObjectId            | Référence ServiceCategory_fr/_en      |
| `categoryName` | String **requis**   | Snapshot du nom de catégorie          |
| `lang`         | 'fr' \| 'en'        | Langue du formulaire                  |
| `description`  | String **requis**   | max 2000 caractères                   |
| `status`       | 'pending' \| 'processed' | défaut `pending`                 |
| `processedAt`  | Date \| null        | Renseigné quand status = processed    |
| `processedBy`  | ObjectId → User     | Admin ayant traité                    |
| `adminNote`    | String              | Note interne facultative              |
| `createdAt`    | Date                | timestamps Mongoose                   |
| `updatedAt`    | Date                | timestamps Mongoose                   |

### Endpoints

| Méthode | Path                                          | Auth   | Description                  |
| ------- | --------------------------------------------- | ------ | ---------------------------- |
| POST    | `/marketplace/requests`                       | user   | Création d'une demande       |
| GET     | `/marketplace/requests/mine`                  | user   | Mes demandes                 |
| GET     | `/admin/marketplace/requests`                 | admin* | Liste paginée + filtres      |
| PATCH   | `/admin/marketplace/requests/:id/status`      | admin* | Changer statut + adminNote   |

\* La vérification du rôle admin n'est pas encore en place sur le module marketplace (cohérent avec les autres routes `/admin/marketplace/*`). À durcir lors d'une passe sécurité globale.

### Filtres GET admin
- `?status=pending|processed`
- `?q=texte` (recherche dans description, categoryName, userEmail, userName)
- `?from=ISO&to=ISO`
- `?page=1&limit=20`

Réponse :
```json
{
  "success": true,
  "data": [ /* requests avec user et processedBy populés */ ],
  "pagination": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
}
```

### Notification email
À chaque création, un email est envoyé à `process.env.MARKETPLACE_ADMIN_EMAIL` (fallback `BREVO_AUTH_FROM_EMAIL`) via Brevo, module `auth`. L'envoi est best-effort (n'invalide pas la création si l'envoi échoue).

## UI Admin (à implémenter)

### Emplacement
Nouvelle entrée dans le menu admin : **Marketplace › Demandes de service**.

### Liste
Tableau avec colonnes :
- Date (createdAt, format `dd/mm/yyyy HH:mm`)
- Utilisateur (userName + email)
- Téléphone
- Catégorie (categoryName)
- Description (tronquée 80 car., tooltip pour version complète)
- Statut (badge : `pending` orange, `processed` vert)
- Action : bouton « Voir »

### Filtres en haut de page
- Statut (Tous / En attente / Traité)
- Recherche libre
- Plage de dates (from/to)
- Pagination 20 par défaut

### Détail / drawer
Au clic sur « Voir » :
- Toutes les infos snapshot (user, email, phone, category, lang)
- Description complète
- Date de création
- Si traité : date `processedAt` + nom de l'admin `processedBy` + `adminNote`
- Lien vers la fiche utilisateur (s'il existe)
- Boutons d'action :
  - Si `pending` → « Marquer comme traité » (ouvre champ adminNote optionnel)
  - Si `processed` → « Remettre en attente »

### Wireframe rapide

```
┌──────────────────────────────────────────────────────────────┐
│  Demandes de service          [Status ▾] [Recherche…] [Dates]│
├──────────────────────────────────────────────────────────────┤
│ Date       │ Utilisateur     │ Catégorie  │ Statut │ Action  │
│ 07/05 14h  │ Pauline Dupont  │ Estimation │ ●Pend. │ [ Voir ]│
│ 07/05 11h  │ Jean Martin     │ Photo      │ ●Trait.│ [ Voir ]│
└──────────────────────────────────────────────────────────────┘
```

## Frontend acheteur (déjà implémenté)

- Bouton « Faire une demande » en bas de la page Marketplace
- Si non connecté → modal `AuthRequiredModal` avec liens `/login` et `/register`
- Si connecté → modal `ServiceRequestModal` :
  - Téléphone (pré-rempli depuis `user.mobileNo`)
  - Catégorie (`<select>` peuplé via `GET /marketplace/categories`)
  - Description (textarea, 2000 car. max)
  - Les 3 champs sont obligatoires (validation côté client + serveur)

## Évolutions futures
- Filtrer le `<select>` catégorie sur le groupe `Transaction` uniquement (nécessite l'ajout du champ `group` au modèle ServiceCategory — voir roadmap marketplace).
- Ajouter une vraie protection rôle `admin` sur les routes `/admin/marketplace/*`.
- Permettre à l'admin d'assigner la demande à un pro avec création d'un brouillon de devis.
- Notifier l'utilisateur par email lorsque sa demande est marquée `processed`.
