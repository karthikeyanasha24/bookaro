const onboarding = require('../controllers/OnboardingController');
const router = require('express').Router();

router.get('/state', onboarding.getState);
router.put('/profile', onboarding.updateProfile);
router.put('/objective', onboarding.updateObjective);
router.post('/event', onboarding.sendEvent);

module.exports = router;
