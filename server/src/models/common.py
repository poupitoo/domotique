from flask_sqlalchemy import SQLAlchemy, DeclarativeMeta
from flask import json
from sqlalchemy.orm import class_mapper
import datetime

db = SQLAlchemy()

# TODO: Document find link
# http://stackoverflow.com/questions/5022066/how-to-serialize-sqlalchemy-result-to-json
class AlchemyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            columns = [c.key for c in class_mapper(obj.__class__).columns]
            return dict((c, getattr(obj, c)) for c in columns)
        elif hasattr(obj, "strftime"):
            return obj.strftime("%H:%M")
        else:
            return json.JSONEncoder.default(self, obj)

from .light import Light
from .door import Door
from .heater import Heater
from .schedule import Schedule
