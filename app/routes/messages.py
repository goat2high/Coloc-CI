"""Routes messagerie – /api/messages/*"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from app import db
from app.models.message import Message
from app.models.user import User
from app.models.notification import Notification

messages_bp = Blueprint('messages', __name__)


# ── GET /api/messages ─────────────────────────────────────────────────────────
@messages_bp.route('', methods=['GET'])
@jwt_required()
def get_conversations():
    """
    Liste des conversations de l'utilisateur connecté.
    ---
    tags: [Messagerie]
    security: [{Bearer: []}]
    responses:
      200: {description: Liste des conversations avec dernier message}
    """
    user_id = int(get_jwt_identity())

    # Récupérer tous les interlocuteurs uniques
    sent     = db.session.query(Message.receiver_id).filter_by(sender_id=user_id)
    received = db.session.query(Message.sender_id).filter_by(receiver_id=user_id)
    partner_ids = {r[0] for r in sent.union(received).all()} - {user_id}

    conversations = []
    for pid in partner_ids:
        last_msg = (
            Message.query
            .filter(
                or_(
                    and_(Message.sender_id == user_id,   Message.receiver_id == pid),
                    and_(Message.sender_id == pid,       Message.receiver_id == user_id),
                )
            )
            .order_by(Message.created_at.desc())
            .first()
        )
        unread_count = (
            Message.query
            .filter_by(sender_id=pid, receiver_id=user_id, is_read=False)
            .count()
        )
        partner = db.session.get(User, pid)
        if partner and last_msg:
            conversations.append({
                'partner': {
                    'id':         partner.id,
                    'first_name': partner.profile.first_name if partner.profile else None,
                    'avatar':     partner.profile.avatar     if partner.profile else None,
                },
                'last_message':  last_msg.to_dict(),
                'unread_count':  unread_count,
            })

    conversations.sort(key=lambda c: c['last_message']['created_at'], reverse=True)
    return jsonify(conversations=conversations)


# ── GET /api/messages/<user_id> ──────────────────────────────────────────────
@messages_bp.route('/<int:partner_id>', methods=['GET'])
@jwt_required()
def get_conversation(partner_id: int):
    """
    Messages échangés avec un utilisateur donné.
    ---
    tags: [Messagerie]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: partner_id, type: integer, required: true}
    responses:
      200: {description: Liste de messages}
    """
    user_id = int(get_jwt_identity())

    messages = (
        Message.query
        .filter(
            or_(
                and_(Message.sender_id == user_id,    Message.receiver_id == partner_id),
                and_(Message.sender_id == partner_id, Message.receiver_id == user_id),
            )
        )
        .order_by(Message.created_at.asc())
        .all()
    )

    # Marquer les messages reçus comme lus
    for m in messages:
        if m.receiver_id == user_id and not m.is_read:
            m.is_read = True
    db.session.commit()

    return jsonify(messages=[m.to_dict() for m in messages])


# ── POST /api/messages ────────────────────────────────────────────────────────
@messages_bp.route('', methods=['POST'])
@jwt_required()
def send_message():
    """
    Envoyer un message.
    ---
    tags: [Messagerie]
    security: [{Bearer: []}]
    parameters:
      - in: body
        name: body
        required: true
        schema:
          required: [receiver_id, content]
          properties:
            receiver_id: {type: integer}
            content:     {type: string}
            listing_id:  {type: integer}
    responses:
      201: {description: Message envoyé}
      400: {description: Données manquantes}
      404: {description: Destinataire introuvable}
    """
    user_id     = int(get_jwt_identity())
    data        = request.get_json(silent=True) or {}
    receiver_id = data.get('receiver_id')
    content     = (data.get('content') or '').strip()
    listing_id  = data.get('listing_id')

    if not receiver_id or not content:
        return jsonify(error='receiver_id et content sont requis.'), 400
    if receiver_id == user_id:
        return jsonify(error='Vous ne pouvez pas vous envoyer un message à vous-même.'), 400

    receiver = db.session.get(User, receiver_id)
    if not receiver or not receiver.is_active:
        return jsonify(error='Destinataire introuvable.'), 404

    msg = Message(
        sender_id   = user_id,
        receiver_id = receiver_id,
        listing_id  = listing_id,
        content     = content,
    )
    db.session.add(msg)

    # Notification interne
    sender = db.session.get(User, user_id)
    notif  = Notification(
        user_id = receiver_id,
        type    = 'message',
        content = f'Nouveau message de {sender.profile.first_name if sender.profile else "quelqu\'un"}.',
        link    = f'/messages/{user_id}',
    )
    db.session.add(notif)
    db.session.commit()

    return jsonify(message='Message envoyé.', data=msg.to_dict()), 201


# ── PUT /api/messages/<id>/read ───────────────────────────────────────────────
@messages_bp.route('/<int:msg_id>/read', methods=['PUT'])
@jwt_required()
def mark_read(msg_id: int):
    """
    Marquer un message comme lu.
    ---
    tags: [Messagerie]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: msg_id, type: integer, required: true}
    responses:
      200: {description: Message marqué comme lu}
    """
    user_id = int(get_jwt_identity())
    msg     = db.get_or_404(Message, msg_id)
    if msg.receiver_id != user_id:
        return jsonify(error='Non autorisé.'), 403
    msg.is_read = True
    db.session.commit()
    return jsonify(message='Message marqué comme lu.')
