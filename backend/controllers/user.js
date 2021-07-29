// Import du package de chiffrement Bcrypt
const bcrypt = require('bcrypt');
// Import package webtoken 
const jwt = require('jsonwebtoken');
// Import modèle de données user
const User = require('../models/user'); 
// Import validator (pour vérifier la validité de l'email et du mdp lors de la création d'un nouvel utilisateur)
const {validationResult} = require('express-validator');
// Import du middleware bouncer 
const bouncer = require('express-bouncer')(0,0);

// ------------------------------------- FONCTIONS -------------------------------------

// Fonction pour créer et enregistrer un compte utilisateur 
exports.signup = (req, res, next) => {
    // Vérification de la validité de l'email et du mdp lors de la création d'un nouvel utilisateur)
    const validationErrors = validationResult(req);
    // Si l'email et/ou le mdp sont invalides : 
	if(!validationErrors.isEmpty()){
		console.log('Email et/ou mot de passe incorrect(s)');
		return res.status(422).json({ errors: validationErrors.array() });
	}
    // Si l'email et le mdp sont valides : 
    // Chiffrage du mdp avec la fonction asynchrone hash
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création nouvel utilisateur 
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Ajout de l'utilisateur dans la BDD avec la fonction asynchrone save
            user.save()
                .then(() => res.status(201).json({ message: 'Nouvel utilisateur créé' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Fonction pour connecter un utilisateur existant 
exports.login = (req, res, next) => {
    // Récupération email rentré par l'utilisateur 
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'email n'est pas trouvé : 
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé'});
            }
            // Si l'email est trouvé : 
            // Remise à zéro du délai 
            bouncer.reset(req);
            // Comparaison du hash du mdp saisi avec le hash du mdp enregistré sur MongoDB
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si la comparaison n'est pas valide : 
                    if(!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect'});   
                    }
                    // Si le mdp est valide : 
                    // Remise à zéro du délai 
                    bouncer.reset(req);
                    // Renvoi du userId et d'un token : 
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            // 1er argument : données à encoder
                            { userId: user._id},
                            // 2e argument : clé secrète pour l'encodage
                            'RANDOM_TOKEN_SECRET', // Pour le dev. En prod on utiliserait une chaine de caractères bcp plus longue
                            // 3e argument = argument de configuration : expiration du token
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}));
};


