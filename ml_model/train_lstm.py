import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import joblib

print("Loading dataset...")
data = pd.read_csv("traffic_dataset.csv")

# Preprocessing
data["date_time"] = pd.to_datetime(data["date_time"])
data["hour"] = data["date_time"].dt.hour
data["day"] = data["date_time"].dt.dayofweek
data["distance"] = 10 # Default base distance

# For a simple LSTM we need to scale the features and target
features = ["hour", "day", "distance"]
target = ["traffic_volume"]

scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()

X_scaled = scaler_X.fit_transform(data[features])
y_scaled = scaler_y.fit_transform(data[target])

# Reshape input to be [samples, time steps, features]
# For this basic implementation we will use time steps = 1
X_lstm = np.reshape(X_scaled, (X_scaled.shape[0], 1, X_scaled.shape[1]))

print("Building LSTM model...")
model = Sequential()
model.add(LSTM(50, activation='relu', input_shape=(1, 3)))
model.add(Dropout(0.2))
model.add(Dense(1))
model.compile(optimizer='adam', loss='mse')

print("Training LSTM model...")
# Keep epochs low for fast execution during local dev
model.fit(X_lstm, y_scaled, epochs=5, batch_size=32, verbose=1)

print("Saving model and scalers...")
model.save("lstm_model.h5")
joblib.dump(scaler_X, "scaler_X.pkl")
joblib.dump(scaler_y, "scaler_y.pkl")

print("LSTM Model trained and saved successfully!")
