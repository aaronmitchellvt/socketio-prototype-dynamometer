from flask import Flask
from flask_socketio import SocketIO
import random
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = '12345'
CORS(app, resources={r'/*':{'origins': '*'}})

socketio = SocketIO(app, cors_allowed_origins='*')

@socketio.on('start')
def handle_start_event(data):
    vehicle = data['vehicle']
    vehicle_redline = vehicle['rpmRedLine']
    num_iterations = int(vehicle_redline) // 200
    for i in range(num_iterations):
        socketio.sleep(.85)
        rpm = i * 200
        torque = int((rpm + random.randint(0, 300)) / 3)
        horsepower = int(((torque * rpm) / random.randint(4000, 6500)) / 2.5)

        socketio.emit('update', {'torque': torque, 'horsepower': horsepower, 'rpm': rpm})

    vehicle_man = vehicle['manufacturer']
    vehicle_model = vehicle['model']
    socketio.emit('stop', {'message': f'{vehicle_man} {vehicle_model} Results'})

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)