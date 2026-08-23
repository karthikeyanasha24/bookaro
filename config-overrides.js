// config-overrides.js — réécrit la config webpack de react-scripts (react-app-rewired)
// Objectif : éviter les refresh permanents causés par Google Drive qui "touche" les
// fichiers macOS vides "Icon\r" (icônes de dossier) présents dans src/ et public/.
// On demande à webpack d'ignorer ces fichiers ainsi que .DS_Store.

const IGNORED_FILES = /(Icon\r?$)|(\.DS_Store$)/;

module.exports = function override(config, env) {
  config.watchOptions = config.watchOptions || {};
  config.watchOptions.ignored = IGNORED_FILES;

  if (config.devServer && config.devServer.watch) {
    const baseWatchIgnored = config.devServer.watch.ignored;
    const combinedWatch = [];
    if (baseWatchIgnored) {
      if (Array.isArray(baseWatchIgnored)) combinedWatch.push(...baseWatchIgnored);
      else combinedWatch.push(baseWatchIgnored);
    }
    combinedWatch.push(IGNORED_FILES);
    config.devServer.watch.ignored = combinedWatch;
  }

  return config;
};
