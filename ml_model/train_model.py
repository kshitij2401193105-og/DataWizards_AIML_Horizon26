import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# load dataset
data = pd.read_csv("traffic_dataset.csv")

# convert date_time column to datetime
data["date_time"] = pd.to_datetime(data["date_time"])

# extract hour and day from datetime
data["hour"] = data["date_time"].dt.hour
data["day"] = data["date_time"].dt.dayofweek

# create distance column (dataset doesn't have it)
data["distance"] = 10

# features
X = data[["hour", "day", "distance"]]

# target variable
y = data["traffic_volume"]

# model
model = RandomForestRegressor(n_estimators=100)

# train model
model.fit(X, y)

# save model
joblib.dump(model, "traffic_model.pkl")

print("Model trained successfully")