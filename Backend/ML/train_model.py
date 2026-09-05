import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report


# Load dataset
df = pd.read_csv("Backend/NLP/student_burnout_normalized.csv")


# Features
features = [
    "age",
    "gender",
    "academic_year",
    "study_hours_per_day",
    "exam_pressure",
    "academic_performance",
    "stress_level",
    "anxiety_score",
    "depression_score",
    "sleep_hours",
    "physical_activity",
    "social_support",
    "screen_time",
    "internet_usage",
    "financial_stress",
    "family_expectation"
]

X = df[features]
y = df["risk_level"]


# Feature types
numeric_features = [
    "age",
    "academic_year",
    "study_hours_per_day",
    "exam_pressure",
    "academic_performance",
    "stress_level",
    "anxiety_score",
    "depression_score",
    "sleep_hours",
    "physical_activity",
    "social_support",
    "screen_time",
    "internet_usage",
    "financial_stress",
    "family_expectation"
]

categorical_features = ["gender"]


# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numeric_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ]
)


# 80/20 train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# Tuned class weights
logistic_weights = {
    "Low": 1,
    "Medium": 2,
    "High": 5
}

random_forest_weights = {
    "Low": 1,
    "Medium": 2,
    "High": 10
}


# Logistic Regression
logistic = Pipeline([
    ("preprocessor", preprocessor),
    ("model", LogisticRegression(
        C=1,
        class_weight=logistic_weights,
        max_iter=3000,
        random_state=42
    ))
])


# Random Forest
random_forest = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_leaf=4,
        class_weight=random_forest_weights,
        random_state=42,
        n_jobs=-1
    ))
])


# Train models
logistic.fit(X_train, y_train)
random_forest.fit(X_train, y_train)


# Predictions
logistic_predictions = logistic.predict(X_test)
random_forest_predictions = random_forest.predict(X_test)


# Evaluate Logistic Regression
print("\n--- Logistic Regression ---")

print(classification_report(
    y_test,
    logistic_predictions,
    zero_division=0
))


# Evaluate Random Forest
print("\n--- Random Forest ---")

print(classification_report(
    y_test,
    random_forest_predictions,
    zero_division=0
))


# Get probabilities
logistic_probabilities = logistic.predict_proba(X_test)
random_forest_probabilities = random_forest.predict_proba(X_test)


# Combine probabilities
combined_probabilities = (
    logistic_probabilities + random_forest_probabilities
) / 2


# Final combined prediction
combined_predictions = logistic.classes_[
    combined_probabilities.argmax(axis=1)
]


# Evaluate combined model
print("\n--- Combined Model ---")

print(classification_report(
    y_test,
    combined_predictions,
    zero_division=0
))


# Save trained models
os.makedirs("Backend/ML/models", exist_ok=True)

joblib.dump(
    logistic,
    "Backend/ML/models/logistic_regression.joblib"
)

joblib.dump(
    random_forest,
    "Backend/ML/models/random_forest.joblib"
)

print("\nModels saved successfully.")