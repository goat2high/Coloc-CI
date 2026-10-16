from datetime import datetime, timezone
from app import db


class Message(db.Model):
    """Message privé entre deux utilisateurs."""
    __tablename__ = 'messages'

    id          = db.Column(db.Integer, primary_key=True)
    sender_id   = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    listing_id  = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=True)
    content     = db.Column(db.Text, nullable=False)
    is_read     = db.Column(db.Boolean, default=False)
    created_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    sender   = db.relationship('User', foreign_keys=[sender_id], back_populates='sent_messages')
    receiver = db.relationship('User', foreign_keys=[receiver_id], back_populates='recv_messages')
    listing  = db.relationship('Listing', back_populates='messages')

    def to_dict(self) -> dict:
        return {
            'id':          self.id,
            'sender_id':   self.sender_id,
            'receiver_id': self.receiver_id,
            'listing_id':  self.listing_id,
            'content':     self.content,
            'is_read':     self.is_read,
            'created_at':  self.created_at.isoformat() if self.created_at else None,
            'sender': {
                'id':         self.sender.id,
                'first_name': self.sender.profile.first_name if self.sender.profile else None,
                'avatar':     self.sender.profile.avatar if self.sender.profile else None,
            } if self.sender else None,
        }

    def __repr__(self):
        return f'<Message {self.id}: {self.sender_id}→{self.receiver_id}>'
