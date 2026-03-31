import express from "express";
import cors from "cors";
import { spawn } from "child_process";

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// prediction route
app.post("/predict", (req, res) => {
  const data = req.body;

  const args = [
    "predict.py",
    data.daily,
    data.social,
    data.gaming,
    data.education,
    data.sleep,
    data.checks,
    data.screen_bed,
    data.weekend,
    data.academic
  ];

  // run python from main folder (again/)
  const py = spawn("py", args, { cwd: ".." });

  let result = "";
  let errorMsg = "";

  // collect output
  py.stdout.on("data", (data) => {
    result += data.toString();
  });

  // collect errors
  py.stderr.on("data", (data) => {
    errorMsg += data.toString();
  });

  // handle spawn error
  py.on("error", (err) => {
    console.error("Spawn error:", err);
    res.status(500).json({ error: err.message });
  });

  // when process ends
  py.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: errorMsg });
    }

    res.json({ result: result.trim() });
  });
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});