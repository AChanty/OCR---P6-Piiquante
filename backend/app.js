const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config() // importe les données contenues dans le fichier .env


const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // fenêtre de 24 heures (en millisecondes)
    max: 100, // nombre maximal de requête par utilisateur dans la durée "windowMs"
    message: 'Vous avez excédé le nombre maximal de requêtes !', // message que recoit l'utilisateur excédant la limite de requêtes
    standardHeaders: true,
    legacyHeaders: false,
});

const app = express();

// importe les différents routeurs
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

mongoose.connect(process.env.MONGODB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

app.use('/api/auth/', userRoutes)
app.use('/api/sauces/', sauceRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(limiter);

module.exports = app;