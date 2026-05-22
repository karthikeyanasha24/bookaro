# Spécification backend — statuts pros favoris / top agent

## Objectif
Ajouter un support backend pour les statuts marketing des professionnels sur la page `/marketplace`.

## Nouvelles propriétés utilisateur
Ces propriétés doivent être ajoutées au modèle `users` et traitées côté backend.

- `isGlobalFavorite` : booléen
  - Affiché dans l'encart favoris dès le chargement de la page `/marketplace`
  - Visible par 100% des visiteurs du site
  - Limitée à 2 professionnels simultanément

- `isLocalFavorite` : booléen
  - Affiché dans l'encart favoris pour les recherches concernant une zone où l'agent est actif
  - Limitée à 2 professionnels simultanément

- `localFavoritePostalCodes` : tableau de chaînes
  - Liste de codes postaux pour lesquels l'agent est favori local
  - Activée uniquement lorsque `isLocalFavorite` est vrai

- `isTopAgent` : booléen
  - Affiché en badge `Top agent` sur la carte de ses services
  - Affiché également sur le profil du pro

## Comportement attendu

### 1. Favoris globaux
- Un admin peut cocher `Favoris global` pour un pro.
- Si un 3ᵉ pro reçoit cette valeur, le backend doit bloquer l'opération.
- Le message d'erreur doit indiquer que la limite est atteinte et lister les deux favoris globaux existants.

### 2. Favoris locaux
- Un admin peut cocher `Favoris local` pour un pro.
- Un champ `code postal` doit être renseigné avec un ou plusieurs codes postaux.
- Si un 3ᵉ pro reçoit ce statut, le backend doit bloquer l'opération.
- Le message d'erreur doit indiquer que la limite est atteinte et lister les deux favoris locaux existants.

### 3. Top agent
- Un admin peut cocher `Top agent` pour un pro.
- Ce badge est appliqué sur la carte de ses services et sur son profil.

## Validations backend
- Validation d'unicité de la limite à 2 pour `isGlobalFavorite`.
- Validation d'unicité de la limite à 2 pour `isLocalFavorite`.
- Validation du format `localFavoritePostalCodes` lorsque `isLocalFavorite` est vrai.
- Le statut ne doit s'appliquer qu'aux utilisateurs `accountType: "pro"`.

## Exposition API
- Ajouter ou mettre à jour dans l'API admin utilisateur les champs suivants :
  - `isGlobalFavorite`
  - `isLocalFavorite`
  - `localFavoritePostalCodes`
  - `isTopAgent`
  - `featuredSubheading`
  - `featuredTitle`
  - `featuredBio`
  - `featuredExperienceYears`
  - `featuredClientsAccompanied`
  - `featuredRatingNotes`
  - `featuredSatisfactionRate`
  - `featuredProfilePhoto`

- Le routeur admin existant `/user/admin/update-profile` peut être réutilisé pour transmettre ces champs.
- Ajouter une route publique : `GET /marketplace/favorite-pros` qui retourne les pros favoris complets pour l'encart Agents favoris.
- Les `top agents` ne doivent pas être considérés comme des pros favoris pour cet encart; ils ont simplement un badge supplémentaire sur leurs services et sur leur profil.

## Points à implémenter plus tard
- Interface admin : checkbox `Favoris global`, `Favoris local`, `Top agent` et saisie des codes postaux.
- Création d'une nouvelle page dans les paramètres du pro pour remplir ces champs dès qu'il est désigné agent favori.
- Tant que le pro n'a pas complété ces informations, il ne doit pas ressortir dans l'écran `marketplace`.
- La route publique `/marketplace/services` ne doit PAS exclure les services des pros favoris ; seuls les encarts des pros favoris doivent être contrôlés par la complétude du profil favori.
- Affichage du statut sur le profil pro.
- Filtrage de l'encart favoris global/local dans l'API des services ou de la page marketplace.
- Tests unitaires backend pour la validation de limite à 2 éléments.
- Interface admin dédiée aux demandes de service : liste des demandes, affichage du contenu, date de création, statut et actions de changement de statut.
- Interface admin des services marketplace : listing complet des services, recherche par service / prestataire / statut, filtres de statut, tri, pagination et export CSV.
- Interface admin des commandes marketplace : listing complet des commandes, recherche par commande / acheteur / prestataire / service, filtres de statut, tri, pagination, export CSV et affichage de toutes les informations de commande (buyer, serviceSnapshot, proSnapshot, montant, statut paiement, livraison, litige, annulation).
- Interface admin des annulations marketplace : listing complet des demandes d'annulation, recherche par commande / acheteur / prestataire / service, filtres par statut et par initiateur (client/pro), tri, pagination, export CSV, motif de la demande, statut de la réponse, message de réponse et historique de la demande.

## Notes
- Ce fichier documente le besoin côté backend.
- Il peut être utilisé comme base pour la future implémentation de la page admin et de l'affichage profil.
