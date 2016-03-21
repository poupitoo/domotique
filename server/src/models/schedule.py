from .common import db

# http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#many-to-many
schedule_light_association_table = db.Table('schedule_light_association', db.Model.metadata,
    db.Column('light_id', db.Integer, db.ForeignKey('light.id')),
    db.Column('schedule_id', db.Integer, db.ForeignKey('schedule.id')))

schedule_heater_association_table = db.Table('schedule_heater_association', db.Model.metadata,
    db.Column('heater_id', db.Integer, db.ForeignKey('heater.id')),
    db.Column('schedule_id', db.Integer, db.ForeignKey('schedule.id')))

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lights = db.relationship("Light", secondary = schedule_light_association_table)
    heaters = db.relationship("Heater", secondary = schedule_heater_association_table)
    at = db.Column(db.Time)
    to = db.Column(db.Time)
