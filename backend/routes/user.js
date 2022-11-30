const express = require('express');
const router = express.Router();

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.createUser);
router.post('/login', userCtrl.connectUser);
// router.post('/login', limiter, userCtrl.connectUser);


module.exports = router;