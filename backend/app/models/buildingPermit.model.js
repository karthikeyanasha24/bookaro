var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      type: { type: String, enum: ["demolitionPermit", "nonResdential", "residential", "interiorDesign"] },  //type of file
      requestType: { type: String }, //Type de DAU -- demande d’autorisation d’urbanisme (PC ou DP généralement, rarement PA) // --projecttype
      requestId: { type: String },  // NumÃ©ro d'enregistrement du permis de dÃ©molir (PD) --- / --- Numéro d’enregistrement de la DAU //--registrationNumber
      status: { type: String }, // Etat d'avancement du projet --- / --- Etat d’avancement du projet //-- progress
      authorizationDate: { type: String }, // Date rÃ©elle d'autorisation initiale, DATE_REELLE_AUTORISATION
      authorizationYear: { type: String }, // AnnÃ©e authorisation
      requestSubmissionYear: { type: String },// AnnÃ©e de dÃ©pÃ´t de la DAU --- / --- Année de dépôt de la DAU //-- AN_DEPOT

      requesterName: { type: String },// DÃ©nomination d'un demandeur avÃ©rÃ© en tant que personne morale // ----
      requesterSiren: { type: String },  // NumÃ©ro SIREN d'un demandeur avÃ©rÃ© en tant que personne morale// --- Numéro SIREN d'un demandeur avéré en tant que personne morale

      number: { type: String }, //NumÃ©ro de voie du terrain //--ADR_NUM_TER
      roadType: { type: String },// Type de voie du terrain ///--ADR_TYPEVOIE_TER
      roadName: { type: String }, // LibellÃ© de la voie du terrain //-- ADR_LIBVOIE_TER
      city: { type: String }, // LocalitÃ© du terrain //--ADR_LOCALITE_TER
      postalCode: { type: String }, // Code postal du terrain //-- ADR_CODPOST_TER
      address: { type: String }, // Address
      address1: { type: String }, // Adresse
      projectOwner: { type: String, default: 'individual' }, // Maitre d'ouvrage, DENOM_DEM, DENOM_DEM
      latitude: { type: String }, // latitude 
      longitude: { type: String }, // longitude 
      xAxis: { type: String }, // x
      yAxis: { type: String }, // y
      worksStartDate: { type: String }, // Date réelle d’ouverture de chantier  //-- DATE_REELLE_DOC
      elevationIndicator: { type: Boolean, default: false },// Indicateur de surélévation //--I_SURELEVATION
      additionalLevelCreation: { type: Boolean, default: false },// Indicateur de création de niveau(x) supplémentaire(s) //--I_NIVSUPP
      highestLevel: { type: String }, //Nombre de niveaux du bâtiment le plus élevé,  NB_NIV_MAX
      isDeleted: { type: Boolean, default: false },
      location: {  // lng+lat
        type: Object
      },

      // new iported keys 
      typeOfUse: { type: String }, // UTILISATION: 1 = Own usage, 2 = Sale, 3 = Rental, 4 = Sale - Rent, 5 = Unknown
    },
    { timestamps: true }
  );

  schema.index({ location: "2dsphere" });
  const BuildingPermits = mongoose.model("buildingPermits", schema);

  return BuildingPermits;
};
