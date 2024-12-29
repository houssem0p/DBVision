### DBVision - Interface de Monitoring pour les Systèmes de Gestion de Base de Données (SGBD)
# Description
DBVision est une application de monitoring pour surveiller les performances des Systèmes de Gestion de Base de Données (SGBD). Elle offre une interface intuitive permettant de se connecter à un SGBD, d’afficher des métriques clés comme l’utilisation du CPU, de la mémoire, les événements d'attente et bien plus encore.

# Prérequis
Node.js
NPM (Node Package Manager)
Un SGBD (par exemple, MySQL ou PostgreSQL) pour connecter l'application

# Cloner le projet
Pour récupérer le projet depuis GitHub, vous devez d'abord cloner le dépôt :
https://github.com/houssem0p/DBVision.git

Ensuite, accédez au dossier du projet cloné :
cd dbvision
# Installation

Étapes d'installation pour le front-end :
Accédez au dossier front :
cd front

Installez les dépendances nécessaires :
npm install react-apexcharts react-router-dom framer-motion axios websocket

Démarrez l'application front-end :
npm start

Cela lancera l'interface utilisateur sur http://localhost:3000.

Étapes d'installation pour le back-end :
Accédez au dossier server :
cd server

Installez les dépendances nécessaires pour le serveur :
npm install express axios websocket

Démarrez le serveur :
node server.js

Cela démarrera le serveur API sur http://localhost:5000.

# Fonctionnalités
Connexion au SGBD : L'utilisateur peut se connecter à un SGBD avec des identifiants sécurisés.
Tableaux de bord personnalisés : Affichage des performances du SGBD avec des métriques détaillées comme l'utilisation du CPU, la mémoire, et plus encore.
Métriques en temps réel : Affichage dynamique des métriques en temps réel.
Graphiques interactifs : Visualisation des performances avec des graphiques générés par React ApexCharts.
Utilisation
Lancez le back-end et le front-end comme expliqué ci-dessus.
Accédez à la page de connexion et entrez vos identifiants de SGBD.
Explorez le tableau de bord pour visualiser les métriques de votre SGBD.
Utilisez les graphiques et les tableaux pour analyser la performance de votre système.
# Technologies utilisées
Front-end : React, React Router, React ApexCharts, Tailwind CSS, Framer Motion, Axios
Back-end : Node.js, Express, WebSocket
Base de données : MySQL, PostgreSQL (selon le choix de l'utilisateur)
Auteurs
### Houssem Eddine Belaid 222239410206
