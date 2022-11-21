// contrôleur qui contient la logique métier pour la route utilisateur

// appelle le package bcrypt qui permet de crypter les données sensibles
const bcrypt = require('bcrypt')

// appelle le package permettant de créer des tokens
const jwt = require('jsonwebtoken');

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const User = require('../models/user')

// création d'un nouvel utilisateur
exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // hache la donnée password pour la crypter, execute l'algorithme de hachage 10 fois pour créer un certain niveau de sécurité
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save() // enregistre l'utilisateur dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }))

    console.log(req.body);
    // const user = new User({
    //     ...req.body
    // });
    // user.save()
    //     .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' }))
    //     .catch(error => res.status(400).json({ error }));
};

// exports.connectUser = (req, res, next) => {
//     console.log(req.body);
//     // User.findOne({ _id: req.params.id })
//     User.findOne({ _id: req.params.id }) // retourne un seul User basé sur la valeur qu'on lui passe, pour récupérer un User par son id unique
//     .then(() => res.status(201).json({ message: 'Connexion réussie !'}))
//     // .then(user => res.status(200).json(user))
//     .catch(error => res.status(404).json({ error }));
// }

exports.connectUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) { // retourne une erreur si l'utilisateur n'est pas trouvé dans la base de données
                return res.status(401).json({ message: 'Identifiants incorrects'});
            }
            bcrypt.compare(req.body.password, user.password) // si l'utilisateur est trouvé, compare son mod de passe dans la base de données avec celui entré dans le formulaire de connexion
                .then(valid => {
                    if (!valid) { // retourne une erreur si le mot de passe n'est pas le bon
                        return res.status(401).json({ message: 'Identifiants incorrects' });
                    }
                    res.status(200).json({ // si le mot de passe est bon, renvoie l'Id de l'utilisateur et un token encodé
                        userId: user._id,
                        token: jwt.sign( // chiffre le nouveau token
                            { userId: user._id  }, // données à encoder dans le token
                            'RANDOM_TOKEN_SECRET', // clé secrète pour l'encodage
                            { expiresIn: '24h' } // expiration du token au bout de 24h
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };