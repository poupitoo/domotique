from .common import db

class Light(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gpio_pin = db.Column(db.Integer, nullable=False)
    state = db.Column(db.Boolean, default=False)
