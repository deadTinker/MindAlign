from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load trained models
logistic_model = joblib.load("models/logistic_regression.joblib")
random_forest_model = joblib.load("models/random_forest.joblib")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        features = data.get("features")

        if not isinstance(features, dict):
            return jsonify({
                "message": "features must be an object"
            }), 400

        # Feature order must match the order used during training
        feature_order = [
            "study_hours_per_day",
            "exam_pressure",
            "academic_performance",
            "sleep_hours",
            "physical_activity",
            "social_support",
            "screen_time",
            "internet_usage",
            "financial_stress",
            "family_expectation",
            "stress_level",
            "anxiety_score",
            "depression_score"
        ]

        values = {}

        for feature in feature_order:
            if feature not in features:
                return jsonify({
                    "message": f"Missing feature: {feature}"
                }), 400

            values[feature] = features[feature]

        # The trained pipeline expects a DataFrame
        # with the original feature names
        X = pd.DataFrame(
            [values],
            columns=feature_order
        )

        # Get probabilities from both models
        lr_probabilities = logistic_model.predict_proba(X)[0]
        rf_probabilities = random_forest_model.predict_proba(X)[0]

        # Average both models
        probabilities = (
            lr_probabilities + rf_probabilities
        ) / 2

        classes = logistic_model.classes_

        # Probability of Medium + High
        # = probability of burnout
        burnout_probability = 0

        for class_name, probability in zip(
            classes,
            probabilities
        ):
            if class_name in ["Medium", "High"]:
                burnout_probability += probability

        # Highest probability class
        predicted_index = np.argmax(probabilities)
        risk_level = classes[predicted_index]

        result = {
            "burnoutProbability": float(
                burnout_probability
            ),
            "riskLevel": str(risk_level),
            "probabilities": {
                str(class_name): float(probability)
                for class_name, probability in zip(
                    classes,
                    probabilities
                )
            }
        }

        print("ML prediction:", result)

        return jsonify(result)

    except Exception as error:
        print("ML error:", error)

        return jsonify({
            "message": "ML prediction failed"
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5002
    )