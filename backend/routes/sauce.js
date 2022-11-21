const express = require('express');

const router = express.Router();

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const Sauce = require('../models/sauce')


// ignorer les '/api/sauces/', mettre juste ce qui a derrière comme dans user.js, grace ) l'utilisation des routes


module.exports = router;