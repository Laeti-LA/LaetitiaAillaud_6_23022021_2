// Import multer 
const multer = require('multer');

const MINE_TYPES = {
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
    // filename = on génère un nom de fichier suffisamment unique 
    filename: (req, file, callback) => {
        // propriété originalname + méthodes split et join pour remplacer les espaces par des underscores
        const name = file.originalname.split(' ').join('_');
        const extension = MINE_TYPES[file.minetype];
        // Date.now pour ajouter un time stamp à la milliseconde pour rendre le nom de fichier unique
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');