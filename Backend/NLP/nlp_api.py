from flask import Flask, request, jsonify
from nlp_models.mental_health import MentalHealthAnalyzer

app = Flask(__name__)

analyzer = MentalHealthAnalyzer()


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        responses = data.get("responses", [])

        if not isinstance(responses, list) or len(responses) == 0:
            return jsonify({
                "message": "responses must be a non-empty list"
            }), 400

        scores = analyzer.aggregate_Scores(responses)

        return jsonify({
            "stress": scores["stress_median"],
            "anxiety": scores["anxiety_median"],
            "depression": scores["depression_median"]
        })

    except Exception as error:
        print("NLP error:", error)

        return jsonify({
            "message": "NLP analysis failed"
        }), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001)