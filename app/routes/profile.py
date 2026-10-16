"""Routes profil utilisateur – /api/profile/*"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User, Profile

profile_bp = Blueprint('profile', __name__)

_ALLOWED_FIELDS = {
    'first_name', 'last_name', 'age', 'gender', 'status',
    'city', 'neighborhood', 'budget_min', 'budget_max',
    'lifestyle', 'smoker', 'pets', 'cleanliness', 'bio', 'phone',
}


# ── GET /api/profile ──────────────────────────────────────────────────────────
@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_my_profile():
    """
    Voir son propre profil.
    ---
    tags: [Profil]
    security: [{Bearer: []}]
    responses:
      200: {description: Profil de l'utilisateur connecté}
    """
    user_id = int(get_jwt_identity())
    user    = db.get_or_404(User, user_id)
    return jsonify(
        user=user.to_dict(),
        profile=user.profile.to_dict() if user.profile else None,
    )


# ── PUT /api/profile ──────────────────────────────────────────────────────────
@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    Modifier son propre profil.
    ---
    tags: [Profil]
    security: [{Bearer: []}]
    parameters:
      - in: body
        name: body
        schema:
          properties:
            first_name:   {type: string}
            last_name:    {type: string}
            age:          {type: integer}
            gender:       {type: string, enum: [Homme, Femme, Autre]}
            status:       {type: string, enum: [Étudiant, Travailleur]}
            city:         {type: string}
            neighborhood: {type: string}
            budget_min:   {type: integer}
            budget_max:   {type: integer}
            lifestyle:    {type: string, enum: [Calme, Social, Mixte]}
            smoker:       {type: boolean}
            pets:         {type: boolean}
            cleanliness:  {type: integer, minimum: 1, maximum: 5}
            bio:          {type: string}
            phone:        {type: string}
    responses:
      200: {description: Profil mis à jour}
    """
    user_id = int(get_jwt_identity())
    user    = db.get_or_404(User, user_id)
    data    = request.get_json(silent=True) or {}

    if not user.profile:
        user.profile = Profile(user_id=user_id, first_name='Utilisateur')

    profile = user.profile
    for field in _ALLOWED_FIELDS:
        if field in data:
            setattr(profile, field, data[field])

    # Validation propreté
    if profile.cleanliness is not None:
        profile.cleanliness = max(1, min(5, int(profile.cleanliness)))

    db.session.commit()
    return jsonify(message='Profil mis à jour.', profile=profile.to_dict())


# ── GET /api/profile/<user_id> ────────────────────────────────────────────────
@profile_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_public_profile(user_id: int):
    """
    Voir le profil public d'un autre utilisateur.
    ---
    tags: [Profil]
    security: [{Bearer: []}]
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200: {description: Profil public}
      404: {description: Utilisateur introuvable}
    """
    user = db.get_or_404(User, user_id)
    if not user.is_active:
        return jsonify(error='Utilisateur introuvable.'), 404
    return jsonify(
        user=user.to_dict(public=True),
        profile=user.profile.to_dict() if user.profile else None,
    )
