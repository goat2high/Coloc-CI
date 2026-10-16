# Cahier des Charges – Backend
## Plateforme de Colocation – Côte d’Ivoire

### 1. Objectif
Développer le backend d’une plateforme de colocation permettant la gestion des utilisateurs, des annonces, du système de matching, de la messagerie et de l’administration, de manière sécurisée, performante et évolutive.

### 2. Stack technique recommandée
- **Langage** : Python 3.11+
- **Framework** : Flask
- **Base de données** : MySQL
- **ORM** : SQLAlchemy
- **Authentification** : Flask-JWT-Extended ou Flask-Login + sessions
- **Gestion des fichiers (photos)** : stockage local (MVP) puis cloud (Cloudinary / AWS S3)
- **Autres** : Flask-Mail (notifications), Flask-CORS

### 3. Fonctionnalités principales

| Module                  | Fonctionnalités                                                                 |
|-------------------------|---------------------------------------------------------------------------------|
| **Authentification**    | Inscription, connexion, déconnexion, réinitialisation de mot de passe, vérification d’email |
| **Gestion des profils** | Création et modification du profil utilisateur (âge, statut étudiant/travailleur, budget, mode de vie, fumeur, animaux, propreté, etc.) |
| **Gestion des annonces**| Création, modification, suppression et consultation des annonces de colocation  |
| **Recherche & Filtres** | Recherche multicritères (ville, quartier, budget, type de chambre, etc.)        |
| **Système de Matching** | Calcul du score de compatibilité entre un chercheur et une annonce              |
| **Messagerie**          | Envoi et réception de messages privés liés à une annonce                        |
| **Favoris**             | Ajout / suppression d’annonces en favoris                                       |
| **Signalement**         | Signalement d’annonces ou d’utilisateurs                                        |
| **Administration**      | Gestion des utilisateurs, annonces, signalements et modération                  |
| **Notifications**       | Notifications internes (nouveau message, nouvelle candidature, etc.)            |

### 4. Principales entités de la base de données
- `User`
- `Profile`
- `Listing` (Annonce)
- `Photo`
- `Message`
- `Favorite`
- `Report`
- `Notification`
- `CompatibilityScore` (optionnel – peut être calculé à la volée)

### 5. Exigences non fonctionnelles
- **Sécurité** : mots de passe hashés (bcrypt), protection CSRF, validation des données, gestion des rôles (user / admin)
- **Performance** : temps de réponse < 500 ms pour les recherches courantes
- **Scalabilité** : architecture permettant l’ajout futur de nouvelles fonctionnalités
- **Documentation** : API documentée (Swagger / Flasgger recommandé)

### 6. Priorisation (MVP)
**Version 1 (MVP) :**
- Authentification
- Gestion des profils
- CRUD Annonces
- Recherche avec filtres de base
- Calcul du score de matching
- Messagerie simple

**Version 2 :**
- Favoris
- Signalements
- Notifications
- Tableau de bord administrateur
- Upload cloud des photos
