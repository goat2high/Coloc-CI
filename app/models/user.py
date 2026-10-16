from datetime import datetime, timezone
from app import db, bcrypt


class User(db.Model):
    """Utilisateur de la plateforme ColocCI."""
    __tablename__ = 'users'

    id            = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role          = db.Column(db.Enum('user', 'admin'), default='user', nullable=False)
    is_verified   = db.Column(db.Boolean, default=False)
    is_active     = db.Column(db.Boolean, default=True)
    created_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relations
    profile       = db.relationship('Profile', back_populates='user', uselist=False,
                                    cascade='all, delete-orphan')
    listings      = db.relationship('Listing', back_populates='owner',
                                    cascade='all, delete-orphan')
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id',
                                    back_populates='sender', cascade='all, delete-orphan')
    recv_messages = db.relationship('Message', foreign_keys='Message.receiver_id',
                                    back_populates='receiver')
    favorites     = db.relationship('Favorite', back_populates='user',
                                    cascade='all, delete-orphan')
    reports_made  = db.relationship('Report', foreign_keys='Report.reporter_id',
                                    back_populates='reporter', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', back_populates='user',
                                    cascade='all, delete-orphan')

    # ── Mot de passe ──────────────────────────────────────────────────────
    def set_password(self, plain: str):
        self.password_hash = bcrypt.generate_password_hash(plain).decode('utf-8')

    def check_password(self, plain: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, plain)

    def to_dict(self, public: bool = False) -> dict:
        base = {
            'id':         self.id,
            'email':      self.email,
            'role':       self.role,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if public:
            base.pop('email', None)
        return base

    def __repr__(self):
        return f'<User {self.email}>'


class Profile(db.Model):
    """Profil étendu d'un utilisateur."""
    __tablename__ = 'profiles'

    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    first_name   = db.Column(db.String(50), nullable=False)
    last_name    = db.Column(db.String(50))
    age          = db.Column(db.Integer)
    gender       = db.Column(db.Enum('Homme', 'Femme', 'Autre'))
    status       = db.Column(db.Enum('Étudiant', 'Travailleur'))
    city         = db.Column(db.String(100))
    neighborhood = db.Column(db.String(100))
    budget_min   = db.Column(db.Integer)
    budget_max   = db.Column(db.Integer)
    lifestyle    = db.Column(db.Enum('Calme', 'Social', 'Mixte'))
    smoker       = db.Column(db.Boolean, default=False)
    pets         = db.Column(db.Boolean, default=False)
    cleanliness  = db.Column(db.Integer)   # 1 à 5
    bio          = db.Column(db.Text)
    phone        = db.Column(db.String(20))
    avatar       = db.Column(db.String(255))
    created_at   = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at   = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='profile')

    def to_dict(self) -> dict:
        return {
            'id':           self.id,
            'user_id':      self.user_id,
            'first_name':   self.first_name,
            'last_name':    self.last_name,
            'age':          self.age,
            'gender':       self.gender,
            'status':       self.status,
            'city':         self.city,
            'neighborhood': self.neighborhood,
            'budget_min':   self.budget_min,
            'budget_max':   self.budget_max,
            'lifestyle':    self.lifestyle,
            'smoker':       self.smoker,
            'pets':         self.pets,
            'cleanliness':  self.cleanliness,
            'bio':          self.bio,
            'phone':        self.phone,
            'avatar':       self.avatar,
            'created_at':   self.created_at.isoformat() if self.created_at else None,
        }

    def to_matching_dict(self) -> dict:
        """Dictionnaire minimal pour le moteur de matching."""
        return {
            'budget_max':   self.budget_max or 0,
            'ville':        self.city,
            'quartier':     self.neighborhood,
            'mode_vie':     self.lifestyle,
            'fumeur':       self.smoker,
            'animaux':      self.pets,
        }

    def __repr__(self):
        return f'<Profile {self.first_name} {self.last_name}>'
