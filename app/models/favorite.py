from datetime import datetime, timezone
from app import db


class Favorite(db.Model):
    """Annonce mise en favori par un utilisateur."""
    __tablename__ = 'favorites'
    __table_args__ = (db.UniqueConstraint('user_id', 'listing_id', name='uq_user_listing'),)

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user    = db.relationship('User', back_populates='favorites')
    listing = db.relationship('Listing', back_populates='favorites')

    def to_dict(self) -> dict:
        return {
            'id':         self.id,
            'user_id':    self.user_id,
            'listing_id': self.listing_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'listing':    self.listing.to_dict() if self.listing else None,
        }

    def __repr__(self):
        return f'<Favorite user={self.user_id} listing={self.listing_id}>'
