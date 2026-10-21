const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const masterRoutes = require('./master');
const evaluationRoutes = require('./evaluations');

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/master', masterRoutes);
router.use('/evaluations', evaluationRoutes);

// Health test route
router.get('/ping', (req, res) => {
  res.json({ message: 'EVAL-PEMDI API routing operational' });
});

module.exports = router;
