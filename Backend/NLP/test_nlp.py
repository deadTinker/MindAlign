from transformers import pipeline

classifier = pipeline("sentiment-analysis")

text = "I am feeling tired and stressed because of my studies."

result = classifier(text)

print(result)