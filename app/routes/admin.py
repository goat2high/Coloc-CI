"""Routes administration – /api/admin/* (rôle admin requis)"""
from functools import wraps
from flask import Blueprint, request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app import db
from app.models.user import User
from app.models.listing import Listing
from app.models.report import Report

admin_bp = Blueprint('admin', __name__)


def admin_required(fn):
    """Décorateur : vérifie que l'utilisateur est authentifié et admin.

    Uses verify_jwt_in_request() directly rather than stacking @jwt_required()
    inside the wrapper, which would re-decorate the inner function on every
    invocation and produce unpredictable behaviour.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = int(get_jwt_identity())
        user    = db.session.get(User, user_id)
        if not user or user.role != 'admin':
            return jsonify(error='Accès réservé aux administrateurs.'), 403
        return fn(*args, **kwargs)
    return wrapper


# ── GET /api/admin/users ──────────────────────────────────────────────────────
@admin_bp.route('/users', methods=['GET'])
@admin_required
def list_users():
    """
    Liste de tous les utilisateurs.
    ---
    tags: [Administration]
    security: [{Bearer: []}]
    parameters:
      - {in: query, name: page,     type: integer, default: 1}
      - {in: query, name: per_page, type: integer, default: 30}
      - {in: query, name: search,   type: string}
    responses:
      200: {description: Liste paginée des utilisateurs}
    """
    page     = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 30, type=int), 100)
    search   = request.args.get('search', '')

    q = User.query
    if search:
        q = q.filter(User.email.ilike(f'%{search}%'))
    paginated = q.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        users=[{
            **u.to_dict(),
            'profile': u.profile.to_dict() if u.profile else None,
            'listings_count': len(u.listings),
        } for u in paginated.items],
        total=paginated.total,
        page=paginated.page,
        pages=paginated.pages,
    )


# ── PUT /api/admin/users/<id>/status ─────────────────────────────────────────
@admin_bp.route('/users/<int:user_id>/status', methods=['PUT'])
@admin_required
def toggle_user_status(user_id: int):
    """
    Activer / désactiver un utilisateur.
    ---
    tags: [Administration]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: user_id, type: integer, required: true}
      - in: body
        name: body
        schema:
          properties:
            is_active: {type: boolean}
    responses:
      200: {description: Statut mis à jour}
    """
    user = db.get_or_404(User, user_id)
    data = request.get_json(silent=True) or {}
    user.is_active = bool(data.get('is_active', not user.is_active))
    db.session.commit()
    status_label = 'activé' if user.is_active else 'désactivé'
    return jsonify(message=f'Utilisateur {status_label}.', user=user.to_dict())


# ── GET /api/admin/listings ───────────────────────────────────────────────────
@admin_bp.route('/listings', methods=['GET'])
@admin_required
def list_all_listings():
    """
    Liste de toutes les annonces (tous statuts).
    ---
    tags: [Administration]
    security: [{Bearer: []}]
    parameters:
      - {in: query, name: page,     type: integer, default: 1}
      - {in: query, name: per_page, type: integer, default: 30}
      - {in: query, name: status,   type: string, enum: [active, inactive, rented]}
    responses:
      200: {description: Liste paginée des annonces}
    """
    page     = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 30, type=int), 100)
    status   = request.args.get('status')

    q = Listing.query
    if status:
        q = q.filter_by(status=status)
    paginated = q.order_by(Listing.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        listings=[l.to_dict() for l in paginated.items],
        total=paginated.total,
        page=paginated.page,
        pages=paginated.pages,
    )


# ── PUT /api/admin/listings/<id>/status ──────────────────────────────────────
@admin_bp.route('/listings/<int:listing_id>/status', methods=['PUT'])
@admin_required
def update_listing_status(listing_id: int):
    """
    Changer le statut d'une annonce.
    ---
    tags: [Administration]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: listing_id, type: integer, required: true}
      - in: body
        name: body
        schema:
          required: [status]
          properties:
            status: {type: string, enum: [active, inactive, rented]}
    responses:
      200: {description: Statut mis à jour}
    """
    listing = db.get_or_404(Listing, listing_id)
    data    = request.get_json(silent=True) or {}
    new_status = data.get('status')
    if new_status not in ('active', 'inactive', 'rented'):
        return jsonify(error='Statut invalide.'), 400
    listing.status = new_status
    db.session.commit()
    return jsonify(message=f'Annonce marquée comme {new_status}.', listing=listing.to_dict())


# ── GET /api/admin/reports ────────────────────────────────────────────────────
@admin_bp.route('/reports', methods=['GET'])
@admin_required
def list_reports():
    """
    Liste des signalements.
    ---
    tags: [Administration]
    security: [{Bearer: []}]
    parameters:
      - {in: query, name: status, type: string, enum: [pending, reviewed, resolved]}
      - {in: query, name: page,   type: integer, default: 1}
    responses:
      200: {description: Liste des signalements}
    """
    page     = request.args.get('page', 1, type=int)
    per_page = 30
    status   = request.args.get('status', 'pending')

    q = Report.query.filter_by(status=status).order_by(Report.created_at.desc())
    paginated = q.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        reports=[r.to_dict() for r in paginated.items],
        total=paginated.total,
        page=paginated.page,
        pages=paginated.pages,
    )


# ── PUT /api/admin/reports/<id> ───────────────────────────────────────────────
@admin_bp.route('/reports/<int:report_id>', methods=['PUT'])
@admin_required
def handle_report(report_id: int):
    """
    Traiter un signalement.
    ---
    tags: [Administration]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: report_id, type: integer, required: true}
      - in: body
        name: body
        schema:
          required: [status]
          properties:
            status: {type: string, enum: [reviewed, resolved]}
    responses:
      200: {description: Signalement traité}
    """
    report = db.get_or_404(Report, report_id)
    data   = request.get_json(silent=True) or {}
    new_status = data.get('status')
    if new_status not in ('reviewed', 'resolved'):
        return jsonify(error='Statut invalide. Utilisez reviewed ou resolved.'), 400
    report.status = new_status
    db.session.commit()
    return jsonify(message=f'Signalement marqué comme {new_status}.', report=report.to_dict())
