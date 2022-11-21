const jwt = require('jsonwebtoken');
 
// middleware qui permet d'extraire le token
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // récupète le token via le header, en divisant la chaîne de caractère en tableau à partir de l'espace entre le mot clé "Bearer" et le token
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // décode le token avec la clé secrète
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};