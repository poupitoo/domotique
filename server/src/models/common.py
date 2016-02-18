from flask_sqlalchemy import SQLAlchemy, DeclarativeMeta
from flask import json
from sqlalchemy.orm import class_mapper

db = SQLAlchemy()

class AlchemyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            columns = [c.key for c in class_mapper(obj.__class__).columns]
            return dict((c, getattr(obj, c)) for c in columns)
        return json.JSONEncoder.default(self, obj)

from .light import Light
