// contrôleur qui contient la logique métier pour la route utilisateur

// appelle le package bcrypt qui permet de crypter les données sensibles
const bcrypt = require('bcrypt')

// appelle le package permettant de créer des tokens
const jwt = require('jsonwebtoken');

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const User = require('../models/user')

require('dotenv').config()

// création d'un nouvel utilisateur
// exports.createUser = (req, res, next) => {
//     // regex
//     bcrypt.hash(req.body.password, 10) // hache la donnée password pour la crypter, execute l'algorithme de hachage 10 fois pour créer un certain niveau de sécurité
//     .then(hash => {
//         const user = new User({
//             email: req.body.email,
//             password: hash
//         });
//         user.save() // enregistre l'utilisateur dans la base de données
//         .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' }))
//         .catch(error => res.status(400).json({ error }));
//     })
//     .catch(error => res.status(500).json({ error }))

//     console.log(req.body);
// };

// création d'un nouvel utilisateur
exports.createUser = (req, res, next) => {
    let regexPassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/gm) // le mot de passe doit contenir au moins 5 caractères dont au moins un chiffre
    let regexEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}') // l'adresse email doit être dans un format email régulier
    if (!regexPassword.test(req.body.password)) { // ne permet pas la création de l'utilisateur si le mot de passe n'est pas conforme au regex
        console.log('mot de passe non valide')
        return res.status(401).json({ message: 'Format de mot de passe non valide'});
    } else if (!regexEmail.test(req.body.email)) { // ne permet pas la création de l'utilisateur si l'email n'est pas conforme au regex
        console.log('email non valide')
        return res.status(401).json({ message: 'Format de mail non valide'});
    } else { // permet la création de l'utilisateur si les différents regex sont conformes
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
    }
};

// const express = require('express');
// const app = express();
// const { body, validationResult } = require('express-validator');
// exports.createUser = (req, res, next) => {
//     // regex
//     // if (body('username').isEmail() && body('password').isLength({ min: 5 })) {
//     body('username').isEmail(),
//         // password must be at least 5 chars long
//         body('password').isLength({ min: 5 }),
//         (req, res) => {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({ errors: errors.array() });
//             } else {
//             bcrypt.hash(req.body.password, 10) // hache la donnée password pour la crypter, execute l'algorithme de hachage 10 fois pour créer un certain niveau de sécurité
//                 .then(hash => {
//                     const user = new User({
//                         email: req.body.email,
//                         password: hash
//                     });
//                     user.save() // enregistre l'utilisateur dans la base de données
//                         .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' }))
//                         .catch(error => res.status(400).json({ error }));
//                 })
//             }
//     // } else {
//     //     return res.status(401).json({ message: 'Entrées non valides'});
//     // }
//     // .catch(error => res.status(500).json({ error }))
//     console.log(req.body);
// };
// }

// connexion de l'utilisateur
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
                            // 'RANDOM_TOKEN_SECRET', // clé secrète pour l'encodage
                            process.env.TOKEN, // clé secrète pour l'encodage
                            { expiresIn: '24h' } // expiration du token au bout de 24h
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };