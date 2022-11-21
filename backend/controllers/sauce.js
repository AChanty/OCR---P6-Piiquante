// contrôleur qui contient la logique métier pour la route sauce

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const Sauce = require('../models/sauce')
const fs = require('fs');

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

// permet de supprimer une sauce et son image de la base de données, seulement si celle-ci a été créée par le même utilisateur
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })// utlisation de l'id recue en paramètre pour accéder à la sauce correspondante dans la base de données
        .then(sauce => { // vérifie si c'est le propriétaire de la sauce qui demande la suppression
            if (sauce.userId != req.auth.userId) { // si ce n'est pas le bon utilisateur
                res.status(401).json({ message: 'Action non autorisée' })
            } else { // si c'est le bon utilisateur
                const filename = sauce.imageUrl.split('/images/')[1]; // récupère le nom du fichier image
                fs.unlink(`images/${filename}`, () => { // supprime le fichier image, mise en place du callback à exécuter une fois ce fichier supprimé
                    Sauce.deleteOne({ _id: req.params.id }) // supprime la sauce de la base de données
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
}