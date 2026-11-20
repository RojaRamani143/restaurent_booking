from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/book", methods=["POST"])
def book():
    data = request.get_json(silent=True) or {}
    required = ["name", "date", "time", "guests"]
    if not all(data.get(field) for field in required):
        return jsonify({"ok": False, "message": "Please fill in all required booking details."}), 400

    try:
        booking_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        if booking_date < datetime.today().date():
            return jsonify({"ok": False, "message": "Please choose a future date."}), 400
    except ValueError:
        return jsonify({"ok": False, "message": "Please select a valid date."}), 400

    booking_id = datetime.now().strftime("FF%y%m%d%H%M%S")
    return jsonify({
        "ok": True,
        "message": f"Thanks, {data['name']}! Your reservation request is received.",
        "booking_id": booking_id,
        "details": {
            "date": data["date"],
            "time": data["time"],
            "guests": data["guests"],
            "buffet": data.get("buffet", "No buffet selected")
        }
    })

@app.route("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
