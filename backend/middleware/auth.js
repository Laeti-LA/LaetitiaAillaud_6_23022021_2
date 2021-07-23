// Import package jsonwebtoken 
const jxt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 1ère étape : récupération token dans le header autorisation
        const token = req.headers.authorization.split('')[1];//structure token = bearer+token, on récupère donc le 2e élément (index [1])
        const decodeToken = jwt.verify(token, 'RANDOM_toekn_SECRET');
        const userId = decodeToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User Id non valable';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête invalide'});
    }
};
