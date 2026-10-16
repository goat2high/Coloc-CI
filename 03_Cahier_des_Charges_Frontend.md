# Cahier des Charges – Frontend
## Plateforme de Colocation – Côte d’Ivoire

### 1. Objectif
Concevoir une interface utilisateur moderne, intuitive et responsive permettant aux utilisateurs de rechercher, publier et gérer des colocations facilement, tout en visualisant clairement le score de compatibilité.

### 2. Stack technique recommandée
- **HTML5**
- **CSS3** (Bootstrap 5 ou Tailwind CSS)
- **JavaScript** (Vanilla JS pour le MVP – possibilité d’évoluer vers React plus tard)
- **Intégration API** : Fetch API ou Axios

### 3. Pages principales à développer

| Page                            | Description                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| **Accueil**                     | Présentation de la plateforme + accès rapide « Trouver une colocation » / « Créer une colocation » |
| **Inscription / Connexion**     | Formulaires d’authentification                                              |
| **Profil utilisateur**          | Consultation et modification du profil + préférences de colocation          |
| **Recherche de colocation**     | Formulaire de filtres avancés + liste des résultats avec score de compatibilité |
| **Détail d’une annonce**        | Affichage complet de l’annonce + bouton de contact + score de compatibilité détaillé |
| **Création / Édition d’annonce**| Formulaire de publication d’une colocation (avec upload de photos)          |
| **Messagerie**                  | Liste des conversations + interface de chat                                 |
| **Mes annonces**                | Gestion des annonces publiées par l’utilisateur                             |
| **Mes favoris**                 | Liste des annonces sauvegardées                                             |
| **Tableau de bord Admin**       | Interface de modération (réservée aux administrateurs)                      |

### 4. Fonctionnalités UI/UX prioritaires
- Affichage clair du **score de compatibilité** (pourcentage + détail par critère)
- Filtres de recherche dynamiques
- Upload multiple de photos avec prévisualisation
- Design **responsive** (approche mobile-first)
- Messages de confirmation et gestion des erreurs utilisateur
- Indicateurs de chargement (spinners / skeletons)
- Système de notifications visuelles

### 5. Exigences non fonctionnelles
- Compatible avec les principaux navigateurs (Chrome, Firefox, Edge, Safari)
- Temps de chargement des pages < 3 secondes
- Interface entièrement en **français**
- Accessibilité de base (contrastes, labels, navigation clavier)
- Design moderne, épuré et rassurant (couleurs professionnelles)

### 6. Priorisation (MVP)
**Version 1 (MVP) :**
- Page d’accueil
- Authentification (Inscription / Connexion)
- Profil utilisateur
- Recherche + liste des résultats avec score
- Détail d’une annonce
- Création d’annonce
- Messagerie de base

**Version 2 :**
- Favoris
- Tableau de bord administrateur
- Amélioration de l’UX (animations, meilleures previews photos, etc.)
- Version plus avancée du score de matching (détail par critère)
