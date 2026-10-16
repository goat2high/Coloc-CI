"""Routes signalements – /api/reports/*"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.report import Report

reports_bp = Blueprint('reports', __name__)


# ── POST /api/reports ─────────────────────────────────────────────────────────
@reports_bp.route('', methods=['POST'])
@jwt_required()
def create_report():
    """
    Signaler une annonce ou un utilisateur.
    ---
    tags: [Signalements]
    security: [{Bearer: []}]
    parameters:
      - in: body
        name: body
        required: true
        schema:
          required: [reason]
          properties:
            listing_id:       {type: integer, description: ID de l'annonce (si signalement d'annonce)}
            reported_user_id: {type: integer, description: ID de l'utilisateur (si signalement de profil)}
            reason:           {type: string}
    responses:
      201: {description: Signalement enregistré}
      400: {description: Données manquantes}
    """
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    reason           = (data.get('reason') or '').strip()
    listing_id       = data.get('listing_id')
    reported_user_id = data.get('reported_user_id')

    if not reason:
        return jsonify(error='Le motif du signalement est requis.'), 400
    if not listing_id and not reported_user_id:
        return jsonify(error='listing_id ou reported_user_id est requis.'), 400

    report = Report(
        reporter_id      = user_id,
        listing_id       = listing_id,
        reported_user_id = reported_user_id,
        reason           = reason,
    )
    db.session.add(report)
    db.session.commit()
    return jsonify(message='Signalement enregistré. Merci pour votre vigilance.', report=report.to_dict()), 201
