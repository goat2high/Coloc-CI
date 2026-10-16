"""Routes favoris – /api/favorites/*"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from app import db
from app.models.favorite import Favorite
from app.models.listing import Listing

favorites_bp = Blueprint('favorites', __name__)


# ── GET /api/favorites ────────────────────────────────────────────────────────
@favorites_bp.route('', methods=['GET'])
@jwt_required()
def get_favorites():
    """
    Liste des annonces favorites de l'utilisateur connecté.
    ---
    tags: [Favoris]
    security: [{Bearer: []}]
    responses:
      200: {description: Liste des favoris}
    """
    user_id   = int(get_jwt_identity())
    favorites = Favorite.query.filter_by(user_id=user_id).order_by(Favorite.created_at.desc()).all()
    return jsonify(favorites=[f.to_dict() for f in favorites])


# ── POST /api/favorites/<listing_id> ─────────────────────────────────────────
@favorites_bp.route('/<int:listing_id>', methods=['POST'])
@jwt_required()
def add_favorite(listing_id: int):
    """
    Ajouter une annonce aux favoris.
    ---
    tags: [Favoris]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: listing_id, type: integer, required: true}
    responses:
      201: {description: Ajouté aux favoris}
      409: {description: Déjà en favoris}
      404: {description: Annonce introuvable}
    """
    user_id = int(get_jwt_identity())
    listing = db.get_or_404(Listing, listing_id)

    fav = Favorite(user_id=user_id, listing_id=listing_id)
    db.session.add(fav)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify(error='Cette annonce est déjà dans vos favoris.'), 409

    return jsonify(message='Annonce ajoutée aux favoris.', favorite=fav.to_dict()), 201


# ── DELETE /api/favorites/<listing_id> ───────────────────────────────────────
@favorites_bp.route('/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(listing_id: int):
    """
    Retirer une annonce des favoris.
    ---
    tags: [Favoris]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: listing_id, type: integer, required: true}
    responses:
      200: {description: Retiré des favoris}
      404: {description: Favori introuvable}
    """
    user_id = int(get_jwt_identity())
    fav = Favorite.query.filter_by(user_id=user_id, listing_id=listing_id).first_or_404()
    db.session.delete(fav)
    db.session.commit()
    return jsonify(message='Annonce retirée des favoris.')
