const express = require("express");

const app = express();

// Built-in Express JSON middleware
app.use(express.json());

// Middleware 1: authentication
function authMiddleware(req, res, next) {
  req.username = req.header("X-Username") || null;
  next();
}

// POST endpoint
app.post("/subjects", authMiddleware, (req, res) => {
  // Validate body
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Body must be an array");
  }

  const allStrings = req.body.every((item) => typeof item === "string");

  if (!allStrings) {
    return res.status(400).send("All elements must be strings");
  }

  const authMessage = req.username
    ? `You are authenticated as ${req.username}.`
    : "You are not authenticated.";

  const count = req.body.length;

  let subjectsMessage;

  if (count === 0) {
    subjectsMessage = "You have requested information about 0 subjects.";
  } else if (count === 1) {
    subjectsMessage = `You have requested information about 1 subject: ${req.body[0]}.`;
  } else {
    subjectsMessage = `You have requested information about ${count} subjects: ${req.body.join(", ")}.`;
  }

  res.send(`${authMessage}\n\n${subjectsMessage}`);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
