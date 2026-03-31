import joblib
import numpy as np
import pandas as pd
import sys

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
    
    # scale
    data_scaled = scaler.transform(data_df)
    
    # predict
    prediction = model.predict(data_scaled)
    
    return prediction[0]


if __name__ == "__main__":
    
    # ✅ Node input
    if len(sys.argv) > 1:
        try:
            values = list(map(float, sys.argv[1:]))

            result = predict_addiction(values)

            # DEBUG + OUTPUT
            print(result, flush=True)

        except Exception as e:
            print("ERROR:", str(e), flush=True)

    # ✅ Manual input
    else:
        print("Enter values:")

        daily = float(input("Daily Usage Hours: "))
        social = float(input("Time on Social Media: "))
        gaming = float(input("Time on Gaming: "))
        education = float(input("Time on Education: "))
        sleep = float(input("Sleep Hours: "))
        checks = float(input("Phone Checks Per Day: "))
        screen_bed = float(input("Screen Time Before Bed: "))
        weekend = float(input("Weekend Usage Hours: "))
        academic = float(input("Academic Performance: "))

        user_data = [
            daily, social, gaming, education,
            sleep, checks, screen_bed, weekend,
            academic
        ]

        result = predict_addiction(user_data)

        print("Addiction Level:", result)