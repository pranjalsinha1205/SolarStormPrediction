import joblib
from flask import Flask, request, jsonify, render_template
import numpy as np
import os
from flask_cors import CORS  # Enable CORS to allow frontend requests

# Load the model using absolute path
model_path = os.path.join(os.path.dirname(__file__), "solar_storm_classifier.pkl")
model = joblib.load(model_path)

# Initialize Flask
app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)  # Enable CORS for frontend connections

# Serve the HTML form
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Expected input features
        required_features = [
            "Scalar B, nT", "BZ, nT (GSM)", "SW Proton Density, N/cm^3",
            "SW Plasma Speed, km/s", "Flow pressure", "E electric field",
            "Alfen mach number", "Dst-index, nT", "f10.7_index", "AE-index, nT"
        ]

        # Validate input data
        missing_features = [feature for feature in required_features if feature not in data]
        if missing_features:
            return jsonify({"error": f"Missing input features: {missing_features}"}), 400

        # Convert input data to a NumPy array
        input_features = np.array([[float(data[feature]) for feature in required_features]])

        # Make predictions
        prediction = model.predict(input_features)[0]
        probability = model.predict_proba(input_features)[0][1]

        return jsonify({
            "storm_prediction": "storm" if prediction == 1 else "no storm",
            "probability": round(probability, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)