from .common import db

schedule_association_table = db.Table('schedule_association', db.Model.metadata,
    db.Column('light_id', db.Integer, db.ForeignKey('light.id')),
    db.Column('schedule_id', db.Integer, db.ForeignKey('schedule_light.id')))

class Light(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.Boolean, default=False)

class ScheduleLight(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lights = db.relationship("Light", secondary = schedule_association_table)
    at = db.Column(db.Time)
    to = db.Column(db.Time)
