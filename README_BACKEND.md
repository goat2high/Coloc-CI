# ColocCI – Backend Flask 🇨🇮

Backend API REST de la plateforme de colocation **ColocCI**, dédiée à la Côte d'Ivoire.

---

## Stack technique

| Outil | Version |
|---|---|
| Python | 3.11+ |
| Flask | 3.0 |
| SQLAlchemy | 3.1 |
| Flask-JWT-Extended | 4.6 |
| Flask-Bcrypt | 1.0 |
| MySQL | 8.0+ |
| Swagger UI | via Flasgger |

---

## Structure du projet

```
ColocCI_Documentation/
├── app/
│   ├── __init__.py          # Factory Flask
│   ├── config.py            # Configuration dev/prod
│   ├── models/              # Modèles SQLAlchemy
│   │   ├── user.py          # User + Profile
│   │   ├── listing.py       # Listing + Photo
│   │   ├── message.py       # Message
│   │   ├── favorite.py      # Favorite
│   │   ├── report.py        # Report
│   │   └── notification.py  # Notification
│   ├── routes/              # Blueprints Flask
│   │   ├── auth.py          # /api/auth/*
│   │   ├── profile.py       # /api/profile/*
│   │   ├── listings.py      # /api/listings/*
│   │   ├── matching.py      # /api/match/*
│   │   ├── messages.py      # /api/messages/*
│   │   ├── favorites.py     # /api/favorites/*
│   │   ├── reports.py       # /api/reports/*
│   │   ├── notifications.py # /api/notifications/*
│   │   └── admin.py         # /api/admin/*
│   └── services/
│       └── matching.py      # Algorithme de matching
├── uploads/                 # Photos locales
├── run.py                   # Point d'entrée
├── requirements.txt
├── .env.example
└── README_BACKEND.md
```

---

## Installation

### 1. Prérequis
- Python 3.11+
- MySQL 8.0+
- pip

### 2. Créer l'environnement virtuel

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Configurer la base de données MySQL

```sql
CREATE DATABASE colocci_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Configurer les variables d'environnement

```bash
copy .env.example .env
# Éditer .env avec vos informations MySQL
```

### 6. Lancer l'application

```bash
python run.py
```

L'API sera disponible sur `http://localhost:5000`

---

## Documentation Swagger

Accédez à la documentation interactive sur :

```
http://localhost:5000/apidocs
```

---

## Endpoints principaux

### Authentification (`/api/auth`)
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/refresh` | Rafraîchir le token |
| GET | `/api/auth/me` | Mon profil (JWT) |
| POST | `/api/auth/logout` | Déconnexion |

### Profils (`/api/profile`)
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/profile` | Mon profil |
| PUT | `/api/profile` | Modifier mon profil |
| GET | `/api/profile/<user_id>` | Profil public |

### Annonces (`/api/listings`)
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/listings` | Liste avec filtres |
| POST | `/api/listings` | Créer une annonce |
| GET | `/api/listings/<id>` | Détail |
| PUT | `/api/listings/<id>` | Modifier |
| DELETE | `/api/listings/<id>` | Supprimer |
| GET | `/api/listings/my` | Mes annonces |
| POST | `/api/listings/<id>/photos` | Ajouter des photos |

### Matching (`/api/match`)
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/match` | Annonces triées par score |
| GET | `/api/match/<listing_id>` | Score pour une annonce |

### Messagerie (`/api/messages`)
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/messages` | Mes conversations |
| GET | `/api/messages/<partner_id>` | Conversation |
| POST | `/api/messages` | Envoyer un message |

### Autres
- `GET /api/favorites` — Mes favoris
- `POST /api/favorites/<id>` — Ajouter aux favoris
- `POST /api/reports` — Signaler
- `GET /api/notifications` — Mes notifications
- `GET /api/health` — Santé de l'API

---

## Authentification

Toutes les routes protégées nécessitent un **JWT Bearer token** :

```
Authorization: Bearer <access_token>
```

Le token est obtenu via `/api/auth/login` ou `/api/auth/register`.

---

## Score de matching

L'algorithme calcule un score de 0 à 100 % basé sur :

| Critère | Poids |
|---|---|
| Budget | 25% |
| Quartier / Ville | 20% |
| Mode de vie | 15% |
| Fumeur | 10% |
| Animaux | 10% |
| Type de chambre | 8% |

- **≥ 80%** → Excellente compatibilité 🟢
- **60–79%** → Bonne compatibilité 🟡
- **< 60%** → Faible compatibilité 🔴

---

## Santé de l'API

```bash
curl http://localhost:5000/api/health
# {"status": "ok", "app": "ColocCI API", "version": "1.0.0"}
```
