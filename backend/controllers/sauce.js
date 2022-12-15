// contrôleur qui contient la logique métier pour la route sauce

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const Sauce = require('../models/sauce')

const fs = require('fs');
const Joi = require('joi');

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
    const sauceSchema = Joi.object({ // règles mises en place via Joi demandant que chaque champs soit requis et ne soit pas vide
        name: Joi.string()
            .alphanum()
            .min(1)
            .required(),
        manufacturer: Joi.string()
            .alphanum()
            .min(1)
            .required(),
        description: Joi.string()
            .alphanum()
            .min(1)
            .required(),
        mainPepper: Joi.string()
            .alphanum()
            .min(1)
            .required(),
        heat: Joi.number()
            .required(),
    })

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

    if (!sauceSchema.validate(sauceObject).error) { // si aucune erreur n'est retournée par Joi après les contrôles des champs
        sauce.save() // enregistre la sauce et ses informations dans la base de données
            .then(() => res.status(201).json({ message: 'Sauce créée !' }))
            .catch(error => res.status(400).json({ error }));

    } else {
        return res.status(400).json({ message: 'Format non valide' });
    }
};

// permet la modification d'une sauce et son image de la base de données, seulement si celle-ci a été créée par le même utilisateur
exports.modifySauce = (req, res, next) => {
    const sauceSchema = Joi.object({ // règles mises en place via Joi demandant que chaque champs soit requis et ne soit pas vide
        name: Joi.string()
            .alphanum()
            .min(1)
            .required(),
        manufacturer: Joi.string()
            .alphanum()
            .min(1)
            .required(),
        description: Joi.string()
            .alphanum()
            .min(1)
            .required(),
        mainPepper: Joi.string()
            .alphanum()
            .min(1)
            .required(),
        heat: Joi.number()
            .required(),
        userId: Joi.string()
            .alphanum()
            .required(),
    })

    Sauce.findOne({ _id: req.params.id })// utlisation de l'id recue en paramètre pour accéder à la sauce correspondante dans la base de données
        .then(sauce => {
            if (sauce.userId != req.auth.userId) { // refus de la requête si ce n'est pas le bon utilisateur
                res.status(401).json({ message: 'Action non autorisée' })
            } else {
                if (!sauceSchema.validate(req.body).error) { // si aucune erreur n'est retournée par Joi après les contrôles des champs
                    // met à jour la sauce si c'est le bon utilisateur
                    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce modifiée !' }) })
                        .catch(error => res.status(401).json({ error }));
                } else {
                    return res.status(400).json({ message: 'Format non valide' });
                }
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// permet la suppression d'une sauce et son image de la base de données, seulement si celle-ci a été créée par le même utilisateur
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

// permet l'ajout/retrait de "likes" et de "dislikes" aux différentes sauces, en ne permettant qu'une action de ce type par utilisateur pour chaque sauce, en gardant en mémoire les likes/dislikes d'un utilisateur via [usersLiked] et [usersDisliked]
exports.likeSauce = (req, res, next) => {
    let like = req.body.like
    if (like === 1) { // si l'utilisateur "like" la sauce
        Sauce.updateOne({ _id: req.params.id },
            {
                $push: { usersLiked: req.body.userId },  // push l'id de l'utilisateur ayant "liké" la sauce dans le tableau des utilisateurs [usersLiked]
                $inc: { likes: like++ } // puis incrémente +1 "like" à la sauce
            })
            .then(() => res.status(200).json({ message: 'Sauce likée !' }))
            .catch(error => res.status(400).json({ error }));
    } else if (like === -1) { // si l'utilisateur retire son "like" de la sauce
        Sauce.updateOne({ _id: req.params.id },
            {
                $push: { usersDisliked: req.body.userId }, // push l'id de l'utilisateur ayant "disliké" la sauce dans le tableau des utilisateurs [usersDisliked]
                $inc: { dislikes: like++ * -1 } // puis incrémente +1 "dislike" à la sauce
            })
            .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
            .catch(error => res.status(400).json({ error }));
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) { // si l'utilisateur retire son "like" de la sauce
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $pull: { usersLiked: req.body.userId }, // retire l'id de l'utilisateur ayant retiré son "like" du tableau des utilisateurs [usersLiked]
                            $inc: { likes: -1 } // puis incrémente -1 "like" à la sauce
                        })
                        .then(() => { res.status(200).json({ message: 'Like retiré !' }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) { // si l'utilisateur retire son "dislike" de la sauce
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId }, // retire l'id de l'utilisateur ayant retiré son "like" du tableau des utilisateurs [usersDisliked]
                            $inc: { dislikes: -1 } // puis incrémente -1 "dislike" à la sauce
                        })
                        .then(() => { res.status(200).json({ message: 'Dislike retiré !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};