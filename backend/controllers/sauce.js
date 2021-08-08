// Import modèle de données sauce
const Sauce = require('../models/sauce');
// Import package file system de node (accès aux différentes opérations liées au système de fichiers)
const fs = require('fs'); 

// ------------------------------------- FONCTIONS -------------------------------------

// Route n°5 CREATE : créer une nouvelle sauce 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
      delete sauceObject._id; // Suppression id généré par le frontend car la BDD va en générer un
      sauceObject.likes = 0;
	    sauceObject.dislikes = 0;
	    sauceObject.usersLiked = [];
	    sauceObject.usersDisliked = [];
      // Créa constante avec nouvelle instance du modèle Thing 
      const sauce = new Sauce({
        // Opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
        ...sauceObject,
        // Pour générer l'url de l'image => protocol, nom d'hote, nom du fichier 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      });
      console.log(sauceObject);
      console.log(sauce);
      sauce.save() // Le modèle comporte une méthode save() qui enregistre la sauce dans la BDD
        // La méthode save() renvoie une Promise 
        // Réponse de réussite, code 201 : 
        .then(() => res.status(201).json({message: 'La sauce a été créée avec succès'}))
        // Réponse d'erreur, code 400
        .catch(error => res.status(400).json({error}));
    };
  

// Route n°4 GET : récupérer une sauce à partir de son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({ error }));
};

// Route n°6 PUT : modifier une sauce 
exports.modifySauce = (req, res, next) => {
    // création d'un objet sauceObject qui regarde si req.file existe ou non
    const sauceObject = req.file ?
    {
      // Si req.file existe : on traite la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body}; // Sinon : on traite simplement l'objet entrant
    // Méthode updateOne 
    // Premier argument : objet de comparaison (celui à modifier), 
    // Second argument : nouvelle version de l'objet
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'La sauce a été modifiée avec succès'}))
      .catch(error => res.status(400).json({ error }));
};

// Route n°7 DELETE : supprimer une sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // 1ère étape : supprimer l'image du dossier images
        // Récupération nom du fichier 
        const filename = sauce.imageUrl.split('/images/')[1]; //2e élément du tableau créé avec split = nom du fichier 
        // Appel de la méthode unlink du package fs = pour supprimer un fichier 
        fs.unlink(`images/${filename}`, () => {
          // Callback (ce qu'il faut faire une fois le fichier supprimé)
          // Suppression de l'objet dans la base (après que le fichier ait été supprimé) 
          // grâce à la méthode deleteOne avec comme argument l'objet de comparaison (celui à supprimer)
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce a été supprimée avec succès'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
}

// Route n°3 GET : récupérer toutes les sauces avec la méthode find du modèle Mongoose
exports.getAllSauces = (req, res, next) => {
  // Récupération de la liste de sauces 
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

// Route n°8 POST : ajouter ou retirer un like 
exports.rateOneSauce = (req, res, next) => { 
  // Si like = 1 : 
  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, 
      // Modification du nb de likes avec la méthode $inc de MongoDB
      {$inc: {likes: +1}, 
      // Ajout de l'utilisateur dans le tableau des likes avec la méthode $push de MongoDB
      $push: {usersLiked: req.body.userId}})
    .then(() => res.status(200).json({ message: 'Vous avez aimé cette sauce'}))
    .catch(error => res.status(400).json({ error : 'Requête invalide : impossible de liker la sauce' }));
  }
  // Si like = -1 : Ajout de l'utilisateur dans le tableau des dislikes
  if (req.body.like === -1) {
    Sauce.updateOne({ _id: req.params.id }, 
      // Modification du nb de dislikes avec la méthode $inc de MongoDB
      {$inc: {dislikes: +1}, 
      // Ajout de l'utilisateur dans le tableau des likes avec la méthode $push de MongoDB
      $push: {usersDisliked: req.body.userId}})
    .then(() => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce'}))
    .catch(error => res.status(400).json({ error : 'Requête invalide : impossible de disliker la sauce' }));      
  }
  // Si like = 0 : Retrait de l'utilisateur du tableau dans lequel il était
  if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Si l'id de l'utilisateur se trouve dans le tableau des likes
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, 
            // Modification du nb de likes avec la méthode $inc de MongoDB
            {$inc: {likes: -1}, 
            // Retrait de l'utilisateur dans le tableau des likes avec la méthode $pull de MongoDB
            $pull: {usersLiked: req.body.userId}})
          .then(() => res.status(200).json({ message: 'Vous n\'aimez plus cette sauce'}))
          .catch(error => res.status(400).json({ error : 'Requête invalide : impossible de changer la note de la sauce'}));
        }
        // Si l'id de l'utilisateur se trouve dans le tableau des dislikes
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, 
            // Modification du nb de dislikes avec la méthode $inc de MongoDB
            {$inc: {dislikes: -1}, 
            // Retrait de l'utilisateur dans le tableau des likes avec la méthode $pull de MongoDB
            $pull: {usersDisliked: req.body.userId}})
          .then(() => res.status(200).json({ message: 'Vous avez changé d\'avis sur cette sauce'}))
          .catch(error => res.status(400).json({ error : 'Requête invalide : impossible de changer la note de la sauce'}));      
        }
      })
      .catch(error => res.status(400).json({ error })); 
  }
};

