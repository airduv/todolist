/* eslint-disable prefer-arrow-callback */
/* eslint-disable max-len */
// TUTO : https://pub.phyks.me/sdz/sdz/des-applications-ultra-rapides-avec-node-js.html

/* ALLEZ PLUS LOIN !
  Ma petite todolist est très basique. Vous pouvez lui ajouter de nombreuses fonctionnalités :
   * Modification des noms des tâches
   * Réagencement des tâches entre elles
   * Exportation CSV
   * Attribution d'une priorité et d'une date limite
   * Persistence de la todolist (stockage dans une base de données ou une base NoSQL)
   * Partage d'une todolist entre plusieurs personnes
   * Synchronisation de la todolist en temps réel entre les personnes sans avoir besoin de recharger la page
 => Certaines de ces fonctionnalités sont plus faciles à réaliser que d'autres.
    Pour d'autres, il vous faudra découvrir et utiliser de nouveaux modules.
*/

var express = require('express');

var app = express();

// https://expressjs.com/fr/guide/migrating-4.html
// Migration vers Express 4
// Express 4 est un changement novateur d’Express 3.
// Une application Express 3 existante ne fonctionnera pas si vous mettez à jour la version Express dans les dépendances
// Express 4 ne dépend plus de Connect, et supprime tous les middleware intégrés de son noyau, sauf la fonction express.static.

/* On utilise les cookies, les sessions et les formulaires */
// Version Express 3 :
// app.use(express.cookieParser());
// app.use(express.session({secret: 'todotopsecret'}));
// app.use(express.bodyParser());
// Remi : Most middleware (like cookieParser) is no longer bundled with Express and must be installed separately
//  Please see https://github.com/senchalabs/connect#middleware

// Maj vers derniere version Express (passage v3 à v4)
var cookieParser = require('cookie-parser');
// => Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
// Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret
//  so it may be used by other middleware.
var session = require('express-session');
// Note : Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side
var bodyParser = require('body-parser');
// => Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

// NB: app.use("middleware")
// cf. https://expressjs.com/fr/guide/using-middleware.html
/*
 Les fonctions middleware effectuent les tâches suivantes :
  * Exécuter tout type de code.
  * Apporter des modifications aux objets de demande et de réponse.
  * Terminer le cycle de demande-réponse.
  * Appeler la fonction middleware suivant dans la pile.

 Si la fonction middleware en cours ne termine pas le cycle de demande-réponse, elle doit appeler la fonction next()
 pour transmettre le contrôle à la fonction middleware suivant. Sinon, la demande restera bloquée.

 Liez le middleware niveau application à une instance de l’objet app object en utilisant les fonctions app.use() et app.METHOD(),
 où METHOD est la méthode HTTP de la demande que gère la fonction middleware (par exemple GET, PUT ou POST) en minuscules.
*/

app.use(cookieParser());
// CONFIG express-session :
app.use(
  session({
    secret: 'todotopsecret',
    resave: true,
    saveUninitialized: false,
    cookie: { sameSite: 'none' },
  }),
);
// http://expressjs.com/en/resources/middleware/body-parser.html
// parse application/x-www-form-urlencoded => pour les formulaires HTML
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
// app.use(bodyParser.json())

/* S'il n'y a pas de todolist dans la session,
  on en crée une vide sous forme d'array avant la suite */
// NB: fonction middleware sans chemin de montage => La fonction est exécutée à chaque fois que l’application reçoit une demande.
app.use(function(req, res, next) {
  if (typeof(req.session.todolist) == 'undefined') {
    req.session.todolist = [];
  }
  next();
});

/* On affiche la todolist et le formulaire */
app.get('/todo', function(req, res) {
  // console.log(req.session);
  res.render('todo.ejs', { todolist: req.session.todolist });
})

/* On ajoute un élément à la todolist */
app.post('/todo/ajouter/', function(req, res) {
  if (req.body.newtodo !== '') {
    req.session.todolist.push(req.body.newtodo);
  }
  res.redirect('/todo');
});

/* Supprime un élément de la todolist */
app.get('/todo/supprimer/:id', function(req, res) {
  if (req.params.id !== '') {
    req.session.todolist.splice(req.params.id, 1);
  }
  res.redirect('/todo');
});

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
app.use(function(req, res, next) {
  res.redirect('/todo');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
