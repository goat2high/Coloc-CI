"""Routes annonces – /api/listings/*"""
import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from werkzeug.utils import secure_filename
from app import db
from app.models.listing import Listing, Photo

listings_bp = Blueprint('listings', __name__)

ALLOWED = {'png', 'jpg', 'jpeg', 'webp'}


def _allowed(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED


def _current_user_id() -> int | None:
    try:
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        return int(uid) if uid else None
    except Exception:
        return None


# ── GET /api/listings ─────────────────────────────────────────────────────────
@listings_bp.route('', methods=['GET'])
def get_listings():
    """
    Liste des annonces avec filtres.
    ---
    tags: [Annonces]
    parameters:
      - {in: query, name: city,           type: string}
      - {in: query, name: neighborhood,   type: string}
      - {in: query, name: min_budget,     type: integer}
      - {in: query, name: max_budget,     type: integer}
      - {in: query, name: room_type,      type: string, enum: [Privée, Partagée]}
      - {in: query, name: bathroom_type,  type: string, enum: [Privée, Partagée]}
      - {in: query, name: furnished,      type: boolean}
      - {in: query, name: wifi,           type: boolean}
      - {in: query, name: available_from, type: string, format: date}
      - {in: query, name: page,           type: integer, default: 1}
      - {in: query, name: per_page,       type: integer, default: 20}
    responses:
      200: {description: Liste paginée d'annonces}
    """
    q = Listing.query.filter_by(status='active')

    city          = request.args.get('city')
    neighborhood  = request.args.get('neighborhood')
    min_budget    = request.args.get('min_budget', type=int)
    max_budget    = request.args.get('max_budget', type=int)
    room_type     = request.args.get('room_type')
    bathroom_type = request.args.get('bathroom_type')
    furnished     = request.args.get('furnished')
    wifi          = request.args.get('wifi')

    if city:
        q = q.filter(Listing.city.ilike(f'%{city}%'))
    if neighborhood:
        q = q.filter(Listing.neighborhood.ilike(f'%{neighborhood}%'))
    if min_budget:
        q = q.filter(Listing.rent >= min_budget)
    if max_budget:
        q = q.filter(Listing.rent <= max_budget)
    if room_type:
        q = q.filter(Listing.room_type == room_type)
    if bathroom_type:
        q = q.filter(Listing.bathroom_type == bathroom_type)
    if furnished:
        q = q.filter(Listing.furnished == (furnished.lower() == 'true'))
    if wifi:
        q = q.filter(Listing.wifi == (wifi.lower() == 'true'))

    q = q.order_by(Listing.created_at.desc())

    page     = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 50)
    paginated = q.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        listings=[l.to_dict() for l in paginated.items],
        total=paginated.total,
        page=paginated.page,
        pages=paginated.pages,
        per_page=per_page,
    )


# ── GET /api/listings/my ─────────────────────────────────────────────────────
@listings_bp.route('/my', methods=['GET'])
@jwt_required()
def my_listings():
    """
    Voir ses propres annonces.
    ---
    tags: [Annonces]
    security: [{Bearer: []}]
    responses:
      200: {description: Annonces de l'utilisateur connecté}
    """
    user_id  = int(get_jwt_identity())
    listings = Listing.query.filter_by(user_id=user_id).order_by(Listing.created_at.desc()).all()
    return jsonify(listings=[l.to_dict() for l in listings])


# ── GET /api/listings/<id> ────────────────────────────────────────────────────
@listings_bp.route('/<int:listing_id>', methods=['GET'])
def get_listing(listing_id: int):
    """
    Détail d'une annonce.
    ---
    tags: [Annonces]
    parameters:
      - {in: path, name: listing_id, type: integer, required: true}
    responses:
      200: {description: Détail de l'annonce}
      404: {description: Annonce introuvable}
    """
    listing = db.get_or_404(Listing, listing_id)
    return jsonify(listing=listing.to_dict())


# ── POST /api/listings ────────────────────────────────────────────────────────
@listings_bp.route('', methods=['POST'])
@jwt_required()
def create_listing():
    """
    Créer une annonce.
    ---
    tags: [Annonces]
    security: [{Bearer: []}]
    parameters:
      - in: body
        name: body
        required: true
        schema:
          required: [title, city, neighborhood, rent, available_rooms, room_type]
          properties:
            title:           {type: string}
            description:     {type: string}
            city:            {type: string}
            neighborhood:    {type: string}
            rent:            {type: integer}
            charges:         {type: integer}
            available_rooms: {type: integer}
            room_type:       {type: string, enum: [Privée, Partagée]}
            bathroom_type:   {type: string, enum: [Privée, Partagée]}
            furnished:       {type: boolean}
            wifi:            {type: boolean}
            lifestyle:       {type: string, enum: [Calme, Social, Mixte]}
            smoker:          {type: boolean}
            pets:            {type: boolean}
    responses:
      201: {description: Annonce créée}
      400: {description: Données manquantes}
    """
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    required = ['title', 'city', 'neighborhood', 'rent', 'available_rooms', 'room_type']
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify(error=f"Champs requis manquants : {', '.join(missing)}"), 400

    listing = Listing(
        user_id         = user_id,
        title           = data['title'].strip(),
        description     = data.get('description', '').strip() or None,
        city            = data['city'].strip(),
        neighborhood    = data['neighborhood'].strip(),
        address         = data.get('address'),
        rent            = int(data['rent']),
        charges         = int(data.get('charges', 0)),
        total_rooms     = data.get('total_rooms'),
        available_rooms = int(data['available_rooms']),
        room_type       = data['room_type'],
        bathroom_type   = data.get('bathroom_type'),
        furnished       = bool(data.get('furnished', False)),
        wifi            = bool(data.get('wifi', False)),
        lifestyle       = data.get('lifestyle'),
        smoker          = bool(data.get('smoker', False)),
        pets            = bool(data.get('pets', False)),
        rules           = data.get('rules'),
    )
    db.session.add(listing)
    db.session.commit()
    return jsonify(message='Annonce créée.', listing=listing.to_dict()), 201


