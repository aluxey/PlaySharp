# Frontend Guidelines

## Objectif

Ce document définit les règles de design et d’intégration front-end du projet.  
Le but est de garantir une interface :

- cohérente
- lisible
- rapide à utiliser
- crédible sur mobile et desktop
- premium sans être surchargée

L’identité visuelle du produit repose sur une direction **dark premium** avec des **accents vifs**, adaptée à un univers poker / blackjack.

---

# 1. Direction visuelle

## Style global

Direction recommandée :

- dark premium
- accents colorés vifs
- interface sobre, nette, moderne
- sensation de précision, maîtrise et performance
- animations discrètes mais valorisantes

Le design doit inspirer :

- confiance
- clarté
- progression
- challenge
- récompense

Éviter :

- les interfaces trop chargées
- les effets excessifs
- les couleurs flashy partout
- les ombres lourdes
- les gradients agressifs mal contrôlés

---

# 2. Palette de couleurs

## Couleurs principales

### Fond principal
- `#0B1020`

### Surfaces / cartes
- `#12182B`
- `#1A2238`

### Texte principal
- `#F5F7FB`

### Texte secondaire
- `#A9B1C7`

### Couleur primaire
- `#4DA3FF`

### Couleur secondaire
- `#7C5CFF`

### Succès
- `#22C55E`

### Erreur
- `#EF4444`

### Warning / mise en avant
- `#F59E0B`

### Premium
- `#E6C15A`

---

## Règles d’usage des couleurs

### Fond
Le fond principal doit rester sombre et uniforme pour poser l’identité premium.

### Surfaces
Les cartes, panneaux, blocs de contenu et modales utilisent les couleurs de surface pour créer une hiérarchie visuelle claire.

### Accent primaire
Le bleu électrique est utilisé pour :

- CTA principaux
- éléments actifs
- liens importants
- focus states
- progression principale

### Accent secondaire
Le violet est utilisé pour :

- éléments complémentaires
- badges spécifiques
- détails premium secondaires
- éléments décoratifs limités

### Couleurs sémantiques
Utiliser strictement :

- vert pour les validations / succès
- rouge pour les erreurs / mauvaises réponses
- ambre pour les alertes / mises en avant
- or doux pour le premium

---

# 3. Typographie

## Police recommandée

Utiliser une seule police principale parmi :

- Inter
- Manrope
- Plus Jakarta Sans

Par défaut, privilégier **Inter**.

---

## Échelle typographique

### Titre principal
- Desktop : `28px` à `36px`
- Mobile : `24px` à `28px`

### H2
- `20px` à `24px`

### H3
- `16px` à `18px`

### Texte courant
- `14px` à `16px`

### Petit texte
- `12px` à `13px`

---

## Règles de lisibilité

- interligne généreux
- paragraphes courts
- priorité à la lecture rapide
- forte lisibilité sur mobile
- hiérarchie visuelle nette
- jamais de bloc texte trop dense dans les quiz

---

# 4. Grille et espacements

## Mobile

- marge horizontale : `16px`
- espacements internes : `12px`, `16px`, `20px`
- cartes empilées verticalement
- bottom navigation recommandée

## Desktop

- container max : `1200px` à `1280px`
- grille de `12 colonnes`
- sidebar possible à gauche
- cartes en `2` ou `3` colonnes selon le contexte

---

## Règles d’espacement

Utiliser un système d’espacement cohérent basé sur :

- `4`
- `8`
- `12`
- `16`
- `20`
- `24`
- `32`

Éviter les valeurs arbitraires hors système sauf besoin exceptionnel.

---

# 5. Composants UI

## 5.1 Boutons

Trois variantes doivent exister dès le début :

### Primary
Usage :
- CTA principal
- validation
- action clé de l’écran

Style :
- fond plein
- couleur forte
- contraste élevé

### Secondary
Usage :
- actions secondaires
- alternatives
- filtres ou actions de support

Style :
- contour ou fond léger
- moins dominant visuellement

### Ghost
Usage :
- liens annexes
- actions discrètes
- navigation secondaire

Style :
- minimal
- sans surcharge visuelle

---

## États obligatoires des boutons

Chaque bouton doit gérer les états suivants :

- normal
- hover
- pressed
- disabled
- loading

Le disabled doit être clairement identifiable.  
Le loading doit bloquer les actions multiples.

---

## 5.2 Cards

Les cards sont utilisées pour :

- stats
- cours
- recommandations
- résultats
- offres premium

### Style recommandé
- fond contrasté
- radius `16px` à `20px`
- ombre légère
- bord subtil
- padding généreux

Une card doit toujours rester lisible sans effet inutile.

---

## 5.3 Inputs / filtres

Règles :

- grande zone de clic sur mobile
- labels toujours visibles
- erreurs explicites
- ne jamais dépendre uniquement du placeholder
- focus visible et accessible
- helper text possible si besoin

---

## 5.4 Progress bars

Les barres de progression sont centrales dans le produit.

Elles doivent exister pour :

- progression du quiz
- progression par thème
- progression globale
- objectifs premium

Règles :

- lecture immédiate
- bonne visibilité
- cohérence de style
- animation légère possible
- ne pas surcharger avec trop d’effets

---

# 6. Navigation

## Mobile

Navigation recommandée : **Bottom Nav 5 items**

Items :

- Accueil
- Quiz
- Cours
- Progression
- Profil

Le bouton **Quiz** peut être davantage mis en avant visuellement.

---

## Desktop

Navigation recommandée :

### Sidebar gauche
- Dashboard
- Quiz
- Cours
- Progression
- Profil
- Upgrade Premium

### Topbar
- recherche éventuelle
- avatar
- streak
- notifications

---

# 7. UX principles

## Règles de base

L’interface doit toujours privilégier :

- clarté
- rapidité
- feedback immédiat
- cohérence
- sentiment de progression

---

## Pour les quiz

Le flow doit être ultra lisible :

- question visible immédiatement
- choix faciles à scanner
- validation évidente
- feedback instantané
- explication claire après réponse
- passage au suivant sans friction

---

## Pour les résultats

Toujours montrer :

- score
- taux de réussite
- temps ou rythme si pertinent
- thèmes faibles
- prochaine action recommandée

---

## Pour le premium

Le premium doit être visible sans casser l’expérience gratuite.

Montrer clairement :

- ce qui est disponible
- ce qui est verrouillé
- pourquoi cela a de la valeur

Ne jamais être agressif ou intrusif.

---

# 8. Accessibilité minimale

Le front doit respecter au minimum :

- contraste suffisant
- focus visible clavier
- labels explicites
- boutons avec états clairs
- taille de clic confortable sur mobile
- feedback d’erreur compréhensible

Ne jamais transmettre une information uniquement par la couleur.

---

# 9. Règles d’implémentation front

## Cohérence

Tout nouvel écran doit réutiliser :

- les mêmes tokens
- les mêmes composants
- les mêmes conventions de spacing
- les mêmes patterns de navigation

---


