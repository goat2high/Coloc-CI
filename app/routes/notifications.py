"""Routes notifications – /api/notifications/*"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.notification import Notification


notifications_bp = Blueprint('notifications', __name__)


# ── GET /api/notifications ────────────────────────────────────────────────────
@notifications_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    """
    Liste des notifications de l'utilisateur connecté.
    ---
    tags: [Notifications]
    security: [{Bearer: []}]
    responses:
      200: {description: Liste des notifications}
    """
    user_id = int(get_jwt_identity())
    notifs  = (
        Notification.query
        .filter_by(user_id=user_id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )
    unread = sum(1 for n in notifs if not n.is_read)
    return jsonify(notifications=[n.to_dict() for n in notifs], unread_count=unread)


# ── PUT /api/notifications/read-all ──────────────────────────────────────────
# NOTE: This route MUST be declared before /<int:notif_id>/read so Flask does
# not try to cast the literal "read-all" as an integer and return a 404.
@notifications_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_read():
    """
    Marquer toutes les notifications comme lues.
    ---
    tags: [Notifications]
    security: [{Bearer: []}]
    responses:
      200: {description: Toutes les notifications marquées comme lues}
    """
    user_id = int(get_jwt_identity())
    Notification.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    return jsonify(message='Toutes les notifications ont été lues.')


# ── PUT /api/notifications/<id>/read ─────────────────────────────────────────
@notifications_bp.route('/<int:notif_id>/read', methods=['PUT'])
@jwt_required()
def mark_read(notif_id: int):
    """
    Marquer une notification comme lue.
    ---
    tags: [Notifications]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: notif_id, type: integer, required: true}
    responses:
      200: {description: Notification marquée comme lue}
    """
    user_id = int(get_jwt_identity())
    notif   = db.get_or_404(Notification, notif_id)
    if notif.user_id != user_id:
        return jsonify(error='Non autorisé.'), 403
    notif.is_read = True
    db.session.commit()
    return jsonify(message='Notification marquée comme lue.')
