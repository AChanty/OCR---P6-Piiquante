const express = require('express');
// const auth = require('auth') // ajout d'authorize pour permettre à un utilisateur d'effectuer une action sur le parcours des sauces // à activer
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
// const Sauce = require('../models/sauce')
const sauceCtrl = require('../controllers/sauce')


router.get('/', auth, sauceCtrl.displaySauces); // renvoie un tableau de toutes les sauces de la base de données
router.get('/:id', auth, sauceCtrl.displaySauceId); // renvoie la sauce avec l'_id fourni
router.post('/', auth, multer, sauceCtrl.createSauce); // poste la sauce dans la base de données


module.exports = router;