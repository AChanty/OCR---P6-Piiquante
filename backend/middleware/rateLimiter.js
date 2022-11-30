const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
      windowMs: 24 * 60 * 60 * 1000, // fenêtre de 24 heures (en millisecondes)
      max: 100, // nombre maximal de requête par utilisateur dans la durée "windowMs"
      message: 'Vous avez excédé le nombre maximal de requêtes !', // message que recoit l'utilisateur excédant la limite de requêtes
      standardHeaders: true,
      legacyHeaders: false,
    });

app.use(limiter)