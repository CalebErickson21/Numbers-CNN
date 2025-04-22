from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/hello', methods=['POST'])
def hello():
    return jsonify({'message': 'Hello, World!', 'success': True})


if __name__ == '__main__':
    app.run(debug=True)