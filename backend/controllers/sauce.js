// contrôleur qui contient la logique métier pour la route sauce

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const Sauce = require('../models/sauce')

// renvoie un tableau de toutes les sauces de la base de données
exports.displaySauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
}

// renvoie la sauce avec l'_id fourni
exports.displaySauceId = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

// permet de poster une sauce
exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    delete sauceObject.userId; // supprime la ligne userId de la requête
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,

        // initialise les likes et dislikes de la sauce à 0, et les usersLiked et usersDisliked avec des tableaux vides
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // capture et enregistre l'image, en générant une url unique à partir du nom du fichier
    })
    console.log(sauceObject);
    console.log("url de l'image: " + req.file.filename);
    console.log(`${req.protocol}://${req.get('host')}/images/${req.file.filename}`);


    sauce.save() // enregistre la sauce et ses informations dans la base de données
        .then(() => res.status(201).json({ message: 'Sauce créée !' }))
        .catch(error => res.status(400).json({ error }));
};