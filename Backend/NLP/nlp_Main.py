from transformers import pipeline
from nlp_models.mental_health import MentalHealthAnalyzer
analyzer = MentalHealthAnalyzer();


# classifier = pipeline("sentiment-analysis")

user_responses= [
    "I feel like I’m drowning in stress lately.",
    "I’m anxious about meeting new people.",
    "Sometimes I just feel empty and hopeless.",
    "I’m doing okay today."
]

final_score = analyzer.mean_max_Scores(user_responses)
print("\n Final NLP features : ")
for key, value in final_score.items() : 
    print(key,  ":", value )




# result = classifier(text)

# print(result)


# NLP Output expecting 
    #  form  Mental Health Model
    # stress_score,
    # anxiety_score,
    # depression_score,

    #  Sentiment / NLP  Model
    # negative_sentiment_score,


    # optional
    # Emotion Model  
    # sadness_score,
    # fear_score,
    # anger_score,
    # exhaustion





