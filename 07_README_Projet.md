# ColocCI – Plateforme de Colocation en Côte d’Ivoire

## Description
**ColocCI** est une plateforme web destinée aux étudiants et jeunes travailleurs en Côte d’Ivoire. Elle permet de trouver ou de proposer facilement une colocation grâce à un système de recherche avancée et un **algorithme de matching** basé sur la compatibilité des profils (budget, mode de vie, habitudes, etc.).

---

## Objectifs du projet
- Faciliter la recherche de colocation de manière structurée et sécurisée
- Réduire les risques d’arnaques présents sur les groupes Facebook/WhatsApp
- Proposer un score de compatibilité entre colocataires
- Offrir une expérience moderne et adaptée au contexte ivoirien

---

## Stack technique

### Backend
- Python 3.11+
- Flask
- SQLAlchemy
- MySQL
- Flask-JWT-Extended / Flask-Login
- Bcrypt

### Frontend
- HTML5
- CSS3 (Bootstrap 5 ou Tailwind)
- JavaScript (Vanilla JS pour le MVP)

---

## Structure des fichiers du projet (recommandée)

```
colocci/
│
├── app/
│   ├── __init__.py
│   ├── models/
│   │   ├── user.py
│   │   ├── profile.py
│   │   ├── listing.py
│   │   ├── message.py
│   │   └── ...
│   ├── routes/
│   │   ├── auth.py
│   │   ├── listings.py
│   │   ├── matching.py
│   │   ├── messages.py
│   │   └── admin.py
│   ├── services/
│   │   └── matching.py          # Algorithme de matching
│   ├── templates/
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   └── uploads/
│   └── utils/
│
├── migrations/
├── config.py
├── requirements.txt
├── run.py
└── README.md
```

---

## Fonctionnalités principales

### MVP (Version 1)
- [x] Inscription / Connexion
- [x] Gestion du profil utilisateur
- [x] Création et gestion d’annonces
- [x] Recherche avec filtres
- [x] Calcul du score de compatibilité
- [x] Messagerie de base
- [x] Upload de photos

### Version 2
- [ ] Système de favoris
- [ ] Signalement d’annonces / utilisateurs
- [ ] Notifications
- [ ] Tableau de bord administrateur
- [ ] Vérification d’identité
- [ ] Amélioration du matching

---

## Installation (développement)

```bash
# Cloner le projet
git clone <url-du-repo>
cd colocci

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres MySQL

# Initialiser la base de données
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Lancer l'application
flask run
```

---

## Variables d’environnement (.env)

```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=votre_cle_secrete
DATABASE_URL=mysql+pymysql://user:password@localhost/colocci
JWT_SECRET_KEY=votre_jwt_secret
```

---

## Auteurs
Projet réalisé dans le cadre d’un développement web avec Flask.

---

## Licence
Projet éducatif – Tous droits réservés.