# ── PUT /api/listings/<id> ────────────────────────────────────────────────────
@listings_bp.route('/<int:listing_id>', methods=['PUT'])
@jwt_required()
def update_listing(listing_id: int):
    """
    Modifier une annonce (propriétaire uniquement).
    ---
    tags: [Annonces]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: listing_id, type: integer, required: true}
    responses:
      200: {description: Annonce mise à jour}
      403: {description: Non autorisé}
    """
    user_id = int(get_jwt_identity())
    listing = db.get_or_404(Listing, listing_id)
    if listing.user_id != user_id:
        return jsonify(error='Non autorisé.'), 403

    data = request.get_json(silent=True) or {}
    updatable = [
        'title', 'description', 'city', 'neighborhood', 'address',
        'rent', 'charges', 'total_rooms', 'available_rooms', 'room_type',
        'bathroom_type', 'furnished', 'wifi', 'lifestyle', 'smoker',
        'pets', 'rules', 'status',
    ]
    for field in updatable:
        if field in data:
            setattr(listing, field, data[field])

    db.session.commit()
    return jsonify(message='Annonce mise à jour.', listing=listing.to_dict())


# ── DELETE /api/listings/<id> ─────────────────────────────────────────────────
@listings_bp.route('/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def delete_listing(listing_id: int):
    """
    Supprimer une annonce (propriétaire uniquement).
    ---
    tags: [Annonces]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: listing_id, type: integer, required: true}
    responses:
      200: {description: Annonce supprimée}
      403: {description: Non autorisé}
    """
    user_id = int(get_jwt_identity())
    listing = db.get_or_404(Listing, listing_id)
    if listing.user_id != user_id:
        return jsonify(error='Non autorisé.'), 403

    db.session.delete(listing)
    db.session.commit()
    return jsonify(message='Annonce supprimée.')


# ── POST /api/listings/<id>/photos ────────────────────────────────────────────
@listings_bp.route('/<int:listing_id>/photos', methods=['POST'])
@jwt_required()
def upload_photos(listing_id: int):
    """
    Ajouter des photos à une annonce.
    ---
    tags: [Annonces]
    security: [{Bearer: []}]
    consumes: [multipart/form-data]
    parameters:
      - {in: path,          name: listing_id, type: integer, required: true}
      - {in: formData,      name: photos,     type: file,    required: true}
    responses:
      201: {description: Photos ajoutées}
      403: {description: Non autorisé}
    """
    user_id = int(get_jwt_identity())
    listing = db.get_or_404(Listing, listing_id)
    if listing.user_id != user_id:
        return jsonify(error='Non autorisé.'), 403

    files  = request.files.getlist('photos')
    saved  = []
    folder = current_app.config['UPLOAD_FOLDER']

    for file in files:
        if file and _allowed(file.filename):
            ext      = file.filename.rsplit('.', 1)[1].lower()
            filename = f"{uuid.uuid4().hex}.{ext}"
            file.save(os.path.join(folder, filename))
            is_main = len(listing.photos) == 0 and len(saved) == 0
            photo   = Photo(listing_id=listing_id, filename=filename, is_main=is_main)
            db.session.add(photo)
            saved.append(filename)

    db.session.commit()
    return jsonify(message=f'{len(saved)} photo(s) ajoutée(s).', photos=saved), 201


# ── DELETE /api/photos/<photo_id> ─────────────────────────────────────────────
@listings_bp.route('/photos/<int:photo_id>', methods=['DELETE'])
@jwt_required()
def delete_photo(photo_id: int):
    """
    Supprimer une photo.
    ---
    tags: [Annonces]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: photo_id, type: integer, required: true}
    responses:
      200: {description: Photo supprimée}
    """
    user_id = int(get_jwt_identity())
    photo   = db.get_or_404(Photo, photo_id)
    if photo.listing.user_id != user_id:
        return jsonify(error='Non autorisé.'), 403

    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], photo.filename)
    if os.path.exists(filepath):
        os.remove(filepath)

    db.session.delete(photo)
    db.session.commit()
    return jsonify(message='Photo supprimée.')


# ── PUT /api/photos/<photo_id>/main ──────────────────────────────────────────
@listings_bp.route('/photos/<int:photo_id>/main', methods=['PUT'])
@jwt_required()
def set_main_photo(photo_id: int):
    """
    Définir une photo comme photo principale.
    ---
    tags: [Annonces]
    security: [{Bearer: []}]
    parameters:
      - {in: path, name: photo_id, type: integer, required: true}
    responses:
      200: {description: Photo principale définie}
    """
    user_id = int(get_jwt_identity())
    photo   = db.get_or_404(Photo, photo_id)
    if photo.listing.user_id != user_id:
        return jsonify(error='Non autorisé.'), 403

    Photo.query.filter_by(listing_id=photo.listing_id).update({'is_main': False})
    photo.is_main = True
    db.session.commit()
    return jsonify(message='Photo principale définie.')
