const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;
  const newEntry = { name, email, message, timestamp: new Date() };

  const filePath = path.join(__dirname, 'data', 'messages.json');

  // Read existing data or use empty array if file not found
  let existingData = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath);
    existingData = fileContent.length ? JSON.parse(fileContent) : [];
  }

  // Check for uniqueness
  const isDuplicate = existingData.some(
    entry => entry.name === name || entry.email === email
  );

  if (isDuplicate) {
    return res.send('<h3 style="color:red;">Name or Email already exists. Please use unique details.</h3>');
  }

  // Save new data
  existingData.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  res.send(`<h2>Thank you ${name}, your message has been saved successfully!</h2>`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
