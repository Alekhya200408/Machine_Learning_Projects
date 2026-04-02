from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# load models
model = joblib.load("models/addiction_model.pkl")
scaler = joblib.load("models/scalerr.pkl")

def predict_addiction(data):
    columns = [
        "Daily_Usage_Hours",
        "Time_on_Social_Media",
        "Time_on_Gaming",
        "Time_on_Education",
        "Sleep_Hours",
        "Phone_Checks_Per_Day",
        "Screen_Time_Before_Bed",
        "Weekend_Usage_Hours",
        "Academic_Performance"
    ]
    
    data_df = pd.DataFrame([data], columns=columns)
    
    data_scaled = scaler.transform(data_df)
    prediction = model.predict(data_scaled)
    
    return prediction[0]

# 🔥 API route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        values = [
            float(data["daily"]),
            float(data["social"]),
            float(data["gaming"]),
            float(data["education"]),
            float(data["sleep"]),
            float(data["checks"]),
            float(data["screen"]),
            float(data["weekend"]),
            float(data["academic"])
        ]

        result = predict_addiction(values)

        return jsonify({"result": int(result)})

    except Exception as e:
        return jsonify({"error": str(e)})

# 🔥 run server
if __name__ == "__main__":
    app.run(debug=True)