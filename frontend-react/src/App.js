import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    daily: "",
    social: "",
    gaming: "",
    education: "",
    sleep: "",
    checks: "",
    screen_bed: "",
    weekend: "",
    academic: ""
  });

  const [result, setResult] = useState("");

  const labels = {
    daily: "Daily Usage Hours",
    social: "Time on Social Media",
    gaming: "Time on Gaming",
    education: "Time on Education",
    sleep: "Sleep Hours",
    checks: "Phone Checks Per Day",
    screen_bed: "Screen Time Before Bed",
    weekend: "Weekend Usage Hours",
    academic: "Academic Performance"
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // convert to numbers
    const formattedData = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, Number(value)])
    );

    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formattedData)
    });

    const data = await res.json();

    console.log("API response:", data.result);

    
    const cleanResult = data.result.trim();

    let output = "";

    if (cleanResult === "Low") {
      output = "Low Addiction";
    } else if (cleanResult === "Medium") {
      output = "Medium Addiction";
    } else {
      output = "High Addiction";
    }

    setResult(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">
          Addiction Predictor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {Object.keys(form).map((key, index) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-600">
                {labels[key]}
              </label>
              <input
                type="number"
                name={key}
                placeholder={`Enter ${labels[key]}`}
                value={form[key]}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const next = document.querySelectorAll("input")[index + 1];
                    if (next) next.focus();
                  }
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Predict
          </button>
        </form>

        {result && (
          <div
            className={`mt-4 text-center text-lg font-semibold ${result === "Low Addiction"
                ? "text-green-600"
                : result === "Medium Addiction"
                  ? "text-orange-500"
                  : "text-red-600"
              }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;