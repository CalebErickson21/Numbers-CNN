from flask import Flask, request, jsonify
import numpy as np
import pickle
from model import Network, sigmoid, sigmoid_prime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with open('trained_model.pkl', 'rb') as f:
    net = pickle.load(f)


@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Expect a flattened 28x28 image as list of 784 floats
    image = np.array(data['mat']).reshape(784, 1)

    output = net.feedforward(image)
    prediction = np.argmax(output)

    return jsonify({'prediction': int(prediction)})


if __name__ == '__main__':
    app.run(debug=True)