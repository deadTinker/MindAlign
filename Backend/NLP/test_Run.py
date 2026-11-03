from transformers import pipeline
from nlp_models.mental_health import MentalHealthAnalyzer
analyzer = MentalHealthAnalyzer();


# classifier = pipeline("sentiment-analysis")

# Q1. How would you describe your current academic workload and the pressure you feel because of it?
# Q2. How do you usually feel mentally and physically after spending a long time studying or attending classes?
# Q3. Have you noticed any changes in your motivation or interest in your studies recently? If yes, describe them.
# Q4. How has your academic routine affected your sleep, concentration, or ability to relax?


user_responses= [
  "Due to callage started, thats refected my daily routine.",  
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





