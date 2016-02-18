from flask import Flask, request, Response
import flask
from flask_sqlalchemy import SQLAlchemy
from models.common import db, Light, AlchemyEncoder
import logging
import sys

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://domotic@localhost/domotic'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
db.init_app(app)

@app.route("/light", methods=['GET', 'POST'])
def all_light():
    if request.method == 'POST':
        return new_light()
    else:
        return Response(flask.json.dumps(Light.query.all(), cls=AlchemyEncoder), mimetype='application/json')

def new_light():
    light = Light(state = False)
    db.session.add(light)
    db.session.commit()
    return flask.json.dumps(light, cls=AlchemyEncoder)

@app.route("/light/<id>", methods=['GET', 'POST'])
def light(id):
    if request.method == 'POST':
        return light_post(id)
    else:
        return flask.json.dumps(Light.query.filter(Light.id == id).one(), cls=AlchemyEncoder)

def light_post(id):
    Light.query.filter(Light.id == id).update(request.get_json(), cls=AlchemyEncoder)

#@app.route("/schedule", methods=['GET', 'POST'])
#def all_schedule():
#    if request.method == 'POST':
#        return new_schedule()
#    else:
#        return Response(flask.json.dumps(Schedule.query

if __name__ == '__main__':
    handler = logging.StreamHandler(sys.stderr)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    app.run(host='0.0.0.0', port=9004)
