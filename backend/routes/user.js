const express = require('express');
const router = express.Router();

// const rateLimit = require("express-rate-limit");
// const limiter = require('../middleware/rateLimiter')

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const userCtrl = require('../controllers/user');
// const { limiter } = require('../middleware/rateLimiter');
// import { limiter } from '../middleware/rateLimiter';


router.post('/signup', userCtrl.createUser);
router.post('/login', userCtrl.connectUser);
// router.post('/login', limiter, userCtrl.connectUser);

// app.use(limiter)

module.exports = router;