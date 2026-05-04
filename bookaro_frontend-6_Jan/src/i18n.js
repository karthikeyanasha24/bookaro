import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        language: "Language",
        english: "English",
        french: "French",
        save: "Save",
        loading: "Loading...",
      },
      settings: {
        manageCompanyProfile: "Manage your company profile",
        preview: "Preview",
        languagePreferences: "Language preferences",
        chooseLanguage: "Choose your application language",
        companyProfile: "Company Profile",
        searchableDirectory: "Will make you searchable in directory",
      },
      sidebar: {
        onboarding: "Onboarding",
        dashboard: "Dashboard",
        searchProperties: "Search properties",
        messages: "Messages",
        onDemandPros: "On demand real estate pros",
        findService: "Find a service",
        favoriteProfessionals: "Favorites professionals",
        myPurchases: "My purchases",
        marketInsights: "Market Insights",
        historicalTransactions: "Historical transactions",
        buildingPermits: "Building permits",
        realEstateAgency: "Real Estate Agency",
        learningCenter: "Learning center",
        writtenTraining: "Written training",
        videoTraining: "Video training",
        p2pEstimation: "P2P Estimation",
        estimateProperties: "Estimate properties",
        campaignManager: "Campaign manager",
        transactionTool: "Transaction management tool",
        searcher: "Searcher",
        owner: "Owner",
        propertySeeker: "Property seeker",
        searchAlerts: "Search alerts",
        propertiesFollowed: "Properties followed",
        propertiesInteracted: "Properties interacted",
        renterFile: "Renter application file",
        buyerFile: "Buyer file",
        propertyManager: "Property manager",
        myProperties: "My properties",
        propertyQrCode: "Property profile QR Code",
        sellerFile: "Seller file",
        companyProfile: "Company profile",
        logoCoverImage: "Logo and cover image",
        companyDetails: "Company details",
        contactDetails: "Contact details",
        aboutCompany: "About company",
        services: "Services",
        openingHours: "Opening hours",
        onDemandService: "On demand service",
      },
      pageLayout: {
        listProperty: "List a property",
        login: "Login",
        signup: "Sign Up",
        menu: "Menu",
        logout: "Logout",
        plans: "Plans",
        marketInsight: "Market Insight",
        learningCenter: "Learning Center",
        innovativeServices: "Innovative Services",
        myProject: "My project",
        account: "Account",
        historicalTransaction: "Historical Transaction",
        professionalRepository: "Professional Repository",
        homeSeeker: "Home Seeker",
        ownerSpace: "Owner space",
        interactedProperties: "Interacted Properties",
        renterApplicationFile: "Renter application file",
        manageRealEstateTransaction: "Manage real estate transaction",
        manageP2pEstimation: "Manage P2P Estimation",
        myPropertySingular: "My property",
        marketInsightsMobile: "Market Insights",
        realEstatePros: "Real Estate pros",
        directory: "Directory",
        offMarket: "Off-Market",
        transactionTool: "Transaction Tool",
        personalInformation: "Personal information",
        notifications: "Notifications",
        password: "Password",
        phoneNumber: "Phone Number",
        helpCenter: "Help Center",
        cookies: "Cookies",
        terms: "Terms",
        privacy: "Privacy",
      },
      accountTypes: {
        pro: "Pro",
        individual: "Individual",
        standard: "Standard",
      },
      dashboard: {
        "title": "Dashboard",
        "welcome": "Welcome",
        "subtitle": "Overview of your recent activity and key business indicators.",
        "dragHandle": "Reorder section",
        "common": {
        "loading": "Loading...",
        "loadError": "Unable to load this section right now.",
        "expandStatistics": "Expand statistics",
        "collapseStatistics": "Collapse statistics"
        },
        "displayMode": {
        "label": "Customize your dashboard display",
        "buyer": "Buyer",
        "seller": "Seller",
        "owner": "Owner",
        "resetOrder": "Reset order"
        },
        "period": "Period",
        "periods": {
        "day": "Day",
        "week": "Week",
        "month": "Month",
        "year": "Year"
        },
        "activityTitle": "Recent activity",
        "quickActionsTitle": "Quick actions",
        "todo": {
        "title": "To do list",
        "subtitle": "Actions to drive your real-estate project",
        "emptyMessage": "Here will be displayed actions you need to take to drive your real estate project to success",
        "markAsPending": "Mark task as pending",
        "markAsCompleted": "Mark task as completed",
        "propertyFallbackType": "Apartment",
        "propertyInCity": "in"
        },
        "sections": {
        "propertyAttractivity": "Your properties attractivity",
        "propertyAttractivitySub": "Property attractivity metrics",
        "savedSearch": "Saved searches new results",
        "savedSearchSub": "Discover new properties matching your saved searches",
        "pastTransactions": "Past transactions prices matching your last search criterion or property you own",
        "pastTransactionsSub": "Historical transactions help you define the right price either for a purchase or for a sale",
        "p2pReport": "Your properties Peer 2 Peer estimation global metrics",
        "p2pReportSub": "Leverage these insights to understand how people in your area value your property and how to increase its attractivity",
        "p2pEstimation": "P2P Estimation: help community members estimate their property",
        "followedPropertyNews": "Discover updates on the properties you follow",
        "followedPropertyNewsSub": "Following a property helps you position yourself even before it goes on sale.",
        "training": "New content in the real estate training center",
        "trainingSub": "Leverage these insights to manage your real estate project like a pro",
        "searchPipeline": "Property search pipeline overview",
        "ownerPipeline": "Seller or landlord pipeline overview"
        },
        "cta": {
        "newSearch": "New search",
        "seeProfiles": "See profiles",
        "estimateMyProperty": "Estimate my property",
        "estimateProperties": "Estimate properties",
        "browseTransactions": "Browse transactions",
        "browseTraining": "Browse training",
        "createProperty": "Create property"
        },
        "empty": {
        "noProperties": "No property available yet.",
        "noSavedSearchResults": "You will find new results from your saved searches here.",
        "noTransactions": "No historical transaction available.",
        "noP2PReport": "No P2P report available yet."
        },
        "p2pEstimation": {
        "countTitle": "{{count}} properties in your area are waiting for your peer-to-peer estimation",
        "empty": "No property to estimate for now.",
        "imageAlt": "Property to estimate"
        },
        "p2pReport": {
        "rooms": "rooms",
        "legend": "Legend",
        "peopleCount": "{{count}} people",
        "propertyPriceTitle": "Reference price analysis",
        "appropriate": "Appropriate",
        "underEstimated": "Under estimated",
        "overEstimated": "Over estimated",
        "lifetimeTitle": "Lifetime price estimation",
        "max": "Max",
        "avg": "Avg",
        "min": "Min",
        "qualitativeTitle": "Property profile qualitative assessment",
        "title": "Title",
        "image": "Image",
        "pictures": "Pictures",
        "decoration": "Decoration",
        "interior": "Interior",
        "location": "Location",
        "desirability": "Desirability"
        },
        "ownerPipeline": {
        "empty": "Start by adding your property to track your metrics.",
        "listMyProperty": "List my property",
        "transactionTypeSale": "Sale",
        "transactionTypeRent": "Rent",
        "priceSale": "Sale price",
        "priceRent": "Rent price",
        "pricePerSqm": "Price/sqm",
        "metrics": {
        "propertyProfileViews": "Property profile views",
        "interestsReceived": "Interests received",
        "profileAnalyzed": "Profiles analyzed",
        "visitsHosted": "Visits hosted",
        "visitReviews": "Visit reviews",
        "visitEvaluation": "Visit evaluation",
        "offerOrApplication": "Offers / Applications received",
        "offerReceivedSingular": "Offer received",
        "offerReceivedPlural": "Offers received",
        "applicationReceivedSingular": "Application received",
        "applicationReceivedPlural": "Applications received"
        }
        },
        "searchPipeline": {
        "empty": "No property in your search pipeline for now.",
        "metrics": {
        "propertiesFollowed": "Properties followed",
        "propertyProfileViewed": "Property profile viewed",
        "propertiesVisited": "Properties visited",
        "visitReviewsReceived": "Visit reviews received",
        "purchaseProposalsSentToOwners": "Purchase proposals sent to owners",
        "applicationSentToOwners": "Applications sent to owners",
        "propertiesInTransactionFlow": "Properties in transaction flow"
        }
        },
        "savedSearch": {
        "newResults": "{{count}} new results",
        "previewAlt": "Property preview",
        "delete": "Delete saved search",
        "deleteConfirm": "Confirm deleting this saved search?"
        },
        "followedNews": {
        "empty": "No updates available for now.",
        "like": "Like this update",
        "unlike": "Unlike this update",
        "share": "Share",
        "shareEmail": "Email",
        "shareWhatsapp": "WhatsApp",
        "copyLink": "Copy link",
        "expand": "Expand section",
        "collapse": "Collapse section",
        "showAll": "Show all",
        "showLatest": "Show latest 3",
        "today": "Today",
        "yesterday": "Yesterday",
        "badges": {
        "default": "Update",
        "price": "Price",
        "works": "Works",
        "status": "Status",
        "owner": "Owner",
        "revenue": "Revenue",
        "expense": "Expense"
        }
        },
        "training": {
        "mediaType": {
        "video": "Video",
        "written": "Written"
        }
        },
        "units": {
        "roomSingular": "room",
        "roomPlural": "rooms",
        "sqm": "sqm"
        },
        "cards": {
        "newLeads": "New leads",
        "activeProperties": "Active properties",
        "profileViews": "Profile views",
        "unreadAlerts": "Unread alerts"
        },
        "metrics": {
        "views": "Views",
        "followers": "Followers",
        "shares": "Shares",
        "messages": "Messages"
        }
      },
    },
  },
  fr: {
    translation: {
      common: {
        language: "Langue",
        english: "Anglais",
        french: "Francais",
        save: "Enregistrer",
        loading: "Chargement...",
      },
      settings: {
        manageCompanyProfile: "Gerer le profil de votre entreprise",
        preview: "Apercu",
        languagePreferences: "Preferences de langue",
        chooseLanguage: "Choisissez la langue de l'application",
        companyProfile: "Profil de l'entreprise",
        searchableDirectory: "Vous rend visible dans l'annuaire",
      },
      sidebar: {
        onboarding: "Integration",
        dashboard: "Tableau de bord",
        searchProperties: "Rechercher des proprietes",
        messages: "Messages",
        onDemandPros: "Pros immobiliers a la demande",
        findService: "Trouver un service",
        favoriteProfessionals: "Professionnels favoris",
        myPurchases: "Mes achats",
        marketInsights: "Apercus du marche",
        historicalTransactions: "Transactions historiques",
        buildingPermits: "Permis de construire",
        realEstateAgency: "Agence immobiliere",
        learningCenter: "Centre d'apprentissage",
        writtenTraining: "Formation ecrite",
        videoTraining: "Formation video",
        p2pEstimation: "Estimation P2P",
        estimateProperties: "Estimer des proprietes",
        campaignManager: "Gestionnaire de campagne",
        transactionTool: "Outil de gestion des transactions",
        searcher: "Chercheur",
        owner: "Proprietaire",
        propertySeeker: "Chercheur de biens",
        searchAlerts: "Alertes de recherche",
        propertiesFollowed: "Biens suivis",
        propertiesInteracted: "Biens interagis",
        renterFile: "Dossier locataire",
        buyerFile: "Dossier acheteur",
        propertyManager: "Gestionnaire de biens",
        myProperties: "Mes proprietes",
        propertyQrCode: "QR du profil du bien",
        sellerFile: "Dossier vendeur",
        companyProfile: "Profil de l'entreprise",
        logoCoverImage: "Logo et image de couverture",
        companyDetails: "Details de l'entreprise",
        contactDetails: "Coordonnees",
        aboutCompany: "A propos de l'entreprise",
        services: "Services",
        openingHours: "Heures d'ouverture",
        onDemandService: "Service a la demande",
      },
      pageLayout: {
        listProperty: "Lister un bien",
        login: "Connexion",
        signup: "Inscription",
        menu: "Menu",
        logout: "Deconnexion",
        plans: "Forfaits",
        marketInsight: "Apercu du marche",
        learningCenter: "Centre d'apprentissage",
        innovativeServices: "Services innovants",
        myProject: "Mon projet",
        account: "Compte",
        historicalTransaction: "Transaction historique",
        professionalRepository: "Repertoire des professionnels",
        homeSeeker: "Espace chercheur",
        ownerSpace: "Espace proprietaire",
        interactedProperties: "Biens interagis",
        renterApplicationFile: "Dossier de candidature locataire",
        manageRealEstateTransaction: "Gerer la transaction immobiliere",
        manageP2pEstimation: "Gerer l'estimation P2P",
        myPropertySingular: "Mon bien",
        marketInsightsMobile: "Apercus du marche",
        realEstatePros: "Pros immobiliers",
        directory: "Annuaire",
        offMarket: "Hors marche",
        transactionTool: "Outil transaction",
        personalInformation: "Informations personnelles",
        notifications: "Notifications",
        password: "Mot de passe",
        phoneNumber: "Numero de telephone",
        helpCenter: "Centre d'aide",
        cookies: "Cookies",
        terms: "Conditions",
        privacy: "Confidentialite",
      },
      accountTypes: {
        pro: "Pro",
        individual: "Particulier",
        standard: "Standard",
      },
      dashboard: {
        "title": "Tableau de bord",
        "welcome": "Bienvenue",
        "subtitle": "Pilotez toutes les dimensions de votre projet immobilier depuis ce tableau de bord",
        "dragHandle": "Réorganiser la section",
        "common": {
        "loading": "Chargement...",
        "loadError": "Impossible de charger cette section pour le moment.",
        "expandStatistics": "Développer les statistiques",
        "collapseStatistics": "Réduire les statistiques"
        },
        "displayMode": {
        "label": "Personnalisez l'affichage de votre tableau de bord",
        "buyer": "Acheteur",
        "seller": "Vendeur",
        "owner": "Propriétaire",
        "resetOrder": "Réinitialiser ordre"
        },
        "period": "Période",
        "periods": {
        "day": "Jour",
        "week": "Semaine",
        "month": "Mois",
        "year": "Année"
        },
        "activityTitle": "Activité récente",
        "quickActionsTitle": "Actions rapides",
        "sections": {
        "propertyAttractivity": "Suivez l'attractivité de votre bien",
        "propertyAttractivitySub": "Enrichissez le profil de votre bien pour accroître son attractivité et sa valeur marchande",
        "savedSearch": "Consultez les nouveaux biens de vos recherches sauvegardées",
        "savedSearchSub": "Découvrez les nouveaux biens correspondant à vos recherches sauvegardées",
        "pastTransactions": "Faites-vous une idée des prix du marché en consultant les transactions récentes",
        "pastTransactionsSub": "Les transactions passées vous aident à définir le bon prix, à l'achat comme à la vente",
        "p2pReport": "Découvrez la valorisation de votre bien par les membres de la communauté",
        "p2pReportSub": "Exploitez ces informations pour comprendre comment les personnes de votre zone valorisent votre bien et comment augmenter son attractivité",
        "p2pEstimation": "P2P Estimation : aidez les membres de la communauté à estimer leur bien",
        "followedPropertyNews": "Découvrez l'actualité des biens que vous suivez",
        "followedPropertyNewsSub": "Suivre un bien immobilier vous permet de vous positionner avant même qu'il ne soit en vente.",
        "training": "Formez-vous à l'immobilier : les derniers contenus",
        "trainingSub": "Appuyez-vous sur ces contenus pour piloter votre projet immobilier comme un pro",
        "searchPipeline": "Vue d'ensemble de votre recherche d'un bien immobilier",
        "ownerPipeline": "Vue d'ensemble de la vente ou location de votre bien"
        },
        "cta": {
        "newSearch": "Nouvelle recherche",
        "seeProfiles": "Voir profils",
        "estimateMyProperty": "Estimer mon bien",
        "estimateProperties": "Estimer des biens",
        "browseTransactions": "Parcourir les transactions",
        "browseTraining": "Parcourir les formations",
        "createProperty": "Créer un bien"
        },
        "empty": {
        "noProperties": "Aucun bien disponible pour le moment.",
        "noSavedSearchResults": "Vous retrouverez ici les nouveaux résultats de vos recherches sauvegardées.",
        "noTransactions": "Aucune transaction historique disponible.",
        "noP2PReport": "Aucun rapport P2P disponible pour le moment."
        },
        "p2pEstimation": {
        "countTitle": "{{count}} biens de votre zone attendent votre estimation pair-a-pair",
        "empty": "Aucun bien à estimer pour le moment.",
        "imageAlt": "Bien à estimer"
        },
        "p2pReport": {
        "rooms": "pièces",
        "legend": "Légende",
        "peopleCount": "{{count}} personnes",
        "propertyPriceTitle": "Analyse du prix de référence",
        "appropriate": "Approprié",
        "underEstimated": "Sous-estimé",
        "overEstimated": "Sur-estimé",
        "lifetimeTitle": "Estimation du prix dans le temps",
        "max": "Max",
        "avg": "Moy",
        "min": "Min",
        "qualitativeTitle": "Évaluation qualitative",
        "title": "Titre",
        "image": "Image",
        "pictures": "Photos",
        "decoration": "Décoration",
        "interior": "Intérieur",
        "location": "Localisation",
        "desirability": "Désirabilité"
        },
        "ownerPipeline": {
        "empty": "Commencez par ajouter votre bien pour suivre vos indicateurs.",
        "listMyProperty": "Lister mon bien",
        "transactionTypeSale": "Vente",
        "transactionTypeRent": "Location",
        "priceSale": "Prix de vente",
        "priceRent": "Prix de location",
        "pricePerSqm": "Prix/m2",
        "metrics": {
        "propertyProfileViews": "Vues du profil du bien",
        "interestsReceived": "Intérêts reçus",
        "profileAnalyzed": "Profils analysés",
        "visitsHosted": "Visites réalisées",
        "visitReviews": "Avis de visite",
        "visitEvaluation": "Évaluation de visite",
        "offerOrApplication": "Offres / Dossiers reçus",
        "offerReceivedSingular": "Offre reçue",
        "offerReceivedPlural": "Offres reçues",
        "applicationReceivedSingular": "Dossier reçu",
        "applicationReceivedPlural": "Dossiers reçus"
        }
        },
        "searchPipeline": {
        "empty": "Aucun bien en cours de recherche pour le moment.",
        "metrics": {
        "propertiesFollowed": "Biens suivis",
        "propertyProfileViewed": "Vues du profil du bien",
        "propertiesVisited": "Biens visités",
        "visitReviewsReceived": "Avis de visite reçus",
        "purchaseProposalsSentToOwners": "Offres d'achat envoyées aux propriétaires",
        "applicationSentToOwners": "Dossiers envoyés aux propriétaires",
        "propertiesInTransactionFlow": "Biens en cours de transaction"
        }
        },
        "savedSearch": {
        "newResults": "{{count}} nouveaux résultats",
        "previewAlt": "Aperçu du bien",
        "delete": "Supprimer la recherche sauvegardée",
        "deleteConfirm": "Confirmer la suppression de cette recherche sauvegardée ?"
        },
        "followedNews": {
        "empty": "Aucune actualité disponible pour le moment.",
        "like": "Liker la news",
        "unlike": "Retirer le like",
        "share": "Partager",
        "shareEmail": "Email",
        "shareWhatsapp": "WhatsApp",
        "copyLink": "Copier le lien",
        "expand": "Déplier la section",
        "collapse": "Plier la section",
        "showAll": "Voir tout",
        "showLatest": "Réduire",
        "today": "Aujourd'hui",
        "yesterday": "Hier",
        "badges": {
        "default": "Mise à jour",
        "price": "Prix",
        "works": "Travaux",
        "status": "Statut",
        "owner": "Propriétaire",
        "revenue": "Revenus",
        "expense": "Dépenses"
        }
        },
        "training": {
        "mediaType": {
        "video": "Vidéo",
        "written": "Écrit"
        }
        },
        "units": {
        "roomSingular": "pièce",
        "roomPlural": "pièces",
        "sqm": "m2"
        },
        "todo": {
        "title": "Votre ToDo Liste",
        "subtitle": "Actions pour faire avancer votre projet immobilier",
        "emptyMessage": "Voici les actions à effectuer pour faire avancer votre projet immobilier avec succès",
        "markAsPending": "Marquer la tâche comme en attente",
        "markAsCompleted": "Marquer la tâche comme terminée",
        "propertyFallbackType": "Appartement",
        "propertyInCity": "à"
        },
        "cards": {
        "newLeads": "Nouveaux leads",
        "activeProperties": "Biens actifs",
        "profileViews": "Vues du profil",
        "unreadAlerts": "Alertes non lues"
        },
        "metrics": {
        "views": "Vues",
        "followers": "Abonnés",
        "shares": "Partages",
        "messages": "Messages"
        }
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "bookaroo_language",
      caches: ["localStorage"],
    },
  });

export default i18n;
