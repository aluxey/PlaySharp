## A. Cadrage produit

### Objectif

Définir précisément ce que fait la V1.

### Tâches

* Formaliser la cible utilisateur
* Définir les personas
* Définir la V1 gratuite
* Définir la V1 premium
* Définir les mécaniques de progression
* Définir la valeur des quiz journaliers
* Définir les règles de la ligue privée entre amis
* Définir les KPI produit

### Livrables

* cahier des charges
* liste des fonctionnalités V1 / V2
* user stories
* règles métier principales

### Besoins

* vision claire du modèle gratuit / premium
* arbitrage sur ce qui est indispensable au lancement

---

## B. UX / UI Design

### Objectif

Avoir une interface cohérente, claire et motivante.

### Tâches

* créer la charte visuelle
* définir les composants UI
* faire les wireframes
* faire les maquettes haute fidélité
* penser mobile first
* définir les animations utiles
* définir les états vides, loading, erreur, succès

### Écrans à produire

* landing page
* connexion / inscription
* dashboard
* quiz du jour
* résultat de quiz
* fiche cours
* progression
* profil utilisateur
* abonnement premium
* ligue privée
* classement entre amis
* admin contenu

### Livrables

* design system
* maquettes Figma
* parcours utilisateur complet

### Besoins

* cohérence visuelle
* hiérarchie claire de l’information
* UX simple pour éviter l’effet “app compliquée”

---

## C. Contenu pédagogique

### Objectif

Créer un vrai socle de valeur.

### Tâches

* lister tous les thèmes poker
* lister tous les thèmes blackjack
* découper par niveau : débutant / intermédiaire / avancé
* rédiger les fiches de cours
* créer les quiz
* rédiger les explications des réponses
* normaliser le format des cas
* créer une taxonomie par thème / sous-thème / difficulté

### Exemple de structure de contenu

* Jeu
* Thème
* Sous-thème
* Niveau
* Situation
* Bonne réponse
* Mauvaises réponses
* Explication
* Tags

### Livrables

* base de contenus versionnée
* premier pack de quiz
* premier pack de fiches

### Besoins

* expertise métier fiable
* format homogène
* assez de contenu pour éviter la répétition trop rapide

---

## D. Base de données

### Objectif

Poser une base saine dès le départ.

### Tâches

* modéliser les utilisateurs
* modéliser les quiz/questions/réponses
* modéliser les résultats
* modéliser la progression
* modéliser les abonnements
* modéliser les ligues privées
* modéliser les classements
* modéliser les cours/thèmes/tags

### Tables minimales

* users
* profiles
* games
* themes
* lessons
* quizzes
* questions
* answers
* quiz_attempts
* question_attempts
* subscriptions
* leagues
* league_members
* daily_quiz_sessions
* user_stats

### Livrables

* schéma SQL
* conventions de nommage
* contraintes et index

### Vigilance

Ne mélange pas trop tôt :

* logique de contenu
* logique de progression
* logique sociale

---

## E. Backend / API

### Objectif

Exposer une API claire et maintenable.

### Tâches

* architecture backend
* auth
* CRUD contenu
* endpoints quiz
* endpoints résultats
* endpoints progression
* endpoints abonnements
* endpoints ligues
* endpoints classement
* sécurisation
* logs et gestion d’erreurs

### Endpoints clés

* auth/register
* auth/login
* quiz/daily
* quiz/submit
* lessons
* stats/me
* premium/checkout
* leagues/create
* leagues/join
* leagues/ranking

### Livrables

* architecture du backend
* routes documentées
* validations
* stratégie de sécurité

### Besoins

* séparation claire controller/service/repository
* validation stricte
* logique métier testable

---

## F. Frontend

### Objectif

Transformer le produit en expérience fluide.

### Tâches

* setup projet
* routing
* auth flow
* dashboard
* moteur de quiz
* affichage des résultats
* progression
* cours
* premium
* ligues
* responsive
* accessibilité

### Livrables

* app fonctionnelle complète
* composants réutilisables
* navigation propre

### Vigilance

Le moteur de quiz est critique : il doit être **simple, rapide, fiable**.

---

## G. Premium / Paiement

### Objectif

Monétiser sans casser l’expérience.

### Tâches

* définir avantages premium
* intégrer paiement
* gérer activation abonnement
* limiter certaines fonctionnalités côté free
* gérer les statuts d’abonnement
* page pricing claire

### Free vs Premium possible

**Free**

* quiz du jour limité
* accès partiel aux cours
* stats simples

**Premium**

* quiz illimités
* progression détaillée
* analyse des erreurs par thème
* historique complet
* ligues avancées

### Besoins

* logique produit claire
* UX de paiement rassurante
* gestion propre des accès

---

## H. Admin / Back-office

### Objectif

Être autonome sur le contenu.

### Tâches

* CRUD thèmes
* CRUD cours
* CRUD questions
* gestion difficulté
* prévisualisation quiz
* modération ligues si besoin
* stats globales

### Livrables

* espace admin utilisable
* workflow de création contenu

---

## I. Qualité / Tests

### Objectif

Éviter les régressions et les bugs critiques.

### Tâches

* tests unitaires
* tests API
* tests du moteur de quiz
* tests auth
* tests abonnement
* tests classement
* tests responsive
* tests UX de base

### Checklist qualité MVP

* connexion fonctionne
* quiz fonctionne
* score fonctionne
* stats remontent
* premium filtre bien l’accès
* ligue fonctionne sans doublons ni incohérences

---

## J. Déploiement / Exploitation

### Objectif

Mettre en ligne proprement.

### Tâches

* environnement dev / staging / prod
* variables d’environnement
* base prod
* sauvegardes
* monitoring
* analytics
* SEO landing page
* politique de confidentialité
* CGU / mentions légales


