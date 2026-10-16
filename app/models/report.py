from datetime import datetime, timezone
from app import db


class Report(db.Model):
    """Signalement d'une annonce ou d'un utilisateur."""
    __tablename__ = 'reports'

    id               = db.Column(db.Integer, primary_key=True)
    reporter_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    listing_id       = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=True)
    reported_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    reason           = db.Column(db.Text, nullable=False)
    status           = db.Column(db.Enum('pending', 'reviewed', 'resolved'), default='pending')
    created_at       = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    reporter      = db.relationship('User', foreign_keys=[reporter_id], back_populates='reports_made')
    listing       = db.relationship('Listing', back_populates='reports')
    reported_user = db.relationship('User', foreign_keys=[reported_user_id])

    def to_dict(self) -> dict:
        return {
            'id':               self.id,
            'reporter_id':      self.reporter_id,
            'listing_id':       self.listing_id,
            'reported_user_id': self.reported_user_id,
            'reason':           self.reason,
            'status':           self.status,
            'created_at':       self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Report {self.id} status={self.status}>'
