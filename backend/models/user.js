// Import mongoose 
const mongoose = require('mongoose');

// Package de validation pour pré-valider les infos avant enregistrement 
// et éviter que deux utilisateurs utilisent la même adresse mail
// npm install --save mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

// Utilisation de la méthode schema de mongoose pour crére le modèle de données user
const userSchema = mongoose.Schema({
    // userId: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Appel fonction plugin avec uniqueValidator comme argument) 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);