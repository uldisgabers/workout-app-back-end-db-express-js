import express from "express";
import { connection } from "./db";
const app = express();
const port = 3001;

app.get("/", async (req, res) => {
  res.json(
    "/workouts - to see all workout data ------------  /workout_details - to see all workout_details data"
  );
});

app.get("/workouts", async (req, res) => {
  // Execute the query to get all users
  connection.query("SELECT * FROM workouts", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Send the users as a JSON response
    res.json({ workouts: results });
  });
});

app.get("/workout_details", async (req, res) => {
  // Execute the query to get all users
  connection.query("SELECT * FROM workout_details", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Send the users as a JSON response
    res.json({ workout_details: results });
  });
});

app.use(express.json());

app.post("/workouts", async (req, res) => {
  const { id, workoutName, restBetweenExercises, createdAt } = req.body;

  if (!id || !workoutName || !restBetweenExercises || !createdAt) {
    res.status(400).send("Invalid data");
    return;
  }

  connection.query(
    `
      INSERT INTO workouts (id, workoutName, restBetweenExercises, createdAt)
      VALUES ('${id}', '${workoutName}', '${restBetweenExercises}', '${createdAt}')
    `,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json({ workouts: results });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
