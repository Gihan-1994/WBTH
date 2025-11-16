from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/recommendations/accommodations', methods=['POST'])
def recommend_accommodations():
    data = request.get_json()
    # TODO: Implement accommodation recommendation logic based on spec
    # - Hard Rule Filters (availability, budget, amenities, location, group size)
    # - Scoring (weighted sum of interests, style, price, amenities, location, group, rating, popularity)
    # - Rule-Based Filtering (post-score pruning)
    print("Received accommodation recommendation request:", data)
    return jsonify({
        "message": "Accommodation recommendation endpoint (TODO)",
        "input": data,
        "recommendations": [] # Placeholder
    })

@app.route('/match/guides', methods=['POST'])
def match_guides():
    data = request.get_json()
    # TODO: Implement guide matching logic based on spec
    # - Hard Rule Filters (duration, language, location, gender)
    # - Scoring (point-additive for location, languages, specializations, duration, gender, popularity, rating)
    print("Received guide matching request:", data)
    return jsonify({
        "message": "Guide matching endpoint (TODO)",
        "input": data,
        "matches": [] # Placeholder
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
