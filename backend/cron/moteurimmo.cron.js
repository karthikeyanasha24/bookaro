const agenda = require('../app/config/agenda.config');
const db = require('../app/models');
const moteurSync = require('../app/modules/moteurimmo/sync');
const config = require('../app/config/moteurimmo.config');

module.exports = (agendaInstance) => {
  agendaInstance.define('moteurimmo-sync', async (job) => {
    try {
      console.log('Running moteurimmo sync job');
      await moteurSync.runOnce({ page: 1 });
    } catch (err) {
      console.error('MoteurImmo sync error', err);
    }
  });

  // schedule every config.pollIntervalMinutes minutes
  agendaInstance.every(`${config.pollIntervalMinutes} minutes`, 'moteurimmo-sync');
};
