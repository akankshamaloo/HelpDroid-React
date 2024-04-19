import pickle
import numpy as np
import random
import math

def load_model(model_file):
    """Utility function to load a pickle model."""
    with open(model_file, 'rb') as file:
        model = pickle.load(file)
    return model

def get_score(model, arr):
    """General function to get the model score."""
    arr = np.array(arr)
    arr = arr.reshape(1, -1)
    return model.predict(arr)[0]

def prepare_data():
    """Generates random data for model input."""
    arr = [
        round(random.uniform(97.7, 98.9), 2),
        round(random.uniform(60, 100), 2),
        round(random.uniform(12, 16), 2),
        round(random.uniform(100, 120), 2),
        round(random.uniform(60, 80), 2),
        round(random.uniform(95, 100), 2)
    ]
    return arr

def hybrid_score():
    # Load both models
    dt_model = load_model("decision_tree_model.pkl")
    knn_model = load_model("knn_weight.pkl")

    # Prepare data
    data = prepare_data()
    print("Data used for prediction:", data)

    # Get scores from both models
    dt_score = get_score(dt_model, data)
    knn_score = get_score(knn_model, data)

    # Print individual model scores
    print("Decision Tree Score:", dt_score)
    print("KNN Score:", knn_score)

    # Calculate and print the hybrid score
    hybrid_score = math.floor((dt_score + knn_score) / 2)
    print("Hybrid Score:", hybrid_score)

# Execute the hybrid model function
hybrid_score()