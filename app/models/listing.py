from datetime import datetime, timezone
from app import db


class Listing(db.Model):
    """Annonce de colocation."""
    __tablename__ = 'listings'

    id              = db.Column(db.Integer, primary_key=True)
    user_id         = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title           = db.Column(db.String(150), nullable=False)
    description     = db.Column(db.Text)
    city            = db.Column(db.String(100), nullable=False, index=True)
    neighborhood    = db.Column(db.String(100), nullable=False, index=True)
    address         = db.Column(db.String(255))
    rent            = db.Column(db.Integer, nullable=False, index=True)
    charges         = db.Column(db.Integer, default=0)
    total_rooms     = db.Column(db.Integer)
    available_rooms = db.Column(db.Integer, nullable=False)
    room_type       = db.Column(db.Enum('Privée', 'Partagée'), nullable=False)
    bathroom_type   = db.Column(db.Enum('Privée', 'Partagée'))
    furnished       = db.Column(db.Boolean, default=False)
    wifi            = db.Column(db.Boolean, default=False)
    lifestyle       = db.Column(db.Enum('Calme', 'Social', 'Mixte'))
    smoker          = db.Column(db.Boolean, default=False)
    pets            = db.Column(db.Boolean, default=False)
    available_from  = db.Column(db.Date)
    rules           = db.Column(db.Text)
    status          = db.Column(db.Enum('active', 'inactive', 'rented'), default='active')
    created_at      = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at      = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relations
    owner    = db.relationship('User', back_populates='listings')
    photos   = db.relationship('Photo', back_populates='listing',
                               cascade='all, delete-orphan', order_by='Photo.is_main.desc()')
    messages = db.relationship('Message', back_populates='listing',
                               cascade='all, delete-orphan')
    favorites = db.relationship('Favorite', back_populates='listing',
                                cascade='all, delete-orphan')
    reports  = db.relationship('Report', back_populates='listing',
                               cascade='all, delete-orphan')

    def to_dict(self, include_owner: bool = True) -> dict:
        main_photo = next((p for p in self.photos if p.is_main), None)
        if not main_photo and self.photos:
            main_photo = self.photos[0]

        data = {
            'id':              self.id,
            'user_id':         self.user_id,
            'title':           self.title,
            'description':     self.description,
            'city':            self.city,
            'neighborhood':    self.neighborhood,
            'address':         self.address,
            'rent':            self.rent,
            'charges':         self.charges,
            'total_rooms':     self.total_rooms,
            'available_rooms': self.available_rooms,
            'room_type':       self.room_type,
            'bathroom_type':   self.bathroom_type,
            'furnished':       self.furnished,
            'wifi':            self.wifi,
            'lifestyle':       self.lifestyle,
            'smoker':          self.smoker,
            'pets':            self.pets,
            'available_from':  self.available_from.isoformat() if self.available_from else None,
            'rules':           self.rules,
            'status':          self.status,
            'main_photo':      main_photo.filename if main_photo else None,
            'photos':          [p.to_dict() for p in self.photos],
            'created_at':      self.created_at.isoformat() if self.created_at else None,
        }
        if include_owner and self.owner and self.owner.profile:
            p = self.owner.profile
            data['owner'] = {
                'id':         self.owner.id,
                'first_name': p.first_name,
                'last_name':  p.last_name,
                'age':        p.age,
                'avatar':     p.avatar,
            }
        return data

    def to_matching_dict(self) -> dict:
        """Dictionnaire pour le moteur de matching."""
        return {
            'loyer':        self.rent,
            'charges':      self.charges or 0,
            'ville':        self.city,
            'quartier':     self.neighborhood,
            'mode_vie':     self.lifestyle,
            'fumeur':       self.smoker,
            'animaux':      self.pets,
            'type_chambre': self.room_type,
        }

    def __repr__(self):
        return f'<Listing {self.id}: {self.title}>'


class Photo(db.Model):
    """Photo associée à une annonce."""
    __tablename__ = 'photos'

    id         = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=False)
    filename   = db.Column(db.String(255), nullable=False)
    is_main    = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    listing = db.relationship('Listing', back_populates='photos')

    def to_dict(self) -> dict:
        return {
            'id':         self.id,
            'listing_id': self.listing_id,
            'filename':   self.filename,
            'is_main':    self.is_main,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Photo {self.filename}>'
