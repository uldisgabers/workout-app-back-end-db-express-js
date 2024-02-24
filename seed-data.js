const mysql = require("mysql2");
const DB_NAME = "workout_app_ug";

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "example",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  console.log("Connected to MySQL server");

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
  connection.query(createDatabaseQuery, (createDatabaseError, createDatabaseResults) => {
    if (createDatabaseError) {
      console.error("Error creating database:", createDatabaseError);
      connection.end();
      return;
    }

    console.log(`Database "${DB_NAME}" created or already exists`);

    // Switch to the created database
    connection.changeUser({ database: DB_NAME }, (changeUserError) => {
      if (changeUserError) {
        console.error("Error switching to database:", changeUserError);
        connection.end();
        return;
      }

      console.log(`Switched to database "${DB_NAME}"`);

      // Define the SQL query to create the first table (workouts)
      const createTableWorkouts = `
        CREATE TABLE IF NOT EXISTS workouts (
          id VARCHAR(36) PRIMARY KEY,
          workoutName VARCHAR(255) NOT NULL,
          restBetweenExercises INT NOT NULL,
          createdAt VARCHAR(255) NOT NULL
        )
      `;

      // Execute the query to create the first table
      connection.query(createTableWorkouts, (createTableError, createTableResults) => {
        if (createTableError) {
          console.error("Error creating table:", createTableError);
          connection.end();
          return;
        }

        console.log('Table "workouts" created or already exists');

        // Define the SQL query to create the second table (workout_details)
        const createTableWorkoutDetails = `
          CREATE TABLE IF NOT EXISTS workout_details (
            id VARCHAR(36) PRIMARY KEY,
            workoutId VARCHAR(36),
            muscleGroup VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            sets INT NOT NULL,
            oneSetLength INT NOT NULL,
            restLength INT NOT NULL,
            FOREIGN KEY (workoutId) REFERENCES workouts(id)
          )
        `;

        // Execute the query to create the second table
        connection.query(createTableWorkoutDetails, (createTableError, createTableResults) => {
          if (createTableError) {
            console.error("Error creating table:", createTableError);
            connection.end();
            return;
          }

          console.log('Table "workout_details" created or already exists');

          // Define the SQL query to insert data into the first table (workouts)
          const insertDataQuery = `
            INSERT INTO workouts (id, workoutName, restBetweenExercises, createdAt) VALUES
              ('0edddfcd-78c2-4981-8316-4f0ce7a6a280', 'Alfa workout', 40, '2024-02-20T22:22:09.299Z'),
              ('bd113022-7771-4b9d-9d39-51d98cd820ac', 'Beta workout', 40, '2024-02-20T22:45:12.916Z'),
              ('e2515eac-0693-4f4f-9c60-a59760617182', 'Gamma workout', 40, '2024-02-21T12:19:54.202Z'),
              ('68cee838-1062-42a8-8c67-b9c2ed2d1455', 'Tango Whiskey', 40, '2024-02-21T13:56:10.585Z')
          `;

          // Execute the query to insert data into the first table
          connection.query(insertDataQuery, (insertDataError, insertDataResults) => {
            if (insertDataError) {
              console.error("Error inserting data:", insertDataError);
              connection.end();
              return;
            }

            console.log("Data inserted or already exists for table 'workouts'");

            // Define the SQL query to insert data into the second table (workout_details)
            const insertDataWorkoutDetails = `
              INSERT INTO workout_details (id, workoutId, muscleGroup, name, sets, oneSetLength, restLength) VALUES
                ('123454f7-be5c-4313-aa9e-e83db27d9f70', '0edddfcd-78c2-4981-8316-4f0ce7a6a280', 'adductors', 'Thigh adductor', 1, 40, 20),
                ('1234a38b-1ce4-4824-a7e9-743e65ead372', '0edddfcd-78c2-4981-8316-4f0ce7a6a280', 'abdominals', 'Bottoms Up', 1, 40, 20),
                ('12341989-b7b8-491a-8ed0-f6f2f7a16e4e', '0edddfcd-78c2-4981-8316-4f0ce7a6a280', 'biceps', 'Hammer Curls', 4, 40, 20),
                ('123429c9-abe1-4678-af37-922b4979807c', '0edddfcd-78c2-4981-8316-4f0ce7a6a280', 'glutes', 'Barbell Hip Thrust', 1, 40, 20),
                ('f04f51d5-6302-42e2-889c-f09a7e2fd91a', '0edddfcd-78c2-4981-8316-4f0ce7a6a280', 'abductors', 'IT Band and Glute Stretch', 1, 40, 20),
                ('799254f7-be5c-4313-aa9e-e83db27d9f70', 'bd113022-7771-4b9d-9d39-51d98cd820ac', 'adductors', 'Thigh adductor', 1, 40, 20),
                ('8962a38b-1ce4-4824-a7e9-743e65ead372', 'bd113022-7771-4b9d-9d39-51d98cd820ac', 'abdominals', 'Bottoms Up', 1, 40, 20),
                ('d8a11989-b7b8-491a-8ed0-f6f2f7a16e4e', 'e2515eac-0693-4f4f-9c60-a59760617182', 'biceps', 'Hammer Curls', 4, 40, 20),
                ('107f29c9-abe1-4678-af37-922b4979807c', 'e2515eac-0693-4f4f-9c60-a59760617182', 'glutes', 'Barbell Hip Thrust', 1, 40, 20),
                ('2cc109c8-bc4a-4825-96cd-7c4e340a8e5c', '68cee838-1062-42a8-8c67-b9c2ed2d1455', 'abdominals', 'Landmine twist', 3, 40, 20),
                ('acb53b56-aafc-408c-9d14-069ad00b3061', '68cee838-1062-42a8-8c67-b9c2ed2d1455', 'biceps', 'Hammer Curls', 1, 40, 20)
            `;

            // Execute the query to insert data into the second table
            connection.query(insertDataWorkoutDetails, (insertDataError, insertDataResults) => {
              if (insertDataError) {
                console.error("Error inserting data:", insertDataError);
              } else {
                console.log("Data inserted or already exists for table 'workout_details'");
              }

              // Close the connection
              connection.end();
            });
          });
        });
      });
    });
  });
});
