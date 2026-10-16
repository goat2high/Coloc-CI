"""Routes matching – /api/match/*"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.listing import Listing
from app.services.matching import calculer_compatibilite, label_compatibilite

matching_bp = Blueprint('matching', __name__)


def _get_chercheur(user_id: int) -> dict | None:
    user = db.session.get(User, user_id)
    if not user or not user.profile:
        return None
    return user.profile.to_matching_dict()


# ── GET /api/match ─────────────────────────────────────────────────────────
@matching_bp.route('', methods=['GET'])
@jwt_required()
def match_all():
    """
    Recherche d'annonces avec score de compatibilité (triées par score).
    ---
    tags: [Matching]
    security: [{Bearer: []}]
    parameters:
      - {in: query, name: city,         type: string}
      - {in: query, name: neighborhood, type: string}
      - {in: query, name: min_score,    type: integer, default: 0}
      - {in: query, name: page,         type: integer, default: 1}
      - {in: query, name: per_page,     type: integer, default: 20}
    responses:
      200: {description: Liste d'annonces triées par compatibilité}
      400: {description: Profil incomplet}
    """
    user_id   = int(get_jwt_identity())
    chercheur = _get_chercheur(user_id)
    if not chercheur:
        return jsonify(error='Profil incomplet. Veuillez renseigner votre profil avant de chercher.'), 400

    q = Listing.query.filter(
        Listing.status == 'active',
        Listing.user_id != user_id,
    )

    city = request.args.get('city')
    neighborhood = request.args.get('neighborhood')
    if city:
        q = q.filter(Listing.city.ilike(f'%{city}%'))
    if neighborhood:
        q = q.filter(Listing.neighborhood.ilike(f'%{neighborhood}%'))

    # Cap at 500 rows fetched from DB before in-memory scoring to prevent OOM.
    # A proper V2 improvement would pre-filter by budget range at the DB level.
    listings  = q.limit(500).all()
    min_score = request.args.get('min_score', 0, type=int)

    results = []
    for listing in listings:
        score, details = calculer_compatibilite(chercheur, listing.to_matching_dict())
        if score >= min_score:
            data = listing.to_dict()
            data['compatibility_score']  = score
            data['compatibility_label']  = label_compatibilite(score)
            data['score_details']        = details
            results.append(data)

    results.sort(key=lambda x: x['compatibility_score'], reverse=True)

    # Pagination manuelle
    page     = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 50)
    start    = (page - 1) * per_page
    total    = len(results)
    paged    = results[start:start + per_page]

    return jsonify(
        listings=paged,
        total=total,
        page=page,
        pages=-(-total // per_page),
        per_page=per_page,
    )


# ── GET /api/match/<listing_id> ────────────────────────────────────────────
@matching_bp.route('/<int:listing_id>', methods=['GET'])
@jwt_required()
def match_one(listing_id: int):
    """
    Score de compatibilité pour une annonce précise.
    ---
    tags: [Matching]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: listing_id, type: integer, required: true}
    responses:
      200: {description: Score de compatibilité détaillé}
      400: {description: Profil incomplet}
      404: {description: Annonce introuvable}
    """
    user_id   = int(get_jwt_identity())
    chercheur = _get_chercheur(user_id)
    if not chercheur:
        return jsonify(error='Profil incomplet.'), 400

    listing = db.get_or_404(Listing, listing_id)
    score, details = calculer_compatibilite(chercheur, listing.to_matching_dict())

    return jsonify(
        listing_id          = listing_id,
        compatibility_score = score,
        compatibility_label = label_compatibilite(score),
        score_details       = details,
        listing             = listing.to_dict(),
    )
