from .common import db

beacon_light_association_table = db.Table('beacon_light_association', db.Model.metadata,
    db.Column('light_id', db.Integer, db.ForeignKey('light.id')),
    db.Column('beacon_id', db.Integer, db.ForeignKey('beacon.id')))

beacon_door_association_table = db.Table('beacon_door_association', db.Model.metadata,
    db.column('door_id', db.Integer, db.ForeignKey('door.id')),
    db.Column('beacon_id', db.Integer, db.ForeignKey('beacon_id')))

class Beacon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    beacon_id = db.Column(db.Integer, primary_key = True)
    device_id = db.Column(db.Integer, nullable = False)
    lights = db.relationship("Light", secondary = beacon_light_association_table)
    doors = db.relationship("Door", secondary = schedule_heater_association_table)

