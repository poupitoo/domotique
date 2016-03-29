from flask import Flask, request, Response
import flask
from flask_sqlalchemy import SQLAlchemy
from models.common import db, Light, Heater, Door, Schedule, AlchemyEncoder
import logging
import sys
import subprocess
import time
import traceback
from crontab import CronTab

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/pi/db.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route("/light", methods=['GET'])
def all_light():
  return Response(flask.json.dumps(Light.query.all(), cls=AlchemyEncoder), mimetype='application/json')

@app.route("/light", methods=['POST'])
def new_light():
    light = Light(state = False, gpio_pin = request.form["gpio_pin"])
    db.session.add(light)
    db.session.commit()
    return flask.json.dumps(light, cls=AlchemyEncoder)

@app.route("/light/<id>", methods=['GET'])
def light(id):
    return flask.json.dumps(Light.query.filter(Light.id == id).one(), cls=AlchemyEncoder)

@app.route("/light/<id>", methods=['POST'])
def light_update(id):
    Light.query.filter(Light.id == id).update(request.form)
    db.session.commit()
    light = Light.query.filter(Light.id == id).one()
    try:
        if light.state:
            subprocess.call(["gpio", "write", str(light.gpio_pin), "1"])
        else:
            subprocess.call(["gpio", "write", str(light.gpio_pin), "0"])
    except:
        pass
    return flask.json.dumps(light, cls=AlchemyEncoder)

@app.route("/light/<id>/on", methods=['POST'])
def light_on(id):
    Light.query.filter(Light.id == id).update({ "state": True })
    light = Light.query.filter(Light.id == id).one()
    subprocess.call(["gpio", "write", str(light.gpio_pin), "1"])

@app.route("/light/<id>/off", methods=['POST'])
def light_off(id):
    Light.query.filter(Light.id == id).update({ "state": True })
    light = Light.query.filter(Light.id == id).one()
    subprocess.call(["gpio", "write", str(light.gpio_pin), "0"])
    return flask.json.dumps(light, cls=AlchemyEncoder)

@app.route("/heater", methods=['GET'])
def all_heater():
    return Response(flask.json.dumps(Heater.query.all(), cls=AlchemyEncoder), mimetype='application/json')

@app.route("/heater", methods=['POST'])
def new_heater():
    heater = Heater(state = False)
    db.session.add(heater)
    db.session.commit()
    return flask.json.dumps(heater, cls=AlchemyEncoder)

@app.route("/heater/<id>", methods=['GET'])
def heater(id):
    return flask.json.dumps(Heater.query.filter(Heater.id == id).one(), cls=AlchemyEncoder)

@app.route("/header/<id>", methods=['POST'])
def heater_post(id):
    Heater.query.filter(Heater.id == id).update(request.form, cls=AlchemyEncoder)

@app.route("/door", methods=['GET'])
def all_door():
    return Response(flask.json.dumps(Door.query.all()))

@app.route("/door", methods=['POST'])
def new_door():
    door = Door(state = False)
    db.session.add(door)
    db.session.commit()
    return flask.json.dumps(door, cls=AlchemyEncoder)

@app.route("/door/<id>", methods=['GET'])
def door(id):
    return flask.json.dumps(door.query.filter(Door.id == id).one(), cls=AlchemyEncoder)

@app.route("/door/<id>", methods=['POST'])
def door_post(id):
    Door.query.filter(Door.id == id).update(request.form, cls=AlchemyEncoder)


@app.route("/nearestBeacon", methods=['POST'])
def nearestBeacon():
    lights = Light.query.filter(Light.beacon_id == request.form['beacon']).all()
    for light in lights:
        light.state = True
        db.session.commit()
        subprocess.call(["gpio", "write", str(light.gpio_pin), "1"])

@app.route("/schedule", methods=['GET'])
def getSchedules():
    return flask.json.dumps(Schedule.query.all(), cls=AlchemyEncoder)

@app.route("/schedule", methods=['POST'])
def new_schedule():
    try:
        lights = [Light.query.filter(Light.id == id).one() for id in request.form['lights']]
        at = time.strptime(request.form['at'], "%H:%M")
        to = time.strptime(request.form['to'], "%H:%M")
        schedule = Schedule(lights = lights, at = at, to = to)
        db.session.add(schedule)
        db.session.commit()
        user_cron = CronTab(user = True)
        start_job = user_cron.new(command='/usr/bin/python ' + os.path.join(os.path.dirname(os.path.realpath(__file__)), "cronscript.py") + " " + schedule.id + " start")
        start_job.setall(at)
        stop_job = user_cron.new(command='/usr/bin/python ' + os.path.join(os.path.dirname(os.path.realpath(__file__)), "cronscript.py") + " " + schedule.id + " start")
        stop_job.setall(to)
        user_cron.write_to_user(user = True)
        return flask.json.dumps({ 'success': True })
    except Exception as e:
        traceback.print_tb(e.__traceback__)
        raise e

if __name__ == '__main__':
    handler = logging.StreamHandler(sys.stderr)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    app.run(host='0.0.0.0', port=9004)
