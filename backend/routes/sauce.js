const express = require('express');
// const auth = require('auth')
const router = express.Router();
const auth = require('../middleware/auth') // ajout d'authorize pour permettre à un utilisateur d'effectuer une action sur le parcours des sauces
const multer = require('../middleware/multer-config')

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const sauceCtrl = require('../controllers/sauce')


router.get('/', auth, sauceCtrl.displaySauces); // renvoie un tableau de toutes les sauces de la base de données
router.get('/:id', auth, sauceCtrl.displaySauceId); // renvoie la sauce avec l'_id fourni
router.post('/', auth, multer, sauceCtrl.createSauce); // poste la sauce dans la base de données
router.delete('/:id', auth, sauceCtrl.deleteSauce); // supprime la sauce avec l'_id fourni
router.put('/:id', auth, sauceCtrl.modifySauce); // modifie la sauce avec l'_id fourni


module.exports = router;