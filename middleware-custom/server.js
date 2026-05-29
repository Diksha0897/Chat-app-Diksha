const express = require("express");

const app = express();

// Middleware 1: authentication
function authMiddleware(req, res, next) {
  const username = req.header("X-Username");

  if (username) {
    req.username = username;
  } else {
    req.username = null;
  }

  next();
}

// Middleware 2: parse JSON array body
function bodyMiddleware(req, res, next) {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    try {
      const parsed = JSON.parse(data);

      // check if array
      if (!Array.isArray(parsed)) {
        return res.status(400).send("Body must be an array");
      }

      // check all elements are strings
      const allStrings = parsed.every((item) => typeof item === "string");

      if (!allStrings) {
        return res.status(400).send("All elements must be strings");
      }

      req.body = parsed;

      next();
    } catch (error) {
      res.status(400).send("Invalid JSON");
    }
  });
}

// POST endpoint
app.post("/subjects", authMiddleware, bodyMiddleware, (req, res) => {
  let authMessage;

  if (req.username) {
    authMessage = `You are authenticated as ${req.username}.`;
  } else {
    authMessage = "You are not authenticated.";
  }

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
