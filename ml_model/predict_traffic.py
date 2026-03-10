import sys
import joblib
import pandas as pd

hour = int(sys.argv[1])
day = int(sys.argv[2])
distance = float(sys.argv[3])

model = joblib.load("traffic_model.pkl")

X = pd.DataFrame([[hour, day, distance]], columns=["hour", "day", "distance"])

prediction = model.predict(X)[0]

prediction = int(prediction)

print(prediction)