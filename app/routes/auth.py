"""Routes d'authentification – /api/auth/*"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from app import db
from app.models.user import User, Profile

auth_bp = Blueprint('auth', __name__)


# ── POST /api/auth/register ───────────────────────────────────────────────────
@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Inscription d'un nouvel utilisateur.
    ---
    tags: [Authentification]
    parameters:
      - in: body
        name: body
        required: true
        schema:
          required: [email, password, first_name]
          properties:
            email:      {type: string, example: "kofi@example.ci"}
            password:   {type: string, example: "Motdepasse123!"}
            first_name: {type: string, example: "Kofi"}
            last_name:  {type: string, example: "Asante"}
    responses:
      201: {description: Utilisateur créé}
      400: {description: Données invalides}
      409: {description: Email déjà utilisé}
    """
    data = request.get_json(silent=True) or {}

    email      = (data.get('email') or '').strip().lower()
    password   = data.get('password', '')
    first_name = (data.get('first_name') or '').strip()

    if not email or not password or not first_name:
        return jsonify(error='email, password et first_name sont requis.'), 400
    if len(password) < 6:
        return jsonify(error='Le mot de passe doit contenir au moins 6 caractères.'), 400
    if User.query.filter_by(email=email).first():
        return jsonify(error='Cet email est déjà utilisé.'), 409

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()   # obtenir user.id avant le commit

    profile = Profile(
        user_id    = user.id,
        first_name = first_name,
        last_name  = (data.get('last_name') or '').strip() or None,
    )
    db.session.add(profile)
    db.session.commit()

    access_token  = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify(
        message='Compte créé avec succès.',
        user=user.to_dict(),
        access_token=access_token,
        refresh_token=refresh_token,
    ), 201


# ── POST /api/auth/login ──────────────────────────────────────────────────────
@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Connexion utilisateur.
    ---
    tags: [Authentification]
    parameters:
      - in: body
        name: body
        required: true
        schema:
          required: [email, password]
          properties:
            email:    {type: string}
            password: {type: string}
    responses:
      200: {description: Connexion réussie}
      401: {description: Identifiants incorrects}
    """
    data     = request.get_json(silent=True) or {}
    email    = (data.get('email') or '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify(error='Email ou mot de passe incorrect.'), 401
    if not user.is_active:
        return jsonify(error='Votre compte a été désactivé.'), 403

    access_token  = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify(
        message='Connexion réussie.',
        user=user.to_dict(),
        profile=user.profile.to_dict() if user.profile else None,
        access_token=access_token,
        refresh_token=refresh_token,
    )


# ── POST /api/auth/refresh ────────────────────────────────────────────────────
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Obtenir un nouveau access token via le refresh token.
    ---
    tags: [Authentification]
    responses:
      200: {description: Nouveau token}
    """
    identity = get_jwt_identity()
    return jsonify(access_token=create_access_token(identity=identity))


# ── GET /api/auth/me ──────────────────────────────────────────────────────────
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """
    Récupérer les infos de l'utilisateur connecté.
    ---
    tags: [Authentification]
    security: [{Bearer: []}]
    responses:
      200: {description: Données utilisateur}
    """
    user_id = int(get_jwt_identity())
    user    = db.get_or_404(User, user_id)
    return jsonify(
        user=user.to_dict(),
        profile=user.profile.to_dict() if user.profile else None,
    )


# ── POST /api/auth/logout ─────────────────────────────────────────────────────
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Déconnexion (côté client, supprimer le token).
    ---
    tags: [Authentification]
    security: [{Bearer: []}]
    responses:
      200: {description: Déconnexion réussie}
    """
    # Avec JWT stateless, la déconnexion se fait côté client.
    # Une blocklist Redis peut être ajoutée en V2.
    return jsonify(message='Déconnexion réussie.')


# ── POST /api/auth/forgot-password ───────────────────────────────────────────
@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Demande de réinitialisation de mot de passe.
    ---
    tags: [Authentification]
    parameters:
      - in: body
        name: body
        schema:
          required: [email]
          properties:
            email: {type: string}
    responses:
      200: {description: Email envoyé si le compte existe}
    """
    data  = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    # Réponse toujours identique pour éviter l'énumération des emails
    user = User.query.filter_by(email=email).first()
    if user:
        # TODO V2 : générer token + envoyer mail via Flask-Mail
        pass
    return jsonify(message='Si un compte existe avec cet email, un lien a été envoyé.')


# ── POST /api/auth/reset-password ────────────────────────────────────────────
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Réinitialisation du mot de passe via token.
    ---
    tags: [Authentification]
    parameters:
      - in: body
        name: body
        schema:
          required: [token, password]
          properties:
            token:    {type: string}
            password: {type: string}
    responses:
      200: {description: Mot de passe mis à jour}
      400: {description: Token invalide ou expiré}
    """
    # TODO V2 : valider token signé (itsdangerous)
    return jsonify(message='Fonctionnalité disponible en V2.'), 501
