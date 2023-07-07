const express = require("express");
const cors = require("cors"); // Don't forget to import the cors package.
const app = express();
const { Pool } = require("pg");

// Enable CORS for all routes
app.use(cors());

const pool = new Pool({
  user: "zacharyjones",
  host: "localhost",
  database: "zacharyjones",
  password: "",
  port: 5431,
});

app.use(express.json());

app.post("/weights", async (req, res) => {
  const { userId, date, weight } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO user_weights(user_id, date, weight) VALUES($1, $2, $3) RETURNING *",
      [userId, date, weight]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/weights/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM user_weights WHERE user_id = $1 ORDER BY date ASC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
