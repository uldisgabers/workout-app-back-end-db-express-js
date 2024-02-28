import express from "express";
import { createPool } from "mysql2/promise";
import { connection } from "./db";
const app = express();
const port = 3001;
const cors = require("cors");

app.use(cors());

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'example',
  database: 'workout_app_ug',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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

// app.post("/workouts", async (req, res) => {
//   const { id, workoutName, restBetweenExercises, createdAt } = req.body;

//   if (!id || !workoutName || !restBetweenExercises || !createdAt) {
//     res.status(400).send("Invalid data");
//     return;
//   }

//   connection.query(
//     `
//       INSERT INTO workouts (id, workoutName, restBetweenExercises, createdAt)
//       VALUES ('${id}', '${workoutName}', '${restBetweenExercises}', '${createdAt}')
//     `,
//     (error, results) => {
//       if (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//         return;
//       }

//       res.json({ workouts: results });
//     }
//   );
// });

// app.post("/workout_details", async (req, res) => {
//   const { id, workoutId, muscleGroup, name, sets, oneSetLength, restLength } =
//     req.body;

//   if (
//     !id ||
//     !workoutId ||
//     !muscleGroup ||
//     !name ||
//     !sets ||
//     !oneSetLength ||
//     !restLength
//   ) {
//     res.status(400).send("Invalid data");
//     return;
//   }

//   connection.query(
//     `
//       INSERT INTO workout_details (id, workoutId, muscleGroup, name, sets, oneSetLength, restLength)
//       VALUES ('${id}', '${workoutId}', '${muscleGroup}', '${name}', '${sets}', '${oneSetLength}', '${restLength}')
//     `,
//     (error, results) => {
//       if (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//         return;
//       }

//       res.json({ workouts: results });
//     }
//   );
// });

app.post("/workouts", async (req, res) => {
  const { id, workoutName, details, restBetweenExercises, createdAt } = req.body;

  console.log("I get this data " + id, workoutName, details, restBetweenExercises, createdAt);

  if (!id || !workoutName || !details || !restBetweenExercises || !createdAt) {
    res.status(400).send("Invalid data");
    return;
  }

  const workoutsQuery = `
    INSERT INTO workouts (id, workoutName, restBetweenExercises, createdAt)
    VALUES (?, ?, ?, ?)
  `;

  try {
    // Insert into workouts table
    await pool.query(workoutsQuery, [id, workoutName, restBetweenExercises, createdAt]);

    // Insert into workout_details table for each detail
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

      await pool.query(
        workoutDetailsQuery,
        [detailId, id, muscleGroup, name, sets, oneSetLength, restLength]
      );
    }

    // Send a success response after all queries are complete
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  // Commit the transaction
  // await connection.commit();

  //   res.json({ success: true });
  // } catch (error) {
  //   // Rollback the transaction in case of any error
  //   await connection.rollback();

  //   res.status(500).json({ error: "Internal Server Error" });
  // } finally {
  //   // Release the connection
  //   connection.release();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
