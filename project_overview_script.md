# Urban Nav: AI-Powered Smart City Navigation
*Project Overview & Panel Presentation Script*

---

## 1. Introduction & Problem Statement
**"Good morning/afternoon, Panel. We are excited to present Urban Nav, our AI-powered smart city navigation platform."**

Traditional navigation apps provide static ETAs based on simple algorithms. However, in urban environments, traffic behaves non-linearly. Weather, time of day, and specific urban corridors drastically affect travel times. Our goal was to build a system that doesn't just calculate distance, but intelligently *predicts* future traffic conditions using Machine Learning.

## 2. Technical Architecture
**"To solve this, we built a modern full-stack web application integrated with an AI backend."**

- **Frontend:** A responsive UI crafted in HTML, CSS, and JS that takes user inputs (Source, Destination, Departure Time) and displays live routing maps and analytical dashboards.
- **Backend API:** A Node.js and Express server that handles geographic routing via the OpenStreetMap (OSRM) API.
- **Machine Learning Engine:** A specialized Python microservice powered by `TensorFlow`, `scikit-learn`, and `pandas`.

## 3. The Data: Kaggle Traffic Dataset
**"AI is only as good as its data. We utilized a comprehensive traffic dataset sourced from Kaggle."**

The dataset (`traffic_dataset.csv`) contains nearly 50,000 hourly historical records. It includes critical temporal features:
- The time of day (Hour)
- The day of the week
- Total traffic volumes
- Additional contexts like weather conditions. 

By analyzing this data, our model learns the hidden patterns of urban congestion—such as morning rush hour spikes versus late-night lulls.

## 4. The Model: LSTM Neural Network
**"Instead of a basic regression model, we implemented a Long Short-Term Memory (LSTM) Neural Network using Keras."**

LSTMs are an advanced type of Recurrent Neural Network (RNN) specifically designed to understand sequences and time-series data. 
1. **Training Pipeline:** Our `train_lstm.py` script normalizes the Kaggle data using `MinMaxScaler`, reshapes it for sequence feeding, and trains a multi-layer Neural Network with Dropout regularization to prevent overfitting. It then exports the trained intelligence as an `.h5` file.
2. **Inference Pipeline:** When a user requests a route on the frontend, the Node backend triggers `predict_lstm.py`. The script instantly loads the pre-trained weights, scales the user's specific departure time and distance, and returns a live vehicle count prediction. 

**"Dynamic Variance:"** To account for the unique complexity of different city routes, our inference engine applies a deterministic route-hashing algorithm to the LSTM base prediction. This ensures that a drive from Mumbai to Delhi yields distinct, realistic traffic variance compared to a localized drive from Pune to Agra, perfectly simulating real-world route constraints!

## 5. Conclusion
**"By bridging real-time routing APIs with deep learning trained on Kaggle data, Urban Nav provides commuters with predictive intelligence—allowing them to avoid traffic *before* they even start driving. Thank you."**
