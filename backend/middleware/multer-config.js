const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// configuration de multer
const storage = multer.diskStorage({ // configure le chemin et le nom de fichier pour les fichiers entrants
  destination: (req, file, callback) => { // destination  d'enregistrement des fichiers
    callback(null, 'images'); // nom du dossier en 2e argument
  },
  filename: (req, file, callback) => { // explique à multer quel nom de fichier utiliser
    const name = file.originalname.split(' ').join('_'); // utilise le nom d'origine du fichier, y élimine les espaces en les remplacant par des underscore
    const extension = MIME_TYPES[file.mimetype]; // génère l'extension du fichier
    callback(null, name + Date.now() + '.' + extension); // création d'un nom unique pour le fichier (nom + date + '.' + extension du fichier)
  }
});

module.exports = multer({storage: storage}).single('image'); // la méthode single capture les fichiers de type image, et les enregistre au système de fichiers du serveur à l'aide du storage configuré