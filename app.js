const express = require('express');
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, child, get } = require("firebase/database");
const fs = require('fs');

const app = express();

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9w56AhZ9Ng84Oydp3G-rSANf_wDLSai8",
  authDomain: "test-proposal-7205a.firebaseapp.com",
  databaseURL: "https://test-proposal-7205a-default-rtdb.firebaseio.com",
  projectId: "test-proposal-7205a",
  storageBucket: "test-proposal-7205a.appspot.com",
  messagingSenderId: "387552598924",
  appId: "1:387552598924:web:c7091ca2d98ac9ad6a54a9",
  measurementId: "G-G54GMYPZHV"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Endpoint to get motion status based on parameter value
app.get('/sensor/:sensor', async (req, res) => {
  const sensor = req.params.sensor;
  try {
    const snapshot = await get(child(ref(db), sensor));
    if (snapshot.exists()) {
      const sensorStatus = snapshot.val().sensorStatus;
      if (sensorStatus === 0) {
        res.status(200).json({ message: `Sensor status for ${sensor} is 0` });
      } else if (sensorStatus === 1) {
        res.status(200).json({ message: `Sensor status for ${sensor} is 1` });
      } else {
        res.status(400).json({ error: "Invalid motion status" });
      }
    } else {
      res.status(404).json({ error: "Sensor not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to serve index.html
app.get('/', (req, res) => {
  // Read index.html file
  fs.readFile('index.html', 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading index.html:", err);
      res.status(500).send('Internal server error');
      return;
    }
    // Send index.html content as response
    res.send(data);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
