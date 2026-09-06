import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, f1_score


# =========================
# Load dataset
# =========================

DATA_PATH = "../NLP/student_burnout_normalized.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)


# =========================
# Features
# =========================

FEATURES = [
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

TARGET = "risk_level"


X = df[FEATURES]
y = df[TARGET]


# =========================
# Train/test split
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# =========================
# Preprocessing
# =========================

numeric_features = FEATURES

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numeric_features)
    ]
)


# =========================
# Logistic Regression
# =========================

logistic_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    (
        "model",
        LogisticRegression(
            max_iter=3000,
            class_weight={
                "Low": 1,
                "Medium": 2,
                "High": 5
            }
        )
    )
])


logistic_params = {
    "model__C": [0.1, 0.5, 1, 2, 5]
}


cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)


print("\nTraining Logistic Regression...")


logistic_grid = GridSearchCV(
    logistic_pipeline,
    logistic_params,
    scoring="f1_macro",
    cv=cv,
    n_jobs=-1
)

logistic_grid.fit(X_train, y_train)

logistic_model = logistic_grid.best_estimator_

print("Best Logistic parameters:")
print(logistic_grid.best_params_)

print("Best Logistic macro F1:")
print(logistic_grid.best_score_)


# =========================
# Random Forest
# =========================

rf_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    (
        "model",
        RandomForestClassifier(
            random_state=42,
            n_jobs=-1,
            class_weight={
                "Low": 1,
                "Medium": 2,
                "High": 10
            }
        )
    )
])


rf_params = {
    "model__n_estimators": [100, 200],
    "model__max_depth": [8, 10, 12],
    "model__min_samples_leaf": [2, 4, 6]
}


print("\nTraining Random Forest...")


rf_grid = GridSearchCV(
    rf_pipeline,
    rf_params,
    scoring="f1_macro",
    cv=cv,
    n_jobs=-1
)

rf_grid.fit(X_train, y_train)

rf_model = rf_grid.best_estimator_

print("Best Random Forest parameters:")
print(rf_grid.best_params_)

print("Best Random Forest macro F1:")
print(rf_grid.best_score_)


# =========================
# Evaluation
# =========================

print("\n==============================")
print("LOGISTIC REGRESSION RESULTS")
print("==============================")

lr_predictions = logistic_model.predict(X_test)

print(
    classification_report(
        y_test,
        lr_predictions,
        zero_division=0
    )
)

print(
    "Accuracy:",
    accuracy_score(y_test, lr_predictions)
)

print(
    "Macro F1:",
    f1_score(
        y_test,
        lr_predictions,
        average="macro"
    )
)


print("\n==============================")
print("RANDOM FOREST RESULTS")
print("==============================")

rf_predictions = rf_model.predict(X_test)

print(
    classification_report(
        y_test,
        rf_predictions,
        zero_division=0
    )
)

print(
    "Accuracy:",
    accuracy_score(y_test, rf_predictions)
)

print(
    "Macro F1:",
    f1_score(
        y_test,
        rf_predictions,
        average="macro"
    )
)


# =========================
# Save models
# =========================

MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(
    logistic_model,
    os.path.join(MODEL_DIR, "logistic_regression.joblib")
)

joblib.dump(
    rf_model,
    os.path.join(MODEL_DIR, "random_forest.joblib")
)


print("\nModels saved successfully:")
print("models/logistic_regression.joblib")
print("models/random_forest.joblib")