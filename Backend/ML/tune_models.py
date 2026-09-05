import pandas as pd

from sklearn.model_selection import StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier


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


# Logistic Regression
logistic = Pipeline([
    ("preprocessor", preprocessor),
    ("model", LogisticRegression(
        max_iter=3000
    ))
])


# Random Forest
random_forest = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestClassifier(
        random_state=42,
        n_jobs=-1
    ))
])


# Cross-validation
cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)


# Logistic Regression parameters
logistic_params = {
    "model__C": [0.01, 0.1, 1, 10],
    "model__class_weight": [
        None,
        {
            "Low": 1,
            "Medium": 2,
            "High": 5
        },
        {
            "Low": 1,
            "Medium": 2,
            "High": 10
        }
    ]
}


# Random Forest parameters
random_forest_params = {
    "model__n_estimators": [200, 500, 800],
    "model__max_depth": [None, 10, 20],
    "model__min_samples_leaf": [1, 2, 4],
    "model__class_weight": [
        None,
        {
            "Low": 1,
            "Medium": 2,
            "High": 5
        },
        {
            "Low": 1,
            "Medium": 2,
            "High": 10
        }
    ]
}


# Tune Logistic Regression
print("\nStarting Logistic Regression tuning...")

logistic_search = GridSearchCV(
    logistic,
    logistic_params,
    cv=cv,
    scoring="f1_macro",
    n_jobs=-1,
    verbose=1
)

logistic_search.fit(X, y)

print("\n--- Best Logistic Regression ---")
print("Best parameters:")
print(logistic_search.best_params_)
print("Best Macro F1:", logistic_search.best_score_)


# Tune Random Forest
print("\nStarting Random Forest tuning...")

random_forest_search = GridSearchCV(
    random_forest,
    random_forest_params,
    cv=cv,
    scoring="f1_macro",
    n_jobs=-1,
    verbose=1
)

random_forest_search.fit(X, y)

print("\n--- Best Random Forest ---")
print("Best parameters:")
print(random_forest_search.best_params_)
print("Best Macro F1:", random_forest_search.best_score_)