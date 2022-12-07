const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const userCtrl = require('../controllers/user');

router.post('/signup', body('email').isEmail(), body('password').isStrongPassword(), userCtrl.createUser); // vérification des champs email et password avec Express Validator
router.post('/login', userCtrl.connectUser);


module.exports = router;