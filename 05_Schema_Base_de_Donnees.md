# Schéma de la Base de Données
## Plateforme de Colocation – Côte d’Ivoire

### Technologies
- SGBD : **MySQL**
- ORM : **SQLAlchemy** (Flask)

---

### 1. Table `users`

| Champ              | Type              | Contraintes                  | Description                          |
|--------------------|-------------------|------------------------------|--------------------------------------|
| id                 | INT               | PRIMARY KEY, AUTO_INCREMENT  | Identifiant unique                   |
| email              | VARCHAR(120)      | UNIQUE, NOT NULL             | Email de connexion                   |
| password_hash      | VARCHAR(255)      | NOT NULL                     | Mot de passe hashé (bcrypt)          |
| role               | ENUM('user','admin') | DEFAULT 'user'            | Rôle de l'utilisateur                |
| is_verified        | BOOLEAN           | DEFAULT FALSE                | Email vérifié ou non                 |
| created_at         | DATETIME          | DEFAULT CURRENT_TIMESTAMP    | Date de création                     |
| updated_at         | DATETIME          | ON UPDATE CURRENT_TIMESTAMP  | Dernière mise à jour                 |

---

### 2. Table `profiles`

| Champ              | Type              | Contraintes                  | Description                          |
|--------------------|-------------------|------------------------------|--------------------------------------|
| id                 | INT               | PRIMARY KEY, AUTO_INCREMENT  | Identifiant unique                   |
| user_id            | INT               | FOREIGN KEY → users.id       | Lien avec l'utilisateur              |
| first_name         | VARCHAR(50)       | NOT NULL                     | Prénom                               |
| last_name          | VARCHAR(50)       |                              | Nom                                  |
| age                | INT               |                              | Âge                                  |
| gender             | ENUM('Homme','Femme','Autre') |                     | Genre                                |
| status             | ENUM('Étudiant','Travailleur') |                 | Statut                               |
| city               | VARCHAR(100)      |                              | Ville                                |
| neighborhood       | VARCHAR(100)      |                              | Quartier                             |
| budget_min         | INT               |                              | Budget minimum (FCFA)                |
| budget_max         | INT               |                              | Budget maximum (FCFA)                |
| lifestyle          | ENUM('Calme','Social','Mixte') |                 | Mode de vie                          |
| smoker             | BOOLEAN           | DEFAULT FALSE                | Fumeur                               |
| pets               | BOOLEAN           | DEFAULT FALSE                | Accepte les animaux                  |
| cleanliness        | INT               | CHECK (1 TO 5)               | Niveau de propreté (1 à 5)           |
| bio                | TEXT              |                              | Description personnelle              |
| phone              | VARCHAR(20)       |                              | Numéro de téléphone                  |
| created_at         | DATETIME          | DEFAULT CURRENT_TIMESTAMP    |                                      |
| updated_at         | DATETIME          | ON UPDATE CURRENT_TIMESTAMP  |                                      |

---

### 3. Table `listings` (Annonces)

| Champ              | Type              | Contraintes                  | Description                          |
|--------------------|-------------------|------------------------------|--------------------------------------|
| id                 | INT               | PRIMARY KEY, AUTO_INCREMENT  | Identifiant unique                   |
| user_id            | INT               | FOREIGN KEY → users.id       | Propriétaire de l'annonce            |
| title              | VARCHAR(150)      | NOT NULL                     | Titre de l'annonce                   |
| description        | TEXT              |                              | Description détaillée                |
| city               | VARCHAR(100)      | NOT NULL                     | Ville                                |
| neighborhood       | VARCHAR(100)      | NOT NULL                     | Quartier                             |
| address            | VARCHAR(255)      |                              | Adresse précise (optionnel)          |
| rent               | INT               | NOT NULL                     | Loyer mensuel (FCFA)                 |
| charges            | INT               | DEFAULT 0                    | Charges mensuelles                   |
| total_rooms        | INT               |                              | Nombre total de chambres             |
| available_rooms    | INT               | NOT NULL                     | Chambres disponibles                 |
| room_type          | ENUM('Privée','Partagée') | NOT NULL             | Type de chambre proposée             |
| bathroom_type      | ENUM('Privée','Partagée') |                     | Type de salle de bain                |
| furnished          | BOOLEAN           | DEFAULT FALSE                | Meublé                               |
| wifi               | BOOLEAN           | DEFAULT FALSE                | Wi-Fi inclus                         |
| lifestyle          | ENUM('Calme','Social','Mixte') |                 | Mode de vie de la colocation         |
| smoker             | BOOLEAN           | DEFAULT FALSE                | Fumeur accepté                       |
| pets               | BOOLEAN           | DEFAULT FALSE                | Animaux acceptés                     |
| available_from     | DATE              |                              | Date de disponibilité                |
| rules              | TEXT              |                              | Règles de la colocation              |
| status             | ENUM('active','inactive','rented') | DEFAULT 'active' | Statut de l'annonce             |
| created_at         | DATETIME          | DEFAULT CURRENT_TIMESTAMP    |                                      |
| updated_at         | DATETIME          | ON UPDATE CURRENT_TIMESTAMP  |                                      |

