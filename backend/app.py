import joblib
from flask import Flask, request, jsonify
import numpy as np
import os

# Load the model using absolute path
model_path = os.path.join(os.path.dirname(__file__), "solar_storm_classifier.pkl")
model = joblib.load(model_path)

# Initialize Flask
app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Solar Storm Prediction API is running!"})


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()
        input_features = np.array([[data['Scalar B, nT'], data['BZ, nT (GSM)'], data['SW Proton Density, N/cm^3'], 
                                    data['SW Plasma Speed, km/s'], data['Flow pressure'], data['E electric field'], 
                                    data['Alfen mach number'], data['Dst-index, nT'], data['f10.7_index'], data['AE-index, nT']]])

        prediction = model.predict(input_features)[0]
        probability = model.predict_proba(input_features)[0][1]

        return jsonify({
            "storm_prediction": "Storm" if prediction == 1 else "No Storm",
            "probability": round(probability, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
