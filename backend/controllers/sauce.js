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
// Capture et enregistre l'image, analyse la sauce transformée en chaîne de caractères et l'enregistre dans la base de données en définissant correctement son imageUrl.
// Initialise les likes et dislikes de la sauce à 0 et les usersLiked et usersDisliked avec des tableaux vides. Remarquez que le corps de la demande initiale est vide ; lorsque multer est ajouté,
// il renvoie une chaîne pour le corps de la demande en fonction des données soumises avec le fichier
exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,

        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    })
    console.log(sauceObject);
    console.log("url de l'image: " + req.file.filename);
    console.log(`${req.protocol}://${req.get('host')}/images/${req.file.filename}`);


    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créée !' }))
        .catch(error => res.status(400).json({ error }));
};