---

### 4. Table `photos`

| Champ              | Type              | Contraintes                  | Description                          |
|--------------------|-------------------|------------------------------|--------------------------------------|
| id                 | INT               | PRIMARY KEY, AUTO_INCREMENT  | Identifiant unique                   |
| listing_id         | INT               | FOREIGN KEY → listings.id    | Annonce concernée                    |
| filename           | VARCHAR(255)      | NOT NULL                     | Nom du fichier                       |
| is_main            | BOOLEAN           | DEFAULT FALSE                | Photo principale                     |
| created_at         | DATETIME          | DEFAULT CURRENT_TIMESTAMP    |                                      |

---

### 5. Table `messages`

| Champ              | Type              | Contraintes                  | Description                          |
|--------------------|-------------------|------------------------------|--------------------------------------|
| id                 | INT               | PRIMARY KEY, AUTO_INCREMENT  | Identifiant unique                   |
| sender_id          | INT               | FOREIGN KEY → users.id       | Expéditeur                           |
| receiver_id        | INT               | FOREIGN KEY → users.id       | Destinataire                         |
| listing_id         | INT               | FOREIGN KEY → listings.id    | Annonce concernée (optionnel)        |
| content            | TEXT              | NOT NULL                     | Contenu du message                   |
| is_read            | BOOLEAN           | DEFAULT FALSE                | Message lu ou non                    |
| created_at         | DATETIME          | DEFAULT CURRENT_TIMESTAMP    |                                      |

---

### 6. Table `favorites`

| Champ              | Type              | Contraintes                  | Description                          |
|--------------------|-------------------|------------------------------|--------------------------------------|
| id                 | INT               | PRIMARY KEY, AUTO_INCREMENT  | Identifiant unique                   |
| user_id            | INT               | FOREIGN KEY → users.id       | Utilisateur                          |
| listing_id         | INT               | FOREIGN KEY → listings.id    | Annonce mise en favori               |
| created_at         | DATETIME          | DEFAULT CURRENT_TIMESTAMP    |                                      |

**Contrainte unique** : (user_id, listing_id)

---

### 7. Table `reports`

| Champ              | Type              | Contraintes                  | Description                          |
|--------------------|-------------------|------------------------------|--------------------------------------|
| id                 | INT               | PRIMARY KEY, AUTO_INCREMENT  | Identifiant unique                   |
| reporter_id        | INT               | FOREIGN KEY → users.id       | Utilisateur qui signale              |
| listing_id         | INT               | FOREIGN KEY → listings.id    | Annonce signalée (nullable)          |
| reported_user_id   | INT               | FOREIGN KEY → users.id       | Utilisateur signalé (nullable)       |
| reason             | TEXT              | NOT NULL                     | Motif du signalement                 |
| status             | ENUM('pending','reviewed','resolved') | DEFAULT 'pending' | Statut |
| created_at         | DATETIME          | DEFAULT CURRENT_TIMESTAMP    |                                      |

---

### 8. Table `notifications`

| Champ              | Type              | Contraintes                  | Description                          |
|--------------------|-------------------|------------------------------|--------------------------------------|
| id                 | INT               | PRIMARY KEY, AUTO_INCREMENT  | Identifiant unique                   |
| user_id            | INT               | FOREIGN KEY → users.id       | Destinataire                         |
| type               | VARCHAR(50)       |                              | Type (message, match, etc.)          |
| content            | TEXT              |                              | Contenu de la notification           |
| is_read            | BOOLEAN           | DEFAULT FALSE                | Lu ou non                            |
| created_at         | DATETIME          | DEFAULT CURRENT_TIMESTAMP    |                                      |

---

### Relations principales

```
User 1 ────── 1 Profile
User 1 ────── * Listing
User 1 ────── * Message (en tant qu'expéditeur ou destinataire)
Listing 1 ──── * Photo
User 1 ────── * Favorite
Listing 1 ──── * Favorite
User 1 ────── * Report
Listing 1 ──── * Report
User 1 ────── * Notification
```
