from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/predict', methods=['POST'])
def hello():
    return jsonify({'number': 4, 'success': True})


if __name__ == '__main__':
    app.run(debug=True)