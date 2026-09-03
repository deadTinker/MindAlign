import pandas as pd

# load csv file
df = pd.read_csv("student_burnout.csv")


# Show all col names
print("\n--- COLUMNS ---")
print(df.columns.tolist())


# show dataset size
print("\n--- DATASET SIZE --- ")
print("Row: ", len(df))
print("Columns:", len(df.columns))


# show data types
print("\n -- DATA TYPES --- ")
print(df.dtypes)


# show minimum & maximum values
print(df.describe().T[["min", "max"]])


