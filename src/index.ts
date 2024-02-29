import express from "express";
import { createPool } from "mysql2/promise";
import { connection } from "./db";
const app = express();
const port = 3001;
const cors = require("cors");

app.use(cors());

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "example",
  database: "workout_app_ug",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/", async (req, res) => {
  res.json(
    "/workouts - to see all workout data ------------  /workout_details - to see all workout_details data"
  );
});

app.get("/workouts", async (req, res) => {

  connection.query("SELECT * FROM workouts", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json({ workouts: results });
  });
});

app.get("/workout_details", async (req, res) => {

  connection.query("SELECT * FROM workout_details", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json({ workout_details: results });
  });
});

app.use(express.json());

app.post("/workouts", async (req, res) => {
  const { id, workoutName, details, restBetweenExercises, createdAt } =
    req.body;

  console.log(
    "I get this data " + id,
    workoutName,
    details,
    restBetweenExercises,
    createdAt
  );

  if (!id || !workoutName || !details || !restBetweenExercises || !createdAt) {
    res.status(400).send("Invalid data");
    return;
  }

  const workoutsQuery = `
    INSERT INTO workouts (id, workoutName, restBetweenExercises, createdAt)
    VALUES (?, ?, ?, ?)
  `;

  try {

    await pool.query(workoutsQuery, [
      id,
      workoutName,
      restBetweenExercises,
      createdAt,
    ]);

    for (const detail of details) {
      const {
        id: detailId,
        muscleGroup,
        name,
        sets,
        oneSetLength,
        restLength,
      } = detail;

      const workoutDetailsQuery = `
        INSERT INTO workout_details (id, workoutId, muscleGroup, name, sets, oneSetLength, restLength)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await pool.query(workoutDetailsQuery, [
        detailId,
        id,
        muscleGroup,
        name,
        sets,
        oneSetLength,
        restLength,
      ]);
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
