var Mongoose = require("mongoose"),
  Schema = Mongoose.Schema;

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      postalCode: { type: String, required: true, unique: true }, // code_postal
      INSEE_COM: { type: Number }, // old files 
      annee: { type: Number },           // year                 // old files 
      nb_mutations: { type: Number },    // nb_mutations         // old files 
      NbMaisons: { type: Number },       // NbHouses             // old files 
      NbApparts: { type: Number },       // NbApparts            // old files 
      PropMaison: { type: Number },      // PropHouse            // old files 
      PropAppart: { type: Number },      // PropAppart           // old files 
      PrixMoyen: { type: Number },       // Average Price        // old files 
      SurfaceMoy: { type: Number },      // Area Avg
      refPrice: { type: Number, required: true },//Sqm price for App       // old files  -> // Prixm2Moyen   -> actual reference price 
      code_insee: { type: String }, //INSEE code
      municipality_name: { type: String }, //municipality_name
      unique_filter: { type: String }, //Uniqueness filter
    },
    { timestamps: true }
  );
  const campaignRefPrice = mongoose.model("campaignRefPrice", schema);

  return campaignRefPrice;
}