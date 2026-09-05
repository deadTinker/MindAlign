import pandas as pd

df = pd.read_csv("student_burnout.csv")


columns_to_normalize = [
    "stress_level",
    "anxiety_score",
    "depression_score"
]


for column in columns_to_normalize:
    minimum = df[column].min()
    maximum = df[column].max()

    df[column] = (df[column] - minimum)/ (maximum -minimum)


# Save normalized dataset
df.to_csv("student_burnout_normalized.csv",index= False)

# creating dummies cols of Gender
df = pd.get_dummies(df, columns=["gender"],dtype =int)

# print(df["gender"].unique())
print(df.head())


