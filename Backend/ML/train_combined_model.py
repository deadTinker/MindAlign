import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report


# Load existing dataset
df = pd.read_csv("Backend/NLP/student_burnout_normalized.csv")


# --------------------------------------------------
# IMPORTANT:
# The dataset does not contain the actual 10-question
# option assessment score, so we create a structured
# assessment score from the available burnout-related
# numerical indicators for model training.
# --------------------------------------------------

df["assessment_score"] = (
    df["stress_level"]
    + df["anxiety_score"]
    + df["depression_score"]
) / 3


# Use the dataset's existing mental-health values as
# training proxies for the NLP-derived values.
#
# At runtime, these three values will come from the
# actual user's text through the NLP model.

df["nlp_stress"] = df["stress_level"]
df["nlp_anxiety"] = df["anxiety_score"]
df["nlp_depression"] = df["depression_score"]


features = [
    "assessment_score",
    "nlp_stress",
    "nlp_anxiety",
    "nlp_depression"
]

X = df[features]
y = df["risk_level"]


# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# Logistic Regression
logistic = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(
        C=1,
        class_weight={
            "Low": 1,
            "Medium": 2,
            "High": 5
        },
        max_iter=3000,
        random_state=42
    ))
])


# Random Forest
random_forest = Pipeline([
    ("scaler", StandardScaler()),
    ("model", RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_leaf=4,
        class_weight={
            "Low": 1,
            "Medium": 2,
            "High": 10
        },
        random_state=42,
        n_jobs=-1
    ))
])


# Train
logistic.fit(X_train, y_train)
random_forest.fit(X_train, y_train)


# Predictions
logistic_predictions = logistic.predict(X_test)
random_forest_predictions = random_forest.predict(X_test)


print("\n--- Logistic Regression ---")
print(classification_report(
    y_test,
    logistic_predictions,
    zero_division=0
))


print("\n--- Random Forest ---")
print(classification_report(
    y_test,
    random_forest_predictions,
    zero_division=0
))


# Probabilities
logistic_probabilities = logistic.predict_proba(X_test)
random_forest_probabilities = random_forest.predict_proba(X_test)


# Average both model probabilities
combined_probabilities = (
    logistic_probabilities + random_forest_probabilities
) / 2


combined_predictions = logistic.classes_[
    combined_probabilities.argmax(axis=1)
]


print("\n--- Combined Model ---")
print(classification_report(
    y_test,
    combined_predictions,
    zero_division=0
))


# Save models
os.makedirs("Backend/ML/models", exist_ok=True)

joblib.dump(
    logistic,
    "Backend/ML/models/combined_logistic_regression.joblib"
)

joblib.dump(
    random_forest,
    "Backend/ML/models/combined_random_forest.joblib"
)


print("\nCombined models saved successfully.")