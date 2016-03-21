from .common import db

class Heater(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.Boolean, default=False)
