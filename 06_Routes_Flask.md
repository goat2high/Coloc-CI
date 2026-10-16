# Routes Flask principales
## Plateforme de Colocation – Côte d’Ivoire

### Conventions
- Toutes les routes API renvoient du JSON (sauf les pages HTML si rendu côté serveur)
- Authentification via session ou JWT
- Préfixe recommandé : `/api/` pour les routes API

---

### 1. Authentification

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| POST    | `/api/auth/register`         | Inscription d’un nouvel utilisateur      | Non          |
| POST    | `/api/auth/login`            | Connexion                                | Non          |
| POST    | `/api/auth/logout`           | Déconnexion                              | Oui          |
| POST    | `/api/auth/forgot-password`  | Demande de réinitialisation de mot de passe | Non       |
| POST    | `/api/auth/reset-password`   | Réinitialisation du mot de passe         | Non          |
| GET     | `/api/auth/me`               | Récupérer les infos de l’utilisateur connecté | Oui     |

---

### 2. Profil utilisateur

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| GET     | `/api/profile`               | Voir son propre profil                   | Oui          |
| PUT     | `/api/profile`               | Modifier son profil                      | Oui          |
| GET     | `/api/profile/<user_id>`     | Voir le profil public d’un autre utilisateur | Oui     |

---

### 3. Annonces (Listings)

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| GET     | `/api/listings`              | Liste des annonces (avec filtres)        | Non          |
| GET     | `/api/listings/<id>`         | Détail d’une annonce                     | Non          |
| POST    | `/api/listings`              | Créer une annonce                        | Oui          |
| PUT     | `/api/listings/<id>`         | Modifier une annonce                     | Oui (propriétaire) |
| DELETE  | `/api/listings/<id>`         | Supprimer une annonce                    | Oui (propriétaire) |
| GET     | `/api/listings/my`           | Voir ses propres annonces                | Oui          |

**Filtres supportés sur `/api/listings` :**
- `city`
- `neighborhood`
- `min_budget` / `max_budget`
- `room_type`
- `bathroom_type`
- `furnished`
- `wifi`
- `available_from`

---

### 4. Matching

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| GET     | `/api/match`                 | Recherche avec score de compatibilité    | Oui          |
| GET     | `/api/match/<listing_id>`    | Score de compatibilité pour une annonce précise | Oui   |

---

### 5. Photos

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| POST    | `/api/listings/<id>/photos`  | Ajouter une ou plusieurs photos          | Oui (propriétaire) |
| DELETE  | `/api/photos/<photo_id>`     | Supprimer une photo                      | Oui (propriétaire) |
| PUT     | `/api/photos/<photo_id>/main`| Définir comme photo principale           | Oui (propriétaire) |

---

### 6. Messagerie

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| GET     | `/api/messages`              | Liste des conversations                  | Oui          |
| GET     | `/api/messages/<user_id>`    | Conversation avec un utilisateur         | Oui          |
| POST    | `/api/messages`              | Envoyer un message                       | Oui          |
| PUT     | `/api/messages/<id>/read`    | Marquer un message comme lu              | Oui          |

---

### 7. Favoris

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| GET     | `/api/favorites`             | Liste des annonces favorites             | Oui          |
| POST    | `/api/favorites/<listing_id>`| Ajouter aux favoris                      | Oui          |
| DELETE  | `/api/favorites/<listing_id>`| Retirer des favoris                      | Oui          |

---

### 8. Signalements

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| POST    | `/api/reports`               | Signaler une annonce ou un utilisateur   | Oui          |

---

### 9. Notifications

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| GET     | `/api/notifications`         | Liste des notifications                  | Oui          |
| PUT     | `/api/notifications/<id>/read`| Marquer comme lue                       | Oui          |
| PUT     | `/api/notifications/read-all`| Tout marquer comme lu                    | Oui          |

---

### 10. Administration (réservé au rôle `admin`)

| Méthode | Route                        | Description                              | Auth requise |
|---------|------------------------------|------------------------------------------|--------------|
| GET     | `/api/admin/users`           | Liste des utilisateurs                   | Admin        |
| PUT     | `/api/admin/users/<id>/status`| Activer / désactiver un utilisateur     | Admin        |
| GET     | `/api/admin/listings`        | Liste de toutes les annonces             | Admin        |
| PUT     | `/api/admin/listings/<id>/status` | Changer le statut d’une annonce     | Admin        |
| GET     | `/api/admin/reports`         | Liste des signalements                   | Admin        |
| PUT     | `/api/admin/reports/<id>`    | Traiter un signalement                   | Admin        |

---

### Exemple de réponse JSON (annonce avec score)

```json
{
  "id": 12,
  "title": "Chambre disponible à Cocody Angré",
  "city": "Abidjan",
  "neighborhood": "Cocody",
  "rent": 120000,
  "charges": 15000,
  "room_type": "Privée",
  "compatibility_score": 87,
  "score_details": {
    "budget": 100,
    "quartier": 70,
    "mode_vie": 90,
    "fumeur": 100,
    "animaux": 0
  },
  "owner": {
    "id": 5,
    "first_name": "Michael",
    "age": 24
  }
}
```
