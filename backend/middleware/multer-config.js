// Import multer 
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// création d'un objet de configuration pour indiquer à multer où et comment enregistrer les fichiers entrants 
const storage = multer.diskStorage({
    // On indique à multer où enregistrer les images (dans le dossiers images)
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // filename = on génère un nom de fichier suffisamment unique : 
    filename: (req, file, callback) => {
        // Propriété originalname + méthodes split/join pour remplacer les espaces par des underscores
        const name = file.originalname.split(' ').join('_');
        const fileName = name.split('.', [1]);
        const extension = MIME_TYPES[file.mimetype];
        // Date.now pour ajouter un time stamp à la milliseconde pour rendre le nom de fichier unique
        callback(null, fileName + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');