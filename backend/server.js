// Import package 
const http = require('http');

// Création serveur 
const server = http.createServer((req, res) => {
    res.end('Réponse du serveur');
});

// Port 3000 par défaut + variable d'environnement
server.listen(process.env.PORT || 3000);