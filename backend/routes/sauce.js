const express = require('express');
// const auth = require('auth') // ajout d'authorize pour permettre à un utilisateur d'effectuer une action sur le parcours des sauces // à activer
const router = express.Router();

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const Sauce = require('../models/sauce')


// ignorer les '/api/sauces/', mettre juste ce qui a derrière comme dans user.js, grace ) l'utilisation des routes

// ajouter "auth" : router.get('/', auth, sauceCtrl.machintruc) pour authentifier les requêtes (token) à chaque étape


module.exports = router;