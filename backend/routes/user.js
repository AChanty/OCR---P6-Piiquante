const express = require('express');
const router = express.Router();

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
// const User = require('../models/user') // fonctionne pour créer un utilisateur en réactivant (1)
const userCtrl = require('../controllers/user')


router.post('/signup', userCtrl.createUser);
router.post('/login', userCtrl.connectUser);


module.exports = router;