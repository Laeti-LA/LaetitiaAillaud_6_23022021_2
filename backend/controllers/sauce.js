
const Sauce = require('../models/sauce');

// Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauce = new Sauce({
    userId: req.body.title,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    usersLiked: req.body.usersLiked,
    usersDisliked: req.body.usersDisliked
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce créée avec succès!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Route n°3 GET : récupérer toutes les sauces 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

// Route n°4 GET : récupérer une sauce à partir de son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

// Route n°6 PUT : modifier une sauce 
exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'La sauce a été modifiée'}))
      .catch(error => res.status(400).json({ error }));
};

// Route n°7 DELETE : supprimer une sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'La sauce a été supprimée'}))
      .catch(error => res.status(400).json({ error }));
};

// Route n°8 POST : ajouter un like ou un dislike 