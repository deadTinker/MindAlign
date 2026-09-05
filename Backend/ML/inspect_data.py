import pandas as pd

# Load dataset
df = pd.read_csv("Backend/NLP/student_burnout_normalized.csv")

print("\n========== DATASET INFO ==========")

print("Rows:", df.shape[0])
print("Columns:", df.shape[1])

print("\n========== COLUMNS ==========")
for column in df.columns:
    print(column)

print("\n========== DATA TYPES ==========")
print(df.dtypes)

print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

print("\n========== TARGET DISTRIBUTION ==========")
print(df["risk_level"].value_counts())
print("\nTarget percentages:")
print(df["risk_level"].value_counts(normalize=True) * 100)

print("\n========== NUMERICAL COLUMNS ==========")
print(df.select_dtypes(include="number").columns.tolist())

print("\n========== CATEGORICAL COLUMNS ==========")
print(df.select_dtypes(exclude="number").columns.tolist())

print("\n========== FIRST 5 ROWS ==========")
print(df.head())