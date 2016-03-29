from flask import Flask
import sys
import subprocess
from models.common import db, Light, Schedule

print(sys.argv)

if len(sys.argv) != 3:
  exit()

print("Starting")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/pi/db.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
db.init_app(app)

with app.app_context():
  schedule = Schedule.query.filter(Schedule.id == sys.argv[1]).one()
  print("  lights:")
  for light in schedule.lights:
    print(light)
    if sys.argv[2] == "start":
      print("  Starting " + str(light.gpio_pin))
      light.state = True
      subprocess.call(["/usr/local/bin/gpio", "write", str(light.gpio_pin), "1"])
      print("  Started")
    else:
      print("Stopping")
      light.state = False
      subprocess.call(["/usr/local/bin/gpio", "write", str(light.gpio_pin), "0"])
      print("Stopping")
  db.session.commit()
