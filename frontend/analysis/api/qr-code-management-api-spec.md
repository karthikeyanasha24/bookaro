# Spécification API — Gestion des QR Codes

## Objectif
Permettre à un utilisateur (propriétaire ou agence) de gérer ses QR Codes associés à ses biens immobiliers : affichage, recherche, pagination, suppression, téléchargement.

---

## Endpoints

### 1. Récupérer la liste des biens avec QR Codes

**GET** `/api/properties`

#### Query Parameters
- `search` _(string, optionnel)_ : Texte à rechercher dans le titre ou la localisation du bien
- `page` _(int, optionnel, défaut 1)_ : Numéro de page
- `pageSize` _(int, optionnel, défaut 10)_ : Nombre de résultats par page

#### Réponse
```json
{
  "data": [
    {
      "id": 1,
      "property": {
        "title": "Maison familiale",
        "status": "À vendre",
        "rooms": 5,
        "surface": 110,
        "location": "75018 Paris",
        "imageUrl": "/assets/img/dashboard/attractivity/attractivity-1.jpg"
      },
      "flyer": "/assets/img/flyer-demo2.jpeg",
      "scanCount": 12,
      "lastScan": "2024-04-10"
    }
    // ...
  ],
  "total": 123, // total de biens pour la pagination
  "page": 1,
  "pageSize": 10
}
```

#### Sécurité
- Authentification requise (JWT ou session)
- L’API ne retourne que les biens appartenant à l’utilisateur connecté

---

### 2. Supprimer un QR Code

**DELETE** `/api/properties/:id/qr`

#### Réponse
```json
{
  "success": true
}
```

---

### 3. Télécharger un flyer QR Code

**GET** `/api/properties/:id/qr/flyer`

- Retourne le fichier PDF/image du flyer QR Code associé au bien
- Headers : `Content-Disposition: attachment; filename="flyer-qr-<id>.pdf"`

---

## Règles de gestion
- Un utilisateur ne peut voir/éditer que ses propres biens
- La recherche s’effectue sur le titre et la localisation (case-insensitive, partial match)
- La pagination est obligatoire pour éviter de charger trop de données

---

## Exemples d’appels

#### Recherche
`GET /api/properties?search=paris&page=2&pageSize=10`

#### Suppression
`DELETE /api/properties/42/qr`

#### Téléchargement
`GET /api/properties/42/qr/flyer`

---

## À prévoir côté frontend
- Gestion de l’état de chargement, erreurs, vide
- Rafraîchissement de la liste après suppression
- Affichage paginé et filtré
- Sécurité côté UI (masquer les actions si non autorisé)

---

## À prévoir côté backend
- Authentification obligatoire
- Optimisation des requêtes (index sur titre/localisation)
- Limite stricte sur le pageSize (max 100)
- Logs d’accès pour audit

---

Document rédigé le 5 mai 2026.
