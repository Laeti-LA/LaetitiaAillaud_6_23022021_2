// Import dotenv 
require('dotenv').config();
// Import Express 
const express = require('express');
// Imports cors 
const cors = require('cors');
// Import Mongoose
const mongoose = require('mongoose');
// Import pour accéder au path du serveur
const path = require('path');
// Import du router user 
const userRoutes = require('./routes/user');
// Import du router sauce 
const sauceRoutes = require('./routes/sauce');
// Import middleware Helmet
const helmet = require('helmet');
// Import middleware xss-clean 
const xss = require('xss-clean');
// Import cookie-session 
const cookieSession = require('cookie-session');

const app = express();

// Utiliser des variables d'environnement pour ne pas exposer l'id/mdp Mongoose (ex : dot.env) 
mongoose.connect(`mongodb+srv://${process.env.ID}:${process.env.MDP}@${process.env.CLUSTER}.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(() => console.log('Echec connexion à MongoDB'));

// Headers permettant d'accéder à l'API depuis n'importe quelle origine 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Enable All CORS Requests
app.use(cors());

// Ajout d'un flag HttpOnly aux cookies (ne fonctionne pas sur les navigateurs obsolètes)
app.use(
  cookieSession({
    name: "session",
    secret: "s3CR3TsTRinG",
    cookie: {
      secure: true,
      httpOnly: true,
      domain: "http://localhost:3000/",
    },
  })
);

// Protection de l'app contre certaines vulnérabilités via la configuration des en-têtes HTTP
app.use(helmet());

// Protection contre les failles xxs : nettoie les inputs utilisateurs venant du corps des requêtes POST, des requêtes GET et des paramètres d'URL
app.use(xss());

// Gestionnaire de routage
app.use('/images', express.static(path.join(__dirname, 'images')));

// Import des logiques de routing user(auth) + sauce
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


module.exports = app;