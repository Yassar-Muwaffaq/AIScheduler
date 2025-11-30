from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Izinkan semua origin + semua method
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


@app.route("/")
def home():
    return "API is running!"

@app.route("/api")
def api():
    return "API is running!"


# ============================
# AUTH ENDPOINTS
# ============================

@app.route("/auth/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return "", 200   # <-- penting biar preflight tidak error

    data = request.json
    print("Register Data:", data)

    return jsonify({"message": "Register success", "user": data}), 200


@app.route("/auth/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return "", 200

    data = request.json
    print("Login Data:", data)

    return jsonify({"message": "Login success", "user": data}), 200


if __name__ == "__main__":
    app.run(debug=True)
