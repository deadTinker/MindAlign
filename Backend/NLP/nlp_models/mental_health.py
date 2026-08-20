
from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
import torch

#  form  Mental Health Model
    # Gettingn these output
    
    # stress_score,
    # anxiety_score,
    # depression_score,


    # Also Nutral
    



class MentalHealthAnalyzer:

   # model provide output in this order
            # 0 = Neutral
            # 1 = Depression
            # 2 = Anxiety
            # 3 = Stress

     LABEL_MAP = {
           0: "neutral", 
           1: "depression", 
           2: "anxiety",
           3: "stress"
     }


     def __init__(self):

       # Name of the pretrained model
        MODEL_NAME = "Hrishikesh4/mental-health-classifier-longformer"

        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

        # Load pretrained model
        self.model = AutoModelForSequenceClassification.from_pretrained(
            MODEL_NAME
        )

        # We are doing inference, not training
        self.model.eval()
      
     def analyze(self,text):
        # tokenize
  

        inputs = self.tokenizer(
            text,
            return_tensors = "pt",
            truncation =True,
            padding = True
        )
        # inference
        # convert logits → probabilities
        # map labels correctly

        with torch.no_grad():
            outputs = self.model(**inputs)

        # geting model outputs
        logits = outputs.logits

        probabilities = torch.sigmoid(logits)[0]

        scores = {}

        for index, probability in enumerate(probabilities):
            label = self.LABEL_MAP[index]
            scores[label] = float(probability)

        return scores




     def analyze_responses(self, responses):
         results = []
         for response in responses:
                scores = self.analyze(response)
                results.append(scores)



         return results      # this genrate each QN individual scores in arr


     def aggregate_scores(self, response_scores):
         result = {}
         labels =[
             "neutral",
             "depression",
             "anxiety",
             "stress"
         ]

         for label in labels:
             values = [
                 scores[label]
                for scores in response_scores 
             ]

             result[f"{label}_mean"] = sum(values)/len(values)
             result[f"{label}_max"]  = max(values)


         return  result 




   # pass all Qn responses with Qns
   #  return final mean , max values score.
    
     def mean_max_Scores(self , user_responses): 

        individual_Each_Qn_user_response_score = self.analyze_responses(user_responses)
        max_mean_score = self.aggregate_scores(individual_Each_Qn_user_response_score)
        return max_mean_score
