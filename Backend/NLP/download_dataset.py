from datasets import load_dataset

# download dataset
dataset = load_dataset("eliel2003/student-burnout-analysis2026")

# Convet to pandas 
df = dataset["train"].to_pandas()

# Save CSV 
df.to_csv("student_burnout.csv", index=False)
print(df.head())




print(dataset)