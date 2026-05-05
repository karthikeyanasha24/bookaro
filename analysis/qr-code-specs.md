# QR Code Management – Documentation & Specs

## 1.1. Précision sur la page QR Code
La page de gestion des QR Codes est une page globale : elle n’est pas liée à un propertyId unique. L’utilisateur y retrouve la liste de tous ses biens créés, et peut générer/télécharger/suivre un QR Code pour chaque bien depuis cette page centrale.

## 1. Objectif
Permettre la génération, le téléchargement et le suivi des QR Codes pour chaque bien immobilier, côté propriétaire/admin, avec intégration front/back sécurisée.

---

## 2. Stratégie Générale
- **Frontend** : UI/UX pour générer, afficher et télécharger le QR Code PDF, suivi du compteur, gestion multilingue, droits d’accès.
- **Backend** : Endpoints REST pour générer, servir et tracker les QR Codes, génération PDF, stockage, sécurité.
- **Contrat API** : Définition claire des routes, payloads, réponses, statuts d’erreur, pour garantir l’intégration front/back.

---

## 3. API Contract (à valider côté backend)

### 3.1. Lister tous les biens et leur QR Code
- **GET** `/api/properties/with-qrcode`
- Auth: propriétaire/admin
- Réponse: `[{ propertyId, title, address, photoUrl, qrCodeUrl?, pdfUrl?, downloadCount?, lastDownloadedAt? }]`

### 3.2. Générer ou régénérer un QR Code pour un bien
- **POST** `/api/properties/:id/qrcode`
- Auth: propriétaire/admin
- Body: `{ photoUrl?: string }`
- Réponse: `{ qrCodeUrl, pdfUrl, downloadCount, lastDownloadedAt }`

### 3.3. Télécharger le PDF (et incrémenter le compteur)
- **GET** `/api/properties/:id/qrcode/download`
- Auth: propriétaire/admin
- Réponse: PDF (Content-Disposition: attachment)

### 3.4. (Admin) Suivi global
- **GET** `/api/qrcodes?filter=...`
- Auth: admin
- Réponse: `[ { propertyId, qrCodeUrl, pdfUrl, downloadCount, lastDownloadedAt } ]`

---

## 4. To Do Frontend
- [x] Page centrale QR Code listant tous les biens (pas liée à un propertyId unique)
- [x] Bloc explicatif (explainer) masquable et persistant (localStorage)
- [x] Section "How it works" avec étapes, images, et logos plateformes (Leboncoin, SeLoger, PAP, LinkedIn, Facebook, Instagram)
- [x] Recherche locale sur les biens (champ de recherche au-dessus du tableau)
- [x] Pagination locale toujours visible sous le tableau
- [x] Affichage du flyer QR Code en miniature, avec agrandissement modal au clic
- [x] Affichage compteur de scans/téléchargements
- [x] Affichage date du dernier scan
- [x] Bouton Télécharger PDF (action à brancher sur l'API)
- [x] Bouton Supprimer QR Code (action à brancher sur l'API)
- [x] UI/UX conforme dashboard (marges, styles, responsive)
- [x] Intégration multilingue (i18n)
- [ ] Génération de flyer QR Code (modal/drawer avec choix photo, métriques, preview, validation)
- [ ] Sélection de la photo du bien lors de la génération
- [ ] Sélection des métriques à afficher sur le flyer
- [ ] Aperçu dynamique du flyer avant génération
- [ ] Téléchargement réel (PDF, PNG, JPG) via API
- [ ] Suppression réelle d’un flyer via API
- [ ] Gestion loading/erreur/success sur toutes les actions
- [ ] Gestion droits (propriétaire/admin)
- [ ] (Admin) Tableau de suivi QR Codes (vue globale)
- [ ] Gestion du refresh local après suppression/génération

---

## 5. To Do Backend (pour référence)
- [ ] Modèle QRCode
- [ ] Génération QR code (qrcode)
- [ ] Génération PDF (pdfkit)
- [ ] Stockage fichiers
- [ ] Endpoints REST
- [ ] Sécurité/auth
- [ ] Tracking téléchargements
- [ ] Nettoyage fichiers obsolètes

---

## 6. Notes
- Les fonctionnalités suivantes ont été ajoutées par rapport à la spec initiale :
	- Bloc explainer masquable et persistant
	- Modal d’agrandissement du flyer QR Code
	- Recherche locale et pagination toujours visible
	- Affichage des logos plateformes dans l’explainer
	- UI/UX dashboard unifiée (marges, styles, responsive)
	- Gestion fine des images (Chill, flyer, logos)
	- Intégration multilingue complète (i18n)

À chaque évolution, mettre à jour ce fichier pour garder la trace des ajouts UI/UX et des écarts avec la spec initiale.
- Tous les endpoints nécessitent authentification.
- Les URLs retournées sont relatives ou absolues selon le stockage.
- Le PDF inclut le QR code, la photo, et les infos du bien.
- Le compteur de téléchargements est incrémenté côté backend.
- L’UI doit être multilingue et accessible.

---

## 7. Historique
- 18/04/2026 : Spécifications validées, plan d’implémentation rédigé, priorisation frontend/API contract.

---

> Ce fichier sert de référence pour toute l’équipe. À mettre à jour à chaque évolution majeure.
