from .common import db

class Door(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.Boolean, default=False)
