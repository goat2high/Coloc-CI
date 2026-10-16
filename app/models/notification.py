from datetime import datetime, timezone
from app import db


class Notification(db.Model):
    """Notification interne pour un utilisateur."""
    __tablename__ = 'notifications'

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type       = db.Column(db.String(50))   # 'message', 'match', 'report', etc.
    content    = db.Column(db.Text)
    link       = db.Column(db.String(255))  # URL frontend optionnelle
    is_read    = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='notifications')

    def to_dict(self) -> dict:
        return {
            'id':         self.id,
            'user_id':    self.user_id,
            'type':       self.type,
            'content':    self.content,
            'link':       self.link,
            'is_read':    self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Notification {self.id} user={self.user_id} type={self.type}>'
