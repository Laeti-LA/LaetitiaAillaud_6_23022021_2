const {body} = require('express-validator');

const emailMessage = "Email incorrect, veuillez saisir une adresse email valide";
const passwordMessage = "Mot de passe non valide, le mot de passe doit contenir 8 caractères minimum";
exports.signupValidator = [
    // Vérification de l'email 
	body('email').isEmail().withMessage(emailMessage),
    // Vérification du mot de passe (6 caractères minimum)
	body('password').isLength({min: 8}).withMessage(passwordMessage)
];