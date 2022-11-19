const express = require('express');

const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://DrJez:admin@cluster0.9i6zon3.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// importe les différents modèles Mongoose dans l'application pour pouvoir les utiliser
const User = require('./models/user')
const Sauce = require('./models/sauce')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// création d'un compte via route POST
app.post('/api/auth/signup', (req, res, next) => {
    console.log(req.body);
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

// connexion à un compte via route POST
app.post('/api/auth/login', (req, res, next) => {
    console.log(req.body);
    // User.findOne({ _id: req.params.id })
    User.findOne({ _id: req.params.id }) // retourne un seul User basé sur la valeur qu'on lui passe, pour récupérer un User par son id unique
    .then(() => res.status(201).json({ message: 'Connexion réussie !'}))
    // .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
});

// app.get('/api/sauces ', (req, res, next) => {
//     Sauce.findOne({ _id: req.params.id })
//       .then(sauce => res.status(200).json(sauce))
//       .catch(error => res.status(404).json({ error }));
//   });

// app.get('/api/stuff', (req, res, next) => {
//     const stuff = [
//       {
//         _id: 'oeihfzeoi',
//         title: 'Mon premier objet',
//         description: 'Les infos de mon premier objet',
//         imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//         price: 4900,
//         userId: 'qsomihvqios',
//       },
//       {
//         _id: 'oeihfzeomoihi',
//         title: 'Mon deuxième objet',
//         description: 'Les infos de mon deuxième objet',
//         imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//         price: 2900,
//         userId: 'qsomihvqios',
//       },
//     ];
//     res.status(200).json(stuff);
//   });

module.exports = app;